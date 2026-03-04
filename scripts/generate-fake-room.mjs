/**
 * Generates Fake.glb — a procedural room with wall/floor/ceiling/window textures.
 * All 6 faces, double-sided so texture shows from both inside and outside.
 * Run: node scripts/generate-fake-room.mjs
 */

import { Document, NodeIO } from "@gltf-transform/core"
import { readFileSync } from "fs"
import sharp from "sharp"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, "..")
const MODELS = path.join(ROOT, "public", "models")

// ── Room dimensions ────────────────────────────────────────────────────────
const W = 10 * 0.7   // width  X  → 7
const H = 3.2 * 0.7  // height Y  → 2.24
const D = 8 * 0.7    // depth  Z  → 5.6
const HW = W / 2, HD = D / 2

// ── Load texture, converting webp → png for GLTF compatibility ─────────────
async function loadTexture(file) {
  const ext = path.extname(file).toLowerCase()
  if (ext === ".webp") {
    const buf = await sharp(file).png().toBuffer()
    return { data: buf, mimeType: "image/png" }
  }
  const buf = readFileSync(file)
  const mime = ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : "image/png"
  return { data: buf, mimeType: mime }
}

// ── Build a double-sided quad ──────────────────────────────────────────────
// 8 vertices: 4 front-facing + 4 back-facing (reversed winding + flipped normals)
function makeDoubleSidedQuad(p0, p1, p2, p3, nx, ny, nz) {
  // p0=top-left, p1=top-right, p2=bottom-right, p3=bottom-left
  // Front face: CCW winding,  normal = (nx, ny, nz)
  // Back face:  CW  winding,  normal = (-nx, -ny, -nz)  → same vertices, reversed
  return {
    positions: new Float32Array([
      // front (4 verts)
      ...p0, ...p1, ...p2, ...p3,
      // back  (4 verts — same positions, different winding)
      ...p0, ...p1, ...p2, ...p3,
    ]),
    normals: new Float32Array([
      // front normals
       nx,  ny,  nz,   nx,  ny,  nz,   nx,  ny,  nz,   nx,  ny,  nz,
      // back normals (flipped)
      -nx, -ny, -nz,  -nx, -ny, -nz,  -nx, -ny, -nz,  -nx, -ny, -nz,
    ]),
    uvs: new Float32Array([
      // front UVs
      0, 1,  1, 1,  1, 0,  0, 0,
      // back UVs (mirror U so texture reads correctly from inside)
      1, 1,  0, 1,  0, 0,  1, 0,
    ]),
    // front: 0,2,1  0,3,2   back: 4,5,6  4,6,7  (reversed winding)
    indices: new Uint16Array([
      0, 2, 1,   0, 3, 2,   // front
      4, 5, 6,   4, 6, 7,   // back
    ]),
  }
}

// ── 5 faces: floor, ceiling, back wall, front wall, left wall
// Right wall (smaller side, W=5.6) is left open so camera can see inside ──
const quads = {
  floor: makeDoubleSidedQuad(
    [-HW, 0,  HD], [ HW, 0,  HD],
    [ HW, 0, -HD], [-HW, 0, -HD],
    0, 1, 0
  ),
  ceiling: makeDoubleSidedQuad(
    [-HW, H, -HD], [ HW, H, -HD],
    [ HW, H,  HD], [-HW, H,  HD],
    0, -1, 0
  ),
  backWall: makeDoubleSidedQuad(
    [-HW, H, -HD], [ HW, H, -HD],
    [ HW, 0, -HD], [-HW, 0, -HD],
    0, 0, 1
  ),
  frontWall: makeDoubleSidedQuad(
    [ HW, H,  HD], [-HW, H,  HD],
    [-HW, 0,  HD], [ HW, 0,  HD],
    0, 0, -1
  ),
  leftWall: makeDoubleSidedQuad(
    [-HW, H, -HD], [-HW, H,  HD],
    [-HW, 0,  HD], [-HW, 0, -HD],
    1, 0, 0
  ),
  // rightWall omitted — smaller side (D=5.6) stays open for camera view
}

// ── Which texture each face uses ───────────────────────────────────────────
const faceTexture = {
  floor:     "ceiling",  // ceiling.jpg used as floor texture
  ceiling:   "walls",
  backWall:  "walls",
  frontWall: "walls",
  leftWall:  "walls",
}

async function main() {
  const doc = new Document()
  const buffer = doc.createBuffer()
  const scene = doc.createScene("Room")
  const io = new NodeIO()

  // Load textures
  const texDefs = {
    ceiling: path.join(MODELS, "ceiling.jpg"),  // used as floor texture
    walls:   path.join(MODELS, "walls.jpeg"),
  }

  const textures = {}
  for (const [name, file] of Object.entries(texDefs)) {
    const { data, mimeType } = await loadTexture(file)
    textures[name] = doc.createTexture(name).setImage(data).setMimeType(mimeType)
  }

  // One shared material per texture (double-sided = true)
  const materials = {}
  const matDefs = {
    ceiling: { roughness: 0.9, metalness: 0.0 },
    walls:   { roughness: 0.9, metalness: 0.0 },
  }
  for (const [name, { roughness, metalness }] of Object.entries(matDefs)) {
    materials[name] = doc.createMaterial(name)
      .setDoubleSided(true)
      .setRoughnessFactor(roughness)
      .setMetallicFactor(metalness)
      .setBaseColorTexture(textures[name])
  }

  // Build meshes
  for (const [name, quad] of Object.entries(quads)) {
    const texName = faceTexture[name]

    const posAcc  = doc.createAccessor().setType("VEC3")   .setArray(quad.positions).setBuffer(buffer)
    const normAcc = doc.createAccessor().setType("VEC3")   .setArray(quad.normals)  .setBuffer(buffer)
    const uvAcc   = doc.createAccessor().setType("VEC2")   .setArray(quad.uvs)      .setBuffer(buffer)
    const idxAcc  = doc.createAccessor().setType("SCALAR") .setArray(quad.indices)  .setBuffer(buffer)

    const prim = doc.createPrimitive()
      .setAttribute("POSITION",   posAcc)
      .setAttribute("NORMAL",     normAcc)
      .setAttribute("TEXCOORD_0", uvAcc)
      .setIndices(idxAcc)
      .setMaterial(materials[texName])

    const mesh = doc.createMesh(name).addPrimitive(prim)
    const node = doc.createNode(name).setMesh(mesh)
    scene.addChild(node)
  }

  const outPath = path.join(MODELS, "Fake.glb")
  await io.write(outPath, doc)
  console.log(`✓ Fake.glb written → ${outPath}`)
}

main().catch(err => { console.error(err); process.exit(1) })

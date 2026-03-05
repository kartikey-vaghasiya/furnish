CREATE TABLE "Vendor" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Furniture" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "model" TEXT NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "purchases" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Furniture_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Vendor_username_key" ON "Vendor"("username");

ALTER TABLE "Furniture" ADD CONSTRAINT "Furniture_vendorId_fkey"
    FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

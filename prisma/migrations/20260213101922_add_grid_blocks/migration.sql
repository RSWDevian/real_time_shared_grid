-- AlterTable
ALTER TABLE "ownership" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "grid_blocks" (
    "block_id" TEXT NOT NULL,
    "occupied" BOOLEAN NOT NULL DEFAULT false,
    "owner" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "grid_blocks_pkey" PRIMARY KEY ("block_id")
);

-- AddForeignKey
ALTER TABLE "ownership" ADD CONSTRAINT "ownership_block_id_fkey" FOREIGN KEY ("block_id") REFERENCES "grid_blocks"("block_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grid_blocks" ADD CONSTRAINT "grid_blocks_owner_fkey" FOREIGN KEY ("owner") REFERENCES "users"("email") ON DELETE SET NULL ON UPDATE CASCADE;

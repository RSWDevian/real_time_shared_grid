// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ROWS = 10;
const COLS = 10;

async function main() {
  console.log("🌱 Seeding grid_blocks...");

  // Create all grid blocks
  const blocks = [];
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      blocks.push({
        blockId: `${i}-${j}`,
        occupied: false,
        owner: null,
      });
    }
  }

  // Insert in batches to avoid large single query
  const batchSize = 1000;
  for (let i = 0; i < blocks.length; i += batchSize) {
    const batch = blocks.slice(i, i + batchSize);
    await prisma.gridBlock.createMany({
      data: batch,
      skipDuplicates: true,
    });
    console.log(`✓ Created ${Math.min(i + batchSize, blocks.length)} blocks`);
  }

  console.log(`✅ Seeded ${blocks.length} grid blocks`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
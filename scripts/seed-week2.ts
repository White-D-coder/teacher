import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const prisma = new PrismaClient();

async function main() {
  console.log('🌟 Seeding Week 2 Grand Challenge...');

  const science8 = await prisma.subject.findFirst({
    where: { name: 'Science', class: 'Class 8' }
  });

  if (!science8) {
    console.error('Science Class 8 not found');
    return;
  }

  // Shift existing chapters (5-16) to make room for Challenge at index 5
  const chaptersToShift = await prisma.chapter.findMany({
    where: { subjectId: science8.id, orderIndex: { gte: 5 } },
    orderBy: { orderIndex: 'desc' }
  });

  for (const chapter of chaptersToShift) {
    await prisma.chapter.update({
      where: { id: chapter.id },
      data: { orderIndex: chapter.orderIndex + 1 }
    });
  }

  // Create the Challenge Chapter
  const challengeText = `⭐ WEEK 2: GRAND CHALLENGE ⭐
  
1. [Easy] What are the three essential requirements for producing fire? Which one is removed when using a fire extinguisher?
2. [Easy] Define 'Ignition Temperature'. Why is it difficult to burn a heap of green leaves but dry leaves catch fire easily?
3. [Medium] Describe the process of refining petroleum and list any three products obtained from it with their specific uses.
4. [Medium] Explain the concept of 'Global Warming'. How does the combustion of fossil fuels contribute to the greenhouse effect?
5. [Hard] Analyze the impact of deforestation on the water cycle. Explain how the loss of trees can lead to both droughts and floods in the same region.`;

  const challengeChapter = await prisma.chapter.create({
    data: {
      title: 'Week 2: Grand Challenge ⭐',
      subjectId: science8.id,
      orderIndex: 5,
      writtenQuestion: challengeText
    }
  });

  console.log(`✅ Created ${challengeChapter.title} at index 5`);
  console.log('✨ Seed finished!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

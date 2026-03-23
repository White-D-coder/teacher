import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const prisma = new PrismaClient();

const SOCIAL_DATA = [
  {
    name: 'History',
    class: 'Class 9',
    chapters: [
      { title: 'The French Revolution', orderIndex: 1 },
      { title: 'Socialism in Europe and the Russian Revolution', orderIndex: 2 },
      { title: 'Nazism and the Rise of Hitler', orderIndex: 3 },
      { title: 'Forest Society and Colonialism', orderIndex: 4 },
      { title: 'Pastoralists in the Modern World', orderIndex: 5 }
    ]
  },
  {
    name: 'Geography',
    class: 'Class 9',
    chapters: [
      { title: 'India – Size and Location', orderIndex: 1 },
      { title: 'Physical Features of India', orderIndex: 2 },
      { title: 'Drainage', orderIndex: 3 },
      { title: 'Climate', orderIndex: 4 },
      { title: 'Natural Vegetation and Wildlife', orderIndex: 5 },
      { title: 'Population', orderIndex: 6 }
    ]
  },
  {
    name: 'Civics',
    class: 'Class 9',
    chapters: [
      { title: 'What is Democracy? Why Democracy?', orderIndex: 1 },
      { title: 'Constitutional Design', orderIndex: 2 },
      { title: 'Electoral Politics', orderIndex: 3 },
      { title: 'Working of Institutions', orderIndex: 4 },
      { title: 'Democratic Rights', orderIndex: 5 }
    ]
  },
  {
    name: 'Economics',
    class: 'Class 9',
    chapters: [
      { title: 'The Story of Village Palampur', orderIndex: 1 },
      { title: 'People as Resource', orderIndex: 2 },
      { title: 'Poverty as a Challenge', orderIndex: 3 },
      { title: 'Food Security in India', orderIndex: 4 }
    ]
  }
];

async function main() {
  console.log('🌍 Seeding Class 9 Social Science Curriculums...');

  for (const subjectData of SOCIAL_DATA) {
    // 1. Create or Find Subject
    const subject = await prisma.subject.upsert({
      where: {
        name_class: {
          name: subjectData.name,
          class: subjectData.class
        }
      },
      update: {},
      create: {
        name: subjectData.name,
        class: subjectData.class
      }
    });

    console.log(`\n📚 Subject: ${subject.name} (${subject.class})`);

    // 2. Clear Existing Chapters (to avoid duplicates during re-runs)
    // Note: In production you'd want to be more careful, but for seeding it's fine.
    await prisma.chapter.deleteMany({
      where: { subjectId: subject.id }
    });

    // 3. Create Chapters
    for (const ch of subjectData.chapters) {
      await prisma.chapter.create({
        data: {
          title: ch.title,
          orderIndex: ch.orderIndex,
          subjectId: subject.id,
          writtenQuestion: "1. [Easy] Summarize the most important definition or concept you learned. \n2. [Easy] List two real-life examples. \n3. [Medium] Compare two different perspectives on a topic in this chapter. \n4. [Medium] Explain how this history/geography impacts our world today. \n5. [Hard] Analyze the long-term consequences of a key event or policy described."
        }
      });
      console.log(`  ✅ Chapter: ${ch.title}`);
    }
  }

  console.log('\n🚀 Class 9 Social Science seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

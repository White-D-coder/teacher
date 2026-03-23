import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const prisma = new PrismaClient();

const CLASS_9_CHAPTERS = [
  "Matter in Our Surroundings",
  "Is Matter Around Us Pure?",
  "Atoms and Molecules",
  "Structure of the Atom",
  "The Fundamental Unit of Life",
  "Tissues",
  "Motion",
  "Force and Laws of Motion",
  "Gravitation",
  "Work and Energy",
  "Sound",
  "Improvement in Food Resources"
];

async function main() {
  console.log('🧪 Resetting and Seeding Science - Class 9 curriculum...');

  const subject = await prisma.subject.findFirst({
    where: { name: 'Science', class: 'Class 9' }
  });

  if (!subject) {
    console.error('Subject Science - Class 9 not found!');
    return;
  }

  // 1. Delete ALL existing chapters for Science Class 9
  // We need to delete associated Quizzes and Questions first
  const existingChapters = await prisma.chapter.findMany({
    where: { subjectId: subject.id },
    include: { quiz: true }
  });

  for (const ch of existingChapters) {
    if (ch.quiz) {
      await prisma.question.deleteMany({ where: { quizId: ch.quiz.id } });
      await prisma.quiz.delete({ where: { id: ch.quiz.id } });
    }
  }
  await prisma.chapter.deleteMany({ where: { subjectId: subject.id } });

  console.log('🧹 Cleaned existing (incorrect) data.');

  // 2. Create correct 12 chapters
  for (let i = 0; i < CLASS_9_CHAPTERS.length; i++) {
    await prisma.chapter.create({
      data: {
        title: CLASS_9_CHAPTERS[i],
        subjectId: subject.id,
        orderIndex: i + 1
      }
    });
    console.log(`✅ Chapter ${i+1}: ${CLASS_9_CHAPTERS[i]}`);
  }

  console.log('\n✨ Finished! Science Class 9 is now reset with the correct curriculum.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

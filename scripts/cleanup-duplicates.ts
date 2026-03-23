import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Cleaning up Duplicate Chapters...');

  const allChapters = await prisma.chapter.findMany({
    include: { lessons: true, quiz: true }
  });

  const map = new Map();

  for (const ch of allChapters) {
    const key = `${ch.subjectId}-${ch.title.toLowerCase().trim()}`;
    
    if (map.has(key)) {
      const original = map.get(key);
      console.log(`Merging duplicate: "${ch.title}" (Original ID: ${original.id}, Duplicate ID: ${ch.id})`);

      // 1. Move Lessons
      await prisma.lesson.updateMany({
        where: { chapterId: ch.id },
        data: { chapterId: original.id }
      });

      // 1.5. Move Supplements
      await prisma.supplement.updateMany({
        where: { chapterId: ch.id },
        data: { chapterId: original.id }
      });

      // 2. Handle Quizzes
      if (ch.quiz && !original.quiz) {
          // Move quiz to original if original doesn't have one
          await prisma.quiz.update({
              where: { id: ch.quiz.id },
              data: { chapterId: original.id }
          });
      } else if (ch.quiz) {
          // Delete duplicate quiz and questions
          await prisma.question.deleteMany({
              where: { quizId: ch.quiz.id }
          });
          await prisma.quiz.delete({
              where: { id: ch.quiz.id }
          });
      }

      // 3. Delete Duplicate Chapter
      try {
        await prisma.chapter.delete({
            where: { id: ch.id }
        });
      } catch (err: any) {
          console.warn(`Could not delete chapter ${ch.id}: ${err.message}`);
      }
    } else {
      map.set(key, ch);
    }
  }

  console.log('\n✨ Finished! Database is now clean and deduplicated.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

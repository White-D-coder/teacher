import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanup() {
  console.log('--- Math Class 8 Curriculum Cleanup ---');

  // 1. Find the Math Class 8 Subject
  const subject = await (prisma.subject as any).findFirst({
    where: { name: 'Math', class: 'Class 8' },
    include: {
      chapters: {
        include: {
          lessons: true
        }
      }
    }
  });

  if (!subject) {
    console.error('Subject "Math" Class "Class 8" not found.');
    return;
  }

  console.log(`Analyzing ${subject.chapters.length} chapters...`);

  let totalDeleted = 0;

  for (const chapter of subject.chapters) {
    const lessons = chapter.lessons;
    if (lessons.length > 2) {
      console.log(`Chapter: "${chapter.title}" has ${lessons.length} lessons. Cleaning up...`);
      
      // Sort lessons by ID (oldest first)
      const sortedLessons = [...lessons].sort((a, b) => a.id.localeCompare(b.id));
      
      // Delete the first N-2 lessons
      const toDeleteCount = lessons.length - 2;
      const toDelete = sortedLessons.slice(0, toDeleteCount);

      for (const lesson of toDelete) {
        console.log(`  Deleting obsolete lesson: "${lesson.title}" (${lesson.id}) and all associated UserProgress...`);
        
        // 1. Delete associated UserProgress
        await (prisma.userProgress as any).deleteMany({ where: { lessonId: lesson.id } });
        
        // 2. Delete the lesson itself
        await (prisma.lesson as any).delete({ where: { id: lesson.id } });
        totalDeleted++;
      }
    }
  }

  console.log(`--- Cleanup Summary ---`);
  console.log(`Total Obsolete Lessons Deleted: ${totalDeleted}`);
}

cleanup()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

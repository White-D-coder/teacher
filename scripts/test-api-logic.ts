import { PrismaClient } from '@prisma/client';

async function testFetch() {
  const db = new PrismaClient();
  const subjectName = 'Science';
  const targetClass = 'Class 8';
  const userId = null; // Test with null first

  try {
    console.log('Fetching subject...');
    const subject = await db.subject.findFirst({
      where: { name: subjectName, class: targetClass },
      include: {
        chapters: {
          orderBy: { orderIndex: 'asc' },
          include: {
            lessons: {
              include: {
                progress: userId ? { where: { userId } } : false as any
              }
            },
            supplements: true,
            quiz: {
              include: {
                questions: true
              }
            },
            progress: userId ? { where: { userId } } : false as any
          }
        }
      }
    });

    if (!subject) {
      console.log('Subject not found');
      return;
    }

    console.log('Found Subject:', subject.name);
    console.log('Chapters found:', subject.chapters.length);
    
    // Check if any chapter has a quiz
    const chaptersWithQuiz = subject.chapters.filter(c => c.quiz);
    console.log('Chapters with quizzes:', chaptersWithQuiz.length);
    
    if (chaptersWithQuiz.length > 0) {
        console.log('Example Quiz questions:', chaptersWithQuiz[0].quiz?.questions.length);
    }

  } catch (error: any) {
    console.error('CRASHED:', error.message);
  } finally {
    await db.$disconnect();
  }
}

testFetch();

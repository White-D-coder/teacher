import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  try {
    const subject = await prisma.subject.findFirst({
      where: { name: 'Science', class: 'Class 8' },
      include: {
        chapters: {
          include: {
            lessons: {
              include: {
                progress: false as any // This is what happens when userId is null
              }
            },
            quiz: {
                include: { questions: true }
            },
            progress: false as any
          }
        }
      }
    });
    console.log('Success:', subject ? 'Found' : 'Not found');
  } catch (e: any) {
    console.error('Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();

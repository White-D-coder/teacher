import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const prisma = new PrismaClient();

const HISTORY_VIDEOS = [
  {
    chapterTitle: 'The French Revolution',
    lessons: [
      { title: 'Intro Video 🎬', videoUrl: 'https://www.youtube.com/watch?v=ik3tXVUbiQE' },
      { title: 'Main Lesson 📽️', videoUrl: 'https://www.youtube.com/watch?v=Driqik1hr7A' }
    ]
  },
  {
    chapterTitle: 'Socialism in Europe and the Russian Revolution',
    lessons: [
      { title: 'Intro Video 🎬', videoUrl: 'https://www.youtube.com/watch?v=PPeZ8mAh5i0' },
      { title: 'Main Lesson 📽️', videoUrl: 'https://www.youtube.com/watch?v=eN36oJZURDg' }
    ]
  },
  {
    chapterTitle: 'Nazism and the Rise of Hitler',
    lessons: [
      { title: 'Intro Video 🎬', videoUrl: 'https://www.youtube.com/watch?v=goEZfKiuu0Q' },
      { title: 'Main Lesson 📽️', videoUrl: 'https://www.youtube.com/watch?v=nm-EWVKJvlE' }
    ]
  },
  {
    chapterTitle: 'Forest Society and Colonialism',
    lessons: [
      { title: 'Intro Video 🎬', videoUrl: 'https://www.youtube.com/watch?v=KiR_LN7QyF4' },
      { title: 'Main Lesson 📽️', videoUrl: 'https://www.youtube.com/watch?v=DdrWa2WtGEw' }
    ]
  },
  {
    chapterTitle: 'Pastoralists in the Modern World',
    lessons: [
      { title: 'Intro Video 🎬', videoUrl: 'https://www.youtube.com/watch?v=fis3MTGoJ14' },
      { title: 'Main Lesson 📽️', videoUrl: 'https://www.youtube.com/watch?v=gRX5JuA2HpY' }
    ]
  }
];

async function main() {
  console.log('🎬 Seeding Class 9 History Video Lessons...');

  // Find the 'History' subject for Class 9
  const subject = await prisma.subject.findFirst({
    where: { 
      name: 'History',
      class: 'Class 9'
    }
  });

  if (!subject) {
    console.error('❌ Error: History (Class 9) subject not found in database.');
    return;
  }

  for (const videoData of HISTORY_VIDEOS) {
    const chapter = await prisma.chapter.findFirst({
      where: {
        title: videoData.chapterTitle,
        subjectId: subject.id
      }
    });

    if (chapter) {
      console.log(`\n📖 Chapter: ${chapter.title}`);
      
      // Clear existing lessons for this specific chapter to avoid duplicates
      await prisma.lesson.deleteMany({
        where: { chapterId: chapter.id }
      });

      for (const lesson of videoData.lessons) {
        await prisma.lesson.create({
          data: {
            title: lesson.title,
            videoUrl: lesson.videoUrl,
            chapterId: chapter.id
          }
        });
        console.log(`  ✅ Lesson Added: ${lesson.title}`);
      }
    } else {
      console.log(`  ⚠️ Chapter NOT FOUND: ${videoData.chapterTitle}`);
    }
  }

  console.log('\n🚀 History videos seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

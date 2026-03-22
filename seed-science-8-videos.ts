import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const videoData = [
  { intro: "https://www.youtube.com/watch?v=J_cYceNpptY&t=226s", main: "https://www.youtube.com/watch?v=oD5tSwKfueo" }, // Ch 1
  { intro: "https://www.youtube.com/watch?v=3wpxY7iAbOE&t=347s", main: "https://www.youtube.com/watch?v=USlcEAJ1qe0" }, // Ch 2
  { intro: "https://www.youtube.com/watch?v=_KLkno--U8Q", main: "https://www.youtube.com/watch?v=gza1p6pD02E" }, // Ch 3
  { intro: "https://www.youtube.com/watch?v=2epYmlQeARM", main: "https://www.youtube.com/watch?v=vyjnmYs-OKU" }, // Ch 4
  { intro: "https://www.youtube.com/watch?v=33nxAgnu2Go", main: "https://www.youtube.com/watch?v=XC0LXdIRwrc" }, // Ch 5
  { intro: "https://www.youtube.com/watch?v=twC6sGGTBD8", main: "https://www.youtube.com/watch?v=W6HeHHyHEok" }, // Ch 6
  { intro: "https://www.youtube.com/watch?v=Nw2yHKxrj7o", main: "https://www.youtube.com/watch?v=jwPAD5mCoG0" }, // Ch 7
  { intro: "https://www.youtube.com/watch?v=30KW69TViHI&t=10s", main: "https://www.youtube.com/watch?v=1mk0DJPawUE" }, // Ch 8
  { intro: "https://www.youtube.com/watch?v=2jTIOy8XwIQ", main: "https://www.youtube.com/watch?v=znuQdbj8Iv8" }, // Ch 9
  { intro: "https://www.youtube.com/watch?v=kX45QwDWYFc", main: "https://www.youtube.com/watch?v=N3Poewhw2wg" }, // Ch 10
  { intro: "https://www.youtube.com/watch?v=b05uHcyK-Xw", main: "https://www.youtube.com/watch?v=R0h8aX2yWhg" }, // Ch 11
  { intro: "https://www.youtube.com/watch?v=bB-h93YiYNg", main: "https://www.youtube.com/watch?v=6QDUv19mH70" }, // Ch 12
  { intro: "https://www.youtube.com/watch?v=oisfZckPX8Q", main: "https://www.youtube.com/watch?v=P_q7-2gkIjQ" }, // Ch 13
];

async function main() {
  try {
    const subject = await prisma.subject.findFirst({
      where: { name: "Science", class: "Class 8" },
      include: { chapters: { orderBy: { orderIndex: 'asc' } } }
    });

    if (!subject) {
      console.log("Subject not found!");
      return;
    }

    console.log(`Updating ${videoData.length} chapters...`);

    for (let i = 0; i < videoData.length; i++) {
      const chapter = subject.chapters[i];
      if (!chapter) continue;

      const data = videoData[i];
      
      // Clear existing lessons for this chapter
      await prisma.lesson.deleteMany({ where: { chapterId: chapter.id } });

      // Create Intro
      await prisma.lesson.create({
        data: {
          title: "Introduction",
          videoUrl: data.intro,
          chapterId: chapter.id
        }
      });

      // Create Main
      await prisma.lesson.create({
        data: {
          title: "Main Lesson",
          videoUrl: data.main,
          chapterId: chapter.id
        }
      });

      console.log(`Updated Ch ${i + 1}: ${chapter.title}`);
    }

    console.log("All science class 8 videos updated successfully!");

  } catch (error) {
    console.error("Error seeding videos:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

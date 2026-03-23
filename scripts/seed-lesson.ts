import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const subject = await prisma.subject.findFirst({
      where: { name: "Science", class: "Class 8" }
    });

    if (!subject) {
      console.log("Science Class 8 not found!");
      return;
    }

    const chapter = await prisma.chapter.findFirst({
      where: { subjectId: subject.id, title: "Crop Production and Management" }
    });

    if (!chapter) {
      console.log("Chapter 1 not found!");
      return;
    }

    // Clear existing lessons for this chapter to avoid duplicates during test
    await prisma.lesson.deleteMany({
      where: { chapterId: chapter.id }
    });

    // Create Intro Video
    await prisma.lesson.create({
      data: {
        title: "Intro: What are Crops?",
        videoUrl: "https://www.youtube.com/watch?v=J_cYceNpptY",
        chapterId: chapter.id
      }
    });

    // Create Main Video
    await prisma.lesson.create({
      data: {
        title: "Main: Agricultural Practices",
        videoUrl: "https://www.youtube.com/watch?v=J_cYceNpptY&t=223s",
        chapterId: chapter.id
      }
    });

    console.log("Successfully seeded Intro and Main videos for Chapter 1!");

  } catch (error) {
    console.error("Error seeding dual lessons:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

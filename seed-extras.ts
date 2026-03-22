import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const extraChapters = [
  "Cell – Structure and Functions",
  "Stars and the Solar System",
  "Pollution of Air and Water"
];

const supplementsData = [
  { chapterTitle: "Crop Production and Management", suppTitle: "Advanced Agricultural Methods", link: "https://en.wikipedia.org/wiki/Agriculture" },
  { chapterTitle: "Microorganisms: Friend and Foe", suppTitle: "Understanding Viruses vs Bacteria", link: "https://en.wikipedia.org/wiki/Microorganism" },
  { chapterTitle: "Force and Pressure", suppTitle: "Newton's Laws Reference", link: "https://en.wikipedia.org/wiki/Force" },
  { chapterTitle: "Light", suppTitle: "Optics Simulator", link: "https://en.wikipedia.org/wiki/Optics" },
];

async function main() {
  console.log("Seeding Extras & Supplements...");
  try {
    const className = "Class 8";
    const subjectName = "Science";

    let subject = await prisma.subject.findFirst({
      where: { name: subjectName, class: className }
    });

    if (!subject) {
      console.log("Science Class 8 not found!");
      return;
    }

    // Add missing chapters to the end
    let currentChapterCount = await prisma.chapter.count({ where: { subjectId: subject.id } });
    
    for (const title of extraChapters) {
      const existing = await prisma.chapter.findFirst({ where: { subjectId: subject.id, title: title }});
      if (!existing) {
        await prisma.chapter.create({
          data: {
            title: title,
            orderIndex: currentChapterCount + 1,
            subjectId: subject.id
          }
        });
        currentChapterCount++;
        console.log(`Added extra chapter: ${title}`);
      }
    }

    // Add supplements
    for (const suppInfo of supplementsData) {
      const chapter = await prisma.chapter.findFirst({ where: { subjectId: subject.id, title: suppInfo.chapterTitle }});
      if (chapter) {
        // Check if supplement already exists
        const existingSupp = await prisma.supplement.findFirst({ where: { chapterId: chapter.id, title: suppInfo.suppTitle }});
        if (!existingSupp) {
          await prisma.supplement.create({
            data: {
              title: suppInfo.suppTitle,
              link: suppInfo.link,
              type: "pdf",
              chapterId: chapter.id
            }
          });
          console.log(`Added Supplement: ${suppInfo.suppTitle} to ${chapter.title}`);
        }
      }
    }

  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

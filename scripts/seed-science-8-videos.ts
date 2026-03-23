import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const videoData = [
  { 
    intro: "https://www.youtube.com/watch?v=J_cYceNpptY&t=226s", 
    main: "https://www.youtube.com/watch?v=oD5tSwKfueo",
    supplements: [{ title: "Nitrogen Fixation 🔬", link: "https://en.wikipedia.org/wiki/Nitrogen_fixation" }]
  },
  { 
    intro: "https://www.youtube.com/watch?v=3wpxY7iAbOE&t=347s", 
    main: "https://www.youtube.com/watch?v=USlcEAJ1qe0",
    supplements: [{ title: "The Flu Virus 🦠", link: "https://www.cdc.gov/flu/index.htm" }]
  },
  { 
    intro: "https://www.youtube.com/watch?v=_KLkno--U8Q", 
    main: "https://www.youtube.com/watch?v=gza1p6pD02E",
    supplements: [{ title: "Renewable Energy ☀️", link: "https://en.wikipedia.org/wiki/Renewable_energy" }]
  },
  { 
    intro: "https://www.youtube.com/watch?v=2epYmlQeARM", 
    main: "https://www.youtube.com/watch?v=vyjnmYs-OKU",
    supplements: [{ title: "Fire Safety 🚒", link: "https://en.wikipedia.org/wiki/Fire_safety" }]
  },
  { 
    intro: "https://www.youtube.com/watch?v=33nxAgnu2Go", 
    main: "https://www.youtube.com/watch?v=XC0LXdIRwrc",
    supplements: [{ title: "Endangered Animals 🐼", link: "https://www.worldwildlife.org/" }]
  },
  { 
    intro: "https://www.youtube.com/watch?v=twC6sGGTBD8", 
    main: "https://www.youtube.com/watch?v=W6HeHHyHEok",
    supplements: [{ title: "Cloning Facts 🐑", link: "https://en.wikipedia.org/wiki/Cloning" }]
  },
  { 
    intro: "https://www.youtube.com/watch?v=Nw2yHKxrj7o", 
    main: "https://www.youtube.com/watch?v=jwPAD5mCoG0",
    supplements: [{ title: "Growth Hormones 🧬", link: "https://en.wikipedia.org/wiki/Growth_hormone" }]
  },
  { 
    intro: "https://www.youtube.com/watch?v=30KW69TViHI&t=10s", 
    main: "https://www.youtube.com/watch?v=1mk0DJPawUE",
    supplements: [{ title: "NASA Rocketry 🚀", link: "https://www.nasa.gov/audience/forstudents/5-8/features/nasa-knows/what-is-a-rocket-58.html" }]
  },
  { 
    intro: "https://www.youtube.com/watch?v=2jTIOy8XwIQ", 
    main: "https://www.youtube.com/watch?v=znuQdbj8Iv8",
    supplements: [{ title: "Reducing Friction 🛼", link: "https://en.wikipedia.org/wiki/Friction#Reduction" }]
  },
  { 
    intro: "https://www.youtube.com/watch?v=kX45QwDWYFc", 
    main: "https://www.youtube.com/watch?v=N3Poewhw2wg",
    supplements: [{ title: "Ultrasonic Sound 🦇", link: "https://en.wikipedia.org/wiki/Ultrasound" }]
  },
  { 
    intro: "https://www.youtube.com/watch?v=b05uHcyK-Xw", 
    main: "https://www.youtube.com/watch?v=R0h8aX2yWhg",
    supplements: [{ title: "Electroplating 🏆", link: "https://en.wikipedia.org/wiki/Electroplating" }]
  },
  { 
    intro: "https://www.youtube.com/watch?v=bB-h93YiYNg", 
    main: "https://www.youtube.com/watch?v=6QDUv19mH70",
    supplements: [{ title: "Earthquake Tips 🏚️", link: "https://en.wikipedia.org/wiki/Earthquake_preparedness" }]
  },
  { 
    intro: "https://www.youtube.com/watch?v=oisfZckPX8Q", 
    main: "https://www.youtube.com/watch?v=P_q7-2gkIjQ",
    supplements: [{ title: "Rainbow Science 🌈", link: "https://en.wikipedia.org/wiki/Rainbow" }]
  },
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

    console.log(`Updating ${videoData.length} chapters with supplements...`);

    for (let i = 0; i < videoData.length; i++) {
      const chapter = subject.chapters[i];
      if (!chapter) continue;

      const data = videoData[i];
      
      // Clear existing progress, lessons & supplements for this chapter
      const lessonIds = (await prisma.lesson.findMany({ where: { chapterId: chapter.id } })).map(l => l.id);
      await prisma.userProgress.deleteMany({ where: { lessonId: { in: lessonIds } } });
      await prisma.chapterProgress.deleteMany({ where: { chapterId: chapter.id } });
      await prisma.lesson.deleteMany({ where: { chapterId: chapter.id } });
      await prisma.supplement.deleteMany({ where: { chapterId: chapter.id } });

      // Create Lessons
      await prisma.lesson.createMany({
        data: [
          { title: "Introduction", videoUrl: data.intro, chapterId: chapter.id },
          { title: "Main Lesson", videoUrl: data.main, chapterId: chapter.id }
        ]
      });

      // Create Supplements
      if (data.supplements) {
        await prisma.supplement.createMany({
          data: data.supplements.map(s => ({
            ...s,
            chapterId: chapter.id,
            type: "topic"
          }))
        });
      }

      console.log(`Updated Ch ${i + 1}: ${chapter.title}`);
    }

    console.log("All science class 8 topics and videos updated successfully!");

  } catch (error) {
    console.error("Error seeding videos:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

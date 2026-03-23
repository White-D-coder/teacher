import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const math8Chapters = [
  { 
    title: "Rational Numbers", 
    order: 1, 
    intro: "https://www.youtube.com/watch?v=Y1ehlNfWvLE", 
    main: "https://www.youtube.com/watch?v=877YmPOZxhU",
    supp: "Number Systems 🌌", 
    link: "https://www.youtube.com/watch?v=5VnZ5mJz7vE" 
  },
  { 
    title: "Linear Equations in One Variable", 
    order: 2, 
    intro: "https://www.youtube.com/watch?v=eBZ8o7ShXPU", 
    main: "https://www.youtube.com/watch?v=FdS7KIVfks0",
    supp: "Algebraic Puzzles 🧩", 
    link: "https://www.youtube.com/watch?v=3wpxY7iAbOE" 
  },
  { 
    title: "Understanding Quadrilaterals", 
    order: 3, 
    intro: "https://www.youtube.com/watch?v=jk0jeBh4aOY", 
    main: "https://www.youtube.com/watch?v=YZAFXjIVhrE",
    supp: "Shapes in Architecture 🏛️", 
    link: "https://www.youtube.com/watch?v=_KLkno--U8Q" 
  },
  { 
    title: "Data Handling", 
    order: 4, 
    intro: "https://www.youtube.com/watch?v=iOzIqkvGFQE", 
    main: "https://www.youtube.com/watch?v=01nxKH9PNIs",
    supp: "Probability Games 🎲", 
    link: "https://www.youtube.com/watch?v=33nxAgnu2Go" 
  },
  { 
    title: "Squares and Square Roots", 
    order: 5, 
    intro: "https://www.youtube.com/watch?v=36rGUSE_OJE", 
    main: "https://www.youtube.com/watch?v=rmC9FD2rg0g",
    supp: "Pythagorean Triples 📐", 
    link: "https://www.youtube.com/watch?v=twC6sGGTBD8" 
  },
  { 
    title: "Cubes and Cube Roots", 
    order: 6, 
    intro: "https://www.youtube.com/watch?v=zGersE6vyrs", 
    main: "https://www.youtube.com/watch?v=Dh7EDs7CkqI",
    supp: "3D Volumes 🧊", 
    link: "https://www.youtube.com/watch?v=Nw2yHKxrj7o" 
  },
  { 
    title: "Comparing Quantities", 
    order: 7, 
    intro: "https://www.youtube.com/watch?v=uVWcIB6oxBs", 
    main: "https://www.youtube.com/watch?v=Mpy855ufL1E",
    supp: "Smart Investing 💰", 
    link: "https://www.youtube.com/watch?v=J_cYceNpptY" 
  },
  { 
    title: "Algebraic Expressions and Identities", 
    order: 8, 
    intro: "https://www.youtube.com/watch?v=b0Wtywf_3MY", 
    main: "https://www.youtube.com/watch?v=_KW5S1s6ZqQ",
    supp: "Polynomial Power 🚀", 
    link: "https://www.youtube.com/watch?v=3wpxY7iAbOE" 
  },
  { 
    title: "Mensuration", 
    order: 9, 
    intro: "https://www.youtube.com/watch?v=Yqqj_ue3f5M", 
    main: "https://www.youtube.com/watch?v=L3Wzru4PC0c",
    supp: "Volume Magic ✨", 
    link: "https://www.youtube.com/watch?v=2epYmlQeARM" 
  },
  { 
    title: "Exponents and Powers", 
    order: 10, 
    intro: "https://www.youtube.com/watch?v=648KYk-NQec", 
    main: "https://www.youtube.com/watch?v=VIo-8mKkYTI",
    supp: "Scientific Notation 🔬", 
    link: "https://www.youtube.com/watch?v=33nxAgnu2Go" 
  },
  { 
    title: "Direct and Inverse Proportions", 
    order: 11, 
    intro: "https://www.youtube.com/watch?v=6qRf9GZS5Yc", 
    main: "https://www.youtube.com/watch?v=WXofirzy1BA",
    supp: "Speed & Time 🏎️", 
    link: "https://www.youtube.com/watch?v=twC6sGGTBD8" 
  },
  { 
    title: "Factorisation", 
    order: 12, 
    intro: "https://www.youtube.com/watch?v=uK1i6IzOhAA", 
    main: "https://www.youtube.com/watch?v=tX53XTvKheA",
    supp: "Dividing Polynomials ➗", 
    link: "https://www.youtube.com/watch?v=Nw2yHKxrj7o" 
  },
  { 
    title: "Introduction to Graphs", 
    order: 13, 
    intro: "https://www.youtube.com/watch?v=VdL-5VNDFpI", 
    main: "https://www.youtube.com/watch?v=vSDZAMsIaZI",
    supp: "Coordinate Geometry 📍", 
    link: "https://www.youtube.com/watch?v=J_cYceNpptY" 
  }
];

async function main() {
  console.log('Starting seed: Math Class 8 (Updated Videos)');

  // 1. Ensure Subject exists
  let subject = await prisma.subject.findFirst({
    where: { name: "Math", class: "Class 8" }
  });

  if (!subject) {
    subject = await prisma.subject.create({
      data: { name: "Math", class: "Class 8" }
    });
    console.log('Created Subject: Math (Class 8)');
  }

  // 2. Clear existing Chapters, Lessons, and Supplements for this Subject to avoid duplicates
  const existingChapters = await prisma.chapter.findMany({ where: { subjectId: subject.id } });
  const chapterIds = existingChapters.map(c => c.id);

  await prisma.lesson.deleteMany({ where: { chapterId: { in: chapterIds } } });
  await prisma.supplement.deleteMany({ where: { chapterId: { in: chapterIds } } });
  await prisma.chapter.deleteMany({ where: { subjectId: subject.id } });

  for (const ch of math8Chapters) {
    const chapter = await prisma.chapter.create({
      data: {
        title: ch.title,
        orderIndex: ch.order,
        subjectId: subject.id,
        lessons: {
          create: [
            { title: "Introduction", videoUrl: ch.intro },
            { title: "Main Lesson", videoUrl: ch.main }
          ]
        },
        supplements: {
          create: [
            { title: ch.supp, link: ch.link, type: "topic" }
          ]
        }
      }
    });
    console.log(`Created Ch ${ch.order}: ${chapter.title}`);
  }

  console.log('Seed finished: Math Class 8');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

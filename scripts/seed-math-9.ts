import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const math9Chapters = [
  { 
    title: "Number Systems", 
    order: 1, 
    video: "https://www.youtube.com/watch?v=KBBIuIR-vd4",
    supp: "Irrational Proofs ♾️", 
    link: "https://www.youtube.com/watch?v=KBBIuIR-vd4" 
  },
  { 
    title: "Polynomials", 
    order: 2, 
    video: "https://www.youtube.com/live/WSOGW0GzClo",
    supp: "Remainder Theorem 🧩", 
    link: "https://www.youtube.com/live/WSOGW0GzClo" 
  },
  { 
    title: "Coordinate Geometry", 
    order: 3, 
    video: "https://www.youtube.com/watch?v=iDx3fP_3gTs",
    supp: "Linear Graphs 📈", 
    link: "https://www.youtube.com/watch?v=iDx3fP_3gTs" 
  },
  { 
    title: "Linear Equations in Two Variables", 
    order: 4, 
    video: "https://www.youtube.com/watch?v=WgwGkAxG1OM",
    supp: "Simultaneous Equations ⚖️", 
    link: "https://www.youtube.com/watch?v=WgwGkAxG1OM" 
  },
  { 
    title: "Introduction to Euclid’s Geometry", 
    order: 5, 
    video: "https://www.youtube.com/watch?v=mxeXcTjQiuM",
    supp: "Non-Euclidean Worlds 🌍", 
    link: "https://www.youtube.com/watch?v=mxeXcTjQiuM" 
  },
  { 
    title: "Lines and Angles", 
    order: 6, 
    video: "https://www.youtube.com/watch?v=42u_1PKQ1gM",
    supp: "Parallel Universe 🌉", 
    link: "https://www.youtube.com/watch?v=42u_1PKQ1gM" 
  },
  { 
    title: "Triangles", 
    order: 7, 
    video: "https://www.youtube.com/watch?v=FnVgE5IF9jc",
    supp: "Congruence Master 📐", 
    link: "https://www.youtube.com/watch?v=FnVgE5IF9jc" 
  },
  { 
    title: "Quadrilaterals", 
    order: 8, 
    video: "https://www.youtube.com/watch?v=_2kf1Xh15CU",
    supp: "Parallelogram Logic 💎", 
    link: "https://www.youtube.com/watch?v=_2kf1Xh15CU" 
  },
  { 
    title: "Circles", 
    order: 9, 
    video: "https://www.youtube.com/watch?v=MHrFK1e4nQA",
    supp: "Chord Theorems ⭕", 
    link: "https://www.youtube.com/watch?v=MHrFK1e4nQA" 
  },
  { 
    title: "Heron’s Formula", 
    order: 10, 
    video: "https://www.youtube.com/watch?v=TXVDm3VpxbM",
    supp: "Area of Any Triangle 📐", 
    link: "https://www.youtube.com/watch?v=TXVDm3VpxbM" 
  },
  { 
    title: "Surface Areas and Volumes", 
    order: 11, 
    video: "https://www.youtube.com/watch?v=eCGpJVYMJsw",
    supp: "Calculus Preview 🌊", 
    link: "https://www.youtube.com/watch?v=eCGpJVYMJsw" 
  },
  { 
    title: "Statistics", 
    order: 12, 
    video: "https://www.youtube.com/watch?v=3jVwXMl6-yU",
    supp: "Data Science 📊", 
    link: "https://www.youtube.com/watch?v=3jVwXMl6-yU" 
  },
  { 
    title: "Probability", 
    order: 13, 
    video: "https://www.youtube.com/watch?v=u1A7OvCJgIM",
    supp: "Bayesian Logic 🎲", 
    link: "https://www.youtube.com/watch?v=u1A7OvCJgIM" 
  }
];

async function main() {
  console.log('Starting seed: Math Class 9');

  // 1. Ensure Subject exists
  let subject = await prisma.subject.findFirst({
    where: { name: "Math", class: "Class 9" }
  });

  if (!subject) {
    subject = await prisma.subject.create({
      data: { name: "Math", class: "Class 9" }
    });
    console.log('Created Subject: Math (Class 9)');
  }

  // 2. Clear existing Chapters for this Subject
  const existingChapters = await prisma.chapter.findMany({ where: { subjectId: subject.id } });
  const chapterIds = existingChapters.map(c => c.id);

  await prisma.lesson.deleteMany({ where: { chapterId: { in: chapterIds } } });
  await prisma.supplement.deleteMany({ where: { chapterId: { in: chapterIds } } });
  await prisma.chapter.deleteMany({ where: { subjectId: subject.id } });

  for (const ch of math9Chapters) {
    const chapter = await prisma.chapter.create({
      data: {
        title: ch.title,
        orderIndex: ch.order,
        subjectId: subject.id,
        lessons: {
          create: [
            { title: "Full Chapter Lesson", videoUrl: ch.video }
          ]
        },
        supplements: {
          create: [
            { title: ch.supp, link: ch.link, type: "topic" }
          ]
        }
      }
    });
    console.log(`Created Class 9 Ch ${ch.order}: ${chapter.title}`);
  }

  console.log('Seed finished: Math Class 9');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

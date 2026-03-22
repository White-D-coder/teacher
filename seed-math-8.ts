import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const math8Chapters = [
  { title: "Rational Numbers", order: 1, supp: "Number Systems 🌌", link: "https://www.youtube.com/watch?v=5VnZ5mJz7vE" },
  { title: "Linear Equations in One Variable", order: 2, supp: "Algebraic Puzzles 🧩", link: "https://www.youtube.com/watch?v=3wpxY7iAbOE" },
  { title: "Understanding Quadrilaterals", order: 3, supp: "Shapes in Architecture 🏛️", link: "https://www.youtube.com/watch?v=_KLkno--U8Q" },
  { title: "Practical Geometry", order: 4, supp: "Compass Techniques 📏", link: "https://www.youtube.com/watch?v=2epYmlQeARM" },
  { title: "Data Handling", order: 5, supp: "Probability Games 🎲", link: "https://www.youtube.com/watch?v=33nxAgnu2Go" },
  { title: "Squares and Square Roots", order: 6, supp: "Pythagorean Triples 📐", link: "https://www.youtube.com/watch?v=twC6sGGTBD8" },
  { title: "Cubes and Cube Roots", order: 7, supp: "3D Volumes 🧊", link: "https://www.youtube.com/watch?v=Nw2yHKxrj7o" },
  { title: "Comparing Quantities", order: 8, supp: "Smart Investing 💰", link: "https://www.youtube.com/watch?v=J_cYceNpptY" },
  { title: "Algebraic Expressions and Identities", order: 9, supp: "Polynomial Power 🚀", link: "https://www.youtube.com/watch?v=3wpxY7iAbOE" },
  { title: "Visualising Solid Shapes", order: 10, supp: "Euler's Formula 🕸️", link: "https://www.youtube.com/watch?v=_KLkno--U8Q" },
  { title: "Mensuration", order: 11, supp: "Volume Magic ✨", link: "https://www.youtube.com/watch?v=2epYmlQeARM" },
  { title: "Exponents and Powers", order: 12, supp: "Scientific Notation 🔬", link: "https://www.youtube.com/watch?v=33nxAgnu2Go" },
  { title: "Direct and Inverse Proportions", order: 13, supp: "Speed & Time 🏎️", link: "https://www.youtube.com/watch?v=twC6sGGTBD8" },
  { title: "Factorisation", order: 14, supp: "Dividing Polynomials ➗", link: "https://www.youtube.com/watch?v=Nw2yHKxrj7o" },
  { title: "Introduction to Graphs", order: 15, supp: "Coordinate Geometry 📍", link: "https://www.youtube.com/watch?v=J_cYceNpptY" },
  { title: "Playing with Numbers", order: 16, supp: "Cryptarithms 🗝️", link: "https://www.youtube.com/watch?v=3wpxY7iAbOE" }
];

async function main() {
  console.log('Starting seed: Math Class 8');

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

  // 2. Clear existing Chapters for this Subject to avoid duplicates
  await prisma.chapter.deleteMany({ where: { subjectId: subject.id } });

  for (const ch of math8Chapters) {
    const chapter = await prisma.chapter.create({
      data: {
        title: ch.title,
        orderIndex: ch.order,
        subjectId: subject.id,
        lessons: {
          create: [
            { title: "Introduction", videoUrl: "https://www.youtube.com/watch?v=J_cYceNpptY" },
            { title: "Main Lesson", videoUrl: "https://www.youtube.com/watch?v=oD5tSwKfueo" }
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

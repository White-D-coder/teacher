import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const prisma = new PrismaClient();

const WRITTEN_PRACTICE_QUESTIONS: { [key: string]: string } = {
  // Science Class 8
  "Crop Production and Management": "Explain the difference between Manure and Fertilizers. Also, briefly describe any two methods of irrigation that conserve water.",
  "Microorganisms: Friend and Foe": "Define Fermentation. How is yeast helpful in the baking industry? List three diseases caused by viruses in humans.",
  "Coal and Petroleum": "What is Carbonisation? Why is petroleum called 'Black Gold'? List three constituents of petroleum and their uses.",
  "Combustion and Flame": "Draw a labeled diagram of a candle flame. Explain why the innermost zone is the least hot.",
  "Conservation of Plants and Animals": "What is the difference between a Wildlife Sanctuary and a National Park? Define Endemic species with an example.",
  "Reproduction in Animals": "Explain the process of fertilization in humans. What is the difference between internal and external fertilization?",
  "Reaching the Age of Adolescence": "What are endocrine glands? List any three hormones and their functions in the human body during puberty.",
  "Force and Pressure": "Define Pressure. Why do shoulder bags have broad straps? Explain how a liquid exerts pressure on the walls of a container.",
  "Friction": "Explain why friction is called a 'necessary evil'. Give two examples where friction is useful and two where it is harmful.",
  "Sound": "How is sound produced? Explain the function of the human ear with a simple diagram description.",
  "Chemical Effects of Electric Current": "What is Electroplating? Describe an experiment to show the chemical effect of electric current using copper sulphate solution.",
  "Some Natural Phenomena": "Explain the process of lightning. What precautions should be taken during a thunderstorm?",
  "Light": "State the laws of reflection. Draw a ray diagram to show the formation of an image by a plane mirror.",
  "Cell – Structure and Functions": "Draw a neat labeled diagram of a plant cell. Mention the functions of the Nucleus and Chloroplasts.",
  "Stars and the Solar System": "What are Constellations? Name any two. Why is Venus called the evening star?",
  "Pollution of Air and Water": "What is the Greenhouse Effect? List three ways to reduce air pollution in your city.",

  // Math Class 8
  "Rational Numbers": "Verify the distributive property of multiplication over addition for rational numbers: a(b + c) = ab + ac, using a=1/2, b=1/3, c=1/4.",
  "Linear Equations in One Variable": "Solve the equation: 3x + 5 = 2x + 10. Also, explain the steps you took to isolate the variable x.",
  "Understanding Quadrilaterals": "Define a Parallelogram. List its key properties regarding opposite sides and opposite angles.",
  "Data Handling": "What is a Pie Chart? If a student spends 6 hours in school, what would be the central angle for 'School' in a 24-hour daily routine pie chart?",
  "Squares and Square Roots": "Find the square root of 729 using the long division method. Show all your steps clearly.",
  "Cubes and Cube Roots": "Explain the prime factorization method to find the cube root of 512.",
  "Comparing Quantities": "A shopkeeper bought a shirt for ₹500 and sold it for ₹600. Calculate the profit percentage.",
  "Algebraic Expressions and Identities": "Expand (2x + 3y)² using the identity (a + b)² = a² + 2ab + b².",
  "Mensuration": "Find the area of a trapezium whose parallel sides are 10 cm and 12 cm, and the distance between them is 8 cm.",
  "Exponents and Powers": "Simplify: (2⁵ ÷ 2⁸) × 2⁻⁵ and express the result as a power with a positive exponent.",
  "Direct and Inverse Proportions": "If 15 workers can build a wall in 48 hours, how many workers will be required to do the same work in 30 hours?",
  "Factorisation": "Factorise the expression: x² + 5x + 6 using the splitting the middle term method.",
  "Introduction to Graphs": "Plot the points A(2, 3), B(5, 3), and C(5, 5) on a graph. What shape is formed if you join them in order?",

  // Science Class 9
  "Matter in Our Surroundings": "Explain the process of sublimation with an example. Why do we see water droplets on the outer surface of a glass containing ice-cold water?",
  "Is Matter Around Us Pure": "Distinguish between a homogeneous and a heterogeneous mixture with examples. What is Tyndall Effect?",
  "Atoms and Molecules": "State the Law of Constant Proportions. Calculate the molecular mass of H₂O and HNO₃.",
  "Structure of the Atom": "Describe Rutherford's Alpha-particle scattering experiment. What were its two main observations?",
  "The Fundamental Unit of Life": "Why is the Plasma Membrane called a selectively permeable membrane? Mention the function of Mitochondria.",
  "Tissues": "Differentiate between Parenchyma, Collenchyma, and Sclerenchyma tissues based on their cell wall structure.",
  "Motion": "Distinguish between distance and displacement. Derive the equation of motion: v = u + at.",
  "Force and Laws of Motion": "State Newton's Second Law of Motion. Prove that F = ma.",
  "Gravitation": "State the Universal Law of Gravitation. What is the value of 'g' on the surface of the Earth?",
  "Work and Energy": "Define 1 Joule of work. What is the Law of Conservation of Energy?",
  "Sound (Class 9)": "Explain the working of SONAR. What is the range of hearing for humans?",
  "Improvement in Food Resources": "What are macro-nutrients and why are they called so? List three methods of irrigation used in India."
};

async function main() {
  console.log('📝 Seeding REAL Written Practice Questions...');

  const allChapters = await prisma.chapter.findMany();

  for (const chapter of allChapters) {
    const question = WRITTEN_PRACTICE_QUESTIONS[chapter.title];
    if (question) {
      await prisma.chapter.update({
        where: { id: chapter.id },
        data: { writtenQuestion: question }
      });
      console.log(`✅ ${chapter.title}: Written Question Added`);
    } else {
      // Default generic question for chapters not in the map
      await prisma.chapter.update({
        where: { id: chapter.id },
        data: { writtenQuestion: `Write a short summary of the key concepts you learned in ${chapter.title} and explain how they relate to everyday life.` }
      });
      console.log(`⚠️ ${chapter.title}: Generic Question Added`);
    }
  }

  console.log('\n✨ Finished! All chapters now have authentic written practice tasks.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

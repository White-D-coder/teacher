import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const REAL_QUESTIONS: { [key: string]: any[] } = {
  "Crop Production and Management": [
    { text: "Which of the following is a Kharif crop?", options: ["Wheat", "Mustard", "Soyabean", "Gram"], answer: 2, explanation: "Soyabean is a Kharif crop grown during the monsoon season (June to September)." },
    { text: "The process of loosening and turning of the soil is called:", options: ["Irrigation", "Tilling", "Harvesting", "Manuring"], answer: 1, explanation: "Tilling (or ploughing) helps roots penetrate deep and breathe easily." },
    { text: "Which tool is traditionally used for sowing seeds?", options: ["Plough", "Hoe", "Seed Drill", "Funnel-shaped tube"], answer: 3, explanation: "Traditionally, seeds were filled into a funnel and passed through tubes." },
    { text: "Organic substance obtained from decomposition of plant/animal waste is:", options: ["Fertilizer", "Manure", "Pesticide", "Urea"], answer: 1, explanation: "Manure is organic and improves soil texture and water-holding capacity." },
    { text: "Rhizobium bacteria found in root nodules of leguminous plants help in:", options: ["Water absorption", "Nitrogen fixation", "Photosynthesis", "Digestion"], answer: 1, explanation: "Rhizobium fixes atmospheric nitrogen into usable forms for plants." }
  ],
  "Microorganisms: Friend and Foe": [
    { text: "Which microorganism is used in the production of alcohol?", options: ["Yeast", "Algae", "Amoeba", "Plasmodium"], answer: 0, explanation: "Yeast converts sugar into alcohol through the process of fermentation." },
    { text: "The first antibiotic to be discovered was:", options: ["Streptomycin", "Tetracycline", "Penicillin", "Erythromycin"], answer: 2, explanation: "Alexander Fleming discovered Penicillin in 1929 from a green mould." },
    { text: "Malaria is caused by a protozoan carried by:", options: ["Male Anopheles mosquito", "Female Anopheles mosquito", "Housefly", "Cockroach"], answer: 1, explanation: "The female Anopheles mosquito acts as the carrier for the Plasmodium parasite." },
    { text: "The process of conversion of sugar into alcohol is known as:", options: ["Nitrogen fixation", "Molding", "Fermentation", "Infection"], answer: 2, explanation: "Louis Pasteur discovered fermentation in 1857." },
    { text: "Viruses are different from other microorganisms because:", options: ["They are larger", "They reproduce only inside host cells", "They are always multi-cellular", "They don't have DNA"], answer: 1, explanation: "Viruses require a living host (plant, animal, or bacteria) to reproduce." }
  ],
  "Coal and Petroleum": [
    { text: "Which of these is an exhaustible natural resource?", options: ["Sunlight", "Air", "Coal", "Wind"], answer: 2, explanation: "Coal is present in limited amounts and can be exhausted by human activities." },
    { text: "The process of conversion of dead vegetation into coal is called:", options: ["Carbonisation", "Vaporisation", "Distillation", "Refining"], answer: 0, explanation: "Coal contains mainly carbon, so this slow conversion is carbonisation." },
    { text: "Which product of coal is used in the manufacture of steel?", options: ["Coal Tar", "Coke", "Coal Gas", "Paraffin Wax"], answer: 1, explanation: "Coke is a tough, porous, and black substance; almost pure form of carbon." },
    { text: "Petroleum is also known as 'Black Gold' because of its:", options: ["Color", "Weight", "Great commercial value", "Scarcity"], answer: 2, explanation: "Many useful substances are obtained from petroleum and natural gas." },
    { text: "The fuel used in heavy motor vehicles like trucks and tractors is:", options: ["Petrol", "Diesel", "Kerosene", "CNG"], answer: 1, explanation: "Diesel is used for heavy-duty engines due to its energy density." }
  ],
  "Rational Numbers": [
    { text: "What is the additive identity for rational numbers?", options: ["1", "0", "-1", "No identity"], answer: 1, explanation: "Adding 0 to any rational number results in the same number." },
    { text: "Which property says a + b = b + a?", options: ["Associative", "Distributive", "Commutative", "Closure"], answer: 2, explanation: "Commutative property means the order of addition doesn't matter." },
    { text: "The reciprocal of -5 is:", options: ["5", "1/5", "-1/5", "0"], answer: 2, explanation: "A number multiplied by its reciprocal equals 1. (-5 * -1/5 = 1)." },
    { text: "Between two rational numbers, there are ______ rational numbers.", options: ["0", "1", "10", "Infinite"], answer: 3, explanation: "There are countless rational numbers between any two given ones." },
    { text: "Which of these is NOT a rational number?", options: ["0", "2/3", "√2", "-5"], answer: 2, explanation: "√2 cannot be expressed as p/q where p, q are integers (it is irrational)." }
  ],
  "Lines and Angles": [
    { text: "If the sum of two angles is 90°, they are called:", options: ["Supplementary", "Complementary", "Linear Pair", "Vertically Opposite"], answer: 1, explanation: "Complementary angles sum to exactly 90 degrees." },
    { text: "Angles formed when a transversal cuts two parallel lines are equal if they are:", options: ["Interior only", "Corresponding", "Adjacent", "Obtuse"], answer: 1, explanation: "Corresponding angles are equal when lines are parallel." },
    { text: "The sum of angles on a straight line is:", options: ["90°", "180°", "270°", "360°"], answer: 1, explanation: "Straight angles (linear pairs) always sum to 180 degrees." }
  ]
};

async function main() {
  console.log('🚀 Seeding REAL NCERT-Aligned Quizzes...');

  // 1. Delete all existing quizzes for a clean start
  await prisma.question.deleteMany({});
  await prisma.quiz.deleteMany({});

  const allChapters = await prisma.chapter.findMany({
    include: { subject: true }
  });

  for (const chapter of allChapters) {
    const questions = REAL_QUESTIONS[chapter.title];
    
    if (questions) {
      console.log(`✅ Chapter: ${chapter.title} (Found REAL questions)`);
      
      const quiz = await prisma.quiz.create({
        data: { chapterId: chapter.id }
      });

      const questionsToCreate = questions.map((q, i) => ({
        quizId: quiz.id,
        text: q.text,
        options: q.options,
        correctAnswer: q.answer,
        explanation: q.explanation,
        imageUrl: Math.random() > 0.7 ? `https://placehold.co/600x400?text=${encodeURIComponent(chapter.title)}+Diagram+${i+1}` : null
      }));

      await prisma.question.createMany({ data: questionsToCreate });
    } else {
        // Fallback for others - we can gradually add them
        // For now, let's generate a simple generic conceptual quiz for these
        console.log(`⚠️ Chapter: ${chapter.title} (No real questions yet, using conceptual fallback)`);
        const quiz = await prisma.quiz.create({ data: { chapterId: chapter.id } });
        const fallbackQuestions = [
            { quizId: quiz.id, text: `What is the main concept discussed in ${chapter.title}?`, options: ["Theory", "Experiment", "Observation", "All of these"], correctAnswer: 3, explanation: "Science/Math is built on all these core pillars." },
            { quizId: quiz.id, text: `In the context of ${chapter.title}, which of these is FALSE?`, options: ["It is logical", "It follows rules", "It is random", "It is verifiable"], correctAnswer: 2, explanation: "Academic subjects follow systematic rules and methods." }
        ];
        await prisma.question.createMany({ data: fallbackQuestions });
    }
  }

  console.log('\n✨ Finished! Real NCERT content is now live for key chapters.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

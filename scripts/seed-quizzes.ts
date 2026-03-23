import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const templates: { [key: string]: any[] } = {
  'Math': [
    { text: "What is the basic property of {chapter}?", options: ["Commutative", "Associative", "Distributive", "All of these"], answer: 3 },
    { text: "Solve for X in the context of {chapter}: X + 5 = 15", options: ["5", "10", "15", "20"], answer: 1 },
    { text: "Which of these is a key formula in {chapter}?", options: ["A = L * B", "E = mc^2", "V = I * R", "F = m * a"], answer: 0 },
    { text: "In {chapter}, what does the term 'Rational' imply?", options: ["Expressible as p/q", "Always positive", "Always even", "Imaginary"], answer: 0 },
    { text: "If we double the value in {chapter}, what happens?", options: ["Stays same", "Doubles", "Triples", "Halves"], answer: 1 },
    { text: "In {chapter}, what happens when zero is added?", options: ["Increases", "Decreases", "No change", "Zeroes"], answer: 2 },
    { text: "Is the product of two numbers in {chapter} always positive?", options: ["Always", "Never", "Depends", "Only if both positive"], answer: 2 },
    { text: "Which representation is used in {chapter} for visualizing data?", options: ["Bar chart", "Pie chart", "Histogram", "All of these"], answer: 3 },
    { text: "What is the inverse operation of {chapter}?", options: ["Addition", "Subtraction", "Multiplication", "Division"], answer: 3 },
    { text: "In {chapter}, what is the value of 'Pi' approximately?", options: ["3.14", "2.71", "1.41", "1.73"], answer: 0 },
    { text: "Which shape is most relevant to {chapter}?", options: ["Square", "Circle", "Triangle", "Cube"], answer: 0 },
    { text: "The sum of angles in a triangle related to {chapter} is:", options: ["90°", "180°", "270°", "360°"], answer: 1 },
    { text: "In {chapter}, what is a prime number?", options: ["Even only", "1 divisor", "2 divisors", "3 divisors"], answer: 2 },
    { text: "What is the square root of 25 in {chapter} terms?", options: ["2", "3", "4", "5"], answer: 3 },
    { text: "A line segment has how many endpoints in {chapter}?", options: ["0", "1", "2", "3"], answer: 2 },
    { text: "The perimeter of a square in {chapter} is:", options: ["4 + side", "4 * side", "side * side", "2 * side"], answer: 1 },
    { text: "What is 10% of 200 in {chapter}?", options: ["10", "20", "30", "40"], answer: 1 },
    { text: "Identify the variable in '2x + 3' for {chapter}:", options: ["2", "x", "3", "+"], answer: 1 },
    { text: "What is the smallest prime number in {chapter}?", options: ["0", "1", "2", "3"], answer: 2 },
    { text: "The area of a circle in {chapter} is:", options: ["2πr", "πr²", "πd", "2d"], answer: 1 },
    { text: "A polygon with 5 sides in {chapter} is a:", options: ["Hexagon", "Pentagon", "Octagon", "Square"], answer: 1 },
    { text: "In {chapter}, if a = b and b = c, then:", options: ["a = c", "a > c", "a < c", "a ≠ c"], answer: 0 },
    { text: "What is 1 to the power of 100 in {chapter}?", options: ["1", "100", "0", "Undefined"], answer: 0 },
    { text: "The probability of a certain event in {chapter} is:", options: ["0", "0.5", "1", "2"], answer: 2 },
    { text: "Which of these is a multiple of 7?", options: ["12", "14", "16", "18"], answer: 1 }
  ],
  'Science': [
    { text: "What is the primary objective of studying {chapter}?", options: ["Observation", "Experimentation", "Conclusion", "All of these"], answer: 3 },
    { text: "Which element is crucial for {chapter}?", options: ["Oxygen", "Carbon", "Nitrogen", "Hydrogen"], answer: 0 },
    { text: "What is the unit of measurement in {chapter}?", options: ["Newton", "Pascal", "Joule", "Watt"], answer: 2 },
    { text: "Is {chapter} related to living organisms?", options: ["Yes", "No", "Partially", "None of these"], answer: 0 },
    { text: "What instrument is used for {chapter}?", options: ["Microscope", "Telescope", "Thermometer", "Barometer"], answer: 0 },
    { text: "In {chapter}, what is the process of evaporation?", options: ["Solid to Liquid", "Liquid to Gas", "Gas to Liquid", "Liquid to Solid"], answer: 1 },
    { text: "Which gas do we breathe out in {chapter} context?", options: ["Oxygen", "CO2", "Nitrogen", "Helium"], answer: 1 },
    { text: "The center of an atom in {chapter} is called:", options: ["Proton", "Electron", "Nucleus", "Neutron"], answer: 2 },
    { text: "What is the speed of light in {chapter} terms?", options: ["30,000 km/s", "300,000 km/s", "3,000,000 km/s", "Swift"], answer: 1 },
    { text: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], answer: 1 },
    { text: "In {chapter}, what defines a 'Force'?", options: ["Push/Pull", "Weight", "Speed", "Friction"], answer: 0 },
    { text: "What is the pH level of pure water?", options: ["1", "7", "14", "0"], answer: 1 },
    { text: "The smallest unit of life in {chapter} is:", options: ["Tissue", "Organ", "Cell", "Gene"], answer: 2 },
    { text: "Which vitamin do we get from Sunlight?", options: ["A", "B", "C", "D"], answer: 3 },
    { text: "In {chapter}, what causes gravity?", options: ["Magnetism", "Mass", "Motion", "Heat"], answer: 1 },
    { text: "What is the chemical symbol for Gold?", options: ["Gd", "Ag", "Au", "Fe"], answer: 2 },
    { text: "Sound travels fastest through in {chapter}:", options: ["Air", "Water", "Steel", "Vacuum"], answer: 2 },
    { text: "Which part of the plant absorbs water?", options: ["Leaf", "Stem", "Root", "Flower"], answer: 2 },
    { text: "In {chapter}, an acid turns litmus paper:", options: ["Blue to Red", "Red to Blue", "Green", "Colorless"], answer: 0 },
    { text: "What is the brain of a computer in {chapter} analog?", options: ["RAM", "Monitor", "CPU", "Mouse"], answer: 2 },
    { text: "The hardest natural substance in {chapter} is:", options: ["Gold", "Iron", "Diamond", "Stone"], answer: 2 },
    { text: "Which system pumps blood in {chapter} terms?", options: ["Nervous", "Digestive", "Circulatory", "Respiratory"], answer: 2 },
    { text: "What is the freezing point of water?", options: ["0°C", "100°C", "32°C", "50°C"], answer: 0 },
    { text: "In {chapter}, what is photosynthesis?", options: ["Digestion", "Plant food making", "Respiration", "Movement"], answer: 1 },
    { text: "Which layer of Earth is the outermost?", options: ["Core", "Mantle", "Crust", "Magma"], answer: 2 }
  ],
  'History': [
    { text: "When was {chapter} most significant?", options: ["18th Century", "19th Century", "20th Century", "Ancient Times"], answer: 1 },
    { text: "Who was a key figure in {chapter}?", options: ["Mahatma Gandhi", "Akbar", "Ashoka", "Shivaji"], answer: 0 },
    { text: "What was the main cause of {chapter}?", options: ["Economic", "Political", "Social", "Religious"], answer: 2 },
    { text: "Where did {chapter} primarily take place?", options: ["India", "Europe", "America", "Asia"], answer: 0 }
  ],
  'Geography': [
    { text: "What resource is linked to {chapter}?", options: ["Water", "Soil", "Minerals", "All of these"], answer: 3 },
    { text: "Which climate is best for {chapter}?", options: ["Tropical", "Polar", "Desert", "Temperate"], answer: 0 },
    { text: "Is {chapter} a renewable resource?", options: ["Always", "Never", "Sometimes", "Depends"], answer: 2 }
  ],
  'Civics': [
    { text: "What right is protected in {chapter}?", options: ["Equality", "Freedom", "Religious", "All of these"], answer: 3 },
    { text: "Who governs the laws of {chapter}?", options: ["Constitution", "Parliament", "President", "Citizens"], answer: 0 },
    { text: "When was the law for {chapter} enacted?", options: ["1947", "1950", "1991", "2005"], answer: 1 }
  ]
};

async function main() {
  console.log('Starting seed: Chapter Quizzes (Unique Questions Mode)');

  // Clear all previous quizzes first for a clean state
  await prisma.question.deleteMany({});
  await prisma.quiz.deleteMany({});

  const subjects = await prisma.subject.findMany({
    include: { chapters: true }
  });

  for (const subject of subjects) {
    console.log(`Processing Subject: ${subject.name} (${subject.class})`);
    
    // Get base templates for this subject
    let subjectTemplatesRaw = templates[subject.name] || templates['Science'];
    if (subject.name.toLowerCase().includes('social')) {
      subjectTemplatesRaw = [...templates.History, ...templates.Geography, ...templates.Civics];
    } else if (subject.name === 'Science') {
      subjectTemplatesRaw = templates['Science'];
    } else if (subject.name === 'Math' || subject.name === 'Mathematics') {
      subjectTemplatesRaw = templates['Math'];
    }

    for (const chapter of subject.chapters) {
      // 1. Determine number of questions (Max unique templates vs random 4-25)
      const maxPossible = subjectTemplatesRaw.length;
      const targetNum = Math.floor(Math.random() * (25 - 4 + 1)) + 4;
      const numQuestions = Math.min(targetNum, maxPossible);
      
      // 2. Create Quiz
      const quiz = await prisma.quiz.create({
        data: { chapterId: chapter.id }
      });

      // 3. Shuffle templates to pick unique ones
      const shuffled = [...subjectTemplatesRaw].sort(() => 0.5 - Math.random());
      const selectedTemplates = shuffled.slice(0, numQuestions);

      const questionsToCreate = selectedTemplates.map((template, i) => {
        const isVisual = Math.random() > 0.8; // 20% visual
        return {
          quizId: quiz.id,
          text: template.text.replace('{chapter}', chapter.title),
          options: template.options,
          correctAnswer: template.answer,
          explanation: `In the context of ${chapter.title}, this is a key takeaway. Remember this for your exams! 🌟`,
          imageUrl: isVisual ? `https://placehold.co/600x400?text=Diagram+for+${encodeURIComponent(chapter.title)}+Q${i+1}` : null
        };
      });

      await prisma.question.createMany({ data: questionsToCreate });
      console.log(`- Created Unique Quiz for Ch: ${chapter.title} (${numQuestions} Questions)`);
    }
  }

  console.log('Seed finished: Unique Chapter Quizzes');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

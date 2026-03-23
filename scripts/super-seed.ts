import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const prisma = new PrismaClient();

const EXTRA_QUESTIONS: { [key: string]: string } = {
  // Science Class 7
  "Nutrition in Plants": "What is Photosynthesis? Draw a simple diagram showing how plants take in CO2 and release Oxygen. Also, explain why leaves are called the food factories of plants.",
  "Nutrition in Animals": "Describe the process of digestion in the stomach. Why is the inner lining of the small intestine folded into villi?",
  "Fibre to Fabric": "How is wool obtained from sheep? Describe the steps involved in processing fibres into wool.",
  "Heat": "Define Temperature. Explain the difference between clinical and laboratory thermometers. How does heat transfer occur in liquids?",
  "Acids, Bases and Salts": "What are Indicators? How does Turmeric act as a natural indicator? Explain the process of Neutralisation with an example.",
  "Physical and Chemical Changes": "Distinguish between physical and chemical changes. Why is rusting of iron considered a chemical change? How can we prevent it?",
  "Weather, Climate and Adaptations": "How are polar bears adapted to live in extremely cold climates? Mention any three features.",
  "Winds, Storms and Cyclones": "Explain how a cyclone is formed. What safety measures should be taken in a cyclone-prone area?",
  "Soil": "Describe the different layers of soil (Soil Profile) with a diagram. Which layer is most fertile and why?",
  "Respiration in Organisms": "Why do we get muscle cramps after heavy exercise? Explain the difference between aerobic and anaerobic respiration.",
  "Transportation in Animals and Plants": "Describe the function of the human heart. How does Xylem transport water in tall plants?",
  "Reproduction in Plants": "Explain the difference between self-pollination and cross-pollination. How do seeds disperse to different places?",
  "Motion and Time": "Define Speed. A car travels 100 km in 2 hours. Calculate its speed in m/s.",
  "Electric Current and its Effects": "What is the Heating Effect of electric current? Give two applications of this effect in daily life.",
  "Light (Class 7)": "What are Spherical mirrors? Distinguish between concave and convex mirrors. Mention one use of each.",
  "Water: A Precious Resource": "What is Ground Water? Explain the process of 'Water Harvesting' to conserve water.",
  "Forests: Our Lifeline": "Why are forests called 'Green Lungs'? How do they help in maintaining the balance of Oxygen and CO2?",
  "Wastewater Story": "What is Sewage? Describe the process of wastewater treatment in a treatment plant."
};

async function main() {
  console.log('🧹 Cleaning up and Merging Subjects...');

  // Merge Math subjects
  const subjects = await prisma.subject.findMany();
  const math8_target = subjects.find(s => s.name === 'Mathematics' && s.class === 'Class 8');
  const math8_source = subjects.find(s => s.name === 'Math' && s.class === 'Class 8');

  if (math8_target && math8_source) {
    console.log(`Merging 'Math' Class 8 into 'Mathematics' Class 8...`);
    await prisma.chapter.updateMany({
      where: { subjectId: math8_source.id },
      data: { subjectId: math8_target.id }
    });
    // Optional: Delete the empty source subject
    await prisma.subject.delete({ where: { id: math8_source.id } });
  }

  const math9_source = subjects.find(s => s.name === 'Math' && s.class === 'Class 9');
  if (math9_source) {
      // Create Mathematics Class 9 if it doesn't exist
      let math9_target = subjects.find(s => s.name === 'Mathematics' && s.class === 'Class 9');
      if (!math9_target) {
          math9_target = await prisma.subject.create({ data: { name: 'Mathematics', class: 'Class 9' } });
      }
      console.log(`Merging 'Math' Class 9 into 'Mathematics' Class 9...`);
      await prisma.chapter.updateMany({
        where: { subjectId: math9_source.id },
        data: { subjectId: math9_target.id }
      });
      await prisma.subject.delete({ where: { id: math9_source.id } });
  }

  console.log('📝 Seeding EXTRA Written Practice Questions...');

  const allChapters = await prisma.chapter.findMany();

  for (const chapter of allChapters) {
    const question = EXTRA_QUESTIONS[chapter.title];
    if (question) {
      await prisma.chapter.update({
        where: { id: chapter.id },
        data: { writtenQuestion: question }
      });
      console.log(`✅ ${chapter.title}: Written Question Added`);
    } else if (!chapter.writtenQuestion) {
        // Only add if it's currently empty/fallback
        await prisma.chapter.update({
            where: { id: chapter.id },
            data: { writtenQuestion: `Summarize the 3 most important concepts you learned in "${chapter.title}" and explain one way this knowledge helps you in real life.` }
        });
        console.log(`⚠️ ${chapter.title}: Improved Summary Added`);
    }
  }

  console.log('\n✨ Finished! Database cleaned and content expanded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

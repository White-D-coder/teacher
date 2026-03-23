import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const prisma = new PrismaClient();

const WRITTEN_SETS: { [key: string]: string } = {
  // Science Class 8
  "Crop Production and Management": `1. [Easy] What is the difference between Kharif and Rabi crops? Give two examples of each.
2. [Easy] Define 'Tilling' or 'Ploughing'. Why is it important for the soil?
3. [Medium] Distinguish between Manure and Fertilizers. Which one is better for the soil in the long run and why?
4. [Medium] Explain any two modern methods of irrigation that help in conserving water.
5. [Hard] What is 'Nitrogen Fixation'? Describe the role of Rhizobium bacteria in the root nodules of leguminous plants.`,

  "Microorganisms: Friend and Foe": `1. [Easy] Define 'Fermentation'. Who discovered this process?
2. [Easy] Name any two antibiotics and the microorganisms from which they are obtained.
3. [Medium] Explain how yeast is useful in the baking industry. What gas is released during the process?
4. [Medium] Describe three ways in which microorganisms contribute to increasing soil fertility.
5. [Hard] Analyze why viruses are considered to be on the borderline of living and non-living. How do they replicate inside a host cell?`,

  "Coal and Petroleum": `1. [Easy] Why are coal and petroleum called fossil fuels?
2. [Easy] What is 'Carbonisation'? How long does this process take naturally?
3. [Medium] List three constituents of petroleum and mention one specific use for each.
4. [Medium] Describe the process of refining petroleum. Why are several fractions separated before use?
5. [Hard] Discuss the environmental impact of the over-exploitation of fossil fuels. Suggest three ways to conserve these resources.`,

  "Combustion and Flame": `1. [Easy] What are the three essential requirements for producing fire?
2. [Easy] Define 'Ignition Temperature'. Why is it difficult to burn green leaves compared to dry ones?
3. [Medium] Draw a labeled diagram of a candle flame. Which zone is the hottest and why?
4. [Medium] Explain why water is NOT used to extinguish fires involving electrical equipment or oil.
5. [Hard] What is 'Calorific Value' of a fuel? If 4.5 kg of fuel produces 1,80,000 kJ of heat, calculate its calorific value and discuss its efficiency.`,

  // Mathematics Class 8
  "Rational Numbers": `1. [Easy] What is meant by the 'Additive Identity' and 'Multiplicative Identity' for rational numbers?
2. [Easy] Find the additive inverse of -7/19 and the multiplicative inverse of -13.
3. [Medium] Verify the distributive property: a(b+c) = ab + ac for a=1/2, b=-2/3, c=1/4.
4. [Medium] Represent -2/11, -5/11, and -9/11 on a single number line.
5. [Hard] Find five rational numbers between 1/4 and 1/2 using the mean method. Show all your steps clearly.`,

  "Linear Equations in One Variable": `1. [Easy] Solve the equation: x + 6 = 10. Explain the steps to isolate x.
2. [Easy] If 15 is added to a number, the result is 40. Form an equation and find the number.
3. [Medium] Solve: (3x+4) / (2-6x) = -2/5. Show the cross-multiplication steps.
4. [Medium] The perimeter of a rectangle is 13 cm and its width is 11/4 cm. Find its length using a linear equation.
5. [Hard] Two numbers are in the ratio 5:3. If they differ by 18, what are the numbers? Discuss how the ratio relates to the constant of proportionality.`,

  // Science Class 9
  "Matter in Our Surroundings": `1. [Easy] Define 'Sublimation' with an example (e.g., Camphor).
2. [Easy] Why do we wear cotton clothes in summer? Explain based on evaporation.
3. [Medium] Explain the effect of change of pressure on the state of matter.
4. [Medium] Give three reasons why ice at 273 K is more effective in cooling than water at the same temperature.
5. [Hard] What is 'Latent Heat of Vaporisation'? Discuss how it relates to the cooling effect felt when liquid evaporates from your skin.`,

  "Is Matter Around Us Pure?": `1. [Easy] What is a 'Pure Substance' in science? Give two examples.
2. [Easy] Define 'Solubility'. How does temperature affect the solubility of a solid in a liquid?
3. [Medium] Distinguish between a 'Homogeneous' and a 'Heterogeneous' mixture with examples.
4. [Medium] Describe any two techniques used to separate components of a mixture (e.g., Chromatography, Distillation).
5. [Hard] What is the 'Tyndall Effect'? Explain why a solution of copper sulphate does not show it, but a mixture of water and milk does.`,

  "Atoms and Molecules": `1. [Easy] State the 'Law of Conservation of Mass'. Who proposed it?
2. [Easy] Define 'Atomicity'. Give one example each of a monoatomic and a diatomic molecule.
3. [Medium] Explain the concept of 'Mole'. Calculate the number of moles in 52g of Helium.
4. [Medium] Write the chemical formulas for: Sodium Chloride, Magnesium Chloride, and Calcium Oxide.
5. [Hard] Discuss 'Dalton\'s Atomic Theory'. Which of its postulates can explain the Law of Constant Proportions?`,

  "Structure of the Atom": `1. [Easy] Name the three subatomic particles of an atom and state their charges.
2. [Easy] Define 'Valency'. What is the valency of Magnesium (atomic number 12)?
3. [Medium] Describe 'Rutherford\'s Alpha-particle Scattering Experiment'. What were its two main conclusions?
4. [Medium] Explain the difference between 'Isotopes' and 'Isobars' with one example of each.
5. [Hard] Discuss 'Bohr\'s Model of an Atom'. How are electrons distributed in different orbits (shells) according to the 2n² rule?`,

  "The Fundamental Unit of Life": `1. [Easy] Why is the Cell called the structural and functional unit of life?
2. [Easy] What is the role of 'Mitochondria' in a cell? Why are they called the powerhouse of the cell?
3. [Medium] Describe the function of the 'Plasma Membrane'. Why is it called a selectively permeable membrane?
4. [Medium] Distinguish between 'Prokaryotic' and 'Eukaryotic' cells with three major differences.
5. [Hard] What are 'Lysosomes'? Why are they known as 'Suicide Bags' of a cell? Explain their role in waste disposal.`,

  "Tissues": `1. [Easy] Define 'Tissue'. Name the two main types of plant tissues.
2. [Easy] What is 'Stomata'? List its two main functions.
3. [Medium] Describe the structure and function of 'Xylem' and 'Phloem' in plants.
4. [Medium] Distinguish between 'Striated', 'Unstriated', and 'Cardiac' muscles based on their structure and location.
5. [Hard] Explain the structure of a 'Neuron' (nerve cell) with a labeled diagram description. How do they transmit impulses?`,

  "Motion": `1. [Easy] Distinguish between 'Distance' and 'Displacement'. Can displacement be zero if distance is not?
2. [Easy] Define 'Uniform Motion'. Give one example from daily life.
3. [Medium] A car travels 30 km at a uniform speed of 40 km/h and the next 30 km at a uniform speed of 20 km/h. Find its average speed.
4. [Medium] Derive the first equation of motion (v = u + at) using a velocity-time graph.
5. [Hard] Explain the concept of 'Circular Motion'. Why is a body moving in a circle at a constant speed said to be in accelerated motion?`,

  "Force and Laws of Motion": `1. [Easy] State 'Newton\'s First Law of Motion'. What is 'Inertia'?
2. [Easy] Why do passengers in a bus tend to fall forward when it stops suddenly?
3. [Medium] State 'Newton\'s Second Law of Motion'. Prove that F = ma.
4. [Medium] Explain 'Conservation of Momentum'. Why does a gun recoil when a bullet is fired?
5. [Hard] Describe 'Newton\'s Third Law of Motion' with two real-life examples. How does it explain the flight of a rocket?`,

  "Gravitation": `1. [Easy] State the 'Universal Law of Gravitation'. What is the value of 'G'?
2. [Easy] What is the difference between 'Mass' and 'Weight'? Why is your weight different on the Moon?
3. [Medium] Define 'Free Fall'. Calculate the value of 'g' (acceleration due to gravity) on the Earth's surface.
4. [Medium] Explain 'Archimedes\' Principle'. Give two applications of this principle.
5. [Hard] What is 'Buoyancy'? Why does an object float or sink when placed on the surface of water? Explain with density.`,

  "Work and Energy": `1. [Easy] Define 'Work'. When is work said to be done in a scientific sense?
2. [Easy] What is 'Kinetic Energy'? Give the formula for calculating it.
3. [Medium] State the 'Law of Conservation of Energy'. Discuss the energy transformation in a simple pendulum.
4. [Medium] An object of mass 15 kg is moving with a uniform velocity of 4 m/s. What is its kinetic energy?
5. [Hard] Define 'Power'. What is 1 Watt? A bulb of 60W is used for 6 hours a day. Calculate the 'units' of energy consumed in one day.`,

  "Sound": `1. [Easy] How is sound produced? Can sound travel through a vacuum?
2. [Easy] Define 'Frequency' and 'Amplitude' of a sound wave.
3. [Medium] Explain the terms 'Echo' and 'Reverberation'. How can reverberation be reduced in a big hall?
4. [Medium] Describe the working of a 'SONAR' system. How is it used to find the depth of a sea?
5. [Hard] Discuss the range of hearing in humans. What are 'Ultrasound' waves? List three applications of ultrasound in medicine or industry.`,

  "Improvement in Food Resources": `1. [Easy] What are the two main sources of food for humans?
2. [Easy] Define 'Green Revolution' and 'White Revolution'.
3. [Medium] Mention three differences between 'Manure' and 'Fertilizer'. Which is better for sustainable farming?
4. [Medium] What is 'Inter-cropping'? How is it different from 'Mixed Cropping'? List the advantages.
5. [Hard] Discuss the importance of 'Animal Husbandry'. Mention the main criteria for selecting good breeds in Cattle Farming or Poultry.`,

  // Social Science Class 9
  "The French Revolution": `1. [Easy] Describe the circumstances leading to the outbreak of revolutionary protest in France.
2. [Easy] Which groups of French society benefited from the revolution? Which groups were forced to relinquish power?
3. [Medium] What was the 'Reign of Terror'? Who was its leader and how did it end?
4. [Medium] Describe the legacy of the French Revolution for the peoples of the world during the nineteenth and twentieth centuries.
5. [Hard] Draw up a list of democratic rights we enjoy today whose origins could be traced to the French Revolution. Analyze their impact on modern governance.`,

  "Socialism in Europe and the Russian Revolution": `1. [Easy] What were the social, economic and political conditions in Russia before 1905?
2. [Easy] In what ways was the working population in Russia different from other European countries before 1917?
3. [Medium] What were the main changes brought about by the Bolsheviks immediately after the October Revolution?
4. [Medium] Write a few lines on: (a) Kulaks (b) The Duma (c) Women workers between 1900 and 1930.
5. [Hard] Discuss the global impact of the Russian Revolution. How did it inspire or impact independence movements in other countries?`,

  "Nazism and the Rise of Hitler": `1. [Easy] Describe the problems faced by the Weimar Republic.
2. [Easy] What were the main features of Hitler’s world view (ideology)?
3. [Medium] Explain why Nazi propaganda was effective in creating a hatred for Jews.
4. [Medium] Describe the ways in which the Nazi state established total control over its people.
5. [Hard] "The history of Nazi Germany is a dark chapter of the 20th century." Discuss the importance of learning about the Holocaust to prevent such atrocities in the future.`,

  "Forest Society and Colonialism": `1. [Easy] Discuss how the changes in forest management in the colonial period affected: (a) Shifting cultivators (b) Nomadic and pastoralist communities.
2. [Easy] What is 'Scientific Forestry'? Why did the colonial government introduce it?
3. [Medium] Explain the rebellion in Bastar. What were the main reasons for the people's revolt?
4. [Medium] How were the lives of the villagers changed by the new forest laws?
5. [Hard] Analyze the link between the development of railways and the destruction of forests in India and Indonesia during the colonial rule.`,

  "Pastoralists in the Modern World": `1. [Easy] Explain why nomadic tribes need to move from one place to another. What are the advantages to the environment?
2. [Easy] Under the colonial rule, why were the grazing lands converted into cultivated farms?
3. [Medium] Discussion the impact of the Forest Acts on the lives of pastoralists.
4. [Medium] How did the pastoralists cope with the changes brought about by the Criminal Tribes Act?
5. [Hard] Compare and contrast the impact of colonial policies on pastoral communities in India and Africa (e.g., the Maasai).`,

  "India – Size and Location": `1. [Easy] Name the group of islands lying in the Arabian Sea. Which island countries are our southern neighbors?
2. [Easy] The central location of India at the head of the Indian Ocean is considered of great significance. Why?
3. [Medium] Why is 82°30'E selected as the Standard Meridian of India? Discuss the time lag between Gujarat and Arunachal Pradesh.
4. [Medium] Describe the size of India in terms of area and its position in the world.
5. [Hard] Analyze the impact of India's long coastline on its trade and cultural interactions with other countries over history.`,

  "Physical Features of India": `1. [Easy] Name the three major divisions of the Himalayas from north to south.
2. [Easy] Which plateau lies between the Aravali and the Vindhya ranges?
3. [Medium] Contrast the relief of the Himalayan region with that of the Peninsular plateau.
4. [Medium] Describe how the Himalayas were formed according to the Theory of Plate Tectonics.
5. [Hard] Distinguish between 'Bhangar' and 'Khadar'. Discuss the importance of the Northern Plains for the Indian economy.`,

  "Drainage": `1. [Easy] Define 'Drainage Basin' and 'Water Divide'.
2. [Easy] Name the three main Himalayan river systems.
3. [Medium] Distinguish between Himalayan and Peninsular rivers.
4. [Medium] Describe the role of rivers in the economy and the causes of river pollution.
5. [Hard] What are 'Lakes'? Discuss the importance of lakes in regulating the flow of rivers and their impact on the local climate and tourism.`,

  "Climate": `1. [Easy] What are the elements of weather and climate? Describe the 'Monsoon' mechanism.
2. [Easy] Why does the rainfall decrease from the east to the west in Northern India?
3. [Medium] Discuss the mechanisms of 'Jet Streams' and 'Western Cyclonic Disturbances'.
4. [Medium] Account for the variations in temperature and precipitation in India.
5. [Hard] Describe the four main seasons of India with their characteristic features. Explain why the monsoon is considered a 'unifying bond'.`,

  "Natural Vegetation and Wildlife": `1. [Easy] Define an 'Ecosystem'. Why are the plants and animals interdependent?
2. [Easy] Name the different types of vegetation found in India.
3. [Medium] Distinguish between 'Tropical Evergreen' and 'Tropical Deciduous' forests.
4. [Medium] Discuss the steps taken by the government to protect the flora and fauna of the country.
5. [Hard] Why is India called a 'Mega Bio-diversity' country? Analyze the factors responsible for the distribution of plants and animals in India.`,

  "Population": `1. [Easy] Why is the population of India unevenly distributed?
2. [Easy] What are the three main components of population change?
3. [Medium] Define 'Age Structure', 'Sex Ratio', and 'Literacy Rate'. How do they reflect the quality of a population?
4. [Medium] Discuss the 'National Population Policy' and its objectives.
5. [Hard] Analyze the impact of 'Migration' (internal and international) on the population distribution and characteristics of a region.`,

  "What is Democracy? Why Democracy?": `1. [Easy] State any two features of democracy. Give a simple definition of democracy.
2. [Easy] Why is Pakistan under General Musharraf not called a democracy?
3. [Medium] Discuss the arguments 'For' and 'Against' democracy.
4. [Medium] What is a 'Representative Democracy'? Why is it the most common form in today's world?
5. [Hard] "Democracy is about bringing out the best in people and society." Discuss the 'Broader Meaning' of democracy beyond just a form of government.`,

  "Constitutional Design": `1. [Easy] What is a 'Constitution'? Why do we need one?
2. [Easy] Who were the key members of the Drafting Committee? Who was its chairman?
3. [Medium] Discuss the 'Preamble' of the Indian Constitution and the values it enshrines.
4. [Medium] Describe the making of the Indian Constitution. What challenges did the makers face?
5. [Hard] Analyze the 'Apartheid' system in South Africa and how the new constitution was formed to ensure equality.`,

  "Electoral Politics": `1. [Easy] Why do we need elections? What makes an election democratic?
2. [Easy] What is an 'Electoral Constituency'? What are 'Reserved Constituencies'?
3. [Medium] Describe the different stages of an election process in India.
4. [Medium] What are the functions of the 'Election Commission of India'?
5. [Hard] Discuss the 'Challenges to Free and Fair Elections' in India and suggest measures to improve the system.`,

  "Working of Institutions": `1. [Easy] What is a 'Parliament'? Why is it necessary in a democracy?
2. [Easy] Distinguish between the 'Political Executive' and the 'Permanent Executive'.
3. [Medium] Explain the powers and functions of the Prime Minister and the Council of Ministers.
4. [Medium] Describe the structure of the 'Judiciary' in India. What is 'Judicial Review'?
5. [Hard] Discuss why the Lok Sabha is more powerful than the Rajya Sabha in some matters.`,

  "Democratic Rights": `1. [Easy] What are 'Rights'? Why are they necessary in a democracy?
2. [Easy] Name the 'six' Fundamental Rights guaranteed by the Indian Constitution.
3. [Medium] Discuss the 'Right to Equality' and its various dimensions.
4. [Medium] What is the 'Right to Constitutional Remedies'? Why is it called the heart and soul of the Constitution?
5. [Hard] Beyond Fundamental Rights, discuss the concept of 'Expanding Scope of Rights' (e.g., Right to Information, Right to Education).`,

  "The Story of Village Palampur": `1. [Easy] Name the four requirements for the production of goods and services.
2. [Easy] What is 'Multiple Cropping'? How does it increase production?
3. [Medium] Discuss the impact of the 'Green Revolution' on the farmers of Palampur.
4. [Medium] Distinguish between 'Fixed Capital' and 'Working Capital' with examples.
5. [Hard] "The land is a vital but limited resource." Discuss the environmental constraints and the sustainability of modern farming methods.`,

  "People as Resource": `1. [Easy] What do you understand by 'People as a Resource'?
2. [Easy] Define 'Human Capital Formation'.
3. [Medium] Discuss the role of 'Education' and 'Health' in the development of a person as a resource.
4. [Medium] Distinguish between 'Economic Activities' and 'Non-economic Activities'.
5. [Hard] Analyze the problem of 'Unemployment' (Seasonal and Disguised) in India and its impact on the economy.`,

  "Poverty as a Challenge": `1. [Easy] Define 'Poverty' and 'Poverty Line'. How is it measured in India?
2. [Easy] Name any two groups that are most vulnerable to poverty in India.
3. [Medium] Discuss the main causes of poverty in India.
4. [Medium] Describe the current 'Anti-poverty Programs' launched by the government.
5. [Hard] Analyze why poverty reduction is still a major challenge in India despite economic growth. Discuss the 'Global Poverty Scenario'.`,

  "Food Security in India": `1. [Easy] What is 'Food Security'? Name its three dimensions.
2. [Easy] What is 'Buffer Stock'? Why is it maintained by the government?
3. [Medium] Discuss the 'Public Distribution System' (PDS) and its importance.
4. [Medium] Explain the role of Cooperatives in food security (e.g., Amul, Mother Dairy).
5. [Hard] Analyze the impact of 'MSP' (Minimum Support Price) and 'Issue Price' on the farmers and the consumers.`,
};

async function main() {
  console.log('🚀 Seeding UNIVERSAL 5-question written assessment sets...');

  const allChapters = await prisma.chapter.findMany();

  for (const chapter of allChapters) {
    // Skip Milestone Chapters (starts with Week)
    if (chapter.title.includes('Week')) continue;

    const questionSet = WRITTEN_SETS[chapter.title];
    
    if (questionSet) {
      await prisma.chapter.update({
        where: { id: chapter.id },
        data: { writtenQuestion: questionSet }
      });
      console.log(`✅ ${chapter.title}: Written Set Added`);
    } else {
        // Generic 5-question set for others
        const genericSet = `1. [Easy] Summarize the most important definition or concept you learned in "${chapter.title}".
2. [Easy] List two real-life examples or applications of the topics covered in this chapter.
3. [Medium] Pick one important process or theory from this chapter and explain it in your own words.
4. [Medium] How does the knowledge in this chapter relate to what you learned in the previous chapter?
5. [Hard] Analyze a potential future technology or social impact related to "${chapter.title}" and discuss its pros and cons.`;
        
        await prisma.chapter.update({
            where: { id: chapter.id },
            data: { writtenQuestion: genericSet }
        });
        console.log(`⚠️ ${chapter.title}: Generic Written Set Added`);
    }
  }

  console.log('\n✨ Finished! All chapters now have the 5-question assessment pattern.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

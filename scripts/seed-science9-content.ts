import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const prisma = new PrismaClient();

const CHAPTER_CONTENT: Record<string, {
  quiz: { text: string; options: string[]; correctAnswer: number; explanation: string }[];
  supplements: { title: string; content: string }[];
}> = {
  "Matter in Our Surroundings": {
    quiz: [
      { text: "What is the process of change from solid directly to gas called?", options: ["Melting", "Boiling", "Sublimation", "Evaporation"], correctAnswer: 2, explanation: "Sublimation is the transition of a substance directly from the solid to the gas phase without passing through the intermediate liquid phase." },
      { text: "Which of the following is the SI unit of temperature?", options: ["Celsius", "Fahrenheit", "Kelvin", "None of these"], correctAnswer: 2, explanation: "The Kelvin (K) is the SI unit of thermodynamic temperature." },
      { text: "Evaporation causes which effect?", options: ["Heating", "Cooling", "Melting", "Freezing"], correctAnswer: 1, explanation: "Evaporation is a surface phenomenon where liquid particles take heat from the surrounding environment to turn into vapor, causing a cooling effect." },
      { text: "Convert 300 Kelvin to Celsius.", options: ["30°C", "27°C", "25°C", "0°C"], correctAnswer: 1, explanation: "0°C = 273 K. So 300 K = 300 - 273 = 27°C." },
      { text: "Which state of matter has the highest compressibility?", options: ["Solid", "Liquid", "Gas", "Bose-Einstein Condensate"], correctAnswer: 2, explanation: "Gases have large empty spaces between particles, allowing them to be compressed easily compared to solids and liquids." }
    ],
    supplements: [
      { title: "Dry Ice ❄️", content: "Solid Carbon Dioxide (CO2) is called Dry Ice. It does not melt into liquid; instead, it turns directly into gas at room temperature!" },
      { title: "Plasma: The 4th State ⚡", content: "Most of the matter in the universe is in the Plasma state! It's found in the Sun, stars, and even inside lightning bolts." }
    ]
  },
  "Is Matter Around Us Pure?": {
    quiz: [
      { text: "Which of the following is a pure substance?", options: ["Air", "Milk", "Copper", "Brick"], correctAnswer: 2, explanation: "Copper is an element, a pure substance. Air and milk are mixtures." },
      { text: "A mixture of oil and water can be separated using:", options: ["Filtration", "Separating Funnel", "Evaporation", "Chromatography"], correctAnswer: 1, explanation: "Immiscible liquids like oil and water can be separated based on their densities using a separating funnel." },
      { text: "What is the scattered beam of light seen in a colloid called?", options: ["Reflection", "Refraction", "Tyndall Effect", "Diffraction"], correctAnswer: 2, explanation: "The Tyndall effect is the scattering of light as a light beam passes through a colloid." },
      { text: "Brass is an alloy of which two metals?", options: ["Iron and Carbon", "Copper and Zinc", "Copper and Tin", "Zinc and Tin"], correctAnswer: 1, explanation: "Brass is a solid solution (alloy) made of roughly 70% Copper and 30% Zinc." },
      { text: "Which method is used to separate pigments from natural colors?", options: ["Distillation", "Centrifugation", "Chromatography", "Crystallization"], correctAnswer: 2, explanation: "Chromatography is used for the separation of those solutes that dissolve in the same solvent." }
    ],
    supplements: [
      { title: "Gold Purity: Karats 💍", content: "24 Karat gold is 100% pure gold. But it's too soft for jewelry! Most jewelry is 22K (91.6% gold) mixed with silver or copper for strength." },
      { title: "Universal Solvent 💧", content: "Water is called the 'Universal Solvent' because it can dissolve more substances than any other liquid on Earth!" }
    ]
  },
  "Atoms and Molecules": {
    quiz: [
      { text: "Who proposed the Law of Conservation of Mass?", options: ["John Dalton", "Antoine Lavoisier", "Joseph Proust", "Democritus"], correctAnswer: 1, explanation: "Antoine Lavoisier established that mass is neither created nor destroyed in a chemical reaction." },
      { text: "Calculate the molecular mass of water (H2O). (H=1, O=16)", options: ["18 u", "17 u", "16 u", "20 u"], correctAnswer: 0, explanation: "2*(1) + 16 = 18 atomic mass units." },
      { text: "What is the symbol for Iron?", options: ["Ir", "I", "Fe", "In"], correctAnswer: 2, explanation: "The symbol for Iron is 'Fe', derived from its Latin name 'Ferrum'." },
      { text: "One mole of any substance contains how many particles?", options: ["6.022 x 10^23", "6.22 x 10^22", "1.66 x 10^-27", "9.11 x 10^31"], correctAnswer: 0, explanation: "This is known as Avogadro's Number." },
      { text: "What is the valency of Magnesium (Atomic number 12)?", options: ["1", "2", "3", "4"], correctAnswer: 1, explanation: "Magnesium has electronic configuration 2, 8, 2. It loses 2 electrons to gain stability, so its valency is 2." }
    ],
    supplements: [
      { title: "Avogadro's Number 🔢", content: "602,214,076,000,000,000,000,000! That's how many atoms are in just 12 grams of Carbon. Imagine how small they are!" },
      { title: "Mole Day! 🥧", content: "Chemistry enthusiasts celebrate 'Mole Day' on October 23 (10/23) from 6:02 AM to 6:02 PM, honoring the 6.02x10^23 number." }
    ]
  },
  "Structure of the Atom": {
    quiz: [
      { text: "Who discovered the Electron?", options: ["E. Rutherford", "J.J. Thomson", "J. Chadwick", "Niels Bohr"], correctAnswer: 1, explanation: "Thomson discovered electrons using cathode ray tube experiments." },
      { text: "In Rutherford's experiment, most alpha particles passed straight through the gold foil. This proved:", options: ["Atoms are solid", "Most space in an atom is empty", "Nucleus is large", "Electrons are heavy"], correctAnswer: 1, explanation: "Since most particles passed without deflection, it concluded that most of the atom's volume is empty space." },
      { text: "Neutrum was discovered by:", options: ["Thomson", "Bohr", "Chadwick", "Dalton"], correctAnswer: 2, explanation: "James Chadwick discovered neutrons in 1932." },
      { text: "Atoms of different elements with the same mass number but different atomic numbers are:", options: ["Isotopes", "Isobars", "Isotones", "Isomers"], correctAnswer: 1, explanation: "Isobars (like Calcium and Argon) have same mass number (40)." },
      { text: "The maximum number of electrons that can be accommodated in the 3rd shell (M shell) is:", options: ["8", "18", "32", "2"], correctAnswer: 1, explanation: "Using formula 2n², for n=3, 2*(3^2) = 18 electrons." }
    ],
    supplements: [
      { title: "Empty Space 🌌", content: "If an atom were expanded to the size of a football stadium, the nucleus would be the size of a small marble in the center, and the rest would be empty space!" },
      { title: "Isotopes in Medicine 🏥", content: "Isotopes are used as 'tracers'. Radioactive Iodine is used to treat thyroid problems, and Carbon-14 helps date ancient mummies!" }
    ]
  },
  "The Fundamental Unit of Life": {
    quiz: [
      { text: "Which organelle is known as the 'Powerhouse of the Cell'?", options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi Body"], correctAnswer: 1, explanation: "Mitochondria produce ATP, the energy currency of the cell." },
      { text: "The cell wall in plants is primarily made of:", options: ["Proteins", "Lipids", "Cellulose", "Starch"], correctAnswer: 2, explanation: "Cellulose provides structural strength to plant cells." },
      { text: "Who first discovered cells in a thin slice of cork?", options: ["Robert Hooke", "Leeuwenhoek", "Purkinje", "Virchow"], correctAnswer: 0, explanation: "Robert Hooke discovered honeycomb-like 'cells' in 1665." },
      { text: "Which organelle is called the 'Suicide Bag' of the cell?", options: ["Lysosome", "Vacuole", "Plastid", "ER"], correctAnswer: 0, explanation: "Lysosomes contain digestive enzymes that can digest the cell itself if it's damaged." },
      { text: "Difference between Prokaryotic and Eukaryotic cells is mainly in:", options: ["Cell size", "Presence of nuclear membrane", "Presence of cytoplasm", "Ribosomes"], correctAnswer: 1, explanation: "Eukaryotic cells have a well-defined nucleus with a nuclear membrane." }
    ],
    supplements: [
      { title: "The Largest Cell 🥚", content: "The egg of an ostrich is the largest single cell in the world! It can be up to 6 inches long and weigh 3 pounds." },
      { title: "DNA: Nature's Blueprint 🧬", content: "The DNA inside just one of your cells is about 2 meters long but is tightly packed into a space smaller than a speck of dust!" }
    ]
  },
  "Tissues": {
    quiz: [
      { text: "Which plant tissue is responsible for growth in length?", options: ["Lateral Meristem", "Apical Meristem", "Xylem", "Phloem"], correctAnswer: 1, explanation: "Apical meristems are found at the tips of roots and stems, causing growth in height." },
      { text: "Which tissue connects muscles to bones?", options: ["Ligament", "Tendon", "Cartilage", "Areolar"], correctAnswer: 1, explanation: "Tendons are fibrous connective tissues that join muscles to bones." },
      { text: "Xylem helps in the transport of:", options: ["Food", "Water", "Oxygen", "Waste"], correctAnswer: 1, explanation: "Xylem transports water and minerals from roots to the rest of the plant." },
      { text: "Cardiac muscle is found in:", options: ["Stomach", "Lungs", "Heart", "Legs"], correctAnswer: 2, explanation: "Cardiac muscles are involuntary muscles found exclusively in the heart." },
      { text: "The functional unit of the nervous system is:", options: ["Nephron", "Neuron", "Alveoli", "Capillary"], correctAnswer: 1, explanation: "A neuron (nerve cell) is the basic structural and functional unit of nervous tissue." }
    ],
    supplements: [
      { title: "Tree Rings 🌳", content: "The 'Xylem' tissue created every year forms a ring. Counting these rings tells us the age of the tree and its past climate!" },
      { title: "Electric Signals ⚡", content: "Your brain's tissues use neurons to send signals at speeds up to 268 miles per hour (431 km/h)!" }
    ]
  },
  "Motion": {
    quiz: [
      { text: "If distance is not zero, can displacement be zero?", options: ["No", "Yes", "Depends on speed", "Only in space"], correctAnswer: 1, explanation: "Yes, if the starting and ending points are the same (e.g., one complete trip around a circle), displacement is zero." },
      { text: "The slope of a velocity-time graph gives:", options: ["Distance", "Displacement", "Acceleration", "Force"], correctAnswer: 2, explanation: "The rate of change of velocity (slope) is acceleration." },
      { text: "What is the SI unit of acceleration?", options: ["m/s", "m*s", "m/s^2", "km/h"], correctAnswer: 2, explanation: "Acceleration is velocity per time, so (m/s) / s = m/s^2." },
      { text: "A body moving with constant speed in a straight line has:", options: ["Uniform Velocity", "Zero Acceleration", "Both A and B", "Neither A nor B"], correctAnswer: 2, explanation: "Constant speed in a fixed direction means velocity is uniform and acceleration is zero." },
      { text: "Which equation represents the second equation of motion?", options: ["v = u + at", "s = ut + 1/2at^2", "2as = v^2 - u^2", "F = ma"], correctAnswer: 1, explanation: "This equation relates displacement with time and acceleration." }
    ],
    supplements: [
      { title: "Earth's Speed 🌍", content: "Even while sitting still, you're moving! The Earth rotates at 1,000 mph AND orbits the Sun at 67,000 mph!" },
      { title: "Relative Motion 🚄", content: "If you're in a train and another train passes at the same speed, it looks like it's standing still. That's 'Relative Motion'!" }
    ]
  },
  "Force and Laws of Motion": {
    quiz: [
      { text: "Inertia of an object depends directly on its:", options: ["Volume", "Density", "Mass", "Speed"], correctAnswer: 2, explanation: "Heavier objects have more inertia; they are harder to start or stop moving." },
      { text: "When a bus stops suddenly, passengers tend to fall forward because of:", options: ["Gravity", "Inertia of rest", "Inertia of motion", "Magnetic force"], correctAnswer: 2, explanation: "The lower body stops with the bus, but the upper body tries to continue its forward motion." },
      { text: "Newton's Second Law gives us the formula for Force. It is:", options: ["F = m*v", "F = m*a", "F = m/a", "F = m+a"], correctAnswer: 1, explanation: "Force equals Mass times Acceleration." },
      { text: "A gun recoils when a bullet is fired. This is an example of:", options: ["First Law", "Second Law", "Third Law", "Law of Magnetism"], correctAnswer: 2, explanation: "Action (firing bullet) and Reaction (gun recoil) happen simultaneously in opposite directions." },
      { text: "Impulse is defined as:", options: ["Force / Time", "Force * Time", "Mass * Speed", "Force * Distance"], correctAnswer: 1, explanation: "Impulse is a large force acting for a very short duration, causing a change in momentum." }
    ],
    supplements: [
      { title: "Rocket Science 🚀", content: "Rockets fly because the engines push gas out the back (Action), and the gas pushes the rocket forward (Reaction)! No air needed." },
      { title: "Seatbelts and Inertia 🚗", content: "Seatbelts save lives by overcoming your body's inertia during a crash, stopping you from flying forward." }
    ]
  },
  "Gravitation": {
    quiz: [
      { text: "The value of 'g' (acceleration due to gravity) on Earth's surface is approximately:", options: ["9.8 m/s^2", "10.5 m/s^2", "1.6 m/s^2", "6.67 m/s^2"], correctAnswer: 0, explanation: "9.8 m/s^2 is the standard average value on Earth." },
      { text: "Mass is a scalar quantity, while weight is a:", options: ["Vector", "Scalar", "Chemical", "Constant"], correctAnswer: 0, explanation: "Weight is a force (Mass * gravity) and has direction towards the center of the planet." },
      { text: "Archimedes' Principle relates to:", options: ["Inertia", "Buoyancy", "Acceleration", "Electricity"], correctAnswer: 1, explanation: "It states that an object immersed in a fluid is buoyed up by a force equal to the weight of the fluid it displaces." },
      { text: "Weight of an object on the Moon is about ___ of its weight on Earth.", options: ["1/2", "1/4", "1/6", "1/10"], correctAnswer: 2, explanation: "Moon's gravity is much weaker, about 1/6th of Earth's." },
      { text: "Universal Law of Gravitation was given by:", options: ["Einstein", "Newton", "Galileo", "Bohr"], correctAnswer: 1, explanation: "Sir Isaac Newton formulated the law relating two masses with the distance between them." }
    ],
    supplements: [
      { title: "Tides and Moon 🌊", content: "Did you know the Moon's gravity pulls on the Earth's oceans? This is what causes high and low tides every day!" },
      { title: "Zero G? 👨‍🚀", content: "Astronauts in the ISS aren't actually in 'Zero Gravity'. They are falling around the Earth so fast that they feel weightless!" }
    ]
  },
  "Work and Energy": {
    quiz: [
      { text: "Work done is zero if the angle between force and displacement is:", options: ["0°", "45°", "90°", "180°"], correctAnswer: 2, explanation: "If displacement is perpendicular to force (like carrying a load on your head horizontally), work done is zero." },
      { text: "What is the form of energy possessed by a stretched rubber band?", options: ["Kinetic", "Potential", "Chemical", "Electrical"], correctAnswer: 1, explanation: "Elastic Potential Energy is stored due to the change in shape." },
      { text: "1 Kilowatt-hour (kWh) is equal to:", options: ["3.6 x 10^5 J", "3.6 x 10^6 J", "1000 J", "3600 J"], correctAnswer: 1, explanation: "1 kWh = 1000W * 3600s = 3,600,000 Joules." },
      { text: "Commercial unit of energy commonly used in households (1 unit) is:", options: ["Watt", "Joule", "kWh", "Volt"], correctAnswer: 2, explanation: "Electric bills are calculated in kWh (Units)." },
      { text: "Total mechanical energy of an object is:", options: ["KE - PE", "KE * PE", "KE + PE", "KE / PE"], correctAnswer: 2, explanation: "Total ME is the sum of Kinetic and Potential energy." }
    ],
    supplements: [
      { title: "Bouncing Energy 🏀", content: "A ball doesn't bounce forever because some of its kinetic energy turns into sound and heat every time it hits the floor!" },
      { title: "Sun's Power ☀️", content: "The Sun produces more energy in 1 second than humanity has used since the beginning of time!" }
    ]
  },
  "Sound": {
    quiz: [
      { text: "Sound travels fastest in which medium?", options: ["Air", "Water", "Iron", "Vacuum"], correctAnswer: 2, explanation: "Sound travels fastest in solids because particles are closest together to pass on the vibration." },
      { text: "What defines the loudness of a sound wave?", options: ["Frequency", "Wavelength", "Amplitude", "Speed"], correctAnswer: 2, explanation: "Higher amplitude means a louder sound." },
      { text: "The range of hearing for human beings is:", options: ["20 Hz to 20,000 Hz", "0 Hz to 20 Hz", "Above 20,000 Hz", "None of these"], correctAnswer: 0, explanation: "This is the 'Audible Range'." },
      { text: "Echo can be heard only if the obstacle is at a minimum distance of:", options: ["10.2 m", "17.2 m", "34.4 m", "5 m"], correctAnswer: 1, explanation: "Considering the persistence of hearing (0.1s) and the speed of sound (~344m/s)." },
      { text: "SONAR uses which type of waves?", options: ["Radio waves", "Light waves", "Ultrasonic waves", "Infrared"], correctAnswer: 2, explanation: "Ultrasonic waves are used to detect undersea obstacles and measure depth." }
    ],
    supplements: [
      { title: "Whale Talk 🐋", content: "Blue whales can communicate with each other across 1,000 miles of ocean using low-frequency sounds!" },
      { title: "Quiet Space 🌌", content: "Space is completely silent because there's no air to carry sound vibrations. Screaming won't help!" }
    ]
  },
  "Improvement in Food Resources": {
    quiz: [
      { text: "Which crops are grown in the rainy season (June to October)?", options: ["Rabi", "Kharif", "Zaid", "None"], correctAnswer: 1, explanation: "Kharif crops (Paddy, Soybean, Maize) need plenty of water." },
      { text: "Name a source of carbohydrates in food.", options: ["Pulses", "Wheat", "Oilseeds", "Vegetables"], correctAnswer: 1, explanation: "Cereals like wheat, rice, and maize are rich sources of carbohydrates." },
      { text: "The 'White Revolution' is related to the increase in production of:", options: ["Rice", "Wheat", "Milk", "Eggs"], correctAnswer: 2, explanation: "Dr. Verghese Kurien is known as the father of the White Revolution in India." },
      { text: "What is the advantage of using Manure?", options: ["Rich in chemicals", "Improves soil structure", "Fast acting", "Specific nutrient"], correctAnswer: 1, explanation: "Manure adds organic matter (humus) which improves the water-holding capacity of the soil." },
      { text: "Bee-keeping for honey production is called:", options: ["Sericulture", "Pisciculture", "Apiculture", "Floriculture"], correctAnswer: 2, explanation: "Apiculture is the maintenance of beehives for honey and wax." }
    ],
    supplements: [
      { title: "Golden Rice 🍚", content: "Scientists created 'Golden Rice' which is genetically modified to contain Vitamin A, helping prevent blindness in poor regions!" },
      { title: "Compost Power ♻️", content: "Earthworms are called 'Friends of the Farmer' because they turn waste into rich Vermicompost, the perfect natural fertilizer." }
    ]
  }
};

async function main() {
  console.log('✨ Seeding Quizzes and Supplements for Science Class 9...');

  const subject = await prisma.subject.findFirst({
    where: { name: 'Science', class: 'Class 9' }
  });

  if (!subject) {
    console.error('Science Class 9 subject not found!');
    return;
  }

  const chapters = await prisma.chapter.findMany({
    where: { subjectId: subject.id }
  });

  for (const chapter of chapters) {
    const content = CHAPTER_CONTENT[chapter.title];
    if (!content) {
      console.log(`⚠️ No specific content found for chapter: ${chapter.title}`);
      continue;
    }

    // 1. Seed Supplements (Branch Nodes)
    // Clear old ones first
    await prisma.supplement.deleteMany({ where: { chapterId: chapter.id } });
    for (const s of content.supplements) {
      await prisma.supplement.create({
        data: {
          title: s.title,
          link: `https://en.wikipedia.org/wiki/${s.title.split(' ')[0]}`,
          type: "topic",
          chapterId: chapter.id
        }
      });
    }

    // 2. Seed Quiz
    // Delete existing quiz to avoid duplication
    const existingQuiz = await prisma.quiz.findFirst({ where: { chapterId: chapter.id } });
    if (existingQuiz) {
      await prisma.question.deleteMany({ where: { quizId: existingQuiz.id } });
      await prisma.quiz.delete({ where: { id: existingQuiz.id } });
    }

    const quiz = await prisma.quiz.create({
      data: {
        chapterId: chapter.id
      }
    });

    for (const q of content.quiz) {
      await prisma.question.create({
        data: {
          text: q.text,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          quizId: quiz.id
        }
      });
    }

    console.log(`✅ ${chapter.title}: Quiz & ${content.supplements.length} Supplements added.`);
  }

  console.log('\n🚀 ALL DONE! Class 9 Science is now fully interactive with Branch Nodes and Quizzes.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

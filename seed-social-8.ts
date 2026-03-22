import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const socialSyllabus = {
  History: [
    { title: "How, When and Where", order: 1, supp: "Ancient Maps 🗺️", link: "https://www.youtube.com/watch?v=J_cYceNpptY" },
    { title: "From Trade to Territory", order: 2, supp: "East India Company 🚢", link: "https://www.youtube.com/watch?v=oD5tSwKfueo" },
    { title: "Ruling the Countryside", order: 3, supp: "Indigo Rebellion 🌿", link: "https://www.youtube.com/watch?v=3wpxY7iAbOE" },
    { title: "Tribals, Dikus and Golden Age", order: 4, supp: "Birsa Munda 🏹", link: "https://www.youtube.com/watch?v=USlcEAJ1qe0" },
    { title: "When People Rebel (1857)", order: 5, supp: "Mangal Pandey ⚔️", link: "https://www.youtube.com/watch?v=_KLkno--U8Q" },
    { title: "Civilising the 'Native'", order: 6, supp: "Education Acts 📚", link: "https://www.youtube.com/watch?v=gza1p6pD02E" },
    { title: "Women, Caste and Reform", order: 7, supp: "Social Reformers ⚖️", link: "https://www.youtube.com/watch?v=2epYmlQeARM" },
    { title: "The Making of National Movement", order: 8, supp: "Mahatma Gandhi 🕊️", link: "https://www.youtube.com/watch?v=vyjnmYs-OKU" }
  ],
  Geography: [
    { title: "Resources", order: 1, supp: "Sustainability ♻️", link: "https://www.youtube.com/watch?v=33nxAgnu2Go" },
    { title: "Land, Soil & Water Resources", order: 2, supp: "Water Harvesting 💧", link: "https://www.youtube.com/watch?v=XC0LXdIRwrc" },
    { title: "Agriculture", order: 3, supp: "Organic Farming 🚜", link: "https://www.youtube.com/watch?v=twC6sGGTBD8" },
    { title: "Industries", order: 4, supp: "Industrial Rev 🏭", link: "https://www.youtube.com/watch?v=W6HeHHyHEok" },
    { title: "Human Resources", order: 5, supp: "Population Pyramids 👥", link: "https://www.youtube.com/watch?v=Nw2yHKxrj7o" }
  ],
  Civics: [
    { title: "The Indian Constitution", order: 1, supp: "Fundamental Rights 📜", link: "https://www.youtube.com/watch?v=jwPAD5mCoG0" },
    { title: "Understanding Secularism", order: 2, supp: "Unity in Diversity 🇮🇳", link: "https://www.youtube.com/watch?v=30KW69TViHI" },
    { title: "Why do we need a Parliament?", order: 3, supp: "Lok Sabha vs Rajya Sabha 🗳️", link: "https://www.youtube.com/watch?v=1mk0DJPawUE" },
    { title: "Understanding Laws", order: 4, supp: "How bills are passed 🏛️", link: "https://www.youtube.com/watch?v=2jTIOy8XwIQ" },
    { title: "Judiciary", order: 5, supp: "Supreme Court ⚖️", link: "https://www.youtube.com/watch?v=znuQdbj8Iv8" },
    { title: "Criminal Justice System", order: 6, supp: "Police & Courts 👮", link: "https://www.youtube.com/watch?v=kX45QwDWYFc" },
    { title: "Understanding Marginalisation", order: 7, supp: "Social Equality 🤝", link: "https://www.youtube.com/watch?v=N3Poewhw2wg" },
    { title: "Confronting Marginalisation", order: 8, supp: "Reservation System 📑", link: "https://www.youtube.com/watch?v=b05uHcyK-Xw" },
    { title: "Public Facilities", order: 9, supp: "Healthcare for all 🏥", link: "https://www.youtube.com/watch?v=R0h8aX2yWhg" },
    { title: "Law and Social Justice", order: 10, supp: "Bhopal Gas Tragedy 🧤", link: "https://www.youtube.com/watch?v=bB-h93YiYNg" }
  ]
};

async function main() {
  console.log('Starting seed: Social Science Class 8');

  for (const [subSubject, chapters] of Object.entries(socialSyllabus)) {
    // 1. Ensure Subject exists (Using Sub-subject name directly for API compatibility)
    let subject = await prisma.subject.upsert({
      where: { 
         // We might need a unique constraint or use find + create
         id: 'placeholder-not-needed-for-upsert-with-where'
      },
      update: {},
      create: { name: subSubject, class: "Class 8" }
    }).catch(async () => {
       // Backup if upsert fails due to id mismatch
       let s = await prisma.subject.findFirst({ where: { name: subSubject, class: "Class 8" } });
       if (!s) s = await prisma.subject.create({ data: { name: subSubject, class: "Class 8" } });
       return s;
    });

    console.log(`Processing ${subSubject}...`);

    // 2. Clear existing Chapters for this Subject
    await prisma.chapter.deleteMany({ where: { subjectId: subject.id } });

    for (const ch of chapters) {
      await prisma.chapter.create({
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
    }
    console.log(`Seeded ${chapters.length} chapters for ${subSubject}`);
  }

  console.log('Seed finished: Social Science Class 8');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

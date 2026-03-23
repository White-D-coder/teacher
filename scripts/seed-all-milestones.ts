import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Seeding UNIVERSAL milestone challenges for all subjects...');

  const allSubjects = await prisma.subject.findMany({
    include: { chapters: { orderBy: { orderIndex: 'asc' } } }
  });

  for (const subject of allSubjects) {
    console.log(`Processing ${subject.name} - ${subject.class}...`);
    
    // 1. Remove any existing Star/Milestone chapters to reset if needed
    // Actually, we'll keep it clean: only add if missing every 4 chapters.
    const chapters = subject.chapters.filter(c => !c.title.includes('⭐'));
    
    // We want a milestone after every 4 real chapters.
    // Positions will be 5, 10, 15... (relative to new order)
    
    let offset = 0;
    for (let i = 0; i < chapters.length; i++) {
        const standardIndex = i + 1 + offset;
        
        // Update the current standard chapter index
        await prisma.chapter.update({
            where: { id: chapters[i].id },
            data: { orderIndex: standardIndex }
        });

        if ((i + 1) % 4 === 0) {
            // After every 4 chapters, insert a milestone
            offset++;
            const milestoneIndex = i + 1 + offset;
            const weekNum = offset + (offset - 1) * 0; // Just simple week increment
            
            const milestoneTitle = `Week ${offset + 1}: Grand Challenge ⭐`;
            
            // Check if it already exists at this index/title for this subject
            const existing = await prisma.chapter.findFirst({
                where: { subjectId: subject.id, title: milestoneTitle }
            });

            if (!existing) {
                console.log(`  Adding ${milestoneTitle} at index ${milestoneIndex}`);
                await prisma.chapter.create({
                    data: {
                        title: milestoneTitle,
                        subjectId: subject.id,
                        orderIndex: milestoneIndex,
                        writtenQuestion: `⭐ WEEK ${offset + 1}: GRAND CHALLENGE ⭐
                        
1. [Easy] Summarize the 3 most important concepts you learned in the last 4 chapters of "${subject.name}".
2. [Easy] Explain a real-world application of one topic from these chapters that you found most interesting.
3. [Medium] Compare two major ideas from this week's study. How are they different yet connected?
4. [Medium] Solve a conceptual problem or explain a process from the current unit step-by-step.
5. [Hard] Analyze how the last 4 chapters are linked. Discuss one way this knowledge can help solve a global problem (like climate change, health, or poverty).`
                    }
                });
            } else {
                // If it exists, just update its index
                await prisma.chapter.update({
                    where: { id: existing.id },
                    data: { orderIndex: milestoneIndex }
                });
            }
        }
    }
  }

  console.log('\n✨ Finished! Universal milestones are now live for all subjects.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

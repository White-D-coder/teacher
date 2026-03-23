'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { Star, Lock, CheckCircle2 } from 'lucide-react';
import styles from './Roadmap.module.css';

interface Chapter {
  id: string;
  title: string;
  isCompleted: boolean;
  isUnlocked: boolean;
  order: number;
  supplements?: any[];
}

interface RoadmapProps {
  chapters: Chapter[];
  onChapterClick: (chapter: any) => void;
  activeChapterId?: string;
}

export default function Roadmap({ chapters, onChapterClick, activeChapterId }: RoadmapProps) {
  // Sort chapters by order
  const sortedChapters = [...chapters].sort((a, b) => a.order - b.order);

  const getCategoryColor = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (/(crop|microorganisms|conservation|cell|reproduction|adolescence)/.test(lowerTitle)) return '#6BCB77'; // Green (Biology)
    if (/(phenomena|light|stars|pollution)/.test(lowerTitle)) return '#4D96FF'; // Blue (Environment)
    if (/(force|friction|sound|electric)/.test(lowerTitle)) return '#FF6B6B'; // Red (Physics)
    if (/(coal|combustion)/.test(lowerTitle)) return '#FFE66D'; // Yellow (Chemistry)
    return '#FF6B6B'; // Default Active Accent
  };

  // Generate SVG path points
  const points = sortedChapters.map((_, index) => {
    const x = 200 + Math.sin(index * 1.2) * 80; // Snake effect, centered at 200
    const y = 80 + index * 120; // More vertical spacing
    return { x, y };
  });

  // Create SVG path string
  const pathD = points.reduce((acc, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    const prev = points[index - 1];
    // Bezier curve for smoothness
    const cp1y = prev.y + (point.y - prev.y) / 2;
    const cp2y = prev.y + (point.y - prev.y) / 2;
    return `${acc} C ${prev.x} ${cp1y}, ${point.x} ${cp2y}, ${point.x} ${point.y}`;
  }, '');

  return (
    <div className={styles.roadmapContainer}>
      <svg className={styles.svgLine} viewBox={`0 0 500 ${points.length * 120 + 120}`}>
        <path d={pathD} className={styles.pathBg} />
        <path d={pathD} className={styles.pathProgress} />
        
        {points.map((point, index) => {
          const chapter = sortedChapters[index];
          const isActive = activeChapterId === chapter.id;
          const isCompleted = chapter.isCompleted;
          const isLocked = !chapter.isUnlocked;
          
          const nodeColor = getCategoryColor(chapter.title);
          const isMilestone = chapter.title.includes('⭐');

          return (
            <g key={chapter.id}>
              {/* Branch nodes for additional topics */}
              {!isMilestone && chapter.supplements?.map((supp, suppIdx) => {
                const suppX = point.x + (index % 2 === 0 ? 80 : -80);
                const suppY = point.y + (suppIdx * 45 - 20);
                return (
                  <g key={supp.id} className={styles.supplementNode}>
                    <path 
                      d={`M ${point.x} ${point.y} L ${suppX} ${suppY}`} 
                      stroke={nodeColor} 
                      strokeWidth="2" 
                      strokeDasharray="4 4" 
                    />
                    <circle cx={suppX} cy={suppY} r="14" fill="var(--bg, #f4f6fa)" stroke={nodeColor} strokeWidth="2" />
                    <text x={suppX} y={suppY + 1} dominantBaseline="middle" textAnchor="middle" fontSize="12" fill={nodeColor}>+</text>
                    
                    {/* Tooltip implementation */}
                    <foreignObject x={index % 2 === 0 ? suppX + 18 : suppX - 168} y={suppY - 15} width="150" height="40" className={styles.suppLabelObj}>
                      <div className={styles.suppTooltip}>{supp.title}</div>
                    </foreignObject>
                  </g>
                );
              })}

              <g 
                className={`${styles.node} ${isActive ? styles.active : ''} ${isLocked ? styles.locked : ''} ${isMilestone ? styles.milestone : ''}`}
                onClick={() => !isLocked && onChapterClick(chapter)}
              >
                {isMilestone ? (
                   /* Milestone Star Node */
                   <path 
                      d="M 0 -25 L 7 -10 L 23 -7.5 L 12 3.5 L 14.5 19.5 L 0 12 L -14.5 19.5 L -12 3.5 L -23 -7.5 L -7 -10 Z"
                      transform={`translate(${point.x}, ${point.y}) scale(${isActive ? 1.5 : 1.25})`}
                      style={{
                        fill: isActive ? '#FFD700' : (isLocked ? '#f0f0f0' : '#FFD700'),
                        stroke: isLocked ? '#ccc' : '#FFA500',
                        strokeWidth: 2,
                        filter: !isLocked ? 'drop-shadow(0 0 12px #FFD700)' : 'none',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                   />
                ) : (
                  <circle 
                    cx={point.x} cy={point.y} 
                    r={isActive ? 25 : 22} 
                    style={{
                      fill: isActive ? nodeColor : (isLocked ? '#f0f0f0' : 'white'),
                      stroke: isLocked ? '#ccc' : nodeColor,
                      strokeWidth: isActive ? 0 : 3,
                      filter: !isLocked && !isActive ? `drop-shadow(0 0 8px ${nodeColor}66)` : 'none',
                      transition: 'all 0.3s ease'
                    }}
                  />
                )}
                
                <text 
                  x={point.x} 
                  y={isMilestone ? point.y + 2 : point.y + 1} 
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: isMilestone ? '10px' : '14px',
                    fontWeight: isMilestone ? 'bold' : 'normal',
                    pointerEvents: 'none',
                    fill: isActive ? (isMilestone ? '#945D00' : 'white') : (isLocked ? '#999' : (isMilestone ? '#945D00' : 'var(--text-color, #333)'))
                  }}
                  dominantBaseline="middle" 
                  textAnchor="middle"
                >
                  {isMilestone ? "STAR" : index + 1}
                </text>
                
                {/* Optional: Stars above completed nodes */}
                {isCompleted && (
                  <g transform={`translate(${point.x - 12}, ${point.y - 35})`}>
                    <Star size={16} fill="#FFD700" color="#FFD700" />
                    <Star size={16} fill="#FFD700" color="#FFD700" transform="translate(8, -6)" />
                    <Star size={16} fill="#FFD700" color="#FFD700" transform="translate(16, 0)" />
                  </g>
                )}

                {/* Status Icons & Title Label */}
                <foreignObject x={point.x + (isMilestone ? 45 : 35)} y={point.y - 18} width="280" height="60">
                  <div className={styles.labelWrapper}>
                    <span className={`${styles.lessonTitle} ${isMilestone ? styles.grandChallenge : ''}`} title={chapter.title}>
                      {chapter.title}
                    </span>
                    {isLocked && <Lock size={14} className={styles.lockIcon} />}
                    {isCompleted && <CheckCircle2 size={14} className={styles.doneIcon} />}
                  </div>
                </foreignObject>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

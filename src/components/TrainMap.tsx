import React, { useMemo, useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { gsap } from 'gsap';
import { getLessonsForChapter } from '../data/lessons/index';
import { getChapterById } from '../data/curriculum';
import type { LessonDef } from '../data/lessons/types';
import { getLessonProgressById, isLessonUnlocked } from '../engine/sessionStore';
import { soundEngine } from '../utils/audio';
import { useI18n } from '../context/I18nContext';
import { getLocalizedChapter, getLocalizedLesson } from '../data/curriculumI18n';

/** Region definitions — now derived from the selected chapter */
function buildRegionsForChapter(lessons: LessonDef[], chapterColor: string, chapterTitle: string) {
  // Split lessons into up to 3 visual regions for the map
  const total = lessons.length;
  if (total <= 10) {
    return [{
      name: chapterTitle,
      range: [0, total - 1] as [number, number],
      color: chapterColor,
      icon: '🗺️',
      description: '',
      signPos: { x: 800, y: 155 },
    }];
  }
  const third = Math.ceil(total / 3);
  return [
    { name: 'Start', range: [0, third - 1] as [number, number], color: '#22C55E', icon: '🟢', description: '', signPos: { x: 300, y: 160 } },
    { name: 'Middle', range: [third, third * 2 - 1] as [number, number], color: '#F97316', icon: '🟡', description: '', signPos: { x: 700, y: 155 } },
    { name: 'Finish', range: [third * 2, total - 1] as [number, number], color: '#A855F7', icon: '🏁', description: '', signPos: { x: 1100, y: 140 } },
  ];
}

interface TiePoint {
  x: number;
  y: number;
  angle: number;
}

interface TrainMapProps {
  className?: string;
  chapterId?: string;
}

export const TrainMap: React.FC<TrainMapProps> = ({ className = '', chapterId = 'home-row' }) => {
  const navigate = useNavigate();
  const pathRef = useRef<SVGPathElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [stationPoints, setStationPoints] = useState<{ x: number; y: number; angle: number }[]>([]);
  const [tiePoints, setTiePoints] = useState<TiePoint[]>([]);

  // Get filtered lessons for the selected chapter
  const { currentLang } = useI18n();
  const rawChapterInfo = getChapterById(chapterId);
  const chapterInfo = rawChapterInfo ? getLocalizedChapter(rawChapterInfo, currentLang) : undefined;
  const chapterLessons = useMemo(() => getLessonsForChapter(chapterId), [chapterId]);
  const REGIONS = useMemo(
    () => buildRegionsForChapter(chapterLessons, chapterInfo?.color ?? '#22C55E', chapterInfo?.title ?? 'Chapter'),
    [chapterLessons, chapterInfo]
  );

  // Count completed lessons within this chapter
  const completedCount = useMemo(() => {
    return chapterLessons.filter(l => getLessonProgressById(l.id)?.completed).length;
  }, [chapterLessons]);

  // Grand Full-Screen SVG Dimensions (Widescreen 16:9 aspect ratio)
  const svgW = 1600;
  const svgH = 900;

  // Curvy railway path winding from bottom-left to top-right summit
  const trackPath = `M 100 780 
    C 210 780, 270 740, 360 700 
    C 460 660, 540 610, 480 500 
    C 420 400, 260 410, 220 340 
    C 180 270, 290 260, 420 270 
    C 550 280, 660 330, 770 330 
    C 880 330, 980 300, 1080 270 
    C 1190 240, 1280 180, 1490 120`;

  // Calculate station positions and sleeper tie angles along the path
  useEffect(() => {
    if (pathRef.current) {
      const totalLength = pathRef.current.getTotalLength();

      // Calculate station points along the path for this chapter's lessons
      const stationCount = chapterLessons.length;
      const points: { x: number; y: number; angle: number }[] = [];
      for (let i = 0; i < stationCount; i++) {
        const t = 0.04 + (i / Math.max(1, stationCount - 1)) * 0.92;
        const pt = pathRef.current.getPointAtLength(t * totalLength);
        const aheadPt = pathRef.current.getPointAtLength(Math.min(1, t + 0.01) * totalLength);
        const angle = (Math.atan2(aheadPt.y - pt.y, aheadPt.x - pt.x) * 180) / Math.PI;
        points.push({ x: pt.x, y: pt.y, angle });
      }
      setStationPoints(points);

      // Generate wooden sleeper ties spaced every ~20px along the track
      const ties: TiePoint[] = [];
      const numTies = Math.floor(totalLength / 21);
      for (let j = 0; j < numTies; j++) {
        const tLen = (j / numTies) * totalLength;
        const pt = pathRef.current.getPointAtLength(tLen);
        const nextPt = pathRef.current.getPointAtLength(Math.min(totalLength, tLen + 2));
        const angle = (Math.atan2(nextPt.y - pt.y, nextPt.x - pt.x) * 180) / Math.PI;
        ties.push({ x: pt.x, y: pt.y, angle });
      }
      setTiePoints(ties);
    }
  }, [chapterId, chapterLessons]);

  // Find current station (first incomplete unlocked lesson)
  const currentStationIdx = useMemo(() => {
    for (let i = 0; i < chapterLessons.length; i++) {
      const progress = getLessonProgressById(chapterLessons[i].id);
      if (!progress?.completed) return i;
    }
    return Math.max(0, chapterLessons.length - 1);
  }, [completedCount, chapterLessons]);

  // Train position progress state
  const [trainProgress, setTrainProgress] = useState(0);
  const prevIdxRef = useRef(currentStationIdx);

  useEffect(() => {
    if (stationPoints.length === 0 || !pathRef.current) return;

    const stationCount = chapterLessons.length;
    const startT = 0.04 + (prevIdxRef.current / Math.max(1, stationCount - 1)) * 0.92;
    const endT = 0.04 + (currentStationIdx / Math.max(1, stationCount - 1)) * 0.92;

    if (currentStationIdx !== prevIdxRef.current) {
      soundEngine.playLevelUnlock();

      const animObj = { p: startT };
      gsap.to(animObj, {
        p: endT,
        duration: 2.6,
        ease: 'power2.inOut',
        onUpdate: () => {
          setTrainProgress(animObj.p);
        },
        onComplete: () => {
          prevIdxRef.current = currentStationIdx;
        },
      });
    } else {
      setTrainProgress(endT);
    }
  }, [currentStationIdx, stationPoints]);

  // Exact Train orientation & coordinates
  const trainCoords = useMemo(() => {
    if (!pathRef.current || stationPoints.length === 0) return null;
    const totalLength = pathRef.current.getTotalLength();
    const point = pathRef.current.getPointAtLength(trainProgress * totalLength);

    const aheadT = Math.min(1.0, trainProgress + 0.015);
    const aheadPoint = pathRef.current.getPointAtLength(aheadT * totalLength);
    const angleRad = Math.atan2(aheadPoint.y - point.y, aheadPoint.x - point.x);
    const angleDeg = (angleRad * 180) / Math.PI;

    return { x: point.x, y: point.y, angle: angleDeg };
  }, [trainProgress, stationPoints]);

  const getRegionForStation = (stationIdx: number) => {
    return REGIONS.find((r) => stationIdx >= r.range[0] && stationIdx <= r.range[1]);
  };

  return (
    <div
      ref={containerRef}
      className={`w-full flex-1 flex flex-col relative rounded-3xl overflow-hidden shadow-2xl select-none border-4 border-slate-700/50 bg-[#0F1A36] ${className}`}
      style={{
        minHeight: 'calc(100vh - 180px)',
        backgroundColor: '#0F1A36',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Night Sky & Mountain Gradients */}
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0F1A36" />
            <stop offset="35%" stopColor="#1E294B" />
            <stop offset="70%" stopColor="#313E68" />
            <stop offset="100%" stopColor="#5B4A7E" />
          </linearGradient>

          <linearGradient id="mountainFar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#334168" />
            <stop offset="100%" stopColor="#1E2742" />
          </linearGradient>

          <linearGradient id="mountainMid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2A385E" />
            <stop offset="100%" stopColor="#18223C" />
          </linearGradient>

          <linearGradient id="mountainNear" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1E294B" />
            <stop offset="100%" stopColor="#11182E" />
          </linearGradient>

          <linearGradient id="mountainFore" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#16203B" />
            <stop offset="100%" stopColor="#0B1020" />
          </linearGradient>

          <linearGradient id="mountainBase" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10172B" />
            <stop offset="100%" stopColor="#060913" />
          </linearGradient>

          <linearGradient id="mountainMist" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.0" />
            <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
          </linearGradient>

          {/* CTA Banner Gradient */}
          <linearGradient id="startHereGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="45%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>

          {/* Realistic Metallic Steel Rail Gradients */}
          <linearGradient id="steelRailGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="35%" stopColor="#CBD5E1" />
            <stop offset="70%" stopColor="#64748B" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>

          {/* Wooden Tie Gradient */}
          <linearGradient id="woodTieGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#45271F" />
            <stop offset="25%" stopColor="#6D4C41" />
            <stop offset="50%" stopColor="#9C786C" />
            <stop offset="75%" stopColor="#6D4C41" />
            <stop offset="100%" stopColor="#45271F" />
          </linearGradient>

          {/* Glow Filters */}
          <filter id="beaconGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="goldGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="dropShadowDark" x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000000" floodOpacity="0.75" />
          </filter>
        </defs>

        {/* ─── LAYER 1: SKY & CELESTIAL BACKGROUND ─────────────────── */}
        <rect x="-200" y="-200" width={svgW + 400} height={svgH + 400} fill="url(#skyGrad)" />

        {/* Twinkling Stars in Sky */}
        {[
          { cx: 120, cy: 60, s: 2.5, d: 2 },
          { cx: 280, cy: 90, s: 3.5, d: 3 },
          { cx: 480, cy: 50, s: 2, d: 1.5 },
          { cx: 680, cy: 80, s: 3, d: 2.5 },
          { cx: 880, cy: 45, s: 3.8, d: 4 },
          { cx: 1080, cy: 90, s: 2.2, d: 2 },
          { cx: 1280, cy: 55, s: 3.2, d: 3.5 },
          { cx: 1480, cy: 70, s: 2.8, d: 1.8 },
          { cx: 380, cy: 130, s: 2, d: 3.2 },
          { cx: 780, cy: 120, s: 2.5, d: 2.2 },
          { cx: 960, cy: 110, s: 2.0, d: 2.8 },
          { cx: 1180, cy: 120, s: 2.6, d: 3.1 },
        ].map((star, idx) => (
          <motion.circle
            key={`star-${idx}`}
            cx={star.cx}
            cy={star.cy}
            r={star.s}
            fill="#FEF08A"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.3, 0.8] }}
            transition={{ repeat: Infinity, duration: star.d, ease: 'easeInOut', delay: idx * 0.3 }}
          />
        ))}

        {/* Luminous Glowing Moon (Positioned high in clear night sky) */}
        <g transform="translate(1350, 48)">
          <motion.g
            animate={{ opacity: [0.88, 1, 0.88] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          >
            <circle cx="0" cy="0" r="34" fill="#FEF08A" opacity="0.18" filter="url(#beaconGlow)" />
            <circle cx="0" cy="0" r="22" fill="#FEF08A" opacity="0.95" />
            <circle cx="-8" cy="-6" r="19" fill="#0F1A36" />
          </motion.g>
        </g>

        {/* Floating Cartoon Night Clouds (with top headroom) */}
        {[
          { x: 260, y: 95, scale: 1.05, speed: 45 },
          { x: 680, y: 120, scale: 0.85, speed: 60 },
          { x: 1060, y: 100, scale: 0.95, speed: 50 },
        ].map((cloud, idx) => (
          <motion.g
            key={`cloud-night-${idx}`}
            transform={`translate(${cloud.x}, ${cloud.y}) scale(${cloud.scale})`}
            animate={{ x: [cloud.x, cloud.x + 60, cloud.x] }}
            transition={{ repeat: Infinity, duration: cloud.speed, ease: 'easeInOut' }}
            opacity="0.25"
          >
            <path
              d="M 20,40 Q 20,20 40,20 Q 55,5 75,15 Q 95,0 115,15 Q 135,15 145,30 Q 160,35 155,50 Q 155,65 135,65 L 30,65 Q 15,65 20,40 Z"
              fill="#94A3B8"
            />
          </motion.g>
        ))}

        {/* ─── LAYER 2: NIGHT MOUNTAIN RANGES & VALLEYS ─────────────────── */}
        {/* Distant Mountain Peaks with Moonlit Snow Caps */}
        <path
          d="M 0,480 L 160,260 L 320,480 L 520,220 L 720,480 L 980,180 L 1220,460 L 1420,130 L 1600,400 L 1600,900 L 0,900 Z"
          fill="url(#mountainFar)"
        />
        {/* Moonlit Snow Caps */}
        <polygon points="160,260 135,300 150,290 160,305 175,290 185,300" fill="#E2E8F0" opacity="0.85" />
        <polygon points="520,220 485,275 505,260 520,280 540,265 555,275" fill="#E2E8F0" opacity="0.85" />
        <polygon points="980,180 940,245 965,230 980,250 1005,235 1020,245" fill="#E2E8F0" opacity="0.85" />
        <polygon points="1420,130 1380,195 1405,180 1420,200 1445,185 1460,195" fill="#E2E8F0" opacity="0.9" />

        {/* Mid-ground Night Mountains */}
        <path
          d="M 0,560 Q 240,420 480,520 Q 780,380 1080,500 Q 1360,360 1600,460 L 1600,900 L 0,900 Z"
          fill="url(#mountainMid)"
        />

        {/* Subtle Valley Night Mist */}
        <rect x="0" y="520" width={svgW} height="120" fill="url(#mountainMist)" />

        {/* Near Night Mountain Ridge */}
        <path
          d="M 0,670 Q 300,530 600,630 Q 900,490 1200,610 Q 1450,510 1600,570 L 1600,900 L 0,900 Z"
          fill="url(#mountainNear)"
        />
        {/* Moonlit Ridge Rim Highlight */}
        <path
          d="M 0,670 Q 300,530 600,630 Q 900,490 1200,610 Q 1450,510 1600,570"
          stroke="#475569"
          strokeWidth="1.5"
          fill="none"
          opacity="0.45"
        />

        {/* Foreground Dark Mountain Ridges */}
        <path
          d="M 0,750 Q 250,610 500,720 Q 800,590 1100,700 Q 1380,610 1600,690 L 1600,900 L 0,900 Z"
          fill="url(#mountainFore)"
        />
        {/* Moonlit Ridge Rim Highlight */}
        <path
          d="M 0,750 Q 250,610 500,720 Q 800,590 1100,700 Q 1380,610 1600,690"
          stroke="#334155"
          strokeWidth="1.5"
          fill="none"
          opacity="0.35"
        />

        {/* Deep Night Base Valley Terrain */}
        <path
          d="M 0,830 Q 280,730 600,810 Q 950,710 1300,790 Q 1480,750 1600,790 L 1600,900 L 0,900 Z"
          fill="url(#mountainBase)"
        />

        {/* ─── LAYER 3: NOCTURNAL ALPINE PINES & DECOR ────────────────────────── */}
        {/* Midnight Alpine Pine Trees */}
        {[
          { x: 60, y: 660, s: 1.3 },
          { x: 120, y: 680, s: 1.0 },
          { x: 440, y: 580, s: 1.2 },
          { x: 490, y: 600, s: 0.9 },
          { x: 280, y: 380, s: 1.2 },
          { x: 680, y: 420, s: 1.3 },
          { x: 740, y: 450, s: 1.0 },
          { x: 980, y: 360, s: 1.3 },
          { x: 1040, y: 380, s: 0.9 },
          { x: 1220, y: 280, s: 1.2 },
          { x: 1420, y: 180, s: 1.3 },
        ].map((tree, idx) => (
          <g key={`tree-${idx}`} transform={`translate(${tree.x}, ${tree.y}) scale(${tree.s})`}>
            <rect x="-3.5" y="0" width="7" height="12" fill="#1E1B18" rx="1" />
            <polygon points="0,-28 -14,-12 14,-12" fill="#172635" />
            <polygon points="0,-20 -16,-3 16,-3" fill="#1E3244" />
            <polygon points="0,-12 -18,6 18,6" fill="#284257" />
          </g>
        ))}

        {/* Milestone Treasure Chests */}
        {/* Level 5 Milestone Chest */}
        <g transform="translate(230, 460) scale(1.1)">
          <motion.g
            whileHover={{ scale: 1.2, rotate: 5 }}
            className="cursor-pointer"
            onClick={() => soundEngine.playLevelUnlock()}
          >
            <circle cx="0" cy="0" r="20" fill="#F59E0B" opacity="0.15" />
            <rect x="-15" y="-7" width="30" height="20" rx="4" fill="#B45309" stroke="#78350F" strokeWidth="2.2" />
            <path d="M -15,-7 Q 0,-18 15,-7 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1.8" />
            <rect x="-4" y="-2" width="8" height="7" rx="1.5" fill="#FEF08A" stroke="#B45309" strokeWidth="1.2" />
            <text x="0" y="-20" textAnchor="middle" fontSize="13">🎁</text>
          </motion.g>
        </g>

        {/* Level 7 Milestone Gem Chest */}
        <g transform="translate(800, 390) scale(1.1)">
          <motion.g
            whileHover={{ scale: 1.2, rotate: -5 }}
            className="cursor-pointer"
            onClick={() => soundEngine.playLevelUnlock()}
          >
            <circle cx="0" cy="0" r="20" fill="#8B5CF6" opacity="0.15" />
            <rect x="-15" y="-7" width="30" height="20" rx="4" fill="#6D28D9" stroke="#4C1D95" strokeWidth="2.2" />
            <path d="M -15,-7 Q 0,-18 15,-7 Z" fill="#A78BFA" stroke="#6D28D9" strokeWidth="1.8" />
            <rect x="-4" y="-2" width="8" height="7" rx="1.5" fill="#FEF08A" stroke="#4C1D95" strokeWidth="1.2" />
            <text x="0" y="-20" textAnchor="middle" fontSize="13">💎</text>
          </motion.g>
        </g>

        {/* Level 10 Summit Trophy - Safely placed near summit Station 10 */}
        <g transform="translate(1475, 65) scale(1.2)">
          <motion.g
            animate={{ y: [0, -6, 0], rotate: [0, 2, -2, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          >
            <circle cx="0" cy="0" r="28" fill="#EAB308" opacity="0.3" filter="url(#beaconGlow)" />
            <text x="0" y="8" textAnchor="middle" fontSize="28">🏆</text>
            <text x="0" y="22" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="#FEF08A">
              CHAMPION
            </text>
          </motion.g>
        </g>

        {/* ─── LAYER 4: STYLIZED 3D CARTOON RAILWAY TRACK ───────────── */}
        <path ref={pathRef} d={trackPath} fill="none" stroke="none" />

        {/* Track Ballast Gravel Bed */}
        <path d={trackPath} stroke="#22150C" strokeWidth="44" strokeLinecap="round" fill="none" opacity="0.8" />
        <path d={trackPath} stroke="#3E2723" strokeWidth="36" strokeLinecap="round" fill="none" />

        {/* Wooden Sleeper Ties */}
        {tiePoints.map((tie, idx) => (
          <g key={`tie-${idx}`} transform={`translate(${tie.x}, ${tie.y}) rotate(${tie.angle + 90})`}>
            <rect
              x="-20"
              y="-4"
              width="40"
              height="8"
              rx="2"
              fill="url(#woodTieGrad)"
              stroke="#2B1408"
              strokeWidth="1"
              filter="drop-shadow(0 2px 2px rgba(0,0,0,0.5))"
            />
            <circle cx="-12" cy="0" r="1.6" fill="#94A3B8" stroke="#1E293B" strokeWidth="0.6" />
            <circle cx="12" cy="0" r="1.6" fill="#94A3B8" stroke="#1E293B" strokeWidth="0.6" />
          </g>
        ))}

        {/* Dual Metallic Steel Rails */}
        {/* Upper Rail */}
        <path d={trackPath} stroke="#0F172A" strokeWidth="10" fill="none" transform="translate(0, -5.5)" />
        <path d={trackPath} stroke="url(#steelRailGrad)" strokeWidth="5.5" fill="none" transform="translate(0, -5.5)" />
        <path d={trackPath} stroke="#FFFFFF" strokeWidth="1.5" fill="none" opacity="0.75" transform="translate(0, -6.5)" />

        {/* Lower Rail */}
        <path d={trackPath} stroke="#0F172A" strokeWidth="10" fill="none" transform="translate(0, 5.5)" />
        <path d={trackPath} stroke="url(#steelRailGrad)" strokeWidth="5.5" fill="none" transform="translate(0, 5.5)" />
        <path d={trackPath} stroke="#FFFFFF" strokeWidth="1.5" fill="none" opacity="0.75" transform="translate(0, 4.5)" />


        {/* ─── LAYER 6: LARGE LEVEL NODES & STATIONS ─────────────────── */}
        {stationPoints.map((pt, i) => {
          const lesson = chapterLessons[i];
          if (!lesson) return null;

          const progress = getLessonProgressById(lesson.id);
          const unlocked = isLessonUnlocked(lesson.id);
          const completed = progress?.completed === true;
          const stars = progress?.starsEarned || 0;
          const isCurrent = i === currentStationIdx;
          const isNextTarget = isCurrent && !completed;
          const region = getRegionForStation(i);

          return (
            <g
              key={`station-${lesson.id}`}
              className="cursor-pointer"
              onClick={() => {
                if (unlocked) {
                  soundEngine.playPop();
                  navigate(`/learn/${lesson.id}`);
                }
              }}
            >
              <g transform={`translate(${pt.x}, ${pt.y}) scale(${chapterLessons.length > 18 ? 0.65 : chapterLessons.length > 12 ? 0.78 : 1.0})`}>
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={unlocked ? { scale: 1.15, y: -4 } : { scale: 1 }}
                  transition={{ delay: i * 0.02, type: 'spring', stiffness: 220, damping: 15 }}
                >
                  {/* Pulsing Next Target Halo & Concentric Waves */}
                  {isNextTarget && (
                    <>
                      {/* Expanding Ripple Ring 1 */}
                      <motion.circle
                        cx="0"
                        cy="0"
                        r="52"
                        fill="#F59E0B"
                        opacity="0.3"
                        filter="url(#beaconGlow)"
                        animate={{ scale: [1, 1.45, 1], opacity: [0.45, 0.08, 0.45] }}
                        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                      />
                      {/* Expanding Ripple Ring 2 */}
                      <motion.circle
                        cx="0"
                        cy="0"
                        r="42"
                        fill="none"
                        stroke="#FEF08A"
                        strokeWidth="3.5"
                        strokeDasharray="8 5"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                      />
                    </>
                  )}

                  {/* 3D Platform Shadow */}
                  <ellipse cx="0" cy="12" rx="40" ry="24" fill="rgba(0, 0, 0, 0.55)" filter="blur(4px)" />

                  {/* Large Train Station Circular Badge (Diameter ~74px) */}
                  <circle
                    cx="0"
                    cy="0"
                    r="37"
                    fill={
                      completed
                        ? '#16A34A'
                        : isNextTarget
                        ? '#EA580C'
                        : unlocked
                        ? region?.color || '#2563EB'
                        : '#1E293B'
                    }
                    stroke={completed ? '#86EFAC' : isNextTarget ? '#FEF08A' : unlocked ? '#93C5FD' : '#475569'}
                    strokeWidth={isCurrent || isNextTarget ? 5 : 3.5}
                    filter="url(#dropShadowDark)"
                  />

                  {/* Inner Bevel Disc */}
                  <circle
                    cx="0"
                    cy="0"
                    r="29"
                    fill={
                      completed
                        ? '#15803D'
                        : isNextTarget
                        ? '#F59E0B'
                        : '#0F172A'
                    }
                    stroke="rgba(255, 255, 255, 0.25)"
                    strokeWidth="1.5"
                  />

                  {/* Level Number or Icon */}
                  {completed ? (
                    <text
                      x="0"
                      y="3"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="26"
                      fontWeight="900"
                      fill="#FFFFFF"
                      fontFamily="Nunito, system-ui, sans-serif"
                      style={{ textShadow: '0 2px 6px rgba(0,0,0,0.9)' }}
                    >
                      {lesson.icon}
                    </text>
                  ) : unlocked ? (
                    <text
                      x="0"
                      y="2"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="22"
                      fontWeight="900"
                      fill="#FFFFFF"
                      fontFamily="Nunito, system-ui, sans-serif"
                      style={{ textShadow: '0 3px 6px rgba(0,0,0,0.9)' }}
                    >
                      {lesson.id}
                    </text>
                  ) : (
                    <g transform="translate(-11, -11)">
                      <Lock width={22} height={22} color="#94A3B8" strokeWidth={2.4} />
                    </g>
                  )}

                  {/* Top "LEVEL X" Header Banner Pill (Separated cleanly above circle) */}
                  <g transform="translate(0, -52)">
                    <rect
                      x="-48"
                      y="-12"
                      width="96"
                      height="24"
                      rx="12"
                      fill={
                        completed
                          ? '#16A34A'
                          : isNextTarget
                          ? '#EA580C'
                          : unlocked
                          ? '#2563EB'
                          : '#1E293B'
                      }
                      stroke={completed ? '#BBF7D0' : isNextTarget ? '#FEF08A' : unlocked ? '#BFDBFE' : '#475569'}
                      strokeWidth="2"
                      filter="url(#dropShadowDark)"
                    />
                    <text
                      x="0"
                      y="4"
                      textAnchor="middle"
                      fill={unlocked || completed ? '#FFFFFF' : '#94A3B8'}
                      fontSize="11.5"
                      fontWeight="900"
                      fontFamily="Nunito, system-ui, sans-serif"
                      letterSpacing="0.8"
                      style={{ textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}
                    >
                      LEVEL {lesson.id}
                    </text>
                  </g>

                  {/* High-Impact Animated "START HERE!" / "PLAY NEXT!" CTA Tooltip */}
                  {isNextTarget && (
                    <g transform="translate(0, -96)">
                      <motion.g
                        animate={{ y: [0, -7, 0] }}
                        transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
                      >
                        {/* Tooltip Glow Background */}
                        <rect
                          x="-68"
                          y="-16"
                          width="136"
                          height="32"
                          rx="16"
                          fill="url(#startHereGrad)"
                          stroke="#FFFFFF"
                          strokeWidth="2.5"
                          filter="url(#dropShadowDark)"
                        />
                        {/* Downward Pointer Triangle */}
                        <polygon points="-7,16 7,16 0,23" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="1.5" />
                        <text
                          x="0"
                          y="5"
                          textAnchor="middle"
                          fill="#FFFFFF"
                          fontSize="12"
                          fontWeight="900"
                          fontFamily="Nunito, system-ui, sans-serif"
                          letterSpacing="0.6"
                          style={{ textShadow: '0 2px 4px rgba(0,0,0,0.7)' }}
                        >
                          {i === 0 ? '👉 START HERE!' : '👉 PLAY NEXT!'}
                        </text>
                      </motion.g>
                    </g>
                  )}

                  {/* Stars Display below for completed */}
                  {completed ? (
                    <g transform="translate(-24, 50)">
                      {[0, 1, 2].map((s) => (
                        <text
                          key={`star-${s}`}
                          x={s * 16}
                          y="0"
                          fontSize="15"
                          opacity={s < stars ? 1 : 0.3}
                          style={{ filter: s < stars ? 'drop-shadow(0 2px 4px rgba(250, 204, 21, 0.9))' : 'none' }}
                        >
                          ⭐
                        </text>
                      ))}
                    </g>
                  ) : unlocked ? (
                    /* Station Title Banner (Generously spaced below node) */
                    <g transform="translate(0, 56)">
                      <rect
                        x="-68"
                        y="-12"
                        width="136"
                        height="24"
                        rx="7"
                        fill="rgba(15, 23, 42, 0.94)"
                        stroke="rgba(255, 255, 255, 0.6)"
                        strokeWidth="1.5"
                        filter="drop-shadow(0 2px 4px rgba(0,0,0,0.6))"
                      />
                      <text
                        x="0"
                        y="4"
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="11"
                        fontWeight="900"
                        fontFamily="Nunito, system-ui, sans-serif"
                        letterSpacing="0.3"
                      >
                        {getLocalizedLesson(lesson, currentLang).title.split(':')[0]}
                      </text>
                    </g>
                  ) : null}
                </motion.g>
              </g>
            </g>
          );
        })}

        {/* ─── LAYER 7: THE CUTE CARTOON BULL TRAIN LOCOMOTIVE ───────── */}
        {trainCoords && (
          <g
            transform={`translate(${trainCoords.x}, ${trainCoords.y - 38}) rotate(${trainCoords.angle})`}
            style={{ transformOrigin: '0px 38px' }}
          >
            <motion.g
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
            >
              {/* Headlight Beam */}
              <polygon points="26,-4 85,-20 85,14" fill="#FDE047" opacity="0.35" filter="url(#beaconGlow)" />

              {/* Animated Puffs of Smoke */}
              <motion.circle
                cx="-12"
                cy="-26"
                r="5.5"
                fill="#FFFFFF"
                opacity="0.85"
                animate={{
                  y: [-26, -54],
                  x: [-12, -32],
                  scale: [1, 2.6],
                  opacity: [0.85, 0],
                }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeOut' }}
              />
              <motion.circle
                cx="-12"
                cy="-26"
                r="4"
                fill="#F1F5F9"
                opacity="0.75"
                animate={{
                  y: [-26, -44],
                  x: [-12, -22],
                  scale: [0.8, 2.0],
                  opacity: [0.75, 0],
                }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeOut', delay: 0.45 }}
              />

              {/* Engine Boiler */}
              <rect x="-22" y="-10" width="44" height="24" rx="7" fill="#DC2626" stroke="#991B1B" strokeWidth="2.5" />
              <rect x="-18" y="-7" width="36" height="3.5" rx="1.5" fill="#FBBF24" />

              {/* Cowcatcher */}
              <polygon points="22,-5 30,7 22,10" fill="#475569" stroke="#1E293B" strokeWidth="1.8" />

              {/* Conductor Cab with Bully Mascot */}
              <rect x="-2" y="-22" width="20" height="22" rx="4" fill="#B91C1C" stroke="#7F1D1D" strokeWidth="2.2" />
              <rect x="2" y="-18" width="12" height="10" rx="2.5" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.2" />

              {/* Bully Mascot in Cab */}
              <g transform="translate(8, -13) scale(0.24)">
                <path d="M-18 -15 Q-26 -28 -14 -24 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
                <path d="M18 -15 Q26 -28 14 -24 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
                <circle cx="0" cy="0" r="18" fill="#C2410C" stroke="#7C2D12" strokeWidth="2" />
                <ellipse cx="0" cy="5" rx="10" ry="7" fill="#FFEDD5" />
                <circle cx="-3" cy="5" r="1.5" fill="#7C2D12" />
                <circle cx="3" cy="5" r="1.5" fill="#7C2D12" />
                <circle cx="-6" cy="-3" r="2.5" fill="#1E293B" />
                <circle cx="6" cy="-3" r="2.5" fill="#1E293B" />
                <path d="M-14 -12 Q0 -22 14 -12 L16 -9 L-16 -9 Z" fill="#1E3A8A" stroke="#1E40AF" strokeWidth="1.5" />
                <rect x="-18" y="-9" width="36" height="3" rx="1" fill="#F59E0B" />
              </g>

              {/* Smokestack */}
              <rect x="-16" y="-24" width="8" height="14" rx="2" fill="#334155" stroke="#0F172A" strokeWidth="1.8" />
              <ellipse cx="-12" cy="-24" rx="5.5" ry="2.2" fill="#F59E0B" stroke="#B45309" strokeWidth="1.2" />

              {/* Headlight */}
              <rect x="20" y="-3" width="5" height="7" rx="1.5" fill="#475569" />
              <circle cx="25" cy="0.5" r="4" fill="#FEF08A" stroke="#EAB308" strokeWidth="1.2" filter="url(#goldGlow)" />

              {/* Wheels */}
              <circle cx="-11" cy="14" r="7.5" fill="#1E293B" stroke="#0F172A" strokeWidth="2.2" />
              <circle cx="-11" cy="14" r="3.5" fill="#F59E0B" />
              <circle cx="11" cy="14" r="7.5" fill="#1E293B" stroke="#0F172A" strokeWidth="2.2" />
              <circle cx="11" cy="14" r="3.5" fill="#F59E0B" />
              <rect x="-11" cy="12" width="22" height="3.5" rx="1.5" fill="#94A3B8" stroke="#334155" strokeWidth="1" />
            </motion.g>
          </g>
        )}
      </svg>
    </div>
  );
};

export default TrainMap;

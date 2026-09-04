/**
 * Basic Level 2 — Lessons 203–233 (Goal: 30 WPM)
 * ────────────────────────────────────────────────
 * Thematic paragraphs: Vasco da Gama, Solar System, Photosynthesis, etc.
 */

import type { LessonDef } from './types';
import { generateSpeedChapter } from './generators';

export function createBasic2Lessons(): LessonDef[] {
  const lessons = generateSpeedChapter({
    startId: 203,
    chapterId: 'basic-2',
    wpmGoal: 30,
    habits: [
      { title: 'Rhythm Over Speed', tip: 'Focus on maintaining a steady rhythm rather than bursting fast and then pausing. Consistent typing speed is more effective than alternating between fast and slow. Think of it like walking at a steady pace instead of sprinting and stopping.' },
      { title: 'Use All Your Fingers', tip: 'Each finger has assigned keys. Using the correct finger for each key is essential for building speed. Using only your index fingers (hunt-and-peck) has a low ceiling. Proper technique has no ceiling!' },
    ],
    topics: [
      { title: 'Vasco da Gama', content: 'Vasco da Gama was a Portuguese explorer who became the first European to reach India by sea. In 1498 he sailed around the Cape of Good Hope at the southern tip of Africa. His voyage opened up a new sea route for trade between Europe and Asia that changed world history forever.', icon: '⛵' },
      { title: 'The Solar System', content: 'Our solar system has eight planets that orbit the Sun. The four inner planets are Mercury Venus Earth and Mars. They are small and rocky. The four outer planets are Jupiter Saturn Uranus and Neptune. They are large gas giants with thick atmospheres and many moons.', icon: '🪐' },
      { title: 'Photosynthesis', content: 'Photosynthesis is the process by which plants make their own food. They use sunlight water and carbon dioxide to produce glucose and oxygen. The chlorophyll in leaves captures sunlight energy. This process is essential for life on Earth because it produces the oxygen we breathe.', icon: '🌱' },
      { title: 'The Water Cycle', content: 'Water moves continuously through the environment in a process called the water cycle. The sun heats water in oceans and lakes causing it to evaporate into the air. This water vapor rises and cools forming clouds. When clouds become heavy the water falls back as rain or snow.', icon: '💧' },
      { title: 'The Human Heart', content: 'The human heart is a muscular organ about the size of a fist. It pumps blood through your entire body every single minute of every day. The heart has four chambers and beats about one hundred thousand times per day. It sends blood to your lungs to collect oxygen.', icon: '❤️' },
      { title: 'Ancient Egypt', content: 'Ancient Egypt was one of the greatest civilizations in history. The Egyptians built the pyramids thousands of years ago as tombs for their pharaohs. They developed hieroglyphics as their writing system. The Nile River was central to their way of life.', icon: '🏛️' },
      { title: 'Keyboard Layout', content: 'The QWERTY keyboard layout was designed in 1873 by Christopher Sholes. It was created for the Remington typewriter to prevent mechanical keys from jamming. The most common letters were placed apart from each other. This layout has remained the standard for over 150 years.', icon: '⌨️' },
      { title: 'The Moon', content: 'The Moon is the only natural satellite of Earth. It is about one quarter the size of our planet. The Moon takes about 27 days to orbit Earth. We always see the same side because the Moon rotates at the same rate as it orbits. The first humans walked on the Moon in 1969.', icon: '🌙' },
      { title: 'Volcanoes', content: 'A volcano is an opening in the surface of Earth that allows hot molten rock called magma to escape from deep inside the planet. When magma reaches the surface it is called lava. Volcanoes can be active dormant or extinct depending on when they last erupted.', icon: '🌋' },
      { title: 'The Amazon Rainforest', content: 'The Amazon Rainforest is the largest tropical rainforest in the world. It covers most of the Amazon Basin in South America. The forest produces about twenty percent of the world oxygen. It is home to millions of species of plants animals and insects.', icon: '🌳' },
    ],
  });

  const trimmed = lessons.slice(0, 31);
  return trimmed.map((l, i) => ({ ...l, id: 203 + i }));
}

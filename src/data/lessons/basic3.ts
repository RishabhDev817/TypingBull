/**
 * Basic Level 3 — Lessons 286–316 (Goal: 30 WPM)
 * ────────────────────────────────────────────────
 * Longer thematic texts: Earthquakes, Newton's Laws, Tornadoes, etc.
 */

import type { LessonDef } from './types';
import { generateSpeedChapter } from './generators';

export function createBasic3Lessons(): LessonDef[] {
  const lessons = generateSpeedChapter({
    startId: 286,
    chapterId: 'basic-3',
    wpmGoal: 30,
    habits: [
      { title: 'Build Stamina', tip: 'Typing for longer periods builds endurance. Start with 10-minute sessions and gradually increase. Just like running, your fingers need time to build up their stamina for sustained typing.' },
    ],
    topics: [
      { title: 'Earthquakes', content: 'Earthquakes happen when tectonic plates deep under the surface of the Earth suddenly shift and release stored energy. This energy travels through the ground as seismic waves. Earthquakes can be very mild or extremely powerful and destructive. Scientists use seismographs to measure their strength on the Richter scale.', icon: '🌍' },
      { title: 'Tectonic Plates', content: 'The surface of the Earth is made up of large pieces called tectonic plates. These plates float on a layer of hot molten rock called the mantle. The plates are constantly moving very slowly. When they push against each other mountains form. When they pull apart valleys and oceans are created.', icon: '🗺️' },
      { title: "Newton's First Law", content: "Newton's first law of motion states that an object at rest will stay at rest and an object in motion will stay in motion unless acted upon by an external force. This is also called the law of inertia. It explains why you need a seatbelt in a car. When the car stops suddenly your body wants to keep moving forward.", icon: '🍎' },
      { title: 'Tornadoes', content: 'A tornado is a violent rotating column of air that extends from a thunderstorm to the ground. Tornadoes can have wind speeds of over 300 miles per hour making them one of nature most destructive forces. They are most common in the central United States in an area known as Tornado Alley.', icon: '🌪️' },
      { title: 'The Great Wall of China', content: 'The Great Wall of China is one of the most famous structures ever built by humans. It stretches over 13000 miles across northern China. Construction began over 2000 years ago to protect China from invasions. Millions of workers helped build the wall over many centuries using stone brick and earth.', icon: '🏯' },
      { title: 'Gravity', content: 'Gravity is the force that pulls objects toward each other. The more mass an object has the stronger its gravitational pull. Earth gravity keeps us on the ground and the Moon in orbit. On the Moon gravity is about one sixth as strong as on Earth so you could jump much higher there.', icon: '🌍' },
      { title: 'The Respiratory System', content: 'Your respiratory system is responsible for bringing oxygen into your body and removing carbon dioxide. When you breathe in air enters through your nose or mouth and travels down your windpipe to your lungs. In the lungs oxygen passes into your blood and carbon dioxide passes out to be exhaled.', icon: '🫁' },
      { title: 'Dinosaurs', content: 'Dinosaurs ruled the Earth for over 160 million years before going extinct about 66 million years ago. They ranged in size from tiny creatures the size of chickens to massive beasts longer than three school buses. Scientists believe a large asteroid impact caused their extinction by changing the climate dramatically.', icon: '🦕' },
      { title: 'The Internet', content: 'The Internet is a global network of computers that allows people to share information and communicate across the world. It began as a military project in the 1960s and has grown into something that billions of people use every day. The World Wide Web was invented by Tim Berners Lee in 1989.', icon: '🌐' },
      { title: 'Electricity', content: 'Electricity is a form of energy that powers almost everything in our modern world. It flows through wires as a stream of tiny particles called electrons. We generate electricity using many methods including burning coal capturing wind energy using solar panels and splitting atoms in nuclear power plants.', icon: '⚡' },
      { title: 'Ocean Currents', content: 'Ocean currents are large movements of water that flow through the oceans like rivers. They are driven by wind temperature differences and the rotation of the Earth. Warm currents carry heat from the equator toward the poles while cold currents bring cool water from the poles toward the equator.', icon: '🌊' },
    ],
  });

  const trimmed = lessons.slice(0, 31);
  return trimmed.map((l, i) => ({ ...l, id: 286 + i }));
}

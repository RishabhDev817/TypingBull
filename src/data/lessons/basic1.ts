/**
 * Basic Level 1 — Lessons 89–126 (Goal: 21 WPM)
 * ───────────────────────────────────────────────
 * Habit building: Don't Look Down, Good Posture, Train Your Muscles, etc.
 */

import type { LessonDef } from './types';
import { generateSpeedChapter } from './generators';

export function createBasic1Lessons(): LessonDef[] {
  const lessons = generateSpeedChapter({
    startId: 89,
    chapterId: 'basic-1',
    wpmGoal: 21,
    habits: [
      { title: "Don't Look Down!", tip: 'Your eyes should stay on the screen at all times. Trust your fingers — they know where the keys are. Looking down breaks your rhythm and slows you down. If you get lost, return your index fingers to F and J (feel the bumps) and start again.' },
      { title: 'Staring at the Screen', tip: 'Keep your eyes focused on the text you are typing on screen, not the keyboard. Your brain will learn faster when it connects what you see with what your fingers do. This is called "proprioception" — your body knowing where it is in space.' },
      { title: 'Good Posture Matters', tip: 'Sit with your back straight, feet flat on the floor, elbows at 90 degrees, and wrists floating above the keyboard. Bad posture leads to fatigue, pain, and slower typing. Good posture lets you type longer and faster.' },
      { title: 'Adjust Your Screen', tip: 'Your monitor should be at eye level, about an arm\'s length away. If you look down at your screen, your neck will hurt. If it is too far, you will squint. Find the sweet spot where you can read comfortably without straining.' },
      { title: 'Train Your Muscles', tip: 'Typing is a physical skill, like playing piano or shooting basketball. Your finger muscles need regular practice to build strength and coordination. Short, daily practice sessions (15-20 minutes) are more effective than long, infrequent ones.' },
      { title: 'Rest Your Wrists', tip: 'Never rest your wrists on the desk or keyboard while typing. Your wrists should float above the keyboard, and your fingers should drop down to press keys. Resting your wrists can cause strain and carpal tunnel syndrome.' },
    ],
    topics: [
      { title: 'The Quick Brown Fox', content: 'the quick brown fox jumps over the lazy dog. the five boxing wizards jump quickly. pack my box with five dozen liquor jugs. how vexingly quick daft zebras jump.', icon: '🦊' },
      { title: 'Simple Sentences', content: 'i like to read books in the park. the sun is bright and the sky is blue. she went to the store to buy some milk. he can run very fast around the track.', icon: '📝' },
      { title: 'Daily Activities', content: 'every morning i wake up and brush my teeth. then i eat breakfast and get ready for school. after school i do my homework and play outside. at night i read a book before going to sleep.', icon: '🌅' },
      { title: 'Animals and Nature', content: 'the cat sat on the mat and watched the birds fly by. dogs love to play fetch in the park with their owners. fish swim in the ocean and rivers all day long. trees grow tall and give us shade in the hot summer.', icon: '🐱' },
      { title: 'My Favorite Things', content: 'i love playing games with my friends after school. music makes me happy when i listen to my favorite songs. drawing pictures is fun because i can create anything i want. reading takes me on adventures to faraway places.', icon: '⭐' },
      { title: 'Weather Report', content: 'today the weather is sunny with clear blue skies. the temperature is warm and perfect for a walk in the park. tomorrow it might rain so bring an umbrella just in case. the wind is blowing gently from the west.', icon: '🌤️' },
      { title: 'School Days', content: 'at school we learn many new things every day. math class teaches us about numbers and shapes. in science we explore how the world works around us. reading class helps us understand stories and new ideas.', icon: '🏫' },
      { title: 'Friendship', content: 'a good friend is someone who cares about you. friends help each other when times are tough. we share laughs and make memories together every day. true friendship is one of the best things in life.', icon: '🤝' },
      { title: 'Healthy Habits', content: 'eating fruits and vegetables keeps your body strong. drinking water throughout the day is very important. exercise helps your heart and muscles stay healthy and fit. getting enough sleep lets your body rest and recharge.', icon: '🍎' },
      { title: 'Speed Burst', content: 'the man ran to the bus stop as fast as he could go. she typed the words quickly on her new laptop screen. they all worked hard to finish the big project on time. we need to move fast if we want to catch the train.', icon: '⚡' },
    ],
  });

  // Ensure 38 lessons (89-126)
  const trimmed = lessons.slice(0, 38);
  return trimmed.map((l, i) => ({ ...l, id: 89 + i }));
}

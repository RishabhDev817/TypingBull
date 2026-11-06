/** FAQ content for landing pages. Used on the page itself and as FAQPage JSON-LD in the prerendered HTML. */
export interface FaqItem {
  question: string;
  answer: string;
}

export const TYPING_TEST_FAQ: FaqItem[] = [
  {
    question: 'How is typing speed (WPM) calculated?',
    answer:
      'Words per minute counts every five characters as one word. TypingBull divides your correct characters by five, then by the minutes you typed. Characters you got wrong and did not fix do not count, so the result is a net WPM.',
  },
  {
    question: 'How long should a typing test be?',
    answer:
      'One minute is the usual standard and gives a reliable number for most people. Try 3 or 5 minutes to measure stamina, since speed often drops as you tire. A 30-second test is a quick check but varies more from run to run.',
  },
  {
    question: 'What is a good typing test score?',
    answer:
      'Around 40 WPM is average for adults. 55 to 75 WPM is above average and meets most office job requirements. Above 100 WPM is expert level. Accuracy of 95% or more matters as much as raw speed.',
  },
  {
    question: 'Do I need to sign up to take the typing test?',
    answer:
      'No. The test is free and works without an account. Your results are saved only in your own browser so you can see progress on the same device.',
  },
  {
    question: 'Can I paste text to get a higher score?',
    answer:
      'No. The test only counts real keystrokes, and pasting is blocked so your score reflects your actual typing.',
  },
  {
    question: 'How can I improve my typing speed?',
    answer:
      'Learn touch typing so you stop looking at the keys, put accuracy before speed, and practise for 15 to 20 minutes a day. TypingBull has a free step-by-step touch typing course and games that make daily practice easier.',
  },
];

export const AVERAGE_SPEED_FAQ: FaqItem[] = [
  {
    question: 'What is the average typing speed?',
    answer:
      'For adults who type regularly the average is roughly 40 words per minute. A large 2018 study by Aalto University that analysed keystrokes from about 168,000 volunteers found a higher average of around 52 WPM, because people who type a lot online tend to be faster.',
  },
  {
    question: 'What is a good typing speed for a job?',
    answer:
      'Most office and administrative jobs ask for 45 to 65 WPM. Data entry roles often want 60 to 80 WPM with at least 97% accuracy. Transcription and court reporting need 80 WPM or more. Employers set their own tests, so check the job advert.',
  },
  {
    question: 'Is 60 WPM a good typing speed?',
    answer:
      'Yes. 60 WPM is above average and is enough for almost all office roles. Raising accuracy further will usually help your productivity more than adding more speed.',
  },
  {
    question: 'Does typing speed change with age?',
    answer:
      'Large typing studies find that younger typists tend to be faster on average and that speed generally declines slowly with age. Practice matters more than age: people who type every day stay fast.',
  },
  {
    question: 'How fast should a child type?',
    answer:
      'There is no single standard. Many schools aim for roughly 20 to 30 WPM by the end of primary school, and children improve quickly with short daily practice using a proper touch typing course.',
  },
  {
    question: 'How do I improve my WPM?',
    answer:
      'Use all ten fingers and keep them on the home row, look at the screen instead of the keyboard, practise slowly at first so you build accuracy, and take timed tests regularly to track progress.',
  },
];

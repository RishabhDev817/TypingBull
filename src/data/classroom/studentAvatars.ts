/**
 * Modern Educational Student Avatar System
 * High-resolution illustrated student portraits representing diverse learners
 */

export interface StudentAvatar {
  id: string;
  name: string;
  role: string;
  description: string;
  avatarUrl: string;
  bgColor: string;
  fallbackEmoji: string;
}

export const STUDENT_AVATARS: StudentAvatar[] = [
  {
    id: 'theo',
    name: 'Theo',
    role: 'Student',
    description: 'Boy, blonde side-part, friendly smile',
    avatarUrl: 'https://api.dicebear.com/9.x/lorelei/svg?seed=Theo&backgroundColor=b6e3f4,c0aede,d1d4f9',
    bgColor: 'from-sky-100 to-blue-100 dark:from-sky-950/40 dark:to-blue-900/30',
    fallbackEmoji: '🧑🏼',
  },
  {
    id: 'lucy',
    name: 'Lucy',
    role: 'Student',
    description: 'Girl, curly brown hair, bucket hat',
    avatarUrl: 'https://api.dicebear.com/9.x/lorelei/svg?seed=Lucy&backgroundColor=ffd5dc,ffdfbf',
    bgColor: 'from-rose-100 to-pink-100 dark:from-rose-950/40 dark:to-pink-900/30',
    fallbackEmoji: '👧🏽',
  },
  {
    id: 'bella',
    name: 'Bella',
    role: 'Student',
    description: 'Girl, auburn hair, cheerful',
    avatarUrl: 'https://api.dicebear.com/9.x/lorelei/svg?seed=Bella&backgroundColor=d1d4f9,c0aede',
    bgColor: 'from-purple-100 to-indigo-100 dark:from-purple-950/40 dark:to-indigo-900/30',
    fallbackEmoji: '👧🏻',
  },
  {
    id: 'sara',
    name: 'Sara',
    role: 'Student',
    description: 'Girl, round glasses, dark cap',
    avatarUrl: 'https://api.dicebear.com/9.x/lorelei/svg?seed=Sara&backgroundColor=c0aede,b6e3f4',
    bgColor: 'from-violet-100 to-purple-100 dark:from-violet-950/40 dark:to-purple-900/30',
    fallbackEmoji: '👩🏻‍🏫',
  },
  {
    id: 'ryan',
    name: 'Ryan',
    role: 'Student',
    description: 'Boy, beanie, glasses, studious',
    avatarUrl: 'https://api.dicebear.com/9.x/lorelei/svg?seed=Ryan&backgroundColor=b6e3f4,d1d4f9',
    bgColor: 'from-teal-100 to-emerald-100 dark:from-teal-950/40 dark:to-emerald-900/30',
    fallbackEmoji: '🧑🏾',
  },
  {
    id: 'annie',
    name: 'Annie',
    role: 'Student',
    description: 'Girl, long red hair, earrings',
    avatarUrl: 'https://api.dicebear.com/9.x/lorelei/svg?seed=Annie&backgroundColor=ffd5dc,d1d4f9',
    bgColor: 'from-amber-100 to-orange-100 dark:from-amber-950/40 dark:to-orange-900/30',
    fallbackEmoji: '👧🏼',
  },
  {
    id: 'rob',
    name: 'Rob',
    role: 'Student',
    description: 'Boy, baseball cap, confident',
    avatarUrl: 'https://api.dicebear.com/9.x/lorelei/svg?seed=Rob&backgroundColor=c0aede,ffd5dc',
    bgColor: 'from-orange-100 to-amber-100 dark:from-orange-950/40 dark:to-amber-900/30',
    fallbackEmoji: '👦🏽',
  },
  {
    id: 'chloe',
    name: 'Chloe',
    role: 'Student',
    description: 'Girl, dark hair, flower accessory',
    avatarUrl: 'https://api.dicebear.com/9.x/lorelei/svg?seed=Chloe&backgroundColor=ffd5dc,b6e3f4',
    bgColor: 'from-pink-100 to-rose-100 dark:from-pink-950/40 dark:to-rose-900/30',
    fallbackEmoji: '👧🏾',
  },
  {
    id: 'david',
    name: 'David',
    role: 'Student',
    description: 'Boy, curly hair, focused',
    avatarUrl: 'https://api.dicebear.com/9.x/lorelei/svg?seed=David&backgroundColor=d1d4f9,b6e3f4',
    bgColor: 'from-blue-100 to-cyan-100 dark:from-blue-950/40 dark:to-cyan-900/30',
    fallbackEmoji: '👦🏻',
  },
  {
    id: 'mila',
    name: 'Mila',
    role: 'Student',
    description: 'Girl, yellow headband, glasses',
    avatarUrl: 'https://api.dicebear.com/9.x/lorelei/svg?seed=Mila&backgroundColor=ffdfbf,ffd5dc',
    bgColor: 'from-yellow-100 to-amber-100 dark:from-yellow-950/40 dark:to-amber-900/30',
    fallbackEmoji: '👧🏻',
  },
  {
    id: 'ben',
    name: 'Ben',
    role: 'Student',
    description: 'Boy, afro, bright glasses',
    avatarUrl: 'https://api.dicebear.com/9.x/lorelei/svg?seed=Ben&backgroundColor=b6e3f4,c0aede',
    bgColor: 'from-indigo-100 to-sky-100 dark:from-indigo-950/40 dark:to-sky-900/30',
    fallbackEmoji: '👦🏿',
  },
  {
    id: 'naomi',
    name: 'Naomi',
    role: 'Student',
    description: 'Girl, dark bob cut, red earrings',
    avatarUrl: 'https://api.dicebear.com/9.x/lorelei/svg?seed=Naomi&backgroundColor=c0aede,ffd5dc',
    bgColor: 'from-fuchsia-100 to-purple-100 dark:from-fuchsia-950/40 dark:to-purple-900/30',
    fallbackEmoji: '👧🏽',
  },
];

export function getStudentAvatar(idOrName?: string): StudentAvatar {
  if (!idOrName) return STUDENT_AVATARS[0];
  const query = idOrName.toLowerCase().trim();
  const match = STUDENT_AVATARS.find(
    (a) => a.id.toLowerCase() === query || a.name.toLowerCase() === query
  );
  return match || STUDENT_AVATARS[0];
}

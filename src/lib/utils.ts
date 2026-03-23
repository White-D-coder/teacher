import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  // Though we use Vanilla CSS, tailwind-merge can still be useful if we use some utility classes or future-proof it.
  // For now, it mostly acts as a robust class joiner.
  return twMerge(clsx(inputs));
}

export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

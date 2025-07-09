import { GraduationCap } from 'lucide-react';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="CampusCompanion Home">
      <GraduationCap className="h-7 w-7 text-primary" />
      <span className="font-headline text-xl font-bold text-foreground">
        CampusCompanion
      </span>
    </Link>
  );
}

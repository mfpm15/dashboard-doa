import { redirect } from 'next/navigation';

/** Serve the original Doa Teduh v3.4 experience, not a visual approximation. */
export default function Home() {
  redirect('/teduh/index.html');
}

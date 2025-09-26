import { redirect } from 'next/navigation';

export default function NotesLegacyRedirectPage() {
  redirect('/notes/filter/All');
}
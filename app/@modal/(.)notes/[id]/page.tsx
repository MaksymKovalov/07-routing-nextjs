import { fetchNoteById } from '@/lib/api';
import type { Note } from '@/types/note';
import NotePreview from './NotePreview.client';

type PageProps = {
  params: Promise<{ id: string }>;
};

const NotePreviewModalPage = async ({ params }: PageProps) => {
  const { id } = await params;
  const note: Note = await fetchNoteById(id);

  return <NotePreview note={note} />;
};

export default NotePreviewModalPage;

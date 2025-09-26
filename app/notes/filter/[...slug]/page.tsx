import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import { fetchNotes } from '@/lib/api';
import { NOTE_TAGS, type NoteTag } from '@/types/note';
import NotesClient from './Notes.client';

const NOTES_PER_PAGE = 12;

type PageParams = {
  slug?: string[];
};

type PageProps = {
  params: Promise<PageParams>;
};

const getTagFromSlug = (slug?: string[]): NoteTag | 'All' => {
  if (!slug || slug.length === 0) {
    return 'All';
  }

  if (slug.length > 1) {
    return notFound();
  }

  const [tagCandidate] = slug;

  if (tagCandidate === 'All') {
    return 'All';
  }

  if (NOTE_TAGS.includes(tagCandidate as NoteTag)) {
    return tagCandidate as NoteTag;
  }

  return notFound();
};

export default async function FilteredNotesPage({ params }: PageProps) {
  const { slug } = await params;
  const tag = getTagFromSlug(slug);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', tag, 1, ''],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: NOTES_PER_PAGE,
        search: '',
        tag: tag === 'All' ? undefined : tag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}

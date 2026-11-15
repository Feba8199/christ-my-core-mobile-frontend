// Real API wrapper (unlike the other files in this folder, which are local
// stand-ins) — hits bible-api.com directly from the client. No API key
// required, CORS-enabled. Chosen because the UX spec's Bible tab has no
// backing model in apps/api's schema at all (confirmed against
// apps/api/src/db/schema.ts), so there's nothing to proxy through yet.

export type BibleTranslation = { id: string; name: string };

// Subset of bible-api.com's supported translations (id = its `translation`
// query param). All public-domain English versions; see
// https://bible-api.com for the full list, which also includes a few
// non-English versions this app doesn't currently localize for.
export const BIBLE_TRANSLATIONS: BibleTranslation[] = [
  { id: 'kjv', name: 'King James Version' },
  { id: 'web', name: 'World English Bible' },
  { id: 'webbe', name: 'World English Bible, British Edition' },
  { id: 'asv', name: 'American Standard Version' },
  { id: 'bbe', name: 'Bible in Basic English' },
  { id: 'darby', name: 'Darby Bible' },
  { id: 'ylt', name: "Young's Literal Translation" },
  { id: 'oeb-us', name: 'Open English Bible, US Edition' },
];

export type BibleVerse = {
  verse: number;
  text: string;
};

export type BibleChapter = {
  reference: string;
  translationId: string;
  translationName: string;
  verses: BibleVerse[];
};

export class BibleFetchError extends Error {}

// GET https://bible-api.com/{book}+{chapter}?translation={id}
export async function getChapter(
  book: string,
  chapter: number,
  translationId: string
): Promise<BibleChapter> {
  const reference = `${book} ${chapter}`.trim().replace(/\s+/g, '+');
  const url = `https://bible-api.com/${encodeURIComponent(reference).replace(/%2B/g, '+')}?translation=${encodeURIComponent(translationId)}`;

  let response: Response;
  try {
    response = await fetch(url);
  } catch {
    throw new BibleFetchError('Could not reach the Bible API. Check your connection.');
  }

  if (!response.ok) {
    throw new BibleFetchError(`Failed to load ${book} ${chapter} (${response.status}).`);
  }

  const data = await response.json();
  if (data.error) {
    throw new BibleFetchError(data.error);
  }

  return {
    reference: data.reference,
    translationId: data.translation_id,
    translationName: data.translation_name,
    verses: (data.verses ?? []).map((v: { verse: number; text: string }) => ({
      verse: v.verse,
      text: v.text.trim(),
    })),
  };
}

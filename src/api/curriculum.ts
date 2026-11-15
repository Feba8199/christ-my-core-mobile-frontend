// Local stand-in for the curriculum/lessons API.
// Structural shape mirrors apps/api/src/db/schema.ts (Course -> Module ->
// Lesson -> LessonContentItem, with ContentItemType VIDEO | IMAGE | TEXT | PDF | QUIZ)
// and the five *-level-1.json course seeds in
// apps/api/scripts/seed-data/courses/, which are the free (previewLevel:
// PUBLIC), classification-linked first lessons of the discipleship journey —
// the "customised journey" lesson the assessment results screen leads into.
//
// The real seed data for these lessons is itself an unfilled placeholder
// (`{ "type": "TEXT", "contentType": "markdown" }` with no content), so the
// video/image/quiz blocks below are clearly-labeled stand-ins for that gap,
// not real content. Swap this file for a real fetch() once the CMS content
// and a public lesson endpoint exist — the block shapes below mirror the
// learner-facing ContentItemSchema in
// apps/api/src/shared/api/schemas/content-item.output.schema.ts (quiz is one
// content block among others, not a separate field), so LessonScreen
// shouldn't need to change when that swap happens.

import { ClassificationSlug } from '../constants/classifications';

export type QuizQuestion = {
  question: string;
  options: string[];
  correctOptionIndex: number;
};

export type LessonContentBlock =
  | { type: 'VIDEO'; videoUrl: string; duration: number | null; caption: string | null }
  | { type: 'IMAGE'; imageUrl: string; caption: string | null }
  | { type: 'TEXT'; content: string; contentType: 'markdown' | 'html' | 'plaintext' }
  | { type: 'QUIZ'; title: string | null; description: string | null; questions: QuizQuestion[] };

export type LessonView = {
  courseTitle: string;
  lessonTitle: string;
  classification: ClassificationSlug;
  content: LessonContentBlock[];
};

// Course/lesson titles are real (from the *-level-1.json seeds); the body
// content and quiz are placeholders pending CMS content.
const FREE_LESSONS: Record<
  ClassificationSlug,
  { courseTitle: string; lessonTitle: string }
> = {
  'abiding-upwards': {
    courseTitle: 'Abiding: Reactive',
    lessonTitle: 'From Crisis to Communion',
  },
  'discipling-downwards-deep': {
    courseTitle: 'Discipling: Surface',
    lessonTitle: 'Beyond Sunday',
  },
  'private-life-inwards': {
    courseTitle: 'Private Life: Unexamined',
    lessonTitle: 'Examining the Hidden Life',
  },
  'relationships-outwards-sideways': {
    courseTitle: 'Relationships: Self-Centered',
    lessonTitle: 'From Consumer to Community',
  },
  'kingdom-building-forwards': {
    courseTitle: 'Kingdom Building: Unaware',
    lessonTitle: 'Discovering Purpose',
  },
};

// Stands in for GET /courses/:slug/lessons/:lessonId (once a public,
// pre-registration lesson endpoint exists).
export async function getFreeLesson(
  classification: ClassificationSlug
): Promise<LessonView> {
  const { courseTitle, lessonTitle } = FREE_LESSONS[classification];

  return {
    courseTitle,
    lessonTitle,
    classification,
    content: [
      {
        type: 'VIDEO',
        videoUrl: '',
        duration: null,
        caption: 'PLACEHOLDER — video content pending from content team',
      },
      {
        type: 'IMAGE',
        imageUrl: '',
        caption: 'PLACEHOLDER — summary image pending from content team',
      },
      {
        type: 'TEXT',
        content: `Placeholder body copy for "${lessonTitle}". Real teaching content is pending from content owners — this mirrors the empty content stub already present for this lesson in the seed data.`,
        contentType: 'markdown',
      },
      {
        type: 'QUIZ',
        title: null,
        description: null,
        questions: [
          {
            question: 'Placeholder quiz question — pending real content.',
            options: [
              'Placeholder answer A',
              'Placeholder answer B',
              'Placeholder answer C',
              'Placeholder answer D',
            ],
            correctOptionIndex: 0,
          },
        ],
      },
    ],
  };
}

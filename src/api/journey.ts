// Local stand-in for the learner journey API.
// Structural shape mirrors Program -> ProgramCourse -> Course -> Module ->
// Lesson in apps/api/src/db/schema.ts, gated by UserProgramProgress /
// UserCourseProgress / UserLessonProgress (see the routes under
// apps/api/src/modules/courses/api/learning/). Course titles/classification/
// level pairing mirrors the 5 classifications x 4 levels = 20 "discipleship
// journey" course seeds in apps/api/scripts/seed-data/courses/
// (*-level-{1-4}.json, each with enforceOrder: true).
//
// Course/level titles below are real (from apps/api/scripts/seed-data/
// classifications.json's level titles). Per-lesson titles are placeholders
// beyond the verified level-1 first lesson (see FREE_LESSONS in
// ../api/curriculum.ts) since real seed data for lessons 2+ and levels 2-4
// is itself just "Lesson N" filler pending CMS content.
//
// Swap this file for a real fetch() to GET /courses/learning/my-course-versions
// once course progress persistence exists — the shape consumed by
// JourneyScreen shouldn't need to change.

import {
  CLASSIFICATION_ORDER,
  CLASSIFICATION_LABELS,
  ClassificationSlug,
} from '../constants/classifications';

export type LessonStatus = 'completed' | 'unlocked' | 'locked';
export type CourseStatus = 'completed' | 'active' | 'locked';

export type JourneyLesson = {
  id: string;
  title: string;
  status: LessonStatus;
};

export type JourneyModule = {
  id: string;
  title: string;
  lessons: JourneyLesson[];
};

export type JourneyCourse = {
  id: string;
  title: string;
  classification: ClassificationSlug;
  level: 1 | 2 | 3 | 4;
  status: CourseStatus;
};

const LEVEL_TITLES: Record<ClassificationSlug, [string, string, string, string]> = {
  'abiding-upwards': ['Reactive', 'Habitual', 'Dependent', 'Resilient'],
  'discipling-downwards-deep': ['Surface', 'Building', 'Discerning', 'Multiplier'],
  'private-life-inwards': ['Unexamined', 'Ordering', 'Fruitful', 'Testimony'],
  'relationships-outwards-sideways': ['Self-Centered', 'Biblical', 'Contributing', 'Servant Leader'],
  'kingdom-building-forwards': ['Unaware', 'Discovery', 'Active', 'Kingdom Leader'],
};

function courseTitle(classification: ClassificationSlug, level: 1 | 2 | 3 | 4): string {
  return `${CLASSIFICATION_LABELS[classification]}: ${LEVEL_TITLES[classification][level - 1]}`;
}

// Stands in for GET /courses/learning/my-course-versions.
// The real "discipleship-journey" Program (apps/api/scripts/seed-data/programs.json)
// has traversalType COMPETENCY_FILTERED_SEQUENTIAL and a FIXED level-major
// course order — all 5 classifications' level-1 courses, then all 5's
// level-2, etc. (not grouped by classification). A course is "mastered"
// (auto-skipped) once the user's assessed level in that classification is
// >= the course's level; the first course that's neither mastered nor
// completed becomes the single unlocked/active one, everything after stays
// locked. Mirrors ProgramSessionModel.computeCourseUnlocked's
// COMPETENCY_FILTERED_SEQUENTIAL branch and calculateMasteredCourseIds in
// apps/api/src/modules/programs/domain/models/program-session.model.ts —
// including that branch's literal `classLevel <= averageLevel` mastery test
// (that file has a FIXME questioning whether equal-level should unlock a
// *different* edge case, not this one, so this mirrors it as written).
//
// `scores` is the same per-classification level map produced by
// getCategoryLevels() in ../utils/assessmentResult.ts (1-4 per
// classification). Pass all-zeros for a user with no assessment attempt yet
// so nothing is pre-mastered and they start at course index 0.
export function getJourneyCourses(
  scores: Record<ClassificationSlug, number>
): JourneyCourse[] {
  const entries: { classification: ClassificationSlug; level: 1 | 2 | 3 | 4 }[] = [];
  for (let level = 1 as 1 | 2 | 3 | 4; level <= 4; level++) {
    for (const classification of CLASSIFICATION_ORDER) {
      entries.push({ classification, level });
    }
  }

  const activeIndex = entries.findIndex(
    (e) => e.level > (scores[e.classification] ?? 0)
  );

  return entries.map((e, i) => ({
    id: `${e.classification}-level-${e.level}`,
    title: courseTitle(e.classification, e.level),
    classification: e.classification,
    level: e.level,
    status:
      activeIndex === -1
        ? 'completed'
        : i < activeIndex
          ? 'completed'
          : i === activeIndex
            ? 'active'
            : 'locked',
  }));
}

// Fallback for a user who reached Login without ever taking the assessment
// (e.g. "I already have an account") — no classification is pre-mastered, so
// the journey starts at the very first course.
export const UNASSESSED_SCORES: Record<ClassificationSlug, number> = {
  'abiding-upwards': 0,
  'discipling-downwards-deep': 0,
  'private-life-inwards': 0,
  'relationships-outwards-sideways': 0,
  'kingdom-building-forwards': 0,
};

// Stands in for GET /courses/learning/my-course-session?courseVersionId=...
// The mobile journey presents two compact modules in the dashboard map.
export function getJourneyModules(course: JourneyCourse): JourneyModule[] {
  const isLevelOne = course.level === 1;
  const firstLessonTitle = isLevelOne
    ? FIRST_LESSON_TITLES[course.classification]
    : 'Lesson 1';

  const lessonTitles = [firstLessonTitle, 'Lesson 2', 'Lesson 3', 'Lesson 4', 'Lesson 5'];

  const makeLessons = (titles: string[], offset: number): JourneyLesson[] =>
    titles.map((title, i) => ({
      id: `${course.id}-lesson-${offset + i + 1}`,
      title,
      status: (
        course.status === 'completed'
          ? 'completed'
          : course.status === 'active' && offset + i === 0
            ? 'unlocked'
              : 'locked'
      ) as LessonStatus,
    }));

  return [
    {
      id: `${course.id}-module-1`,
      title: 'Module 1',
      lessons: makeLessons(lessonTitles, 0),
    },
    {
      id: `${course.id}-module-2`,
      title: 'Module 2',
      lessons: makeLessons(['Lesson 1', 'Lesson 2'], lessonTitles.length),
    },
  ];
}

// Matches the level-1 seed lesson titles already verified in curriculum.ts's
// FREE_LESSONS map.
const FIRST_LESSON_TITLES: Record<ClassificationSlug, string> = {
  'abiding-upwards': 'From Crisis to Communion',
  'discipling-downwards-deep': 'Beyond Sunday',
  'private-life-inwards': 'Examining the Hidden Life',
  'relationships-outwards-sideways': 'From Consumer to Community',
  'kingdom-building-forwards': 'Discovering Purpose',
};

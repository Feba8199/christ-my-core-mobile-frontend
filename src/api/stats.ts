// Local stand-in for the learner stats/achievements API.
// Badge/level state is derived from the same course progression as
// ../api/journey.ts (single source of truth for the mastery/completion
// logic mirroring the real COMPETENCY_FILTERED_SEQUENTIAL traversal) rather
// than recomputed here, so Stats and Journey can never disagree about
// what's earned. Per the UX spec: "use the 5 categories and 4 levels to
// provide some sort of achievement as they work their way up that
// category-level ladder."

import { CLASSIFICATION_ORDER, ClassificationSlug } from '../constants/classifications';
import { getJourneyCourses, CourseStatus } from './journey';

export type ClassificationStats = {
  classification: ClassificationSlug;
  // Highest mastered/completed level (0-4) — a course's status is
  // 'completed' only when its level is <= the user's assessed level for
  // that classification, and mastery is monotonic in level (see
  // getJourneyCourses), so this is just a count of completed badges.
  currentLevel: number;
  badges: CourseStatus[]; // index 0 = level 1 ... index 3 = level 4
};

export type LearnerStats = {
  completedCount: number;
  totalCount: number;
  classifications: ClassificationStats[];
};

// Stands in for GET /courses/learning/my-course-versions, reshaped into a
// per-classification achievement ladder instead of a flat course list.
export function getStats(scores: Record<ClassificationSlug, number>): LearnerStats {
  const courses = getJourneyCourses(scores);

  const classifications: ClassificationStats[] = CLASSIFICATION_ORDER.map(
    (classification) => {
      const classCourses = courses
        .filter((c) => c.classification === classification)
        .sort((a, b) => a.level - b.level);
      const badges = classCourses.map((c) => c.status);
      const currentLevel = badges.filter((status) => status === 'completed').length;
      return { classification, currentLevel, badges };
    }
  );

  return {
    completedCount: courses.filter((c) => c.status === 'completed').length,
    totalCount: courses.length,
    classifications,
  };
}

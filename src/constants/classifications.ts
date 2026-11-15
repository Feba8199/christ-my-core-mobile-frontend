// Display names for the 5 classifications used by the spiritual health checkup.
// Internal slugs match apps/api/prisma/seeds/data/assessments/spiritual-health-checkup.json
// and apps/api/prisma/seeds/data/classifications.json.

export const CLASSIFICATION_ORDER = [
  'abiding-upwards',
  'discipling-downwards-deep',
  'private-life-inwards',
  'relationships-outwards-sideways',
  'kingdom-building-forwards',
] as const;

export type ClassificationSlug = (typeof CLASSIFICATION_ORDER)[number];

export const CLASSIFICATION_LABELS: Record<ClassificationSlug, string> = {
  'abiding-upwards': 'Abiding',
  'discipling-downwards-deep': 'Discipling',
  'private-life-inwards': 'Private Life',
  'relationships-outwards-sideways': 'Relationships',
  'kingdom-building-forwards': 'Kingdom Building',
};

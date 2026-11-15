import { SurveyResult } from '../api/assessments';
import {
  CLASSIFICATION_LABELS,
  CLASSIFICATION_ORDER,
  ClassificationSlug,
} from '../constants/classifications';

// The real API only returns a raw per-level distribution (see SurveyResult).
// Reducing that to a single "you are level X" number per category is a UI-side
// decision either way — here we take the count-weighted average, rounded.
export function averageLevel(levels: Record<string, number>): number {
  let weighted = 0;
  let count = 0;
  for (const [level, levelCount] of Object.entries(levels)) {
    weighted += Number(level) * levelCount;
    count += levelCount;
  }
  return count > 0 ? Math.round(weighted / count) : 1;
}

export function getCategoryLevels(
  result: SurveyResult
): Record<ClassificationSlug, number> {
  const scores = {} as Record<ClassificationSlug, number>;
  for (const slug of CLASSIFICATION_ORDER) {
    const entry = result.classifications[slug];
    scores[slug] = entry ? averageLevel(entry.levels) : 1;
  }
  return scores;
}

// NOTE: draft placeholder copy — written to give the results screen a complete
// feel while real, reviewed reflection copy is pending from content owners.
const LEVEL_REFLECTIONS: Record<ClassificationSlug, Record<1 | 2 | 3 | 4, string>> = {
  'abiding-upwards': {
    1: "Your connection with God tends to rise and fall with how you feel in the moment. There's real openness here — the next step is building a rhythm that holds steady even when the feelings don't show up.",
    2: "You're building the habit of showing up — prayer, worship, Scripture — even when it feels like routine. That consistency is exactly what turns into depth over time.",
    3: 'You maintain a steady walk with the Holy Spirit through His Word and prayer, even in dry seasons. Your communion with Christ isn\'t dependent on how you feel in the moment.',
    4: "Abiding in Christ is the steady center of your life, not a peak experience you chase. His presence — not your circumstances — is your primary source of life.",
  },
  'discipling-downwards-deep': {
    1: "Right now you're mostly on the receiving end of teaching and encouragement — which is a completely normal place to start. The next step is starting to ask deeper questions.",
    2: "You're actively building your foundation, filling in the gaps in your understanding of the basics of the faith. That groundwork matters.",
    3: 'You engage Scripture well enough to discern truth from error, and you show up for others — encouraging and correcting when it counts.',
    4: "You're multiplying what you've learned — mentoring, leading, and equipping others to grow the same way you have.",
  },
  'private-life-inwards': {
    1: 'Your character can shift depending on who\'s watching or what the circumstances are. That\'s worth noticing gently — integrity in the unseen moments is where real transformation starts.',
    2: "You know what godly character looks like, even if it's not fully consistent yet when no one's watching. Awareness is the first real step.",
    3: 'You practice integrity even in hidden moments — bringing your struggles honestly to God and choosing truth over image, even when it costs you.',
    4: 'Your integrity is fully consistent whether you\'re seen or unseen. Your identity in Christ, not your reputation, is what steadies you.',
  },
  'relationships-outwards-sideways': {
    1: "Right now church and community mostly serve your own needs, which is a fine place to begin. There's an invitation here to start showing up for others too.",
    2: 'You\'re seeking real community and starting to build relationships, even if you\'re still finding your footing in how to serve.',
    3: 'You actively look for ways to serve, encourage, and build others up — you\'re becoming someone people can lean on.',
    4: 'You are a pillar in your community — hospitable, generous with your time, and an advocate for people others overlook.',
  },
  'kingdom-building-forwards': {
    1: 'Your faith and your everyday work or mission feel mostly separate right now. That\'s a common starting point — the door is open to start connecting the two.',
    2: "You hope your life quietly reflects Christ to the people around you, even if speaking up still feels hard. That instinct is worth acting on.",
    3: "You intentionally treat your vocation and relationships as ministry — praying for specific people by name and looking for real opportunities to share your faith.",
    4: 'You leverage your influence, work, and resources as a genuine platform for the Gospel — leading others into the same kind of Kingdom impact.',
  },
};

export function getReflection(slug: ClassificationSlug, level: number): string {
  const clamped = Math.min(4, Math.max(1, level)) as 1 | 2 | 3 | 4;
  return LEVEL_REFLECTIONS[slug][clamped];
}

// The classification the user scored lowest in (first in CLASSIFICATION_ORDER
// on a tie) — used to pick which course/lesson the "customised journey" CTA
// leads to.
export function getGrowthClassification(
  scores: Record<ClassificationSlug, number>
): ClassificationSlug {
  return CLASSIFICATION_ORDER.reduce((lowest, slug) =>
    (scores[slug] ?? 1) < (scores[lowest] ?? 1) ? slug : lowest
  );
}

export function generateSummary(
  scores: Record<ClassificationSlug, number>
): string {
  const entries = CLASSIFICATION_ORDER.map((slug) => ({
    slug,
    level: scores[slug] ?? 1,
  }));
  const maxLevel = Math.max(...entries.map((e) => e.level));
  const minLevel = Math.min(...entries.map((e) => e.level));

  if (maxLevel === minLevel) {
    return "You're showing a consistent rhythm across all five areas right now. That's a solid foundation for a customized journey that stretches you further in every dimension of your formation.";
  }

  const strong = entries
    .filter((e) => e.level === maxLevel)
    .map((e) => CLASSIFICATION_LABELS[e.slug])
    .join(' and ');
  const growth = entries
    .filter((e) => e.level === minLevel)
    .map((e) => CLASSIFICATION_LABELS[e.slug])
    .join(' and ');

  return `You're at a promising stage in your spiritual journey. With real strength in ${strong}, you've cultivated genuine depth there. Your growth edge right now is in ${growth} — not a deficiency, but the next place God is inviting you to go deeper.`;
}

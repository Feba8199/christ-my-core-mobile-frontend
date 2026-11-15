// Local stand-in for the library API.
// The UX spec describes a free "foundational" course plus paid "topical"
// resources, but the real seed data (apps/api/scripts/seed-data/courses/)
// doesn't yet have any paid tier for topical content — every non-journey
// course, including the foundational one, is accessLevel REGISTERED (free
// once signed up). Only the 20 classification-level "journey" courses
// (abiding-level-1..4 etc., see ../api/journey.ts) are STANDARD. This mock
// reflects that real state rather than inventing a paywall with no backend
// support — the accessLevel badge is already generic (PUBLIC/REGISTERED/
// STANDARD/PREMIUM) so it'll render correctly once pricing actually exists.
//
// Titles/descriptions/module structure below are real, from
// apps/api/scripts/seed-data/courses/foundations-of-faith.json and the 13
// other non-journey course seeds in that same directory.

export type LibraryAccessLevel = 'PUBLIC' | 'REGISTERED' | 'STANDARD' | 'PREMIUM';

export type LibraryLesson = { id: string; title: string };
export type LibraryModule = { id: string; title: string; lessons: LibraryLesson[] };

export type FoundationalCourse = {
  slug: string;
  title: string;
  description: string;
  accessLevel: LibraryAccessLevel;
  modules: LibraryModule[];
};

export type LibraryResource = {
  slug: string;
  title: string;
  description: string;
  accessLevel: LibraryAccessLevel;
};

const FOUNDATIONAL_COURSE: FoundationalCourse = {
  slug: 'foundations-of-faith',
  title: 'Foundations of Faith',
  description:
    'Godly principles to jump-start your faith journey with solid Biblical grounding.',
  accessLevel: 'REGISTERED',
  modules: [
    {
      id: 'foundations-of-faith-module-1',
      title: 'The Gospel Message',
      lessons: [
        { id: 'foundations-of-faith-m1-l1', title: 'The Existence of God' },
        { id: 'foundations-of-faith-m1-l2', title: 'What is the Gospel?' },
        { id: 'foundations-of-faith-m1-l3', title: 'Sin and Redemption' },
        { id: 'foundations-of-faith-m1-l4', title: 'Knowledge Check' },
      ],
    },
    {
      id: 'foundations-of-faith-module-2',
      title: 'Core Beliefs',
      lessons: [
        { id: 'foundations-of-faith-m2-l1', title: 'The Trinity Explained' },
        { id: 'foundations-of-faith-m2-l2', title: 'Salvation by Grace' },
      ],
    },
  ],
};

const RESOURCES: LibraryResource[] = [
  { slug: 'biblical-studies', title: 'Biblical Studies', description: "Dive deep into God's Word with systematic study methods and interpretation.", accessLevel: 'REGISTERED' },
  { slug: 'evangelism', title: 'Evangelism', description: 'Sharing the Gospel with boldness and compassion to those around you.', accessLevel: 'REGISTERED' },
  { slug: 'faith-trust', title: 'Faith & Trust', description: 'Strengthen your walk with God and learn to trust Him in every circumstance.', accessLevel: 'REGISTERED' },
  { slug: 'family', title: 'Family', description: "Raising your family God's way with Biblical principles for parenting and home life.", accessLevel: 'REGISTERED' },
  { slug: 'finances', title: 'Finances', description: 'Stewarding what God has given you with Biblical principles for money management.', accessLevel: 'REGISTERED' },
  { slug: 'freedom', title: 'Freedom', description: 'Break free from all that limits and confines you through the power of Christ.', accessLevel: 'REGISTERED' },
  { slug: 'identity', title: 'Identity', description: 'Become who you were destined to be by discovering your identity in Christ.', accessLevel: 'REGISTERED' },
  { slug: 'intimacy-with-god', title: 'Intimacy with God', description: 'Encounter God in a deeper way and cultivate a closer relationship with Him.', accessLevel: 'REGISTERED' },
  { slug: 'leadership', title: 'Leadership', description: 'Learn how to lead yourself and others well with servant leadership principles.', accessLevel: 'REGISTERED' },
  { slug: 'lifestyle', title: 'Lifestyle', description: 'Helping you grow emotionally, mentally, and physically as a whole person.', accessLevel: 'REGISTERED' },
  { slug: 'marriage', title: 'Marriage', description: "Discover God's design and plan for a thriving, Christ-centered marriage.", accessLevel: 'REGISTERED' },
  { slug: 'prayer', title: 'Prayer', description: 'Develop a powerful and consistent prayer life that transforms your walk with God.', accessLevel: 'REGISTERED' },
  { slug: 'purpose-calling', title: 'Purpose & Calling', description: 'Discover your God-given purpose and step into your divine calling.', accessLevel: 'REGISTERED' },
  { slug: 'spiritual-growth', title: 'Spiritual Growth', description: 'Maturing in your faith journey through intentional spiritual disciplines.', accessLevel: 'REGISTERED' },
];

// Stands in for GET /courses/catalog?category=discipleship-journey (filtered
// to the non-Program-member courses — see programCourses in
// apps/api/scripts/seed-data/programs.json, which lists only the 20
// classification-level courses, not these).
export function getFoundationalCourse(): FoundationalCourse {
  return FOUNDATIONAL_COURSE;
}

export function getLibraryResources(): LibraryResource[] {
  return RESOURCES;
}

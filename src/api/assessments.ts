// Local stand-in for the assessments API.
// Real content sourced from apps/api/scripts/seed-data/assessments/spiritual-health-checkup.json
// so this can be swapped for a real fetch() call later without changing the shape
// consumed by screens (matches AssessmentQuestionOutputDto: { id, title, prompt, options: [{id, text}] }
// in apps/api/src/modules/assessments/application/learning/dtos/assessment-question.output.dto.ts).

export type AssessmentOption = {
  id: string;
  text: string;
};

export type AssessmentQuestionView = {
  id: string;
  title: string;
  prompt: string;
  options: AssessmentOption[];
};

type InternalOption = AssessmentOption & { level: 1 | 2 | 3 | 4 };

type InternalQuestion = {
  id: string;
  title: string;
  prompt: string;
  classification: string;
  options: InternalOption[];
};

// Matches the AssessmentDefinition's real strategy: RANDOM_PER_CLASSIFICATION, limit 3.
const QUESTIONS_PER_CLASSIFICATION = 3;

const ALL_QUESTIONS: InternalQuestion[] = [
  {
    id: 'q1',
    title: 'The Dry Season',
    prompt:
      "You have been setting aside a dedicated time for prayer for three weeks, but recently, you feel absolutely nothing—no emotion, no sense of God's presence, just dryness. How do you respond?",
    classification: 'abiding-upwards',
    options: [
      { id: 'q1o1', level: 1, text: "I take it easy on the routine for a while; I believe prayer should be a positive and enjoyable experience, not forced, so I'll revisit the routine later on when I feel the urge." },
      { id: 'q1o2', level: 2, text: "I push through the discipline because I know habits are important, even if it feels like I'm just checking a box right now." },
      { id: 'q1o3', level: 3, text: 'I maintain the time but shift my focus from "feeling" God to simply being honest with Him about my dryness, trusting His Word over my emotions.' },
      { id: 'q1o4', level: 4, text: 'I view this dryness as an invitation to a deeper trust; I rest in the peace that He is present regardless of my senses, and my communion with Him remains unbroken.' },
    ],
  },
  {
    id: 'q2',
    title: 'Worship Motivation',
    prompt: "During a corporate worship service, the music style isn't your favorite and the band is slightly off-key. What happens to your worship?",
    classification: 'abiding-upwards',
    options: [
      { id: 'q2o1', level: 1, text: 'I might struggle to engage; I find myself distracted or annoyed by the quality of the music.' },
      { id: 'q2o2', level: 2, text: "I try to look past it and sing along anyway because I know I'm supposed to participate." },
      { id: 'q2o3', level: 3, text: 'I close my eyes and focus on the lyrics; my worship is an offering of truth, not a reaction to the atmosphere.' },
      { id: 'q2o4', level: 4, text: 'I use the moment to intercede for the room to help shift the atmosphere for others, regardless of the distractions.' },
    ],
  },
  {
    id: 'q3',
    title: 'Listening to God',
    prompt: "How would you describe your ability to hear God's voice in your daily life?",
    classification: 'abiding-upwards',
    options: [
      { id: 'q3o1', level: 1, text: 'I don\'t think I really "hear" God; I just read the Bible and try to be a good person.' },
      { id: 'q3o2', level: 2, text: "I sometimes get a feeling or a thought that I hope is God, but I'm often unsure if it's just me." },
      { id: 'q3o3', level: 3, text: "I'm able to identify His voice through His Word and the Spirit's promptings, and I have a track record of obeying those nudges." },
      { id: 'q3o4', level: 4, text: 'I know His voice; It is the primary navigation system for my actions.' },
    ],
  },
  {
    id: 'q4',
    title: 'Spiritual "Highs" & Lows',
    prompt: 'You just returned from a powerful Christian conference or retreat where you felt incredibly close to God. It is now two weeks later. What is your reality?',
    classification: 'abiding-upwards',
    options: [
      { id: 'q4o1', level: 1, text: 'I feel "spiritual withdrawal" and am struggling to maintain that feeling; I\'m mostly waiting for the next event to recharge me.' },
      { id: 'q4o2', level: 2, text: "I am trying to keep the fire alive by listening to the worship songs from the event and reading my notes, but it's fading." },
      { id: 'q4o3', level: 3, text: 'I have successfully integrated one or two key truths from the event into my daily life. My walk is steady even without the emotional "high."' },
      { id: 'q4o4', level: 4, text: 'My abiding life is consistent regardless of events; the retreat was refreshing, but my daily communion with Christ is my primary source of life, not the event.' },
    ],
  },
  {
    id: 'q5',
    title: 'First Thoughts',
    prompt: 'When you first wake up in the morning, before you check your phone or start your routine, where does your mind instinctively go?',
    classification: 'abiding-upwards',
    options: [
      { id: 'q5o1', level: 1, text: 'I immediately think about how tired I am or the stress of the tasks ahead.' },
      { id: 'q5o2', level: 2, text: 'I usually check my notifications or news first, then try to think about God later.' },
      { id: 'q5o3', level: 3, text: 'I consciously turn my thoughts to God, thanking Him for the new day before my feet hit the floor.' },
      { id: 'q5o4', level: 4, text: 'My mind instinctively turns to praise and worship; most days I wake up with a song or a scripture in my heart, ready to walk with Him.' },
    ],
  },
  {
    id: 'q6',
    title: 'Dependency',
    prompt: 'You are about to enter a high-stakes meeting or a difficult conversation. What is your internal preparation?',
    classification: 'abiding-upwards',
    options: [
      { id: 'q6o1', level: 1, text: "I psych myself up, rehearsing what I'm going to say so I look confident." },
      { id: 'q6o2', level: 2, text: 'I say a quick "God help me" prayer right before I walk in the door.' },
      { id: 'q6o3', level: 3, text: 'I have been praying about this for days, asking for wisdom and the right words to say.' },
      { id: 'q6o4', level: 4, text: "I enter the room knowing that God has already gone before me; I am attentive to the Holy Spirit's prompting to guide the atmosphere and the outcome." },
    ],
  },
  {
    id: 'q7',
    title: 'Encountering Cultural Trends',
    prompt: 'You see a popular social media post claiming that "all spiritual paths lead to the same God," and it sounds very loving and inclusive. How do you process this?',
    classification: 'discipling-downwards-deep',
    options: [
      { id: 'q7o1', level: 1, text: "It sounds nice and makes sense; I don't think God would reject people just because they believe differently." },
      { id: 'q7o2', level: 2, text: "I know that's probably wrong based on what I've heard in church, but I'm not exactly sure which Bible verses refute it." },
      { id: 'q7o3', level: 3, text: "I recognize this as contrary to the Gospel; I can mentally separate the cultural appeal from the biblical truth of Christ's exclusive claim." },
      { id: 'q7o4', level: 4, text: 'I not only reject the error but feel a burden to teach others why this is destructive; I can gently articulate a defense of the Gospel to those confused by it.' },
    ],
  },
  {
    id: 'q8',
    title: 'Personal Struggle & Sin',
    prompt: 'You find yourself struggling with a recurring sinful habit (anger, lust, gossip, etc.). Who knows about this?',
    classification: 'discipling-downwards-deep',
    options: [
      { id: 'q8o1', level: 1, text: 'No one. My faith is personal, and I deal with these things privately between me and God.' },
      { id: 'q8o2', level: 2, text: "I've mentioned it vaguely to a small group leader or a mentor, but did not do anything beyond that." },
      { id: 'q8o3', level: 3, text: 'I have a specific accountability partner who I authorized to ask me hard questions, and I confess to them when I slip up.' },
      { id: 'q8o4', level: 4, text: 'I not only have accountability, but I use my experience of fighting sin to mentor others, helping them build their own defenses.' },
    ],
  },
  {
    id: 'q9',
    title: 'Learning Motivation',
    prompt: 'Why do you typically sign up for a Bible study or Christian course?',
    classification: 'discipling-downwards-deep',
    options: [
      { id: 'q9o1', level: 1, text: "I usually only go if a friend invites me or if the topic is really exciting/entertaining." },
      { id: 'q9o2', level: 2, text: 'I want to understand the basics of Christianity—like the Trinity or Holiness—because I feel I have gaps in my knowledge.' },
      { id: 'q9o3', level: 3, text: 'I want to deepen my understanding of scripture so I can discern truth from error in my daily life and work.' },
      { id: 'q9o4', level: 4, text: 'I am looking to be equipped so that I can equip others.' },
    ],
  },
  {
    id: 'q10',
    title: 'Role in the Body',
    prompt: 'How would you describe your current role in the spiritual growth of other believers?',
    classification: 'discipling-downwards-deep',
    options: [
      { id: 'q10o1', level: 1, text: 'I am mostly a receiver; I attend to get fed and inspired.' },
      { id: 'q10o2', level: 2, text: "I am a participant; I'm in a group where I am learning, but I don't lead anything yet." },
      { id: 'q10o3', level: 3, text: 'I am a contributor; I offer encouragement and correction to my peers when we meet.' },
      { id: 'q10o4', level: 4, text: 'I am a multiplier; I am actively mentoring someone or leading a group to help them establish deep roots.' },
    ],
  },
  {
    id: 'q11',
    title: 'Theological Disagreement',
    prompt: 'You read a Bible verse that contradicts a strongly held belief or political opinion you have. How do you handle that?',
    classification: 'discipling-downwards-deep',
    options: [
      { id: 'q11o1', level: 1, text: 'I interpret the verse loosely so it suits my belief/opinion.' },
      { id: 'q11o2', level: 2, text: 'I feel confused and put it aside for now, sticking to the parts of the Bible I understand.' },
      { id: 'q11o3', level: 3, text: 'I submit my opinion to the Word, actively researching and studying to reshape my worldview to match Scripture.' },
      { id: 'q11o4', level: 4, text: 'I not only align my view but dig deeper to understand the principle behind it so I can teach others who might be struggling with the same issue.' },
    ],
  },
  {
    id: 'q12',
    title: 'Response to Sermons',
    prompt: 'The sermon this Sunday was incredibly conviction-heavy regarding a specific area of life. What is your Monday morning looking like?',
    classification: 'discipling-downwards-deep',
    options: [
      { id: 'q12o1', level: 1, text: "I've mostly forgotten the main point, but I remember it was a good/bad speaker." },
      { id: 'q12o2', level: 2, text: "I feel a bit guilty about that area, so I'm trying to be more mindful of it this week." },
      { id: 'q12o3', level: 3, text: 'I have written down one specific action step to change my behavior and am actively working on it.' },
      { id: 'q12o4', level: 4, text: 'I have processed the conviction with the Holy Spirit and created a long-term plan to build a new habit or mindset that ensures lasting change.' },
    ],
  },
  {
    id: 'q13',
    title: 'The Unexpected Bonus',
    prompt: 'You receive an unexpected financial bonus at work. What is your first instinct regarding the money?',
    classification: 'private-life-inwards',
    options: [
      { id: 'q13o1', level: 1, text: "I immediately think of the things I've been wanting to buy for myself or my hobbies." },
      { id: 'q13o2', level: 2, text: 'I know I should probably tithe on it, so I calculate 10% and then plan how to use the rest.' },
      { id: 'q13o3', level: 3, text: 'I view the money as a tool to practice generosity; I actively look for a need I can meet or a way to bless others before spending on myself.' },
      { id: 'q13o4', level: 4, text: 'It all belongs to God; I view my financial life as a service to Christ, seeking His direction for how I steward my money.' },
    ],
  },
  {
    id: 'q14',
    title: 'Media Consumption',
    prompt: 'You are alone on a Friday night with access to the internet and streaming services. How do you choose what to watch?',
    classification: 'private-life-inwards',
    options: [
      { id: 'q14o1', level: 1, text: "I watch whatever looks entertaining or trending; I don't really think about it spiritually." },
      { id: 'q14o2', level: 2, text: 'I try to avoid things with excessive violence or nudity because I know they are "bad" habits.' },
      { id: 'q14o3', level: 3, text: "I consciously select media that doesn't dull my spiritual sensitivity; I practice self-denial if I feel a show is affecting my heart." },
      { id: 'q14o4', level: 4, text: "My integrity is consistent whether alone or in public; I have no appetite for things that don't align with the presence of Christ." },
    ],
  },
  {
    id: 'q15',
    title: 'Hidden Character',
    prompt: "Someone at work takes credit for your idea. You know you can't prove it was you without causing a scene. What happens inside you?",
    classification: 'private-life-inwards',
    options: [
      { id: 'q15o1', level: 1, text: 'I am furious and complain to my co-workers about how unfair it is.' },
      { id: 'q15o2', level: 2, text: 'I feel angry, but I try to suppress it because I know Christians should be forgiving.' },
      { id: 'q15o3', level: 3, text: 'I struggle, but I take it to prayer, choosing to release my right to recognition and asking God to help me display the Fruit of the Spirit (patience/kindness).' },
      { id: 'q15o4', level: 4, text: 'I am at peace, resting in my identity in Christ rather than my professional reputation; God is my rewarder.' },
    ],
  },
  {
    id: 'q16',
    title: 'Integrity in "Small" Things',
    prompt: 'You are telling a story to a group of friends, and you realize exaggerating the details would make you look better or the story funnier. What do you do?',
    classification: 'private-life-inwards',
    options: [
      { id: 'q16o1', level: 1, text: "I exaggerate a little; everyone does it, and it's just for fun." },
      { id: 'q16o2', level: 2, text: "I feel a check in my spirit, but I might still blur the lines if I'm caught up in the moment." },
      { id: 'q16o3', level: 3, text: 'I stick to the truth, correcting myself mid-sentence if I have to, because I value truth over approval.' },
      { id: 'q16o4', level: 4, text: 'I habitually speak with such precision and humility that I often downplay my own role to ensure God gets the glory.' },
    ],
  },
  {
    id: 'q17',
    title: 'Thought Life',
    prompt: 'When you are driving alone or doing a mindless task, where does your mind naturally drift?',
    classification: 'private-life-inwards',
    options: [
      { id: 'q17o1', level: 1, text: 'Worries about the future, arguments with people, or fantasies about success/wealth.' },
      { id: 'q17o2', level: 2, text: 'I replay events of the day or think about my to-do list.' },
      { id: 'q17o3', level: 3, text: 'I catch wandering thoughts and intentionally direct my mind toward gratitude, prayer, or Scripture.' },
      { id: 'q17o4', level: 4, text: "My mind naturally gravitates toward meditation on God's nature and His word." },
    ],
  },
  {
    id: 'q18',
    title: 'Hidden Success',
    prompt: 'You have given a large anonymous gift for a church purpose, and no one knows. How do you feel about the lack of recognition?',
    classification: 'private-life-inwards',
    options: [
      { id: 'q18o1', level: 1, text: 'I feel dejected that no one knows what I have done.' },
      { id: 'q18o2', level: 2, text: 'I want to tell at least one person so I can get a "well done."' },
      { id: 'q18o3', level: 3, text: 'I feel content knowing God sees it; His approval is sufficient for me.' },
      { id: 'q18o4', level: 4, text: "I prefer the secrecy; I'm joyful knowing that my treasures are stored up in heaven." },
    ],
  },
  {
    id: 'q19',
    title: 'Church Involvement',
    prompt: 'Why do you attend your current local church?',
    classification: 'relationships-outwards-sideways',
    options: [
      { id: 'q19o1', level: 1, text: 'I attend because the music is good and the preaching makes me feel inspired.' },
      { id: 'q19o2', level: 2, text: "I need community, and I'm trying to get to know a few people there." },
      { id: 'q19o3', level: 3, text: 'I know I should serve and it is a good place to do that; so I actively look for needs in the church and support wherever I can.' },
      { id: 'q19o4', level: 4, text: 'I attend as I love being a pillar to the church. I enjoy serving people and it gives me so much joy to be able to serve the kingdom of God.' },
    ],
  },
  {
    id: 'q20',
    title: 'Social Interaction',
    prompt: 'You are at a dinner party with non-Christian friends, and the conversation turns to gossip about a mutual acquaintance. What do you do?',
    classification: 'relationships-outwards-sideways',
    options: [
      { id: 'q20o1', level: 1, text: 'It is not a big deal; it is just harmless venting and it happens everywhere.' },
      { id: 'q20o2', level: 2, text: 'I stay quiet and feel uncomfortable, trying not to participate.' },
      { id: 'q20o3', level: 3, text: 'I gently try to steer the conversation elsewhere, hoping to change the subject.' },
      { id: 'q20o4', level: 4, text: 'I lovingly intervene or speak well of the person being discussed, modeling integrity and even if I risk social awkwardness to honor Christ.' },
    ],
  },
  {
    id: 'q21',
    title: 'Hospitality',
    prompt: 'How often do you open your home to others?',
    classification: 'relationships-outwards-sideways',
    options: [
      { id: 'q21o1', level: 1, text: 'Rarely; I like my privacy.' },
      { id: 'q21o2', level: 2, text: 'Occasionally, but usually only for close friends or family who I know well.' },
      { id: 'q21o3', level: 3, text: 'Regularly; I intentionally invite people from church or my neighborhood to build community.' },
      { id: 'q21o4', level: 4, text: 'My home is a ministry hub; I keep it open to anyone who needs guidance, fellowship and support.' },
    ],
  },
  {
    id: 'q22',
    title: 'Comparison & Envy',
    prompt: 'A peer in your circle receives a blessing you have been praying for (e.g., a marriage, a promotion, or ministry growth). What is your immediate internal reaction?',
    classification: 'relationships-outwards-sideways',
    options: [
      { id: 'q22o1', level: 1, text: "I feel discouraged and ask God why He hasn't done it for me yet." },
      { id: 'q22o2', level: 2, text: 'I say "congratulations," but I struggle with feelings of jealousy for a few days.' },
      { id: 'q22o3', level: 3, text: 'I recognize the jealousy, reject it, and choose to celebrate with them.' },
      { id: 'q22o4', level: 4, text: 'I feel joy for them; as their victory is my victory.' },
    ],
  },
  {
    id: 'q23',
    title: 'Encouragement',
    prompt: 'When you speak to fellow believers, what is the typical content of your conversation?',
    classification: 'relationships-outwards-sideways',
    options: [
      { id: 'q23o1', level: 1, text: 'Sports, news, hobbies, or complaining about life.' },
      { id: 'q23o2', level: 2, text: 'We talk about church events or general Christian topics.' },
      { id: 'q23o3', level: 3, text: 'I intentionally speak words that build them up, sharing scriptures or encouragement specific to their life.' },
      { id: 'q23o4', level: 4, text: 'I tend to have deeper, meaningful conversations about their personal life; I help call out the gold in them and push them toward their God-given potential.' },
    ],
  },
  {
    id: 'q24',
    title: 'The "Difficult" Person',
    prompt: 'There is someone in your church/family who is socially awkward, needy, or slightly offensive. How do you treat them?',
    classification: 'relationships-outwards-sideways',
    options: [
      { id: 'q24o1', level: 1, text: 'I avoid them as much as possible to protect my peace.' },
      { id: 'q24o2', level: 2, text: "I am polite when I see them, but I don't go out of my way to engage." },
      { id: 'q24o3', level: 3, text: 'I make an effort to include them in conversations and show them kindness.' },
      { id: 'q24o4', level: 4, text: 'I naturally befriend them, seeing them as someone Jesus loves, and advocate for them when others exclude them.' },
    ],
  },
  {
    id: 'q25',
    title: 'Career & Vocation',
    prompt: 'How do you view your current job or daily work?',
    classification: 'kingdom-building-forwards',
    options: [
      { id: 'q25o1', level: 1, text: 'It is a means to pay my bills and cater for my needs and wants.' },
      { id: 'q25o2', level: 2, text: "I'm looking for ways to be good at my work; I try to work hard and be honest, contributing my skills" },
      { id: 'q25o3', level: 3, text: 'I see my vocation as a service to Christ; I have a purpose there to influence my sphere for the Kingdom.' },
      { id: 'q25o4', level: 4, text: 'My work is a platform for the Great Commission; I leverage my position and resources to advance the Kingdom of God.' },
    ],
  },
  {
    id: 'q26',
    title: 'Gifts/Talents',
    prompt: 'If someone asked you what your gifts/talents are, what would you say?',
    classification: 'kingdom-building-forwards',
    options: [
      { id: 'q26o1', level: 1, text: 'I\'m not sure what "gifts/talents" really means or what mine would be.' },
      { id: 'q26o2', level: 2, text: "I think I might have a few gifts/talents but I don't really know what to do with them." },
      { id: 'q26o3', level: 3, text: 'I know my gifts/talents well and I am using them to serve the kingdom of God and others.' },
      { id: 'q26o4', level: 4, text: 'Not only do I know my gifts/talents, I am also helping others discover their gifts/talents and put them to use; I focus on equipping the body.' },
    ],
  },
  {
    id: 'q27',
    title: 'Evangelism',
    prompt: 'When was the last time you shared the Gospel with someone?',
    classification: 'kingdom-building-forwards',
    options: [
      { id: 'q27o1', level: 1, text: 'I generally leave that to the pastors and evangelists.' },
      { id: 'q27o2', level: 2, text: "I can't remember; I'm keen, but hesitant since I don't know how to start." },
      { id: 'q27o3', level: 3, text: 'I regularly look for opportunities to share my story and the Gospel message with those in my sphere.' },
      { id: 'q27o4', level: 4, text: 'I organize or lead initiatives to reach out to people and train others to share their faith.' },
    ],
  },
  {
    id: 'q28',
    title: 'Kingdom Risk',
    prompt: 'You feel God prompting you to do something that carries significant risk (reputational, financial, or safety). How do you respond?',
    classification: 'kingdom-building-forwards',
    options: [
      { id: 'q28o1', level: 1, text: 'I am likely to ignore it; As it is risky and endangers my security.' },
      { id: 'q28o2', level: 2, text: 'I hesitate and analyze the possible outcomes, looking for a "safe" way to obey.' },
      { id: 'q28o3', level: 3, text: "I obey, feeling the fear but trusting that God's plan is worth the risk." },
      { id: 'q28o4', level: 4, text: 'I leap at the opportunity; I view risk as the currency of faith and am thrilled to stake everything on His word.' },
    ],
  },
  {
    id: 'q29',
    title: 'Sphere of Influence',
    prompt: 'You look at your non-Christian network (colleagues, neighbors, gym buddies). How do you view them?',
    classification: 'kingdom-building-forwards',
    options: [
      { id: 'q29o1', level: 1, text: 'They are just people I know; I keep my faith private to avoid awkwardness.' },
      { id: 'q29o2', level: 2, text: "I hope they know I'm a Christian by my behavior, but I don't bring it up." },
      { id: 'q29o3', level: 3, text: 'I am praying for them by name and waiting for the right moment to share the Gospel.' },
      { id: 'q29o4', level: 4, text: 'I view them as my mission field; I am building bridges to dismantle their barriers to Christ.' },
    ],
  },
  {
    id: 'q30',
    title: 'Global Awareness',
    prompt: 'When you hear news of war, famine, or persecution in another part of the world, what is your reaction?',
    classification: 'kingdom-building-forwards',
    options: [
      { id: 'q30o1', level: 1, text: "I feel bad for a moment, but I scroll past it because it's depressing." },
      { id: 'q30o2', level: 2, text: 'I might say a quick prayer, but I feel helpless to do anything about it.' },
      { id: 'q30o3', level: 3, text: 'I stop to intercede and look for ways to give or help.' },
      { id: 'q30o4', level: 4, text: 'I feel the burden of the Lord; I am already involved in global missions to impact the nations.' },
    ],
  },
];

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function toView(q: InternalQuestion): AssessmentQuestionView {
  return {
    id: q.id,
    title: q.title,
    prompt: q.prompt,
    options: q.options.map(({ id, text }) => ({ id, text })),
  };
}

// Stands in for GET /assessments/:assessmentId/latest-attempt (once a "start" endpoint exists).
// Mirrors the real RANDOM_PER_CLASSIFICATION / limit-3 strategy: 3 questions from each
// of the 5 classifications, shuffled, for 15 total.
export async function getAssessmentQuestions(): Promise<AssessmentQuestionView[]> {
  const byClassification = new Map<string, InternalQuestion[]>();
  for (const q of ALL_QUESTIONS) {
    const list = byClassification.get(q.classification) ?? [];
    list.push(q);
    byClassification.set(q.classification, list);
  }

  const session: InternalQuestion[] = [];
  for (const questions of byClassification.values()) {
    session.push(...shuffle(questions).slice(0, QUESTIONS_PER_CLASSIFICATION));
  }

  return shuffle(session).map(toView);
}

// Matches the real SURVEY branch of AssessmentResultSchema
// (apps/api/src/modules/assessments/api/learning/schemas/assessment-result.schema.ts) —
// a raw per-classification distribution of how many answers landed at each level.
// Deriving a single "you are level X" summary from this distribution is left to
// the UI (see src/utils/assessmentResult.ts), same as it would be with the real API.
export type SurveyResult = {
  type: 'SURVEY';
  total: number;
  nonClassificationCount: number;
  classifications: Record<string, { count: number; levels: Record<string, number> }>;
};

// Stands in for the `result` field returned by POST /assessments/:assessmentId/submit.
export function computeAssessmentResult(
  answers: Record<string, string>
): SurveyResult {
  const classifications: SurveyResult['classifications'] = {};
  let total = 0;

  for (const [questionId, optionId] of Object.entries(answers)) {
    const question = ALL_QUESTIONS.find((q) => q.id === questionId);
    const option = question?.options.find((o) => o.id === optionId);
    if (!question || !option) continue;

    total += 1;
    const entry = classifications[question.classification] ?? {
      count: 0,
      levels: {},
    };
    entry.count += 1;
    const levelKey = String(option.level);
    entry.levels[levelKey] = (entry.levels[levelKey] ?? 0) + 1;
    classifications[question.classification] = entry;
  }

  return { type: 'SURVEY', total, nonClassificationCount: 0, classifications };
}

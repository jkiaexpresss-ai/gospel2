/**
 * Centralized assets for the Books landing page.
 * All book covers, logos, and illustrations can be swapped here.
 * Book images support transparent PNGs with subtle shadows and glow.
 */

export interface BookCover {
  id: string;
  title: string;
  subtitle: string;
  age: 'Kids' | 'Teen' | 'Adult';
  accent: string; // hex
  cover: string;  // image URL (transparent PNG recommended)
}

export const heroBooks: BookCover[] = [
  {
    id: 'kids',
    title: 'Kids',
    subtitle: 'Ages 6–12',
    age: 'Kids',
    accent: '#F59E0B',
    cover: '/images/books/in_the_begining_he_was_there(kids_version) copy copy.png',
  },
  {
    id: 'teen',
    title: 'Teen',
    subtitle: 'Ages 13–18',
    age: 'Teen',
    accent: '#3B82F6',
    cover: '/images/books/in_the_begining_he_was_there(teen_version) copy copy.png',
  },
  {
    id: 'adult',
    title: 'Adult',
    subtitle: 'Ages 19+',
    age: 'Adult',
    accent: '#D4AF37',
    cover: '/images/books/in_the_begining_he_was_there(adult_version) copy copy.png',
  },
];

export interface Collection {
  id: string;
  volume: string;
  title: string;
  scripture: string;
  days: number;
  description: string;
  cover: string;
}

export const collections: Collection[] = [
  {
    id: 'vol-one',
    volume: 'Volume One',
    title: 'He Was Always the Answer',
    scripture: 'Meeting Jesus throughout Scripture',
    days: 120,
    description: 'A 120-day journey tracing the promise of a Saviour from Genesis to Revelation, revealing Christ on every page.',
    cover: '/images/books/in_the_begining_he_was_there(adult_version) copy copy.png',
  },
  {
    id: 'torah-1',
    volume: 'Torah Volume One',
    title: 'In the Beginning, He Was There',
    scripture: 'Genesis & Exodus',
    days: 100,
    description: 'Walk through the foundations of Scripture and see the Lamb slain before the foundation of the world.',
    cover: '/images/books/in_the_begining_he_was_there(adult_version) copy copy.png',
  },
  {
    id: 'torah-2',
    volume: 'Torah Volume Two',
    title: 'Every Offering Pointed to Him',
    scripture: 'Leviticus & Numbers',
    days: 67,
    description: 'Discover how every sacrifice, feast, and tent peg in the wilderness pointed to the coming Saviour.',
    cover: '/images/books/in_the_begining_he_was_there(adult_version) copy copy.png',
  },
  {
    id: 'psalms',
    volume: 'Psalms',
    title: 'He Sang About Himself',
    scripture: 'The Songbook of the King',
    days: 82,
    description: 'Hear the voice of the Shepherd-King in every psalm, from the cross-shaped cries of David to the praises of Zion.',
    cover: '/images/books/he_sang_about_himself.png',
  },
  {
    id: 'nt',
    volume: 'New Testament',
    title: 'Everywhere I Look, It\'s Him',
    scripture: 'The Gospels & Beyond',
    days: 120,
    description: 'See how the Old Testament promises burst into living colour the moment the Word becomes flesh.',
    cover: '/images/books/everywhere_i_look_its_him.png',
  },
  {
    id: 'deut',
    volume: 'Deuteronomy',
    title: 'He Spoke Before He Came',
    scripture: 'The Prophet Like Moses',
    days: 120,
    description: 'Listen to the sermons of Moses and hear the heartbeat of the Prophet who would one day stand on the mountain.',
    cover: '/images/books/he_spoke_before_he_came(adult_version).png',
  },
];

export interface AgeCard {
  id: string;
  age: string;
  range: string;
  features: string[];
  cover: string;
}

export const ageCards: AgeCard[] = [
  {
    id: 'kids-card',
    age: 'Kids',
    range: 'Age 6–12',
    features: ['Bright illustrations', 'Simple explanations', 'Fun activities', 'Family discussion'],
    cover: '/images/books/in_the_begining_he_was_there(kids_version) copy copy.png',
  },
  {
    id: 'teen-card',
    age: 'Teen',
    range: 'Age 13–18',
    features: ['Faith in today\'s world', 'Reflection', 'Questions', 'Life application'],
    cover: '/images/books/in_the_begining_he_was_there(teen_version) copy copy.png',
  },
  {
    id: 'adult-card',
    age: 'Adult',
    range: 'Age 19+',
    features: ['Rich theology', 'Prayer', 'Daily transformation', 'Church study'],
    cover: '/images/books/in_the_begining_he_was_there(adult_version) copy copy.png',
  },
];

export interface Feature {
  id: string;
  title: string;
  description: string;
}

export const features: Feature[] = [
  {
    id: 'christ-centered',
    title: 'Christ-Centered',
    description: 'Every devotional reveals Jesus — from the first page of Genesis to the last amen of Revelation.',
  },
  {
    id: 'scripture-first',
    title: 'Scripture First',
    description: "God's Word explains God's Word. We let Scripture interpret Scripture, always.",
  },
  {
    id: 'beautiful-design',
    title: 'Beautiful Design',
    description: 'Premium artwork, a premium reading experience, and premium printing worthy of the message.',
  },
  {
    id: 'built-for-families',
    title: 'Built for Families',
    description: 'Parents, kids, teens, small groups, and churches — one journey, every generation.',
  },
];

export const timeline: string[] = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers',
  'Deuteronomy', 'Psalms', 'New Testament',
];

export const checklist: string[] = [
  'Daily devotional',
  'Prayer',
  'Reflection',
  'Scripture',
  'Christ Connection',
  'Family Friendly',
  'Deep Theology',
];

export interface PriceTier {
  id: string;
  name: string;
  tagline: string;
  highlight?: boolean;
  prices: { currency: string; amount: string }[];
  formats: string[];
}

export const pdfPricing: PriceTier[] = [
  {
    id: 'adult-pdf',
    name: 'Adult Edition',
    tagline: 'Ages 19+',
    prices: [
      { currency: 'USD', amount: '$12' },
      { currency: 'KES', amount: '1,600' },
      { currency: 'NGN', amount: '19,000' },
      { currency: 'GHS', amount: '170' },
      { currency: 'ZAR', amount: '220' },
      { currency: 'UGX', amount: '45,000' },
      { currency: 'TZS', amount: '32,000' },
    ],
    formats: ['PDF'],
  },
  {
    id: 'teen-pdf',
    name: 'Teen Edition',
    tagline: 'Ages 13–18',
    prices: [
      { currency: 'USD', amount: '$10' },
      { currency: 'KES', amount: '1,350' },
      { currency: 'NGN', amount: '16,000' },
      { currency: 'GHS', amount: '142' },
      { currency: 'ZAR', amount: '185' },
      { currency: 'UGX', amount: '37,000' },
      { currency: 'TZS', amount: '27,000' },
    ],
    formats: ['PDF'],
  },
  {
    id: 'kids-pdf',
    name: 'Kids Edition',
    tagline: 'Ages 6–12',
    prices: [
      { currency: 'USD', amount: '$8' },
      { currency: 'KES', amount: '1,080' },
      { currency: 'NGN', amount: '12,800' },
      { currency: 'GHS', amount: '114' },
      { currency: 'ZAR', amount: '148' },
      { currency: 'UGX', amount: '30,000' },
      { currency: 'TZS', amount: '21,000' },
    ],
    formats: ['PDF'],
  },
  {
    id: 'family-bundle',
    name: 'Complete Family Bundle',
    tagline: 'All 3 editions',
    highlight: true,
    prices: [
      { currency: 'USD', amount: '$25' },
      { currency: 'KES', amount: '3,350' },
      { currency: 'NGN', amount: '40,000' },
      { currency: 'GHS', amount: '356' },
      { currency: 'ZAR', amount: '460' },
      { currency: 'UGX', amount: '94,000' },
      { currency: 'TZS', amount: '68,000' },
    ],
    formats: ['PDF'],
  },
];

export interface BulkTier {
  id: string;
  quantity: string;
  discount: string;
  note?: string;
}

export const bulkPricing: BulkTier[] = [
  { id: 'b1', quantity: '5–20 family bundles', discount: '20% off' },
  { id: 'b2', quantity: '21–50 family bundles', discount: '30% off' },
  { id: 'b3', quantity: '51+ family bundles', discount: '40% off', note: 'Contact inhimdaily.org for invoice' },
];

export const freeEntryPoints: { id: string; title: string; description: string }[] = [
  {
    id: 'f1',
    title: '7-Day Sampler PDF',
    description: 'A free 7-day sampler of every volume — yours to keep, no sign-up required.',
  },
  {
    id: 'f2',
    title: 'Day 1 of Every Book',
    description: 'Read the first day of every book free on inhimdaily.org, no account needed.',
  },
  {
    id: 'f3',
    title: 'YouVersion Reading Plan',
    description: 'A free reading plan on YouVersion — the top of the acquisition funnel.',
  },
];

export interface HowToDayMovement {
  id: string;
  title: string;
  description: string;
}

export const dailyMovements: HowToDayMovement[] = [
  {
    id: 'see-jesus',
    title: 'See Jesus First',
    description:
      'The passage is read through the lens of Christ. You will not start with practical application — you will start with the Person the passage points toward.',
  },
  {
    id: 'what-isnt',
    title: "What This Isn't",
    description:
      'Good reading also knows what the text is not doing, which protects you from misreading it in either direction.',
  },
  {
    id: 'ordinary-day',
    title: 'What This Looks Like in an Ordinary Day',
    description:
      'The Christ you see in the text is meant to change how you live, not just what you believe.',
  },
  {
    id: 'conversation',
    title: 'Your Conversation With God',
    description:
      'Journal prompts, reflection questions, and prayer space that take the day’s insight into personal encounter.',
  },
  {
    id: 'deep-reflection',
    title: 'Deep Reflection Questions',
    description:
      'For those who want to go further into the theological and personal weight of what the passage contains.',
  },
];

export interface HowToTip {
  id: string;
  title: string;
  description: string;
}

export const howToTips: HowToTip[] = [
  {
    id: 'read-order',
    title: 'Read in Order',
    description:
      'Each day builds on what has come before. You do not need to know the Bible well to begin — no theology degree or years of church experience required. You need only the willingness to look at what the text actually says, and let the One you find there change you.',
  },
  {
    id: 'do-not-rush',
    title: 'Do Not Rush',
    description:
      'The journal space is not decorative. The questions are not optional extras. Slow reading that produces genuine encounter is worth more than fast reading that produces only information.',
  },
  {
    id: 'come-back',
    title: 'Come Back',
    description:
      'If life interrupts and you miss a day or a week, come back where you left off. This is not a race and there is no judgment for stopping and starting. The Person you are reading toward is patient.',
  },
];

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    quote: 'The first devotional that helped our entire family study together.',
    author: 'The Garcia Family',
  },
  {
    id: 't2',
    quote: 'My teenagers actually look forward to reading.',
    author: 'Marcus T.',
  },
  {
    id: 't3',
    quote: 'Beautiful enough for a coffee table. Deep enough for Bible study.',
    author: 'Pastor Elena R.',
  },
  {
    id: 't4',
    quote: 'My kids ask for the next chapter before bedtime every single night.',
    author: 'The Okafor Family',
  },
  {
    id: 't5',
    quote: 'I have never seen my teens so engaged with Scripture. It is a gift.',
    author: 'Daniel & Sofia M.',
  },
];

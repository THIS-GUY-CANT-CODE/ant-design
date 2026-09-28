export const BASE = '/concepts/biscuit-bunker';
export const VIMEO = 'https://vimeo.com/biscuitbunker';
export const CONTACT_URL = 'https://biscuitbunker.com/';
export const ADDRESS = 'Shoreditch, London EC2A 4NE';
export const POSTCODE = 'EC2A 4NE';
/** Approximate; refined from the postcode at runtime. */
export const APPROX = { lat: 51.5262, lng: -0.0838 };

export const PAGES = [
  { href: `${BASE}/work`, label: 'Work', sub: 'From our Vimeo' },
  { href: `${BASE}/services`, label: 'Services', sub: 'Five disciplines' },
  { href: `${BASE}/studio`, label: 'Studio', sub: 'The old biscuit factory' },
  { href: `${BASE}/brief`, label: 'Start a brief', sub: 'Build it in two minutes' },
] as const;

export type ServiceInfo = { slug: string; name: string; line: string; intro: string; includes: string[]; deliverables: string[]; steps: [string, string][]; faq: [string, string][] };
export const SERVICES: ServiceInfo[] = [
  {
    slug: 'commercials',
    name: 'Commercials',
    line: 'TV, online and social spots, from treatment through shoot to grade.',
    intro: 'Spots that earn the attention they get. We write the treatment, cast it, shoot it and finish it, then cut it for every place it will run.',
    includes: ['Treatment and script development', 'Casting, locations and crew', 'Shoot (studio or location)', 'Edit, grade, sound design and mix', 'Music licensing and supers'],
    deliverables: ['Hero spot plus 20s, 10s and 6s cutdowns', '16:9 for TV and YouTube', '9:16 for Reels, TikTok and Shorts', '1:1 and 4:5 for feeds', 'Clearcast-ready masters for UK broadcast'],
    steps: [['Brief & treatment', 'Your goal, audience and budget, turned into a creative route.'], ['Pre-production', 'Script, boards, casting, locations and a schedule.'], ['Shoot', 'A crew sized to the job.'], ['Post & delivery', 'Edit, grade, sound and every version you need.']],
    faq: [['Do you handle Clearcast?', 'UK TV ads need Clearcast clearance before they air. We build the time for it into the schedule and supply compliant masters.'], ['Can you work to an agency’s script?', 'Yes. We work with agencies and directly with brands.']],
  },
  {
    slug: 'branded-content',
    name: 'Branded content',
    line: 'Stories people choose to watch, made for the platforms they actually use.',
    intro: 'Series and stories that people choose to watch, designed around the platform from the first idea rather than cut down at the end.',
    includes: ['Format and series development', 'Presenter and talent casting', 'Multi-day and run-and-gun shoots', 'Platform-native edits and captions'],
    deliverables: ['Episodes and cutdowns', '9:16 vertical first where it matters', 'Burned-in captions for sound-off viewing', 'Thumbnails and titles'],
    steps: [['Format', 'What the series is, and why someone would watch episode two.'], ['Plan', 'Episodes, locations and talent.'], ['Shoot', 'Efficient shoots that capture more than one episode.'], ['Release', 'Edits for each platform, ready to schedule.']],
    faq: [['Vertical or horizontal?', 'Both, planned at the shoot, so neither version is a crop of the other.'], ['Can you run the channel too?', 'We make the content; we can work with your social team or agency on release.']],
  },
  {
    slug: 'corporate-film',
    name: 'Corporate film',
    line: "Brand films, internal comms and events that don't feel corporate.",
    intro: 'Brand films, internal comms and event coverage that people actually watch to the end.',
    includes: ['Interviews and documentary-style shoots', 'Event filming and same-day edits', 'Internal comms and training films', 'Subtitles and accessible versions'],
    deliverables: ['Main film and short edits', 'Subtitled versions (SRT files included)', 'Stills and pull-quotes for social', 'Web-optimised and presentation-ready files'],
    steps: [['Brief', 'Who it is for and what should change after they watch.'], ['Interviews', 'Prepared questions and relaxed interviewees.'], ['Shoot', 'On site, with minimal disruption.'], ['Edit', 'Story first, logo second.']],
    faq: [['Can you film at our offices?', 'Yes, with a small crew and minimal setup.'], ['Do you subtitle?', 'Always offered, and supplied as burned-in versions and separate SRT files.']],
  },
  {
    slug: 'animation-motion',
    name: 'Animation & motion',
    line: '2D, 3D and motion graphics, from explainers to title sequences.',
    intro: 'Explainers, title sequences and motion systems in 2D and 3D, designed frame by frame.',
    includes: ['Script and storyboard', 'Styleframes', 'Animatic with scratch voice-over', '2D, 3D and motion graphics', 'Voice-over and sound design'],
    deliverables: ['Final animation in every aspect ratio', 'Loopable social versions', 'Motion toolkit for your team (on request)'],
    steps: [['Script & boards', 'The story, frame by frame.'], ['Styleframes', 'How it looks, signed off before anything moves.'], ['Animatic', 'Timing and voice-over, roughed out.'], ['Animation', 'Built, polished, scored and delivered.']],
    faq: [['How long is an explainer?', 'Usually 60 to 90 seconds. Shorter is almost always better.'], ['Can you match our brand guidelines?', 'Yes. Styleframes come first so the look is agreed before animation begins.']],
  },
  {
    slug: 'podcasts',
    name: 'Podcasts',
    line: 'Concept, recording, editing, distribution and promotion, all under one roof.',
    intro: 'From the idea to the feed: concept, recording, editing, distribution and promotion, all under one roof.',
    includes: ['Format and host development', 'Studio or on-location recording', 'Editing, mixing and mastering', 'Distribution to the major platforms', 'Promotion clips and audiograms'],
    deliverables: ['Mastered episodes', 'Show notes and transcripts', 'Vertical video clips for social', 'Artwork and trailer'],
    steps: [['Concept', 'The show, the host and the running order.'], ['Record', 'Audio and video, in a studio or on location.'], ['Edit', 'Tight, clean and mastered.'], ['Launch', 'On the feeds, with clips to promote it.']],
    faq: [['Audio only, or video too?', 'Either. Video podcasts give you clips for social as well as the full show.'], ['Can you handle distribution?', 'Yes, to the major podcast platforms.']],
  },
];

export const MAP_THEME = { land: '#101010', water: '#1B1F22', park: '#151A0F', building: '#171717', road: '#242424', roadMajor: '#353B22', label: '#8C8B86', halo: '#0A0A0A', pin: '#D7FF3F', pinInk: '#0A0A0A' };

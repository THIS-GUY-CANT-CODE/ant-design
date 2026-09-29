export const BASE = '/concepts/walthamstow-osteopaths';
export const ADDRESS = '72 St Mary Road, Walthamstow, London E17 9RE';
export const POSTCODE = 'E17 9RE';
/** Approximate; refined from the postcode at runtime. */
export const APPROX = { lat: 51.5838, lng: -0.0162 };
export const PHONE = ['020 8521 7888', '+442085217888'] as const;
export const EMAIL = 'walthamstowosteopaths@gmail.com';

export const PAGES = [
  { href: `${BASE}/treatments`, label: 'Treatments', sub: 'Six ways we help' },
  { href: `${BASE}/first-visit`, label: 'First visit', sub: 'What happens, what to bring' },
  { href: `${BASE}/about`, label: 'No.72', sub: 'The building and the team' },
  { href: `${BASE}/visit`, label: 'Visit', sub: 'Map and trains' },
  { href: `${BASE}/faq`, label: 'FAQ', sub: 'Good to know' },
] as const;

export type Treatment = { slug: string; name: string; short: string; tag?: string; what: string; session: string[]; good: string[]; areas: string[] };

// General descriptions only. Nothing here promises an outcome; the osteopath advises at the first visit.
export const TREATMENTS: Treatment[] = [
  {
    slug: 'structural-osteopathy',
    name: 'Structural osteopathy',
    tag: 'Our speciality',
    short: 'A hands-on approach to how your muscles, joints and spine work together, using soft tissue work, mobilisation and manipulation.',
    what: 'Osteopathy works with the muscles, joints and connective tissue using hands-on techniques: stretching, soft tissue massage, joint mobilisation and, where appropriate, manipulation. It’s a regulated profession in the UK, and people most often come to us with back, neck and joint problems.',
    session: ['We ask about your symptoms, history, work and lifestyle', 'We look at how you move and gently examine the areas involved', 'We explain what we think is going on and agree a plan with you', 'Treatment usually starts in the same session, with advice to take home'],
    good: ['Wear something comfortable you can move in', 'Bring a list of any medication you take', 'You don’t need a GP referral'],
    areas: ['back', 'neck', 'joints', 'sports'],
  },
  {
    slug: 'cranial-osteopathy',
    name: 'Cranial osteopathy',
    short: 'A gentle, subtle form of osteopathy. Both our founders have postgraduate training from the Sutherland Cranial College.',
    what: 'Cranial osteopathy uses very light, gentle pressure rather than stretching or manipulation. Both Iain and Stephen trained in it at the Sutherland Cranial College after qualifying as osteopaths.',
    session: ['A full case history, as with any first visit', 'You stay clothed and lie comfortably on the couch', 'Very gentle, still contact rather than big movements', 'We talk through how you felt afterwards and what comes next'],
    good: ['Many people find it relaxing', 'Tell us about any medication or recent treatment'],
    areas: ['tension', 'neck'],
  },
  {
    slug: 'acupuncture',
    name: 'Acupuncture',
    short: 'Fine needles placed at specific points, as a treatment on its own or alongside osteopathy.',
    what: 'Acupuncture places very fine, single-use needles at specific points. We offer it on its own or as part of osteopathic treatment.',
    session: ['A case history and a check that acupuncture is suitable for you', 'Fine needles placed at the chosen points, usually for a short while', 'Needles removed and disposed of, then aftercare advice'],
    good: ['Tell us if you’re pregnant, on blood thinners, or have a pacemaker', 'Eat something light beforehand'],
    areas: ['neck', 'back', 'tension'],
  },
  {
    slug: 'sports-massage',
    name: 'Sports massage',
    short: 'Deep, focused massage for people who train, run or just carry a lot of tension.',
    what: 'Firm, focused massage aimed at specific muscle groups. It suits people who train regularly, and anyone whose job or life leaves them tight and sore.',
    session: ['A quick chat about your training, work and where you feel it', 'Deep, targeted massage on the areas that need it', 'Stretching and self-care advice to take away'],
    good: ['It can be firm; tell us if you want it lighter', 'Drink water afterwards and keep moving gently'],
    areas: ['sports', 'back', 'tension'],
  },
  {
    slug: 'aromatherapy',
    name: 'Aromatherapy',
    short: 'Massage with essential oils, for a slower and more relaxing session.',
    what: 'A slower, gentler massage using essential oils chosen with you. It’s about relaxation as much as muscles.',
    session: ['We ask about you, and any allergies or sensitivities', 'We choose oils together', 'A calm, unhurried massage'],
    good: ['Tell us about any skin conditions, allergies or pregnancy', 'Give yourself a quiet hour afterwards if you can'],
    areas: ['tension'],
  },
  {
    slug: 'nutritional-therapy',
    name: 'Nutritional therapy',
    short: 'Advice on diet and lifestyle, to go with the rest of your care.',
    what: 'Practical advice on diet and lifestyle, alongside the rest of your care at No.72.',
    session: ['A conversation about how you eat, sleep and live day to day', 'Realistic changes agreed with you', 'Follow-ups to see what’s working'],
    good: ['A food diary for a few days beforehand helps', 'Bring details of any supplements or medication'],
    areas: ['energy'],
  },
];

export const AREAS = [
  ['back', 'My back'],
  ['neck', 'Neck & shoulders'],
  ['joints', 'A joint (hip, knee, ankle…)'],
  ['sports', 'Training or sport'],
  ['tension', 'Tension & stress'],
  ['energy', 'Diet & energy'],
] as const;

export const FAQS: [string, string][] = [
  ['Do I need a referral from my GP?', 'No. You can book directly with us.'],
  ['What should I wear?', 'Something comfortable you can move in. For osteopathy we may ask you to remove some outer clothing so we can see how you move; tell us if you’d rather not.'],
  ['What should I bring?', 'A list of any medication you take, and any scans or letters about the problem if you have them.'],
  ['How long is an appointment and how much does it cost?', '[Add appointment lengths and prices for first and follow-up visits.]'],
  ['Can I claim on my health insurance?', '[Confirm which insurers the practice is registered with.]'],
  ['Is osteopathy regulated?', 'Yes. Osteopaths in the UK must be registered with the General Osteopathic Council.'],
  ['Who will I see?', 'Iain Chapman and Stephen Moore founded the practice in 2000 and still treat here.'],
  ['Where exactly are you?', "72 St Mary Road, E17 9RE, on the edge of Walthamstow Village. It's a short walk from Walthamstow Central (Victoria line and Overground)."],
  ['Is it urgent?', 'If you have sudden severe pain, numbness, weakness, or problems with your bladder or bowels, call NHS 111 or 999 rather than waiting for an appointment.'],
];

export const MAP_THEME = { land: '#EEEAE3', water: '#C8D6D6', park: '#C9D4BC', building: '#E4DED4', road: '#F8F6F1', roadMajor: '#DCD2C4', label: '#62695F', halo: '#EEEAE3', pin: '#2E4A3A', pinInk: '#F8F6F1' };

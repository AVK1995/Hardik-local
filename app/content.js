/**
 * PROJECT ALPHA WELLNESS — all approved copy, in one place.
 *
 * Source of truth: "Hardik + Karthik — Project Alpha Wellness — Strategy & Game Plan (v1.1)".
 * Written to the NO-BRAINER 13-beat VSL skeleton and approved at Step 2.
 *
 * MISSING[] entries below are deliberate placeholders. Nothing here is invented.
 */

export const MISSING = {
  founderCredentials: 'MISSING — founder credentials (qualification, years, institution)',
  founderStory: 'MISSING — founder first-person story',
  guarantee: 'MISSING — guarantee terms (Hardik + Karthik to set)',
  refundTerms: 'MISSING — refund terms on the Rs 97',
  callLength: 'MISSING — call length',
  ratingAvatars: 'MISSING — client photos for the rating row',
};

/* ── The CTA lockup. Reused VERBATIM at every proof beat. ───────────────── */
export const cta = {
  aboveVideo: 'Watch The Short Video Below',
  button: 'Click Here To Get Your Root-Cause Diagnosis + 90-Day Roadmap',
  buttonSub: 'Rs 97 to book',
  chips: ['90-Day Protocol', '120+ Men', 'India & International'],
  urgencyLabel: 'Offer ends in',
  // Not a guarantee. This is the strategy doc's own honest-disqualification position.
  reassurance:
    'A diagnostic session, not a pitch. If your case is one we cannot fix, you will hear that on the call.',
  guaranteeLine: null, // ← MISSING.guarantee slots in here across all 7 instances at once
};

/* ── BEAT 0a · Announcement strip ───────────────────────────────────────── */
export const announce = [
  '120+ men through the protocol',
  '73% completely off the pill in 90 days',
  '5.0 rating',
];

/* ── BEAT 0b · Trust row ────────────────────────────────────────────────── */
export const trustRow = [
  '120+ men through the protocol',
  '73% off the pill in 90 days',
  'India, Middle East, US, Canada, Singapore',
  'Rs 97 to book',
];

/* ── BEAT 1 · Hero ──────────────────────────────────────────────────────── */
export const hero = {
  gate: 'For Men 30 To 45 Who Need The Pill To Perform And Want Out',
  h1line1: 'Get Off The Blue Pill In The Next 90 Days',
  h1line2:
    'And fix the HbA1c, the cholesterol and the belly that are moving in the same wrong direction.',
  sub: 'Project Alpha Wellness treats the root cause under both, so your body stops needing the workaround.',
  // Kunal lock: pre-video pills are programme FEATURES, never transformation figures.
  featurePills: [
    'Live blood report read',
    'One-to-one weekly sessions',
    'Marker retest at month 3',
    'Root-cause protocol, not a prescription',
  ],
  pointers: [
    { icon: 'report', text: 'Your reports, read live on the call' },
    { icon: 'target', text: 'The exact root cause named, not guessed' },
    { icon: 'route', text: 'Your 90-day roadmap, mapped to your case' },
  ],
  stats: [
    { value: '120+', label: 'Men Through The Protocol' },
    { value: '73%', label: 'Off The Pill In 90 Days' },
    { value: '5.0', label: 'Rating' },
    { value: 'Rs 97', label: 'To Start' },
  ],
  // Kunal lock: 4 programme OUTCOME pills, no heading, after the credibility table.
  outcomePills: [
    'Off Sildenafil and Tadalafil',
    'HbA1c down 2 to 3 points',
    'Belly moving from week 6',
    'Testosterone back in functional range',
  ],
};

/* ── BEAT 2 · This Is For You If (exactly 5) ────────────────────────────── */
export const forYouIf = {
  eyebrow: 'For The Man Who Has Not Said This Out Loud To A Single Person',
  h2: ['Read These Five And See How Many Are ', 'Yours.'],
  items: [
    {
      lead: 'You are on the pill, and the dose keeps climbing.',
      body: 'You started at 5mg because it was meant to be occasional. You are somewhere near 50 or 100 now, and no doctor has ever offered you a way off it.',
    },
    {
      lead: 'Your reports have been borderline for a year.',
      body: 'HbA1c creeping. Cholesterol ratio off. Your doctor said take this and come back in six months, and nobody connected those numbers to what is happening at home.',
    },
    {
      lead: 'You are already doing the things you were told to do.',
      body: 'You train. You eat better than you did. The belly has not moved and the pills have not reduced, and the knowledge was never the part you were missing.',
    },
    {
      lead: 'You want spontaneity back, not a better workaround.',
      body: 'Not a stronger dose, not a different spray, not a timing plan. You want it to work the way it worked when you were 32, without planning your evening around a tablet.',
    },
    {
      lead: 'You want the root fixed, not managed for thirty years.',
      body: 'You have seen where the maintenance path goes for the men ahead of you. You want a system that ends the dependency instead of one that keeps renewing the prescription.',
    },
  ],
};

/* ── BEAT 3 · Transformations ───────────────────────────────────────────── */
export const transformations = {
  eyebrow: 'The dose climbing. The reports drifting. The belly that will not move.',
  h2: ['These Are The Men Whose Bodies ', 'Started Working Again.'],
  items: [
    { src: '/proof/ba-recomp-20w.png', caption: 'Body recomposition in 20 weeks' },
    { src: '/proof/ba-17kg-24w.png', caption: 'Lost 17 kg in 24 weeks' },
    { src: '/proof/ba-12kg-16w.png', caption: 'Lost 12 kg in 16 weeks' },
  ],
};

/* ── BEAT 4 · Proof (case studies) ──────────────────────────────────────── */
export const cases = {
  lede: 'This could be your story too.',
  h2: ['Same Root. Five Different ', 'Sets Of Reports.'],
  items: [
    {
      name: 'Prateek',
      meta: '38 · Banking manager',
      metric: { from: '8.0', to: '5.6', label: 'HbA1c' },
      quote:
        'Ten-hour sitting days, 145 kilos, and an HbA1c over 8 his doctor treated as a lifelong prescription. He rebuilt nutrition, strength and sleep around a banking schedule instead of fighting it. Nine months later: HbA1c under 5.6, fasting glucose 180 to 102, testosterone over 600 without hormone therapy, waist 50 inches to 42.',
    },
    {
      name: 'Sanat',
      meta: '37 · IT, 15 years',
      metric: { from: '2', to: '10', label: 'Confidence /10' },
      quote:
        'More than a year of severe ED had him convinced he had stopped being attracted to his wife, because the only thing still working was pornography. The programme went at sleep, training, stress and the habits underneath, not at the symptom. His ED resolved completely, morning erections came back daily, and his sexual confidence went from 2 out of 10 to 10.',
    },
    {
      name: 'Franklin',
      meta: '33 · Sales manager',
      metric: { from: '3', to: '9', label: 'Confidence /10' },
      quote:
        'Six straight months without a single morning erection and nearly two years of premature ejaculation, in a job where his schedule changed every day. The plan was built around his calendar rather than against it. Morning erections returned and became daily, the premature ejaculation resolved entirely, and his sexual confidence went from 3 out of 10 to 9.',
    },
    {
      name: 'Shehzaad',
      meta: '51 · Freelancer',
      metric: { from: '40+', to: '2', label: 'Cigarettes / day' },
      quote:
        'Thirty-two years of smoking, over 40 cigarettes a day, and six years without a morning erection had him certain that 51 was simply what 51 looked like. Strength work, pelvic floor training and breathwork replaced the habit stack. He came down to two cigarettes a day, morning erections returned five mornings a week, and his confidence went from zero to eight.',
    },
    {
      name: 'Mayur',
      meta: 'Business owner',
      metric: { from: '1-3', to: '8-10', label: 'Function /10' },
      quote:
        'More than 20 cigarettes a day to get through the meetings, erectile function he rated 1 to 3 out of 10, and morning erections that had gone entirely. Ninety days of structured training, pelvic floor work and nervous-system recovery. Zero cigarettes, function at 8 to 10 out of 10, morning erections daily, and confidence from 2 out of 10 to almost complete.',
    },
  ],
};

/* ── BEAT 4b · The check-in wall ────────────────────────────────────────── */
export const checkinWall = {
  eyebrow: 'Their own weekly check-ins, unedited',
  h2: ['Not Written For You. ', 'Written To Their Coach.'],
  lede: 'These are the weekly progress forms clients fill in for Hardik. Nobody wrote them to be published.',
  items: [
    { src: '/proof/testimonial-sanat.jpeg', alt: 'Sanat, written note after the programme', tall: true },
    { src: '/proof/checkin-vishal-before.jpeg', alt: 'Vishal V, week one check-in', tag: 'Before' },
    { src: '/proof/checkin-vishal-after.jpeg', alt: 'Vishal V, later check-in', tag: 'After' },
    { src: '/proof/checkin-mayur.jpeg', alt: 'Mayur, weekly check-in' },
    { src: '/proof/checkin-abhishek.jpeg', alt: 'Abhishek, weekly check-in' },
    { src: '/proof/checkin-devanand.jpeg', alt: 'Devanand, weekly check-in' },
    { src: '/proof/checkin-venkat-pradeep.jpeg', alt: 'Venkat Pradeep, weekly check-in' },
    { src: '/proof/checkin-krishna.jpeg', alt: 'Krishna, weekly check-in' },
    { src: '/proof/checkin-roshin.jpeg', alt: 'Roshin, weekly check-in' },
  ],
};

/* ── BEAT 5 · Founder ───────────────────────────────────────────────────── */
export const founder = {
  eyebrow: 'Behind The Protocol',
  h2: ['The Practitioner Who Reads ', 'The Report First.'],
  name: 'Hardik',
  role: 'Project Alpha Wellness',
  photo: '/proof/hardik.png',
  // BEAT 5a — credential pill row. Blank until supplied.
  credentials: [], // ← MISSING.founderCredentials
  // BEAT 5b — the ONE reliably-TEXT beat in the blueprint. Blank until supplied.
  story: null, // ← MISSING.founderStory
};

/* ── BEAT 6 · Mechanism (exactly 4 pillars) ─────────────────────────────── */
export const mechanism = {
  eyebrow: 'The Mechanism',
  h2: ['Why Everything You Tried Sat ', 'Downstream Of The Problem.'],
  sub: 'Testosterone is the master signal. Three things suppress it, and your prescription treats none of them.',
  pillars: [
    {
      title: 'Testosterone Is The Master Signal',
      body: 'When it is aligned, energy holds, weight regulates and function returns on its own. When it drops, the whole system fails at once.',
    },
    {
      title: 'The Psychological Root',
      body: "Years of pressure keep cortisol high, and cortisol suppresses testosterone directly. Yogic breathwork and Ashwagandha's withanolides lower it biochemically.",
    },
    {
      title: 'The Physical Root',
      body: 'Belly fat carries aromatase, which converts testosterone into estrogen hourly. Weight loss, pelvic floor work, zinc, magnesium and D3 reverse the conversion.',
    },
    {
      title: 'The Clinical Root',
      body: 'High glucose damages vessels, low HDL starves the raw material, hypertension cuts flow. Move those markers and testosterone recovers with them.',
    },
  ],
  reframe:
    'The real issue was never your discipline. It was that every fix you were handed sat downstream of the one signal that controls all of it.',
  closer:
    'This is not about trying harder. It is about treating the signal everything else is downstream of.',
};

/* ── BEAT 7 · Programme (6-7 items) ─────────────────────────────────────── */
export const programme = {
  eyebrow: 'What You Actually Get',
  h2: ['Seven Parts. One ', 'Root-Cause Protocol.'],
  sub: 'Seven components that work together as one root-cause protocol for your specific case.',
  items: [
    {
      title: 'The Live Report Read',
      body: 'Session one, your blood work on screen. The root causes named in front of you and the three phases mapped to your case, not a template.',
    },
    {
      title: 'Your Nutritional Protocol',
      body: 'Calibrated to your reports and your body composition, built to move HbA1c, HDL and triglycerides rather than just cut calories.',
    },
    {
      title: 'The Supplementation Stack',
      body: 'Zinc, magnesium, vitamin D3, L-arginine, citrulline and Ashwagandha as standard. Shilajit, Shatavari and Gokshura layered in when your case indicates it.',
    },
    {
      title: 'Movement, Calibrated To Your Starting Point',
      body: 'Sedentary, skinny-fat, obese or fit-with-a-belly, the protocol starts where your body actually is. Pelvic floor and vascular strengthening run alongside it.',
    },
    {
      title: 'The Stress And Breathwork Protocol',
      body: 'Yogic breathing and calibrated relaxation that suppress cortisol production directly, which is what frees testosterone to recover.',
    },
    {
      title: 'Weekly One-To-One Sessions',
      body: 'Every week with Hardik and Karthik, adjusting in real time. Phase three adds the psychological work: performance-pressure release and technique instruction.',
    },
    {
      title: 'The Month-3 Marker Retest',
      body: 'Blood work again at month three. HbA1c, HDL, LDL, triglycerides and testosterone, so the arc is verified on paper and not on how you feel.',
    },
  ],
  footnote:
    'We never sell our own supplements. Everything above is a generic over-the-counter formulation you buy yourself.',
};

/* ── BEAT 8 · Guarantee ─────────────────────────────────────────────────── */
export const guarantee = {
  eyebrow: 'The Promise',
  h2: null, // ← MISSING.guarantee
  body: null, // ← MISSING.guarantee
  terms: [], // ← MISSING.guarantee
};

/* ── BEAT 9 · Two Choices — CUT (Kunal lock, approved at Step 3) ────────── */

/* ── BEAT 10 · FAQ (exactly 6) ──────────────────────────────────────────── */
export const faq = {
  eyebrow: 'Before You Book',
  h2: ['The Six Things Men Ask ', 'Before They Say Yes.'],
  items: [
    {
      q: 'Is this a sales call or a real consultation?',
      a: 'It is a diagnostic session. You bring your latest blood report, Hardik reads it live, and you leave knowing which of the three root causes is driving your case and what 90 days would look like for you. If your case is surgical or genetic, you will hear that on the call and we will not enrol you. Our method resolves roughly 1% of those, and taking your money for it would be dishonest. The Rs 97 exists so that the men who book actually turn up.',
      mostAsked: true,
    },
    {
      q: 'How much time does this actually take each week?',
      a: 'One weekly one-to-one session, plus daily protocol work that fits inside a working day. The nutritional protocol is built around your schedule, not against it. Franklin was a sales manager whose calendar changed daily. Prateek was doing ten-hour sitting days in banking. Both got through it without changing jobs.',
    },
    {
      q: 'How is this different from what my doctor already gave me?',
      a: 'Your doctor treated the symptom in front of him in a 90-second appointment. We treat the signal underneath it. Testosterone is the master signal, and ED, HbA1c, cholesterol and the belly all sit downstream of it. That is why moving the root moves all of them at once instead of one at a time.',
    },
    {
      q: 'I travel and I drink at work events. Does that disqualify me?',
      a: 'Not on its own. The protocol adapts, and reduction matters more than perfection. What does not work is a chain-drinker or chain-smoker unwilling to reduce during the programme. Shehzaad came in at over 40 cigarettes a day and finished at two. If your damage is decades deep we move you to the six-month track rather than pretend 90 days is enough.',
    },
    {
      q: 'I have tried things before and nothing held. Why would this?',
      a: 'Because the things you tried sat downstream. Diets, workouts and stronger doses all treat what testosterone controls, not testosterone itself. When the root causes move, the markers move on their own, and month three is a blood test rather than an opinion. 73% of the men through this protocol come off the pill completely inside 90 days.',
    },
    {
      q: 'What does the programme cost?',
      a: 'Hardik covers that on the call, once he has read your reports and knows which track your case needs. This is a premium one-to-one practice and it is not the cheapest option in this market. Today you are deciding on Rs 97 and one call, not on the programme. If the diagnosis says you are not a fit, the number never comes up.',
    },
  ],
  plaque: ['Pills treat the symptom.', 'We treat the cause.'],
};

/* ── BEAT 11 · Final CTA ────────────────────────────────────────────────── */
export const finalCta = {
  eyebrow: 'And it all starts with one root-cause call',
  h2: ['Become The Man Whose Body ', 'Stopped Needing The Workaround.'],
  colophon: 'Project Alpha Wellness',
  links: [
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
  ],
};

/* ── BEAT 12 · Sticky CTA ───────────────────────────────────────────────── */
export const sticky = {
  label: 'Root-cause diagnosis',
  price: 'Rs 97',
};

/* ── CHECKOUT ───────────────────────────────────────────────────────────── */
export const checkout = {
  trustStrip: ['Secure payment', 'Rs 97', "Books directly on Hardik's calendar"],
  eyebrow: 'Step 1 of 2',
  h2: ['Confirm Your Rs 97 ', 'Root-Cause Call.'],
  ledger: [
    { what: 'Live blood report read', value: 'Included' },
    { what: 'Root-cause diagnosis for your case', value: 'Included' },
    { what: 'Your personalised 90-day roadmap', value: 'Included' },
  ],
  totalLabel: 'You pay today',
  total: 'Rs 97',
  whyPrice: {
    strike: 'a fee',
    real: 'a filter',
    headline: ['Rs 97 is not ', 'a fee. It is a filter.'],
    body: 'Free bookings fill with men who never show up. Everyone on Hardik’s calendar has put something down, which is why the call starts honest and stays useful.',
  },
  button: 'Pay Rs 97 And Book My Root-Cause Call',
  microline: 'You pick your time on the next screen.',
  refundNote: null, // ← MISSING.refundTerms
  fields: [
    { name: 'name', label: 'Full name', type: 'text', autoComplete: 'name' },
    { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
    { name: 'phone', label: 'Phone (with country code)', type: 'tel', autoComplete: 'tel' },
  ],
};

/* ── BOOK A CALL ────────────────────────────────────────────────────────── */
export const book = {
  eyebrow: 'Step 2 of 2',
  h2: ['Pick Your Time. Then ', 'Bring Your Reports.'],
  sub: 'One thing to do before the call: find your most recent blood work. The call is far more useful with it on screen.',
  agenda: [
    {
      title: 'Your reports, read live',
      body: 'Hardik goes through your HbA1c, your lipid profile, and your testosterone if it has ever been tested, and names what the standard ranges hid.',
    },
    {
      title: 'Which root cause is driving your case',
      body: 'Psychological, physical or clinical. Usually more than one, and the order they are treated in matters.',
    },
    {
      title: 'What 90 days would look like for you',
      body: 'The three phases mapped to your specific markers, not a template.',
    },
    {
      title: 'An honest yes or no',
      body: 'If your case is surgical or genetic, you will hear it, and we will not enrol you.',
    },
  ],
  disarmDuration: null, // ← MISSING.callLength
  disarm: 'Nothing is sold if you are not a fit.',
};

/* ── THANK YOU ──────────────────────────────────────────────────────────── */
export const thankYou = {
  seal: "You're booked.",
  bridge: "Your slot is confirmed on Hardik's calendar. Here is what happens between now and then.",
  prep: [
    {
      title: 'Find your latest blood report',
      body: 'Anything from the last 12 months. HbA1c, lipid profile, and testosterone if it was ever tested.',
    },
    {
      title: 'Note your current dose',
      body: 'Which tablet, what milligrams, and roughly when it started climbing.',
    },
    {
      title: 'Take the call somewhere private',
      body: 'You will be asked direct questions, and the answers matter more than the comfort.',
    },
  ],
  statBand: ['120+ men', '73% off the pill in 90 days', '5.0'],
};

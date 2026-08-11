/**
 * PROJECT ALPHA WELLNESS — all approved copy, in one place.
 *
 * Source of truth: "Hardik Project File.docx" (public/), the FINALISED funnel copy.
 * This file was rewritten from that document on 2026-08-10. Every string below is
 * reproduced verbatim from it, in its original order.
 *
 * READ BEFORE EDITING — four things the docx does NOT contain. Nothing was invented
 * to fill them, and nothing was silently dropped:
 *
 *   1. THE 73% CLAIM IS GONE. The previous draft carried "73% completely off the
 *      pill in 90 days" in five places. It does not appear anywhere in the finalised
 *      docx, so it has been removed rather than carried forward. If it is a real
 *      figure, it has to come back through the docx.
 *   2. THE MECHANISM SECTION (beat 6) has no source in the docx. Kept below and
 *      marked, because deleting a whole section is Atul's call, not mine. It is the
 *      only copy on the page that is NOT from the finalised document.
 *   3. hero.featurePills and hero.pointers have no source in the docx. Emptied, not
 *      invented. The markup renders nothing for an empty array.
 *   4. The expert CERTIFICATION and FEATURED links have no slot in the current
 *      founder markup. Held in founder.certifications so they are not lost.
 *
 * TWO TYPOS ARE REPRODUCED AS WRITTEN, flagged inline: "gloablly" and "Cholestrol".
 * Fix them in the docx and I will re-import; they are not corrected here because
 * this file must not diverge from the approved source.
 */

export const MISSING = {
  vslUrl: 'MISSING — VSL video (docx marks the slot "VSL VIDEO")',
  videoTestimonials: 'MISSING — 4 video testimonial clips (docx: "like how we have done for Shruti\'s funnel")',
  expertsPhoto: 'MISSING — combined photo of Hardik & Dr. Kartik (docx: "PHOTO OF HARDIK & KARTIK")',
  ratingAvatars: 'MISSING — client photos for the rating row (docx marks the slot "[Photos]")',
  mechanismSource: 'NOT IN FINALISED DOCX — mechanism section carried over from the previous draft',
  founderStory: 'MISSING — expert bios',
  refundTerms: 'MISSING — refund terms on the ₹97 (the 90-day guarantee covers the programme, not the ₹97 call)',
  callLength: 'MISSING — call length',
};

/* ── The CTA lockup. Reused VERBATIM at every proof beat. ───────────────── */
export const cta = {
  aboveVideo: 'WATCH THE SHORT VIDEO BELOW',
  /* The docx writes a literal → at the end. Removed 2026-08-10 on Atul's call,
     because the button already renders an arrow icon and it was doubling up. */
  button: 'Click Here To Get Your Personalised Diagnosis & ED Reversal Roadmap',
  buttonSub: '₹97 To Start',
  reassurance: '100% Private, Confidential & Judgment-Free',
  /* The docx writes these with emoji (⭐ 🔥 🌍). Atul asked for proper icons
     instead, 2026-08-10, so the emoji are stripped from the text and the mark is
     carried by the icon. Wording is otherwise untouched. */
  chips: [
    { label: '100% Money-Back Guarantee', icon: 'shield' },
    { label: '120+ Success Stories', icon: 'users' },
    { label: 'Trusted by Men Worldwide', icon: 'globe' },
  ],
  urgencyLabel: 'OFFER ENDS IN :',
  urgencyHours: 5, // docx: "TIMER OF 5 HOURS"
  guaranteeLine: null, // now carried in the chips row above
};

/* ── BEAT 0a · Announcement strip ───────────────────────────────────────── */
export const announce = ['7+ Years of Experience and 120+ Success Stories'];

/* ── BEAT 0b · Trust row ────────────────────────────────────────────────── */
/* docx: "[Photos] ★★★★★ 5.0 Review | 100% Money-Back Guarantee"
   icon: null = no icon (the stars are the mark). 'shield' = the guarantee shield. */
export const trustRow = [
  { label: '★★★★★ 5.0 Review', icon: 'shield' },
  { label: '100% Money-Back Guarantee', icon: 'shield' },
];

/* ── BEAT 1 · Hero ──────────────────────────────────────────────────────── */
export const hero = {
  gate: 'FOR MEN 30+ DEALING WITH ED, PREMATURE EJACULATION, LOW TESTOSTERONE & DECLINING HEALTH',
  /* Four headline lines in the docx. The first three are the headline, the fourth
     is the qualifier and takes the accent treatment. */
  h1: [
    'Reverse Erectile Dysfunction',
    'Restore Natural Erections &',
    'Get Your Sexual Confidence Back',
  ],
  /* Phrase lifted into the accent colour inside the H1. Must match the line
     text exactly; if it does not appear, the line renders plain. */
  h1Highlight: 'Sexual Confidence',
  h1tail: 'Naturally, Without Depending On Pills, Sprays & Painful Procedures',
  sub: 'Using our Project Alpha Wellness Protocol, designed to take you back to your own peak by addressing the root causes affecting your testosterone, sexual health and overall wellbeing.',
  /* FLAG: "gloablly" is a typo in the approved docx. Reproduced as written. */
  markersLede:
    '120+ men gloablly have used Project Alpha Wellness to improve the health issues that often go hand-in-hand with ED, including:',
  /* FLAG: "Cholestrol" is a typo in the approved docx. Reproduced as written.
     icon keys resolve through markerIcons in components/Icons.js. */
  markers: [
    { label: 'Testosterone', icon: 'testosterone' },
    { label: 'HbA1c', icon: 'hba1c' },
    { label: 'Belly Fat', icon: 'belly' },
    { label: 'LDL Cholestrol', icon: 'ldl' },
    { label: 'Triglycerides', icon: 'triglycerides' },
    { label: 'Blood Pressure', icon: 'bp' },
  ],
  featurePills: [], // ← no source in the docx. Not invented.
  pointers: [], // ← no source in the docx. Not invented.
  stats: [
    { value: '120+', label: 'Success Stories Globally' },
    { value: '100% Natural', label: 'No Chemicals or Side Effects' },
    { value: '5.0 ★', label: 'Client Rating' },
    { value: '₹97', label: 'To Start' },
  ],
  outcomePills: [], // markers row above replaces this in the finalised copy
};

/* ── BEAT 2 · This Is For You If (exactly 5) ────────────────────────────── */
/* lead/body is a BOLD BOUNDARY only. Every word is verbatim and in original order. */
export const forYouIf = {
  eyebrow: 'FOR MEN 30+ WHO ARE LOSING CONFIDENCE IN THE BEDROOM AND CONTROL OVER THEIR HEALTH',
  h2: ['This Is For You ', 'if:'],
  items: [
    {
      lead: 'Your erections are less reliable,',
      body: ' you’re finishing sooner, or you’re starting to depend on pills and sprays just to feel confident in bed.',
    },
    {
      lead: 'Your latest bloodwork is raising red flags,',
      body: ' from HbA1c, LDL and triglycerides to blood pressure, testosterone or thyroid.',
    },
    {
      lead: 'You’ve tried doctors, medication, supplements, diet and exercise,',
      body: ' but nobody has connected the dots between your ED, testosterone, belly fat and blood markers.',
    },
    {
      lead: 'You’re done managing symptoms',
      body: ' and want to uncover the root causes driving your sexual, hormonal and metabolic health.',
    },
    {
      lead: 'You’re working 10–12+ hour days under constant pressure,',
      body: ' and your energy, drive, body and health are starting to pay the price.',
    },
  ],
};

/* ── BEAT 3 · Transformations ───────────────────────────────────────────── */
/* docx marks this slot: "[Video Testimonials - like how we have done for Shruti's
   funnel]". The before/after images below are carried from the previous draft and
   have no caption text in the docx. */
export const transformations = {
  eyebrow: 'See what changed when they stopped treating the symptoms and started addressing the root causes.',
  h2: ['See How Men Like You Went From ED & Low Confidence ', 'To Stronger Erections & Better Health'],
  items: [
    { src: '/proof/ba-recomp-20w.png', caption: '' },
    { src: '/proof/ba-17kg-24w.png', caption: '' },
    { src: '/proof/ba-12kg-16w.png', caption: '' },
  ],
};

/* ── BEAT 4 · Proof (case studies) ──────────────────────────────────────── */
/* docx: "[Case Study Cards - like how we have done for Shruti's funnel]".
   THREE stats per case in the finalised copy, where the old structure held one.
   `metrics` is an array; entries are either {from,to,label} or {value,label}. */
export const cases = {
  /* No eyebrow on this section by design (Atul, 2026-08-10). Not a gap. */
  eyebrow: null,
  lede: 'See what changed when they stopped treating the symptoms and started addressing the root causes.',
  h2: ['See How Men Like You Went From ED & Low Confidence ', 'To Stronger Erections & Better Health'],
  /* docx: "[Video Testimonials - like how we have done for Shruti's funnel]".
     Shape: { name, src, poster }. Shruti runs four, 2-up.
     While this is empty, videoSlots placeholder boxes render in its place. */
  videoTestimonials: [],
  videoSlots: 4,
  items: [
    {
      name: 'Mayur',
      meta: '40+',
      rating: '★★★★★',
      metrics: [
        { from: '1–3', to: '8–10/10', label: 'Erection Function' },
        { from: '20+', to: '0', label: 'Cigarettes/Day' },
        { value: '90 Days', label: 'Duration' },
      ],
      quote:
        'From smoking 20+ cigarettes a day and dealing with severe ED, Mayur had lost confidence in his health and himself. In 90 days, he quit smoking completely, regained daily morning erections, and improved his erection function from 1–3/10 to 8–10/10.',
    },
    {
      name: 'Franklin',
      meta: '33',
      rating: '★★★★★',
      metrics: [
        { from: '6 Months', to: 'Daily', label: 'Morning Erections' },
        { from: '3', to: '9/10', label: 'Sexual Confidence' },
        { value: '90 Days', label: 'Duration' },
      ],
      quote:
        'After six months without a single morning erection and nearly two years struggling with premature ejaculation, Franklin had lost confidence in his sexual health. In 90 days, he regained daily morning erections, completely overcame premature ejaculation, and rebuilt his sexual confidence.',
    },
    {
      name: 'Prateek',
      meta: '38',
      rating: '★★★★★',
      metrics: [
        { from: '8%+', to: '<5.6%', label: 'HbA1c' },
        { from: '145', to: '125 kg', label: 'Weight' },
        { value: '600+', label: 'Testosterone' },
      ],
      quote:
        'After years of inactivity, 145 kg bodyweight and HbA1c above 8%, Prateek was struggling with diabetes, low testosterone and poor energy. Over nine months, he brought his HbA1c below 5.6%, reduced his weight by 20 kg and naturally increased his testosterone to 600+.',
    },
    {
      name: 'Sanat',
      meta: '37',
      rating: '★★★★★',
      metrics: [
        { from: '3', to: '10/10', label: 'Erection Quality' },
        { from: '2', to: '10/10', label: 'Sexual Confidence' },
        { value: '90 Days', label: 'Duration' },
      ],
      quote:
        'After more than a year of severe ED, low libido and declining confidence, Sanat had started questioning his relationship with his wife. In 90 days, he resolved his ED, regained daily morning erections, and took his sexual confidence from 2/10 to 10/10.',
    },
    {
      name: 'Shehzaad',
      meta: '51',
      rating: '★★★★★',
      metrics: [
        { from: '40+', to: '2', label: 'Cigarettes/Day' },
        { from: '0', to: '8/10', label: 'Sexual Confidence' },
        { value: '5x/Week', label: 'Morning Erections' },
      ],
      quote:
        'After 32 years of heavy smoking and six years without morning erections, Shehzaad had lost confidence in his health and future. In his transformation, he reduced smoking from 40+ to just 2 cigarettes a day, regained morning erections around 5 days a week, and rebuilt his sexual confidence from 0/10 to 8/10.',
    },
  ],
};

/* ── BEAT 4b · The check-in wall ────────────────────────────────────────── */
/* docx: "[5 Chat Screenshots (Row 1) - from left to right]" then
         "[6 Chat Screenshots (Row 2) - from right to left]" and
         "Keep this moving from left to right - just like we did for Kunal's funnel" */
/* Two marquee rows. rowOne scrolls left to right, rowTwo right to left, exactly
   as the docx specifies (5 then 6).

   THE TWO ROWS MUST NEVER SHARE AN IMAGE. Each row duplicates its own set once
   for the seamless -50% loop, which is the loop mechanism and not a repeat; but
   no src may appear in both rowOne and rowTwo. There are 11 normalised chat
   screenshots and all 11 are used exactly once. */
export const checkinWall = {
  eyebrow: '',
  h2: ['Thousands Of Messages. ', 'Hundreds Of Wins.'],
  lede: "Here's a small glimpse into our clients' journeys.",
  rowOne: [
    { src: '/proof/chat-abhishek.jpeg', alt: 'Client message' },
    { src: '/proof/chat-bhargav.jpeg', alt: 'Client message' },
    { src: '/proof/chat-devanand.jpeg', alt: 'Client message' },
    { src: '/proof/chat-mayur.jpeg', alt: 'Client message' },
    { src: '/proof/chat-morning-erections.jpeg', alt: 'Client message' },
  ],
  rowTwo: [
    { src: '/proof/chat-improved-erection.jpeg', alt: 'Client message' },
    { src: '/proof/chat-libido-energy.jpeg', alt: 'Client message' },
    { src: '/proof/chat-venkat-before.jpeg', alt: 'Client message', tag: 'Before' },
    { src: '/proof/chat-venkat-after.jpeg', alt: 'Client message', tag: 'After' },
    { src: '/proof/chat-whatsapp-jun25.jpeg', alt: 'Client message' },
    { src: '/proof/chat-extra-01.png', alt: 'Client message' },
  ],
};

/* ── BEAT 5 · The experts (TWO people in the finalised copy) ─────────────── */
export const founder = {
  eyebrow: '',
  h2: ['Meet The Experts Behind ', 'Project Alpha Wellness'],
  sub: 'A multidisciplinary approach to men’s sexual, hormonal and metabolic health.',
  name: 'Hardik & Dr. Kartik',
  role: 'Project Alpha Wellness',
  photo: '/proof/hardik.png', // ← MISSING.expertsPhoto (docx wants a combined shot)
  credentials: [],
  story: [
    'Hardik is a Level 5 Certified Personal Trainer with specialist training in functional training, prehab, rehab and corrective exercise through Prehab 121 Academy, ACE and ACSM-approved programs.',
    'Dr. Kartik holds a Bachelor of Ayurvedic Medicine & Surgery (BAMS), with a focus on preventive healthcare, lifestyle medicine, metabolic health and evidence-based supplementation.',
    'Together, they combine movement, lifestyle, metabolic and holistic health to look beyond individual symptoms and address the factors affecting men’s sexual health, recovery and overall wellbeing.',
  ],
  /* No slot in the current founder markup. Held here so they are not lost. */
  certifications: [
    {
      label: 'Certification (Hardik)',
      linkLabel: 'Featured',
      href: 'https://thehindustanwires.com/the-problem-millions-of-indian-men-are-too-ashamed-to-discuss-and-how-hardik-dhawalsingh-is-fixing-it-naturally/',
    },
    {
      label: 'Certification (Kartik)',
      linkLabel: 'Featured',
      href: 'https://thebusinessstories.com/the-problem-millions-of-indian-men-are-too-ashamed-to-discuss-and-how-hardik-dhawalsingh-is-fixing-it-naturally/',
    },
  ],
};

/* ── BEAT 6 · Mechanism ─────────────────────────────────────────────────── */
/* ⚠ NOT IN THE FINALISED DOCX. Carried over from the previous draft, unchanged,
   because cutting a whole section is a client decision. Either approve it into
   the docx or tell me to delete this block. See MISSING.mechanismSource. */
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

/* ── BEAT 7 · Programme (six components in the finalised copy) ───────────── */
export const programme = {
  eyebrow: '',
  h2: ['Everything Included In Your ', '12-Week Programme'],
  sub: 'Six core components designed to address the factors affecting your sexual, hormonal and metabolic health.',
  items: [
    {
      title: 'YOUR COMPLETE HEALTH & ROOT-CAUSE ASSESSMENT',
      body: 'We start with your symptoms, lifestyle, sleep, stress, nutrition, sexual health and existing blood reports to identify the factors contributing to your declining health.',
    },
    {
      title: 'YOUR PERSONALIZED NUTRITION & SUPPLEMENT PROTOCOL',
      body: 'A nutrition protocol built around your health markers, body composition and lifestyle, with targeted supplementation and herbal support introduced where appropriate.',
    },
    {
      title: 'PELVIC FLOOR & SEXUAL HEALTH PROTOCOL',
      body: 'Structured pelvic floor work, movement and sexual-health strategies designed to support erection quality, ejaculatory control, blood flow and sexual confidence.',
    },
    {
      title: 'STRENGTH, MOVEMENT & RECOVERY PROTOCOL',
      body: 'A progressive training and movement plan adapted to your current condition, alongside sleep, breathwork and nervous-system recovery strategies.',
    },
    {
      title: 'WEEKLY COACHING & ACCOUNTABILITY',
      body: 'Regular check-ins to review your progress, health habits and symptoms, make adjustments to your protocol and keep you consistent even when work and life get demanding.',
    },
    {
      title: 'CLINICAL BLOODWORK & PROGRESS TRACKING',
      body: "Your key health markers are tracked from baseline through your 90-day retest, including HbA1c, cholesterol, triglycerides, blood pressure and testosterone, so progress isn't judged by how you feel alone.",
    },
  ],
  footnote: '', // no footnote in the finalised docx
};

/* ── BEAT 8 · Guarantee ─────────────────────────────────────────────────── */
export const guarantee = {
  eyebrow: '100% MONEY-BACK GUARANTEE',
  h2: ['Reverse Erectile Dysfunction In 90 Days. ', 'Or Get Your Money Back.'],
  body: "If you don't achieve the agreed improvement in your erectile function within 90 days, we refund every rupee you paid us.",
  termsTitle: 'What We Ask In Return',
  terms: [
    {
      lead: 'Your starting point is assessed on Day 1.',
      body: ' We establish your baseline across erection quality, sexual confidence, sleep, lifestyle, relevant health markers and other factors affecting your sexual health.',
    },
    {
      lead: 'Your 90-day protocol is built around your baseline.',
      body: ' Based on your assessment, we create a personalised plan covering training, nutrition, recovery, pelvic-floor work, lifestyle and other relevant interventions.',
    },
    {
      lead: 'You follow the programme consistently.',
      body: ' Workouts completed, nutrition protocol followed, weekly check-ins attended, and assigned recovery, pelvic-floor and lifestyle protocols followed as prescribed.',
    },
    {
      lead: 'Your progress is tracked throughout the 90 days.',
      body: ' Your results are reviewed against the baseline established at the beginning, with your protocol adjusted based on how your body responds.',
    },
    { lead: 'The 90 days run from your programme start date.', body: '' },
  ],
};

/* ── BEAT 9 · Two Choices — CUT (Kunal lock, approved at Step 3) ────────── */

/* ── BEAT 10 · FAQ (exactly 6) ──────────────────────────────────────────── */
export const faq = {
  eyebrow: '',
  h2: ['COMMON QUESTIONS FROM MEN 30+ ', 'DEALING WITH ED, LOW TESTOSTERONE & DECLINING HEALTH'],
  items: [
    {
      q: 'Is this completely confidential?',
      a: 'Yes. Your sexual health, medical history, blood reports and personal concerns are treated as private and confidential. You can discuss sensitive issues without worrying about them being shared publicly.',
      mostAsked: true,
    },
    {
      q: 'I’ve already tried medicines, supplements or other solutions for ED. Why would this be different?',
      a: 'Most approaches focus on the symptom, rather than understanding what may be contributing to it. Project Alpha Wellness looks at your sexual health alongside your sleep, stress, movement, nutrition, metabolic health and lifestyle, so your protocol can be built around the factors identified during your assessment rather than simply adding another temporary solution.',
    },
    {
      q: 'Is this just another fitness programme?',
      a: 'No. ED is not treated as a standalone fitness problem. Your programme combines structured training, nutrition, recovery, pelvic floor work, nervous system strategies and lifestyle interventions, with your health markers and individual condition taken into account.',
    },
    {
      q: 'I work long hours and have a demanding schedule. How much time do I need?',
      a: 'The programme is designed around real working lives, not someone who has hours to spend in the gym. Your movement, training, nutrition and recovery protocols are adjusted around your work schedule, energy levels and current condition, so consistency is realistic.',
    },
    {
      q: 'What if I’m over 40 or 50? Is it too late to improve my sexual health?',
      a: "No age-based promise is made. Your starting point is assessed individually. The programme is designed to address modifiable lifestyle, fitness, recovery and health factors that may be contributing to your overall decline, regardless of whether you're starting in your 30s, 40s or 50s.",
    },
    {
      q: 'Will I be working directly with Hardik and Dr. Kartik?',
      a: 'Yes. Hardik and Dr. Kartik work together across the programme. Hardik brings his expertise in personal training, functional training, prehab, rehab and corrective exercise, while Dr. Kartik brings his background in Ayurveda, preventive healthcare, lifestyle medicine and metabolic health.',
    },
  ],
  plaque: [], // no plaque copy in the finalised docx
};

/* ── BEAT 11 · Final CTA ────────────────────────────────────────────────── */
export const finalCta = {
  eyebrow: '',
  h2: ['Reverse Erectile Dysfunction, Restore Natural Erections & ', 'Get Your Sexual Confidence Back'],
  colophon: 'Project Alpha Wellness',
  links: [
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
  ],
};

/* ── BEAT 12 · Sticky CTA ───────────────────────────────────────────────── */
export const sticky = {
  label: 'Personalised Diagnosis',
  price: '₹97',
};

/* ── CHECKOUT (docx: "Checkout Page Copy:") ─────────────────────────────── */
export const checkout = {
  trustStrip: ['100% Confidential & Private', '₹97 To Start'],
  eyebrow: '',
  h2: ['1:1 Personalised Health Strategy Call ', 'with Hardik & Dr. Kartik'],
  priceHeading: 'INR 97',
  ledgerTitle: 'Personalised Health Assessment ·',
  ledger: [
    {
      what: 'A confidential assessment of your ED, testosterone, lifestyle, sleep, stress and key health markers to understand what may be driving the decline.',
      value: '',
    },
    {
      what: 'A clear 90-day roadmap focused on addressing the root causes behind your sexual and overall health, based on your current condition and lifestyle.',
      value: '',
    },
    {
      what: 'An honest fit assessment and walkthrough of the Project Alpha Wellness Protocol',
      value: '',
    },
  ],
  totalLabel: '',
  totalStrike: '₹999',
  total: '₹97',
  whyPrice: null, // the "₹97 is a filter" reframe is not in the finalised docx
  /* The docx writes a literal → at the end. Removed 2026-08-10 on Atul's call,
     because the button already renders an arrow icon and it was doubling up. */
  button: 'Click Here To Get Your Personalised Diagnosis & ED Reversal Roadmap',
  microline: '100% Confidential & Private · ₹97 To Start',
  refundNote: null,
  fields: [
    { name: 'name', label: 'Full name', type: 'text', autoComplete: 'name' },
    { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
    { name: 'phone', label: 'Phone (with country code)', type: 'tel', autoComplete: 'tel' },
  ],
};

/* ── BOOK A CALL ────────────────────────────────────────────────────────── */
/* docx: "Client already has calendly". This URL is deep-linked to a specific slot
   in the source document; the month/date query has been stripped so it opens on
   the live calendar rather than 11 Aug 2026. */
export const CALENDLY_URL =
  'https://calendly.com/hardikdhawal_1-2-1callwithhardik/diagnosis-call';

export const book = {
  eyebrow: '',
  h2: ['Pick Your Time With ', 'Hardik & Dr. Kartik'],
  sub: '',
  agenda: [], // no book-page agenda copy in the finalised docx
  disarmDuration: null,
  disarm: '100% Private, Confidential & Judgment-Free',
};

/* ── THANK YOU ──────────────────────────────────────────────────────────── */
/* No thank-you page copy in the finalised docx. Left minimal and unstated rather
   than invented. */
export const thankYou = {
  seal: "You're booked.",
  bridge: '',
  prep: [],
  statBand: ['120+ Success Stories Globally', '5.0 ★ Client Rating', '100% Money-Back Guarantee'],
};

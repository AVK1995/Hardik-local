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
  /* vslUrl — RESOLVED 2026-08-11. "Hardik VSL" supplied; see `vsl` below. */
  /* videoTestimonials — RESOLVED 2026-08-11. Three Vimeo clips supplied
     (Mahendra, Mayur, Prateek); see `cases.videoTestimonials`. */
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
     because the button already renders an arrow icon and it was doubling up.

     Two runs, not one string (2026-08-11). Left to itself the label broke after
     "& ED", orphaning "REVERSAL ROADMAP"; these are the break points the client
     asked for. They sit on one line on desktop and split on mobile — see
     .sdp-cta-ln in globals.css. */
  button: ['Click Here To Get Your Personalised Diagnosis', '& ED Reversal Roadmap'],
  /* Was '₹97 To Start'. Price pulled off every CTA on the client's call,
     2026-08-11. The ₹97 still stands on the checkout page, where it is the
     actual amount being charged rather than a sweetener on a button. */
  buttonSub: null,
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

/* ── BEAT 1 · The hero VSL (supplied 2026-08-11) ────────────────────────── */
/* Same shape and reasoning as cases.videoTestimonials: a Vimeo id rather than a
   file URL, `w`/`h` are the SOURCE dimensions so the frame takes its aspect
   ratio from the clip itself, and the poster is pulled local rather than
   hotlinked off i.vimeocdn.com (those URLs carry a region param and rotate).
   NEXT_PUBLIC_VSL_URL still overrides everything here, so the video can be
   swapped from the environment without touching code. */
export const vsl = {
  vimeoId: '1217229742',
  w: 1280,
  h: 720,
  poster: '/proof/vsl-poster.jpg',
  title: 'Reverse ED naturally — with Hardik & Dr. Kartik',
};

/* ── BEAT 0a · Announcement strip ───────────────────────────────────────── */
export const announce = ['7+ Years of Experience and 120+ Success Stories'];

/* ── BEAT 0b · Trust row ────────────────────────────────────────────────── */
/* docx: "[Photos] ★★★★★ 5.0 Review | 100% Money-Back Guarantee"
   icon: null = no icon (the stars are the mark). 'shield' = the guarantee shield. */
/* `stars` renders that many filled stars in the brand colour BEFORE the label.
   They used to be ★ glyphs inside the string, which meant they inherited the
   muted label colour and could not be tinted separately (2026-08-11). */
export const trustRow = [
  /* Supersedes the ★-glyph version: the stars are now their own tinted element
     (see .pa-stars), so the row needs no icon of its own. */
  { label: '5.0 Review', stars: 5, icon: null },
  { label: '100% Money-Back Guarantee', icon: 'shield' },
];

/* The overlapping avatar cluster that leads the trust row (reference layout,
   2026-08-11). The docx marks this slot "[Photos]" and no headshots were ever
   supplied — see MISSING.ratingAvatars. These are stand-ins cropped from the
   video testimonials, so every face is a real client, never the coach. Drop
   proper headshots at the same paths and they swap straight in. */
export const trustAvatars = [
  { src: '/proof/avatar-mahendra.jpg', name: 'Mahendra' },
  { src: '/proof/avatar-mayur.jpg', name: 'Mayur' },
  { src: '/proof/avatar-prateek.jpg', name: 'Prateek' },
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
  /* Runs, not a string (2026-08-11). `em: true` lifts a phrase into the brand
     colour — colour only, no underline and no weight change, so the line still
     reads as one sentence rather than four links. Wording is untouched docx. */
  sub: [
    { text: 'Using our ' },
    { text: 'Project Alpha Wellness Protocol', em: true },
    { text: ', designed to take you back to your own peak by addressing the root causes affecting your ' },
    { text: 'testosterone', em: true },
    { text: ', ' },
    { text: 'sexual health', em: true },
    { text: ' and ' },
    { text: 'overall wellbeing', em: true },
    { text: '.' },
  ],
  /* Runs of text; `mark: true` gets the highlighter treatment, matching how the
     reference emphasises the proof number inside this line (2026-08-11).
     FLAG: "gloablly" is a typo in the approved docx. Still reproduced as
     written — but it now sits inside the highlight, so it is the most
     conspicuous word in the hero. Worth fixing in the docx. */
  markersLede: [
    { text: '120+ men gloablly', mark: true },
    {
      text: ' have used Project Alpha Wellness to improve the health issues that often go hand-in-hand with ED, including:',
    },
  ],
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
     Shruti's funnel runs four; this one has three, so the grid is 3-up and the
     fourth placeholder slot is gone (Atul, 2026-08-11).

     Shape: { name, vimeoId, w, h, poster }. `w`/`h` are the SOURCE dimensions,
     read off Vimeo's oEmbed — the card frame derives its aspect ratio from them,
     so a portrait clip added later renders portrait without a CSS change.
     Posters are Vimeo's own thumbnails, pulled local so the page does not
     hotlink i.vimeocdn.com (those URLs carry a region param and rotate). */
  videoTestimonials: [
    { name: 'Mahendra', vimeoId: '1216899106', w: 1280, h: 720, poster: '/proof/vt-mahendra.jpg' },
    { name: 'Mayur',    vimeoId: '1216899107', w: 1280, h: 720, poster: '/proof/vt-mayur.jpg' },
    { name: 'Prateek',  vimeoId: '1216899105', w: 1280, h: 720, poster: '/proof/vt-prateek.jpg' },
  ],
  videoSlots: 3,
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
  /* The press wall under the founder beat (2026-08-11, trimmed 2026-08-11).

     ONLY REAL, VERIFIABLE COVERAGE GOES HERE. The first pass mirrored the
     reference site and carried certification cards (L5, Prehab 121, ACSM,
     BAMS) with invented crest graphics standing in for scans nobody had. That
     was cut on the client's call: a credential card with no document behind it
     is decoration pretending to be proof. Those qualifications still appear in
     `story` below, as prose, which is where an unevidenced claim belongs.

     `image` is a screenshot of the live article, cropped to keep the outlet
     masthead and headline in frame, and each card links out to the piece.
     Add a card only when you have both a URL and a capture of it. */
  credentials: [
    {
      kind: 'Press',
      title: 'The problem millions of Indian men are too ashamed to discuss — and how Hardik DhawalSingh is fixing it naturally',
      issuer: 'The Hindustan Wires',
      date: '28 April 2026',
      image: '/proof/press-hindustan-wires.jpg',
      href: 'https://thehindustanwires.com/the-problem-millions-of-indian-men-are-too-ashamed-to-discuss-and-how-hardik-dhawalsingh-is-fixing-it-naturally/',
    },
    {
      kind: 'Press',
      title: 'The problem millions of Indian men are too ashamed to discuss — and how Hardik DhawalSingh is fixing it naturally',
      issuer: 'The Business Stories',
      date: '28 April 2026',
      image: '/proof/press-business-stories.jpg',
      href: 'https://thebusinessstories.com/the-problem-millions-of-indian-men-are-too-ashamed-to-discuss-and-how-hardik-dhawalsingh-is-fixing-it-naturally/',
    },
  ],
  credentialsEyebrow: 'As Featured In',
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
      /* `icon` keys map to programmeIcons in Icons.js. Added 2026-08-11 when
         this beat became a timeline; copy is untouched docx wording. */
      icon: 'report',
      title: 'YOUR COMPLETE HEALTH & ROOT-CAUSE ASSESSMENT',
      body: 'We start with your symptoms, lifestyle, sleep, stress, nutrition, sexual health and existing blood reports to identify the factors contributing to your declining health.',
    },
    {
      icon: 'leaf',
      title: 'YOUR PERSONALIZED NUTRITION & SUPPLEMENT PROTOCOL',
      body: 'A nutrition protocol built around your health markers, body composition and lifestyle, with targeted supplementation and herbal support introduced where appropriate.',
    },
    {
      icon: 'heart',
      title: 'PELVIC FLOOR & SEXUAL HEALTH PROTOCOL',
      body: 'Structured pelvic floor work, movement and sexual-health strategies designed to support erection quality, ejaculatory control, blood flow and sexual confidence.',
    },
    {
      icon: 'dumbbell',
      title: 'STRENGTH, MOVEMENT & RECOVERY PROTOCOL',
      body: 'A progressive training and movement plan adapted to your current condition, alongside sleep, breathwork and nervous-system recovery strategies.',
    },
    {
      icon: 'chat',
      title: 'WEEKLY COACHING & ACCOUNTABILITY',
      body: 'Regular check-ins to review your progress, health habits and symptoms, make adjustments to your protocol and keep you consistent even when work and life get demanding.',
    },
    {
      icon: 'chart',
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
  colophon: '© 2026 Project Alpha Wellness',
  links: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Refund', href: '/refund' },
    { label: 'Unsubscribe', href: '/unsubscribe' },
  ],
};

/* ── BEAT 12 · Sticky CTA ───────────────────────────────────────────────── */
/* Rebuilt to the reference structure, 2026-08-11: a headline whose tail takes
   the accent colour, a chips row under it, and the full CTA on the right.
   The button label and chips are NOT restated here — they are pulled from
   `cta` so the lockup stays written-once and the sticky can never drift from
   the seven inline CTAs. */
export const sticky = {
  lead: 'Ready To',
  leadAccent: 'Reverse Your ED?',
  chipCount: 2, // how many of cta.chips the bar has room for
};

/* ═══════════════════════════════════════════════════════════════════════════
   AUTHORED COPY — NOT FROM THE DOCX (2026-08-11)
   Everything from here down that is marked `authored` was written to fill out
   the funnel, because the finalised docx only ever covered the landing page and
   a short checkout block. It is derived from landing-page copy and reuses its
   claims verbatim wherever one already existed — no new promise, number or
   guarantee has been introduced. Read it as a first draft for the client to
   approve, not as signed-off source.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── FUNNEL STEPS ───────────────────────────────────────────────────────── */
/* authored · the progress rail shown on checkout → book → thank-you */
export const funnelSteps = ['Your Details', 'Pick Your Time', 'Confirmed'];

/* ── CHECKOUT (docx: "Checkout Page Copy:") ─────────────────────────────── */
export const checkout = {
  /* authored · reworked to the reference strip. Deliberately does NOT name a
     payment provider: NEXT_PUBLIC_PAYMENT_URL is still unset, so we do not know
     whether this is Razorpay, Stripe or a hosted link. Add the provider's name
     here once it is wired, and not before. */
  trustStrip: ['Secure Checkout', '100% Confidential & Private', '256-bit SSL Encrypted'],
  eyebrow: '',
  h2: ['1:1 Personalised Health Strategy Call ', 'with Hardik & Dr. Kartik'],
  priceHeading: 'INR 97',

  /* authored · left-panel form */
  formTitle: 'Your Details',
  formEyebrow: 'Secure Checkout',

  /* authored · right-panel order summary, per the reference */
  summaryEyebrow: 'Order Summary',
  summaryTitle: '1:1 Personalised Health Strategy Call',
  /* NOT "100% refundable". MISSING.refundTerms records that the 90-day
     money-back guarantee covers the PROGRAMME, not this ₹97 call, so claiming
     the call is refundable would be a false statement on a payment page. */
  summaryPill: '1:1 Consultation · Private & Confidential',
  /* authored · condensed from `ledger` below, which is the docx wording */
  summaryPoints: [
    'Personalised diagnosis of what is driving your ED',
    'A clear 90-day root-cause roadmap built around your markers',
    'An honest fit check — we tell you if this is not right for you',
  ],
  saveBadge: 'Save ₹902',
  riskLine: '100% Confidential, Private & Judgment-Free',
  /* authored · reuses the landing page's own proof numbers, nothing new */
  team: {
    initials: 'PA',
    name: 'Hardik & Dr. Kartik',
    meta: '7+ yrs experience · 120+ success stories · Trusted by men worldwide',
  },

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
  button: 'Pay ₹97 & Book My Call',
  microline: '256-bit SSL · Encrypted Payment · 100% Confidential',
  refundNote: null,
  /* authored · split to the reference form. `half: true` pairs two fields onto
     one row; the phone field renders a country-code select beside it. */
  fields: [
    { name: 'firstName', label: 'First name', type: 'text', autoComplete: 'given-name', placeholder: 'Arjun', half: true },
    { name: 'lastName', label: 'Last name', type: 'text', autoComplete: 'family-name', placeholder: 'Mehta', half: true },
    { name: 'email', label: 'Email address', type: 'email', autoComplete: 'email', placeholder: 'you@example.com' },
    { name: 'city', label: 'City', type: 'text', autoComplete: 'address-level2', placeholder: 'Mumbai' },
    { name: 'phone', label: 'Phone number', type: 'tel', autoComplete: 'tel', placeholder: '98765 43210', dial: true },
  ],
  dialCodes: [
    { code: '+91', label: 'IN' },
    { code: '+1', label: 'US' },
    { code: '+44', label: 'UK' },
    { code: '+971', label: 'AE' },
    { code: '+65', label: 'SG' },
    { code: '+61', label: 'AU' },
  ],
  /* The reference carries a coupon row. It is NOT built here: with no backend
     and no payment provider wired, any code check would be client-side theatre
     and trivially bypassed. Razorpay and Stripe both validate codes server-side
     — add it there when NEXT_PUBLIC_PAYMENT_URL is set. */
};

/* ── BOOK A CALL ────────────────────────────────────────────────────────── */
/* docx: "Client already has calendly". This URL is deep-linked to a specific slot
   in the source document; the month/date query has been stripped so it opens on
   the live calendar rather than 11 Aug 2026. */
export const CALENDLY_URL =
  'https://calendly.com/hardikdhawal_1-2-1callwithhardik/diagnosis-call';

export const book = {
  eyebrow: 'Payment received · One step left',
  h2: ['Pick Your Time With ', 'Hardik & Dr. Kartik'],
  /* authored */
  sub: 'Your slot is held once you pick a time below. Everything you share on the call stays between you, Hardik and Dr. Kartik.',
  /* authored · the three items are the docx `checkout.ledger` promises restated
     as what happens on the call, so the page cannot promise more than was paid
     for. Nothing here is a new commitment. */
  agenda: [
    {
      title: 'We map what is actually going on',
      body: 'A confidential assessment of your ED, testosterone, lifestyle, sleep, stress and key health markers, so we can see what is driving the decline rather than guessing at it.',
    },
    {
      title: 'You get your 90-day roadmap',
      body: 'A clear plan aimed at the root causes behind your sexual and overall health, built around your current condition and how your life actually runs.',
    },
    {
      title: 'We tell you honestly if this is not for you',
      body: 'A straight walkthrough of the Project Alpha Wellness Protocol and whether you are a fit. If you are not, we will say so on the call.',
    },
  ],
  /* Still MISSING — the docx never states how long the call runs, so the strip
     renders the flag rather than a number we made up. See MISSING.callLength. */
  disarmDuration: null,
  disarm: '100% Private, Confidential & Judgment-Free',
  /* authored */
  noShowNote:
    'Please add it to your calendar the moment you book. These slots are held one-to-one, so a missed call is a slot another man could not take.',

  /* ── Sections added 2026-08-11 to the client's reference structure ──────
     Layout and section order follow the reference page; every word is ours,
     rewritten from the landing copy. Two claims the reference makes are NOT
     reproduced: that the fee is refundable (MISSING.refundTerms — unsettled
     here) and a hard cap on clients per quarter (no such number exists for
     this business, and inventing scarcity is not something to guess at). */
  marquee: [
    'Payment Confirmed',
    '1:1 With Hardik & Dr. Kartik',
    '100% Private & Confidential',
    'A Diagnosis, Not A Pitch',
  ],
  stickyCta: 'Pick My Slot',
  calendarEyebrow: 'Pick Slot',
  calendarH2: ['Choose A Time That ', 'Works For You.'],
  assurances: [
    'Nothing else to pay for this session — not on the call, not after it.',
    'Your call link and calendar invite reach your email straight away.',
    'Something changed? Reschedule straight from that invite.',
    '100% private, confidential and judgment-free, start to finish.',
  ],

  includedEyebrow: "What's Included In The Call",
  includedH2: ['A Real Diagnosis. ', 'Not A Pitch.'],
  includedSub:
    'One conversation with both of us. We look at what is actually going on, and you decide what happens next.',
  included: [
    {
      title: 'A real 1:1 conversation',
      body: 'Hardik and Dr. Kartik, live on the call. No bots, no script, and nothing sold to you under pressure.',
    },
    {
      title: 'Confidential health assessment',
      body: 'Your ED, testosterone, lifestyle, sleep, stress and key markers, looked at together rather than one symptom at a time.',
    },
    {
      title: 'Bloodwork read, if you have it',
      body: 'HbA1c, lipids, testosterone, thyroid, blood pressure. Bring whatever you already have; nothing recent is fine too.',
    },
    {
      title: 'Your 90-day root-cause roadmap',
      body: 'A clear plan aimed at the causes behind your sexual and overall health, built around your condition and how your life actually runs.',
    },
    {
      title: 'An honest fit assessment',
      body: 'A straight walkthrough of the Project Alpha Wellness Protocol and whether you are a fit. If you are not, we say so on the call.',
    },
    {
      title: 'Judgment-free by design',
      body: 'This is the conversation most men avoid for years. Nothing you say on it is news to us, and none of it leaves the call.',
    },
  ],

  ceilingEyebrow: 'Why The Booking Window Matters',
  ceilingH2: ['Every Call Is One-To-One. ', 'That Has A Limit.'],
  ceilingBody: [
    'Every one of these calls is taken personally by Hardik and Dr. Kartik together, and every roadmap is built around one man’s markers and one man’s week. That puts a real limit on how many can happen in any given week.',
    'The earlier you pick a time, the better the slot you get. If the next few days do not work, that is fine — choose the best week ahead and hold it now.',
  ],

  faqEyebrow: 'Common Questions Before The Call',
  faqH2: ['Quick Answers. ', 'Then Pick Your Slot.'],
  faq: [
    {
      q: 'Is this a sales call in disguise?',
      a: 'No. The call is a diagnosis. We look at your symptoms, your markers and how your life actually runs, and give you a roadmap either way. If the Protocol fits, we walk you through it at the end. If it does not, we tell you that instead.',
    },
    {
      q: 'Will there be more to pay on the call?',
      a: 'Not for this session. The ₹97 covers the consultation and your roadmap in full. If we go on to work together afterwards, the programme is a separate conversation with time to think it over — you will not be asked to commit to anything financially on the call.',
    },
    {
      q: 'What if I need to reschedule?',
      a: 'Use the reschedule link in your booking email. Please do not simply leave the slot empty — it is held one-to-one, and another man could have taken it.',
    },
    {
      q: 'I do not have recent bloodwork. Is the call still useful?',
      a: 'Yes. Bloodwork sharpens the conversation but it is not required. Most of the call is about your symptoms, your history and what has been getting in the way. If you go ahead with the programme, testing is part of getting started.',
    },
    {
      q: 'Is this completely confidential?',
      a: 'Completely. It stays between you, Hardik and Dr. Kartik. This is the conversation most men avoid for years, and nothing you bring to it is news to us.',
    },
  ],

  finaleH2: ['The Hard Part Is Done. ', 'Now Pick A Time.'],
  finaleBody:
    'You have paid. A slot on the calendar is the only thing between today and an honest conversation about what is actually driving this.',
};

/* ── THANK YOU ──────────────────────────────────────────────────────────── */
/* The docx has no thank-you copy. Everything below is authored (2026-08-11).
   No competing CTA on this page, by design — the sale is already made and the
   only job left is making sure the man turns up. */
export const thankYou = {
  seal: 'Your call is booked.',
  bridge:
    'The confirmation and calendar invite are on their way to your inbox. Bring nothing but honest answers — the more accurate you are, the more useful your roadmap will be.',
  /* authored · preparation, not upsell */
  prep: [
    {
      title: 'Check your inbox now',
      body: 'The invite carries your time and joining link. If it has not landed in a few minutes, look in Promotions or Spam and mark it as not spam so the reminders reach you.',
    },
    {
      title: 'Bring your recent bloodwork if you have it',
      body: 'HbA1c, lipids, testosterone, thyroid, blood pressure — whatever you already have. Nothing recent is fine too; we will work from where you are.',
    },
    {
      title: 'Take the call somewhere you can speak freely',
      body: 'This conversation covers erections, performance and confidence. Somewhere private, with headphones and a stable connection, makes it a far more useful call.',
    },
  ],
  statBand: ['120+ Success Stories Globally', '5.0 ★ Client Rating', '100% Money-Back Guarantee'],

  /* ── Sections added 2026-08-11 to the client's reference structure ────── */
  marquee: [
    'Booking Confirmed',
    'Call Link On Its Way To Your Inbox',
    '1:1 With Hardik & Dr. Kartik',
    'A Diagnosis, Not A Pitch',
  ],
  h1: ['Your call with ', 'Hardik & Dr. Kartik is confirmed.'],
  /* The slot card in the hero. `slotLabel` heads it; the time itself comes from
     Calendly's redirect params at runtime — see CalendlyEmbed.js for how to
     switch those on. `slotPending` is what shows when they are absent, which is
     honest rather than a blank space where a time should be. */
  slotLabel: 'Your session',
  sessionName: '1:1 Personalised Health Strategy Call with Hardik & Dr. Kartik',
  slotPending: 'Your call time is in the confirmation email',

  coverEyebrow: 'The Call Itself',
  coverH2: ['What We Will Cover ', 'On The Call.'],
  coverSub: 'Three things, in order.',
  /* The docx `checkout.ledger` promises, restated as the running order. The
     page cannot promise more than was paid for. */
  cover: [
    {
      title: 'What is actually driving it',
      body: 'Your ED, testosterone, lifestyle, sleep, stress and key markers read together, so we can see the cause rather than guess at the symptom.',
    },
    {
      title: 'Your 90-day root-cause roadmap',
      body: 'A clear plan aimed at the causes behind your sexual and overall health, built around your condition and how your week actually runs.',
    },
    {
      title: 'Whether the Protocol fits, straight',
      body: 'If Project Alpha Wellness is right for you, we walk you through it. If it is not, we tell you that instead, on the call.',
    },
  ],

  prepEyebrow: 'Five Minutes Of Prep',
  prepH2: ['Three Things ', 'Before We Speak.'],
  prepSub: 'None of it takes long. All of it makes the call worth more to you.',

  aboutEyebrow: 'About The Call',
  aboutH2: ['Why We Keep ', 'The Room Small.'],
  aboutBody: [
    'Every call is taken by Hardik and Dr. Kartik together, and every roadmap is built around one man’s markers and one man’s week. That is the whole reason the ₹97 filter exists: it keeps the calendar to men who genuinely intend to turn up.',
    'You leave with a real read on your situation whether or not you go any further. The men we turn away get an honest reason why, and nothing else is sold to them on the call.',
  ],
  rescheduleNote:
    'Need to reschedule, or something did not arrive? Reschedule straight from your calendar invite, and check your spam folder if the invite is not in your inbox. Please do not simply leave the slot empty — it is held one-to-one.',
};

/* ── SITE FOOTER (authored 2026-08-11) ──────────────────────────────────── */
/* The landing page keeps its own colophon inside the closing dark band; every
   other page gets this. The disclaimer runs on all of them: this site sells a
   health consultation and shows transformation photos, so the "educational,
   not medical advice, results are not typical" line belongs in front of
   people rather than one click away. */
export const siteFooter = {
  brand: 'Project Alpha Wellness',
  tagline: 'Root-cause men’s health, with Hardik & Dr. Kartik',
  links: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Refund', href: '/refund' },
    { label: 'Unsubscribe', href: '/unsubscribe' },
  ],
  disclaimer:
    'All content, roadmaps and coaching services on this site are for educational and informational purposes only and do not guarantee any particular result. This is not medical advice and does not create a doctor-patient relationship. Always consult a qualified healthcare professional, and never start, stop or change prescribed medication on the basis of anything you read here.',
  copyright: '© 2026 Project Alpha Wellness · A Trainer Goes Online initiative',
};

/* ── UNSUBSCRIBE (authored 2026-08-11) ──────────────────────────────────── */
/* Landing page for the unsubscribe link in marketing emails. It cannot
   actually unsubscribe anybody yet — that needs the email provider's API — so
   the form is honest about handing off, rather than showing a fake success
   state that quietly does nothing. See the note on `pending`. */
export const unsubscribe = {
  eyebrow: 'Email Preferences',
  h1: ['You can step ', 'out of the emails.'],
  sub: 'No hard feelings and no retention gauntlet. Enter the address the email arrived at and we will take it off the list.',
  fieldLabel: 'Email address',
  placeholder: 'you@example.com',
  button: 'Unsubscribe Me',
  /* Shown after submit while no provider is wired. */
  pending:
    'Send this address to us and we will remove it by hand within one working day. Automatic removal switches on as soon as the email provider is connected.',
  keepNote:
    'One thing worth knowing: this stops the marketing emails. If you have a call booked, your confirmation, reminders and calendar invite for that call still come through — those are not marketing, and losing them would mean losing your slot.',
  backNote: 'Changed your mind? Nothing else on your account is affected.',
};

/* ═══════════════════════════════════════════════════════════════════════════
   LEGAL PAGES — AUTHORED DRAFTS, NOT LEGAL ADVICE (2026-08-11)

   These were written because the funnel takes payment and collects health
   information, and had no policies at all. They are a competent starting draft
   in plain English, NOT a substitute for review by a lawyer qualified in the
   operating jurisdiction. Two things must happen before launch:

     1. Fill in `legalEntity`. Every page renders a visible warning banner while
        any field is null, because a policy with no identifiable entity behind
        it is unenforceable and, for a payment page, a compliance problem.
     2. Settle the refund terms. MISSING.refundTerms is still open: the 90-day
        money-back guarantee covers the PROGRAMME, and nobody has stated what
        happens to the ₹97 call fee. The refund page flags this rather than
        inventing an answer.
   ═══════════════════════════════════════════════════════════════════════════ */

/* Set every field and the warning banners disappear. */
export const legalEntity = {
  name: null, // registered legal name, e.g. 'Project Alpha Wellness Pvt Ltd'
  email: null, // the address that actually receives privacy + refund requests
  address: null, // registered address
  jurisdiction: null, // e.g. 'the courts of Mumbai, Maharashtra, India'
  updated: '11 August 2026',
};

export const legal = {
  privacy: {
    title: 'Privacy Policy',
    intro:
      'This policy explains what we collect when you use this site or book a call with us, why we collect it, and what you can ask us to do with it. We have tried to write it in plain English rather than legalese.',
    sections: [
      {
        h: 'What we collect',
        p: [
          'Details you give us at checkout: your first and last name, email address, city and phone number.',
          'Health information you choose to share, before or during your call. This includes things like your symptoms, blood markers, medication, sleep, stress and lifestyle. You decide how much of this you tell us.',
          'Payment information. We do not see or store your card or UPI details — those go directly to our payment processor.',
          'Basic technical data your browser sends, such as approximate location, device type and which pages you viewed.',
        ],
      },
      {
        h: 'Why we use it',
        p: [
          'To take your booking, run your consultation and send you your roadmap.',
          'To contact you about your call, including reminders and rescheduling.',
          'To take payment and keep the financial records we are required to keep.',
          'To understand how the site is used so we can improve it.',
        ],
      },
      {
        h: 'Health information gets extra care',
        p: [
          'Information about your sexual health, hormones and medical history is sensitive, and we treat it that way. We collect it only because you have asked us to assess it, we use it only to prepare and deliver your consultation and roadmap, and we do not sell it, rent it, or share it for advertising. Ever.',
          'You can ask us to delete it at any time, and we will, except where we are legally required to retain a record of the transaction itself.',
        ],
      },
      {
        h: 'Who else touches your data',
        p: [
          'We use third-party services to run this business: a payment processor to take payment, a scheduling tool to book calls, an email provider to reach you, and a video tool to hold the call. Each receives only what it needs to do its job.',
          'We do not sell your personal information to anyone.',
          'We may disclose information if we are legally compelled to, or where it is necessary to protect someone from harm.',
        ],
      },
      {
        h: 'How long we keep it',
        p: [
          'We keep consultation notes and health information for as long as you are a client and for a reasonable period afterwards, so that we can pick up where we left off if you return. Transaction records are kept for the period our tax and accounting obligations require.',
          'Ask us to delete your data and we will do so within a reasonable time.',
        ],
      },
      {
        h: 'Your rights',
        p: [
          'You can ask us for a copy of what we hold about you, ask us to correct anything wrong, ask us to delete it, or withdraw a consent you previously gave. Write to us using the contact details below and we will respond.',
        ],
      },
      {
        h: 'Cookies',
        p: [
          'This site uses only what it needs to function and to measure basic traffic. You can block cookies in your browser; the site will still work.',
        ],
      },
      {
        h: 'Security',
        p: [
          'The site is served over an encrypted connection and payments are handled by a third-party processor. No system is perfectly secure, and we will not pretend otherwise — but we do not hold your card details, and access to consultation notes is limited to the people delivering your programme.',
        ],
      },
      {
        h: 'Adults only',
        p: ['This service is for adults aged 18 and over. We do not knowingly collect information from minors.'],
      },
      {
        h: 'Changes to this policy',
        p: ['If we change this policy we will update the date at the top of this page.'],
      },
    ],
  },

  terms: {
    title: 'Terms of Service',
    intro:
      'These terms cover your use of this website and the consultation you book through it. By paying for a call you are agreeing to them.',
    sections: [
      {
        h: 'What you are buying',
        p: [
          'You are paying for a one-to-one personalised health strategy call with Hardik and Dr. Kartik, plus the roadmap that comes out of it. You are not, at this stage, buying the Project Alpha Wellness Protocol itself. Whether that programme suits you is one of the things the call is for.',
        ],
      },
      {
        h: 'This is not medical care',
        p: [
          'Hardik and Dr. Kartik provide coaching, education and lifestyle guidance. The consultation does not create a doctor-patient relationship, is not a diagnosis, and is not a substitute for care from your own physician.',
          'Do not start, stop or change any prescribed medication because of anything said on the call or written on this site. Talk to the doctor who prescribed it.',
          'We will often suggest bloodwork. Have it ordered and interpreted by a qualified medical practitioner. Erectile dysfunction can be an early sign of cardiovascular, metabolic or hormonal disease, and that is a conversation for a doctor.',
          'If you are having a medical emergency — chest pain, breathlessness, fainting, or any sudden or severe symptom — contact your local emergency service immediately rather than waiting for your call.',
        ],
      },
      {
        h: 'You must be 18 or over',
        p: ['This service is for adults only.'],
      },
      {
        h: 'Give us accurate information',
        p: [
          'The roadmap you receive is only as good as what you tell us. If you withhold or misstate your medical history, medication or symptoms, the guidance may be wrong for you, and we cannot be responsible for that.',
        ],
      },
      {
        h: 'Results are not guaranteed',
        p: [
          'The outcomes described on this site are what specific clients experienced. They are real, and they are not a promise. Your body, history, adherence and circumstances are your own, and nobody can guarantee a particular result for you.',
        ],
      },
      {
        h: 'Booking, rescheduling and missed calls',
        p: [
          'Your slot is held for you alone. You can reschedule using the link in your confirmation email. If you do not attend and do not reschedule, we may treat the consultation as delivered.',
        ],
      },
      {
        h: 'Our content stays ours',
        p: [
          'The material on this site, and anything we send you — roadmaps, protocols, plans — is ours. Use it yourself. Do not resell, republish or distribute it.',
        ],
      },
      {
        h: 'Limits on our liability',
        p: [
          'To the fullest extent the law allows, our liability to you in connection with this service is limited to the amount you paid us. We are not liable for indirect or consequential losses.',
          'Nothing here is intended to exclude liability that cannot lawfully be excluded.',
        ],
      },
      {
        h: 'Governing law',
        p: [
          'These terms are governed by the laws of the jurisdiction stated in the contact block below, and disputes will be handled by its courts.',
        ],
      },
    ],
  },

  refund: {
    title: 'Refund & Cancellation Policy',
    intro:
      'This page covers the ₹97 consultation fee, the money-back guarantee attached to the main programme, and how to reach us about either.',
    sections: [
      {
        h: 'Rescheduling your call',
        p: [
          'You can reschedule using the link in your confirmation email. There is no charge for rescheduling.',
        ],
      },
      {
        h: 'The 90-day money-back guarantee',
        p: [
          'The 100% money-back guarantee referred to across this site applies to the Project Alpha Wellness Protocol — the main 90-day programme — and not to the ₹97 consultation fee. The precise conditions of that guarantee are set out in the programme agreement you receive before you enrol.',
        ],
      },
      {
        h: 'How to make a request',
        p: [
          'Write to us at the address in the contact block below with the email you used at checkout. We will confirm receipt and tell you what happens next.',
          'Where a refund is due, it is returned to the original payment method. How quickly it appears depends on your bank or card issuer.',
        ],
      },
    ],
  },

  /* The standalone Medical Disclaimer page was dropped on the client's call,
     2026-08-11 — privacy, terms and refunds only. Its clauses were folded into
     `terms` above rather than lost: "This is not medical care" carries the
     no-doctor-patient-relationship, do-not-change-medication and emergency
     wording, and "Results are not guaranteed" carries the results caveat.
     Those two sections are load-bearing for a site in this category; do not
     trim them without replacing the cover elsewhere. */
};

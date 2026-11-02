import { TAG_SVG } from '../frontend/brand.js';
import { MAIN_CSS, THEME_CSS, FONT_DISPLAY } from '../frontend/versions.js';
import { Hono } from 'hono';
import { OUTBOUND_CLICK_JS } from '../utils/outbound-click.js';

const seo = new Hono();

const CANONICAL = 'https://happygotchadays.com';
const SITE_NAME = 'HappyGotchaDays';
const SITE_DESCRIPTION = 'Celebrate and share your rescue pet\'s adoption anniversary. HappyGotchaDays is the community where pet parents mark gotcha days with photos, stories, and love for rescued dogs and cats.';
const OG_IMAGE = `${CANONICAL}/og-image.png`;

// ──── robots.txt ────
seo.get('/robots.txt', (c) => {
  const robots = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /health

Sitemap: ${CANONICAL}/sitemap.xml
`;
  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
});

// ──── sitemap.xml ────
// lastmod = date the page's content last changed. Update it when you edit a page.
seo.get('/sitemap.xml', (c) => {
  const urls = [
    { loc: '/', lastmod: '2026-10-11', changefreq: 'daily', priority: '1.0' },
    { loc: '/about', lastmod: '2026-10-11', changefreq: 'monthly', priority: '0.8' },
    { loc: '/what-is-gotcha-day', lastmod: '2026-10-31', changefreq: 'monthly', priority: '0.9' },
    { loc: '/faq', lastmod: '2026-10-11', changefreq: 'monthly', priority: '0.7' },
    { loc: '/shop', lastmod: '2026-10-11', changefreq: 'weekly', priority: '0.9' },
    { loc: '/privacy', lastmod: '2026-10-11', changefreq: 'yearly', priority: '0.3' },
  ];

  const urlEntries = urls
    .map(
      (u) => `  <url>
    <loc>${CANONICAL}${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
});

// ──── ads.txt (Google AdSense) ────
seo.get('/ads.txt', (c) => {
  return new Response('google.com, pub-3401889582473794, DIRECT, f08c47fec0942fa0\n', {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
});

// ──── llms.txt (AEO: plain-text summary for AI crawlers) ────
seo.get('/llms.txt', (c) => {
  const txt = `# HappyGotchaDays

> HappyGotchaDays (happygotchadays.com) is a free community site where rescue pet families celebrate gotcha days: the anniversary of the day a dog or cat was adopted from a shelter, rescue organization, or foster home.

## What is a gotcha day?

A gotcha day is the anniversary of the day you adopted your rescue pet. It marks the day a shelter animal became part of your family. Many pet parents treat it like a second birthday and celebrate with treats, photos, a walk or outing, and by sharing the adoption story. For many rescue pets the birth date is unknown, so the gotcha day is the one certain date to celebrate.

This site is only about companion-animal (dog and cat) adoption anniversaries.

## Pages

- ${CANONICAL}/ : Home. Definition of a gotcha day, upcoming gotcha day countdowns, community celebrations, pet discovery.
- ${CANONICAL}/about : What a gotcha day is, why it matters, how the site works.
- ${CANONICAL}/faq : Answers to common gotcha day questions (what it is, how it differs from a birthday, how to celebrate, reminders, privacy).
- ${CANONICAL}/shop : Gotcha day stickers and t-shirts for rescue pet parents.
- ${CANONICAL}/privacy : Privacy policy.

## Features

- Pet profiles with name, species, breed, adoption story, photos, and gotcha date
- Email reminders 7 days before and on each gotcha day, and a list of upcoming gotcha days
- Celebration posts with likes and comments; follow other rescue families
- Free to use; installable as a Progressive Web App
`;
  return new Response(txt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
});

// ──── Shared HTML layout helper ────
function pageShell({ title, description, canonical, body, jsonLd }) {
  const jsonLdScript = Array.isArray(jsonLd)
    ? jsonLd.map((ld) => `<script type="application/ld+json">${JSON.stringify(ld)}</script>`).join('\n    ')
    : jsonLd
    ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <link rel="canonical" href="${canonical}">

    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${SITE_NAME}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="${OG_IMAGE}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:locale" content="en_US">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${OG_IMAGE}">

    <meta name="theme-color" content="#2b2724">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

    <!-- Google AdSense -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-0TETK91KG0"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","G-0TETK91KG0");</script>${OUTBOUND_CLICK_JS}<meta name="google-adsense-account" content="ca-pub-3401889582473794">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3401889582473794" crossorigin="anonymous"></script>

    ${jsonLdScript}

    <link rel="preload" href="${FONT_DISPLAY}" as="font" type="font/woff2" crossorigin>
    <link rel="stylesheet" href="${MAIN_CSS}">
    <link rel="stylesheet" href="${THEME_CSS}">
</head>
<body>
    <nav class="navbar">
        <div class="container">
            <div class="nav-brand">
                <span class="logo">${TAG_SVG}</span>
                <a href="/" style="text-decoration:none;"><span class="brand-name">HappyGotchaDays</span></a>
            </div>
            <div class="nav-menu">
                <a href="/" class="nav-link">Home</a>
                <a href="/shop" class="nav-link" style="color:var(--hg-marigold);font-weight:700;">Shop 🛍️</a>
                <a href="/about" class="nav-link">About</a>
                <a href="/faq" class="nav-link">FAQ</a>
            </div>
        </div>
    </nav>
    <main>
    ${body}
    </main>
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-brand">
                    <div class="footer-logo">
                        <span class="logo">${TAG_SVG}</span>
                        <h3>HappyGotchaDays</h3>
                    </div>
                    <p class="footer-tagline">Celebrating rescue pets and their forever families</p>
                </div>
                <div class="footer-links">
                    <div class="footer-section">
                        <h4>About</h4>
                        <ul>
                            <li><a href="/about">Our Story</a></li>
                            <li><a href="/faq">FAQ</a></li>
                            <li><a href="/privacy">Privacy Policy</a></li>
                        </ul>
                    </div>
                    <div class="footer-section">
                        <h4>Community</h4>
                        <ul>
                            <li><a href="/#discover">Discover Pets</a></li>
                            <li><a href="/#feed">Celebrations</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; ${new Date().getFullYear()} HappyGotchaDays. All rights reserved.</p>
            </div>
        </div>
    </footer>
</body>
</html>`;
}

// ──── /about page ────
seo.get('/about', (c) => {
  const title = 'About HappyGotchaDays - Rescue Pet Gotcha Days';
  const description = 'HappyGotchaDays is the community where rescue pet families celebrate gotcha days — the anniversary of the day a pet was adopted from a shelter or rescue.';
  const canonical = `${CANONICAL}/about`;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME,
      url: CANONICAL,
      logo: `${CANONICAL}/icons/icon-512x512.png`,
      description: SITE_DESCRIPTION,
      sameAs: [],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: CANONICAL },
        { '@type': 'ListItem', position: 2, name: 'About', item: canonical },
      ],
    },
  ];

  const body = `
    <section class="hero" style="padding: 3rem 0 2rem;">
      <div class="container">
        <div class="hero-content" style="text-align:center; max-width:800px; margin:0 auto;">
          <h1 class="hero-title" style="font-size:clamp(2rem,5vw,3rem);">About HappyGotchaDays</h1>
          <p class="hero-subtitle" style="max-width:700px; margin:0 auto 2rem;">
            A <strong>gotcha day</strong> is the anniversary of the day you adopted your rescue pet.
            It marks the moment a shelter animal found their forever home and became part of your family.
            <a href="/what-is-gotcha-day">What gotcha day means, and other names for it</a>
          </p>
        </div>
      </div>
    </section>

    <section style="padding: 3rem 0;">
      <div class="container" style="max-width:800px;">
        <h2 class="section-title" style="text-align:center;">Our Mission</h2>
        <p style="font-size:1.15rem; line-height:1.8; margin-bottom:1.5rem;">
          <strong>HappyGotchaDays</strong> is a free community platform built for rescue pet families.
          We help you remember, celebrate, and share the special day your dog or cat came home.
        </p>
        <p style="font-size:1.15rem; line-height:1.8; margin-bottom:1.5rem;">
          In 2025, <strong>4.2 million dogs and cats</strong> were adopted from U.S. shelters and rescues (<a href="https://www.shelteranimalscount.org/2025-report/" rel="noopener" target="_blank">Shelter Animals Count</a>).
          Each adoption creates a gotcha day worth celebrating. Our platform lets you:
        </p>
        <ul style="font-size:1.1rem; line-height:2; margin-bottom:2rem; padding-left:1.5rem;">
          <li>Create a profile for each of your rescue pets</li>
          <li>Get an email a week before each gotcha day, and on the day</li>
          <li>Share photos and adoption stories with the community</li>
          <li>Discover other rescue pets and their heartwarming journeys</li>
          <li>Connect with fellow rescue pet parents</li>
        </ul>

        <h2 class="section-title" id="why-gotcha-days-matter" style="text-align:center;">Why Gotcha Days Matter</h2>
        <p style="font-size:1.15rem; line-height:1.8; margin-bottom:1.5rem;">
          Celebrating gotcha days does more than mark a date on the calendar. It reinforces the bond
          between you and your pet, raises awareness for pet adoption, and inspires others to consider
          rescuing an animal from a shelter. When you share your gotcha day story, you show the world
          that adopted pets are just as loving, loyal, and wonderful as any other.
        </p>
        <p style="font-size:1.15rem; line-height:1.8; margin-bottom:1.5rem;">
          Whether your rescue is a playful puppy, a senior dog, a curious kitten, or a lap cat,
          every gotcha day is a celebration of second chances and unconditional love.
        </p>

        <h2 class="section-title" style="text-align:center;">How It Works</h2>
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px,1fr)); gap:1.5rem; margin-bottom:2rem;">
          <div style="background:white; padding:1.5rem; border-radius:16px; text-align:center; box-shadow:0 4px 20px rgba(255,107,107,0.12);">
            <div style="font-size:2.5rem; margin-bottom:0.5rem;">1</div>
            <h3 style="margin-bottom:0.5rem;">Create an Account</h3>
            <p style="color:#636E72;">Sign up free in seconds.</p>
          </div>
          <div style="background:white; padding:1.5rem; border-radius:16px; text-align:center; box-shadow:0 4px 20px rgba(255,107,107,0.12);">
            <div style="font-size:2.5rem; margin-bottom:0.5rem;">2</div>
            <h3 style="margin-bottom:0.5rem;">Add Your Pet</h3>
            <p style="color:#636E72;">Enter their name, species, breed, and gotcha date.</p>
          </div>
          <div style="background:white; padding:1.5rem; border-radius:16px; text-align:center; box-shadow:0 4px 20px rgba(255,107,107,0.12);">
            <div style="font-size:2.5rem; margin-bottom:0.5rem;">3</div>
            <h3 style="margin-bottom:0.5rem;">Celebrate</h3>
            <p style="color:#636E72;">Share photos and stories, and get gotcha day reminders.</p>
          </div>
        </div>
        <h2 class="section-title" style="text-align:center; margin-top:2.5rem;">Photo and font credits</h2>
        <p>The adoption-day photographs on our home page were taken by Sgt. Valerie Eppler, U.S. Marine Corps, at the Camp Pendleton Animal Shelter's adoption event on July 26, 2014. They are U.S. government works in the public domain; each caption links to its DVIDS record. The people in them are not connected with this site.</p>
        <p>Fonts: Young Serif and Figtree, used under the SIL Open Font License (<a href="/fonts/OFL-young-serif.txt">Young Serif notice</a>, <a href="/fonts/OFL-figtree.txt">Figtree notice</a>).</p>
      </div>
    </section>`;

  return c.html(pageShell({ title, description, canonical, body, jsonLd }));
});

// ──── /what-is-gotcha-day (explainer) ────
// Every fact here is from a cited source, checked 2026-10-31. Pets only: the term is controversial in human adoption.
export const EXPLAINER_QA = [
  {
    q: 'What is a gotcha day?',
    a: 'For pets, a gotcha day is the day you brought your pet home, usually a rescue from a shelter or rescue group, and its anniversary each year. Dictionary.com describes it as "the day people celebrate bringing home their new pet, usually a rescue."',
  },
  {
    q: 'When is gotcha day?',
    a: 'There is no single gotcha day for pets. Your pet\'s gotcha day is the date you adopted them, so every pet has its own. In 2026, celebrate on the anniversary of the day your dog or cat came home. A September 15 "International Gotcha Day" was declared in 2005 in a book about adopted children, so it comes from the human-adoption community, not from pet rescue.',
  },
  {
    q: 'Is gotcha day for dogs, cats, or both?',
    a: 'Both. Shelter Animals Count reports that 4.2 million dogs and cats were adopted from U.S. shelters and rescues in 2025: 2.2 million cats and 2 million dogs. Each of those adoptions is a gotcha day.',
  },
  {
    q: 'Why do some people find "gotcha day" offensive?',
    a: 'The objections come from human adoption. Dictionary.com describes them: the word can suggest acquiring a possession, it can overlook the loss involved in many adoptions, and it may equate children with animals. It also notes that using gotcha day for pets "is not considered very controversial," though some people still prefer another name. HappyGotchaDays is only for dogs and cats.',
  },
  {
    q: 'What else can I call it?',
    a: 'You could call your pet\'s anniversary Adoption Day, Homecoming Day or an adoptiversary. Dictionary.com also mentions G-Day. Use whichever name feels right for your family. The date and the celebration are the same.',
  },
  {
    q: 'What if I don\'t know my pet\'s exact adoption date?',
    a: 'A few places to look: your adoption contract or receipt, or the shelter\'s or rescue\'s records, which are the most direct. Your first vet visit or the date on your earliest photos can give you a close clue, not proof. If you can\'t find it, pick a date that means something to you and use it every year.',
  },
];

seo.get('/what-is-gotcha-day', (c) => {
  const title = 'What Is Gotcha Day? Meaning, Date and Other Names for Pets | HappyGotchaDays';
  const description = 'Gotcha day is the anniversary of the day you adopted your dog or cat. What it means, when it is, why some people avoid the term, and other names like adoptiversary.';
  const canonical = `${CANONICAL}/what-is-gotcha-day`;
  const SOURCES = [
    ['Dictionary.com, "What Does Gotcha Day Mean?"', 'https://www.dictionary.com/e/pop-culture/gotcha-day/'],
    ['Shelter Animals Count, 2025 annual report', 'https://www.shelteranimalscount.org/2025-report/'],
    ['ASPCA, pet statistics', 'https://www.aspca.org/animal-homelessness/shelter-intake-and-surrender/pet-statistics'],
  ];
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'What Is Gotcha Day? Meaning, Date and Other Names for Pets',
      description,
      url: canonical,
      datePublished: '2026-10-31',
      dateModified: '2026-10-31',
      author: { '@type': 'Organization', name: SITE_NAME, url: CANONICAL },
      publisher: { '@type': 'Organization', name: SITE_NAME, url: CANONICAL },
      citation: SOURCES.map(([name, url]) => ({ '@type': 'CreativeWork', name, url })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: EXPLAINER_QA.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: CANONICAL },
        { '@type': 'ListItem', position: 2, name: 'What Is Gotcha Day?', item: canonical },
      ],
    },
  ];
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const sections = EXPLAINER_QA.map(
    (f) => `
        <h2 style="font-size:1.4rem; color:#2D3436; margin:2rem 0 0.5rem;">${esc(f.q)}</h2>
        <p style="line-height:1.75; color:#4a5357;">${esc(f.a)}</p>`
  ).join('\n');
  const body = `
    <section style="padding: 3rem 0;">
      <div class="container" style="max-width:760px;">
        <h1 class="section-title" style="margin-bottom:0.5rem;">What Is Gotcha Day?</h1>
        <p style="font-size:1.15rem; line-height:1.7; color:#636E72;">
          Gotcha day is the anniversary of the day you adopted your dog or cat. Here is what it means, when it is,
          why some people use a different name, and how to find your pet's date.
        </p>
        ${sections}
        <h2 style="font-size:1.4rem; color:#2D3436; margin:2rem 0 0.5rem;">How do people celebrate?</h2>
        <p style="line-height:1.75; color:#4a5357;">
          Ideas for a pet-centered celebration include a favorite walk, a new toy, a pet-safe treat, photos then and now, or a
          donation to the shelter or rescue your pet came from. See our <a href="/faq">FAQ</a> for more ideas, and the
          ASPCA's <a href="https://www.aspca.org/news/fun-ways-safely-celebrate-your-pets-birthday" rel="noopener" target="_blank">tips for celebrating safely</a>
          before you bake anything.
        </p>
        <div style="background:white; border-radius:16px; padding:1.25rem 1.5rem; margin:2rem 0; box-shadow:0 2px 8px rgba(255,107,107,0.08);">
          <p style="margin:0; line-height:1.7;"><strong>Plan ahead.</strong> Add your pet's adoption date to
          HappyGotchaDays and we'll email you a week before and on the day. It's free. <a href="/">Add your pet</a></p>
        </div>
        <h2 style="font-size:1.1rem; color:#2D3436; margin:2rem 0 0.5rem;">Sources</h2>
        <ul style="line-height:1.8; color:#636E72; font-size:0.95rem;">
          ${SOURCES.map(([name, url]) => `<li><a href="${url}" rel="noopener" target="_blank">${name}</a>, checked October 31, 2026</li>`).join('\n          ')}
        </ul>
      </div>
    </section>`;
  return c.html(pageShell({ title, description, canonical, body, jsonLd }));
});

// ──── /faq page (AEO-optimized) ────
seo.get('/faq', (c) => {
  const title = 'Frequently Asked Questions - HappyGotchaDays';
  const description = 'Common questions about gotcha days, pet adoption anniversaries, and how to use HappyGotchaDays to celebrate your rescue pet.';
  const canonical = `${CANONICAL}/faq`;

  const faqs = [
    {
      q: 'What is a gotcha day?',
      a: 'A gotcha day is the anniversary of the day you adopted your rescue pet from a shelter, rescue organization, or foster home. It celebrates the moment your pet became part of your family. Many pet parents consider it as important as a birthday.',
    },
    {
      q: 'How is a gotcha day different from a pet\'s birthday?',
      a: 'A pet\'s birthday marks the day they were born, while a gotcha day marks the day they were adopted. For many rescue pets, the exact birth date is unknown, making the gotcha day even more meaningful as the one date that\'s certain.',
    },
    {
      q: 'Is HappyGotchaDays free to use?',
      a: 'Yes, HappyGotchaDays is completely free. You can create an account, add your pets, upload photos, share adoption stories, and get gotcha day reminder emails at no cost.',
    },
    {
      q: 'How do I celebrate my pet\'s gotcha day?',
      a: 'Popular ways to celebrate include: giving your pet a special treat or new toy, taking commemorative photos, baking pet-safe pupcakes or treats, visiting a favorite park or hiking trail, sharing the story on social media with #GotchaDay, and posting on HappyGotchaDays to connect with other rescue families.',
    },
    {
      q: 'Where can I take my dog to celebrate a gotcha day?',
      a: 'Many breweries welcome well-behaved dogs, usually on a patio and on a leash, and a gotcha day is a good excuse for an outing. If you are in Ohio, Brewery Trip keeps a guide to dog-friendly Ohio breweries, quoting each brewery\'s own dog policy. For an all-ages outing, Waggin\' Ways lists Ohio dog parks with their posted rules. Rules change with the seasons, so check before you go.',
      html: 'Many breweries welcome well-behaved dogs, usually on a patio and on a leash, and a gotcha day is a good excuse for an outing. If you are in Ohio, Brewery Trip keeps a <a href="https://brewerytrip.com/blog/dog-friendly-ohio-breweries" rel="nofollow noopener">guide to dog-friendly Ohio breweries</a>, quoting each brewery\'s own dog policy. For an all-ages outing, <a href="https://wagginways.com/ohio/?utm_source=happygotchadays&amp;utm_medium=referral&amp;utm_campaign=dog-triangle" rel="nofollow noopener">Waggin\' Ways lists Ohio dog parks</a> with their posted rules. Rules change with the seasons, so check before you go.',
    },
    {
      q: 'Can I add more than one pet?',
      a: 'Absolutely! You can add as many rescue pets as you have. Each pet gets its own profile with their name, species, breed, adoption story, photos, and gotcha day anniversary date.',
    },
    {
      q: 'Do you send gotcha day reminders?',
      a: 'Yes. Once you add your pet\'s adoption date, we email you 7 days before each anniversary and again on the day, starting with their first anniversary. You can unsubscribe from any reminder email.',
    },
    {
      q: 'What animals can I add to HappyGotchaDays?',
      a: 'Currently, HappyGotchaDays supports dogs and cats — the two most commonly adopted shelter animals. We may expand to other species in the future based on community interest.',
    },
    {
      q: 'Can I make my pet\'s profile private?',
      a: 'Yes, when creating or editing your pet\'s profile, you can choose to make it private. Private profiles are only visible to you and will not appear in the public Discover section or search results.',
    },
    {
      q: 'Why should I adopt instead of buying a pet?',
      a: 'Each year, approximately 6.3 million companion animals enter U.S. animal shelters. Adopting saves a life, reduces demand for puppy mills and irresponsible breeding, and gives a deserving animal a second chance. Rescue pets are just as loving, trainable, and healthy as pets from breeders.',
    },
    {
      q: 'How do I share my pet\'s gotcha day story?',
      a: 'After adding your pet, you can create celebration posts with photos and your adoption story. Other community members can like and comment on your posts. You can also share directly to Facebook, Instagram, and X (Twitter).',
    },
  ];

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: CANONICAL },
      { '@type': 'ListItem', position: 2, name: 'FAQ', item: canonical },
    ],
  };

  const faqHtml = faqs
    .map(
      (f) => `
        <details style="background:white; border-radius:16px; padding:1.25rem 1.5rem; box-shadow:0 2px 8px rgba(255,107,107,0.08); margin-bottom:1rem; cursor:pointer;">
          <summary style="font-weight:700; font-size:1.1rem; color:#2D3436; list-style:none; display:flex; justify-content:space-between; align-items:center;">
            <span>${f.q}</span>
            <span style="font-size:1.5rem; color:#FF6B6B; flex-shrink:0; margin-left:1rem;">+</span>
          </summary>
          <p style="margin-top:1rem; line-height:1.7; color:#636E72;">${f.html || f.a}</p>
        </details>`
    )
    .join('\n');

  const body = `
    <section style="padding: 3rem 0;">
      <div class="container" style="max-width:800px;">
        <h1 class="section-title" style="text-align:center; margin-bottom:0.5rem;">Frequently Asked Questions</h1>
        <p style="text-align:center; color:#636E72; margin-bottom:2rem; font-size:1.1rem;">
          Everything you need to know about gotcha days and HappyGotchaDays.
        </p>
        ${faqHtml}
      </div>
    </section>`;

  return c.html(pageShell({ title, description, canonical, body, jsonLd: [faqJsonLd, breadcrumbLd] }));
});

// ──── /privacy page ────
seo.get('/privacy', (c) => {
  const title = 'Privacy Policy - HappyGotchaDays';
  const description = 'HappyGotchaDays privacy policy. Learn how we collect, use, and protect your information.';
  const canonical = `${CANONICAL}/privacy`;

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: CANONICAL },
      { '@type': 'ListItem', position: 2, name: 'Privacy Policy', item: canonical },
    ],
  };

  const body = `
    <section style="padding: 3rem 0;">
      <div class="container" style="max-width:800px;">
        <h1 class="section-title" style="text-align:center;">Privacy Policy</h1>
        <p style="line-height:1.8; margin-bottom:1.5rem;">
          <strong>Last updated:</strong> February 2026
        </p>
        <h3 style="margin:1.5rem 0 0.75rem;">Information We Collect</h3>
        <p style="line-height:1.8; margin-bottom:1rem;">
          When you create an account, we collect your email address and a username. When you add a pet,
          we store the pet's name, species, breed, gotcha date, adoption story, and any photos you upload.
        </p>
        <h3 style="margin:1.5rem 0 0.75rem;">How We Use Your Information</h3>
        <p style="line-height:1.8; margin-bottom:1rem;">
          Your information is used to provide the HappyGotchaDays service — displaying your pet profiles,
          sending gotcha day reminders, and enabling community features. We do not sell your personal data.
        </p>
        <h3 style="margin:1.5rem 0 0.75rem;">Photos</h3>
        <p style="line-height:1.8; margin-bottom:1rem;">
          Photos you upload are stored securely on Cloudflare R2. Public pet profiles make photos visible
          to other users. Private profiles keep photos visible only to you.
        </p>
        <h3 style="margin:1.5rem 0 0.75rem;">Cookies & Storage</h3>
        <p style="line-height:1.8; margin-bottom:1rem;">
          We use a JWT token stored in your browser's localStorage for authentication. We also use
          Google Analytics to count visits and Google AdSense to show ads. Third-party vendors, including
          Google, use cookies to serve ads based on your prior visits to this and other websites. Google's
          use of advertising cookies enables it and its partners to serve ads to you based on your visits
          to this site and/or other sites on the Internet. You can opt out of personalized advertising at
          <a href="https://adssettings.google.com/" rel="noopener">Google Ads Settings</a> or at
          <a href="https://www.aboutads.info/choices/" rel="noopener">www.aboutads.info</a>, and read
          <a href="https://policies.google.com/technologies/partner-sites" rel="noopener">how Google uses information from sites that use its services</a>.
        </p>
        <h3 style="margin:1.5rem 0 0.75rem;">Contact</h3>
        <p style="line-height:1.8; margin-bottom:1rem;">
          For privacy questions, contact us at privacy@happygotchadays.com.
        </p>
      </div>
    </section>`;

  return c.html(pageShell({ title, description, canonical, body, jsonLd: breadcrumbLd }));
});

// ──── /shop page — Happy Gotcha Days Merch ────
seo.get('/shop', (c) => {
  const title = 'Shop Gotcha Day Merch | HappyGotchaDays';
  const description = 'Stickers, t-shirts, and more for rescue pet parents. Celebrate your pet\'s gotcha day with our exclusive merch.';
  const canonical = `${CANONICAL}/shop`;

  // Printify Pop-Up Store URL — update this once store is enabled
  const STORE_URL = 'https://dyngus-day.printify.me';

  const products = [
    { name: 'Adopted Is My Favorite Breed', type: 'Kiss-Cut Sticker', price: '$4.99', img: 'https://images-api.printify.com/mockup/69cc14b17242a10fc6014f13/45750/16655/adopted-is-my-favorite-breed-kiss-cut-sticker.jpg?camera_label=front', url: STORE_URL },
    { name: 'Who Rescued Who?', type: 'Kiss-Cut Sticker', price: '$4.99', img: 'https://images-api.printify.com/mockup/69cc1538ab25a521b00f85e6/45750/16655/who-rescued-who-kiss-cut-sticker.jpg?camera_label=front', url: STORE_URL },
    { name: 'My Therapist Has Four Legs', type: 'Kiss-Cut Sticker', price: '$4.99', img: 'https://images-api.printify.com/mockup/69cc15dc89fa3caaa1045c40/45750/16655/my-therapist-has-four-legs-kiss-cut-sticker.jpg?camera_label=front', url: STORE_URL },
    { name: 'Rescue Dogs Are The Best Dogs', type: 'Kiss-Cut Sticker', price: '$4.99', img: 'https://images-api.printify.com/mockup/69cc2ae73495606a33021620/45750/16655/rescue-dogs-are-the-best-dogs-kiss-cut-sticker.jpg?camera_label=front', url: STORE_URL },
    { name: 'Happy Gotcha Day! Celebration', type: 'Kiss-Cut Sticker', price: '$4.99', img: 'https://images-api.printify.com/mockup/69cc155c63333f98cc0cd59f/45750/16655/happy-gotcha-day-celebration-kiss-cut-sticker.jpg?camera_label=front', url: STORE_URL },
    { name: 'Adopted Is My Favorite Breed', type: 'Unisex Tee', price: '$24.99', img: 'https://images-api.printify.com/mockup/69cc192e04b5e6ebcd0077f0/18101/39028/adopted-is-my-favorite-breed-tee-happy-gotcha-days.jpg?camera_label=front', url: STORE_URL },
    { name: 'Who Rescued Who?', type: 'Unisex Tee', price: '$24.99', img: 'https://images-api.printify.com/mockup/69cc1935bb1cd48c330185d8/18101/39028/who-rescued-who-tee-happy-gotcha-days.jpg?camera_label=front', url: STORE_URL },
    { name: 'My Therapist Has Four Legs', type: 'Unisex Tee', price: '$24.99', img: 'https://images-api.printify.com/mockup/69cc193cab25a521b00f869e/18101/39028/my-therapist-has-four-legs-tee-happy-gotcha-days.jpg?camera_label=front', url: STORE_URL },
  ];

  const productCards = products.map(p => `
    <div class="shop-card">
      <div class="shop-card-image">
        <img src="${p.img}" alt="${p.name} ${p.type}" loading="lazy" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 200%22><rect fill=%22%23f0f0f0%22 width=%22200%22 height=%22200%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2216%22 fill=%22%23999%22>🐾</text></svg>'">
      </div>
      <div class="shop-card-info">
        <h3>${p.name}</h3>
        <p class="shop-card-type">${p.type}</p>
        <p class="shop-card-price">From ${p.price}</p>
        <a href="${p.url}" target="_blank" rel="noopener" class="shop-btn">Buy Now 🛒</a>
      </div>
    </div>
  `).join('');

  const body = `
    <section class="shop-hero" style="text-align:center;padding:3rem 1rem 2rem;">
      <h1 style="font-size:clamp(1.8rem,5vw,2.8rem);margin-bottom:0.5rem;">🐾 Gotcha Day Merch</h1>
      <p style="color:#666;max-width:600px;margin:0 auto;font-size:1.1rem;">Celebrate your rescue pet with stickers, tees, and more. Every purchase supports the adoption community.</p>
    </section>

    <section class="shop-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:1.5rem;padding:0 1rem 3rem;max-width:1200px;margin:0 auto;">
      ${productCards}
    </section>

    <style>
      .shop-card { background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 2px 12px rgba(255,107,107,0.08); transition:transform 0.2s,box-shadow 0.2s; }
      .shop-card:hover { transform:translateY(-4px); box-shadow:0 8px 24px rgba(255,107,107,0.15); }
      .shop-card-image { aspect-ratio:1; overflow:hidden; background:#fafafa; }
      .shop-card-image img { width:100%; height:100%; object-fit:cover; }
      .shop-card-info { padding:1rem 1.2rem 1.2rem; }
      .shop-card-info h3 { font-size:1rem; margin:0 0 0.3rem; color:#333; }
      .shop-card-type { font-size:0.85rem; color:#888; margin:0 0 0.4rem; }
      .shop-card-price { font-size:1.1rem; font-weight:700; color:#FF6B6B; margin:0 0 0.8rem; }
      .shop-btn { display:inline-block; background:#FF6B6B; color:#fff; padding:0.6rem 1.4rem; border-radius:50px; text-decoration:none; font-weight:600; font-size:0.9rem; transition:background 0.2s; }
      .shop-btn:hover { background:#e55555; }
    </style>
  `;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Happy Gotcha Days Shop',
    description,
    url: canonical,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Product',
          name: `${p.name} - ${p.type}`,
          offers: { '@type': 'Offer', price: p.price.replace('$', ''), priceCurrency: 'USD' },
        },
      })),
    },
  };

  return c.html(pageShell({ title, description, canonical, body, jsonLd }));
});

export { seo as seoRoutes };

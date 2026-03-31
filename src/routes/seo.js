import { Hono } from 'hono';

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
seo.get('/sitemap.xml', (c) => {
  const now = new Date().toISOString().split('T')[0];

  const urls = [
    { loc: '/', changefreq: 'daily', priority: '1.0' },
    { loc: '/about', changefreq: 'monthly', priority: '0.8' },
    { loc: '/faq', changefreq: 'monthly', priority: '0.7' },
    { loc: '/shop', changefreq: 'weekly', priority: '0.9' },
    { loc: '/privacy', changefreq: 'yearly', priority: '0.3' },
  ];

  const urlEntries = urls
    .map(
      (u) => `  <url>
    <loc>${CANONICAL}${u.loc}</loc>
    <lastmod>${now}</lastmod>
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

    <meta name="theme-color" content="#FF6B6B">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

    ${jsonLdScript}

    <link rel="stylesheet" href="/styles/main.css">
</head>
<body>
    <nav class="navbar">
        <div class="container">
            <div class="nav-brand">
                <span class="logo">🐾</span>
                <a href="/" style="text-decoration:none;"><h1>HappyGotchaDays</h1></a>
            </div>
            <div class="nav-menu">
                <a href="/" class="nav-link">Home</a>
                <a href="/shop" class="nav-link" style="color:#FF6B6B;font-weight:700;">Shop 🛍️</a>
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
                        <span class="logo">🐾</span>
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
  const title = 'About HappyGotchaDays - Celebrating Rescue Pet Adoption Anniversaries';
  const description = 'HappyGotchaDays is the community platform where rescue pet families celebrate gotcha days — the anniversary of the day a pet was adopted from a shelter or rescue.';
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
          <h2 class="hero-title" style="font-size:clamp(2rem,5vw,3rem);">What Is a Gotcha Day?</h2>
          <p class="hero-subtitle" style="max-width:700px; margin:0 auto 2rem;">
            A <strong>gotcha day</strong> is the anniversary of the day you adopted your rescue pet.
            It marks the moment a shelter animal found their forever home and became part of your family.
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
          Every year, approximately <strong>4.1 million shelter animals</strong> are adopted in the United States alone.
          Each adoption creates a gotcha day worth celebrating. Our platform lets you:
        </p>
        <ul style="font-size:1.1rem; line-height:2; margin-bottom:2rem; padding-left:1.5rem;">
          <li>Create a profile for each of your rescue pets</li>
          <li>Set reminders so you never miss a gotcha day anniversary</li>
          <li>Share photos and adoption stories with the community</li>
          <li>Discover other rescue pets and their heartwarming journeys</li>
          <li>Connect with fellow rescue pet parents</li>
        </ul>

        <h2 class="section-title" style="text-align:center;">Why Gotcha Days Matter</h2>
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
            <p style="color:#636E72;">Share photos, stories, and get reminders.</p>
          </div>
        </div>
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
      a: 'Yes, HappyGotchaDays is completely free. You can create an account, add your pets, upload photos, share adoption stories, and get anniversary reminders at no cost.',
    },
    {
      q: 'How do I celebrate my pet\'s gotcha day?',
      a: 'Popular ways to celebrate include: giving your pet a special treat or new toy, taking commemorative photos, baking pet-safe pupcakes or treats, visiting a favorite park or hiking trail, sharing the story on social media with #GotchaDay, and posting on HappyGotchaDays to connect with other rescue families.',
    },
    {
      q: 'Can I add more than one pet?',
      a: 'Absolutely! You can add as many rescue pets as you have. Each pet gets its own profile with their name, species, breed, adoption story, photos, and gotcha day anniversary date.',
    },
    {
      q: 'Do you send gotcha day reminders?',
      a: 'Yes, HappyGotchaDays can send you reminders before your pet\'s gotcha day anniversary so you never miss the celebration. You can customize when you want to be reminded.',
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
          <p style="margin-top:1rem; line-height:1.7; color:#636E72;">${f.a}</p>
        </details>`
    )
    .join('\n');

  const body = `
    <section style="padding: 3rem 0;">
      <div class="container" style="max-width:800px;">
        <h2 class="section-title" style="text-align:center; margin-bottom:0.5rem;">Frequently Asked Questions</h2>
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
        <h2 class="section-title" style="text-align:center;">Privacy Policy</h2>
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
          We use a JWT token stored in your browser's localStorage for authentication. We do not use
          third-party tracking cookies.
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

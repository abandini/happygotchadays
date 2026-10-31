export const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Celebrate your rescue pet's adoption anniversary! HappyGotchaDays helps pet parents track gotcha days, share photos, and connect with the rescue pet community.">
    <meta name="theme-color" content="#FF6B6B">
    <title>HappyGotchaDays - Celebrate Your Pet's Gotcha Day</title>

    <!-- Canonical URL -->
    <link rel="canonical" href="https://happygotchadays.com/">

    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="HappyGotchaDays">
    <meta property="og:title" content="HappyGotchaDays - Celebrate Your Pet's Gotcha Day">
    <meta property="og:description" content="The community for rescue pet families. Track adoption anniversaries, share photos and stories, and celebrate your dog or cat's gotcha day.">
    <meta property="og:url" content="https://happygotchadays.com/">
    <meta property="og:image" content="https://happygotchadays.com/og-image.png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:locale" content="en_US">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="HappyGotchaDays - Celebrate Your Pet's Gotcha Day">
    <meta name="twitter:description" content="The community for rescue pet families. Track adoption anniversaries, share photos and stories, and celebrate your dog or cat's gotcha day.">
    <meta name="twitter:image" content="https://happygotchadays.com/og-image.png">

    <!-- JSON-LD Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "HappyGotchaDays",
      "url": "https://happygotchadays.com",
      "description": "A community platform for rescue pet families to celebrate gotcha days — the anniversary of pet adoption from shelters and rescues.",
      "applicationCategory": "LifestyleApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "author": {
        "@type": "Organization",
        "name": "HappyGotchaDays",
        "url": "https://happygotchadays.com"
      }
    }
    </script>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "HappyGotchaDays",
      "url": "https://happygotchadays.com",
      "description": "Celebrate your rescue pet's gotcha day adoption anniversary",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://happygotchadays.com/#discover?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
    </script>

    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [{
        "@type": "Question",
        "name": "What is a gotcha day?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A gotcha day is the anniversary of the day you adopted your rescue pet from a shelter, rescue organization, or foster home. It celebrates the moment a shelter animal became a beloved family member. Many pet parents mark their pet's gotcha day each year with treats, photos, and celebrations."
        }
      }]
    }
    </script>

    <!-- PWA Manifest -->
    <link rel="manifest" href="/manifest.json">

    <!-- Icons -->
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

    <!-- Google AdSense -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-0TETK91KG0"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","G-0TETK91KG0");</script><meta name="google-adsense-account" content="ca-pub-3401889582473794">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3401889582473794" crossorigin="anonymous"></script>

    <!-- CSS -->
    <link rel="stylesheet" href="/styles/main.css">

    <!-- Preload critical resources -->
    <link rel="preload" href="/scripts/app.js" as="script">
</head>
<body>
    <!-- Floating Decoration Elements -->
    <div class="floating-paws" aria-hidden="true">
        <span class="floating-paw" style="left: 5%; animation-delay: 0s;">🐾</span>
        <span class="floating-paw" style="left: 25%; animation-delay: 2s;">🐾</span>
        <span class="floating-paw" style="left: 75%; animation-delay: 4s;">🐾</span>
        <span class="floating-paw" style="left: 90%; animation-delay: 1s;">🐾</span>
    </div>

    <!-- Navigation -->
    <nav class="navbar">
        <div class="container">
            <div class="nav-brand">
                <span class="logo">🐾</span>
                <span class="brand-name">HappyGotchaDays</span>
            </div>
            <div class="nav-menu" id="navMenu">
                <a href="#home" class="nav-link active">Home</a>
                <a href="#discover" class="nav-link">Discover</a>
                <a href="/about" class="nav-link">About</a>
                <a href="/faq" class="nav-link">FAQ</a>
                <a href="#my-pets" class="nav-link" id="myPetsLink" style="display: none;">My Pets</a>
                <a href="#profile" class="nav-link" id="profileLink" style="display: none;">Profile</a>
                <!-- Mobile Auth Buttons -->
                <div class="nav-actions-mobile">
                    <button class="btn btn-primary" id="loginBtnMobile">Login</button>
                    <button class="btn btn-secondary" id="signupBtnMobile">Sign Up</button>
                    <button class="btn btn-outline" id="logoutBtnMobile" style="display: none;">Logout</button>
                </div>
            </div>
            <div class="nav-actions">
                <button class="btn btn-primary" id="loginBtn">Login</button>
                <button class="btn btn-secondary" id="signupBtn">Sign Up</button>
                <button class="btn btn-icon" id="logoutBtn" style="display: none;">Logout</button>
            </div>
            <button class="nav-toggle" id="navToggle" aria-label="Toggle navigation">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    </nav>

    <!-- Main Content -->
    <main id="app">
        <!-- Hero Section -->
        <section class="hero" id="home">
            <!-- Confetti background decoration -->
            <div class="hero-confetti" aria-hidden="true">
                <span class="confetti-piece" style="left: 10%; background: var(--coral);"></span>
                <span class="confetti-piece" style="left: 20%; background: var(--sunshine); animation-delay: 0.5s;"></span>
                <span class="confetti-piece" style="left: 40%; background: var(--mint); animation-delay: 1s;"></span>
                <span class="confetti-piece" style="left: 60%; background: var(--lavender); animation-delay: 1.5s;"></span>
                <span class="confetti-piece" style="left: 80%; background: var(--sky); animation-delay: 0.3s;"></span>
                <span class="confetti-piece" style="left: 90%; background: var(--coral); animation-delay: 0.8s;"></span>
            </div>

            <div class="container">
                <div class="hero-content">
                    <div class="celebration-icons" aria-hidden="true">
                        <span class="party-icon">🎈</span>
                        <span class="party-icon">🎊</span>
                        <span class="party-icon">🎉</span>
                    </div>
                    <h1 class="hero-title">
                        Celebrate Every
                        <span class="gradient-text">Gotcha Day!</span>
                    </h1>
                    <p class="hero-subtitle">
                        Where rescue pet families come together to celebrate adoption anniversaries
                        with love, photos, and party vibes! 🐶🐱
                    </p>
                    <div class="hero-actions">
                        <button class="btn btn-large btn-primary" id="heroGetStarted">
                            <span class="btn-icon-left">🎉</span>
                            Start Celebrating
                        </button>
                        <button class="btn btn-large btn-outline" id="heroLearnMore">
                            See Success Stories
                        </button>
                    </div>
                </div>
                <div class="hero-image">
                    <div class="polaroid-stack">
                        <div class="polaroid polaroid-back">
                            <div class="polaroid-photo">
                                <div class="photo-placeholder photo-placeholder--cat">
                                    <span class="placeholder-emoji">🐱</span>
                                    <span class="placeholder-text">Whiskers</span>
                                </div>
                            </div>
                        </div>
                        <div class="polaroid polaroid-front">
                            <div class="polaroid-photo">
                                <div class="photo-placeholder photo-placeholder--dog">
                                    <span class="placeholder-emoji">🐶</span>
                                    <span class="placeholder-text">Max</span>
                                </div>
                            </div>
                            <div class="polaroid-caption">
                                <span class="pet-name">Max</span>
                                <span class="gotcha-years">3 years of love!</span>
                            </div>
                            <div class="celebration-badge celebration-badge--hero">
                                <span class="badge-icon">🏆</span>
                                Gotcha Day Hero!
                            </div>
                        </div>
                        <!-- Floating hearts decoration -->
                        <div class="floating-hearts" aria-hidden="true">
                            <span class="heart">❤️</span>
                            <span class="heart" style="animation-delay: 0.5s;">💕</span>
                            <span class="heart" style="animation-delay: 1s;">💗</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- What is a Gotcha Day Section (AEO / Featured Snippet optimized) -->
        <section class="discover-section" id="what-is-gotcha-day" style="background: white; padding: 3rem 0;">
            <div class="container" style="max-width: 800px;">
                <div class="section-header section-header--centered">
                    <h2 class="section-title">What Is a Gotcha Day?</h2>
                </div>
                <p style="font-size: 1.15rem; line-height: 1.8; margin-bottom: 1.5rem; text-align: center;">
                    A <strong>gotcha day</strong> is the anniversary of the day you adopted your rescue pet from a shelter,
                    rescue organization, or foster home. It celebrates the moment a shelter animal became a beloved family
                    member. Many pet parents mark their pet's gotcha day each year with treats, photos, and celebrations.
                </p>
                <p style="font-size: 1.05rem; line-height: 1.8; margin-bottom: 1.5rem; text-align: center; color: #636E72;">
                    HappyGotchaDays helps you track gotcha day anniversaries, share adoption stories, upload celebration
                    photos, and connect with a community of rescue pet families. It is free and works on any device.
                </p>
                <div style="text-align: center;">
                    <a href="/about" class="btn btn-outline" style="margin-right: 0.75rem;">Learn More</a>
                    <a href="/faq" class="btn btn-secondary">Read the FAQ</a>
                </div>
            </div>
        </section>

        <!-- Trending Banner -->
        <section class="trending-section">
            <div class="container">
                <div class="celebration-banner">
                    <span class="banner-icon banner-icon--animated">🔥</span>
                    <span class="banner-text">
                        Celebrating a gotcha day this week? Share it with the community!
                    </span>
                    <button class="btn btn-small btn-accent">Join the Party!</button>
                </div>
            </div>
        </section>

        <!-- Feed Section -->
        <section class="feed-section" id="feed">
            <div class="container">
                <div class="section-header">
                    <div class="section-header-left">
                        <span class="section-icon">🎉</span>
                        <h2 class="section-title">Gotcha Day Celebrations</h2>
                    </div>
                    <div class="trending-badge">
                        <span class="trending-pulse"></span>
                        Trending Now
                    </div>
                </div>
                <div id="feedContainer" class="feed-grid">
                    <!-- Feed cards will be dynamically inserted here -->
                    <div class="loading-state">
                        <div class="loading-spinner"></div>
                        <p class="loading-text">Loading celebrations...</p>
                    </div>
                </div>
                <div class="feed-empty" id="feedEmpty" style="display: none;">
                    <div class="empty-state">
                        <span class="empty-icon">🎈</span>
                        <h3 class="empty-title">No Celebrations Yet!</h3>
                        <p class="empty-message">Be the first to share your pet's gotcha day story!</p>
                        <button class="btn btn-primary" id="emptyAddPet">Add Your Pet</button>
                    </div>
                </div>
                <button class="btn btn-secondary btn-load-more" id="loadMoreBtn" style="display: none;">
                    <span class="btn-icon-left">🐾</span>
                    Load More Celebrations
                </button>
            </div>
        </section>

        <!-- Discover Section -->
        <section class="discover-section" id="discover">
            <div class="container">
                <div class="section-header section-header--centered">
                    <span class="section-icon">🔍</span>
                    <h2 class="section-title">Discover Rescue Pets</h2>
                    <p class="section-subtitle">Find furry friends and their heartwarming stories</p>
                </div>
                <div class="search-bar">
                    <span class="search-icon">🔍</span>
                    <input type="text" id="searchInput" placeholder="Search for pets or pet parents..." class="search-input">
                    <button class="btn btn-icon search-submit" id="searchBtn" aria-label="Search">
                        <span>→</span>
                    </button>
                </div>
                <div class="filter-tags">
                    <button class="filter-tag filter-tag--active" data-filter="all">All Pets</button>
                    <button class="filter-tag" data-filter="dog">🐶 Dogs</button>
                    <button class="filter-tag" data-filter="cat">🐱 Cats</button>
                    <button class="filter-tag" data-filter="recent">🆕 Recent</button>
                    <button class="filter-tag" data-filter="celebrating">🎂 Celebrating</button>
                </div>
                <div id="discoverContainer" class="pet-grid">
                    <!-- Pet cards will be dynamically inserted here -->
                    <div class="loading-state">
                        <div class="loading-spinner"></div>
                        <p class="loading-text">Finding adorable pets...</p>
                    </div>
                </div>
                <div class="discover-empty" id="discoverEmpty" style="display: none;">
                    <div class="empty-state">
                        <span class="empty-icon">🐾</span>
                        <h3 class="empty-title">No Pets Found</h3>
                        <p class="empty-message">Try a different search or add your own pet!</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Upcoming Gotcha Days -->
        <section class="upcoming-section">
            <div class="container">
                <div class="section-header">
                    <div class="section-header-left">
                        <span class="section-icon">📅</span>
                        <h2 class="section-title">Upcoming Gotcha Days</h2>
                    </div>
                    <a href="#" class="see-all-link">See Calendar →</a>
                </div>
                <div id="upcomingContainer" class="upcoming-grid">
                    <!-- Upcoming celebrations will be dynamically inserted here -->
                    <div class="loading-state">
                        <div class="loading-spinner"></div>
                        <p class="loading-text">Checking the party calendar...</p>
                    </div>
                </div>
                <div class="upcoming-empty" id="upcomingEmpty" style="display: none;">
                    <div class="empty-state empty-state--small">
                        <span class="empty-icon">🗓️</span>
                        <h3 class="empty-title">No Upcoming Gotcha Days</h3>
                        <p class="empty-message">Add a pet to see upcoming anniversaries!</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- My Pets Section (Auth Required) -->
        <section class="my-pets-section" id="my-pets" style="display: none;">
            <div class="container">
                <div class="section-header">
                    <div class="section-header-left">
                        <span class="section-icon">🐾</span>
                        <h2 class="section-title">My Rescue Pets</h2>
                    </div>
                    <button class="btn btn-primary" id="addPetBtn">
                        <span class="btn-icon-left">➕</span>
                        Add Pet
                    </button>
                </div>
                <div id="myPetsContainer" class="pet-grid">
                    <!-- User's pets will be dynamically inserted here -->
                    <div class="loading-state">
                        <div class="loading-spinner"></div>
                        <p class="loading-text">Loading your fur family...</p>
                    </div>
                </div>
                <div class="my-pets-empty" id="myPetsEmpty" style="display: none;">
                    <div class="empty-state empty-state--large">
                        <div class="empty-illustration">
                            <span class="empty-icon-large">🏠</span>
                            <div class="empty-pets-circle">
                                <span>🐶</span>
                                <span>🐱</span>
                            </div>
                        </div>
                        <h3 class="empty-title">Your Pet Family Awaits!</h3>
                        <p class="empty-message">
                            Add your rescue pet to start celebrating their gotcha day
                            and share their adoption story with our community!
                        </p>
                        <button class="btn btn-large btn-primary" id="emptyAddFirstPet">
                            <span class="btn-icon-left">🎉</span>
                            Add Your First Pet
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Profile Section (Auth Required) -->
        <section class="profile-section" id="profile" style="display: none;">
            <div class="container">
                <div class="section-header section-header--centered">
                    <h2 class="section-title">My Profile</h2>
                </div>
                <div class="profile-stats">
                    <div class="stat-item">
                        <span class="stat-icon">🐾</span>
                        <span class="stat-number" id="userPetCount">0</span>
                        <span class="stat-label">My Pets</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-icon">📝</span>
                        <span class="stat-number" id="userPostCount">0</span>
                        <span class="stat-label">Posts</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-icon">❤️</span>
                        <span class="stat-number" id="userLikeCount">0</span>
                        <span class="stat-label">Likes Given</span>
                    </div>
                </div>
                <div id="profileContainer" class="profile-content">
                    <div class="loading-state">
                        <div class="loading-spinner"></div>
                        <p class="loading-text">Loading your profile...</p>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="footer-wave" aria-hidden="true"></div>
        <div class="container">
            <div class="footer-content">
                <div class="footer-brand">
                    <div class="footer-logo">
                        <span class="logo">🐾</span>
                        <h3>HappyGotchaDays</h3>
                    </div>
                    <p class="footer-tagline">Celebrating rescue pets and their forever families</p>
                    <div class="footer-social">
                        <span class="social-heart">Made with ❤️ for rescue pets</span>
                    </div>
                </div>
                <div class="footer-links">
                    <div class="footer-section">
                        <h4>About</h4>
                        <ul>
                            <li><a href="/about">Our Story</a></li>
                            <li><a href="/about#why-gotcha-days-matter">Why Gotcha Days Matter</a></li>
                            <li><a href="/faq">FAQ</a></li>
                        </ul>
                    </div>
                    <div class="footer-section">
                        <h4>Community</h4>
                        <ul>
                            <li><a href="#discover">Discover Pets</a></li>
                            <li><a href="#feed">Celebrations</a></li>
                        </ul>
                    </div>
                    <div class="footer-section">
                        <h4>Support</h4>
                        <ul>
                            <li><a href="/faq">Help &amp; FAQ</a></li>
                            <li><a href="/privacy">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 HappyGotchaDays. All rights reserved.</p>
                <p class="footer-pets">🐶 For rescued dogs and cats everywhere 🐱</p>
            </div>
        </div>
    </footer>

    <!-- Modals -->
    <div id="modalContainer"></div>

    <!-- Confetti Container -->
    <div id="confettiContainer" class="confetti-container" aria-hidden="true"></div>

    <!-- Heart Burst Container -->
    <div id="heartBurstContainer" class="heart-burst-container" aria-hidden="true"></div>

    <!-- Toast Notifications -->
    <div id="toastContainer" class="toast-container" role="alert" aria-live="polite"></div>

    <!-- Scripts -->
    <script src="/scripts/app.js"></script>

    <!-- Service Worker Registration -->
    <script>
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(reg => console.log('Service Worker registered'))
                    .catch(err => console.error('Service Worker registration failed', err));
            });
        }
    </script>
</body>
</html>`;

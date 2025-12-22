export const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Celebrate and share your pet's adoption anniversary - gotcha days for rescued dogs and cats">
    <meta name="theme-color" content="#FF6B6B">
    <title>HappyGotchaDays - Celebrate Your Pet's Adoption Anniversary</title>

    <!-- PWA Manifest -->
    <link rel="manifest" href="/manifest.json">

    <!-- Icons -->
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

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
                <h1>HappyGotchaDays</h1>
            </div>
            <div class="nav-menu" id="navMenu">
                <a href="#home" class="nav-link active">Home</a>
                <a href="#discover" class="nav-link">Discover</a>
                <a href="#my-pets" class="nav-link" id="myPetsLink" style="display: none;">My Pets</a>
                <a href="#profile" class="nav-link" id="profileLink" style="display: none;">Profile</a>
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
                    <h2 class="hero-title">
                        Celebrate Every
                        <span class="gradient-text">Gotcha Day!</span>
                    </h2>
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

        <!-- Community Stats -->
        <section class="stats-section">
            <div class="container">
                <div class="community-stats">
                    <div class="stat-item">
                        <span class="stat-icon">🎊</span>
                        <span class="stat-number" id="totalCelebrations">1,247</span>
                        <span class="stat-label">Celebrations</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-icon">🐾</span>
                        <span class="stat-number" id="totalPets">892</span>
                        <span class="stat-label">Rescue Pets</span>
                    </div>
                    <div class="stat-item stat-item--highlight">
                        <span class="stat-icon">🎂</span>
                        <span class="stat-number" id="celebrationsToday">34</span>
                        <span class="stat-label">Celebrating Today!</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-icon">❤️</span>
                        <span class="stat-number" id="totalHearts">12.5K</span>
                        <span class="stat-label">Hearts Given</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- Trending Banner -->
        <section class="trending-section">
            <div class="container">
                <div class="celebration-banner">
                    <span class="banner-icon banner-icon--animated">🔥</span>
                    <span class="banner-text">
                        <strong id="trendingCount">23</strong> pets are celebrating their Gotcha Days this week!
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
                            <li><a href="#">Our Story</a></li>
                            <li><a href="#">Why Gotcha Days Matter</a></li>
                            <li><a href="#">Success Stories</a></li>
                        </ul>
                    </div>
                    <div class="footer-section">
                        <h4>Community</h4>
                        <ul>
                            <li><a href="#">Pet Parents</a></li>
                            <li><a href="#">Shelters & Rescues</a></li>
                            <li><a href="#">Partners</a></li>
                        </ul>
                    </div>
                    <div class="footer-section">
                        <h4>Support</h4>
                        <ul>
                            <li><a href="#">Help Center</a></li>
                            <li><a href="#">Contact Us</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2024 HappyGotchaDays. All rights reserved.</p>
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

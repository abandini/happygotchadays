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
            <button class="nav-toggle" id="navToggle">
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
            <div class="container">
                <div class="hero-content">
                    <h2 class="hero-title">Celebrate Every Gotcha Day <span class="emoji">🎉</span></h2>
                    <p class="hero-subtitle">Share the joy of your rescue pet's adoption anniversary with the world!</p>
                    <div class="hero-actions">
                        <button class="btn btn-large btn-primary" id="heroGetStarted">Start Celebrating</button>
                        <button class="btn btn-large btn-outline" id="heroLearnMore">See Success Stories</button>
                    </div>
                </div>
                <div class="hero-image">
                    <div class="pet-card-demo">
                        <div class="pet-photo-placeholder">🐶</div>
                        <h3>Max</h3>
                        <p>3 years with family</p>
                        <div class="celebration-badge" style="margin-top: 1rem;">Gotcha Day Hero!</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Community Stats -->
        <section class="stats-section">
            <div class="container">
                <div class="community-stats">
                    <div class="stat-item">
                        <span class="stat-number" id="totalCelebrations">1,247</span>
                        <span class="stat-label">Celebrations</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number" id="totalPets">892</span>
                        <span class="stat-label">Rescue Pets</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number" id="celebrationsToday">34</span>
                        <span class="stat-label">Celebrating Today</span>
                    </div>
                    <div class="stat-item">
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
                    <span class="emoji">🔥</span> <strong id="trendingCount">23</strong> pets are celebrating their Gotcha Days this week! Join the celebration!
                </div>
            </div>
        </section>

        <!-- Feed Section -->
        <section class="feed-section" id="feed">
            <div class="container">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <h2 class="section-title" style="margin-bottom: 0;">Gotcha Day Celebrations</h2>
                    <div class="trending-badge">Trending Now</div>
                </div>
                <div id="feedContainer" class="feed-grid">
                    <div class="loading">Loading celebrations...</div>
                </div>
                <button class="btn btn-secondary" id="loadMoreBtn" style="display: none;">Load More Celebrations</button>
            </div>
        </section>

        <!-- Discover Section -->
        <section class="discover-section" id="discover">
            <div class="container">
                <h2 class="section-title">Discover Rescue Pets</h2>
                <div class="search-bar">
                    <input type="text" id="searchInput" placeholder="Search for pets or users..." class="search-input">
                    <button class="btn btn-icon" id="searchBtn">🔍</button>
                </div>
                <div id="discoverContainer" class="pet-grid">
                    <div class="loading">Loading pets...</div>
                </div>
            </div>
        </section>

        <!-- Upcoming Gotcha Days -->
        <section class="upcoming-section">
            <div class="container">
                <h2 class="section-title">Upcoming Gotcha Days 📅</h2>
                <div id="upcomingContainer" class="upcoming-grid">
                    <div class="loading">Loading upcoming celebrations...</div>
                </div>
            </div>
        </section>

        <!-- My Pets Section (Auth Required) -->
        <section class="my-pets-section" id="my-pets" style="display: none;">
            <div class="container">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <h2 class="section-title" style="margin-bottom: 0;">My Rescue Pets 🐾</h2>
                    <button class="btn btn-primary" id="addPetBtn">Add Pet</button>
                </div>
                <div id="myPetsContainer" class="pet-grid">
                    <div class="loading">Loading your pets...</div>
                </div>
            </div>
        </section>

        <!-- Profile Section (Auth Required) -->
        <section class="profile-section" id="profile" style="display: none;">
            <div class="container">
                <h2 class="section-title">My Profile</h2>
                <div class="community-stats" style="max-width: 800px; margin: 2rem auto;">
                    <div class="stat-item">
                        <span class="stat-number" id="userPetCount">0</span>
                        <span class="stat-label">My Pets</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number" id="userPostCount">0</span>
                        <span class="stat-label">Posts</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number" id="userLikeCount">0</span>
                        <span class="stat-label">Likes Given</span>
                    </div>
                </div>
                <div id="profileContainer" style="max-width: 600px; margin: 0 auto;">
                    <div class="loading">Loading profile...</div>
                </div>
            </div>
        </section>
    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>HappyGotchaDays</h3>
                    <p>Celebrating rescue pets and their families</p>
                </div>
                <div class="footer-section">
                    <h4>About</h4>
                    <p>For pets only - celebrating dogs and cats finding their forever homes</p>
                </div>
                <div class="footer-section">
                    <h4>Connect</h4>
                    <p>Share your pet's gotcha day story</p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2024 HappyGotchaDays. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <!-- Modals -->
    <div id="modalContainer"></div>

    <!-- Confetti Container -->
    <div id="confettiContainer" class="confetti-container"></div>

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

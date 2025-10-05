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
                    <h2 class="hero-title">Celebrate Every Gotcha Day 🎉</h2>
                    <p class="hero-subtitle">Share the joy of your rescue pet's adoption anniversary</p>
                    <div class="hero-actions">
                        <button class="btn btn-large btn-primary" id="heroGetStarted">Get Started</button>
                        <button class="btn btn-large btn-outline" id="heroLearnMore">Learn More</button>
                    </div>
                </div>
                <div class="hero-image">
                    <div class="pet-card-demo">
                        <div class="pet-photo-placeholder">🐶</div>
                        <h3>Max</h3>
                        <p>3 years with family</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Feed Section -->
        <section class="feed-section" id="feed">
            <div class="container">
                <h2 class="section-title">Gotcha Day Celebrations</h2>
                <div id="feedContainer" class="feed-grid">
                    <div class="loading">Loading celebrations...</div>
                </div>
                <button class="btn btn-secondary" id="loadMoreBtn" style="display: none;">Load More</button>
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

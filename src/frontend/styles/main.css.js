export const css = `/* HappyGotchaDays - Viral Pet Celebration Platform */

/* Reset & Base */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    /* Warm, Emotional Color Palette */
    --primary-color: #FF6B4A;
    --primary-dark: #E55535;
    --secondary-color: #A78BFA;
    --secondary-light: #C4B5FD;
    --accent-yellow: #FFC107;
    --heart-pink: #FF6B9D;
    --rescue-green: #10B981;
    --celebration-orange: #FB923C;

    /* Neutrals with Warmth */
    --text-dark: #1F2937;
    --text-medium: #4B5563;
    --text-light: #9CA3AF;
    --bg-cream: #FFFBF5;
    --bg-light: #FEF3E2;
    --bg-white: #FFFFFF;
    --bg-gradient-warm: linear-gradient(135deg, #FFE8D6 0%, #FFF5E6 100%);

    /* Enhanced Shadows & Effects */
    --border-color: #F3E8D8;
    --shadow-soft: 0 2px 8px rgba(255, 107, 74, 0.08);
    --shadow-md: 0 4px 12px rgba(255, 107, 74, 0.12);
    --shadow-lg: 0 10px 30px rgba(255, 107, 74, 0.15);
    --shadow-glow: 0 0 20px rgba(167, 139, 250, 0.3);

    /* Rounded & Playful */
    --radius-sm: 8px;
    --radius: 16px;
    --radius-lg: 24px;
    --radius-pill: 50px;

    /* Smooth Animations */
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    --transition-bounce: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);

    /* Spacing */
    --space-xs: 0.5rem;
    --space-sm: 1rem;
    --space-md: 1.5rem;
    --space-lg: 2rem;
    --space-xl: 3rem;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    color: var(--text-dark);
    background: var(--bg-cream);
    line-height: 1.6;
    font-size: 16px;
    overflow-x: hidden;
}

/* Playful Headings */
h1, h2, h3 {
    font-weight: 800;
    letter-spacing: -0.02em;
}

/* Smooth Scroll */
html {
    scroll-behavior: smooth;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Navigation */
.navbar {
    background: var(--bg-white);
    box-shadow: var(--shadow-sm);
    position: sticky;
    top: 0;
    z-index: 100;
    padding: 1rem 0;
}

.navbar .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nav-brand {
    display: flex;
    align-items: center;
    gap: 10px;
}

.logo {
    font-size: 2rem;
}

.nav-brand h1 {
    font-size: 1.5rem;
    color: var(--primary-color);
}

.nav-menu {
    display: flex;
    gap: 2rem;
    align-items: center;
}

.nav-link {
    color: var(--text-dark);
    text-decoration: none;
    font-weight: 500;
    transition: var(--transition);
}

.nav-link:hover,
.nav-link.active {
    color: var(--primary-color);
}

.nav-actions {
    display: flex;
    gap: 1rem;
    align-items: center;
}

.nav-toggle {
    display: none;
    flex-direction: column;
    gap: 4px;
    background: none;
    border: none;
    cursor: pointer;
}

.nav-toggle span {
    width: 25px;
    height: 3px;
    background: var(--text-dark);
    transition: var(--transition);
}

/* Buttons */
.btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: var(--radius);
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
    font-size: 1rem;
    display: inline-block;
    text-align: center;
    text-decoration: none;
}

.btn-primary {
    background: var(--primary-color);
    color: white;
}

.btn-primary:hover {
    background: #e55555;
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.btn-secondary {
    background: var(--secondary-color);
    color: white;
}

.btn-secondary:hover {
    background: #3db8af;
}

.btn-outline {
    background: transparent;
    border: 2px solid var(--primary-color);
    color: var(--primary-color);
}

.btn-outline:hover {
    background: var(--primary-color);
    color: white;
}

.btn-large {
    padding: 1rem 2rem;
    font-size: 1.1rem;
}

.btn-icon {
    padding: 0.5rem;
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
}

/* Hero Section - VIRAL ENERGY */
.hero {
    background: linear-gradient(135deg, #FF6B4A 0%, #FF8F6B 25%, #A78BFA 75%, #C4B5FD 100%);
    background-size: 200% 200%;
    animation: gradientShift 8s ease infinite;
    color: white;
    padding: 5rem 0;
    margin-top: -1px;
    position: relative;
    overflow: hidden;
}

@keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
}

.hero::before {
    content: '🐾';
    position: absolute;
    font-size: 15rem;
    opacity: 0.1;
    top: -50px;
    right: -50px;
    animation: float 6s ease-in-out infinite;
}

@keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
}

.hero .container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: center;
    position: relative;
    z-index: 1;
}

.hero-title {
    font-size: 3.5rem;
    margin-bottom: 1rem;
    font-weight: 900;
    line-height: 1.1;
    text-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.hero-title .emoji {
    display: inline-block;
    animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

.hero-subtitle {
    font-size: 1.4rem;
    margin-bottom: 2rem;
    opacity: 0.95;
    font-weight: 500;
}

.hero-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.pet-card-demo {
    background: white;
    border-radius: var(--radius-lg);
    padding: 2.5rem;
    text-align: center;
    box-shadow: var(--shadow-lg);
    color: var(--text-dark);
    transform: rotate(-2deg);
    transition: var(--transition-bounce);
}

.pet-card-demo:hover {
    transform: rotate(0deg) translateY(-10px);
    box-shadow: var(--shadow-glow), var(--shadow-lg);
}

.pet-photo-placeholder {
    font-size: 6rem;
    margin-bottom: 1rem;
    animation: wiggle 3s ease-in-out infinite;
}

@keyframes wiggle {
    0%, 100% { transform: rotate(-5deg); }
    50% { transform: rotate(5deg); }
}

/* Feed Section */
.feed-section,
.discover-section,
.upcoming-section {
    padding: 4rem 0;
}

.section-title {
    font-size: 2rem;
    margin-bottom: 2rem;
    text-align: center;
    color: var(--text-dark);
}

.feed-grid,
.pet-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
}

.post-card,
.pet-card {
    background: var(--bg-white);
    border-radius: var(--radius);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    transition: var(--transition);
}

.post-card:hover,
.pet-card:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-4px);
}

.post-header,
.pet-header {
    padding: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
}

.avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--accent-color);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
}

.post-author,
.pet-owner {
    flex: 1;
}

.post-author h3,
.pet-owner h3 {
    font-size: 1rem;
    margin-bottom: 0.25rem;
}

.post-author p,
.pet-owner p {
    font-size: 0.875rem;
    color: var(--text-light);
}

.post-image,
.pet-image {
    width: 100%;
    height: 300px;
    object-fit: cover;
}

.post-content,
.pet-content {
    padding: 1rem;
}

.post-actions {
    padding: 0 1rem 1rem;
    display: flex;
    gap: 1rem;
}

.action-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-light);
    transition: var(--transition);
}

.action-btn:hover {
    color: var(--primary-color);
}

/* Search Bar */
.search-bar {
    max-width: 600px;
    margin: 0 auto 2rem;
    display: flex;
    gap: 1rem;
    background: white;
    padding: 0.5rem;
    border-radius: var(--radius);
    box-shadow: var(--shadow-sm);
}

.search-input {
    flex: 1;
    border: none;
    padding: 0.75rem;
    font-size: 1rem;
    outline: none;
}

/* Loading */
.loading {
    text-align: center;
    padding: 2rem;
    color: var(--text-light);
    font-size: 1.1rem;
}

/* Footer */
.footer {
    background: var(--text-dark);
    color: white;
    padding: 3rem 0 1rem;
    margin-top: 4rem;
}

.footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
}

.footer-section h3,
.footer-section h4 {
    margin-bottom: 1rem;
    color: var(--accent-color);
}

.footer-bottom {
    text-align: center;
    padding-top: 2rem;
    border-top: 1px solid rgba(255,255,255,0.1);
}

/* Upcoming Grid */
.upcoming-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
}

.upcoming-card {
    background: white;
    padding: 1.5rem;
    border-radius: var(--radius);
    box-shadow: var(--shadow-sm);
    border-left: 4px solid var(--primary-color);
}

.upcoming-card h3 {
    color: var(--text-dark);
    margin-bottom: 0.5rem;
}

.upcoming-card .days-until {
    color: var(--primary-color);
    font-weight: bold;
    font-size: 1.2rem;
}

/* Responsive Design */
@media (max-width: 768px) {
    .hero .container {
        grid-template-columns: 1fr;
    }

    .hero-title {
        font-size: 2rem;
    }

    .nav-menu {
        display: none;
    }

    .nav-toggle {
        display: flex;
    }

    .feed-grid,
    .pet-grid {
        grid-template-columns: 1fr;
    }
}

/* Modals */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
}

.modal-content {
    background: var(--bg-white);
    border-radius: var(--radius);
    padding: 2rem;
    max-width: 400px;
    width: 100%;
    box-shadow: var(--shadow-lg);
}

.modal-content h2 {
    margin-bottom: 1.5rem;
    color: var(--text-dark);
}

.modal-content form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.modal-content input {
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    font-size: 1rem;
    font-family: inherit;
}

.modal-content input:focus,
.modal-content select:focus,
.modal-content textarea:focus {
    outline: none;
    border-color: var(--primary-color);
}

.modal-content select,
.modal-content textarea {
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    font-size: 1rem;
    font-family: inherit;
}

.modal-content button {
    width: 100%;
}

/* VIRAL FEATURES - Confetti & Celebrations */
.confetti-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
    overflow: hidden;
}

.confetti {
    position: absolute;
    width: 10px;
    height: 10px;
    animation: confettiFall 3s linear forwards;
}

@keyframes confettiFall {
    0% {
        transform: translateY(-100vh) rotate(0deg);
        opacity: 1;
    }
    100% {
        transform: translateY(100vh) rotate(720deg);
        opacity: 0;
    }
}

/* Countdown Timer */
.countdown-timer {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    background: var(--bg-gradient-warm);
    padding: 1rem 1.5rem;
    border-radius: var(--radius-pill);
    border: 2px solid var(--primary-color);
    font-weight: 700;
    font-size: 1.1rem;
    color: var(--primary-color);
    animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
    0%, 100% { transform: scale(1); box-shadow: var(--shadow-soft); }
    50% { transform: scale(1.05); box-shadow: var(--shadow-md); }
}

.countdown-timer .number {
    font-size: 1.8rem;
    font-weight: 900;
    color: var(--primary-dark);
}

.countdown-timer .label {
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

/* Social Share Buttons */
.share-buttons {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    margin-top: var(--space-md);
}

.share-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    border-radius: var(--radius-pill);
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    border: none;
    transition: var(--transition-bounce);
    text-decoration: none;
}

.share-btn:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
}

.share-btn.instagram {
    background: linear-gradient(45deg, #F58529, #DD2A7B, #8134AF);
    color: white;
}

.share-btn.facebook {
    background: #1877F2;
    color: white;
}

.share-btn.twitter {
    background: #1DA1F2;
    color: white;
}

.share-btn.copy-link {
    background: var(--secondary-color);
    color: white;
}

/* Celebration Badge */
.celebration-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: linear-gradient(135deg, var(--accent-yellow) 0%, var(--celebration-orange) 100%);
    color: var(--text-dark);
    padding: 0.5rem 1rem;
    border-radius: var(--radius-pill);
    font-weight: 700;
    font-size: 0.9rem;
    box-shadow: var(--shadow-soft);
    animation: shimmer 2s ease-in-out infinite;
}

@keyframes shimmer {
    0%, 100% { filter: brightness(1); }
    50% { filter: brightness(1.2); }
}

/* Community Stats Bar */
.community-stats {
    background: white;
    padding: var(--space-lg);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-soft);
    margin: var(--space-xl) 0;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    gap: var(--space-md);
}

.stat-item {
    text-align: center;
    padding: var(--space-sm);
}

.stat-number {
    font-size: 2.5rem;
    font-weight: 900;
    color: var(--primary-color);
    display: block;
    line-height: 1;
}

.stat-label {
    font-size: 0.9rem;
    color: var(--text-light);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-top: 0.5rem;
}

/* Before/After Card */
.before-after-card {
    background: white;
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow-md);
    position: relative;
}

.before-after-images {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2px;
    background: var(--border-color);
}

.before-after-images img {
    width: 100%;
    height: 250px;
    object-fit: cover;
}

.before-after-label {
    position: absolute;
    top: 10px;
    padding: 0.5rem 1rem;
    font-weight: 700;
    font-size: 0.85rem;
    text-transform: uppercase;
    border-radius: var(--radius);
    background: rgba(0, 0, 0, 0.7);
    color: white;
}

.before-label {
    left: 10px;
}

.after-label {
    right: 10px;
    background: var(--rescue-green);
}

/* Trending Badge */
.trending-badge {
    background: linear-gradient(135deg, var(--heart-pink) 0%, var(--primary-color) 100%);
    color: white;
    padding: 0.35rem 0.85rem;
    border-radius: var(--radius-pill);
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    animation: trendingPulse 1.5s ease-in-out infinite;
}

@keyframes trendingPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
}

.trending-badge::before {
    content: '🔥';
    font-size: 1rem;
}

/* Hashtag Pills */
.hashtag-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: var(--space-sm);
}

.hashtag {
    background: var(--bg-light);
    color: var(--secondary-color);
    padding: 0.4rem 0.9rem;
    border-radius: var(--radius-pill);
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
}

.hashtag:hover {
    background: var(--secondary-color);
    color: white;
    transform: translateY(-2px);
}

/* Heart Animation */
.heart-burst {
    position: absolute;
    font-size: 2rem;
    animation: heartBurst 1s ease-out forwards;
    pointer-events: none;
}

@keyframes heartBurst {
    0% {
        transform: scale(0) translateY(0);
        opacity: 1;
    }
    50% {
        transform: scale(1.2) translateY(-20px);
        opacity: 1;
    }
    100% {
        transform: scale(1) translateY(-50px);
        opacity: 0;
    }
}

/* Enhanced Card Hover Effects */
.post-card,
.pet-card {
    position: relative;
    overflow: hidden;
}

.post-card::before,
.pet-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s;
}

.post-card:hover::before,
.pet-card:hover::before {
    left: 100%;
}

/* Celebration Banner */
.celebration-banner {
    background: linear-gradient(135deg, var(--celebration-orange) 0%, var(--accent-yellow) 100%);
    color: var(--text-dark);
    padding: var(--space-md) var(--space-lg);
    text-align: center;
    font-weight: 700;
    font-size: 1.1rem;
    border-radius: var(--radius-lg);
    margin: var(--space-lg) 0;
    box-shadow: var(--shadow-md);
    animation: celebrationShine 3s ease-in-out infinite;
}

@keyframes celebrationShine {
    0%, 100% { box-shadow: var(--shadow-md); }
    50% { box-shadow: var(--shadow-lg), 0 0 30px rgba(255, 193, 7, 0.4); }
}

/* Utility Classes */
.text-center { text-align: center; }
.mt-1 { margin-top: 0.5rem; }
.mt-2 { margin-top: 1rem; }
.mt-3 { margin-top: 1.5rem; }
.mb-1 { margin-bottom: 0.5rem; }
.mb-2 { margin-bottom: 1rem; }
.mb-3 { margin-bottom: 1.5rem; }
.hidden { display: none !important; }

/* Fun Loading Animations */
.loading {
    position: relative;
}

.loading::after {
    content: '🐾';
    display: inline-block;
    animation: loadingSpin 2s linear infinite;
    margin-left: 0.5rem;
}

@keyframes loadingSpin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
`;

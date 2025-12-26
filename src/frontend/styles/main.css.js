export const css = `/* HappyGotchaDays - Joyful Pet Celebration Platform
   Design: Playful Celebration Theme
   Typography: Fredoka One (display) + Nunito (body)
   Palette: Sunshine, Coral, Mint on Warm Cream */

/* Google Fonts Import */
@import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800&display=swap');

/* Reset */
*, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* Design Tokens */
:root {
    /* Joyful Color Palette */
    --sunshine: #FFD93D;
    --sunshine-light: #FFF0B3;
    --coral: #FF6B6B;
    --coral-dark: #E85555;
    --coral-light: #FFB3B3;
    --mint: #6BCB77;
    --mint-light: #A8E6CF;
    --sky: #4ECDC4;
    --lavender: #9B7EDE;
    --peach: #FFEAA7;

    /* Warm Neutrals */
    --cream: #FFF8E7;
    --cream-dark: #F5E6D3;
    --warm-white: #FFFDF9;
    --charcoal: #2D3436;
    --charcoal-light: #636E72;
    --charcoal-lighter: #B2BEC3;

    /* Functional */
    --success: #00B894;
    --warning: #FDCB6E;
    --error: #E17055;
    --heart: #FF6B9D;

    /* Shadows - warm tinted */
    --shadow-sm: 0 2px 8px rgba(255, 107, 107, 0.08);
    --shadow-md: 0 4px 20px rgba(255, 107, 107, 0.12);
    --shadow-lg: 0 8px 40px rgba(255, 107, 107, 0.16);
    --shadow-glow: 0 0 30px rgba(255, 217, 61, 0.4);
    --shadow-polaroid: 0 10px 30px rgba(0, 0, 0, 0.15), 0 3px 8px rgba(0, 0, 0, 0.1);

    /* Border Radius */
    --radius-sm: 8px;
    --radius-md: 16px;
    --radius-lg: 24px;
    --radius-xl: 32px;
    --radius-full: 9999px;

    /* Spacing */
    --space-xs: 0.5rem;
    --space-sm: 1rem;
    --space-md: 1.5rem;
    --space-lg: 2rem;
    --space-xl: 3rem;
    --space-2xl: 4rem;

    /* Transitions */
    --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
    --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
    --transition-fast: 0.2s var(--ease-smooth);
    --transition-normal: 0.3s var(--ease-smooth);
    --transition-bounce: 0.5s var(--ease-bounce);
}

/* Base Styles */
html {
    scroll-behavior: smooth;
}

body {
    font-family: 'Nunito', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: var(--charcoal);
    background: var(--cream);
    overflow-x: hidden;
    min-height: 100vh;
}

/* Playful Typography */
h1, h2, h3, .display {
    font-family: 'Fredoka One', cursive;
    font-weight: 400;
    letter-spacing: 0.02em;
    line-height: 1.2;
}

h1 { font-size: clamp(2rem, 5vw, 3rem); }
h2 { font-size: clamp(1.5rem, 4vw, 2.25rem); }
h3 { font-size: clamp(1.25rem, 3vw, 1.5rem); }

/* Paw Print Background Pattern */
.paw-pattern {
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 25c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5-2-4.5-4.5-4.5zm-8 8c-1.5 0-2.7 1.2-2.7 2.7s1.2 2.7 2.7 2.7 2.7-1.2 2.7-2.7-1.2-2.7-2.7-2.7zm16 0c-1.5 0-2.7 1.2-2.7 2.7s1.2 2.7 2.7 2.7 2.7-1.2 2.7-2.7-1.2-2.7-2.7-2.7zm-12-6c-1.5 0-2.7 1.2-2.7 2.7s1.2 2.7 2.7 2.7 2.7-1.2 2.7-2.7-1.2-2.7-2.7-2.7zm8 0c-1.5 0-2.7 1.2-2.7 2.7s1.2 2.7 2.7 2.7 2.7-1.2 2.7-2.7-1.2-2.7-2.7-2.7z' fill='%23FFD93D' fill-opacity='0.08'/%3E%3C/svg%3E");
}

/* Container */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--space-md);
}

/* ===== NAVIGATION ===== */
.navbar {
    background: var(--warm-white);
    backdrop-filter: blur(10px);
    position: sticky;
    top: 0;
    z-index: 100;
    padding: var(--space-sm) 0;
    border-bottom: 3px solid var(--sunshine);
    box-shadow: var(--shadow-sm);
}

.navbar .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nav-brand {
    display: flex;
    align-items: center;
    gap: 12px;
}

.logo {
    font-size: 2.5rem;
    animation: pawWiggle 3s ease-in-out infinite;
}

@keyframes pawWiggle {
    0%, 100% { transform: rotate(-5deg); }
    50% { transform: rotate(5deg); }
}

.nav-brand h1 {
    font-family: 'Fredoka One', cursive;
    font-size: 1.75rem;
    background: linear-gradient(135deg, var(--coral) 0%, var(--sunshine) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.nav-menu {
    display: flex;
    gap: var(--space-lg);
    align-items: center;
}

.nav-link {
    font-family: 'Nunito', sans-serif;
    font-weight: 700;
    color: var(--charcoal);
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: var(--radius-full);
    transition: var(--transition-normal);
    position: relative;
}

.nav-link::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 3px;
    background: var(--coral);
    border-radius: var(--radius-full);
    transition: var(--transition-normal);
    transform: translateX(-50%);
}

.nav-link:hover::after,
.nav-link.active::after {
    width: 80%;
}

.nav-link:hover,
.nav-link.active {
    color: var(--coral);
}

.nav-actions {
    display: flex;
    gap: var(--space-sm);
    align-items: center;
}

.nav-actions-mobile {
    display: none;
}

.nav-toggle {
    display: none;
    flex-direction: column;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
}

.nav-toggle span {
    width: 28px;
    height: 3px;
    background: var(--charcoal);
    border-radius: var(--radius-full);
    transition: var(--transition-normal);
}

/* ===== BUTTONS ===== */
.btn {
    font-family: 'Nunito', sans-serif;
    font-weight: 700;
    font-size: 1rem;
    padding: 0.875rem 1.75rem;
    border: none;
    border-radius: var(--radius-full);
    cursor: pointer;
    transition: var(--transition-bounce);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    text-decoration: none;
    position: relative;
    overflow: hidden;
}

.btn::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.4s, height 0.4s;
}

.btn:hover::before {
    width: 300px;
    height: 300px;
}

.btn-primary {
    background: linear-gradient(135deg, var(--coral) 0%, var(--coral-dark) 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
}

.btn-primary:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
}

.btn-secondary {
    background: linear-gradient(135deg, var(--sunshine) 0%, var(--peach) 100%);
    color: var(--charcoal);
    box-shadow: 0 4px 15px rgba(255, 217, 61, 0.3);
}

.btn-secondary:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 8px 25px rgba(255, 217, 61, 0.4);
}

.btn-outline {
    background: transparent;
    border: 3px solid var(--coral);
    color: var(--coral);
}

.btn-outline:hover {
    background: var(--coral);
    color: white;
    transform: translateY(-3px);
}

.btn-mint {
    background: linear-gradient(135deg, var(--mint) 0%, var(--sky) 100%);
    color: white;
}

.btn-large {
    padding: 1.125rem 2.5rem;
    font-size: 1.125rem;
}

.btn-icon {
    padding: 0.75rem;
    background: var(--sunshine-light);
    border: none;
    border-radius: var(--radius-md);
    font-size: 1.25rem;
    cursor: pointer;
    transition: var(--transition-bounce);
}

.btn-icon:hover {
    transform: scale(1.1) rotate(5deg);
    background: var(--sunshine);
}

/* ===== HERO SECTION ===== */
.hero {
    background: linear-gradient(135deg, var(--coral) 0%, var(--coral-light) 30%, var(--peach) 60%, var(--sunshine) 100%);
    padding: var(--space-2xl) 0 var(--space-xl);
    position: relative;
    overflow: hidden;
}

/* Floating decorations */
.hero::before,
.hero::after {
    position: absolute;
    font-size: 8rem;
    opacity: 0.15;
    animation: floatSlow 8s ease-in-out infinite;
}

.hero::before {
    content: '🎈';
    top: 10%;
    left: 5%;
}

.hero::after {
    content: '🎉';
    bottom: 10%;
    right: 5%;
    animation-delay: -4s;
}

@keyframes floatSlow {
    0%, 100% { transform: translateY(0) rotate(-5deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
}

.hero .container {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: var(--space-xl);
    align-items: center;
    position: relative;
    z-index: 1;
}

.hero-content {
    color: white;
}

.hero-title {
    font-size: clamp(2.5rem, 6vw, 4rem);
    margin-bottom: var(--space-md);
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    line-height: 1.1;
}

.hero-title .emoji {
    display: inline-block;
    animation: partyPop 1s ease-in-out infinite;
}

@keyframes partyPop {
    0%, 100% { transform: scale(1) rotate(0); }
    25% { transform: scale(1.2) rotate(-10deg); }
    75% { transform: scale(1.2) rotate(10deg); }
}

.hero-subtitle {
    font-size: 1.35rem;
    margin-bottom: var(--space-lg);
    opacity: 0.95;
    font-weight: 600;
    max-width: 500px;
}

.hero-actions {
    display: flex;
    gap: var(--space-md);
    flex-wrap: wrap;
}

.hero-actions .btn-outline {
    border-color: white;
    color: white;
}

.hero-actions .btn-outline:hover {
    background: white;
    color: var(--coral);
}

/* Pet Card Demo - Polaroid Style */
.pet-card-demo {
    background: white;
    padding: 1rem 1rem 1.5rem;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-polaroid);
    transform: rotate(3deg);
    transition: var(--transition-bounce);
    position: relative;
}

.pet-card-demo:hover {
    transform: rotate(0) scale(1.05);
    box-shadow: var(--shadow-glow), var(--shadow-polaroid);
}

.pet-card-demo::before {
    content: '📌';
    position: absolute;
    top: -15px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 1.5rem;
}

.pet-photo-frame {
    width: 100%;
    aspect-ratio: 1;
    background: linear-gradient(135deg, var(--cream) 0%, var(--cream-dark) 100%);
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: var(--space-md);
    overflow: hidden;
    position: relative;
}

.pet-photo-placeholder {
    font-size: 6rem;
    animation: petBounce 2s ease-in-out infinite;
}

@keyframes petBounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

.pet-card-demo h3 {
    font-family: 'Fredoka One', cursive;
    text-align: center;
    color: var(--charcoal);
    margin-bottom: 0.25rem;
}

.pet-card-demo p {
    text-align: center;
    color: var(--charcoal-light);
    font-weight: 600;
}

.pet-card-demo .celebration-badge {
    display: flex;
    justify-content: center;
    margin-top: var(--space-sm);
}

/* ===== STATS SECTION ===== */
.stats-section {
    margin-top: -40px;
    position: relative;
    z-index: 10;
    padding: 0 var(--space-md);
}

.community-stats {
    background: white;
    border-radius: var(--radius-xl);
    padding: var(--space-lg) var(--space-xl);
    box-shadow: var(--shadow-lg);
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    gap: var(--space-md);
    border: 3px solid var(--sunshine);
}

.stat-item {
    text-align: center;
    padding: var(--space-sm);
}

.stat-number {
    font-family: 'Fredoka One', cursive;
    font-size: 2.75rem;
    background: linear-gradient(135deg, var(--coral) 0%, var(--sunshine) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    display: block;
    line-height: 1;
}

.stat-label {
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--charcoal-light);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-top: 0.5rem;
}

/* ===== CELEBRATION BANNER ===== */
.trending-section {
    padding: var(--space-xl) 0;
}

.celebration-banner {
    background: linear-gradient(135deg, var(--sunshine) 0%, var(--peach) 50%, var(--coral-light) 100%);
    color: var(--charcoal);
    padding: var(--space-md) var(--space-lg);
    text-align: center;
    font-weight: 700;
    font-size: 1.15rem;
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-md);
    position: relative;
    overflow: hidden;
}

.celebration-banner::before,
.celebration-banner::after {
    position: absolute;
    font-size: 2rem;
    top: 50%;
    transform: translateY(-50%);
}

.celebration-banner::before {
    content: '🎊';
    left: 20px;
    animation: spin 4s linear infinite;
}

.celebration-banner::after {
    content: '🎊';
    right: 20px;
    animation: spin 4s linear infinite reverse;
}

@keyframes spin {
    from { transform: translateY(-50%) rotate(0); }
    to { transform: translateY(-50%) rotate(360deg); }
}

/* ===== SECTION TITLES ===== */
.section-title {
    font-family: 'Fredoka One', cursive;
    font-size: 2rem;
    color: var(--charcoal);
    text-align: center;
    margin-bottom: var(--space-lg);
    position: relative;
    display: inline-block;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-lg);
    flex-wrap: wrap;
    gap: var(--space-sm);
}

/* ===== FEED & PET GRIDS ===== */
.feed-section,
.discover-section,
.upcoming-section,
.my-pets-section,
.profile-section {
    padding: var(--space-xl) 0;
}

.feed-grid,
.pet-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: var(--space-lg);
}

/* ===== POST & PET CARDS - Polaroid Style ===== */
.post-card,
.pet-card {
    background: white;
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow-md);
    transition: var(--transition-bounce);
    position: relative;
}

.post-card:hover,
.pet-card:hover {
    transform: translateY(-8px) rotate(1deg);
    box-shadow: var(--shadow-lg);
}

/* Shimmer effect on hover */
.post-card::after,
.pet-card::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    transition: left 0.6s;
}

.post-card:hover::after,
.pet-card:hover::after {
    left: 100%;
}

.post-header,
.pet-header {
    padding: var(--space-md);
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    border-bottom: 2px dashed var(--cream-dark);
}

/* Avatar with pet photo or gradient */
.avatar {
    width: 48px;
    height: 48px;
    border-radius: var(--radius-full);
    background: linear-gradient(135deg, var(--coral-light) 0%, var(--sunshine-light) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 1.25rem;
    color: var(--coral);
    border: 3px solid var(--sunshine);
    overflow: hidden;
}

.avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.post-author h3,
.pet-owner h3 {
    font-family: 'Nunito', sans-serif;
    font-weight: 800;
    font-size: 1.1rem;
    color: var(--charcoal);
}

.post-author p,
.pet-owner p {
    font-size: 0.9rem;
    color: var(--charcoal-light);
    font-weight: 600;
}

/* Photo container */
.post-image-container,
.pet-image-container {
    position: relative;
    width: 100%;
    aspect-ratio: 4/3;
    background: linear-gradient(135deg, var(--cream) 0%, var(--cream-dark) 100%);
    overflow: hidden;
}

.post-image,
.pet-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s var(--ease-smooth);
}

.post-card:hover .post-image,
.pet-card:hover .pet-image {
    transform: scale(1.05);
}

/* Photo placeholder */
.photo-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--cream) 0%, var(--sunshine-light) 100%);
    font-size: 4rem;
}

.photo-placeholder span {
    font-size: 0.9rem;
    color: var(--charcoal-light);
    font-weight: 600;
    margin-top: var(--space-sm);
}

.post-content,
.pet-content {
    padding: var(--space-md);
}

.post-content p,
.pet-content p {
    color: var(--charcoal);
    line-height: 1.6;
}

/* Post Actions */
.post-actions {
    padding: 0 var(--space-md) var(--space-md);
    display: flex;
    gap: var(--space-sm);
    border-top: 2px dashed var(--cream-dark);
    padding-top: var(--space-md);
}

.action-btn {
    background: var(--cream);
    border: none;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--charcoal-light);
    padding: 0.5rem 1rem;
    border-radius: var(--radius-full);
    transition: var(--transition-bounce);
}

.action-btn:hover {
    background: var(--coral-light);
    color: var(--coral);
    transform: scale(1.05);
}

.action-btn.liked {
    background: var(--coral);
    color: white;
}

/* ===== HASHTAGS ===== */
.hashtag-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: var(--space-sm);
}

.hashtag {
    background: linear-gradient(135deg, var(--sunshine-light) 0%, var(--peach) 100%);
    color: var(--charcoal);
    padding: 0.4rem 0.9rem;
    border-radius: var(--radius-full);
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
    transition: var(--transition-bounce);
    border: 2px solid transparent;
}

.hashtag:hover {
    background: var(--sunshine);
    transform: translateY(-2px) scale(1.05);
    border-color: var(--coral);
}

/* ===== TRENDING BADGE ===== */
.trending-badge {
    background: linear-gradient(135deg, var(--coral) 0%, var(--coral-dark) 100%);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: var(--radius-full);
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    animation: trendPulse 2s ease-in-out infinite;
    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
}

@keyframes trendPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

.trending-badge::before {
    content: '🔥';
}

/* ===== CELEBRATION BADGE ===== */
.celebration-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: linear-gradient(135deg, var(--sunshine) 0%, var(--peach) 100%);
    color: var(--charcoal);
    padding: 0.5rem 1.25rem;
    border-radius: var(--radius-full);
    font-weight: 700;
    font-size: 0.9rem;
    box-shadow: var(--shadow-sm);
    border: 2px solid var(--coral);
}

/* ===== SEARCH BAR ===== */
.search-bar {
    max-width: 600px;
    margin: 0 auto var(--space-lg);
    display: flex;
    gap: 0.5rem;
    background: white;
    padding: 0.5rem;
    border-radius: var(--radius-full);
    box-shadow: var(--shadow-md);
    border: 3px solid var(--sunshine);
}

.search-input {
    flex: 1;
    border: none;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    font-family: 'Nunito', sans-serif;
    font-weight: 600;
    outline: none;
    background: transparent;
}

.search-input::placeholder {
    color: var(--charcoal-lighter);
}

/* ===== UPCOMING CARDS ===== */
.upcoming-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--space-lg);
}

.upcoming-card {
    background: white;
    padding: var(--space-lg);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    border-left: 6px solid var(--coral);
    position: relative;
    overflow: hidden;
    transition: var(--transition-bounce);
}

.upcoming-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
}

.upcoming-card::before {
    content: '🎂';
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 2rem;
    opacity: 0.3;
}

.upcoming-card h3 {
    font-family: 'Fredoka One', cursive;
    color: var(--charcoal);
    margin-bottom: 0.5rem;
}

.upcoming-card p {
    color: var(--charcoal-light);
    font-weight: 600;
}

/* Countdown Timer */
.countdown-timer {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    background: linear-gradient(135deg, var(--sunshine-light) 0%, var(--peach) 100%);
    padding: 1rem 1.5rem;
    border-radius: var(--radius-lg);
    border: 3px solid var(--coral);
    font-weight: 700;
    margin: var(--space-sm) 0;
}

.countdown-timer .number {
    font-family: 'Fredoka One', cursive;
    font-size: 2rem;
    color: var(--coral);
}

.countdown-timer .label {
    font-size: 0.85rem;
    color: var(--charcoal-light);
    text-transform: uppercase;
}

/* ===== EMPTY STATES ===== */
.empty-state {
    text-align: center;
    padding: var(--space-2xl) var(--space-lg);
    background: white;
    border-radius: var(--radius-xl);
    border: 3px dashed var(--sunshine);
}

.empty-state-icon {
    font-size: 5rem;
    margin-bottom: var(--space-md);
    animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-15px); }
}

.empty-state h3 {
    font-family: 'Fredoka One', cursive;
    color: var(--charcoal);
    margin-bottom: var(--space-sm);
}

.empty-state p {
    color: var(--charcoal-light);
    margin-bottom: var(--space-lg);
    font-weight: 600;
}

/* ===== LOADING STATE ===== */
.loading {
    text-align: center;
    padding: var(--space-xl);
    color: var(--charcoal-light);
    font-weight: 700;
    font-size: 1.1rem;
}

.loading::after {
    content: '🐾';
    display: inline-block;
    margin-left: 0.5rem;
    animation: loadWalk 1s steps(2) infinite;
}

@keyframes loadWalk {
    0% { transform: translateX(0) rotate(0); }
    50% { transform: translateX(10px) rotate(10deg); }
    100% { transform: translateX(0) rotate(0); }
}

/* ===== MODALS ===== */
.modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: var(--space-md);
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.modal-content {
    background: white;
    border-radius: var(--radius-xl);
    padding: var(--space-xl);
    max-width: 450px;
    width: 100%;
    box-shadow: var(--shadow-lg);
    animation: slideUp 0.4s var(--ease-bounce);
    border: 4px solid var(--sunshine);
    position: relative;
}

@keyframes slideUp {
    from { transform: translateY(50px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

.modal-content::before {
    content: '🎉';
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 2rem;
    background: white;
    padding: 0 10px;
    border-radius: var(--radius-full);
}

.modal-content h2 {
    font-family: 'Fredoka One', cursive;
    text-align: center;
    color: var(--charcoal);
    margin-bottom: var(--space-md);
}

.modal-content form {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
}

.modal-content input,
.modal-content select,
.modal-content textarea {
    padding: 1rem;
    border: 3px solid var(--cream-dark);
    border-radius: var(--radius-md);
    font-size: 1rem;
    font-family: 'Nunito', sans-serif;
    font-weight: 600;
    transition: var(--transition-fast);
}

.modal-content input:focus,
.modal-content select:focus,
.modal-content textarea:focus {
    outline: none;
    border-color: var(--sunshine);
    box-shadow: 0 0 0 4px var(--sunshine-light);
}

.modal-content button {
    width: 100%;
    margin-top: var(--space-sm);
}

/* Modal Header */
.modal-header {
    text-align: center;
    margin-bottom: var(--space-lg);
}

.modal-icon {
    font-size: 3rem;
    display: block;
    margin-bottom: var(--space-sm);
}

.modal-subtitle {
    color: var(--charcoal-light);
    font-size: 0.95rem;
    margin-top: var(--space-xs);
}

.modal-footer-text {
    text-align: center;
    margin-top: var(--space-md);
    color: var(--charcoal-light);
}

.modal-footer-text a {
    color: var(--coral);
    font-weight: 700;
}

/* Modal Variants */
.modal-content--upload,
.modal-content--post,
.modal-content--pet,
.modal-content--comments {
    max-width: 500px;
}

.modal-content--upload::before { content: '📷'; }
.modal-content--post::before { content: '🎊'; }
.modal-content--pet::before { content: '🐾'; }
.modal-content--comments::before { content: '💬'; }

/* File Upload Area */
.file-upload-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    border: 3px dashed var(--cream-dark);
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: var(--transition-fast);
    background: var(--cream);
    overflow: hidden;
}

.file-upload-area:hover {
    border-color: var(--sunshine);
    background: var(--sunshine-light);
}

.upload-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-lg);
}

.upload-icon {
    font-size: 3rem;
}

.upload-text {
    font-weight: 700;
    color: var(--charcoal);
}

.upload-hint {
    font-size: 0.85rem;
    color: var(--charcoal-light);
}

.photo-preview {
    max-width: 100%;
    max-height: 250px;
    object-fit: contain;
    border-radius: var(--radius-md);
}

/* Post Preview Card */
.post-preview-card {
    background: linear-gradient(135deg, var(--sunshine-light), var(--coral-light));
    padding: var(--space-md);
    border-radius: var(--radius-lg);
    margin-bottom: var(--space-md);
    border: 3px solid var(--sunshine);
}

.post-preview-pet {
    display: flex;
    align-items: center;
    gap: var(--space-md);
}

.pet-emoji {
    font-size: 2.5rem;
}

.years-badge {
    display: block;
    font-size: 0.85rem;
    color: var(--coral-dark);
    font-weight: 600;
    margin-top: var(--space-xs);
}

/* Anniversary Selector */
.anniversary-selector {
    display: flex;
    gap: var(--space-sm);
}

.anniversary-option {
    flex: 1;
    padding: var(--space-sm) var(--space-md);
    border: 3px solid var(--cream-dark);
    border-radius: var(--radius-md);
    background: white;
    font-weight: 700;
    cursor: pointer;
    transition: var(--transition-fast);
}

.anniversary-option:hover {
    border-color: var(--sunshine);
}

.anniversary-option.selected {
    background: var(--sunshine);
    border-color: var(--sunshine-dark);
    color: var(--charcoal);
}

/* Form Actions (multiple buttons) */
.form-actions {
    display: flex;
    gap: var(--space-sm);
    margin-top: var(--space-md);
}

.form-actions .btn {
    flex: 1;
}

/* Danger Button */
.btn-danger {
    background: linear-gradient(135deg, #ff6b6b, #ee5a5a);
    color: white;
    border: none;
}

.btn-danger:hover {
    background: linear-gradient(135deg, #ee5a5a, #dd4a4a);
    transform: translateY(-2px);
}

/* Checkbox Label */
.checkbox-label {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    cursor: pointer;
    font-weight: 600;
}

.checkbox-label input[type="checkbox"] {
    width: 24px;
    height: 24px;
    accent-color: var(--sunshine);
    cursor: pointer;
}

/* Form Row */
.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-md);
}

/* Comments List */
.comments-list {
    max-height: 300px;
    overflow-y: auto;
    margin-bottom: var(--space-md);
}

.comment {
    display: flex;
    gap: var(--space-sm);
    padding: var(--space-sm) 0;
    border-bottom: 1px solid var(--cream-dark);
}

.comment:last-child {
    border-bottom: none;
}

.comment-content {
    flex: 1;
}

.comment-author {
    font-weight: 700;
    color: var(--charcoal);
}

.comment-text {
    margin: var(--space-xs) 0;
}

.comment-date {
    font-size: 0.8rem;
    color: var(--charcoal-light);
}

.comment-form {
    display: flex;
    gap: var(--space-sm);
}

.comment-form input {
    flex: 1;
}

.comment-form .btn {
    width: auto;
}

.login-prompt {
    text-align: center;
    color: var(--charcoal-light);
    font-style: italic;
}

/* ===== CONFETTI ===== */
.confetti-container {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 9999;
    overflow: hidden;
}

.confetti {
    position: absolute;
    width: 12px;
    height: 12px;
    animation: confettiFall 4s linear forwards;
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

/* ===== HEART BURST ===== */
.heart-burst {
    position: absolute;
    font-size: 2rem;
    animation: heartBurst 1s ease-out forwards;
    pointer-events: none;
    z-index: 100;
}

@keyframes heartBurst {
    0% {
        transform: scale(0) translateY(0);
        opacity: 1;
    }
    50% {
        transform: scale(1.5) translateY(-20px);
        opacity: 1;
    }
    100% {
        transform: scale(1) translateY(-60px);
        opacity: 0;
    }
}

/* ===== SHARE BUTTONS ===== */
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
    border-radius: var(--radius-full);
    font-weight: 700;
    font-size: 0.9rem;
    cursor: pointer;
    border: none;
    transition: var(--transition-bounce);
    text-decoration: none;
}

.share-btn:hover {
    transform: translateY(-3px) scale(1.05);
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
    background: var(--mint);
    color: white;
}

/* ===== FOOTER ===== */
.footer {
    background: var(--charcoal);
    color: white;
    padding: var(--space-2xl) 0 var(--space-lg);
    margin-top: var(--space-2xl);
    position: relative;
}

.footer::before {
    content: '';
    position: absolute;
    top: -30px;
    left: 0;
    right: 0;
    height: 60px;
    background: url("data:image/svg+xml,%3Csvg viewBox='0 0 1200 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 60V30C200 60 400 0 600 30S1000 60 1200 30V60z' fill='%232D3436'/%3E%3C/svg%3E") no-repeat;
    background-size: cover;
}

.footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--space-xl);
    margin-bottom: var(--space-xl);
}

.footer-section h3,
.footer-section h4 {
    font-family: 'Fredoka One', cursive;
    margin-bottom: var(--space-sm);
    color: var(--sunshine);
}

.footer-section p {
    opacity: 0.8;
    line-height: 1.7;
}

.footer-bottom {
    text-align: center;
    padding-top: var(--space-lg);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    opacity: 0.7;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
    /* Mobile Navigation */
    .navbar .container {
        position: relative;
    }

    .nav-brand h1 {
        font-size: 1.25rem;
    }

    .logo {
        font-size: 1.75rem;
    }

    .nav-menu {
        display: none;
        position: absolute;
        top: calc(100% + 3px);
        left: 0;
        right: 0;
        background: var(--warm-white);
        flex-direction: column;
        padding: var(--space-md);
        box-shadow: var(--shadow-lg);
        gap: 0;
        border-bottom: 3px solid var(--sunshine);
        z-index: 1000;
    }

    .nav-menu.active {
        display: flex;
    }

    .nav-link {
        padding: var(--space-sm) var(--space-md);
        border-bottom: 1px solid var(--cream-dark);
        text-align: center;
    }

    .nav-link:last-child {
        border-bottom: none;
    }

    .nav-link::after {
        display: none;
    }

    .nav-actions {
        display: none;
    }

    .nav-actions-mobile {
        display: flex;
        flex-direction: column;
        gap: var(--space-sm);
        padding-top: var(--space-md);
        border-top: 2px dashed var(--sunshine);
        margin-top: var(--space-sm);
    }

    .nav-toggle {
        display: flex;
        z-index: 1001;
    }

    .nav-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(6px, 6px);
    }

    .nav-toggle.active span:nth-child(2) {
        opacity: 0;
    }

    .nav-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(6px, -6px);
    }

    /* Mobile Hero */
    .hero .container {
        grid-template-columns: 1fr;
        text-align: center;
        gap: var(--space-lg);
    }

    .hero-content {
        order: 1;
    }

    .hero-image {
        order: 2;
    }

    .hero-title {
        font-size: 2rem;
    }

    .hero-subtitle {
        max-width: none;
        font-size: 1rem;
    }

    .hero-actions {
        justify-content: center;
        flex-direction: column;
        align-items: center;
        gap: var(--space-sm);
    }

    .hero-actions .btn {
        width: 100%;
        max-width: 280px;
    }

    .polaroid-stack {
        transform: none;
    }

    .polaroid {
        max-width: 220px;
        margin: 0 auto;
    }

    .polaroid-back {
        display: none;
    }

    .celebration-icons .party-icon {
        font-size: 1.5rem;
    }

    .floating-paws {
        display: none;
    }

    /* Mobile Stats */
    .community-stats {
        padding: var(--space-md);
        grid-template-columns: repeat(2, 1fr);
        gap: var(--space-md);
    }

    .stat-item {
        padding: var(--space-sm);
    }

    .stat-icon {
        font-size: 1.5rem;
    }

    .stat-number {
        font-size: 1.75rem;
    }

    .stat-label {
        font-size: 0.75rem;
    }

    /* Mobile Feed */
    .feed-grid,
    .pet-grid {
        grid-template-columns: 1fr;
    }

    .section-header {
        flex-direction: column;
        text-align: center;
        gap: var(--space-sm);
    }

    .section-header-left {
        justify-content: center;
    }

    .section-title {
        font-size: 1.5rem;
    }

    /* Mobile Cards */
    .post-card,
    .pet-card {
        max-width: 100%;
    }

    .post-actions {
        justify-content: space-around;
    }

    /* Mobile Filter Tags */
    .filter-tags {
        justify-content: center;
    }

    /* Mobile Search */
    .search-bar {
        max-width: 100%;
    }

    /* Mobile Trending Banner */
    .celebration-banner {
        flex-direction: column;
        text-align: center;
        gap: var(--space-sm);
        padding: var(--space-md);
    }

    .celebration-banner::before,
    .celebration-banner::after {
        display: none;
    }

    /* Mobile Upcoming */
    .upcoming-grid {
        grid-template-columns: 1fr;
    }

    /* Mobile Footer */
    .footer-content {
        flex-direction: column;
        text-align: center;
        gap: var(--space-lg);
    }

    .footer-links {
        flex-direction: column;
        gap: var(--space-lg);
    }
}

/* ===== UTILITY CLASSES ===== */
.text-center { text-align: center; }
.mt-1 { margin-top: 0.5rem; }
.mt-2 { margin-top: 1rem; }
.mt-3 { margin-top: 1.5rem; }
.mb-1 { margin-bottom: 0.5rem; }
.mb-2 { margin-bottom: 1rem; }
.mb-3 { margin-bottom: 1.5rem; }
.hidden { display: none !important; }

/* Profile Card */
.profile-card {
    background: white;
    border-radius: var(--radius-xl);
    padding: var(--space-xl);
    text-align: center;
    box-shadow: var(--shadow-md);
    border: 3px solid var(--sunshine);
}

.profile-avatar {
    width: 100px;
    height: 100px;
    border-radius: var(--radius-full);
    background: linear-gradient(135deg, var(--coral-light) 0%, var(--sunshine-light) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    font-weight: 800;
    color: var(--coral);
    margin: 0 auto var(--space-md);
    border: 4px solid var(--sunshine);
}

.profile-card h3 {
    font-family: 'Fredoka One', cursive;
    margin-bottom: 0.5rem;
}

.profile-card .bio {
    color: var(--charcoal-light);
    font-weight: 600;
}

.profile-badges {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
    margin-top: var(--space-md);
}
`;

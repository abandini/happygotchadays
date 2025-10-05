export const css = `/* HappyGotchaDays - Main Stylesheet */

/* Reset & Base */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --primary-color: #FF6B6B;
    --secondary-color: #4ECDC4;
    --accent-color: #FFE66D;
    --text-dark: #2D3748;
    --text-light: #718096;
    --bg-light: #F7FAFC;
    --bg-white: #FFFFFF;
    --border-color: #E2E8F0;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.12);
    --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
    --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
    --radius: 12px;
    --transition: all 0.3s ease;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    color: var(--text-dark);
    background-color: var(--bg-light);
    line-height: 1.6;
    font-size: 16px;
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

/* Hero Section */
.hero {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
    color: white;
    padding: 4rem 0;
    margin-top: -1px;
}

.hero .container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: center;
}

.hero-title {
    font-size: 3rem;
    margin-bottom: 1rem;
    font-weight: 800;
}

.hero-subtitle {
    font-size: 1.3rem;
    margin-bottom: 2rem;
    opacity: 0.9;
}

.hero-actions {
    display: flex;
    gap: 1rem;
}

.pet-card-demo {
    background: white;
    border-radius: var(--radius);
    padding: 2rem;
    text-align: center;
    box-shadow: var(--shadow-lg);
    color: var(--text-dark);
}

.pet-photo-placeholder {
    font-size: 6rem;
    margin-bottom: 1rem;
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

/* Utility Classes */
.text-center { text-align: center; }
.mt-1 { margin-top: 0.5rem; }
.mt-2 { margin-top: 1rem; }
.mt-3 { margin-top: 1.5rem; }
.mb-1 { margin-bottom: 0.5rem; }
.mb-2 { margin-bottom: 1rem; }
.mb-3 { margin-bottom: 1.5rem; }
.hidden { display: none !important; }
`;

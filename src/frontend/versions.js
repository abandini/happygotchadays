// One place for versioned asset URLs, shared by the page shells and the service worker precache so they never drift.
// Bump a ?v= whenever that file's content changes (static assets are cached for days in browsers and the SW).
export const MAIN_CSS = '/styles/main.css?v=2';
export const THEME_CSS = '/styles/theme.css?v=5';
export const FONT_DISPLAY = '/fonts/young-serif-latin-400-normal.woff2';
export const FONT_BODY = '/fonts/figtree-latin-wght-normal.woff2';
export const HERO_IMG = '/img/adoption-day-bulldog-camp-pendleton-usmc.webp';

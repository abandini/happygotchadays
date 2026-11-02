// HappyGotchaDays theme, November 2026: "The adoption folder".
// Kraft paper and the adoption-day photo tucked in the folder: terracotta, sage, marigold and denim on warm paper,
// Young Serif headings (like a hand-lettered certificate) and Figtree for the app. Loaded after main.css, so it
// re-points main.css's color tokens rather than rewriting its components. Fonts are self-hosted (OFL notices at
// /fonts/OFL-*.txt). Photos: public-domain Marine Corps photographs, rights in docs/image-rights.md.
export const themeCss = `
@font-face{font-family:"Young Serif";font-style:normal;font-weight:400;font-display:swap;src:url(/fonts/young-serif-latin-400-normal.woff2) format("woff2")}
@font-face{font-family:"Figtree";font-style:normal;font-weight:300 900;font-display:swap;src:url(/fonts/figtree-latin-wght-normal.woff2) format("woff2")}
:root{
  --hg-display:"Young Serif",Georgia,serif; --hg-body:"Figtree",-apple-system,"Segoe UI",sans-serif;
  --hg-kraft:#efe3cf; --hg-paper:#fbf7ef; --hg-ink:#2b2724; --hg-ink2:#5e564f; --hg-line:#e2d3bb;
  --hg-terra:#a94a28; --hg-terra-dk:#843818; --hg-sage:#4f6a3e; --hg-sage-lt:#c9d6b8; --hg-marigold:#e0a82e; --hg-denim:#3c5a74;
  --coral:var(--hg-terra); --coral-dark:var(--hg-terra-dk); --coral-light:#e8c2ad;
  --sunshine:var(--hg-marigold); --sunshine-light:#f6e3b0; --mint:var(--hg-sage); --mint-light:var(--hg-sage-lt);
  --sky:var(--hg-denim); --lavender:#7d6a8c; --peach:#f3e2c4; --heart:var(--hg-terra);
  --cream:#f4ecdf; --cream-dark:#e6d8c2; --warm-white:var(--hg-paper);
  --charcoal:var(--hg-ink); --charcoal-light:var(--hg-ink2); --charcoal-lighter:#766b62;
  --shadow-sm:0 2px 8px rgba(43,39,36,.08); --shadow-md:0 6px 20px -8px rgba(43,39,36,.25); --shadow-lg:0 14px 36px -14px rgba(43,39,36,.35);
  --shadow-glow:none; --shadow-polaroid:0 12px 28px -12px rgba(43,39,36,.45);
}
body{background-color:var(--hg-kraft);color:var(--hg-ink);font-family:var(--hg-body);
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cg fill='%23e6d7bf'%3E%3Ccircle cx='20' cy='30' r='1.2'/%3E%3Ccircle cx='90' cy='70' r='1'/%3E%3Ccircle cx='140' cy='20' r='1.3'/%3E%3Ccircle cx='60' cy='130' r='1'/%3E%3Ccircle cx='120' cy='140' r='1.2'/%3E%3C/g%3E%3C/svg%3E")}
h1,h2,h3,h4,.section-title,.hero-title,.brand-name,.empty-title{font-family:var(--hg-display);font-weight:400;letter-spacing:-.005em;color:var(--hg-ink)}
a{color:var(--hg-terra)}a:hover{color:var(--hg-terra-dk)}
:focus-visible{outline:3px solid var(--hg-ink);outline-offset:3px}
.navbar :focus-visible,.footer :focus-visible{outline-color:var(--hg-marigold)}

/* retire the party decorations */
.floating-paws,.hero-confetti,.celebration-icons,.floating-hearts,.confetti,.confetti-container,.paw-pattern{display:none !important}

/* nav: a strip of folder tab */
.navbar{background:var(--hg-ink) !important;border-bottom:4px solid var(--hg-marigold);box-shadow:none}
.navbar .brand-name,.footer .brand-name{color:#fbf3e4 !important;-webkit-text-fill-color:#fbf3e4;background:none !important;font-size:1.4rem}
#what-is-gotcha-day .section-header{margin-bottom:12px}
.navbar .nav-brand a{color:inherit}
.navbar .nav-link{color:#e9dccb;font-weight:600}
.navbar .nav-link:hover,.navbar .nav-link.active{color:var(--hg-marigold);background:transparent}
.hg-tag{width:30px;height:30px;flex:none}
.nav-toggle span{background:#fbf3e4}
@media (max-width:768px){.nav-menu{background:var(--hg-ink) !important}}

/* buttons */
.btn{font-family:var(--hg-body);font-weight:700;border-radius:999px}
.btn-primary{background:var(--hg-terra) !important;color:#fff !important;border-color:var(--hg-terra) !important;box-shadow:none}
.btn-primary:hover{background:var(--hg-terra-dk) !important}
.btn-secondary{background:var(--hg-sage) !important;color:#fff !important;border-color:var(--hg-sage) !important}
.btn-secondary:hover{background:#3d5430 !important}
.btn-outline{background:transparent !important;color:var(--hg-ink) !important;border:2px solid var(--hg-ink) !important}
.btn-outline:hover{background:var(--hg-ink) !important;color:var(--hg-paper) !important}
.btn-accent{background:var(--hg-marigold) !important;color:var(--hg-ink) !important}
.navbar .btn-primary{background:var(--hg-marigold) !important;border-color:var(--hg-marigold) !important;color:var(--hg-ink) !important}
.navbar .btn-secondary{background:transparent !important;border:2px solid #e9dccb !important;color:#fbf3e4 !important}

/* hero: the folder with the adoption-day photo tucked in */
.hero.hg-hero{background:var(--hg-kraft);padding:clamp(28px,5vw,64px) 0 clamp(24px,4vw,48px);overflow:visible}
.hero.hg-hero::before,.hero.hg-hero::after{display:none}
.hg-hero-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.1fr);gap:clamp(24px,4vw,56px);align-items:center}
.hg-hero .hero-content{text-align:left}
.hg-kicker{display:inline-block;font:700 .8rem/1.3 var(--hg-body);letter-spacing:.14em;text-transform:uppercase;color:var(--hg-sage);border-bottom:2px solid var(--hg-marigold);padding-bottom:4px;margin:0 0 16px}
.hg-hero .hero-title{font-size:clamp(2.6rem,6vw,4.6rem);line-height:1.02;margin:0 0 16px;color:var(--hg-ink)}
.hg-hero .hero-title .gradient-text{background:none !important;-webkit-text-fill-color:currentColor;color:var(--hg-terra);display:block}
.hg-hero .hero-subtitle{font-size:1.18rem;line-height:1.6;color:var(--hg-ink2);max-width:32rem;margin:0 0 22px}
.hg-hero .hero-actions{justify-content:flex-start}
.hg-folder{position:relative;background:var(--hg-paper);padding:14px 14px 0;border-radius:6px 22px 6px 6px;box-shadow:var(--shadow-lg);transform:rotate(.6deg)}
.hg-folder::before{content:"";position:absolute;top:-14px;left:28px;width:120px;height:18px;background:var(--hg-marigold);border-radius:8px 8px 0 0}
.hg-folder img{display:block;width:100%;height:auto;border-radius:4px}
.hg-folder .hg-stamp{position:absolute;right:-10px;top:22px;transform:rotate(8deg);background:var(--hg-terra);color:#fff;font:400 .95rem/1 var(--hg-display);padding:9px 14px;border-radius:4px;box-shadow:0 6px 14px -6px rgba(0,0,0,.4)}
.hg-cap{font-size:.86rem;line-height:1.5;color:var(--hg-ink2);padding:10px 4px 14px;margin:0}
.hg-cap .story{display:block;color:var(--hg-ink);font-size:.98rem;margin-bottom:3px}
.hg-cap q{font-style:italic}.hg-cap a{color:var(--hg-ink2)}
@media (max-width:860px){.hg-hero-grid{grid-template-columns:1fr}.hg-folder{transform:none}.hg-folder .hg-stamp{right:8px}}
.hero.hg-hero .hg-hero-grid{text-align:left}
.hg-hero .hero-content{order:1;color:var(--hg-ink)}.hg-hero .hg-folder{order:2}
/* the other pages' heroes (About, FAQ...): a dark folder-tab band */
.hero:not(.hg-hero){background:var(--hg-ink) !important;border-bottom:5px solid var(--hg-marigold)}
.hero:not(.hg-hero)::before,.hero:not(.hg-hero)::after{display:none !important}
.hero:not(.hg-hero) .hero-content,.hero:not(.hg-hero) .hero-content p{color:#efe4d4}
.hero:not(.hg-hero) .hero-title{color:#fbf3e4}
.hero:not(.hg-hero) .hero-title .gradient-text{background:none !important;-webkit-text-fill-color:currentColor;color:var(--hg-marigold)}
.hero:not(.hg-hero) a{color:var(--hg-marigold)}
.hero:not(.hg-hero) :focus-visible{outline-color:var(--hg-marigold)}

/* adoption day strip */
.hg-strip{padding:clamp(28px,5vw,56px) 0;background:var(--hg-paper);border-top:1px solid var(--hg-line);border-bottom:1px solid var(--hg-line)}
.hg-strip .section-title{font-size:clamp(1.7rem,3.4vw,2.4rem);margin:0 0 6px}
.hg-strip .hg-intro{color:var(--hg-ink2);max-width:44rem;margin:0 0 22px}
.hg-shots{display:grid;gap:22px;grid-template-columns:repeat(auto-fit,minmax(min(260px,100%),1fr));align-items:start}
.hg-shot{margin:0;background:#fff;padding:10px 10px 0;border-radius:4px;box-shadow:var(--shadow-md)}
.hg-shot:nth-child(1){transform:rotate(-.8deg)}.hg-shot:nth-child(3){transform:rotate(.8deg)}
.hg-shot img{display:block;width:100%;height:auto;aspect-ratio:3/2;object-fit:cover}
@media (max-width:640px){.hg-shot{transform:none !important}}

/* sections, cards, banner */
.section-title{color:var(--hg-ink)}
.section-icon{display:none}
.discover-section,.feed-section,.upcoming-section{background:transparent}
#what-is-gotcha-day{background:var(--hg-paper) !important}
#what-is-gotcha-day p{text-align:left !important}
.celebration-banner{background:var(--hg-ink);color:#fbf3e4;border-radius:14px;box-shadow:none}
.banner-icon{display:none}
.trending-badge{background:var(--hg-sage-lt);color:var(--hg-ink)}
.trending-pulse{background:var(--hg-sage)}
.pet-card,.post-card,.upcoming-card,.empty-state,.profile-card,.modal-content{background:var(--hg-paper);border:1px solid var(--hg-line);box-shadow:var(--shadow-md)}
.empty-icon,.empty-icon-large{filter:grayscale(.3)}
.filter-tag{background:var(--hg-paper);border:2px solid var(--hg-line);color:var(--hg-ink)}
.filter-tag--active,.filter-tag:hover{background:var(--hg-ink);border-color:var(--hg-ink);color:var(--hg-paper)}
.search-bar{background:var(--hg-paper);border:2px solid var(--hg-line);box-shadow:none}
.footer{background:var(--hg-ink) !important;color:#e9dccb;border-top:5px solid var(--hg-marigold)}
.footer a{color:#fbf3e4}.footer h3,.footer h4{color:#fbf3e4}
.footer-tagline,.footer-bottom p{color:#cdbfae}

.btn:focus-visible,a:focus-visible,input:focus-visible,button:focus-visible,select:focus-visible,textarea:focus-visible{outline:3px solid var(--hg-ink) !important;outline-offset:3px !important}
.navbar .btn:focus-visible,.navbar a:focus-visible,.navbar button:focus-visible,.footer a:focus-visible,.hero:not(.hg-hero) a:focus-visible,.celebration-banner .btn:focus-visible{outline-color:var(--hg-marigold) !important}
@media (max-width:480px){.navbar .brand-name{font-size:1.15rem}.hg-tag{width:24px;height:24px}}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation:none !important;transition:none !important;scroll-behavior:auto !important}}
`;

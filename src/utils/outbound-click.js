// Outbound-click tracking, same event and parameters as the domain-hub Worker sites (OUTBOUND_CLICK_JS in
// domain-hub src/worker.js), so the cross-site link report counts clicks from here. GA4's enhanced-measurement
// click never showed up in this property, so the page sends its own "outbound_click": link_domain and link_url
// (origin + path only, no query or fragment, max 100 chars). Links within the same registrable domain
// (happygotchadays.com, www) are internal and send nothing. Installs once per page; it only calls the page's
// gtag(), so it loads nothing and follows whatever consent state gtag already has.
export const OUTBOUND_CLICK_JS = `<script>if(!window.__hgOC){window.__hgOC=1;document.addEventListener("click",function(e){var a=e.target&&e.target.closest&&e.target.closest("a[href]");if(!a||!window.gtag)return;var u;try{u=new URL(a.href,location.href)}catch(x){return}var b=function(h){return h.replace(/^www\\./,"").split(".").slice(-2).join(".")};if(!/^https?:$/.test(u.protocol)||b(u.hostname)===b(location.hostname))return;gtag("event","outbound_click",{link_domain:u.hostname,link_url:(u.origin+u.pathname).slice(0,100),outbound:true,transport_type:"beacon"})},true)}</script>`;

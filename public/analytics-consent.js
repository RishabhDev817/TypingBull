/*
 * TypingBull analytics consent.
 * Google Analytics loads only after the visitor clicks "Allow". Classroom pages (used by students)
 * never load or send analytics. Until consent, gtag() calls are queued with consent "denied".
 */
(function () {
  var GA_ID = 'G-PEB27YTSN1';
  var KEY = 'tb_analytics_consent'; // 'granted' | 'denied'
  var loaded = false;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });

  function getChoice() {
    try { return localStorage.getItem(KEY); } catch { return null; }
  }
  function setChoice(v) {
    try { localStorage.setItem(KEY, v); } catch { /* storage blocked: the choice lasts for this page only */ }
  }
  // Matches /classroom and locale-prefixed paths such as /hi/classroom/join
  function isClassroom() {
    return /^\/(?:[a-z]{2}(?:-[a-z]{2})?\/)?classroom(?:\/|$)/i.test(location.pathname);
  }

  function loadGa() {
    if (loaded) return;
    loaded = true;
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  // Single-page navigation: stop sending analytics on classroom pages even if GA is already loaded.
  function onRoute() {
    if (isClassroom()) {
      if (loaded) window.gtag('consent', 'update', { analytics_storage: 'denied' });
      hideBanner();
      return;
    }
    if (getChoice() === 'granted') {
      if (loaded) window.gtag('consent', 'update', { analytics_storage: 'granted' });
      else loadGa();
    } else if (!getChoice()) {
      showBanner();
    }
  }
  ['pushState', 'replaceState'].forEach(function (m) {
    var orig = history[m];
    history[m] = function () { var r = orig.apply(this, arguments); setTimeout(onRoute, 0); return r; };
  });
  window.addEventListener('popstate', onRoute);

  var banner = null;
  function hideBanner() { if (banner) { banner.remove(); banner = null; } }
  function showBanner() {
    if (banner || !document.body) return;
    banner = document.createElement('div');
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Analytics consent');
    // Below 1024px the site shows a 64px bottom tab bar; sit above it so it stays usable.
    var lift = window.innerWidth < 1024 ? 76 : 12;
    banner.style.cssText = 'position:fixed;left:12px;right:12px;bottom:calc(' + lift + 'px + env(safe-area-inset-bottom,0px));z-index:2147483000;max-width:560px;margin:0 auto;padding:14px 16px;border-radius:14px;background:#111827;color:#f3f4f6;border:1px solid rgba(255,255,255,.14);box-shadow:0 12px 32px rgba(0,0,0,.45);font:14px/1.45 system-ui,-apple-system,"Segoe UI",sans-serif;display:flex;flex-wrap:wrap;align-items:center;gap:10px 12px;';
    var text = document.createElement('p');
    text.style.cssText = 'margin:0;flex:1 1 260px;';
    text.innerHTML = 'Can we use Google Analytics to see which pages help learners most? No ads, and never on classroom pages. <a href="/privacy/" style="color:#93c5fd;">Privacy</a>';
    var btns = document.createElement('div');
    btns.style.cssText = 'display:flex;gap:8px;';
    function btn(label, primary, choice) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = label;
      b.style.cssText = 'cursor:pointer;border-radius:10px;padding:8px 14px;font:600 14px system-ui,-apple-system,sans-serif;' +
        (primary ? 'background:#f59e0b;color:#111827;border:0;' : 'background:transparent;color:#f3f4f6;border:1px solid rgba(255,255,255,.3);');
      b.addEventListener('click', function () {
        setChoice(choice);
        hideBanner();
        if (choice === 'granted' && !isClassroom()) loadGa();
      });
      return b;
    }
    btns.appendChild(btn('No thanks', false, 'denied'));
    btns.appendChild(btn('Allow', true, 'granted'));
    banner.appendChild(text);
    banner.appendChild(btns);
    document.body.appendChild(banner);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onRoute);
  else onRoute();
})();

/**
 * Post-build SEO step: bakes per-route metadata into static HTML and writes the sitemap.
 *
 * The app is a client-rendered SPA, so without this every URL would ship the home page's
 * <head>. Crawlers that do not execute JavaScript (and every link-preview bot) would then
 * see the wrong title, description, canonical and Open Graph data on every page.
 *
 * What it writes into dist/:
 *   /index.html, /<lang>/index.html       home page in all 9 languages (localized meta + FAQ schema)
 *   /learn/ /play/ /practice/ ...         one HTML file per indexable route
 *   /404.html                             noindex page, served with a real 404 status by Cloudflare Pages
 *   /sitemap.xml                          all indexable URLs, with hreflang clusters for the home page
 *
 * Metadata comes from the same modules the app uses (src/seo/routeMeta.ts, usePageSEO.ts,
 * faqData.ts) so the static and client-side values cannot drift apart.
 */
import { createServer } from 'vite';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const ORIGIN = 'https://typingbull.com';
const LOCALES = ['en', 'es', 'fr', 'de', 'pt', 'it', 'ja', 'ko', 'hi'];
const OG_LOCALE = { en: 'en_US', es: 'es_ES', fr: 'fr_FR', de: 'de_DE', pt: 'pt_BR', it: 'it_IT', ja: 'ja_JP', ko: 'ko_KR', hi: 'hi_IN' };

if (!existsSync(resolve(dist, 'index.html'))) {
  console.error('prerender-seo: dist/index.html not found. Run `vite build` first.');
  process.exit(1);
}

const vite = await createServer({
  root,
  logLevel: 'error',
  appType: 'custom',
  server: { middlewareMode: true, hmr: false, ws: false },
});

try {
  const { ROUTE_META } = await vite.ssrLoadModule('/src/seo/routeMeta.ts');
  const { SEO_DATA_BY_LANG } = await vite.ssrLoadModule('/src/hooks/usePageSEO.ts');
  const { getLocalizedFaqData } = await vite.ssrLoadModule('/src/i18n/faqData.ts');
  const { CLASSROOM_LANDING_A } = await vite.ssrLoadModule('/src/i18n/classroomLandingAI18n.ts');
  const { TYPING_TEST_FAQ, AVERAGE_SPEED_FAQ } = await vite.ssrLoadModule('/src/seo/pageFaqs.ts');

  const template = readFileSync(resolve(dist, 'index.html'), 'utf8');
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const url = (lang, path) => `${ORIGIN}${lang === 'en' ? '' : `/${lang}`}${path}`;

  const setMeta = (html, attr, name, value) => {
    const re = new RegExp(`(<meta ${attr}="${name}" content=")[^"]*(")`);
    if (!re.test(html)) throw new Error(`template is missing <meta ${attr}="${name}">`);
    return html.replace(re, `$1${esc(value)}$2`);
  };

  const stripAlternates = (html) =>
    html.replace(/[ \t]*<link rel="alternate" hreflang="[^"]*" href="[^"]*" \/>\n/g, '')
        .replace(/[ \t]*<meta property="og:locale:alternate" content="[^"]*" \/>\n/g, '');

  const jsonLd = (obj, id) =>
    `<script type="application/ld+json"${id ? ` id="${id}"` : ''}>\n${JSON.stringify(obj, null, 2).replace(/</g, '\\u003c')}\n    </script>`;

  const removeJsonLd = (html, test) =>
    html.replace(/[ \t]*<script type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>\n?/g, (m) => (test(m) ? '' : m));

  /** Builds one static page from the shared template. */
  function render({ lang, path, title, description, ogTitle, ogDescription, h1, intro, links, home, noindex, extraJsonLd = [] }) {
    const canonical = noindex ? null : url(lang, path);
    let html = template;
    html = html.replace(/<html lang="[^"]*"/, `<html lang="${lang}"`);
    html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
    html = setMeta(html, 'name', 'description', description);
    html = setMeta(html, 'property', 'og:title', ogTitle || title);
    html = setMeta(html, 'property', 'og:description', ogDescription || description);
    html = setMeta(html, 'property', 'og:locale', OG_LOCALE[lang]);
    html = setMeta(html, 'name', 'twitter:title', ogTitle || title);
    html = setMeta(html, 'name', 'twitter:description', ogDescription || description);
    if (noindex) html = setMeta(html, 'name', 'robots', 'noindex, nofollow');

    html = stripAlternates(html);
    html = html.replace(/[ \t]*<!-- Hreflang SEO Alternates[^>]*-->\n/, '');
    if (canonical) {
      html = html.replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${canonical}" />`);
      html = setMeta(html, 'property', 'og:url', canonical);
      // hreflang: the home page exists in every language; sub-pages only in English here.
      const alts = home
        ? [['x-default', url('en', path)], ...LOCALES.map((l) => [l, url(l, path)])]
        : [['x-default', canonical], ['en', canonical]];
      const altHtml = alts.map(([h, href]) => `    <link rel="alternate" hreflang="${h}" href="${href}" />`).join('\n');
      html = html.replace(/(<link rel="canonical"[^>]*\/>\n)/, `$1${altHtml}\n`);
    } else {
      html = html.replace(/[ \t]*<link rel="canonical"[^>]*\/>\n/, '');
      html = html.replace(/[ \t]*<meta property="og:url"[^>]*\/>\n/, '');
    }
    if (home) {
      // locale alternates for Open Graph
      const alt = LOCALES.filter((l) => l !== lang).map((l) => `    <meta property="og:locale:alternate" content="${OG_LOCALE[l]}" />`).join('\n');
      html = html.replace(/(<meta property="og:locale" content="[^"]*" \/>\n)/, `$1${alt}\n`);
    }

    // Structured data: the template carries the home-page set. Keep what applies.
    if (home) {
      const faq = getLocalizedFaqData(lang).map((i) => ({
        '@type': 'Question', name: i.question, acceptedAnswer: { '@type': 'Answer', text: i.answer },
      }));
      html = html.replace(
        /<script type="application\/ld\+json" id="faq-schema-jsonld">[\s\S]*?<\/script>/,
        jsonLd({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq }, 'faq-schema-jsonld'),
      );
      html = html.replace(/("description": ")[^"]*(")/, `$1${esc(description).replace(/&quot;/g, '\\"')}$2`);
      html = html.replace(/("url": "https:\/\/typingbull.com\/",\n\s+"applicationCategory")/, `"url": "${canonical}",\n      "applicationCategory"`);
    } else {
      html = removeJsonLd(html, (m) => /FAQPage|WebApplication/.test(m));
    }
    for (const obj of extraJsonLd) {
      html = html.replace('</head>', `    ${jsonLd(obj)}\n  </head>`);
    }

    // Crawlable fallback content inside #root (React replaces it on mount).
    const linkHtml = links.map(([href, label]) => `<li><a href="${href}">${esc(label)}</a></li>`).join('');
    const body = `<div id="root">
      <noscript>
        <h1>${esc(h1)}</h1>
        <p>${esc(intro)}</p>
        <nav aria-label="TypingBull"><ul>${linkHtml}</ul></nav>
      </noscript>
    </div>`;
    html = html.replace('<div id="root"></div>', body);
    return html;
  }

  const write = (relPath, html) => {
    const file = resolve(dist, relPath);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, html);
  };

  const navLinks = (lang) => [
    [url(lang, '/learn/'), 'Learn touch typing'],
    [url(lang, '/typing-test/'), 'Free typing test'],
    [url(lang, '/average-typing-speed/'), 'Average typing speed'],
    [url(lang, '/practice/'), 'Typing speed practice'],
    [url(lang, '/play/'), 'Typing games'],
    [url(lang, '/practice-ground/'), 'Multiplayer typing races'],
    [url(lang, '/classroom/'), 'Classroom mode for teachers'],
    [url(lang, '/guidelines/'), 'Touch typing guide'],
  ];

  // ---- Home page, one per language ----
  for (const lang of LOCALES) {
    const seo = SEO_DATA_BY_LANG[lang];
    write(lang === 'en' ? 'index.html' : `${lang}/index.html`, render({
      lang, path: '/', title: seo.title, description: seo.description,
      ogTitle: seo.ogTitle, ogDescription: seo.ogDescription,
      h1: seo.ogTitle, intro: seo.description, links: navLinks(lang), home: true,
    }));
  }

  // ---- Sub-pages (English) ----
  const crumbs = (name, path) => ({
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'TypingBull', item: `${ORIGIN}/` },
      { '@type': 'ListItem', position: 2, name, item: `${ORIGIN}${path}` },
    ],
  });
  const faqSchema = (items) => ({
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: items.map((i) => ({ '@type': 'Question', name: i.question, acceptedAnswer: { '@type': 'Answer', text: i.answer } })),
  });
  const classroom = CLASSROOM_LANDING_A.en;
  const pages = [
    { ...ROUTE_META.learn, crumb: 'Learn' },
    { ...ROUTE_META.play, crumb: 'Games' },
    { ...ROUTE_META.practiceGround, crumb: 'Practice Ground' },
    { ...ROUTE_META.practice, crumb: 'Practice' },
    { ...ROUTE_META.guidelines, crumb: 'Guidelines' },
    { ...ROUTE_META.typingTest, crumb: 'Typing test', faq: TYPING_TEST_FAQ },
    { ...ROUTE_META.averageTypingSpeed, crumb: 'Average typing speed', faq: AVERAGE_SPEED_FAQ },
    { path: '/classroom/', title: classroom.seoTitle, description: classroom.seoDesc, h1: classroom.seoTitle, intro: classroom.seoDesc, crumb: 'Classroom' },
  ];
  for (const p of pages) {
    write(`${p.path.slice(1)}index.html`, render({
      lang: 'en', path: p.path, title: p.title, description: p.description,
      h1: p.h1, intro: p.intro, links: navLinks('en'),
      extraJsonLd: [crumbs(p.crumb, p.path), ...(p.faq ? [faqSchema(p.faq)] : [])],
    }));
  }

  // ---- 404 (Cloudflare Pages serves this with a real 404 status) ----
  write('404.html', render({
    lang: 'en', path: '/404', noindex: true,
    title: '404: Page Not Found | TypingBull',
    description: "The page you're looking for doesn't exist or has moved.",
    h1: 'Page not found', intro: 'That page does not exist or has moved. Try one of these instead.',
    links: navLinks('en'),
  }));

  // ---- Sitemap ----
  const lastmodFor = (...files) => {
    try {
      const out = execSync(`git log -1 --format=%cs -- ${files.join(' ')}`, { cwd: root }).toString().trim();
      return out || new Date().toISOString().slice(0, 10);
    } catch { return new Date().toISOString().slice(0, 10); }
  };
  const entries = [];
  const homeMod = lastmodFor('src/pages/DashboardPage.tsx', 'src/hooks/usePageSEO.ts', 'index.html');
  for (const lang of LOCALES) {
    const alts = [['x-default', url('en', '/')], ...LOCALES.map((l) => [l, url(l, '/')])]
      .map(([h, href]) => `    <xhtml:link rel="alternate" hreflang="${h}" href="${href}"/>`).join('\n');
    entries.push(`  <url>\n    <loc>${url(lang, '/')}</loc>\n    <lastmod>${homeMod}</lastmod>\n${alts}\n  </url>`);
  }
  const sitePages = [
    ['/practice-ground/', 'src/pages/PlayPage.tsx'], ['/play/', 'src/pages/PlayPage.tsx'],
    ['/typing-test/', 'src/pages/TypingTestPage.tsx src/components/TypingTest.tsx'],
    ['/average-typing-speed/', 'src/pages/AverageTypingSpeedPage.tsx src/seo/typingStats.ts'],
    ['/learn/', 'src/pages/LearnPage.tsx'], ['/practice/', 'src/pages/PracticePage.tsx'],
    ['/classroom/', 'src/pages/ClassroomPage.tsx src/pages/ClassroomLandingPage.tsx'],
    ['/guidelines/', 'src/pages/GuidelinesPage.tsx'], ['/about/', 'about/index.html src/pages/AboutPage.tsx'],
    ['/contact/', 'contact/index.html src/pages/ContactPage.tsx'], ['/privacy/', 'privacy/index.html src/pages/PrivacyPage.tsx'],
    ['/terms/', 'terms/index.html src/pages/TermsPage.tsx'],
  ];
  for (const [path, files] of sitePages) {
    entries.push(`  <url>\n    <loc>${ORIGIN}${path}</loc>\n    <lastmod>${lastmodFor(...files.split(' '))}</lastmod>\n  </url>`);
  }
  write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`);

  console.log(`prerender-seo: wrote ${LOCALES.length} home pages, ${pages.length} route pages, 404.html and sitemap.xml (${entries.length} URLs)`);
} finally {
  await vite.close();
}

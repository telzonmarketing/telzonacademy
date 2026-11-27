// Keeps <head> clean once React has rendered.
// Prerendered HTML ships its own canonical, meta tags and JSON-LD so crawlers
// that don't run JavaScript see them. React Helmet then adds the same tags
// again, which left two canonicals, two descriptions and duplicate Course /
// Breadcrumb / FAQ schema in the rendered page Google indexes. Whenever Helmet
// has set a tag, the static copy of that tag is removed. Nothing is removed
// when Helmet hasn't set an equivalent.
const KEYS = [
  ['link[rel="canonical"]', () => 'canonical'],
  ['meta[name="description"]', () => 'description'],
  ['meta[name="robots"]', () => 'robots'],
  ['meta[property^="og:"]', (el) => el.getAttribute('property')],
  ['meta[name^="twitter:"]', (el) => el.getAttribute('name')],
];
const isHelmet = (el) => el.hasAttribute('data-react-helmet');
const ldType = (el) => {
  try { const o = JSON.parse(el.textContent); return [].concat(o['@type'] || []).join(','); } catch { return ''; }
};

function dedupe() {
  const head = document.head;
  for (const [sel, keyOf] of KEYS) {
    const els = [...head.querySelectorAll(sel)];
    const helmetKeys = new Set(els.filter(isHelmet).map(keyOf));
    els.forEach((el) => { if (!isHelmet(el) && helmetKeys.has(keyOf(el))) el.remove(); });
  }
  const lds = [...document.querySelectorAll('script[type="application/ld+json"]')];
  const helmetTypes = new Set(lds.filter(isHelmet).map(ldType));
  const notHome = location.pathname !== '/';
  lds.forEach((el) => {
    if (isHelmet(el)) return;
    const t = ldType(el);
    if (helmetTypes.has(t)) { el.remove(); return; }
    // The site-wide BreadcrumbList in index.html only lists "Home" — wrong on inner pages.
    if (notHome && t === 'BreadcrumbList') {
      try { if (JSON.parse(el.textContent).itemListElement.length < 2) el.remove(); } catch { /* keep */ }
    }
  });
}

export function startHeadDedupe() {
  if (typeof window === 'undefined' || !window.MutationObserver) return;
  let t;
  const run = () => { clearTimeout(t); t = setTimeout(dedupe, 50); };
  new MutationObserver(run).observe(document.head, { childList: true, subtree: true });
  run();
}

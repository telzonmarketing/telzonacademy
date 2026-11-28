// Analytics events through the site's existing Google tag (gtag, GA4
// G-R1JR4H02F1 / GT-5DHFK99D). Safe no-op when the tag is blocked or missing.
export function track(event, params = {}) {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', event, { event_category: 'Career Intelligence', ...params });
    }
  } catch { /* never break the page for analytics */ }
}

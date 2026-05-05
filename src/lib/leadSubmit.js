// Centralized lead submission helper.
// Captures UTM + Meta click IDs, calls the submit-lead Edge Function (which
// persists to Supabase + fires Meta CAPI + emails admin), and also fires a
// client-side Pixel "Lead" event when fbq is available.
//
// Usage:
//   import { submitLead } from '@/lib/leadSubmit';
//   const { ok, error } = await submitLead({
//     full_name, email, phone, message,
//     source: 'homepage-contact',
//   });

import { supabase } from '@/lib/customSupabaseClient';

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://lcnfnwivodzjjpykihfn.supabase.co';
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjbmZud2l2b2R6ampweWtpaGZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4MTUxNDYsImV4cCI6MjA4MTM5MTE0Nn0.8tcOMzqCHKcfB82rUcTCjeFq0X8-3p2urQL0GQ778dE';

const SUBMIT_LEAD_URL = `${SUPABASE_URL}/functions/v1/submit-lead`;

function readCookie(name) {
  if (typeof document === 'undefined') return null;
  const m = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/[.$?*|{}()[\]\\/+^]/g, '\\$&') + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : null;
}

export function getMarketingAttribution() {
  if (typeof window === 'undefined') return {};
  const url = new URL(window.location.href);
  const q = url.searchParams;
  const stored = (() => {
    try {
      return JSON.parse(window.sessionStorage.getItem('telzon_attribution') || '{}');
    } catch {
      return {};
    }
  })();

  const live = {
    page_url: window.location.href,
    utm_source: q.get('utm_source') || stored.utm_source || undefined,
    utm_medium: q.get('utm_medium') || stored.utm_medium || undefined,
    utm_campaign: q.get('utm_campaign') || stored.utm_campaign || undefined,
    utm_term: q.get('utm_term') || stored.utm_term || undefined,
    utm_content: q.get('utm_content') || stored.utm_content || undefined,
    fbclid: q.get('fbclid') || stored.fbclid || undefined,
    fbp: readCookie('_fbp') || undefined,
    fbc: readCookie('_fbc') || undefined,
  };

  // Persist whatever we have for later submissions in the same session
  try {
    window.sessionStorage.setItem('telzon_attribution', JSON.stringify(live));
  } catch {
    /* noop */
  }
  return live;
}

export function firePixelLead(value) {
  if (typeof window === 'undefined') return;
  try {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Lead', value ? { value, currency: 'INR' } : undefined);
      window.fbq('track', 'CompleteRegistration', { value: 500, currency: 'INR', status: 'submitted' });
    }
  } catch {
    /* noop */
  }
}

// Fires when user visits a course/landing page
export function firePixelViewContent({ content_name = 'Digital Marketing Course', content_category = 'Education' } = {}) {
  if (typeof window === 'undefined') return;
  try {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'ViewContent', { content_name, content_category, currency: 'INR' });
    }
  } catch { /* noop */ }
}

// Fires when user clicks "Book Free Demo" / "Register" button
export function firePixelSchedule() {
  if (typeof window === 'undefined') return;
  try {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Schedule');
    }
  } catch { /* noop */ }
}

export function fireGtagLead({ source = 'website' } = {}) {
  if (typeof window === 'undefined') return;
  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'generate_lead', {
        event_category: 'Lead Form',
        event_label: source,
        currency: 'INR',
      });
    }
  } catch {
    /* noop */
  }
}

/**
 * Submit a lead.
 * @param {{full_name:string,email?:string,phone?:string,message?:string,source?:string,extra?:object}} payload
 * @returns {Promise<{ok:boolean, id?:string, error?:string, capi?:string, email?:string}>}
 */
export async function submitLead(payload) {
  const attribution = getMarketingAttribution();
  const body = {
    source: 'website',
    ...payload,
    ...attribution,
  };

  // Try Edge Function first (handles DB insert + CAPI + email)
  try {
    const res = await fetch(SUBMIT_LEAD_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data?.ok) {
      firePixelLead();
      fireGtagLead({ source: body.source });
      return { ok: true, id: data.id, capi: data.capi, email: data.email };
    }
    // Edge Function reachable but errored — fall through to direct insert
    if (data?.error) {
      // eslint-disable-next-line no-console
      console.warn('submit-lead edge function returned error, falling back:', data.error);
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('submit-lead edge function unreachable, falling back to direct insert:', e?.message);
  }

  // Fallback: direct insert via Supabase (will not fire CAPI or email)
  const { data, error } = await supabase
    .from('leads')
    .insert({
      full_name: body.full_name,
      email: body.email ?? null,
      phone: body.phone ?? null,
      message: body.message ?? null,
      source: body.source ?? 'website',
      page_url: body.page_url ?? null,
      utm_source: body.utm_source ?? null,
      utm_medium: body.utm_medium ?? null,
      utm_campaign: body.utm_campaign ?? null,
      utm_term: body.utm_term ?? null,
      utm_content: body.utm_content ?? null,
      fbclid: body.fbclid ?? null,
      fbp: body.fbp ?? null,
      fbc: body.fbc ?? null,
    })
    .select()
    .single();

  if (error) {
    return { ok: false, error: error.message };
  }
  firePixelLead();
  fireGtagLead({ source: body.source });
  return { ok: true, id: data?.id };
}

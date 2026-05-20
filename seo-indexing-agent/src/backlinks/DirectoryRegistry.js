'use strict';

/**
 * DirectoryRegistry — 24 curated directories. tier 1 = critical local SEO,
 * tier 2 = high-value education/business, tier 3 = nice-to-have citations.
 */

const DIRECTORIES = [
  // ── Tier 1: critical local SEO ──
  { key: 'googlebusiness', name: 'Google Business Profile', submissionUrl: 'https://business.google.com/create', tier: 1, region: 'global', free: true,
    notes: 'Biggest local SEO ranking factor. Postcard verification required.' },
  { key: 'bing', name: 'Bing Places for Business', submissionUrl: 'https://www.bingplaces.com/Manage', tier: 1, region: 'global', free: true,
    notes: 'Imports from Google Business. Phone verification.' },
  { key: 'applemaps', name: 'Apple Maps Connect', submissionUrl: 'https://mapsconnect.apple.com/', tier: 1, region: 'global', free: true,
    notes: 'Required for Apple Maps + Siri. Manual phone verification.' },
  { key: 'justdial', name: 'JustDial', submissionUrl: 'https://www.justdial.com/Free-Listing', tier: 1, region: 'india', free: true,
    notes: 'India\'s #1 local directory. Free basic listing, phone verification.' },
  { key: 'sulekha', name: 'Sulekha', submissionUrl: 'https://www.sulekha.com/sml/business-listing', tier: 1, region: 'india', free: true,
    notes: 'Good for education category. Free listing.' },

  // ── Tier 2: education-specific ──
  { key: 'urbanpro', name: 'UrbanPro', submissionUrl: 'https://www.urbanpro.com/tutors-and-institutes-signup', tier: 2, region: 'india', free: true,
    notes: 'Education-focused. Free tutor profile + paid lead system.' },
  { key: 'justlearn', name: 'Justlearn', submissionUrl: 'https://www.justlearn.com/teach', tier: 2, region: 'global', free: true,
    notes: 'International skill teacher marketplace.' },
  { key: 'classcentral', name: 'Class Central', submissionUrl: 'https://www.classcentral.com/list-on-class-central', tier: 2, region: 'global', free: true,
    notes: 'Online course aggregator with high domain authority.' },
  { key: 'shiksha', name: 'Shiksha', submissionUrl: 'https://www.shiksha.com/listing', tier: 2, region: 'india', free: true,
    notes: 'Naukri-owned education portal. Major India traffic.' },
  { key: 'collegedunia', name: 'CollegeDunia', submissionUrl: 'https://collegedunia.com/list-your-institution', tier: 2, region: 'india', free: true,
    notes: 'College/institute directory.' },

  // ── Tier 2: business directories ──
  { key: 'indiamart', name: 'IndiaMart', submissionUrl: 'https://my.indiamart.com/registration/?supplier_form=1', tier: 2, region: 'india', free: true,
    notes: 'B2B-focused. Business profile + DoFollow backlink.' },
  { key: 'tradeindia', name: 'TradeIndia', submissionUrl: 'https://www.tradeindia.com/registration.html', tier: 2, region: 'india', free: true,
    notes: 'B2B directory with strong SEO authority.' },
  { key: 'exportersindia', name: 'ExportersIndia', submissionUrl: 'https://www.exportersindia.com/business/free-registration.htm', tier: 2, region: 'india', free: true,
    notes: 'Less crowded — easier to rank in their search.' },
  { key: 'businesszone', name: 'BusinessZone India', submissionUrl: 'https://www.businesszone.in/add-business', tier: 3, region: 'india', free: true,
    notes: 'Free business directory.' },
  { key: 'indiacatalog', name: 'India Catalog', submissionUrl: 'https://www.indiacatalog.com/business-listing/add-business', tier: 3, region: 'india', free: true,
    notes: 'Free India directory.' },

  // ── Tier 2: review platforms ──
  { key: 'trustpilot', name: 'Trustpilot', submissionUrl: 'https://business.trustpilot.com/signup', tier: 2, region: 'global', free: true,
    notes: 'High DA review site. Free claim of business.' },
  { key: 'mouthshut', name: 'MouthShut', submissionUrl: 'https://www.mouthshut.com/businessowner', tier: 2, region: 'india', free: true,
    notes: 'India review platform.' },

  // ── Tier 3 ──
  { key: 'glassdoor', name: 'Glassdoor', submissionUrl: 'https://www.glassdoor.com/employers/post-job/?ea=1', tier: 3, region: 'global', free: true,
    notes: 'Adds your institute as employer.' },
  { key: 'crunchbase', name: 'Crunchbase', submissionUrl: 'https://www.crunchbase.com/profile/contributor', tier: 3, region: 'global', free: true,
    notes: 'Startup database. Free company profile.' },
  { key: 'foursquare', name: 'Foursquare', submissionUrl: 'https://foursquare.com/venue/claim', tier: 3, region: 'global', free: true,
    notes: 'Local business listing. Powers Apple Maps.' },
  { key: 'tupalo', name: 'Tupalo', submissionUrl: 'https://tupalo.com/en/places/new', tier: 3, region: 'global', free: true,
    notes: 'Free local listing.' },
  { key: 'cylex', name: 'Cylex India', submissionUrl: 'https://www.cylex.in/add-business', tier: 3, region: 'india', free: true,
    notes: 'Free India business directory.' },
  { key: 'naukri', name: 'Naukri Learning', submissionUrl: 'https://learning.naukri.com/contact-us', tier: 2, region: 'india', free: true,
    notes: 'Highly trusted in India.' },
  { key: 'udemy', name: 'Udemy', submissionUrl: 'https://teach.udemy.com/', tier: 2, region: 'global', free: true,
    notes: 'Free instructor signup. Published course = backlink from profile.' },
];

module.exports = { DIRECTORIES };

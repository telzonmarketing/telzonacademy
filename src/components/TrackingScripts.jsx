import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { firePixelViewContent } from '@/lib/leadSubmit';

const TRACKING_FIELDS = ['google_code', 'pixel_code', 'retargeting_code'];
const ADMIN_PATHS = ['/admin', '/seo-settings-dashboard-telzon-secret-2024', '/private-free-demo-leads'];

function appendTrackingSnippet(snippet, groupIndex) {
  if (!snippet?.trim()) return [];

  const parser = new DOMParser();
  const doc = parser.parseFromString(`<body>${snippet}</body>`, 'text/html');
  const createdNodes = [];

  Array.from(doc.body.childNodes).forEach((node, nodeIndex) => {
    let nextNode;

    if (node.nodeName.toLowerCase() === 'script') {
      nextNode = document.createElement('script');
      Array.from(node.attributes).forEach(attr => {
        nextNode.setAttribute(attr.name, attr.value);
      });
      nextNode.text = node.textContent;
      nextNode.dataset.telzonTracking = `${groupIndex}-${nodeIndex}`;
      document.head.appendChild(nextNode);
    } else {
      nextNode = node.cloneNode(true);
      if (nextNode.nodeType === Node.ELEMENT_NODE) {
        nextNode.dataset.telzonTracking = `${groupIndex}-${nodeIndex}`;
      }
      document.body.appendChild(nextNode);
    }

    createdNodes.push(nextNode);
  });

  return createdNodes;
}

const TrackingScripts = () => {
  const location = useLocation();
  const [trackingData, setTrackingData] = useState(null);

  useEffect(() => {
    const fetchTrackingSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('seoSettings')
          .select('google_code, pixel_code, retargeting_code')
          .eq('page_key', 'home')
          .maybeSingle();

        if (!error && data) {
          setTrackingData(data);
        }
      } catch (error) {
        console.error('Tracking settings fetch error:', error);
      }
    };

    fetchTrackingSettings();
  }, []);

  // Fire ViewContent on every page visit (for Meta retargeting audiences)
  useEffect(() => {
    const isAdminPath = ADMIN_PATHS.some(path => location.pathname.startsWith(path));
    if (isAdminPath) return;
    firePixelViewContent({ content_name: document.title || 'Telzon Academy', content_category: 'Education' });
  }, [location.pathname]);

  useEffect(() => {
    const isAdminPath = ADMIN_PATHS.some(path => location.pathname.startsWith(path));
    if (isAdminPath || !trackingData) return undefined;

    const injectedNodes = TRACKING_FIELDS.flatMap((field, index) => (
      appendTrackingSnippet(trackingData[field], index)
    ));

    return () => {
      injectedNodes.forEach(node => node.parentNode?.removeChild(node));
    };
  }, [location.pathname, trackingData]);

  return null;
};

export default TrackingScripts;

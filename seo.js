(() => {
  'use strict';

  // SEO metadata and the primary Person/WebSite/ProfilePage schema are defined
  // in index.html so crawlers can read them without JavaScript.
  // Keep this helper limited to optional metadata; do not inject duplicate
  // structured data or reload scripts already included by index.html.

  const addMeta = (selector, attrs) => {
    if (document.head.querySelector(selector)) return;
    const meta = document.createElement('meta');
    Object.entries(attrs).forEach(([key, value]) => meta.setAttribute(key, value));
    document.head.appendChild(meta);
  };

  addMeta('meta[name="author"]', {
    name: 'author',
    content: 'Mohammad Tanberul Islam'
  });

  addMeta('meta[name="theme-color"]', {
    name: 'theme-color',
    content: '#0d1e3a'
  });
})();

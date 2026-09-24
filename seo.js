(() => {
  const siteUrl = 'https://tanvirvolt.github.io/';
  const title = 'Tanberul Islam | Electrical & Electronics Engineer';
  const description = 'Portfolio of Mohammad Tanberul Islam, Electrical & Electronics Engineer specializing in industrial electrical maintenance, motor control, MATLAB/Simulink, energy efficiency and engineering documentation.';

  const addMeta = (attrs) => {
    const key = attrs.name ? `meta[name="${attrs.name}"]` : `meta[property="${attrs.property}"]`;
    if (document.head.querySelector(key)) return;
    const meta = document.createElement('meta');
    Object.entries(attrs).forEach(([keyName, value]) => meta.setAttribute(keyName, value));
    document.head.appendChild(meta);
  };

  if (!document.head.querySelector('link[rel="canonical"]')) {
    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = siteUrl;
    document.head.appendChild(canonical);
  }

  addMeta({ name: 'robots', content: 'index, follow, max-image-preview:large' });
  addMeta({ name: 'author', content: 'Mohammad Tanberul Islam' });
  addMeta({ name: 'theme-color', content: '#0d1e3a' });
  addMeta({ property: 'og:type', content: 'website' });
  addMeta({ property: 'og:url', content: siteUrl });
  addMeta({ property: 'og:site_name', content: 'TanvirVolt Portfolio' });
  addMeta({ name: 'twitter:card', content: 'summary_large_image' });
  addMeta({ name: 'twitter:title', content: title });
  addMeta({ name: 'twitter:description', content: description });

  if (!document.head.querySelector('script[data-seo-schema="person"]')) {
    const schema = document.createElement('script');
    schema.type = 'application/ld+json';
    schema.dataset.seoSchema = 'person';
    schema.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Mohammad Tanberul Islam',
      url: siteUrl,
      jobTitle: 'Electrical & Electronics Engineer',
      email: 'mailto:mohammadtanberulislam@gmail.com',
      address: { '@type': 'PostalAddress', addressLocality: 'Chittagong', addressCountry: 'BD' },
      sameAs: [
        'https://github.com/tanvirvolt',
        'https://www.linkedin.com/in/tanber',
        'https://circuitsecrets.blogspot.com'
      ]
    });
    document.head.appendChild(schema);
  }

  const loadScript = (src, marker) => {
    if (document.querySelector(`script[data-${marker}]`)) return;
    const script = document.createElement('script');
    script.src = src;
    script.dataset[marker] = 'true';
    document.body.appendChild(script);
  };

  loadScript('eee-tools.js', 'eeeToolsLoader');
  loadScript('contact-form.js', 'contactFormLoader');
})();

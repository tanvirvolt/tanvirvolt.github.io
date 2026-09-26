(() => {
  'use strict';

  const BLOG_URL = 'https://circuitsecrets.blogspot.com';
  const FEED_URL =
    BLOG_URL +
    '/feeds/posts/default?alt=json-in-script&max-results=3&orderby=published';

  const SECTION_ID = 'latest-blog-posts';
  const CALLBACK = '__tanvirVoltBlogFeed';

  const addStyles = () => {
    if (document.getElementById('latest-blog-posts-styles')) return;

    const style = document.createElement('style');
    style.id = 'latest-blog-posts-styles';
    style.textContent = `
      #latest-blog-posts{scroll-margin-top:90px}
      .latest-blog-head{display:flex;align-items:end;justify-content:space-between;gap:18px;margin-bottom:20px}
      .latest-blog-head p{max-width:560px;color:var(--muted);font-size:12px;line-height:1.7;margin:8px 0 0}
      .latest-blog-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
      .latest-blog-card{display:flex;flex-direction:column;overflow:hidden;background:var(--soft);border:1px solid rgba(0,234,255,.14);border-radius:14px;min-height:100%}
      .latest-blog-thumb{width:100%;height:165px;object-fit:cover;background:linear-gradient(135deg,#102238,#18395a);display:block}
      .latest-blog-body{display:flex;flex:1;flex-direction:column;padding:18px}
      .latest-blog-date{font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--cyan);margin-bottom:9px}
      .latest-blog-card h3{font:700 18px Rajdhani;color:var(--text);line-height:1.3;margin:0 0 9px}
      .latest-blog-card p{font-size:12px;color:var(--muted);line-height:1.7;margin:0 0 16px}
      .latest-blog-card a{margin-top:auto;color:var(--cyan);font:700 12px Rajdhani;text-decoration:none}
      .latest-blog-card a:hover{text-decoration:underline}
      .latest-blog-status{color:var(--muted);font-size:12px;padding:16px 0}
      .latest-blog-error{border:1px dashed rgba(0,234,255,.2);border-radius:12px;padding:18px;color:var(--muted);font-size:12px;line-height:1.7}
      @media(max-width:800px){.latest-blog-grid{grid-template-columns:1fr 1fr}}
      @media(max-width:560px){.latest-blog-head{display:block}.latest-blog-grid{grid-template-columns:1fr}.latest-blog-thumb{height:190px}}
    `;
    document.head.appendChild(style);
  };

  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html || '', 'text/html');
    return (doc.body.textContent || '').replace(/\\s+/g, ' ').trim();
  };

  const entryLink = (entry) => {
    const links = Array.isArray(entry && entry.link) ? entry.link : [];
    const item = links.find((link) => link.rel === 'alternate' && link.href);
    if (!item) return BLOG_URL;

    try {
      const url = new URL(item.href);
      if (url.protocol === 'https:' && url.hostname === 'circuitsecrets.blogspot.com') {
        return url.href;
      }
    } catch (_) {}
    return BLOG_URL;
  };

  const entryImage = (entry) => {
    const raw = entry && entry.media$thumbnail && entry.media$thumbnail.url;
    if (!raw) return '';
    try {
      const url = new URL(raw);
      if (url.protocol !== 'https:' || url.hostname !== 'blogger.googleusercontent.com') return '';
      return url.href.replace(/\\/s\\d+(?:-c)?\\//, '/s600/');
    } catch (_) {
      return '';
    }
  };

  const createCard = (entry) => {
    const card = document.createElement('article');
    card.className = 'latest-blog-card';

    const imageUrl = entryImage(entry);
    if (imageUrl) {
      const img = document.createElement('img');
      img.className = 'latest-blog-thumb';
      img.src = imageUrl;
      img.alt = '';
      img.loading = 'lazy';
      img.referrerPolicy = 'no-referrer';
      card.appendChild(img);
    } else {
      const placeholder = document.createElement('div');
      placeholder.className = 'latest-blog-thumb';
      placeholder.setAttribute('aria-hidden', 'true');
      card.appendChild(placeholder);
    }

    const body = document.createElement('div');
    body.className = 'latest-blog-body';

    const date = document.createElement('div');
    date.className = 'latest-blog-date';
    const published = entry && entry.published && entry.published.$t;
    const parsedDate = published ? new Date(published) : null;
    date.textContent =
      parsedDate && !Number.isNaN(parsedDate.getTime())
        ? parsedDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        : 'CircuitSecrets';
    body.appendChild(date);

    const title = document.createElement('h3');
    title.textContent = entry && entry.title && entry.title.$t ? entry.title.$t : 'CircuitSecrets article';
    body.appendChild(title);

    const excerpt = document.createElement('p');
    const rawExcerpt =
      (entry && entry.summary && entry.summary.$t) ||
      (entry && entry.content && entry.content.$t) ||
      '';
    const text = stripHtml(rawExcerpt);
    excerpt.textContent = text.length > 150 ? text.slice(0, 150).trimEnd() + '…' : text;
    body.appendChild(excerpt);

    const link = document.createElement('a');
    link.href = entryLink(entry);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Read Article ↗';
    body.appendChild(link);

    card.appendChild(body);
    return card;
  };

  const render = (entries) => {
    const old = document.getElementById(SECTION_ID);
    if (old) old.remove();

    const section = document.createElement('section');
    section.id = SECTION_ID;
    section.className = 'panel reveal';

    const head = document.createElement('div');
    head.className = 'latest-blog-head';

    const copy = document.createElement('div');
    const eyebrow = document.createElement('small');
    eyebrow.textContent = 'FROM CIRCUITSECRETS';
    const heading = document.createElement('h2');
    heading.innerHTML = 'Latest Blog <span>Posts</span>';
    const description = document.createElement('p');
    description.textContent = 'The 3 newest CircuitSecrets articles are loaded automatically from the Blogger site feed.';
    copy.append(eyebrow, heading, description);

    const viewAll = document.createElement('a');
    viewAll.className = 'btn ghost';
    viewAll.href = BLOG_URL;
    viewAll.target = '_blank';
    viewAll.rel = 'noopener noreferrer';
    viewAll.textContent = 'View All Posts ↗';

    head.append(copy, viewAll);
    section.appendChild(head);

    const grid = document.createElement('div');
    grid.className = 'latest-blog-grid';

    entries.slice(0, 3).forEach((entry) => grid.appendChild(createCard(entry)));

    if (!entries.length) {
      const empty = document.createElement('div');
      empty.className = 'latest-blog-error';
      empty.textContent = 'No recent posts were returned by the CircuitSecrets feed. You can still visit the blog using the button above.';
      section.appendChild(empty);
    } else {
      section.appendChild(grid);
    }

    const anchor = document.getElementById('technical-blog-hub') || document.getElementById('projects');
    if (anchor) {
      anchor.insertAdjacentElement('afterend', section);
    }
  };

  const showError = () => {
    render([]);
  };

  window[CALLBACK] = (data) => {
    const entries = data && data.feed && Array.isArray(data.feed.entry)
      ? data.feed.entry
      : [];
    render(entries);
    cleanup();
  };

  let scriptTag = null;
  let timeoutId = null;

  const cleanup = () => {
    if (timeoutId) clearTimeout(timeoutId);
    if (scriptTag) scriptTag.remove();
    try { delete window[CALLBACK]; } catch (_) { window[CALLBACK] = undefined; }
  };

  const loadFeed = () => {
    scriptTag = document.createElement('script');
    scriptTag.src =
      FEED_URL +
      '&callback=' +
      encodeURIComponent(CALLBACK) +
      '&_=' +
      Date.now();
    scriptTag.async = true;
    scriptTag.onerror = () => {
      showError();
      cleanup();
    };
    document.body.appendChild(scriptTag);

    timeoutId = setTimeout(() => {
      if (document.getElementById(SECTION_ID)) return;
      showError();
      cleanup();
    }, 9000);
  };

  const init = () => {
    addStyles();
    loadFeed();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();

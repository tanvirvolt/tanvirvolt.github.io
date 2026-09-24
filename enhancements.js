(() => {
  const root = document.documentElement;
  const style = document.createElement('style');
  style.textContent = `
    :root { scroll-behavior: smooth; color-scheme: dark; }
    body::before { content:''; position:fixed; top:0; left:0; width:var(--scroll-progress,0%); height:3px; background:var(--cyan,#00eaff); z-index:9999; box-shadow:0 0 10px var(--cyan,#00eaff); pointer-events:none; }
    nav a.active { color:var(--cyan,#00eaff)!important; text-shadow:0 0 10px rgba(0,234,255,.45); }
    a:focus-visible, button:focus-visible, input:focus-visible, textarea:focus-visible { outline:2px solid var(--cyan,#00eaff); outline-offset:4px; }
    .image-lightbox { position:fixed; inset:0; z-index:10000; display:flex; align-items:center; justify-content:center; padding:24px; background:rgba(0,0,0,.88); opacity:0; visibility:hidden; transition:opacity .2s ease; }
    .image-lightbox.open { opacity:1; visibility:visible; }
    .image-lightbox img { max-width:min(1100px,95vw); max-height:85vh; object-fit:contain; border:1px solid rgba(0,234,255,.5); border-radius:10px; }
    .image-lightbox button { position:absolute; top:20px; right:24px; background:transparent; border:1px solid var(--cyan,#00eaff); color:var(--cyan,#00eaff); border-radius:50%; width:42px; height:42px; font-size:24px; cursor:pointer; }
    .theme-toggle { display:inline-flex; align-items:center; justify-content:center; gap:6px; width:38px; height:38px; margin-left:14px; border:1px solid var(--cyan,#00eaff); border-radius:50%; background:transparent; color:var(--cyan,#00eaff); cursor:pointer; font-size:16px; transition:transform .25s,background .25s; }
    .theme-toggle:hover { transform:translateY(-2px); background:rgba(0,234,255,.12); }
    :root[data-theme="light"] { color-scheme:light; --bg:#eef3f8; --card:#ffffff; --soft:#e3ebf3; --text:#142033; --muted:#526274; --cyan:#006d9c; --glow:rgba(0,109,156,.18); }
    :root[data-theme="light"] body { background:radial-gradient(circle at 80% 80%,rgba(0,109,156,.12),transparent 30%),var(--bg); }
    :root[data-theme="light"] body::after { background:transparent; }
    :root[data-theme="light"] header { background:rgba(238,243,248,.92); border-bottom-color:rgba(0,109,156,.18); }
    :root[data-theme="light"] .panel { background:linear-gradient(145deg,#ffffff,#edf3f8); border-color:rgba(20,32,51,.1); box-shadow:0 14px 40px rgba(24,52,77,.09); }
    :root[data-theme="light"] .projects, :root[data-theme="light"] .about { background:linear-gradient(145deg,#ffffff,#e4edf5); }
    :root[data-theme="light"] .stats-grid article, :root[data-theme="light"] .services article, :root[data-theme="light"] .projects-grid article, :root[data-theme="light"] .education-grid article, :root[data-theme="light"] .contact-cards a { background:var(--soft); }
    :root[data-theme="light"] input, :root[data-theme="light"] textarea { background:#ffffff; color:var(--text); border-color:rgba(20,32,51,.18); }
    :root[data-theme="light"] #menu { color:var(--text); }
    :root[data-theme="light"] nav a { color:var(--muted); }
    @media(max-width:560px) { .theme-toggle { margin-left:8px; width:34px; height:34px; } header { gap:8px; } }
    @media (prefers-reduced-motion:reduce) { *,*::before,*::after { animation-duration:.01ms!important; transition-duration:.01ms!important; scroll-behavior:auto!important; } }
  `;
  document.head.appendChild(style);

  const savedTheme = localStorage.getItem('tanvirvolt-theme');
  if (savedTheme === 'light' || savedTheme === 'dark') root.dataset.theme = savedTheme;

  const header = document.querySelector('header');
  const menu = document.getElementById('menu');
  if (header && !document.querySelector('.theme-toggle')) {
    const toggle = document.createElement('button');
    toggle.className = 'theme-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-label', 'Switch to light theme');
    toggle.setAttribute('title', 'Switch theme');
    header.insertBefore(toggle, menu || null);
    const syncToggle = () => {
      const isLight = root.dataset.theme === 'light';
      toggle.textContent = isLight ? '☀' : '☾';
      toggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
      toggle.setAttribute('aria-pressed', String(isLight));
    };
    toggle.addEventListener('click', () => {
      const next = root.dataset.theme === 'light' ? 'dark' : 'light';
      root.dataset.theme = next;
      localStorage.setItem('tanvirvolt-theme', next);
      syncToggle();
    });
    syncToggle();
  }

  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    root.style.setProperty('--scroll-progress', `${max > 0 ? (window.scrollY / max) * 100 : 0}%`);
  };
  window.addEventListener('scroll', updateProgress, { passive:true });
  updateProgress();

  const links = [...document.querySelectorAll('nav a[href^="#"]')];
  const sections = links.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
        }
      });
    }, { rootMargin:'-30% 0px -55% 0px', threshold:0 });
    sections.forEach(section => navObserver.observe(section));
  }

  const lightbox = document.createElement('div');
  lightbox.className = 'image-lightbox';
  lightbox.setAttribute('role','dialog');
  lightbox.setAttribute('aria-modal','true');
  lightbox.setAttribute('aria-label','Image preview');
  lightbox.innerHTML = '<button type="button" aria-label="Close image preview">×</button><img alt="Expanded thesis visual">';
  document.body.appendChild(lightbox);
  const preview = lightbox.querySelector('img');
  const close = () => { lightbox.classList.remove('open'); preview.removeAttribute('src'); document.body.style.overflow=''; };
  lightbox.querySelector('button').addEventListener('click', close);
  lightbox.addEventListener('click', event => { if (event.target === lightbox) close(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') close(); });
  document.querySelectorAll('.thesis-shot img').forEach(image => {
    image.style.cursor='zoom-in';
    image.parentElement.addEventListener('click', event => {
      event.preventDefault();
      preview.src = image.currentSrc || image.src;
      preview.alt = image.alt;
      lightbox.classList.add('open');
      document.body.style.overflow='hidden';
    });
  });

  document.querySelectorAll('img').forEach(image => {
    if (!image.hasAttribute('width')) image.setAttribute('width', image.naturalWidth || 800);
    if (!image.hasAttribute('height')) image.setAttribute('height', image.naturalHeight || 600);
    if (!image.closest('.hero') && !image.closest('.about')) image.loading = image.loading || 'lazy';
    image.decoding = 'async';
  });
})();
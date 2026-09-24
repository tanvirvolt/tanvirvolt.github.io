(() => {
  const root = document.documentElement;
  const style = document.createElement('style');
  style.textContent = `
    :root { scroll-behavior: smooth; }
    body::before { content:''; position:fixed; top:0; left:0; width:var(--scroll-progress,0%); height:3px; background:var(--cyan,#00eaff); z-index:9999; box-shadow:0 0 10px var(--cyan,#00eaff); pointer-events:none; }
    nav a.active { color:var(--cyan,#00eaff)!important; text-shadow:0 0 10px rgba(0,234,255,.45); }
    a:focus-visible, button:focus-visible, input:focus-visible, textarea:focus-visible { outline:2px solid var(--cyan,#00eaff); outline-offset:4px; }
    .image-lightbox { position:fixed; inset:0; z-index:10000; display:flex; align-items:center; justify-content:center; padding:24px; background:rgba(0,0,0,.88); opacity:0; visibility:hidden; transition:opacity .2s ease; }
    .image-lightbox.open { opacity:1; visibility:visible; }
    .image-lightbox img { max-width:min(1100px,95vw); max-height:85vh; object-fit:contain; border:1px solid rgba(0,234,255,.5); border-radius:10px; }
    .image-lightbox button { position:absolute; top:20px; right:24px; background:transparent; border:1px solid var(--cyan,#00eaff); color:var(--cyan,#00eaff); border-radius:50%; width:42px; height:42px; font-size:24px; cursor:pointer; }
    @media (prefers-reduced-motion:reduce) { *,*::before,*::after { animation-duration:.01ms!important; transition-duration:.01ms!important; scroll-behavior:auto!important; } }
  `;
  document.head.appendChild(style);

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

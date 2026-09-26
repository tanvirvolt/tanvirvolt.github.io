(() => {
  'use strict';

  const init = () => {
    const nav = document.getElementById('nav');
    if (!nav) return;

    // Create a lightweight scroll-progress indicator without changing page layout.
    let progress = document.getElementById('scroll-progress');
    if (!progress) {
      progress = document.createElement('div');
      progress.id = 'scroll-progress';
      progress.setAttribute('aria-hidden', 'true');
      progress.innerHTML = '<span></span>';
      document.body.prepend(progress);
    }

    const progressBar = progress.querySelector('span');
    const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
    const sections = navLinks
      .map(link => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);

    let ticking = false;

    const updateProgress = () => {
      const doc = document.documentElement;
      const maxScroll = Math.max(0, doc.scrollHeight - window.innerHeight);
      const ratio = maxScroll ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
      progressBar.style.transform = `scaleX(${ratio})`;
      ticking = false;
    };

    const requestProgressUpdate = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestProgressUpdate, { passive: true });
    window.addEventListener('resize', requestProgressUpdate);
    updateProgress();

    const setActive = (id) => {
      navLinks.forEach(link => {
        const active = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });
    };

    // Highlight the section occupying the main reading area.
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]) setActive(visible[0].target.id);
      }, {
        root: null,
        rootMargin: '-18% 0px -58% 0px',
        threshold: [0.01, 0.15, 0.35, 0.6]
      });

      sections.forEach(section => observer.observe(section));
    }

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        const id = link.getAttribute('href').slice(1);
        setActive(id);
        requestProgressUpdate();
      });
    });

    // Initial state: Home at the top, otherwise infer the nearest section.
    if (window.scrollY < 120 && document.getElementById('home')) {
      setActive('home');
    } else {
      let current = sections[0]?.id;
      sections.forEach(section => {
        if (section.getBoundingClientRect().top <= window.innerHeight * 0.35) {
          current = section.id;
        }
      });
      if (current) setActive(current);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
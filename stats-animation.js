(() => {
  'use strict';

  const STYLE_ID = 'stats-animation-styles';

  const addStyles = () => {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #stats.reveal{opacity:1;transform:none}
      #stats .stats-card-animated{opacity:0;transform:translateY(12px);transition:opacity .55s ease,transform .55s ease}
      #stats.stats-visible .stats-card-animated{opacity:1;transform:none}
      #stats.stats-visible .stats-card-animated:nth-child(1){transition-delay:0ms}
      #stats.stats-visible .stats-card-animated:nth-child(2){transition-delay:90ms}
      #stats.stats-visible .stats-card-animated:nth-child(3){transition-delay:180ms}
      #stats.stats-visible .stats-card-animated:nth-child(4){transition-delay:270ms}
      @media(prefers-reduced-motion:reduce){
        #stats .stats-card-animated{opacity:1;transform:none;transition:none}
      }
    `;
    document.head.appendChild(style);
  };

  const animateNumber = (element, target, decimals, suffix) => {
    const duration = 1050;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      element.textContent = value.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else element.textContent = target.toFixed(decimals) + suffix;
    };

    requestAnimationFrame(tick);
  };

  const init = () => {
    const stats = document.getElementById('stats');
    if (!stats) return;

    addStyles();

    const cards = [...stats.querySelectorAll('article')];
    cards.forEach((card) => card.classList.add('stats-card-animated'));

    const values = [
      { target:6, decimals:0, suffix:'+' },
      { target:500, decimals:0, suffix:'+' },
      { target:3.59, decimals:2, suffix:'' },
      null
    ];

    let triggered = false;

    const reveal = () => {
      if (triggered) return;
      triggered = true;
      stats.classList.add('stats-visible');

      cards.forEach((card, index) => {
        const value = values[index];
        const strong = card.querySelector('strong');
        if (!value || !strong) return;
        animateNumber(strong, value.target, value.decimals, value.suffix);
      });
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      reveal();
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        reveal();
        obs.disconnect();
      }
    }, { threshold:0.25, rootMargin:'0px 0px -8% 0px' });

    observer.observe(stats);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, {once:true});
  } else {
    init();
  }
})();

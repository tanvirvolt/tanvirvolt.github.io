(() => {
  'use strict';

  const STYLE_ID = 'stats-animation-styles';
  const addStyles = () => {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #stats.reveal{opacity:1;transform:none}
      #stats .stats-card-animated{opacity:0;transform:translate3d(0,14px,0);transition:opacity .58s cubic-bezier(.16,1,.3,1),transform .58s cubic-bezier(.16,1,.3,1),border-color .25s ease,box-shadow .25s ease}
      #stats.stats-visible .stats-card-animated{opacity:1;transform:translate3d(0,0,0)}
      #stats.stats-visible .stats-card-animated:nth-child(1){transition-delay:0ms}
      #stats.stats-visible .stats-card-animated:nth-child(2){transition-delay:100ms}
      #stats.stats-visible .stats-card-animated:nth-child(3){transition-delay:200ms}
      #stats.stats-visible .stats-card-animated:nth-child(4){transition-delay:300ms}
      #stats .stats-card-animated:hover{border-color:rgba(0,234,255,.48);box-shadow:0 12px 28px rgba(0,0,0,.18),0 0 22px rgba(0,234,255,.10);transform:translate3d(0,-5px,0)}
      #stats .stats-card-animated strong{font-variant-numeric:tabular-nums;text-shadow:0 0 14px rgba(0,234,255,.08)}
      @media(max-width:700px){#stats .stats-card-animated:hover{transform:none;box-shadow:none}}
      @media(prefers-reduced-motion:reduce){
        #stats .stats-card-animated{opacity:1;transform:none;transition:none}
        #stats .stats-card-animated:hover{transform:none;box-shadow:none}
      }
    `;
    document.head.appendChild(style);
  };

  const animateNumber = (element, target, decimals, suffix) => {
    const duration = 1150;
    const start = performance.now();
    const tick = now => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = (target * eased).toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else element.textContent = target.toFixed(decimals) + suffix;
    };
    requestAnimationFrame(tick);
  };

  const init = () => {
    const stats = document.getElementById('stats');
    if (!stats || stats.dataset.statsAnimationInitialized === 'true') return;
    stats.dataset.statsAnimationInitialized = 'true';
    addStyles();

    const cards = [...stats.querySelectorAll(':scope > article')];
    cards.forEach(card => card.classList.add('stats-card-animated'));

    // Keep values aligned to the actual homepage cards; FOC is a label, not a number.
    const values = [
      {target:6,decimals:0,suffix:'+'},
      {target:500,decimals:0,suffix:'+'},
      {target:3.59,decimals:2,suffix:''},
      null
    ];
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let triggered = false;

    const reveal = () => {
      if (triggered) return;
      triggered = true;
      stats.classList.add('stats-visible');
      cards.forEach((card,index) => {
        const value = values[index];
        const strong = card.querySelector('strong');
        if (!value || !strong) return;
        if (reduceMotion) strong.textContent = value.target.toFixed(value.decimals) + value.suffix;
        else animateNumber(strong,value.target,value.decimals,value.suffix);
      });
    };

    if (reduceMotion || !('IntersectionObserver' in window)) {
      reveal();
      return;
    }
    const observer = new IntersectionObserver((entries,obs) => {
      if (entries.some(entry => entry.isIntersecting)) {
        reveal();
        obs.disconnect();
      }
    },{threshold:.25,rootMargin:'0px 0px -8% 0px'});
    observer.observe(stats);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();

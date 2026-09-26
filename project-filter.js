(() => {
  'use strict';

  const STYLE_ID = 'project-filter-styles';

  const addStyles = () => {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .project-filter-tabs{display:flex;flex-wrap:wrap;gap:8px;margin:20px 0 22px}
      .project-filter-btn{appearance:none;border:1px solid rgba(0,234,255,.18);background:rgba(7,18,29,.58);color:var(--muted);border-radius:999px;padding:8px 15px;font:700 11px Rajdhani;letter-spacing:.05em;cursor:pointer;transition:transform .22s ease,border-color .22s ease,color .22s ease,background .22s ease,box-shadow .22s ease}
      .project-filter-btn:hover{transform:translateY(-2px);border-color:rgba(0,234,255,.5);color:var(--text)}
      .project-filter-btn.active{color:var(--cyan);border-color:rgba(0,234,255,.65);background:rgba(0,234,255,.07);box-shadow:0 0 16px rgba(0,234,255,.09)}
      .projects-grid .project-filter-card{transition:transform .25s ease,opacity .25s ease,filter .25s ease,box-shadow .25s ease,border-color .25s ease}
      .projects-grid .project-filter-card:hover{transform:translateY(-5px);border-color:rgba(0,234,255,.45);box-shadow:0 10px 28px rgba(0,234,255,.1),0 0 18px rgba(0,234,255,.06)}
      .projects-grid .project-filter-card.is-hidden{display:none}
      @media(prefers-reduced-motion:reduce){
        .project-filter-btn,.projects-grid .project-filter-card{transition:none}
        .project-filter-btn:hover,.projects-grid .project-filter-card:hover{transform:none}
      }
    `;
    document.head.appendChild(style);
  };

  const init = () => {
    const section = document.querySelector('#projects');
    const grid = section && section.querySelector('.projects-grid');
    if (!section || !grid || section.querySelector('.project-filter-tabs')) return;

    addStyles();

    const cards = [...grid.querySelectorAll(':scope > article')];
    const categories = ['motor research', 'tools', 'motor tools', 'motor', 'tools', 'tools'];
    const labels = ['All', 'Motor', 'Tools', 'Research'];

    cards.forEach((card, index) => {
      card.classList.add('project-filter-card');
      card.dataset.category = categories[index] || 'tools';
    });

    const tabs = document.createElement('div');
    tabs.className = 'project-filter-tabs';
    tabs.setAttribute('role','tablist');
    tabs.setAttribute('aria-label','Filter projects by category');

    labels.forEach((label) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'project-filter-btn' + (label === 'All' ? ' active' : '');
      button.textContent = label;
      button.dataset.filter = label.toLowerCase();
      button.setAttribute('role','tab');
      button.setAttribute('aria-selected', label === 'All' ? 'true' : 'false');
      tabs.appendChild(button);
    });

    const heading = section.querySelector('h2');
    if (heading) heading.insertAdjacentElement('afterend', tabs);
    else section.insertBefore(tabs, grid);

    const applyFilter = (filter) => {
      cards.forEach((card) => {
        const matches = filter === 'all' || (card.dataset.category || '').split(/\s+/).includes(filter);
        card.classList.toggle('is-hidden', !matches);
      });

      tabs.querySelectorAll('.project-filter-btn').forEach((button) => {
        const active = button.dataset.filter === filter;
        button.classList.toggle('active', active);
        button.setAttribute('aria-selected', active ? 'true' : 'false');
      });
    };

    tabs.addEventListener('click', (event) => {
      const button = event.target.closest('.project-filter-btn');
      if (!button) return;
      applyFilter(button.dataset.filter);
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, {once:true});
  } else {
    init();
  }
})();

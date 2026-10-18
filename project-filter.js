(() => {
  'use strict';

  const STYLE_ID = 'project-filter-styles';
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  const projectDetails = [
    {
      category:['motor','research'],
      summary:'Thesis research exploring indirect field-oriented control for an induction motor.',
      tools:['MATLAB','Simulink','IFOC','SVPWM']
    },
    {
      category:['tools'],
      summary:'A collection of practical electrical calculations for everyday engineering tasks.',
      tools:['HTML','CSS','JavaScript','Motor current']
    },
    {
      category:['motor','tools'],
      summary:'Calculate conductor voltage drop and review power-system calculation basics.',
      tools:['Voltage drop','Copper cable','Power factor']
    },
    {
      category:['motor','tools'],
      summary:'Explore power-factor calculations and related motor protection concepts.',
      tools:['Power factor','kW / kVA / kVAR','Motor systems']
    },
    {
      category:['motor','tools'],
      summary:'Calculate synchronous speed, slip speed and percentage slip from motor inputs.',
      tools:['Frequency','Pole count','RPM','Slip']
    },
    {
      category:['research'],
      summary:'Technical articles and practical notes about electrical and electronics engineering.',
      tools:['Electrical engineering','Tutorials','Technical writing']
    },
    {
      category:['research'],
      summary:'The personal portfolio interface showcasing engineering experience and selected work.',
      tools:['HTML','CSS','JavaScript','Responsive UI']
    }
  ];

  const addStyles = () => {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .project-filter-tabs{display:flex;flex-wrap:wrap;gap:8px;margin:20px 0 12px}
      .project-filter-btn{appearance:none;border:1px solid rgba(0,234,255,.18);background:rgba(7,18,29,.58);color:var(--muted);border-radius:999px;padding:9px 16px;font:700 11px Rajdhani;letter-spacing:.05em;cursor:pointer;transition:transform .22s ease,border-color .22s ease,color .22s ease,background .22s ease,box-shadow .22s ease}
      .project-filter-btn:hover{transform:translateY(-2px);border-color:rgba(0,234,255,.5);color:var(--text)}
      .project-filter-btn:focus-visible{outline:2px solid var(--cyan);outline-offset:3px}
      .project-filter-btn.active{color:var(--cyan);border-color:rgba(0,234,255,.65);background:rgba(0,234,255,.07);box-shadow:0 0 16px rgba(0,234,255,.09)}
      .project-filter-status{min-height:18px;margin:0 0 18px;color:var(--muted);font-size:11px}
      .projects-grid .project-filter-card{position:relative;transition:transform .28s ease,opacity .24s ease,filter .24s ease,box-shadow .25s ease,border-color .25s ease}
      .projects-grid .project-filter-card:hover{transform:translateY(-5px);border-color:rgba(0,234,255,.45);box-shadow:0 10px 28px rgba(0,234,255,.1),0 0 18px rgba(0,234,255,.06)}
      .projects-grid .project-filter-card .project-card-icon{overflow:hidden;transition:background .3s ease}
      .projects-grid .project-filter-card .project-card-icon span{display:inline-block;transition:transform .35s cubic-bezier(.16,1,.3,1),filter .35s ease}
      .projects-grid .project-filter-card:hover .project-card-icon span{transform:scale(1.12);filter:drop-shadow(0 0 9px rgba(0,234,255,.4))}
      .project-card-summary{padding:0 18px;margin:8px 0 10px!important;color:var(--muted);font-size:12px;line-height:1.7}
      .project-card-tools{display:flex;flex-wrap:wrap;gap:6px;padding:0 18px;margin:0 0 12px}
      .project-card-tools span{font-size:10px;color:var(--cyan);border:1px solid rgba(0,234,255,.2);border-radius:999px;padding:4px 8px}
      .projects-grid .project-filter-card.is-filtering-out{opacity:0;transform:translateY(8px) scale(.985);pointer-events:none}
      .projects-grid .project-filter-card[hidden]{display:none!important}
      @media(max-width:700px){.projects-grid .project-filter-card:hover{transform:none;box-shadow:none}.projects-grid .project-filter-card:hover .project-card-icon span{transform:none;filter:none}}
      @media(prefers-reduced-motion:reduce){.project-filter-btn,.projects-grid .project-filter-card,.projects-grid .project-filter-card .project-card-icon span{transition:none!important}.project-filter-btn:hover,.projects-grid .project-filter-card:hover,.projects-grid .project-filter-card:hover .project-card-icon span{transform:none;filter:none}}
    `;
    document.head.appendChild(style);
  };

  const init = () => {
    const section = document.querySelector('#projects');
    const grid = section && section.querySelector('.projects-grid');
    if (!section || !grid || section.querySelector('.project-filter-tabs')) return;
    addStyles();

    const cards = [...grid.querySelectorAll(':scope > article')];
    cards.forEach((card,index) => {
      const detail = projectDetails[index] || {category:['tools'],summary:'Selected engineering work from the TanvirVolt portfolio.',tools:['Engineering']};
      card.classList.add('project-filter-card');
      card.dataset.category = detail.category.join(' ');
      card.dataset.projectIndex = String(index);
      const icon = card.querySelector(':scope > div');
      if (icon && !icon.classList.contains('project-card-icon')) {
        icon.classList.add('project-card-icon');
        const iconText = icon.textContent.trim();
        icon.textContent = '';
        const iconSpan = document.createElement('span');
        iconSpan.setAttribute('aria-hidden','true');
        iconSpan.textContent = iconText;
        icon.appendChild(iconSpan);
      }
      if (!card.querySelector('.project-card-summary')) {
        const p = document.createElement('p');
        p.className = 'project-card-summary';
        p.textContent = detail.summary;
        const title = card.querySelector('h3');
        if (title) title.insertAdjacentElement('afterend',p);
      }
      if (!card.querySelector('.project-card-tools')) {
        const tools = document.createElement('div');
        tools.className = 'project-card-tools';
        tools.setAttribute('aria-label','Related tools and technologies');
        detail.tools.forEach(label => {
          const chip = document.createElement('span');
          chip.textContent = label;
          tools.appendChild(chip);
        });
        const summary = card.querySelector('.project-card-summary');
        if (summary) summary.insertAdjacentElement('afterend',tools);
      }
      card.hidden = false;
    });

    const tabs = document.createElement('div');
    tabs.className = 'project-filter-tabs';
    tabs.setAttribute('role','group');
    tabs.setAttribute('aria-label','Filter projects by category');
    const labels = [
      {label:'All',value:'all'},
      {label:'Motor',value:'motor'},
      {label:'Tools',value:'tools'},
      {label:'Research',value:'research'}
    ];
    labels.forEach(({label,value},index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'project-filter-btn' + (index===0?' active':'');
      button.textContent = label;
      button.dataset.filter = value;
      button.setAttribute('aria-pressed',index===0?'true':'false');
      tabs.appendChild(button);
    });
    const status = document.createElement('p');
    status.className = 'project-filter-status';
    status.setAttribute('aria-live','polite');
    status.setAttribute('aria-atomic','true');
    status.textContent = cards.length + (cards.length===1?' project':' projects') + ' shown';
    const heading = section.querySelector('h2');
    if (heading) {
      heading.insertAdjacentElement('afterend',tabs);
      tabs.insertAdjacentElement('afterend',status);
    } else {
      grid.insertAdjacentElement('beforebegin',tabs);
      tabs.insertAdjacentElement('afterend',status);
    }

    let activeFilter = 'all';
    let transitionTimer = 0;
    const applyFilter = filter => {
      activeFilter = filter;
      window.clearTimeout(transitionTimer);
      const visible = cards.filter(card => filter==='all' || card.dataset.category.split(/\s+/).includes(filter));
      cards.forEach(card => {
        const matches = visible.includes(card);
        if (matches) {
          card.hidden = false;
          card.classList.remove('is-filtering-out');
          card.setAttribute('aria-hidden','false');
        } else {
          card.classList.add('is-filtering-out');
          card.setAttribute('aria-hidden','true');
        }
      });
      tabs.querySelectorAll('.project-filter-btn').forEach(button => {
        const active = button.dataset.filter===filter;
        button.classList.toggle('active',active);
        button.setAttribute('aria-pressed',active?'true':'false');
      });
      status.textContent = visible.length + (visible.length===1?' project':' projects') + ' shown';
      if (motionQuery.matches) {
        cards.forEach(card => { card.hidden = !visible.includes(card); });
      } else {
        transitionTimer = window.setTimeout(() => {
          cards.forEach(card => {
            const matches = filter==='all' || card.dataset.category.split(/\s+/).includes(filter);
            card.hidden = !matches;
            if (matches) card.classList.remove('is-filtering-out');
          });
        },260);
      }
    };

    tabs.addEventListener('click',event => {
      const button = event.target.closest('.project-filter-btn');
      if (button) applyFilter(button.dataset.filter);
    });
    // Native buttons already support Tab/Enter/Space; arrow keys also move between filters.
    tabs.addEventListener('keydown',event => {
      if (!['ArrowRight','ArrowLeft','Home','End'].includes(event.key)) return;
      const buttons = [...tabs.querySelectorAll('.project-filter-btn')];
      const current = buttons.indexOf(document.activeElement);
      if (current<0) return;
      event.preventDefault();
      let next = current;
      if (event.key==='ArrowRight') next=(current+1)%buttons.length;
      if (event.key==='ArrowLeft') next=(current-1+buttons.length)%buttons.length;
      if (event.key==='Home') next=0;
      if (event.key==='End') next=buttons.length-1;
      buttons[next].focus();
    });
  };

  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();

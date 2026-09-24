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
    .engineering-case-list { display:grid; gap:18px; margin-top:24px; }
    .engineering-case { border:1px solid rgba(0,234,255,.16); border-radius:16px; padding:22px; background:linear-gradient(145deg,rgba(10,30,48,.72),rgba(13,25,40,.48)); }
    .engineering-case h3 { color:var(--cyan); font:700 23px Rajdhani; margin:8px 0; }
    .engineering-case .case-meta { display:flex; flex-wrap:wrap; gap:8px; margin:12px 0 16px; }
    .engineering-case .case-meta span { border:1px solid rgba(0,234,255,.22); border-radius:999px; padding:5px 10px; color:var(--muted); font-size:11px; }
    .case-columns { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
    .case-columns div { padding:14px; border-radius:10px; background:rgba(0,0,0,.14); }
    .case-columns strong { display:block; color:var(--text); font:700 15px Rajdhani; margin-bottom:6px; }
    .case-columns p { color:var(--muted); font-size:12px; line-height:1.7; margin:0; }
    .project-detail-button { display:inline-flex; margin-top:12px; padding:8px 12px; border:1px solid var(--cyan); border-radius:999px; color:var(--cyan); background:transparent; cursor:pointer; font:600 12px Rajdhani; }
    .project-modal { position:fixed; inset:0; z-index:10001; display:flex; align-items:center; justify-content:center; padding:20px; background:rgba(0,0,0,.82); opacity:0; visibility:hidden; transition:opacity .2s ease; }
    .project-modal.open { opacity:1; visibility:visible; }
    .project-modal-card { width:min(720px,100%); max-height:85vh; overflow:auto; border:1px solid rgba(0,234,255,.3); border-radius:16px; padding:28px; background:linear-gradient(145deg,#102538,#0b1827); box-shadow:0 20px 80px rgba(0,0,0,.4); }
    .project-modal-card h3 { color:var(--cyan); font:700 28px Rajdhani; margin-bottom:8px; }
    .project-modal-card p,.project-modal-card li { color:#b6c5d2; font-size:13px; line-height:1.8; }
    .project-modal-card h4 { color:#fff; font:700 16px Rajdhani; margin:18px 0 6px; }
    .project-modal-close { float:right; border:1px solid var(--cyan); border-radius:50%; background:transparent; color:var(--cyan); width:34px; height:34px; cursor:pointer; font-size:20px; }
    @media(max-width:800px){.case-columns{grid-template-columns:1fr}.project-modal-card{padding:22px}}
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
        if (entry.isIntersecting) links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
      });
    }, { rootMargin:'-30% 0px -55% 0px', threshold:0 });
    sections.forEach(section => navObserver.observe(section));
  }

  const caseSection = document.querySelector('#case-studies');
  if (caseSection) {
    caseSection.innerHTML = `
      <small>ENGINEERING APPROACH</small>
      <h2>Professional <span>Case Studies</span></h2>
      <p class="contact-intro">A structured view of the engineering problems, methods and learning outcomes represented by my industrial and academic work.</p>
      <div class="engineering-case-list">
        <article class="engineering-case">
          <small>CASE STUDY 01 · RESEARCH & CONTROL</small>
          <h3>Induction Motor Efficiency Improvement Using FOC</h3>
          <div class="case-meta"><span>MATLAB / Simulink</span><span>IFOC</span><span>SVPWM</span><span>Three-Phase Motor</span></div>
          <div class="case-columns"><div><strong>Challenge</strong><p>Study how advanced control can improve the dynamic control of an induction motor through separate flux and torque control.</p></div><div><strong>Method</strong><p>Develop an indirect field-oriented control structure with Id–Iq PI control, rotor-flux estimation, slip calculation, coordinate transforms and SVPWM-based inverter control.</p></div><div><strong>Documented focus</strong><p>Review speed tracking, torque response, stator-current behavior and inverter switching waveforms without claiming unverified numerical improvements.</p></div></div>
        </article>
        <article class="engineering-case">
          <small>CASE STUDY 02 · INDUSTRIAL MAINTENANCE</small>
          <h3>Preventive Maintenance & Electrical Troubleshooting</h3>
          <div class="case-meta"><span>Industrial Systems</span><span>Motors</span><span>Maintenance Planning</span><span>Documentation</span></div>
          <div class="case-columns"><div><strong>Challenge</strong><p>Support reliable operation of industrial electrical equipment through planned maintenance, monitoring and troubleshooting.</p></div><div><strong>Method</strong><p>Use preventive maintenance schedules, equipment observation, fault investigation, cross-department coordination and technical documentation.</p></div><div><strong>Professional value</strong><p>Build a repeatable maintenance mindset focused on safety, traceability, communication and practical problem solving.</p></div></div>
        </article>
        <article class="engineering-case">
          <small>CASE STUDY 03 · ENGINEERING OPERATIONS</small>
          <h3>ERP-Based Central Electrical Store Operations</h3>
          <div class="case-meta"><span>ERP Operations</span><span>500+ Line Items</span><span>Inventory Coordination</span><span>Technical Records</span></div>
          <div class="case-columns"><div><strong>Challenge</strong><p>Maintain visibility and coordination for a central electrical store supporting engineering and maintenance activities.</p></div><div><strong>Method</strong><p>Work with ERP records, item coordination, documentation and communication between maintenance and related departments.</p></div><div><strong>Professional value</strong><p>Connect engineering maintenance with organized inventory handling, accountability and faster information access.</p></div></div>
        </article>
      </div>`;
  }

  const projectDetails = {
    'FOC Induction Motor': {title:'FOC Induction Motor', subtitle:'MATLAB / Simulink · Thesis', sections:[['Overview','A simulation-focused research project on induction motor control using indirect field-oriented control.'],['Technical scope','Rotor-flux orientation, Id–Iq PI controllers, flux estimation, slip calculation, Clarke/Park transforms and SVPWM-based voltage-source inverter control.'],['Evidence to present','Speed-reference tracking, torque response, stator-current waveforms and switching behavior from the validated simulation model.']]},
    'EEE Calculator Tools': {title:'EEE Calculator Tools', subtitle:'Web Engineering · HTML / CSS / JavaScript', sections:[['Overview','A collection of browser-based tools designed to make common electrical engineering calculations easier to access.'],['Technical scope','Form inputs, engineering formulas, validation, responsive UI and readable result presentation.'],['Next improvement','Add formula references, input-range guidance, calculation history and exportable results where appropriate.']]},
    'Motor & Cable Tools': {title:'Motor & Cable Tools', subtitle:'Engineering Calculations', sections:[['Overview','Practical calculator concepts for motor current, motor power and cable-related engineering checks.'],['Technical scope','Electrical quantities, user-selected operating conditions, unit handling and transparent calculation steps.'],['Engineering note','Final recommendations should be checked against applicable standards, installation conditions and manufacturer data.']]},
    'Motor Protection': {title:'Motor Protection', subtitle:'Protection & Control Concepts', sections:[['Overview','A practical topic area covering motor protection, control circuits and equipment reliability.'],['Technical scope','Overload protection, short-circuit protection, starting methods, operating conditions and maintenance checks.'],['Engineering note','Protection settings must be selected from actual motor nameplate data, coordination requirements and applicable standards.']]},
    'CircuitSecrets': {title:'CircuitSecrets', subtitle:'Technical Blog', sections:[['Overview','A technical publishing platform for electrical engineering concepts, calculators, tools and practical learning content.'],['Content focus','Motors, transformers, electrical calculations, maintenance concepts and engineering explainers.'],['Next improvement','Use consistent diagrams, worked examples, references and clear safety notes.']]},
    'Portfolio UI': {title:'Portfolio UI', subtitle:'Personal Engineering Brand', sections:[['Overview','A responsive personal portfolio that presents professional experience, academic background, research and contact information.'],['Technical scope','Semantic sections, responsive layout, downloadable CV, theme switching, scroll progress and accessible interaction states.'],['Design goal','Make technical work understandable to recruiters, engineering professionals and learners.']]}
  };
  const modal = document.createElement('div');
  modal.className = 'project-modal';
  modal.setAttribute('role','dialog');
  modal.setAttribute('aria-modal','true');
  modal.innerHTML = '<div class="project-modal-card"><button class="project-modal-close" type="button" aria-label="Close project details">×</button><div class="project-modal-content"></div></div>';
  document.body.appendChild(modal);
  const modalContent = modal.querySelector('.project-modal-content');
  const closeModal = () => modal.classList.remove('open');
  modal.querySelector('.project-modal-close').addEventListener('click', closeModal);
  modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });
  document.querySelectorAll('.projects-grid article').forEach(card => {
    const title = card.querySelector('h3')?.textContent.trim();
    if (!title || !projectDetails[title] || card.querySelector('.project-detail-button')) return;
    const button = document.createElement('button');
    button.className = 'project-detail-button';
    button.type = 'button';
    button.textContent = 'Project Details ↗';
    button.addEventListener('click', () => {
      const item = projectDetails[title];
      modalContent.innerHTML = `<h3>${item.title}</h3><p>${item.subtitle}</p>${item.sections.map(section => `<h4>${section[0]}</h4><p>${section[1]}</p>`).join('')}`;
      modal.classList.add('open');
    });
    card.appendChild(button);
  });

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
      event.preventDefault(); preview.src = image.currentSrc || image.src; preview.alt = image.alt; lightbox.classList.add('open'); document.body.style.overflow='hidden';
    });
  });

  document.querySelectorAll('img').forEach(image => {
    if (!image.hasAttribute('width')) image.setAttribute('width', image.naturalWidth || 800);
    if (!image.hasAttribute('height')) image.setAttribute('height', image.naturalHeight || 600);
    if (!image.closest('.hero') && !image.closest('.about')) image.loading = image.loading || 'lazy';
    image.decoding = 'async';
  });
})();
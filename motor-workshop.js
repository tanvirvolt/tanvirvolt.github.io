(() => {
  const addFavicon = () => {
    if (document.querySelector('link[data-tanvir-favicon]')) return;
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/svg+xml';
    link.href = 'favicon.svg';
    link.dataset.tanvirFavicon = 'true';
    document.head.appendChild(link);
  };

  const addStyles = () => {
    if (document.getElementById('motor-workshop-styles')) return;
    const style = document.createElement('style');
    style.id = 'motor-workshop-styles';
    style.textContent = `
      .motor-workshop-panel{margin-top:24px;padding:22px;border:1px solid rgba(0,234,255,.18);border-radius:14px;background:linear-gradient(135deg,rgba(0,234,255,.06),rgba(10,22,35,.35))}
      .motor-workshop-panel h3{color:var(--cyan);font:700 22px Rajdhani;margin-bottom:8px}
      .motor-workshop-panel p{color:var(--muted);font-size:12px;line-height:1.8}
      .motor-workshop-tags{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}
      .motor-workshop-tags span{padding:7px 10px;border:1px solid rgba(0,234,255,.2);border-radius:999px;color:var(--text);font-size:11px;background:rgba(0,234,255,.04)}
      .motor-workshop-points{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:16px}
      .motor-workshop-points div{padding:12px;border-left:2px solid var(--cyan);background:rgba(0,0,0,.12);color:var(--muted);font-size:11px;line-height:1.6}
      .motor-workshop-points strong{display:block;color:var(--text);font:700 15px Rajdhani;margin-bottom:3px}
      @media(max-width:600px){.motor-workshop-points{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  };

  const addSkillChips = () => {
    const chips = document.querySelector('#skills .chips');
    if (!chips || chips.dataset.motorWorkshopAdded === 'true') return;
    ['Motor Winding & Rewinding','Central Motor Workshop','Ceiling Fan Repair','Motor Troubleshooting'].forEach(label => {
      const chip = document.createElement('b');
      chip.textContent = label;
      chips.appendChild(chip);
    });
    chips.dataset.motorWorkshopAdded = 'true';
  };

  const addWorkshopPanel = () => {
    const skills = document.getElementById('skills');
    if (!skills || document.getElementById('motor-workshop-panel')) return;
    const panel = document.createElement('div');
    panel.id = 'motor-workshop-panel';
    panel.className = 'motor-workshop-panel';
    panel.innerHTML = `
      <h3>Motor Workshop & Winding Expertise</h3>
      <p>Practical knowledge of central motor workshop operations, motor winding and rewinding, ceiling fan repair, and basic motor troubleshooting in support of industrial electrical maintenance.</p>
      <div class="motor-workshop-points">
        <div><strong>Motor Winding</strong>Practical understanding of winding and rewinding work for electrical motors.</div>
        <div><strong>Central Motor Workshop</strong>Workshop coordination, repair workflow awareness and maintenance support.</div>
        <div><strong>Ceiling Fan Repair</strong>Basic repair and winding-related knowledge for ceiling fan motors.</div>
        <div><strong>Troubleshooting</strong>Observation-based fault identification and practical maintenance assistance.</div>
      </div>
      <div class="motor-workshop-tags"><span>Motor Winding</span><span>Rewinding</span><span>Workshop Operations</span><span>Ceiling Fan Repair</span><span>Maintenance Support</span></div>
    `;
    skills.appendChild(panel);
  };

  const addExperienceEntry = () => {
    const timeline = document.querySelector('#experience .timeline');
    if (!timeline || document.getElementById('motor-workshop-experience')) return;
    const entry = document.createElement('article');
    entry.id = 'motor-workshop-experience';
    entry.innerHTML = `
      <span>Practical Technical Knowledge</span>
      <h3>Motor Workshop & Winding Support</h3>
      <h4>Central Motor Workshop · Motor Repair & Maintenance</h4>
      <p>Practical knowledge of motor winding and rewinding, central motor workshop operations, ceiling fan repair and winding, and hands-on troubleshooting support related to electrical motors.</p>
    `;
    timeline.appendChild(entry);
  };

  const loadSeo = () => {
    if (document.querySelector('script[data-seo-loader]')) return;
    const script = document.createElement('script');
    script.src = 'seo.js';
    script.dataset.seoLoader = 'true';
    document.body.appendChild(script);
  };

  const init = () => {
    addFavicon();
    addStyles();
    addSkillChips();
    addWorkshopPanel();
    addExperienceEntry();
    loadSeo();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

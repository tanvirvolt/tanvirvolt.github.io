(() => {
  const $ = (id) => document.getElementById(id);
  const num = (id) => Number($(id).value);
  const fmt = (value, digits = 2) => Number.isFinite(value) ? value.toFixed(digits) : '—';
  const show = (id, text, error = false) => { const el = $(id); el.textContent = text; el.classList.toggle('is-error', error); };

  const addStyles = () => {
    if ($('eee-tools-styles')) return;
    const style = document.createElement('style');
    style.id = 'eee-tools-styles';
    style.textContent = `.eee-tools{margin-top:24px}.eee-tools-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin-top:22px}.eee-tool-card{display:flex;flex-direction:column;min-width:0;padding:20px;border:1px solid rgba(0,234,255,.16);border-radius:14px;background:linear-gradient(145deg,rgba(7,18,29,.72),rgba(0,234,255,.025));transition:transform .3s cubic-bezier(.22,1,.36,1),border-color .3s,box-shadow .3s}.eee-tool-card:hover{transform:translateY(-5px);border-color:rgba(0,234,255,.42);box-shadow:0 14px 32px rgba(0,0,0,.2),0 0 22px rgba(0,234,255,.06)}.eee-tool-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px}.eee-tool-icon{display:grid;place-items:center;width:38px;height:38px;border:1px solid rgba(0,234,255,.2);border-radius:10px;color:var(--cyan);background:rgba(0,234,255,.05);font:700 16px Rajdhani}.eee-tool-category{font:700 9px Rajdhani;letter-spacing:.12em;color:rgba(0,234,255,.62)}.eee-tool-card h3{color:var(--text);font:700 21px Rajdhani;margin-bottom:5px}.eee-tool-description{min-height:42px;color:var(--muted);font-size:11px;line-height:1.65;margin-bottom:8px}.eee-tool-fields{display:flex;flex-direction:column;flex:1}.eee-tool-card label{display:block;color:var(--muted);font-size:11px;margin-top:10px}.eee-tool-card input,.eee-tool-card select{width:100%;padding:9px;margin-top:4px;border:1px solid rgba(0,234,255,.2);border-radius:7px;background:#101f30;color:var(--text)}.eee-tool-card button{margin-top:14px;cursor:pointer}.eee-result{margin-top:12px;min-height:38px;color:var(--cyan);font-size:12px;line-height:1.7}.eee-result.is-error{color:#ff8c8c}.eee-note{margin-top:16px;color:var(--muted);font-size:11px;line-height:1.7}@media(max-width:900px){.eee-tools-grid{grid-template-columns:1fr 1fr}}@media(max-width:560px){.eee-tools-grid{grid-template-columns:1fr}.eee-tool-card{padding:17px}}@media(prefers-reduced-motion:reduce){.eee-tool-card{transition:none}.eee-tool-card:hover{transform:none}}`;
    document.head.appendChild(style);
  };

  const card = (icon, category, title, description, body) => `<article class="eee-tool-card"><div class="eee-tool-head"><span class="eee-tool-icon" aria-hidden="true">${icon}</span><span class="eee-tool-category">${category}</span></div><h3>${title}</h3><p class="eee-tool-description">${description}</p><div class="eee-tool-fields">${body}</div></article>`;
  const input = (id, label, value, step = 'any') => `<label>${label}<input id="${id}" type="number" min="0" step="${step}" value="${value}"></label>`;

  const addSection = () => {
    if ($('eee-tools')) return;
    const blogHub = $('technical-blog-hub');
    const projects = $('projects');
    if (!blogHub && !projects) return;
    const section = document.createElement('section');
    section.id = 'eee-tools';
    section.className = 'panel eee-tools';
    section.innerHTML = `<small>INTERACTIVE ENGINEERING LAB</small><h2>Engineering Tools <span>& Calculators</span></h2><p>Interactive engineering utilities for quick learning, preliminary calculations and technical reference.</p><div class="eee-tools-grid">${card('∿','MOTOR / MACHINES','Motor Current','Estimate full-load current from motor power, voltage, efficiency and power factor.',`${input('mc-power','Motor power (kW)',7)}${input('mc-voltage','Voltage (V)',400)}${input('mc-efficiency','Efficiency (%)',90)}${input('mc-pf','Power factor (0–1)',0.85,0.01)}<label>Supply<input id="mc-phase" type="text" value="3" placeholder="1 or 3"></label><button class="btn" id="mc-calc">Try Calculator ↗</button><div class="eee-result" id="mc-result">Enter values and calculate.</div>`)}${card('↕','CABLE / POWER','Cable Voltage Drop','Estimate voltage drop using current, one-way length and conductor area.',`${input('cc-current','Current (A)',15)}${input('cc-length','One-way length (m)',30)}${input('cc-voltage','System voltage (V)',400)}${input('cc-area','Conductor area (mm²)',2.5,0.5)}<button class="btn" id="cc-calc">Try Calculator ↗</button><div class="eee-result" id="cc-result">Copper approximation using a simplified resistance model.</div>`)}${card('PF','POWER QUALITY','Power Factor','Calculate apparent power and reactive power from active power and PF.',`${input('pf-kw','Active power (kW)',10)}${input('pf-value','Power factor (0–1)',0.8,0.01)}<button class="btn" id="pf-calc">Try Calculator ↗</button><div class="eee-result" id="pf-result">Enter kW and PF to calculate kVA and kVAR.</div>`)} </div><p class="eee-note">Educational and preliminary estimation tools only. Confirm ampacity, correction factors, installation method, protection, voltage-drop limits and applicable standards before practical electrical design.</p>`;
    const anchor = blogHub || projects;
    anchor.insertAdjacentElement('afterend', section);
  };

  function motorCurrent() {
    const phase = $('mc-phase').value.trim(); const power = num('mc-power'); const voltage = num('mc-voltage'); const efficiency = num('mc-efficiency') / 100; const pf = num('mc-pf');
    if (!['1','3'].includes(phase) || power <= 0 || voltage <= 0 || efficiency <= 0 || efficiency > 1 || pf <= 0 || pf > 1) return show('mc-result', 'Use supply 1 or 3 and valid positive values.', true);
    const current = power * 1000 / ((phase === '3' ? Math.sqrt(3) : 1) * voltage * efficiency * pf);
    show('mc-result', `Estimated rated current: ${fmt(current)} A`);
  }

  function cableCalc() {
    const current = num('cc-current'); const length = num('cc-length'); const voltage = num('cc-voltage'); const area = num('cc-area');
    if (current <= 0 || length <= 0 || voltage <= 0 || area <= 0) return show('cc-result', 'Enter valid positive values.', true);
    const resistance = 0.0175 * (2 * length) / area; const drop = current * resistance; const percent = drop / voltage * 100;
    show('cc-result', `Approx. voltage drop: ${fmt(drop)} V (${fmt(percent)}%).`);
  }

  function pfCalc() {
    const kw = num('pf-kw'); const pf = num('pf-value');
    if (kw <= 0 || pf <= 0 || pf > 1) return show('pf-result', 'Enter valid kW and PF between 0 and 1.', true);
    const kva = kw / pf; const kvar = Math.sqrt(Math.max(0, kva * kva - kw * kw));
    show('pf-result', `Apparent power: ${fmt(kva)} kVA | Reactive power: ${fmt(kvar)} kVAR`);
  }

  const init = () => { addStyles(); addSection(); $('mc-calc')?.addEventListener('click', motorCurrent); $('cc-calc')?.addEventListener('click', cableCalc); $('pf-calc')?.addEventListener('click', pfCalc); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

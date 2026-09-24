(() => {
  const $ = (id) => document.getElementById(id);
  const num = (id) => Number($(id).value);
  const fmt = (value, digits = 2) => Number.isFinite(value) ? value.toFixed(digits) : '—';
  const show = (id, text, error = false) => { const el = $(id); el.textContent = text; el.classList.toggle('is-error', error); };

  function motorCurrent() {
    const phase = $('mc-phase').value;
    const power = num('mc-power');
    const voltage = num('mc-voltage');
    const efficiency = num('mc-efficiency') / 100;
    const pf = num('mc-pf');
    if (power <= 0 || voltage <= 0 || efficiency <= 0 || efficiency > 1 || pf <= 0 || pf > 1) return show('mc-result', 'Enter valid positive values. Efficiency and PF must be between 0 and 100%.', true);
    const watts = power * 1000;
    const current = phase === '3' ? watts / (Math.sqrt(3) * voltage * efficiency * pf) : watts / (voltage * efficiency * pf);
    show('mc-result', `Estimated rated current: ${fmt(current)} A`);
  }

  function cableCalc() {
    const current = num('cc-current');
    const length = num('cc-length');
    const voltage = num('cc-voltage');
    const area = num('cc-area');
    const resistivity = 0.0175;
    if (current <= 0 || length <= 0 || voltage <= 0 || area <= 0) return show('cc-result', 'Enter valid positive values.', true);
    const resistance = resistivity * (2 * length) / area;
    const drop = current * resistance;
    const percent = (drop / voltage) * 100;
    show('cc-result', `Approx. voltage drop: ${fmt(drop)} V (${fmt(percent)}%). Verify ampacity, derating, installation method and local standards before selection.`);
  }

  function pfCalc() {
    const kw = num('pf-kw');
    const pf = num('pf-value');
    if (kw <= 0 || pf <= 0 || pf > 1) return show('pf-result', 'Enter valid kW and PF (0–1).', true);
    const kva = kw / pf;
    const kvar = Math.sqrt(Math.max(0, kva * kva - kw * kw));
    show('pf-result', `Apparent power: ${fmt(kva)} kVA | Reactive power: ${fmt(kvar)} kVAR`);
  }

  ['mc-calc','cc-calc','pf-calc'].forEach((id) => $(id).addEventListener('click', { 'mc-calc': motorCurrent, 'cc-calc': cableCalc, 'pf-calc': pfCalc }[id]));
})();

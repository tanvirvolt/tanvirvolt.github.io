(() => {
  const thesis = document.querySelector('#thesis');
  if (!thesis || document.querySelector('#interactive-thesis-showcase')) return;

  const style = document.createElement('style');
  style.textContent = `
    #interactive-thesis-showcase{margin-top:30px;padding:22px;border:1px solid rgba(0,234,255,.22);border-radius:16px;background:linear-gradient(145deg,rgba(7,18,29,.86),rgba(13,30,58,.55))}
    .thesis-showcase-head{display:flex;justify-content:space-between;align-items:flex-start;gap:18px;flex-wrap:wrap}
    .thesis-showcase-head h3{font:700 24px Rajdhani;color:var(--cyan);margin:6px 0}
    .thesis-showcase-head p{max-width:620px;color:var(--muted);font-size:12px;line-height:1.7}
    .thesis-status{display:inline-flex;align-items:center;gap:7px;padding:7px 10px;border:1px solid rgba(0,234,255,.25);border-radius:999px;color:var(--cyan);font-size:10px}
    .thesis-status:before{content:'';width:7px;height:7px;border-radius:50%;background:var(--cyan);box-shadow:0 0 10px var(--cyan)}
    .thesis-metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:20px 0}
    .thesis-metric{padding:15px;border-radius:12px;background:rgba(0,0,0,.18);border:1px solid rgba(0,234,255,.13)}
    .thesis-metric strong{display:block;color:var(--cyan);font:700 24px Rajdhani}.thesis-metric span{font-size:10px;color:var(--muted)}
    .thesis-chart-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
    .thesis-chart{padding:18px;border-radius:12px;background:rgba(0,0,0,.18);border:1px solid rgba(0,234,255,.13)}
    .thesis-chart h4{font:700 17px Rajdhani;color:var(--text);margin-bottom:5px}.thesis-chart p{font-size:11px;color:var(--muted);line-height:1.6}
    .chart-bars{display:grid;gap:12px;margin-top:18px}.chart-row{display:grid;grid-template-columns:105px 1fr 38px;align-items:center;gap:8px;font-size:10px;color:var(--muted)}
    .chart-track{height:9px;border-radius:999px;background:rgba(255,255,255,.08);overflow:hidden}.chart-fill{height:100%;width:var(--value);background:linear-gradient(90deg,var(--cyan),#7cf6ff);border-radius:999px}
    .waveform{width:100%;height:125px;margin-top:14px;border:1px solid rgba(0,234,255,.12);border-radius:8px;background:rgba(0,0,0,.16)}
    .thesis-disclaimer{margin-top:16px;padding:11px 13px;border-left:2px solid var(--cyan);color:var(--muted);font-size:10px;line-height:1.6}
    @media(max-width:800px){.thesis-metrics{grid-template-columns:repeat(2,1fr)}.thesis-chart-grid{grid-template-columns:1fr}}
    @media(max-width:560px){.thesis-metric strong{font-size:21px}.chart-row{grid-template-columns:88px 1fr 32px}}
  `;
  document.head.appendChild(style);

  thesis.insertAdjacentHTML('beforeend', `
    <div id="interactive-thesis-showcase" aria-label="Interactive thesis showcase">
      <div class="thesis-showcase-head">
        <div><small>RESEARCH DASHBOARD</small><h3>Inside the FOC Simulation</h3><p>Explore the main control blocks, documented simulation focus and representative visual explanations of the thesis model.</p></div>
        <span class="thesis-status">Simulation-focused research</span>
      </div>
      <div class="thesis-metrics">
        <div class="thesis-metric"><strong>IFOC</strong><span>Control strategy</span></div>
        <div class="thesis-metric"><strong>Id–Iq</strong><span>PI control loops</span></div>
        <div class="thesis-metric"><strong>SVPWM</strong><span>Inverter modulation</span></div>
        <div class="thesis-metric"><strong>3-Phase</strong><span>Motor model</span></div>
      </div>
      <div class="thesis-chart-grid">
        <article class="thesis-chart"><h4>Control Architecture</h4><p>Conceptual representation of the principal research blocks. Bars indicate topic presence, not measured performance.</p><div class="chart-bars"><div class="chart-row"><span>Flux control</span><div class="chart-track"><div class="chart-fill" style="--value:90%"></div></div><b>Core</b></div><div class="chart-row"><span>Torque control</span><div class="chart-track"><div class="chart-fill" style="--value:86%"></div></div><b>Core</b></div><div class="chart-row"><span>SVPWM</span><div class="chart-track"><div class="chart-fill" style="--value:82%"></div></div><b>Core</b></div><div class="chart-row"><span>Transforms</span><div class="chart-track"><div class="chart-fill" style="--value:78%"></div></div><b>Core</b></div></div></article>
        <article class="thesis-chart"><h4>Representative Response View</h4><p>Illustrative waveform for explaining speed-reference tracking and response behavior. It is not a measured result.</p><svg class="waveform" viewBox="0 0 520 125" role="img" aria-label="Illustrative reference and actual speed response waveform"><line x1="30" y1="102" x2="500" y2="102" stroke="currentColor" opacity=".25"/><line x1="30" y1="20" x2="30" y2="102" stroke="currentColor" opacity=".25"/><path d="M30 95 L90 95 L100 35 L180 35 L195 43 L220 35 L500 35" fill="none" stroke="#00eaff" stroke-width="3" stroke-linecap="round"/><path d="M30 95 C70 95 82 90 100 72 S125 45 155 41 S180 36 210 35 L500 35" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="6 5" opacity=".85"/><text x="38" y="16" fill="currentColor" opacity=".7" font-size="10">Speed</text><text x="420" y="116" fill="currentColor" opacity=".7" font-size="10">Time →</text></svg><div class="case-tags"><span>Reference</span><span>Actual response</span><span>Illustrative</span></div></article>
      </div>
      <div class="thesis-disclaimer">Research transparency: the dashboard describes the documented model and uses an illustrative chart. Replace the illustrative view with verified MATLAB/Simulink plots when final measured data is available.</div>
    </div>`);
})();
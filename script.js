const menu = document.getElementById('menu');
const nav = document.getElementById('nav');
const form = document.getElementById('form');
const year = document.getElementById('year');

if (year) year.textContent = new Date().getFullYear();

if (menu && nav) {
  menu.addEventListener('click', () => nav.classList.toggle('open'));
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });
}

/* Thesis showcase: uses the image files uploaded to assets/thesis. */
const thesisCopy = document.querySelector('.thesis-copy');
if (thesisCopy && !document.querySelector('.thesis-gallery')) {
  const style = document.createElement('style');
  style.textContent = `
    .thesis-gallery{margin-top:28px;display:grid;grid-template-columns:1fr 1fr;gap:14px;position:relative;z-index:2}
    .thesis-shot{margin:0;background:rgba(7,18,29,.72);border:1px solid rgba(0,234,255,.24);border-radius:12px;overflow:hidden;box-shadow:0 0 22px rgba(0,234,255,.06);transition:transform .3s ease,border-color .3s ease}
    .thesis-shot:hover{transform:translateY(-5px);border-color:rgba(0,234,255,.75)}
    .thesis-shot a{display:block}
    .thesis-shot img{display:block;width:100%;height:170px;object-fit:cover;object-position:center;background:#07121d}
    .thesis-shot figcaption{padding:11px 12px;color:var(--muted);font-size:11px;line-height:1.5}
    .thesis-shot figcaption strong{display:block;color:var(--cyan);font:700 15px Rajdhani;margin-bottom:3px}
    .thesis-note{margin-top:12px;color:var(--muted);font-size:11px;line-height:1.6}
    .case-study-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}
    .case-study-grid article{position:relative;overflow:hidden;min-height:190px}
    .case-study-grid article::before{content:'';position:absolute;inset:0 auto 0 0;width:3px;background:var(--cyan);box-shadow:0 0 14px rgba(0,234,255,.6)}
    .case-study-grid .case-label{display:inline-block;margin-bottom:8px;color:var(--cyan);font:700 12px Rajdhani;letter-spacing:1.5px;text-transform:uppercase}
    .case-study-grid h3{font:700 21px Rajdhani;color:var(--text);margin-bottom:8px}
    .case-study-grid ul{padding-left:17px;margin:10px 0 0;color:var(--muted);font-size:12px;line-height:1.8}
    .case-study-grid .case-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:13px}
    .case-study-grid .case-tags span{border:1px solid rgba(0,234,255,.22);border-radius:999px;padding:4px 8px;color:var(--cyan);font-size:10px}
    .case-study-grid .case-link{display:inline-block;margin-top:14px;color:var(--cyan);font-size:12px;text-decoration:none}
    @media(max-width:800px){.thesis-gallery{grid-template-columns:1fr 1fr}.case-study-grid{grid-template-columns:1fr 1fr}}
    @media(max-width:560px){.thesis-gallery{grid-template-columns:1fr}.thesis-shot img{height:210px}.case-study-grid{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);
  thesisCopy.insertAdjacentHTML('beforeend', `
    <div class="thesis-gallery" aria-label="Thesis project visuals">
      <figure class="thesis-shot">
        <a href="assets/thesis/foc-circuit.png.png" target="_blank" rel="noopener">
          <img src="assets/thesis/foc-circuit.png.png" alt="MATLAB Simulink field oriented control induction motor circuit diagram" loading="lazy">
        </a>
        <figcaption><strong>System Architecture</strong>FOC controller, inverse Park transformation, SVPWM, three-phase inverter and induction motor.</figcaption>
      </figure>
      <figure class="thesis-shot">
        <a href="assets/thesis/speed-response.png.jpg" target="_blank" rel="noopener">
          <img src="assets/thesis/speed-response.png.jpg" alt="Reference speed versus actual motor speed simulation result" loading="lazy">
        </a>
        <figcaption><strong>Simulation Result</strong>Reference speed versus actual motor speed under step changes.</figcaption>
      </figure>
    </div>
    <p class="thesis-note">Project visuals are presented from the uploaded MATLAB/Simulink model and simulation output. Open an image to view it in full size.</p>
  `);
}

/* Expanded engineering case studies. */
const caseStudyGrid = document.querySelector('.case-study-grid');
if (caseStudyGrid) {
  caseStudyGrid.innerHTML = `
    <article>
      <span class="case-label">Case Study 01</span>
      <h3>FOC Induction Motor Control</h3>
      <p>Advanced control research project focused on improving induction motor control using MATLAB/Simulink.</p>
      <ul>
        <li><strong>Objective:</strong> Study flux and torque decoupling with field-oriented control.</li>
        <li><strong>Methodology:</strong> Clarke/Park transformations, PI control, slip calculation and SVPWM.</li>
        <li><strong>Implementation:</strong> Three-phase VSI and induction motor simulation model.</li>
        <li><strong>Observation:</strong> Review speed tracking, torque response and current waveforms from the simulation.</li>
      </ul>
      <div class="case-tags"><span>IFOC</span><span>SVPWM</span><span>MATLAB</span><span>Simulink</span></div>
      <a class="case-link" href="#thesis">View Thesis Showcase ↗</a>
    </article>
    <article>
      <span class="case-label">Case Study 02</span>
      <h3>Industrial Electrical Maintenance</h3>
      <p>Practical engineering work involving maintenance planning, troubleshooting support and equipment monitoring.</p>
      <ul>
        <li><strong>Objective:</strong> Support reliable operation of industrial electrical systems.</li>
        <li><strong>Methodology:</strong> Preventive maintenance scheduling, inspection and documentation.</li>
        <li><strong>Implementation:</strong> Motor and AC monitoring, coordination and maintenance records.</li>
        <li><strong>Observation:</strong> Record verified maintenance activities and lessons learned without exposing confidential company data.</li>
      </ul>
      <div class="case-tags"><span>Maintenance</span><span>Troubleshooting</span><span>Safety</span></div>
      <a class="case-link" href="#experience">View Experience ↗</a>
    </article>
    <article>
      <span class="case-label">Case Study 03</span>
      <h3>ERP Electrical Store Operations</h3>
      <p>Engineering inventory and documentation workflow supporting electrical maintenance activities.</p>
      <ul>
        <li><strong>Objective:</strong> Organize and support electrical material availability.</li>
        <li><strong>Methodology:</strong> ERP-based tracking and maintenance-related documentation.</li>
        <li><strong>Implementation:</strong> Central electrical store operations involving 500+ line items.</li>
        <li><strong>Learning:</strong> Connect inventory coordination with maintenance planning and team communication.</li>
      </ul>
      <div class="case-tags"><span>ERP</span><span>Inventory</span><span>Documentation</span></div>
      <a class="case-link" href="#experience">View Work Experience ↗</a>
    </article>
    <article>
      <span class="case-label">Case Study 04</span>
      <h3>EEE Calculator & Technical Tools</h3>
      <p>Technical content and calculator concepts created for electrical engineering learners and practitioners.</p>
      <ul>
        <li><strong>Objective:</strong> Present electrical calculations in a practical and accessible format.</li>
        <li><strong>Methodology:</strong> Formula-based input, validation and clear result presentation.</li>
        <li><strong>Implementation:</strong> Motor, cable and electrical engineering tool concepts.</li>
        <li><strong>Learning:</strong> Combine engineering theory with user-friendly web interfaces.</li>
      </ul>
      <div class="case-tags"><span>HTML</span><span>CSS</span><span>JavaScript</span><span>EEE</span></div>
      <a class="case-link" href="https://circuitsecrets.blogspot.com" target="_blank" rel="noopener">Visit CircuitSecrets ↗</a>
    </article>
    <article>
      <span class="case-label">Case Study 05</span>
      <h3>Motor Protection & Control Concepts</h3>
      <p>Engineering study area covering motor protection, control circuits and safe operating principles.</p>
      <ul>
        <li><strong>Objective:</strong> Understand protection and control requirements for motors.</li>
        <li><strong>Methodology:</strong> Review control logic, protection components and operating conditions.</li>
        <li><strong>Implementation:</strong> Study motor control circuits and protection fundamentals.</li>
        <li><strong>Learning:</strong> Relate theory to practical troubleshooting and maintenance work.</li>
      </ul>
      <div class="case-tags"><span>Motor Control</span><span>Protection</span><span>EEE</span></div>
      <a class="case-link" href="#skills">View Technical Skills ↗</a>
    </article>
    <article>
      <span class="case-label">Case Study 06</span>
      <h3>Technical Knowledge Publishing</h3>
      <p>Ongoing technical blogging through CircuitSecrets, focused on electrical engineering and technology topics.</p>
      <ul>
        <li><strong>Objective:</strong> Share practical engineering knowledge with learners and professionals.</li>
        <li><strong>Methodology:</strong> Research, explain and structure technical topics for online readers.</li>
        <li><strong>Implementation:</strong> Articles, calculators and educational engineering content.</li>
        <li><strong>Learning:</strong> Improve technical writing, communication and knowledge organization.</li>
      </ul>
      <div class="case-tags"><span>Technical Writing</span><span>Research</span><span>Blogging</span></div>
      <a class="case-link" href="https://circuitsecrets.blogspot.com" target="_blank" rel="noopener">Read Blog ↗</a>
    </article>
  `;
}

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('show'));
}

if (form) {
  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const subject = encodeURIComponent(data.get('subject') || 'Portfolio Contact');
    const body = encodeURIComponent(`Name: ${data.get('name') || ''}\nEmail: ${data.get('email') || ''}\nPhone: ${data.get('phone') || ''}\n\n${data.get('message') || ''}`);
    window.location.href = `mailto:mohammadtanberulislam@gmail.com?subject=${subject}&body=${body}`;
  });
}

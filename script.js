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
    @media(max-width:800px){.thesis-gallery{grid-template-columns:1fr 1fr}}
    @media(max-width:560px){.thesis-gallery{grid-template-columns:1fr}.thesis-shot img{height:210px}}
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

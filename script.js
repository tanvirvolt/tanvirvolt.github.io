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

if (form) {
  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const subject = encodeURIComponent(data.get('subject') || 'Portfolio Contact');
    const body = encodeURIComponent(
      `Name: ${data.get('name') || ''}\nEmail: ${data.get('email') || ''}\nPhone: ${data.get('phone') || ''}\n\n${data.get('message') || ''}`
    );
    window.location.href = `mailto:mohammadtanberulislam@gmail.com?subject=${subject}&body=${body}`;
  });
}

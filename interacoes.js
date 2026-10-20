// Interações da versão HTML editável. A cena 3D permanece na versão publicada (index.html).
const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('#main-menu');
toggle?.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') !== 'true'; toggle.setAttribute('aria-expanded', String(open)); menu?.classList.toggle('open', open); });
menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { toggle?.setAttribute('aria-expanded', 'false'); menu.classList.remove('open'); }));
const observer = new IntersectionObserver(entries => entries.forEach(e => {if(e.isIntersecting)e.target.classList.add('visible','is-visible','active');}),{threshold:0.12});
document.querySelectorAll('.reveal').forEach(e=>observer.observe(e));

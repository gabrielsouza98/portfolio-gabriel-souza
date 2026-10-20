// Interações da página estática e cena Spline original.
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#main-menu');
  const close = () => { toggle?.setAttribute('aria-expanded', 'false'); menu?.classList.remove('is-open', 'open'); };
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    menu?.classList.toggle('is-open', open);
  });
  menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  const animate = (el, frames, options) => { if (!reduced.matches) el.animate(frames, options); };
  const observer = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    animate(e.target, [{opacity:0, transform:'translateY(28px)'}, {opacity:1, transform:'translateY(0)'}], {duration:800, easing:'cubic-bezier(.16,1,.3,1)'});
    observer.unobserve(e.target);
  }), {threshold:0.12});
  document.querySelectorAll('.reveal,.project-card').forEach(el => observer.observe(el));
  document.querySelectorAll('.hero-copy > *').forEach((el, i) => animate(el,
    [{opacity:0, transform:'translateY(24px)'}, {opacity:1, transform:'translateY(0)'}],
    {duration:850, delay:i*80, easing:'cubic-bezier(.16,1,.3,1)', fill:'backwards'}));
  document.querySelectorAll('.card-spotlight').forEach(light => {
    const card = light.parentElement;
    card.addEventListener('pointermove', e => {
      if (reduced.matches || e.pointerType === 'touch') return;
      const rect = card.getBoundingClientRect();
      light.style.left = (e.clientX - rect.left - light.offsetWidth/2) + 'px';
      light.style.top = (e.clientY - rect.top - light.offsetHeight/2) + 'px';
      light.style.opacity = '1';
    });
    card.addEventListener('pointerleave', () => { light.style.opacity = '0'; });
  });
  const chapters = [...document.querySelectorAll('.chapter')];
  const links = [...document.querySelectorAll('.connection-map > span')];
  let pending = false, current = -1;
  function update() {
    pending = false;
    document.querySelector('.site-header')?.classList.toggle('scrolled', scrollY > 90);
    const body = document.querySelector('.story-body');
    if (body) {
      const rect = body.getBoundingClientRect();
      body.style.setProperty('--story-progress', String(Math.max(0, Math.min(1, (innerHeight*.5 - rect.top)/rect.height))));
    }
    let nearest = 0, distance = Infinity;
    chapters.forEach((el, i) => {
      const rect = el.getBoundingClientRect();
      const d = Math.abs(rect.top + rect.height/2 - innerHeight/2);
      if (d < distance) { nearest = i; distance = d; }
    });
    if (nearest !== current) {
      current = nearest;
      chapters.forEach((el, i) => el.classList.toggle('is-current', i === nearest));
      links.forEach((el, i) => el.classList.toggle('current', i === nearest));
      const counter = document.querySelector('.chapter-counter > span');
      if (counter) { counter.textContent = String(nearest + 1).padStart(2, '0'); animate(counter, [{opacity:0,transform:'translateY(15px)'},{opacity:1,transform:'translateY(0)'}],{duration:400}); }
    }
  }
  const queue = () => { if (!pending) { pending = true; requestAnimationFrame(update); } };
  addEventListener('scroll', queue, {passive:true});
  addEventListener('resize', queue);
  update();
  async function loadRobot() {
    const frame = document.querySelector('.scene-frame');
    if (!frame) return;
    const canvas = document.createElement('canvas');
    canvas.className = 'spline-canvas';
    canvas.setAttribute('aria-label', 'Robô 3D interativo');
    canvas.style.opacity = '0';
    frame.append(canvas);
    try {
      let runtime;
      try { runtime = await import('https://cdn.jsdelivr.net/npm/@splinetool/runtime/build/runtime.js'); }
      catch { runtime = await import('https://unpkg.com/@splinetool/runtime/build/runtime.js'); }
      const app = new runtime.Application(canvas);
      await app.load(new URL('./assets/scene.splinecode', document.baseURI).href);
      frame.querySelector('.scene-placeholder')?.remove();
      canvas.style.opacity = '1';
      frame.dataset.sceneStatus = 'loaded';
      addEventListener('pagehide', () => app.dispose(), {once:true});
    } catch (error) {
      canvas.remove();
      frame.dataset.sceneStatus = 'error';
      console.error('Não foi possível carregar a cena 3D:', error);
    }
  }
  loadRobot();
})();

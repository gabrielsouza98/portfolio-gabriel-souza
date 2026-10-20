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
      try { runtime = await import('https://cdn.jsdelivr.net/npm/@splinetool/runtime@1.9.82/build/runtime.js'); }
      catch { runtime = await import('https://unpkg.com/@splinetool/runtime@1.9.82/build/runtime.js'); }
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

/* Demonstrações visuais da vitrine: sem câmera ou acesso a arquivos. */
(() => {
  const canvas = document.querySelector('.particle-preview');
  const stage = canvas?.closest('.particle-stage');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (canvas && stage) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      let width=1,height=1,points=[],mode='repel',frame=0,visible=false,time=0;
      const pointer={x:0,y:0,active:false};
      function resize() {
        const box=stage.getBoundingClientRect();
        width=box.width; height=box.height;
        const ratio=Math.min(devicePixelRatio||1,2);
        canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);
        ctx.setTransform(ratio,0,0,ratio,0,0);
        points=Array.from({length:190},(_,i)=>{
          const angle=i*2.39996, radius=Math.sqrt(i/190)*Math.min(width*.47,height*.48);
          return {x:width*.68+Math.cos(angle)*radius,y:height*.48+Math.sin(angle)*radius,
            bx:width*.68+Math.cos(angle)*radius,by:height*.48+Math.sin(angle)*radius,
            vx:0,vy:0,size:1+(i%4)*.55};
        });
        if(reduced.matches) draw();
      }
      function draw() {
        ctx.clearRect(0,0,width,height);
        const moving=!reduced.matches;
        if(moving)time+=.015;
        for(const p of points) {
          if(moving){
            let dx=p.x-pointer.x,dy=p.y-pointer.y,d=Math.hypot(dx,dy)||1;
            p.vx+=(p.bx+Math.sin(time+p.by*.02)*12-p.x)*.008;
            p.vy+=(p.by+Math.cos(time+p.bx*.02)*12-p.y)*.008;
            if(pointer.active && d<160){
              const force=(1-d/160)*1.4;
              if(mode==='orbit'){p.vx+=(-dy/d)*force;p.vy+=(dx/d)*force;}
              else {const sign=mode==='attract'?-1:1;p.vx+=(dx/d)*force*sign;p.vy+=(dy/d)*force*sign;}
            }
            p.vx*=.9;p.vy*=.9;p.x+=p.vx;p.y+=p.vy;
          }
          const glow=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.size*4);
          glow.addColorStop(0,'rgba(183,187,255,.85)');glow.addColorStop(1,'rgba(124,112,255,0)');
          ctx.fillStyle=glow;ctx.beginPath();ctx.arc(p.x,p.y,p.size*4,0,Math.PI*2);ctx.fill();
          ctx.fillStyle='#cbd6ff';ctx.beginPath();ctx.arc(p.x,p.y,p.size*.65,0,Math.PI*2);ctx.fill();
        }
      }
      function loop(){frame=0;draw();if(visible&&!document.hidden&&!reduced.matches)frame=requestAnimationFrame(loop);}
      function start(){if(visible&&!document.hidden&&!reduced.matches&&!frame)frame=requestAnimationFrame(loop);}
      stage.addEventListener('pointermove',e=>{const b=stage.getBoundingClientRect();pointer.x=e.clientX-b.left;pointer.y=e.clientY-b.top;pointer.active=true;});
      stage.addEventListener('pointerleave',()=>pointer.active=false);
      stage.addEventListener('pointerup',e=>{if(e.pointerType==='touch')pointer.active=false;});
      stage.querySelectorAll('[data-particle-mode]').forEach(button=>button.addEventListener('click',()=>{
        mode=button.dataset.particleMode;
        stage.dataset.particleMode=mode;
        stage.querySelectorAll('[data-particle-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
      }));
      new ResizeObserver(resize).observe(stage);
      new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)start();else{cancelAnimationFrame(frame);frame=0;}},{threshold:.01}).observe(stage);
      document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else start();});
      reduced.addEventListener('change',()=>{cancelAnimationFrame(frame);frame=0;if(reduced.matches)draw();else start();});
      resize();
    }
  }
  const server=document.querySelector('.server-stage');
  const send=server?.querySelector('.transfer-button');
  const status=server?.querySelector('.received-file');
  let count=0;
  send?.addEventListener('click',()=>{
    count++;send.disabled=true;status.textContent='Transferindo foto-demo.jpg…';
    server.classList.add('is-transferring');
    setTimeout(()=>{
      server.classList.remove('is-transferring');
      status.textContent='✓ foto-demo.jpg recebida';
      send.disabled=false;
      send.innerHTML='Simular novamente <span aria-hidden="true">↗</span>';
      server.dataset.transfers=String(count);
    },reduced.matches?250:3000);
  });
})();

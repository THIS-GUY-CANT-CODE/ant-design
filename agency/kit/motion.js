// Second Coat motion kit: shared micro-interactions, inlined into each site by scripts/kit.js.
//   [data-split]              words rise out of a mask when the element scrolls into view
//   .kit-rv                   fade-up reveal; siblings stagger via --i
//   .mag                      magnetic buttons that lean towards the pointer
//   [data-tilt]               3D tilt that follows the pointer
//   [data-speed="0.2"]        parallax drift while scrolling
//   [data-depth="20"]         drifts against the pointer (don't combine with data-speed on one element)
//   <body data-kit-cursor>    custom dot-and-ring cursor; [data-cursor="Play"] shows a label
// Everything is skipped under prefers-reduced-motion, and pointer effects only run for a fine pointer.
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const $$ = s => [...document.querySelectorAll(s)];

  // split text into masked words, keeping inline markup (em, b, span) intact
  $$('[data-split]').forEach(el => {
    if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    let i = 0;
    const walk = node => [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(w => {
          if (!w) return;
          if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(w)); return; }
          const o = document.createElement('span'), inn = document.createElement('span');
          o.className = 'kw'; o.setAttribute('aria-hidden', 'true'); inn.textContent = w; inn.style.setProperty('--i', i++); o.appendChild(inn); frag.appendChild(o);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && !n.matches('br,svg,img')) { n.setAttribute('aria-hidden', 'true'); walk(n); }
    });
    walk(el);
  });
  $$('[data-stagger]').forEach(p => [...p.children].forEach((c, i) => { c.classList.add('kit-rv'); c.style.setProperty('--i', i); }));

  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('kit-in'); io.unobserve(e.target); } }), { threshold: .15, rootMargin: '0px 0px -5% 0px' });
  $$('[data-split],.kit-rv').forEach(el => reduce ? el.classList.add('kit-in') : io.observe(el));
  if (reduce) return;

  // scroll progress + parallax, one rAF per frame
  const bar = document.createElement('div'); bar.className = 'kit-progress'; bar.setAttribute('aria-hidden', 'true'); document.body.appendChild(bar);
  const par = $$('[data-speed]'); let ticking = false;
  const onScroll = () => { if (ticking) return; ticking = true; requestAnimationFrame(() => {
    const h = document.documentElement.scrollHeight - innerHeight; bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
    par.forEach(el => { const r = el.getBoundingClientRect(); const c = r.top + r.height / 2 - innerHeight / 2; el.style.translate = `0 ${(-c * +el.dataset.speed).toFixed(1)}px`; });
    ticking = false; }); };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  if (!fine) return;
  // magnetic buttons
  $$('.mag').forEach(b => {
    b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); b.style.translate = `${(e.clientX - r.left - r.width / 2) * .28}px ${(e.clientY - r.top - r.height / 2) * .38}px`; });
    b.addEventListener('pointerleave', () => { b.style.translate = ''; });
  });
  // tilt
  $$('[data-tilt]').forEach(c => {
    const k = +c.dataset.tilt || 8;
    c.addEventListener('pointermove', e => { const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; c.style.transform = `perspective(900px) rotateY(${x * k}deg) rotateX(${-y * k}deg)`; });
    c.addEventListener('pointerleave', () => { c.style.transform = ''; });
  });
  // mouse-depth parallax: [data-depth="20"] drifts up to 20px against the pointer
  const deep = $$('[data-depth]');
  if (deep.length) { let mx = 0, my = 0, cx = 0, cy = 0;
    addEventListener('pointermove', e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; });
    (function drift() { cx += (mx - cx) * .06; cy += (my - cy) * .06; deep.forEach(el => { const d = +el.dataset.depth; el.style.translate = `${(-cx * d).toFixed(2)}px ${(-cy * d).toFixed(2)}px`; }); requestAnimationFrame(drift); })(); }
  // custom cursor
  if (document.body.hasAttribute('data-kit-cursor')) {
    const dot = document.createElement('div'), ring = document.createElement('div'), lab = document.createElement('span');
    dot.className = 'kit-cursor gone'; ring.className = 'kit-ring gone'; ring.appendChild(lab); dot.setAttribute('aria-hidden', 'true'); ring.setAttribute('aria-hidden', 'true');
    document.body.append(dot, ring); document.documentElement.classList.add('kit-hide-cursor');
    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
    addEventListener('pointermove', e => { x = e.clientX; y = e.clientY; dot.classList.remove('gone'); ring.classList.remove('gone');
      const t = e.target && e.target.closest ? e.target.closest('[data-cursor],a,button,input[type=range],label') : null;
      ring.classList.toggle('label', !!(t && t.dataset.cursor)); ring.classList.toggle('link', !!(t && !t.dataset.cursor));
      lab.textContent = t && t.dataset.cursor || ''; });
    document.addEventListener('pointerleave', () => { dot.classList.add('gone'); ring.classList.add('gone'); });
    addEventListener('pointerdown', () => ring.classList.add('down')); addEventListener('pointerup', () => ring.classList.remove('down'));
    (function loop() { rx += (x - rx) * .18; ry += (y - ry) * .18; dot.style.translate = `${x}px ${y}px`; ring.style.translate = `${rx}px ${ry}px`; requestAnimationFrame(loop); })();
  }
})();

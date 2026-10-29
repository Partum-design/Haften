/* HAFTEN — capa "pro": cinta de marcas, relieve 3D en tarjetas,
   historia interactiva y carga diferida del visor 3D / rayos X. */
(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  /* ── PRELOADER ── */
  var root = document.documentElement;
  var ready = function () { root.classList.add('pro-ready'); };
  var loader = document.getElementById('loader');
  if (loader) {
    var seen = false;
    try { seen = sessionStorage.getItem('hf-pl') === '1'; sessionStorage.setItem('hf-pl', '1'); } catch (e) {}
    var quick = seen || reduce || document.body.classList.contains('no-anim');
    loader.innerHTML =
      '<div class="pl" aria-hidden="true">' +
        '<div class="pl-grid"></div><div class="pl-glow"></div>' +
        '<div class="pl-core">' +
          '<div class="pl-frame"><i></i><i></i><i></i><i></i>' +
            '<div class="pl-logo"><img src="assets/logos/logo-haften-white.png" alt=""><span class="pl-scan"></span></div>' +
          '</div>' +
          '<div class="pl-meta"><span class="pl-stat">Iniciando</span><span class="pl-pct">000</span></div>' +
          '<div class="pl-bar"><i></i></div>' +
          '<div class="pl-tags"><span>HVAC</span><span>BMS</span><span>Energía</span><span>IAQ</span></div>' +
        '</div>' +
        '<div class="pl-foot"><span>Control e instrumentación</span><span>Desde 1999</span></div>' +
      '</div>';
    if (quick) loader.classList.add('pl-quick');
    var pct = loader.querySelector('.pl-pct'), fillBar = loader.querySelector('.pl-bar i'),
      stat = loader.querySelector('.pl-stat'), tags = loader.querySelectorAll('.pl-tags span');
    var STATES = ['Iniciando', 'Calibrando sensores', 'Sincronizando BMS', 'Cargando marcas', 'Listo'];
    var t0 = performance.now(), minT = quick ? 450 : 1700, p = 0, loaded = document.readyState === 'complete', out = false;
    var setLoaded = function () { loaded = true; };
    window.addEventListener('load', setLoaded);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(setLoaded);
    setTimeout(setLoaded, quick ? 400 : 1600);
    var tick = function (now) {
      if (out) return;
      var el = now - t0;
      var cap = loaded ? 100 : 86;
      var goal = Math.min(cap, el / minT * 100);
      p += (goal - p) * (quick ? .35 : .12);
      if (goal >= 100 && p > 99.4) p = 100;
      var v = Math.round(p);
      pct.textContent = ('00' + v).slice(-3);
      fillBar.style.transform = 'scaleX(' + (p / 100).toFixed(3) + ')';
      stat.textContent = STATES[Math.min(4, Math.floor(p / 25))];
      for (var i = 0; i < tags.length; i++) tags[i].classList.toggle('on', p >= (i + 1) * 24);
      if (v >= 100 || el > 5000) { finish(); return; }
      requestAnimationFrame(tick);
    };
    var finish = function () {
      out = true;
      loader.classList.add('pro-out');
      setTimeout(ready, quick ? 120 : 380);
      setTimeout(function () { loader.style.display = 'none'; }, 1400);
    };
    requestAnimationFrame(tick);
  } else requestAnimationFrame(ready);

  /* ── MENÚ MÓVIL FUERA DE PANTALLA ── */
  var navL = document.getElementById('navLinks'), hamB = document.getElementById('menuBtn');
  if (navL && hamB) {
    var head = document.createElement('li');
    head.className = 'n-drawer-head';
    head.setAttribute('aria-hidden', 'true');
    head.innerHTML = '<img src="assets/logos/logo-haften-white.png" alt=""><span>Menú</span>';
    navL.insertBefore(head, navL.firstChild);
    var foot = document.createElement('li');
    foot.className = 'n-drawer-foot';
    foot.setAttribute('aria-hidden', 'true');
    foot.innerHTML = '<span>HVAC · BMS · Medición de energía</span><span>CDMX · MTY · GDL · LEÓN · CUN</span>';
    navL.appendChild(foot);
    var scrim = document.createElement('div');
    scrim.className = 'n-scrim';
    document.body.appendChild(scrim);
    var sync = function () { root.classList.toggle('menu-open', navL.classList.contains('open') && innerWidth <= 900); };
    new MutationObserver(sync).observe(navL, { attributes: true, attributeFilter: ['class'] });
    window.addEventListener('resize', sync);
  }

  /* ── CINTA DE MARCAS ── */
  var BRANDS = window.HAFTEN_BRANDS || [];
  function logo(b) {
    return '<a class="br-logo" href="/marcas?q=' + encodeURIComponent(b.n) + '" title="' + esc(b.n) + '" tabindex="-1">' +
      '<img src="assets/logos/' + b.f + '" alt="' + esc(b.n) + '" loading="lazy" decoding="async"></a>';
  }
  function rail() {
    var h = BRANDS.map(logo).join('');
    var band = document.createElement('div');
    band.className = 'br-band';
    band.setAttribute('role', 'region');
    band.setAttribute('aria-label', 'Marcas que distribuimos');
    band.innerHTML =
      '<div class="br-cap">' +
        '<span class="br-kicker"><i></i>Distribuidor autorizado</span>' +
        '<span class="br-line" aria-hidden="true"></span>' +
        '<span class="br-title"><b>' + BRANDS.length + '</b> marcas de clase mundial</span>' +
        '<span class="br-line" aria-hidden="true"></span>' +
        '<a class="br-all" href="/marcas">Ver todas <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>' +
      '</div>' +
      '<div class="br-row"><div class="br-track">' + h + h + '</div></div>';
    return band;
  }
  if (BRANDS.length) {
    document.querySelectorAll('.ticker[data-logos], .hx-logos').forEach(function (old) {
      old.replaceWith(rail());
    });
  }


  /* ── TEXTO JUSTIFICADO en párrafos de varias líneas ── */
  var justify = function () {
    document.querySelectorAll('main p, section p, .hx-hero p, footer p').forEach(function (p) {
      if (p.closest('#loader, .n-links, form, button, a, .br-band, .xr-hud, .filter-bar')) return;
      if ((p.textContent || '').trim().length < 70) return;
      var ta = getComputedStyle(p).textAlign;
      if (ta === 'right' || ta === 'end') return;
      p.classList.add('pro-just');
      if (ta === 'center') p.classList.add('pro-just-c');
    });
  };
  justify();

  /* ── RELIEVE 3D EN TARJETAS ── */
  if (fine && !reduce) {
    document.querySelectorAll('.prod-card, .port-card, .why-card, .fil-card, .sector-card, .cat-card').forEach(function (c) {
      c.setAttribute('data-tilt', '');
      if (getComputedStyle(c).position === 'static') c.style.position = 'relative';
      c.addEventListener('pointermove', function (e) {
        if (document.body.classList.contains('no-anim')) return;
        var r = c.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        c.classList.add('tilting');
        c.style.setProperty('--ry', ((x - .5) * 9).toFixed(2) + 'deg');
        c.style.setProperty('--rx', ((.5 - y) * 9).toFixed(2) + 'deg');
        c.style.setProperty('--gx', (x * 100).toFixed(1) + '%');
        c.style.setProperty('--gy', (y * 100).toFixed(1) + '%');
      });
      c.addEventListener('pointerleave', function () {
        c.classList.remove('tilting');
        c.style.setProperty('--rx', '0deg');
        c.style.setProperty('--ry', '0deg');
      });
    });
  }

  /* ── HISTORIA INTERACTIVA ── */
  var hs = document.querySelector('[data-hs]');
  if (hs) {
    var items = [].slice.call(hs.querySelectorAll('.hs2-item'));
    var yearBox = hs.querySelector('[data-hs-year]');
    var now = hs.querySelector('[data-hs-now]');
    var bar = hs.querySelector('[data-hs-bar]');
    var list = hs.querySelector('.hs2-list');
    var navA = [].slice.call(hs.querySelectorAll('.hs2-nav a'));
    var digits = [];
    for (var d = 0; d < 4; d++) {
      var col = document.createElement('span');
      col.className = 'hs2-digit';
      var inner = document.createElement('span');
      for (var n = 0; n <= 9; n++) { var s = document.createElement('span'); s.textContent = n; inner.appendChild(s); }
      col.appendChild(inner);
      yearBox.appendChild(col);
      digits.push(inner);
    }
    var plus = document.createElement('span');
    plus.className = 'plus';
    plus.textContent = '+';
    yearBox.appendChild(plus);

    var active = -1;
    function setActive(i) {
      if (i === active) return;
      active = i;
      var it = items[i];
      var y = it.getAttribute('data-year');
      var num = y.replace(/\D/g, '');
      for (var k = 0; k < 4; k++) digits[k].style.transform = 'translateY(' + (-(+num[k] || 0)) + 'em)';
      plus.style.display = /\+/.test(y) ? '' : 'none';
      now.textContent = it.querySelector('h3').textContent;
      bar.style.width = ((i + 1) / items.length * 100) + '%';
      items.forEach(function (x, j) { x.classList.toggle('on', j <= i); });
      navA.forEach(function (a, j) { a.classList.toggle('on', j === i); });
    }
    setActive(0);

    var fill = hs.querySelector('.hs2-rail i');
    var ticking = false;
    function onScroll() {
      ticking = false;
      var mid = window.innerHeight * .5;
      var cur = 0;
      items.forEach(function (it, j) { if (it.getBoundingClientRect().top < mid) cur = j; });
      setActive(cur);
      var r = list.getBoundingClientRect();
      var p = Math.max(0, Math.min(1, (mid - r.top) / r.height));
      fill.style.setProperty('--hs-fill', (p * 100).toFixed(1) + '%');
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();

    /* el último hito muestra todas las marcas */
    var wall = hs.querySelector('[data-hs-wall]');
    if (wall && BRANDS.length) {
      wall.innerHTML = BRANDS.map(function (b) {
        return '<span title="' + esc(b.n) + '"><img src="assets/logos/' + b.f + '" alt="' + esc(b.n) + '" loading="lazy"></span>';
      }).join('');
    }
  }

  /* ── VISOR 3D / RAYOS X (se carga al acercarse) ── */
  var stage = document.querySelector('[data-xray]');
  if (stage) {
    var xrStarted = false;
    var load = function () {
      if (xrStarted) return;
      xrStarted = true;
      var add = function (src, cb) { var s = document.createElement('script'); s.src = src; s.async = true; s.onload = cb; s.onerror = fail; document.body.appendChild(s); };
      var fail = function () { stage.insertAdjacentHTML('beforeend', '<div class="xr-fallback">No se pudo cargar la vista 3D.</div>'); };
      var go = function () { add('assets/js/xray3d.js', function () { if (window.HaftenXray) window.HaftenXray(stage); }); };
      if (window.THREE) go(); else add('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', go);
    };
    if ('IntersectionObserver' in window) {
      var lo = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { load(); lo.disconnect(); } }, { rootMargin: '400px' });
      lo.observe(stage);
    } else load();
  }
})();

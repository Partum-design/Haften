/* HAFTEN — capa "pro": cinta de marcas, relieve 3D en tarjetas,
   historia interactiva y carga diferida del visor 3D / rayos X. */
(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  requestAnimationFrame(function () { document.documentElement.classList.add('pro-ready'); });

  /* ── CINTA DE MARCAS ── */
  var BRANDS = window.HAFTEN_BRANDS || [];
  function logo(b) {
    return '<a class="br-logo" href="/marcas?q=' + encodeURIComponent(b.n) + '" title="' + esc(b.n) + '" tabindex="-1">' +
      '<img src="assets/logos/' + b.f + '" alt="' + esc(b.n) + '" loading="lazy" decoding="async"></a>';
  }
  function row(list, rev, dur) {
    var h = list.map(logo).join('');
    return '<div class="br-row' + (rev ? ' rev' : '') + '"><div class="br-track" style="--br-dur:' + dur + 's">' + h + h + '</div></div>';
  }
  function rail() {
    var half = Math.ceil(BRANDS.length / 2);
    var a = BRANDS.slice(0, half), b = BRANDS.slice(half);
    var wrap = document.createElement('div');
    wrap.className = 'br-wrap';
    wrap.innerHTML =
      '<div class="br-rail rv" role="region" aria-label="Marcas que distribuimos">' +
        '<div class="br-head">' +
          '<span class="br-kicker"><i></i>Distribuidor autorizado</span>' +
          '<div class="br-title"><b>' + BRANDS.length + '</b> marcas de clase mundial</div>' +
          '<a class="br-all" href="/marcas">Ver todas <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>' +
        '</div>' +
        '<div class="br-rows">' + row(a, false, 55) + row(b, true, 62) + '</div>' +
      '</div>';
    return wrap;
  }
  if (BRANDS.length) {
    document.querySelectorAll('.ticker[data-logos], .hx-logos').forEach(function (old) {
      var r = rail();
      old.replaceWith(r);
      var el = r.firstChild;
      if ('IntersectionObserver' in window) {
        var o = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { el.classList.add('on'); o.disconnect(); } }); }, { threshold: .05 });
        o.observe(el);
      } else el.classList.add('on');
    });
  }

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
    var loaded = false;
    var load = function () {
      if (loaded) return;
      loaded = true;
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

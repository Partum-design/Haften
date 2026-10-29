/* HAFTEN — explorador de marcas: el escenario se ilumina con el color de la marca elegida */
(function () {
  'use strict';
  var B = window.HAFTEN_BRANDS || [];
  if (!B.length) return;
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var reduce = function () { return document.body.classList.contains('no-anim') || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); };
  var WA = '5215580070413';

  document.querySelectorAll('[data-explorer]').forEach(function (root) {
    var tag = root.dataset.h === 'h1' ? 'h1' : 'h2';
    var title = root.dataset.title || 'Marcas de <span>clase mundial</span>';
    var start = 0;
    try {
      var q = new URLSearchParams(location.search).get('marca');
      if (q) B.forEach(function (b, i) { if (b.n.toLowerCase() === q.toLowerCase()) start = i; });
    } catch (e) { }

    root.innerHTML =
      '<div class="bx-stage">' +
      '<div class="bx-bg" aria-hidden="true"><div class="bx-glow"></div><div class="bx-grid-lines"></div><div class="bx-big"></div></div>' +
      '<div class="bx-top">' +
      '<div class="bx-kicker"><span class="bx-dot"></span>Distribuidores autorizados · ' + B.length + ' marcas</div>' +
      '<' + tag + ' class="bx-title">' + title + '</' + tag + '>' +
      '</div>' +
      '<div class="bx-body">' +
      '<div class="bx-info" aria-live="polite">' +
      '<div class="bx-count"><b class="bx-i"></b><span>/ ' + String(B.length).padStart(2, '0') + '</span><em class="bx-origin"></em></div>' +
      '<h3 class="bx-name"></h3>' +
      '<p class="bx-desc"></p>' +
      '<div class="bx-actions"></div>' +
      '</div>' +
      '<div class="bx-show">' +
      '<div class="bx-ring" aria-hidden="true"></div>' +
      '<div class="bx-card"><img class="bx-logo" alt=""></div>' +
      '<div class="bx-nav">' +
      '<button type="button" class="bx-arrow" data-d="-1" aria-label="Marca anterior"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i></button>' +
      '<div class="bx-bar" aria-hidden="true"><span></span></div>' +
      '<button type="button" class="bx-arrow" data-d="1" aria-label="Marca siguiente"><i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>' +
      '</div>' +
      '</div>' +
      '<div class="bx-pick">' +
      '<div class="bx-pick-h">Elige una marca</div>' +
      '<div class="bx-chips" role="tablist" aria-label="Marcas">' +
      B.map(function (b, i) {
        return '<button type="button" class="bx-chip" role="tab" data-i="' + i + '" style="--bc:' + b.c + '" aria-label="' + esc(b.n) + '" title="' + esc(b.n) + '"><img src="assets/logos/' + b.f + '" alt="" loading="lazy"></button>';
      }).join('') +
      '</div>' +
      '<a class="bx-all" href="/marcas#directorio">Ver directorio completo <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>' +
      '</div>' +
      '</div>' +
      '</div>';

    var stage = root.querySelector('.bx-stage');
    var big = root.querySelector('.bx-big');
    var nm = root.querySelector('.bx-name'), ds = root.querySelector('.bx-desc');
    var idx = root.querySelector('.bx-i'), org = root.querySelector('.bx-origin');
    var act = root.querySelector('.bx-actions'), logo = root.querySelector('.bx-logo');
    var card = root.querySelector('.bx-card'), bar = root.querySelector('.bx-bar span');
    var chips = root.querySelectorAll('.bx-chip');
    var cur = -1, timer = null, paused = false;

    function show(i, focusChip) {
      i = (i + B.length) % B.length;
      if (i === cur) return;
      cur = i;
      var b = B[i];
      stage.style.setProperty('--bc', b.c);
      big.textContent = b.n.replace(/ (International|Systems|Energy|Electronics)$/, '');
      nm.textContent = b.n;
      ds.textContent = b.d;
      idx.textContent = String(i + 1).padStart(2, '0');
      org.textContent = b.o;
      card.classList.remove('in'); void card.offsetWidth; card.classList.add('in');
      logo.src = 'assets/logos/' + b.f;
      logo.alt = b.n;
      var cat = b.pdf
        ? '<a class="bx-btn bx-btn-w" href="assets/catalogos/' + b.pdf + '.pdf" target="_blank" rel="noopener"><i class="fa-solid fa-file-arrow-down" aria-hidden="true"></i>Descargar catálogo</a>'
        : '<a class="bx-btn bx-btn-w" href="https://wa.me/' + WA + '?text=' + encodeURIComponent('Hola Haften, me interesa el catálogo de ' + b.n + '.') + '" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i>Solicitar catálogo</a>';
      act.innerHTML = cat +
        '<a class="bx-btn bx-btn-o" href="https://wa.me/' + WA + '?text=' + encodeURIComponent('Hola Haften, quiero cotizar productos ' + b.n + '.') + '" target="_blank" rel="noopener"><i class="fa-solid fa-file-invoice-dollar" aria-hidden="true"></i>Cotizar</a>' +
        '<a class="bx-btn bx-btn-t" href="/marcas?q=' + encodeURIComponent(b.n) + '#directorio">Ver ficha<i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>';
      chips.forEach(function (c, k) { c.classList.toggle('on', k === i); c.setAttribute('aria-selected', k === i ? 'true' : 'false'); c.tabIndex = k === i ? 0 : -1; });
      if (focusChip) chips[i].focus();
      bar.style.width = ((i + 1) / B.length * 100) + '%';
    }
    function next() { show(cur + 1); }
    function play() { stop(); if (!reduce() && !paused) timer = setInterval(next, 6500); }
    function stop() { if (timer) clearInterval(timer); timer = null; }

    chips.forEach(function (c) {
      c.addEventListener('click', function () { show(+c.dataset.i); paused = true; stop(); });
      c.addEventListener('mouseenter', function () { show(+c.dataset.i); });
      c.addEventListener('keydown', function (e) {
        var k = e.key;
        if (k === 'ArrowRight' || k === 'ArrowDown') { e.preventDefault(); show(cur + 1, true); }
        if (k === 'ArrowLeft' || k === 'ArrowUp') { e.preventDefault(); show(cur - 1, true); }
      });
    });
    root.querySelectorAll('.bx-arrow').forEach(function (a) {
      a.addEventListener('click', function () { show(cur + (+a.dataset.d)); paused = true; stop(); });
    });
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', play);
    root.addEventListener('focusin', stop);

    show(start);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { en.forEach(function (e) { e.isIntersecting ? play() : stop(); }); }, { threshold: .35 }).observe(root);
    } else play();
  });
})();

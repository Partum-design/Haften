/* HAFTEN — sección de sucursales: mapa interactivo, pestañas y Google Maps */
(function () {
  'use strict';
  var sec = document.getElementById('sucursales');
  if (!sec) return;

  var body = document.body;
  var reduce = function () { return body.classList.contains('no-anim') || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); };
  var tabs = Array.prototype.slice.call(sec.querySelectorAll('.suc-tab'));
  var panels = sec.querySelectorAll('.suc-panel');
  var pins = sec.querySelectorAll('.suc-pin');
  var arcs = sec.querySelectorAll('.suc-arc');
  var stage = sec.querySelector('.suc-stage');
  var gmap = sec.querySelector('.suc-gmap');
  var frame = gmap.querySelector('iframe');
  var modes = sec.querySelectorAll('.suc-mode');
  var arcsG = sec.querySelector('.suc-arcs');
  var flow = null;
  var current = 'cdmx';
  var mode = 'net';

  function panelOf(id) { return sec.querySelector('.suc-panel[data-id="' + id + '"]'); }

  function setFlow(id) {
    if (flow) { flow.remove(); flow = null; }
    var src = sec.querySelector('.suc-arc[data-to="' + id + '"]');
    if (!src || reduce()) return;
    flow = src.cloneNode();
    flow.removeAttribute('data-to');
    flow.setAttribute('class', 'suc-arc is-flow');
    flow.setAttribute('aria-hidden', 'true');
    arcsG.appendChild(flow);
  }

  function loadMap() {
    var p = panelOf(current);
    if (p && frame.getAttribute('src') !== p.dataset.embed) frame.src = p.dataset.embed;
    frame.title = 'Ubicación de la sucursal ' + (p ? p.querySelector('.suc-city').textContent : '') + ' en Google Maps';
  }

  function setMode(m) {
    mode = m;
    modes.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.mode === m ? 'true' : 'false'); });
    gmap.hidden = m !== 'gmap';
    stage.classList.toggle('is-gmap', m === 'gmap');
    if (m === 'gmap') loadMap();
  }

  function select(id, focusTab) {
    if (!panelOf(id)) return;
    var changed = id !== current;
    current = id;
    tabs.forEach(function (t) {
      var on = t.dataset.id === id;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      if (on && focusTab) t.focus();
    });
    panels.forEach(function (p) {
      var on = p.dataset.id === id;
      p.hidden = !on;
      if (on && changed && !reduce()) { p.classList.remove('is-enter'); void p.offsetWidth; p.classList.add('is-enter'); }
    });
    pins.forEach(function (p) { p.classList.toggle('is-active', p.dataset.id === id); });
    arcs.forEach(function (a) { a.classList.toggle('is-active', a.dataset.to === id); });
    setFlow(id);
    if (mode === 'gmap') loadMap();
    // en móvil, mantiene visible la pestaña elegida
    var t = sec.querySelector('.suc-tab[data-id="' + id + '"]'), box = t && t.parentNode;
    if (box && box.scrollWidth > box.clientWidth)
      box.scrollTo({ left: t.offsetLeft - (box.clientWidth - t.offsetWidth) / 2, behavior: reduce() ? 'auto' : 'smooth' });
  }

  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { select(t.dataset.id); });
    t.addEventListener('mouseenter', function () { pins.forEach(function (p) { p.classList.toggle('is-hover', p.dataset.id === t.dataset.id); }); });
    t.addEventListener('keydown', function (e) {
      var k = e.key, n = tabs.length, j = null;
      if (k === 'ArrowRight' || k === 'ArrowDown') j = (i + 1) % n;
      else if (k === 'ArrowLeft' || k === 'ArrowUp') j = (i - 1 + n) % n;
      else if (k === 'Home') j = 0;
      else if (k === 'End') j = n - 1;
      if (j !== null) { e.preventDefault(); select(tabs[j].dataset.id, true); }
    });
  });
  pins.forEach(function (p) {
    p.addEventListener('click', function () { select(p.dataset.id); });
  });
  modes.forEach(function (b) { b.addEventListener('click', function () { setMode(b.dataset.mode); }); });
  sec.querySelectorAll('[data-suc-map]').forEach(function (b) {
    b.addEventListener('click', function () {
      setMode('gmap');
      if (stage.getBoundingClientRect().top < 0 || stage.getBoundingClientRect().bottom > innerHeight)
        stage.scrollIntoView({ behavior: reduce() ? 'auto' : 'smooth', block: 'center' });
    });
  });

  // contadores
  function count(el) {
    var to = +el.dataset.count, from = to > 1000 ? to - 40 : 0, t0 = null, dur = 1400;
    if (reduce()) { el.textContent = to; return; }
    function step(t) {
      if (!t0) t0 = t;
      var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 4);
      el.textContent = Math.round(from + (to - from) * e);
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function reveal() {
    sec.classList.add('is-in');
    sec.querySelectorAll('[data-count]').forEach(count);
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { reveal(); io.disconnect(); } });
    }, { threshold: .18 });
    io.observe(sec);
  } else reveal();

  // enlaces #sucursales-<id> abren directamente una sucursal
  function fromHash() {
    var m = location.hash.match(/^#sucursal-(\w+)/);
    if (m && panelOf(m[1])) { select(m[1]); sec.scrollIntoView(); }
  }
  window.addEventListener('hashchange', fromHash);

  select('cdmx');
  fromHash();
})();

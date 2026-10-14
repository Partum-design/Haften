/* HAFTEN — accesibilidad y utilidades compartidas (todas las páginas) */
(function () {
  'use strict';

  var KEY = 'haften-a11y';
  var FONT_MIN = 0.8, FONT_MAX = 1.5, FONT_STEP = 0.1;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var defaults = { font: 1, hc: false, motion: reduceMotion, underline: false, spacing: false, cursor: !reduceMotion };

  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY) || '{}');
      var out = {};
      for (var k in defaults) out[k] = (k in s) ? s[k] : defaults[k];
      return out;
    } catch (e) { return Object.assign({}, defaults); }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { } }

  var state = load();
  var body = document.body, root = document.documentElement;
  var panel = document.getElementById('a11yPanel');
  var btn = document.getElementById('a11yBtn');
  var live = document.createElement('div');
  live.className = 'sr-only';
  live.setAttribute('aria-live', 'polite');
  body.appendChild(live);

  function announce(msg) { live.textContent = ''; setTimeout(function () { live.textContent = msg; }, 30); }

  function apply() {
    root.style.setProperty('--font-scale', state.font);
    body.classList.toggle('hc-mode', !!state.hc);
    body.classList.toggle('no-anim', !!state.motion);
    body.classList.toggle('a11y-underline', !!state.underline);
    body.classList.toggle('a11y-spacing', !!state.spacing);
    body.classList.toggle('a11y-native-cursor', !state.cursor);
    body.style.cursor = state.cursor ? '' : 'auto';
    var fs = document.getElementById('fsVal');
    if (fs) fs.textContent = Math.round(state.font * 100) + '%';
    document.querySelectorAll('.a11y-switch').forEach(function (sw) {
      sw.setAttribute('aria-checked', state[sw.dataset.a11y] ? 'true' : 'false');
    });
    // pausa sliders automáticos en modo sin animaciones
    document.querySelectorAll('video[autoplay]').forEach(function (v) { state.motion ? v.pause() : v.play && v.play().catch(function () { }); });
  }

  // ── panel ──
  function isOpen() { return panel && panel.classList.contains('open'); }
  function openPanel() {
    panel.classList.add('open');
    panel.removeAttribute('inert');
    btn.setAttribute('aria-expanded', 'true');
    var first = panel.querySelector('button');
    if (first) setTimeout(function () { first.focus(); }, 60);
  }
  function closePanel(returnFocus) {
    if (!panel) return;
    panel.classList.remove('open');
    panel.setAttribute('inert', '');
    btn.setAttribute('aria-expanded', 'false');
    if (returnFocus) btn.focus();
  }

  if (panel && btn) {
    panel.setAttribute('inert', '');
    btn.addEventListener('click', function (e) { e.stopPropagation(); isOpen() ? closePanel(false) : openPanel(); });
    panel.addEventListener('click', function (e) { e.stopPropagation(); });
    document.addEventListener('click', function () { if (isOpen()) closePanel(false); });

    panel.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var items = panel.querySelectorAll('button:not([disabled])');
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    panel.querySelectorAll('[data-a11y-font]').forEach(function (b) {
      b.addEventListener('click', function () {
        var d = +b.dataset.a11yFont * FONT_STEP;
        state.font = Math.round(Math.max(FONT_MIN, Math.min(FONT_MAX, state.font + d)) * 10) / 10;
        apply(); save();
        announce('Tamaño de texto ' + Math.round(state.font * 100) + '%');
      });
    });
    panel.querySelectorAll('.a11y-switch').forEach(function (sw) {
      sw.addEventListener('click', function () {
        var k = sw.dataset.a11y;
        state[k] = !state[k];
        apply(); save();
        announce(sw.querySelector('.a11y-lbl').textContent + (state[k] ? ' activado' : ' desactivado'));
      });
    });
    var reset = panel.querySelector('[data-a11y-reset]');
    if (reset) reset.addEventListener('click', function () {
      state = Object.assign({}, defaults);
      apply(); save();
      announce('Ajustes de accesibilidad restablecidos');
    });
  }

  // compatibilidad con funciones que algunas páginas aún pudieran llamar
  window.changeFontScale = function (d) { state.font = Math.max(FONT_MIN, Math.min(FONT_MAX, state.font + d)); apply(); save(); };
  window.toggleHC = function (on) { state.hc = !!on; apply(); save(); };
  window.toggleAnim = function (on) { state.motion = !!on; apply(); save(); };
  window.toggleCursor = function (on) { state.cursor = !!on; apply(); save(); };

  // ── Escape cierra panel, menú móvil y chat ──
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (isOpen()) { closePanel(true); return; }
    var nav = document.getElementById('navLinks'), ham = document.getElementById('menuBtn');
    if (nav && nav.classList.contains('open')) {
      nav.classList.remove('open');
      if (ham) { ham.classList.remove('open'); ham.setAttribute('aria-expanded', 'false'); ham.focus(); }
      return;
    }
    var chat = document.getElementById('chatWindow'), fab = document.getElementById('chatFab');
    if (chat && chat.classList.contains('open')) {
      chat.classList.remove('open');
      if (fab) { fab.setAttribute('aria-expanded', 'false'); fab.focus(); }
    }
  });

  // ── cursor personalizado: estados de hover/clic y ocultar al salir ──
  if (document.getElementById('cur')) {
    var HOVER = 'a,button,[role="button"],label,summary,select,input,textarea,.vid-card,.short-card,.soc-card,.post-card,.cat-card,.brand-cell,.pl-item';
    document.addEventListener('mouseover', function (e) {
      var t = e.target;
      body.classList.toggle('cur-hover', !!(t.closest && t.closest(HOVER)));
      body.classList.toggle('cur-out', t.tagName === 'IFRAME');
    });
    document.addEventListener('mousedown', function () { body.classList.add('cur-down'); });
    document.addEventListener('mouseup', function () { body.classList.remove('cur-down'); });
    document.documentElement.addEventListener('mouseleave', function () { body.classList.add('cur-out'); });
    document.documentElement.addEventListener('mouseenter', function () { body.classList.remove('cur-out'); });
  }

  // ── saltar al contenido ──
  var main = document.querySelector('main');
  if (main) {
    if (!main.id) main.id = 'contenido';
    if (!main.hasAttribute('tabindex')) main.setAttribute('tabindex', '-1');
    var skip = document.querySelector('.skip-link');
    if (!skip) {
      skip = document.createElement('a');
      skip.className = 'skip-link';
      skip.textContent = 'Saltar al contenido';
      body.insertBefore(skip, body.firstChild);
    }
    skip.href = '#' + main.id;
    skip.addEventListener('click', function (e) { e.preventDefault(); main.focus({ preventScroll: true }); main.scrollIntoView(); });
  }

  // ── semántica y etiquetas faltantes ──
  ['cur', 'curR', 'loader'].forEach(function (id) { var el = document.getElementById(id); if (el) el.setAttribute('aria-hidden', 'true'); });
  document.querySelectorAll('canvas').forEach(function (c) { c.setAttribute('aria-hidden', 'true'); });
  document.querySelectorAll('img:not([alt])').forEach(function (i) { i.setAttribute('alt', ''); });
  document.querySelectorAll('i.fa-solid, i.fa-brands, i.fa-regular').forEach(function (i) { if (!i.hasAttribute('aria-hidden')) i.setAttribute('aria-hidden', 'true'); });
  var labels = { chatClose: 'Cerrar chat', cwSend: 'Enviar mensaje', cwInput: 'Escribe tu mensaje', searchInput: 'Buscar catálogo o marca', btt: 'Volver arriba' };
  Object.keys(labels).forEach(function (id) { var el = document.getElementById(id); if (el && !el.getAttribute('aria-label')) el.setAttribute('aria-label', labels[id]); });
  document.querySelectorAll('button:not([type])').forEach(function (b) { if (!b.closest('form')) b.type = 'button'; });
  var chatWin = document.getElementById('chatWindow');
  if (chatWin) { chatWin.setAttribute('role', 'dialog'); chatWin.setAttribute('aria-label', 'Chat de soporte Haften'); }
  var msgs = document.getElementById('cwMsgs');
  if (msgs) { msgs.setAttribute('role', 'log'); msgs.setAttribute('aria-live', 'polite'); }
  // enlaces externos: seguros y anunciados
  document.querySelectorAll('a[target="_blank"]').forEach(function (a) {
    var rel = (a.getAttribute('rel') || '').split(/\s+/);
    if (rel.indexOf('noopener') < 0) rel.push('noopener');
    a.setAttribute('rel', rel.join(' ').trim());
    if (!a.querySelector('.sr-only')) {
      var s = document.createElement('span'); s.className = 'sr-only'; s.textContent = ' (se abre en una pestaña nueva)'; a.appendChild(s);
    }
  });
  // página actual en la navegación
  document.querySelectorAll('.n-links a.active').forEach(function (a) { a.setAttribute('aria-current', 'page'); });

  apply();
})();

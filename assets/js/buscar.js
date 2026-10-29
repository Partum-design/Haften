/* HAFTEN — buscador del sitio (hero) + cintas y franjas de logotipos */
(function () {
  'use strict';

  var norm = function (s) { return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  /* ── MARCAS (todas, con su logotipo) ── */
  var BRANDS = [
    { n: 'Air Monitor', f: 'air-monitor.png', k: 'calidad del aire flujo de aire co2 data center', cat: true, c: '#0c84cc', pdf: 'air-monitor', o: 'EUA', d: 'Medición de flujo de aire y calidad de aire para HVAC, salas limpias y data centers.' },
    { n: 'Badger Meter', f: 'badger-meter.png', k: 'flujo agua medidores ultrasonicos', c: '#0c6ccc', pdf: '', o: 'EUA', d: 'Medidores de flujo de agua y fluidos industriales: ultrasónicos, electromagnéticos y mecánicos.' },
    { n: 'Belimo', f: 'belimo.png', k: 'actuadores valvulas energy valve sensores damper', cat: true, c: '#e4840c', pdf: 'belimo', o: 'Suiza', d: 'Actuadores, válvulas de control, Energy Valve y sensores para sistemas HVAC eficientes.' },
    { n: 'Bry-Air', f: 'bry-air.png', k: 'deshumidificadores deshumidificacion secado', cat: true, c: '#e40c0c', pdf: 'bry-air', o: 'India', d: 'Deshumidificadores desecantes y soluciones de control de humedad para procesos críticos.' },
    { n: 'Contemporary Controls', f: 'contemporary-controls.png', k: 'bms basview routers controladores bacnet', cat: true, c: '#3c5ca8', pdf: 'contemporary-controls', o: 'EUA', d: 'Routers, controladores BACnet y supervisión BASview para automatización de edificios.' },
    { n: 'Control Techniques', f: 'control-techniques.png', k: 'variadores vfd drives', cat: true, c: '#1e9e3a', pdf: 'control-techniques', o: 'Reino Unido', d: 'Variadores de frecuencia (VFDs) para bombas, ventiladores y aplicaciones HVAC.' },
    { n: 'CoolAutomation', f: 'cool-automation.png', k: 'vrf gateways integracion', cat: true, c: '#6c4bd8', pdf: 'cool-automation', o: 'Israel', d: 'Gateways para integrar equipos VRF/VRV a BMS y domótica con BACnet, Modbus y KNX.' },
    { n: 'Delta Electronics', f: 'delta-electronics.png', k: 'delta variadores fuentes de alimentacion', cat: 'Delta', c: '#0c9ce4', pdf: 'delta', o: 'Taiwán', d: 'Variadores, fuentes de alimentación y automatización para HVAC e industria.' },
    { n: 'Dwyer Omega', f: 'dwyer-omega.png', k: 'manometros presion temperatura comisionamiento', cat: 'Dwyer', c: '#3a3aa0', pdf: 'dwyer', o: 'EUA', d: 'Manómetros, transmisores de presión, temperatura y humedad, y equipos de comisionamiento.' },
    { n: 'FlowCon International', f: 'flowcon.png', k: 'flowcon valvulas balanceo', cat: 'FlowCon', c: '#2f8f8f', pdf: 'flowcon', o: 'Dinamarca', d: 'Válvulas de balanceo automático e independientes de la presión para hidrónicos.' },
    { n: 'GPI', f: 'gpi.png', k: 'medidores de flujo combustibles', cat: true, c: '#3c84cc', pdf: 'gpi', o: 'EUA', d: 'Medidores de flujo para agua, químicos y combustibles, portátiles e industriales.' },
    { n: 'Greystone Energy', f: 'greystone.png', k: 'greystone sensores co2 humedad power meters', cat: 'Greystone', c: '#0c8c6c', pdf: 'greystone', o: 'Canadá', d: 'Sensores de CO₂, temperatura, humedad y presión, y medidores de energía eléctrica.' },
    { n: 'Intesis', f: 'intesis.png', k: 'gateways vrf hms networks integracion', c: '#1a6a8c', pdf: '', o: 'España', d: 'Gateways de integración by HMS Networks para A/C, VRF y protocolos BMS.' },
    { n: 'Johnson Controls', f: 'johnson-controls.png', k: 'bms metasys facility explorer controladores', cat: true, c: '#1e5bc6', pdf: 'johnson-controls', o: 'EUA', d: 'Controladores Facility Explorer, sensores y soluciones BMS para edificios inteligentes.' },
    { n: 'LOYTEC', f: 'loytec.png', k: 'bms controladores gateways l-vis', cat: true, c: '#d0142c', pdf: 'loytec', o: 'Austria', d: 'Controladores, gateways y paneles L-VIS para BACnet, KNX y Modbus.' },
    { n: 'Meitav-Tec', f: 'meitav-tec.png', k: 'termostatos humidostatos fan coil', cat: 'Meitav', c: '#2a2fa0', pdf: 'meitav', o: 'Israel', d: 'Termostatos y humidostatos digitales para fan & coil, hotelería y oficinas.' },
    { n: 'Neptronic', f: 'neptronic.png', k: 'humidificadores calefactores actuadores', cat: true, c: '#1e64a8', pdf: 'neptronic', o: 'Canadá', d: 'Humidificadores de vapor, calefactores eléctricos de ducto, actuadores y válvulas.' },
    { n: 'ONICON', f: 'onicon.png', k: 'btu energia termica flujo', cat: true, c: '#0c84cc', pdf: 'onicon', o: 'EUA', d: 'Medidores de flujo y de energía térmica (BTU) para facturación y eficiencia.' },
    { n: 'Particles Plus', f: 'particles-plus.png', k: 'contadores de particulas salas limpias areas criticas', c: '#e42424', pdf: '', o: 'EUA', d: 'Contadores de partículas para salas limpias, farmacéutica y calidad de aire.' },
    { n: 'Senva', f: 'senva.png', k: 'sensores corriente relevadores', cat: true, c: '#b07a3e', pdf: 'senva', o: 'EUA', d: 'Sensores de calidad de aire, corriente, relevadores y contactores para HVAC y BMS.' },
    { n: 'Setra Systems', f: 'setra-systems.png', k: 'presion salas limpias areas criticas', cat: 'Setra', c: '#1f5fa9', pdf: 'setra', o: 'EUA', d: 'Transductores de presión de alta precisión para áreas críticas y laboratorios.' },
    { n: 'Vaisala', f: 'vaisala.png', k: 'humedad temperatura co2 instrumentacion', cat: true, c: '#1f5a9e', pdf: 'vaisala', o: 'Finlandia', d: 'Instrumentos de referencia para humedad, temperatura y CO₂ en procesos críticos.' }
  ];
  window.HAFTEN_BRANDS = BRANDS;

  /* ── CATEGORÍAS (listado oficial) ── */
  var CATS = [
    ['Medidores de flujo de aire, agua y gas', 'fa-solid fa-wind', 'flujo'],
    ['Válvulas de control, balanceo y energy valves', 'fa-solid fa-faucet-drip', 'válvulas'],
    ['Actuadores para damper y válvulas', 'fa-solid fa-gear', 'actuadores'],
    ['Sensores de temperatura, humedad, presión y calidad de aire (IAQ)', 'fa-solid fa-satellite-dish', 'sensores'],
    ['Manómetros y termómetros', 'fa-solid fa-gauge-high', 'manómetros'],
    ['Variadores de frecuencia (VFDs)', 'fa-solid fa-bolt', 'variadores'],
    ['Gateways, routers, módulos IO y controladores BMS', 'fa-solid fa-network-wired', 'gateways'],
    ['HMIs, supervisores y power meters', 'fa-solid fa-display', 'power meters'],
    ['Humidificadores y deshumidificadores', 'fa-solid fa-droplet', 'humidific'],
    ['Calefactores eléctricos', 'fa-solid fa-fire-flame-curved', 'calefactores'],
    ['Termostatos y humidostatos digitales', 'fa-solid fa-temperature-half', 'termostatos'],
    ['Sensores para áreas críticas', 'fa-solid fa-shield-virus', 'salas limpias'],
    ['Equipos de medición para comisionamiento', 'fa-solid fa-clipboard-check', 'comisionamiento'],
    ['Fuentes de alimentación y transformadores', 'fa-solid fa-plug-circle-bolt', 'fuentes'],
    ['Medidores de energía (BTU)', 'fa-solid fa-temperature-arrow-up', 'BTU'],
    ['Relevadores y contactores', 'fa-solid fa-toggle-on', 'relevadores']
  ];
  window.HAFTEN_CATS = CATS;

  /* ── ÍNDICE DE BÚSQUEDA ── */
  var PAGES = [
    { t: 'Inicio', s: 'Página principal', u: '/', i: 'fa-solid fa-house', k: 'home portada' },
    { t: 'Nosotros', s: 'Historia, filosofía y equipo', u: '/nosotros', i: 'fa-solid fa-building-columns', k: 'quienes somos empresa mision vision' },
    { t: 'Nuestra historia', s: 'Nosotros · línea de tiempo desde 1999', u: '/nosotros#historia', i: 'fa-solid fa-timeline', k: 'historia 1999 2004 2014 alianzas' },
    { t: 'Marcas', s: 'Directorio de marcas representadas', u: '/marcas', i: 'fa-solid fa-star', k: 'distribuidores autorizados fabricantes' },
    { t: 'Catálogos', s: 'Descarga los catálogos en PDF', u: '/catalogos', i: 'fa-solid fa-book-open', k: 'pdf descargar documentacion' },
    { t: 'Fichas técnicas', s: 'Catálogos · fichas por modelo', u: '/catalogos#fichas', i: 'fa-solid fa-file-pdf', k: 'ficha tecnica datasheet modelo serie' },
    { t: 'Multimedia', s: 'Videos, webinars y shorts', u: '/multimedia', i: 'fa-solid fa-circle-play', k: 'youtube videos webinars capacitacion' },
    { t: 'Webinars', s: 'Multimedia · sesiones técnicas', u: '/multimedia#videos', i: 'fa-solid fa-chalkboard-user', k: 'webinar capacitacion curso' },
    { t: 'Redes sociales', s: 'LinkedIn, Facebook, YouTube e Instagram', u: '/redes', i: 'fa-solid fa-share-nodes', k: 'linkedin facebook instagram youtube' },
    { t: 'Contacto', s: 'Escríbenos o solicita una cotización', u: '/contacto', i: 'fa-solid fa-envelope', k: 'cotizacion correo telefono formulario' },
    { t: 'Sucursales', s: 'CDMX, Monterrey, Guadalajara, León y Cancún', u: '/contacto#sucursales', i: 'fa-solid fa-location-dot', k: 'oficinas direccion mapa cdmx monterrey guadalajara leon cancun' },
    { t: 'Horario de atención', s: 'Lunes a viernes · 8:00 a 17:30', u: '/contacto', i: 'fa-regular fa-clock', k: 'horario abierto hora' },
    { t: 'Encuentra tu solución', s: 'Asistente de selección de equipo', u: '/#finder', i: 'fa-solid fa-sliders', k: 'asistente recomendacion seleccion' },
    { t: 'Categorías de producto', s: 'Todo para tu sistema HVAC/R', u: '/#categorias', i: 'fa-solid fa-boxes-stacked', k: 'productos portafolio categorias' },
    { t: 'WhatsApp', s: 'Habla con un asesor', u: 'https://wa.me/5215580070413?text=' + encodeURIComponent('Hola Haften, me gustaría más información.'), i: 'fa-brands fa-whatsapp', k: 'asesor chat mensaje', ext: true }
  ];

  var IDX = [];
  PAGES.forEach(function (p) { IDX.push({ type: 'Sección', t: p.t, s: p.s, u: p.u, i: p.i, ext: p.ext, h: norm(p.t + ' ' + p.s + ' ' + p.k) }); });
  BRANDS.forEach(function (b) {
    IDX.push({ type: 'Marca', t: b.n, s: 'Ver marca y productos', u: '/marcas?q=' + encodeURIComponent(b.n), logo: b.f, h: norm(b.n + ' ' + b.k), cat: b.cat });
  });
  CATS.forEach(function (c) { IDX.push({ type: 'Categoría', t: c[0], s: 'Marcas que la ofrecen', u: '/marcas?q=' + encodeURIComponent(c[2]), i: c[1], h: norm(c[0] + ' ' + c[2]) }); });

  function search(q) {
    q = norm(q).trim();
    if (!q) return [];
    var words = q.split(/\s+/);
    var out = [];
    IDX.forEach(function (it) {
      var tn = norm(it.t), score = 0;
      for (var w = 0; w < words.length; w++) {
        var x = words[w];
        if (it.h.indexOf(x) < 0) return;
        score += tn.indexOf(x) === 0 ? 6 : tn.indexOf(x) >= 0 ? 4 : 1;
      }
      if (it.type === 'Marca') score += 1;
      out.push({ it: it, s: score });
    });
    out.sort(function (a, b) { return b.s - a.s; });
    var res = out.slice(0, 8).map(function (o) { return o.it; });
    // atajo al catálogo de la marca principal
    var top = res[0];
    if (top && top.type === 'Marca' && top.cat) {
      var cq = top.cat === true ? top.t : top.cat;
      res.splice(1, 0, { type: 'Catálogo', t: 'Catálogo ' + top.t, s: 'Descarga el PDF', u: '/catalogos?q=' + encodeURIComponent(cq), i: 'fa-solid fa-file-pdf' });
    }
    return res.slice(0, 8);
  }

  function rowHTML(it, k) {
    var ico = it.logo
      ? '<span class="hs-ico hs-logo"><img src="assets/logos/' + it.logo + '" alt=""></span>'
      : '<span class="hs-ico"><i class="' + it.i + '" aria-hidden="true"></i></span>';
    return '<a class="hs-row" role="option" id="hs-opt-' + k + '" href="' + esc(it.u) + '"' + (it.ext ? ' target="_blank" rel="noopener"' : '') + '>' + ico +
      '<span class="hs-txt"><strong>' + esc(it.t) + '</strong><small>' + esc(it.s) + '</small></span>' +
      '<span class="hs-type">' + it.type + '</span></a>';
  }

  /* ── conectar cada buscador ── */
  document.querySelectorAll('[data-hsearch]').forEach(function (form) {
    var input = form.querySelector('input');
    var list = form.querySelector('.hs-results');
    var cur = -1, items = [];

    function render() {
      items = search(input.value);
      cur = -1;
      if (!input.value.trim()) { list.hidden = true; input.setAttribute('aria-expanded', 'false'); return; }
      list.innerHTML = items.length
        ? items.map(rowHTML).join('')
        : '<div class="hs-empty">Sin resultados para “' + esc(input.value) + '”. <a href="/contacto">Pregúntale a un asesor</a></div>';
      list.hidden = false;
      input.setAttribute('aria-expanded', 'true');
    }
    function setCur(n) {
      var rows = list.querySelectorAll('.hs-row');
      if (!rows.length) return;
      cur = (n + rows.length) % rows.length;
      rows.forEach(function (r, i) { r.classList.toggle('on', i === cur); });
      input.setAttribute('aria-activedescendant', rows[cur].id);
      rows[cur].scrollIntoView({ block: 'nearest' });
    }
    input.addEventListener('input', render);
    input.addEventListener('focus', function () { if (input.value.trim()) render(); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setCur(cur + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setCur(cur - 1); }
      else if (e.key === 'Escape') { list.hidden = true; input.setAttribute('aria-expanded', 'false'); }
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var rows = list.querySelectorAll('.hs-row');
      var target = rows[cur >= 0 ? cur : 0];
      if (target) target.click();
      else if (input.value.trim()) location.href = '/marcas?q=' + encodeURIComponent(input.value.trim());
    });
    document.addEventListener('click', function (e) { if (!form.contains(e.target)) list.hidden = true; });
    form.querySelectorAll('[data-q]').forEach(function (chip) {
      chip.addEventListener('click', function () { input.value = chip.dataset.q; input.focus(); render(); });
    });
  });

  /* tecla "/" enfoca el buscador */
  document.addEventListener('keydown', function (e) {
    if (e.key !== '/' || document.getElementById('searchInput') || /input|textarea|select/i.test((document.activeElement || {}).tagName || '')) return;
    var i = document.querySelector('[data-hsearch] input');
    if (i) { e.preventDefault(); i.focus(); i.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
  });

  /* ── cintas de marcas con logotipos ── */
  function logoItems(cls) {
    return BRANDS.map(function (b) {
      return '<span class="' + cls + '"><img src="assets/logos/' + b.f + '" alt="' + esc(b.n) + '" loading="lazy" decoding="async"></span>';
    }).join('');
  }
  document.querySelectorAll('.ticker[data-logos] .ticker-track').forEach(function (t) {
    var h = logoItems('ticker-logo');
    t.innerHTML = h + h;
  });
  document.querySelectorAll('[data-logo-strip]').forEach(function (t) {
    var h = logoItems('hx-logo');
    t.innerHTML = h + h;
  });
})();

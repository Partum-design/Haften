/* HAFTEN — header y chat de atención (todas las páginas) */
(function () {
  'use strict';

  var body = document.body;
  var reduce = function () { return body.classList.contains('no-anim') || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var norm = function (s) { return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); };

  /* ── DATOS DE CONTACTO ── */
  var C = {
    tel: '+52 55 5638 1224', telHref: 'tel:+525556381224',
    wa: '+52 55 8007 0413', waNum: '5215580070413',
    ventas: 'ventas@haften.com.mx', ing: 'ingenieria@haften.com.mx', info: 'info@haften.com.mx'
  };
  function waLink(text) { return 'https://wa.me/' + C.waNum + '?text=' + encodeURIComponent(text); }
  function mailLink(to, subject, text) { return 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(text); }

  /* ════════════════════ HEADER ════════════════════ */
  var nav = document.getElementById('navbar');
  var links = document.getElementById('navLinks');
  var ham = document.getElementById('menuBtn');

  if (nav) {
    var bar = document.createElement('div');
    bar.className = 'nav-progress';
    bar.setAttribute('aria-hidden', 'true');
    nav.appendChild(bar);

    var lastY = window.scrollY, ticking = false;
    var menuOpen = function () { return links && links.classList.contains('open'); };
    var panelOpen = function () { var p = document.getElementById('a11yPanel'); return p && p.classList.contains('open'); };
    function onScroll() {
      var y = window.scrollY, h = document.documentElement.scrollHeight - innerHeight;
      nav.classList.toggle('scrolled', y > 20);
      nav.style.setProperty('--p', h > 0 ? Math.min(1, y / h).toFixed(4) : 0);
      var down = y > lastY + 4, up = y < lastY - 4;
      if (y < 160 || up || menuOpen() || panelOpen() || document.activeElement && nav.contains(document.activeElement)) nav.classList.remove('nav-hide');
      else if (down) nav.classList.add('nav-hide');
      if (down || up) lastY = y;
      ticking = false;
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    nav.addEventListener('focusin', function () { nav.classList.remove('nav-hide'); });
    onScroll();
  }

  if (links) {
    // indicador deslizante (escritorio)
    var ind = document.createElement('span');
    ind.className = 'n-ind';
    ind.setAttribute('aria-hidden', 'true');
    links.insertBefore(ind, links.firstChild);
    var active = links.querySelector('.n-link.active');
    function moveTo(a) {
      if (!a || innerWidth <= 900) { links.classList.remove('has-ind'); return; }
      var r = a.getBoundingClientRect(), pr = links.getBoundingClientRect();
      ind.style.width = r.width + 'px';
      ind.style.transform = 'translateX(' + (r.left - pr.left - 1) + 'px)';
      links.classList.add('has-ind');
    }
    links.querySelectorAll('.n-link').forEach(function (a) {
      a.addEventListener('mouseenter', function () { moveTo(a); });
      a.addEventListener('focus', function () { moveTo(a); });
    });
    links.addEventListener('mouseleave', function () { active ? moveTo(active) : links.classList.remove('has-ind'); });
    var place = function () { active ? moveTo(active) : links.classList.remove('has-ind'); };
    window.addEventListener('resize', place);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
    setTimeout(place, 60);

    // accesos rápidos dentro del menú móvil
    var extra = document.createElement('li');
    extra.className = 'n-mobile-extra';
    extra.innerHTML =
      '<a href="' + C.telHref + '"><i class="fa-solid fa-phone" aria-hidden="true"></i>Llamar</a>' +
      '<a href="' + waLink('Hola Haften, me gustaría más información.') + '" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i>WhatsApp</a>' +
      '<a href="mailto:' + C.ventas + '"><i class="fa-solid fa-envelope" aria-hidden="true"></i>Correo</a>';
    links.appendChild(extra);
  }
  if (ham && links) {
    // bloquea el scroll del fondo con el menú abierto en móvil
    new MutationObserver(function () {
      var open = links.classList.contains('open');
      body.style.overflow = open && innerWidth <= 900 ? 'hidden' : '';
      ham.setAttribute('aria-expanded', open ? 'true' : 'false');
    }).observe(links, { attributes: true, attributeFilter: ['class'] });
  }

  /* ════════════════════ CHAT ════════════════════ */
  var BRANDS = [
    { k: ['air monitor', 'airmonitor'], n: 'Air Monitor', d: 'medición de flujo de aire de precisión para HVAC', id: 8 },
    { k: ['belimo'], n: 'Belimo', d: 'actuadores, válvulas de control y Energy Valve', id: 9 },
    { k: ['bry-air', 'bry air', 'bryair'], n: 'Bry-Air', d: 'deshumidificadores desecantes', id: 10 },
    { k: ['contemporary'], n: 'Contemporary Controls', d: 'routers, gateways y controladores BACnet', id: 11 },
    { k: ['control techniques'], n: 'Control Techniques', d: 'variadores de frecuencia y servodrives', id: 12 },
    { k: ['coolautomation', 'cool automation'], n: 'CoolAutomation', d: 'gateways para VRF y mini-splits hacia BMS', id: 13 },
    { k: ['delta'], n: 'Delta', d: 'variadores, PLC y HMI', id: 14 },
    { k: ['dwyer', 'omega'], n: 'Dwyer Omega', d: 'instrumentación de presión, flujo y temperatura', id: 15 },
    { k: ['flowcon'], n: 'FlowCon', d: 'válvulas independientes de la presión y balanceo', id: 16 },
    { k: ['gpi', 'global precision'], n: 'GPI', d: 'medidores de flujo para agua, combustibles y químicos', id: 17 },
    { k: ['greystone'], n: 'Greystone', d: 'sensores y transmisores para HVAC', id: 18 },
    { k: ['johnson', 'facility explorer', 'jci'], n: 'Johnson Controls', d: 'Facility Explorer y termostatos', id: 19 },
    { k: ['loytec'], n: 'LOYTEC', d: 'automatización de edificios e integración', id: 20 },
    { k: ['onicon'], n: 'ONICON', d: 'medidores de flujo y energía térmica', id: 21 },
    { k: ['meitav'], n: 'Meitav-tec', d: 'termostatos y controladores', id: 22 },
    { k: ['neptronic'], n: 'Neptronic', d: 'humidificadores, actuadores y controladores HVAC', id: 23 },
    { k: ['senva'], n: 'Senva', d: 'sensores y transductores de corriente', id: 24 },
    { k: ['vaisala'], n: 'Vaisala', d: 'medición de humedad, CO₂ y temperatura', id: 25 },
    { k: ['setra'], n: 'Setra', d: 'transductores de presión para áreas críticas', id: 27 },
    { k: ['badger'], n: 'Badger Meter', d: 'medición de flujo', id: 0 },
    { k: ['griswold'], n: 'Griswold Controls', d: 'válvulas de balanceo', id: 0 }
  ];
  var FICHAS = {
    'AC223-A2': '/Documentos/AC223-A2.pdf', 'AC223-E1': '/Documentos/AC223-E1.pdf', 'AC223-M2': '/Documentos/AC223-M2.pdf',
    'ALT-CPH-1S': '/Documentos/ALT-CPH-1S.pdf', 'ALT': '/Documentos/ALT.pdf', 'BAST-221-321': '/Documentos/BAST-221-321.pdf',
    'BAST-421': '/Documentos/BAST-421.pdf', 'EXT-CF24': '/Documentos/EXT-CF24.pdf', 'EXT-CF230': '/Documentos/EXT-CF230.pdf',
    'EXT-RCF/RCPB': '/Documentos/EXT-RCx.pdf', 'GA-B': '/Documentos/GA-B.pdf', 'HRO': '/Documentos/HRO.pdf',
    'HT1000': '/Documentos/HT1000.pdf', 'HT5000HC11': '/Documentos/HT5000HC11.pdf', 'HTW-WF06-FC': '/Documentos/HTW-WF06-FC.pdf',
    'MTS': '/Documentos/MTS.pdf', 'NEST 3a gen.': '/Documentos/NEST%203A.pdf', 'NEST 4a gen.': '/Documentos/NEST%204TA.pdf',
    'P722U': '/Documentos/P722U.pdf', 'TAS24': '/Documentos/TAS24.pdf', 'TAS400': '/Documentos/TAS400.pdf',
    'TAT-SUPER': '/Documentos/TAT-SUPER.pdf', 'TBS24': '/Documentos/TBS24.pdf', 'TEC3000': '/Documentos/TEC3000.pdf',
    'TEC4000S': '/catalogs/TEC4000S.PDF', 'TRS-HT4-01': '/Documentos/TRS-HT4-01.pdf', 'TUCB-TUHB': '/Documentos/TUCB-TUHB.pdf',
    'TUUB': '/Documentos/TUUB.pdf', 'EXT-SW (válvulas)': '/catalogs/EXT_SW_VALVES.pdf',
    'AL40MET3': '/catalogs/Ficha%20tecnica%20AL40MET3.pdf', 'AL50MET3': '/catalogs/Ficha%20tecnica%20AL50MET3.pdf',
    'AL75MET3': '/catalogs/Ficha%20tecnica%20AL75MET3.pdf', 'AL100MET3': '/catalogs/Ficha%20tecnica%20AL100MET3.pdf'
  };
  var OFFICES = [
    { k: ['cdmx', 'ciudad de mexico', 'mexico city', 'df', 'matriz', 'roma'], n: 'Ciudad de México — Casa matriz', a: 'Tehuantepec 125, Col. Roma Sur, Alc. Cuauhtémoc, C.P. 06760, CDMX', map: 'https://www.google.com/maps/search/?api=1&query=Haften%2C%20Tehuantepec%20125%2C%20Roma%20Sur%2C%20CDMX' },
    { k: ['monterrey', 'nuevo leon', 'mty', 'noreste'], n: 'Monterrey, N.L.', a: 'Oficina regional noreste (Nuevo León, Coahuila y Tamaulipas)', map: 'https://www.google.com/maps/search/?api=1&query=Monterrey%2C%20Nuevo%20Le%C3%B3n' },
    { k: ['guadalajara', 'jalisco', 'gdl', 'occidente'], n: 'Guadalajara, Jal.', a: 'Av. Miguel Hidalgo y Costilla 2430, Vallarta Nte., C.P. 44690, Zapopan, Jal.', map: 'https://www.google.com/maps/search/?api=1&query=Haften%20Gdl%2C%20Av.%20Miguel%20Hidalgo%20y%20Costilla%202430%2C%20Zapopan' },
    { k: ['leon', 'guanajuato', 'bajio', 'queretaro', 'gto'], n: 'León, Gto.', a: 'Oficina regional del Bajío (Guanajuato, Querétaro, Aguascalientes)', map: 'https://www.google.com/maps/search/?api=1&query=Le%C3%B3n%2C%20Guanajuato' },
    { k: ['cancun', 'quintana roo', 'yucatan', 'merida', 'sureste', 'riviera'], n: 'Cancún, Q. Roo', a: 'Av. Muyil 39, Villas del Carmen, C.P. 77516, Cancún, Q. Roo', map: 'https://www.google.com/maps/search/?api=1&query=HAFTEN%20CANCUN%2C%20Av.%20Muyil%2039%2C%20Canc%C3%BAn' }
  ];

  // horario: lun–vie 8:00–17:30 (hora del centro de México)
  function openNow() {
    try {
      var parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Mexico_City', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
      var get = function (t) { return (parts.find(function (p) { return p.type === t; }) || {}).value; };
      var d = get('weekday'), m = (+get('hour')) * 60 + (+get('minute'));
      if (['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].indexOf(d) >= 0) return m >= 480 && m < 1050;
      return false;
    } catch (e) { return null; }
  }

  var QUICK = [
    { t: 'Cotizar', i: 'fa-solid fa-file-invoice-dollar', q: 'Quiero una cotización' },
    { t: 'Catálogos', i: 'fa-solid fa-book-open', q: 'Catálogos' },
    { t: 'Fichas técnicas', i: 'fa-solid fa-file-pdf', q: 'Fichas técnicas' },
    { t: 'Sucursales', i: 'fa-solid fa-location-dot', q: 'Sucursales' },
    { t: 'Soporte técnico', i: 'fa-solid fa-screwdriver-wrench', q: 'Soporte técnico' },
    { t: 'Horario', i: 'fa-regular fa-clock', q: 'Horario' },
    { t: 'Hablar con un asesor', i: 'fa-brands fa-whatsapp', q: 'Hablar con un asesor' }
  ];

  var card = function (href, icon, title, sub, ext) {
    return '<a class="hz-card" href="' + href + '"' + (ext ? ' target="_blank" rel="noopener"' : '') + '><i class="' + icon + '" aria-hidden="true"></i><span>' + title + (sub ? '<small>' + sub + '</small>' : '') + '</span><i class="fa-solid ' + (ext ? 'fa-arrow-up-right-from-square' : 'fa-arrow-right') + '" aria-hidden="true"></i></a>';
  };
  var contactCards = function (text) {
    return '<div class="hz-cards">' +
      card(waLink(text || 'Hola Haften, me gustaría hablar con un asesor.'), 'fa-brands fa-whatsapp', 'WhatsApp', C.wa, true) +
      card(C.telHref, 'fa-solid fa-phone', 'Llamar a oficina', C.tel) +
      card('mailto:' + C.ventas, 'fa-solid fa-envelope', 'Correo de ventas', C.ventas) +
      '</div>';
  };

  var state = { step: null, data: {} };

  function reply(raw) {
    var q = norm(raw).trim();
    var has = function () { for (var i = 0; i < arguments.length; i++) if (q.indexOf(arguments[i]) >= 0) return true; return false; };

    // ── flujo de cotización guiado ──
    if (state.step === 'quote-product') {
      state.data.product = raw; state.step = 'quote-qty';
      return { html: 'Perfecto: <strong>' + esc(raw) + '</strong>. ¿Qué cantidad necesitas y en qué ciudad se entrega?', chips: ['1 pieza, CDMX', 'Varias piezas', 'Aún no lo sé'] };
    }
    if (state.step === 'quote-qty') {
      state.data.qty = raw; state.step = 'quote-name';
      return { html: 'Gracias. ¿A nombre de quién y de qué empresa hacemos la cotización?', chips: ['Prefiero no decirlo'] };
    }
    if (state.step === 'quote-name') {
      state.data.name = raw; state.step = null;
      var d = state.data;
      var txt = 'Hola Haften, solicito una cotización.\n• Producto: ' + d.product + '\n• Cantidad / entrega: ' + d.qty + '\n• Contacto: ' + d.name;
      state.data = {};
      return {
        html: '¡Listo! Esta es tu solicitud:<ul><li><strong>Producto:</strong> ' + esc(d.product) + '</li><li><strong>Cantidad / entrega:</strong> ' + esc(d.qty) + '</li><li><strong>Contacto:</strong> ' + esc(d.name) + '</li></ul>Envíala por el medio que prefieras y un ingeniero de ventas te responde en menos de 24 h hábiles.' +
          '<div class="hz-cards">' + card(waLink(txt), 'fa-brands fa-whatsapp', 'Enviar por WhatsApp', 'Respuesta más rápida', true) +
          card(mailLink(C.ventas, 'Solicitud de cotización — ' + d.product, txt), 'fa-solid fa-envelope', 'Enviar por correo', C.ventas) + '</div>'
      };
    }

    if (!q) return null;
    if (/^(hola|buen[oa]s|que tal|hey|saludos)\b/.test(q) && q.length < 30)
      return { html: '¡Hola! 👋 Soy el asistente de <strong>Haften</strong>. Te ayudo con cotizaciones, catálogos, fichas técnicas, sucursales o soporte. ¿Qué necesitas?', chips: ['Cotizar', 'Catálogos', 'Sucursales'] };
    if (has('gracias', 'thank'))
      return { html: '¡Con gusto! Si necesitas algo más, aquí estoy. 🙌', chips: ['Hablar con un asesor', 'Catálogos'] };
    if (has('adios', 'bye', 'hasta luego'))
      return { html: '¡Hasta pronto! Gracias por contactar a Haften.' };

    // fichas por modelo
    var toks = q.split(/\s+/).map(function (t) { return t.replace(/[^a-z0-9]/g, ''); }).filter(function (t) { return t.length >= 3; });
    var hits = Object.keys(FICHAS).filter(function (code) {
      var c = norm(code).replace(/\(.*\)|gen\.?$/g, '').replace(/[^a-z0-9]/g, '');
      return toks.some(function (t) { return t === c || c.indexOf(t) === 0 || (c.length >= 5 && t.indexOf(c) === 0); });
    });
    if (hits.length && hits.length < 6)
      return { html: 'Encontré ' + (hits.length > 1 ? 'estas fichas técnicas' : 'esta ficha técnica') + ':<div class="hz-cards">' + hits.map(function (h) { return card(FICHAS[h], 'fa-solid fa-file-pdf', 'Ficha ' + esc(h), 'PDF', true); }).join('') + '</div>', chips: ['Quiero una cotización', 'Soporte técnico'] };

    if (has('cotiz', 'precio', 'costo', 'cuanto cuesta', 'comprar', 'compra', 'pedido', 'presupuesto', 'disponibilidad', 'stock', 'existencia')) {
      state.step = 'quote-product';
      return { html: 'Con gusto preparo tu solicitud de cotización. ¿Qué <strong>producto, modelo o marca</strong> necesitas?', chips: ['Actuador Belimo', 'Termostato', 'Válvula de control', 'Sensor de humedad'] };
    }

    // marcas
    var b = BRANDS.filter(function (x) { return x.k.some(function (k) { return q.indexOf(k) >= 0; }); });
    if (b.length) {
      var x = b[0];
      return {
        html: 'Sí, distribuimos <strong>' + esc(x.n) + '</strong> — ' + esc(x.d) + '.' + '<div class="hz-cards">' +
          (x.id ? card('/WebSite/DownloadFileCatalog?fileID=' + x.id, 'fa-solid fa-book-open', 'Catálogo ' + esc(x.n), 'PDF', true) : '') +
          card('/marcas', 'fa-solid fa-tags', 'Ver todas las marcas', '') + '</div>',
        chips: ['Cotizar ' + x.n, 'Hablar con un asesor']
      };
    }

    // sucursales
    var qo = q.replace(/nuevo leon/g, 'monterrey');
    var o = OFFICES.filter(function (x) { return x.k.some(function (k) { return new RegExp('\\b' + k + '\\b').test(qo); }); });
    if (o.length && !has('catalog'))
      return { html: o.map(function (x) { return '<strong>' + esc(x.n) + '</strong><br>' + esc(x.a); }).join('<br><br>') + '<div class="hz-cards">' + o.map(function (x) { return card(x.map, 'fa-solid fa-map-location-dot', 'Abrir en Google Maps', x.n, true); }).join('') + card(waLink('Hola Haften, quiero agendar una visita en ' + o[0].n.replace(/\.$/, '') + '.'), 'fa-brands fa-whatsapp', 'Agendar una visita', 'WhatsApp', true) + '</div>' };
    if (has('sucursal', 'oficina', 'ubicacion', 'direccion', 'donde estan', 'donde se encuentran', 'mapa', 'domicilio'))
      return { html: 'Tenemos <strong>5 sucursales</strong>:<ul><li><strong>Ciudad de México</strong> (casa matriz) — Tehuantepec 125, Roma Sur</li><li><strong>Monterrey</strong> — noreste</li><li><strong>Guadalajara</strong> — Av. Miguel Hidalgo y Costilla 2430</li><li><strong>León</strong> — Bajío</li><li><strong>Cancún</strong> — Av. Muyil 39</li></ul>¿Cuál te queda más cerca?', chips: ['CDMX', 'Monterrey', 'Guadalajara', 'León', 'Cancún'] };

    if (has('ficha', 'datasheet', 'hoja tecnica', 'especificacion', 'termostato'))
      return { html: 'Tenemos <strong>39 fichas técnicas</strong> de termostatos, controladores, válvulas y medidores. Escribe el modelo (por ejemplo <em>TEC3000</em> o <em>BAST-421</em>) o explóralas todas:<div class="hz-cards">' + card('/catalogos#fichas', 'fa-solid fa-file-lines', 'Explorar fichas técnicas', '39 documentos') + '</div>', chips: ['TEC3000', 'Nest', 'AL40MET3'] };
    if (has('catalog', 'pdf', 'descarg', 'brochure', 'folleto'))
      return { html: 'En <strong>Catálogos</strong> encuentras el Catálogo HAFTEN 2025 y los de nuestras 19 marcas, con búsqueda y filtros por categoría.<div class="hz-cards">' + card('/catalogos', 'fa-solid fa-book-open', 'Ir a Catálogos', 'Búsqueda por marca o modelo') + '</div>¿Buscas el de alguna marca en particular?', chips: ['Belimo', 'Dwyer', 'Johnson Controls', 'Vaisala'] };
    if (has('soporte', 'tecnico', 'falla', 'problema', 'instalacion', 'configur', 'garantia', 'ingenier', 'ayuda tecnica', 'no funciona', 'puesta en marcha'))
      return { html: 'Nuestro equipo de <strong>ingeniería</strong> te ayuda con selección, instalación, configuración y garantías. Cuéntales el modelo y lo que ocurre:' + '<div class="hz-cards">' + card(mailLink(C.ing, 'Soporte técnico', 'Hola, necesito apoyo técnico con:\n\nModelo: \nDescripción: '), 'fa-solid fa-screwdriver-wrench', 'Escribir a ingeniería', C.ing) + card(waLink('Hola Haften, necesito soporte técnico con un equipo.'), 'fa-brands fa-whatsapp', 'Soporte por WhatsApp', C.wa, true) + '</div>' };
    if (has('horario', 'abierto', 'abren', 'cierran', 'atienden') || /\bhoras?\b/.test(q)) {
      var on = openNow();
      return { html: (on === null ? '' : (on ? '🟢 <strong>Estamos abiertos ahora.</strong><br>' : '🔴 <strong>Ahora estamos fuera de horario</strong>; te respondemos el siguiente día hábil.<br>')) + '<ul><li>Lunes a viernes: 8:00 – 17:30</li><li>Sábados, domingos y festivos: cerrado</li></ul><small>Hora del centro de México.</small>', chips: ['Hablar con un asesor'] };
    }
    if (has('asesor', 'humano', 'persona', 'agente', 'vendedor', 'ejecutivo', 'whatsapp', 'llamar', 'telefono', 'contacto', 'correo', 'email', 'mail'))
      return { html: 'Claro, te comunico con un asesor de Haften:' + contactCards('Hola Haften, me gustaría hablar con un asesor.') };
    if (has('marca', 'que venden', 'productos', 'distribu', 'representan'))
      return { html: 'Representamos <strong>21 marcas</strong> líderes: Belimo, Johnson Controls, Dwyer Omega, FlowCon, Vaisala, ONICON, Setra, LOYTEC, Neptronic, Delta y más. Actuadores, válvulas, sensores, medidores, variadores y controladores.<div class="hz-cards">' + card('/marcas', 'fa-solid fa-tags', 'Ver marcas', '') + '</div>', chips: ['Belimo', 'Cotizar'] };
    if (has('humid', 'deshumid', 'calefact', 'actuador', 'valvula', 'sensor', 'medidor', 'variador', 'vfd', 'bacnet', 'controlador', 'damper', 'transmisor', 'manometro', 'co2'))
      return { html: 'Sí manejamos ese tipo de equipo. Para recomendarte el modelo correcto, un ingeniero puede revisar tu aplicación. ¿Te preparo una cotización?', chips: ['Quiero una cotización', 'Fichas técnicas', 'Hablar con un asesor'] };
    if (has('trabajo', 'empleo', 'vacante', 'bolsa'))
      return { html: 'Para oportunidades laborales envía tu CV a <a href="mailto:' + C.info + '">' + C.info + '</a> indicando la vacante de tu interés.' };
    if (has('factura', 'pago', 'credito', 'envio', 'entrega', 'paqueteria'))
      return { html: 'Facturación, pagos, crédito y envíos los resuelve directamente nuestro equipo de ventas:' + contactCards('Hola Haften, tengo una duda sobre facturación / envío.') };

    return {
      html: 'No tengo una respuesta exacta para eso, pero un asesor sí. Puedo enviarle tu pregunta tal cual:' +
        '<div class="hz-cards">' + card(waLink('Hola Haften, tengo una pregunta: ' + raw), 'fa-brands fa-whatsapp', 'Enviar mi pregunta por WhatsApp', C.wa, true) +
        card(mailLink(C.ventas, 'Consulta desde el sitio web', raw), 'fa-solid fa-envelope', 'Enviar por correo', C.ventas) + '</div>',
      chips: ['Cotizar', 'Catálogos', 'Sucursales']
    };
  }

  /* ── interfaz ── */
  var STORE = 'haften-chat-v2';
  var fab = document.createElement('button');
  fab.type = 'button';
  fab.className = 'hz-fab';
  fab.id = 'chatFab';
  fab.setAttribute('aria-label', 'Abrir chat de atención Haften');
  fab.setAttribute('aria-expanded', 'false');
  fab.setAttribute('aria-controls', 'chatWindow');
  fab.innerHTML = '<i class="fa-solid fa-comment-dots ic-open" aria-hidden="true"></i><i class="fa-solid fa-xmark ic-close" aria-hidden="true"></i><span class="hz-badge" aria-hidden="true">1</span>';

  var teaser = document.createElement('div');
  teaser.className = 'hz-teaser';
  teaser.setAttribute('role', 'status');
  teaser.innerHTML = '¿Buscas un producto o cotización? <b>Te ayudo en segundos.</b><button type="button" aria-label="Cerrar aviso"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>';

  var win = document.createElement('div');
  win.className = 'hz-chat';
  win.id = 'chatWindow';
  win.setAttribute('role', 'dialog');
  win.setAttribute('aria-modal', 'false');
  win.setAttribute('aria-labelledby', 'hzName');
  win.innerHTML =
    '<div class="hz-head">' +
    '<div class="hz-avatar" aria-hidden="true">H</div>' +
    '<div class="hz-title"><div class="hz-name" id="hzName">Asistente Haften</div><div class="hz-status" id="hzStatus"></div></div>' +
    '<button type="button" class="hz-hbtn" id="hzReset" aria-label="Reiniciar conversación" title="Reiniciar conversación"><i class="fa-solid fa-rotate-left" aria-hidden="true"></i></button>' +
    '<button type="button" class="hz-hbtn" id="chatClose" aria-label="Cerrar chat" title="Cerrar"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>' +
    '</div>' +
    '<div class="hz-msgs" id="cwMsgs" role="log" aria-live="polite" aria-relevant="additions"></div>' +
    '<div class="hz-quick" id="hzQuick" role="group" aria-label="Sugerencias"></div>' +
    '<form class="hz-form" id="hzForm" autocomplete="off">' +
    '<label for="cwInput" class="sr-only">Escribe tu mensaje</label>' +
    '<textarea class="hz-input" id="cwInput" rows="1" maxlength="600" placeholder="Escribe tu pregunta o un modelo…"></textarea>' +
    '<button type="submit" class="hz-send" id="cwSend" aria-label="Enviar mensaje" disabled><i class="fa-solid fa-paper-plane" aria-hidden="true"></i></button>' +
    '</form>' +
    '<div class="hz-foot">Respuestas automáticas · Atención humana por <a href="' + waLink('Hola Haften, me gustaría más información.') + '" target="_blank" rel="noopener">WhatsApp</a></div>';

  /* botón flotante de WhatsApp (como en la página anterior) */
  var waFab = document.createElement('a');
  waFab.className = 'hz-wa';
  waFab.href = waLink('Hola Haften, me gustaría más información.');
  waFab.target = '_blank';
  waFab.rel = 'noopener';
  waFab.setAttribute('aria-label', 'Escríbenos por WhatsApp');
  waFab.innerHTML = '<i class="fa-brands fa-whatsapp" aria-hidden="true"></i><span class="hz-wa-tip">¿Hablamos por WhatsApp?</span>';

  body.appendChild(teaser);
  body.appendChild(waFab);
  body.appendChild(fab);
  body.appendChild(win);

  var msgs = win.querySelector('#cwMsgs'), input = win.querySelector('#cwInput'), send = win.querySelector('#cwSend');
  var quick = win.querySelector('#hzQuick'), form = win.querySelector('#hzForm'), statusEl = win.querySelector('#hzStatus');
  var history = [];

  function setStatus() {
    var on = openNow();
    statusEl.textContent = on === false ? 'Fuera de horario · respondemos el siguiente día hábil' : 'En línea · ingenieros disponibles';
    win.style.setProperty('--hz-status', on === false ? '#f5b041' : '#3ddc84');
  }
  function time() { return new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }); }
  function save() { try { sessionStorage.setItem(STORE, JSON.stringify({ h: history.slice(-40), s: state })); } catch (e) { } }
  function scroll() { msgs.scrollTop = msgs.scrollHeight; }
  function add(who, html, t, silent) {
    var m = document.createElement('div');
    m.className = 'hz-msg ' + who;
    m.innerHTML = html + '<span class="hz-time">' + (t || time()) + '</span>';
    if (silent) m.style.animation = 'none';
    msgs.appendChild(m);
    history.push({ w: who, h: html, t: t || time() });
    scroll();
    return m;
  }
  function chips(list) {
    quick.innerHTML = '';
    var items = (list && list.length ? list.map(function (t) { var f = QUICK.find(function (x) { return x.t === t; }); return f || { t: t, i: 'fa-solid fa-arrow-right', q: t }; }) : QUICK);
    items.forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'hz-chip';
      b.innerHTML = '<i class="' + c.i + '" aria-hidden="true"></i>' + esc(c.t);
      b.addEventListener('click', function () { ask(c.q || c.t); });
      quick.appendChild(b);
    });
    quick.scrollLeft = 0;
  }
  var busy = false;
  function ask(text) {
    text = String(text).trim();
    if (!text || busy) return;
    if (/^cotizar\s+\S/i.test(text)) { state.step = 'quote-product'; text = text.replace(/^cotizar\s+/i, ''); }
    add('usr', esc(text));
    input.value = ''; autosize(); send.disabled = true;
    var r = reply(text);
    if (!r) return;
    busy = true;
    var typing = document.createElement('div');
    typing.className = 'hz-typing';
    typing.setAttribute('aria-label', 'Escribiendo');
    typing.innerHTML = '<span></span><span></span><span></span>';
    msgs.appendChild(typing); scroll();
    setTimeout(function () {
      typing.remove();
      add('bot', r.html);
      chips(r.chips);
      busy = false;
      save();
    }, reduce() ? 50 : 450 + Math.min(700, r.html.length * 1.2));
  }
  function greet() {
    msgs.innerHTML = '<div class="hz-day">Hoy</div>';
    history = []; state.step = null; state.data = {};
    add('bot', '¡Hola! 👋 Soy el asistente de <strong>Haften</strong>.');
    add('bot', 'Puedo ayudarte a <strong>cotizar</strong>, encontrar un <strong>catálogo o ficha técnica</strong>, ubicar tu <strong>sucursal</strong> más cercana o comunicarte con un <strong>ingeniero</strong>. Elige una opción o escribe tu pregunta.');
    chips();
    save();
  }
  function restore() {
    try {
      var s = JSON.parse(sessionStorage.getItem(STORE) || 'null');
      if (s && s.h && s.h.length) {
        msgs.innerHTML = '<div class="hz-day">Hoy</div>';
        history = [];
        s.h.forEach(function (m) { add(m.w, m.h, m.t, true); });
        if (s.s) { state.step = s.s.step; state.data = s.s.data || {}; }
        chips();
        return true;
      }
    } catch (e) { }
    return false;
  }
  function autosize() { input.style.height = 'auto'; input.style.height = Math.min(110, input.scrollHeight) + 'px'; }

  var started = false;
  function open() {
    if (!started) { started = true; restore() || greet(); }
    setStatus();
    win.classList.add('open');
    body.classList.add('hz-open');
    fab.setAttribute('aria-expanded', 'true');
    fab.setAttribute('aria-label', 'Cerrar chat');
    fab.querySelector('.hz-badge').hidden = true;
    teaser.classList.remove('show');
    try { sessionStorage.setItem('haften-chat-seen', '1'); } catch (e) { }
    setTimeout(function () { input.focus({ preventScroll: true }); scroll(); }, 120);
  }
  function close(focusFab) {
    win.classList.remove('open');
    body.classList.remove('hz-open');
    fab.setAttribute('aria-expanded', 'false');
    fab.setAttribute('aria-label', 'Abrir chat de atención Haften');
    if (focusFab) fab.focus();
  }
  // si otro script cierra la ventana (p. ej. Escape global), sincroniza el estado
  new MutationObserver(function () { if (!win.classList.contains('open') && body.classList.contains('hz-open')) close(false); })
    .observe(win, { attributes: true, attributeFilter: ['class'] });
  fab.addEventListener('click', function () { win.classList.contains('open') ? close(false) : open(); });
  win.querySelector('#chatClose').addEventListener('click', function () { close(true); });
  win.querySelector('#hzReset').addEventListener('click', function () { greet(); input.focus(); });
  form.addEventListener('submit', function (e) { e.preventDefault(); ask(input.value); });
  input.addEventListener('input', function () { send.disabled = !input.value.trim(); autosize(); });
  input.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(input.value); } });
  win.addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.stopPropagation(); close(true); } });
  teaser.querySelector('button').addEventListener('click', function () { teaser.classList.remove('show'); try { sessionStorage.setItem('haften-chat-seen', '1'); } catch (e) { } });
  teaser.addEventListener('click', function (e) { if (!e.target.closest('button')) open(); });

  // cualquier enlace a #chat abre el asistente
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href="#chat"], [data-open-chat]');
    if (a) { e.preventDefault(); open(); if (a.dataset.openChat) ask(a.dataset.openChat); }
  });
  window.HaftenChat = { open: open, ask: function (t) { open(); setTimeout(function () { ask(t); }, 200); } };

  // invitación discreta una vez por sesión
  var seen = false;
  try { seen = !!sessionStorage.getItem('haften-chat-seen'); } catch (e) { }
  if (!seen) {
    setTimeout(function () {
      if (win.classList.contains('open')) return;
      teaser.classList.add('show');
      if (!reduce()) fab.classList.add('ping');
      setTimeout(function () { teaser.classList.remove('show'); }, 9000);
    }, 7000);
  } else fab.querySelector('.hz-badge').hidden = true;
})();

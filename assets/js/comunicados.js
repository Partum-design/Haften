/* HAFTEN — centro de comunicados (todas las páginas)
   Agrega una campana al encabezado, un panel con los avisos y un visor tipo libro.
   Para publicar un aviso nuevo basta con agregarlo al arreglo AVISOS. */
(function () {
  'use strict';

  var AVISOS = [
    {
      id: 'inventario-2026',
      fecha: '2026-11-05',
      emisor: 'Haften',
      tipo: 'Aviso operativo',
      icono: 'fa-warehouse',
      titulo: 'Cierre temporal de almacén por inventario anual 2026',
      resumen: 'El almacén permanecerá cerrado del 23 al 27 de noviembre. Programa tus pedidos con anticipación.',
      evento: { inicio: '2026-11-23', fin: '2026-11-27', etiqueta: 'Almacén cerrado' },
      claves: [
        ['Cierre', '23 – 27 nov 2026'],
        ['Reapertura', 'Lunes 30 nov 2026']
      ],
      pdf: 'assets/comunicados/inventario-anual-2026.pdf',
      paginas: [
        '<p class="cm-place">Ciudad de México, a 5 de noviembre de 2026</p>' +
        '<h3>Aviso de cierre temporal de almacén por inventario anual 2026</h3>' +
        '<p><b>A nuestros distinguidos clientes:</b></p>' +
        '<p>Como parte de nuestros procedimientos internos de control y cierre del ejercicio 2026, HAFTEN, S.A. de C.V. llevará a cabo su inventario físico anual, con el propósito de garantizar la correcta administración, verificación y control de nuestras existencias.</p>',

        '<div class="cm-hl"><i class="fa-solid fa-calendar-xmark"></i><div><b>Del 23 al 27 de noviembre de 2026</b><span>el almacén permanecerá cerrado</span></div></div>' +
        '<p>Durante ese periodo se suspenderán temporalmente todas las actividades de recepción, preparación y entrega de mercancías, sin excepción alguna.</p>' +
        '<p>Les pedimos programar y coordinar sus pedidos y entregas con la debida anticipación. Las operaciones del almacén se reanudarán de manera habitual el <b>lunes 30 de noviembre de 2026</b>.</p>',

        '<p>Esta medida tiene como finalidad asegurar la precisión de nuestros registros de inventario y mantener los estándares de calidad, eficiencia y servicio que nos caracterizan.</p>' +
        '<p>Agradecemos de antemano su comprensión, confianza y valiosa colaboración. Reiteramos nuestro compromiso de seguir brindándoles una atención oportuna y un servicio de excelencia.</p>' +
        '<div class="cm-sign"><span>Atentamente,</span><b>LCP, MDF y MCI Israel Calixto Rebolledo</b><span>Gerente de Administración · Haften, S.A. de C.V.</span></div>'
      ]
    },
    {
      id: 'belimo-precios-2027',
      fecha: '2026-11-04',
      emisor: 'Belimo',
      tipo: 'Precios',
      icono: 'fa-tags',
      titulo: 'Ajuste de precios Belimo para 2027',
      resumen: 'Desde el 1 de enero de 2027 Belimo aplicará un ajuste promedio menor al 0.5%. La mayoría de los productos conserva su precio 2026.',
      evento: { inicio: '2027-01-01', etiqueta: 'Entra en vigor' },
      claves: [
        ['Vigencia', '1 ene 2027'],
        ['Ajuste promedio', '< 0.5%']
      ],
      pdf: 'assets/comunicados/belimo-ajuste-precios-2027.pdf',
      paginas: [
        '<p class="cm-place">4 de noviembre de 2026</p>' +
        '<h3>Notificación de ajuste de precios para 2027</h3>' +
        '<p><b>Estimado cliente de Belimo:</b></p>' +
        '<p>A partir del 1 de enero de 2027, BELIMO U.S., Inc. aplicará un ajuste de precios promedio inferior al 0.5% en su gama de productos; la mayoría se mantendrá en los niveles de precio de 2026. La lista de precios electrónica (EPL) 2027 ya está disponible en belimo.com.</p>',

        '<div class="cm-hl"><i class="fa-solid fa-chart-line"></i><div><b>Menos de 0.5% en promedio</b><span>a partir del 1 de enero de 2027</span></div></div>' +
        '<p>Para clientes fuera de Estados Unidos, los ajustes pueden variar por el tipo de cambio entre la moneda local y el dólar. Este aviso se envía con anticipación para apoyar la planeación, cotización y compras.</p>' +
        '<p>Belimo sigue enfrentando presiones de costos por inflación y aranceles en toda su operación y cadena de suministro; aun así, limitó el ajuste 2027 a un nivel muy por debajo de la inflación actual.</p>',

        '<p>Belimo también considera el costo y el valor para el cliente al desarrollar productos nuevos. Ejemplo de ello es el sensor de presión diferencial de aire de la Nueva Generación Digital, con un precio menor que el del modelo al que sustituye.</p>' +
        '<p>Para cualquier duda, ponte en contacto con tu asesor de ventas Haften.</p>' +
        '<div class="cm-sign"><span>Atentamente,</span><b>Victor Coppola</b><span>Vicepresidente de Gestión de Producto y Marketing · BELIMO U.S., Inc.</span></div>'
      ]
    },
    {
      id: 'belimo-eb-033',
      fecha: '2026-10-23',
      emisor: 'Belimo',
      tipo: 'Producto',
      icono: 'fa-gears',
      titulo: 'Retiro de actuadores serie GM y última compra',
      resumen: 'Belimo descontinúa varios modelos GM. Última fecha para pedirlos: 18 de diciembre de 2026. Ya están disponibles sus reemplazos.',
      evento: { inicio: '2026-12-18', etiqueta: 'Última compra' },
      claves: [
        ['Última compra', '18 dic 2026'],
        ['Últimos envíos', '26 feb 2027']
      ],
      pdf: 'assets/comunicados/belimo-eb-033-serie-gm-original-en.pdf',
      pdfNota: 'Original en inglés',
      paginas: [
        '<p class="cm-place">Boletín externo EB-033 · 23 de octubre de 2026</p>' +
        '<h3>Retiro de actuadores para compuerta serie GM y última compra</h3>' +
        '<p>Belimo retirará del mercado los actuadores para compuerta de la serie GM que se enlistan a continuación.</p>' +
        '<p>La fecha límite de última compra es el <b>18 de diciembre de 2026</b> y los pedidos finales se enviarán a más tardar el <b>26 de febrero de 2027</b>.</p>' +
        '<p>Los nuevos modelos GM ya están disponibles. Las garantías se cubrirán con el producto actual (si hay existencia) o con el sucesor técnicamente más cercano de la Nueva Generación Digital.</p>',

        '<h4>Modelos que salen y su reemplazo</h4>' +
        '<p class="cm-note">Todos son actuadores rotativos de 360 in-lb, NEMA 2.</p>' +
        '<div class="cm-table" role="region" aria-label="Tabla de reemplazos" tabindex="0"><table>' +
        '<thead><tr><th>Sale</th><th>Nuevo</th><th>Características</th><th>USD</th></tr></thead><tbody>' +
        '<tr><td>GMB(X)24-SR</td><td>GM24SR.1B</td><td>24 V · SR · 150 s</td><td>$1,162</td></tr>' +
        '<tr><td>GMX24-SR-T</td><td>GM24SR.16</td><td>24 V · SR · terminales · 150 s</td><td>$1,120</td></tr>' +
        '<tr><td>GMB(X)24-3</td><td>GM24.8F</td><td>24 V · abrir/cerrar · 150 s</td><td>$872</td></tr>' +
        '<tr><td>GMX24-3-T</td><td>GM24.1A</td><td>24 V · abrir/cerrar · terminales · 150 s</td><td>$830</td></tr>' +
        '<tr><td>GMX120-3</td><td>GM120.2C</td><td>Línea · abrir/cerrar · 150 s</td><td>$952</td></tr>' +
        '<tr><td>—</td><td>GMC24S.27</td><td>24 V · abrir/cerrar · 35 s · interruptor</td><td>$1,065</td></tr>' +
        '<tr><td>—</td><td>GMC120S.27</td><td>Línea · abrir/cerrar · 35 s · S2 · interruptor</td><td>$1,145</td></tr>' +
        '</tbody></table></div>' +
        '<p class="cm-note">Precios de lista Belimo Américas en dólares, solo como referencia. Solicita tu cotización a Haften.</p>',

        '<h4>Nueva Generación Digital — serie GM</h4>' +
        '<ul class="cm-list">' +
        '<li>Nuevo microchip ASIC de Belimo: control y retroalimentación precisos, aun con el tren de engranes desacoplado.</li>' +
        '<li>Consumo de energía cerca de 80% menor: solo 0.2 W en espera y 2 W en operación.</li>' +
        '<li>App gratuita Belimo Assistant 2: configura por NFC sentido de giro, tiempo de recorrido, topes, señales de control y retroalimentación, incluso sin energía.</li>' +
        '<li>Conexiones de cable y terminales intercambiables en campo, selladas con protección IP65.</li>' +
        '</ul>',

        '<ul class="cm-list">' +
        '<li>Indicador LED integrado visible desde cualquier ángulo; se puede apagar desde la app.</li>' +
        '<li>Motor rediseñado y engranes silenciosos que reducen el ruido.</li>' +
        '<li>Mismas dimensiones de montaje que la GM actual: reemplazo directo.</li>' +
        '<li>Diseño robusto NEMA 2 (IP54) contra polvo y salpicaduras.</li>' +
        '<li>Garantía estándar Belimo de 5 años.</li>' +
        '</ul>' +
        '<p>Para dudas técnicas o más información, contacta a tu asesor de ventas Haften.</p>' +
        '<div class="cm-sign"><span>Atentamente,</span><b>Royce Breckon</b><span>Gerente de Producto, actuadores sin retorno por resorte · Belimo</span></div>'
      ]
    }
  ];

  var MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  var MESES_L = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  var KEY = 'haften-comunicados-leidos';

  function d(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function fCorta(s) { var x = d(s); return x.getDate() + ' ' + MESES[x.getMonth()] + ' ' + x.getFullYear(); }
  function fLarga(s) { var x = d(s); return x.getDate() + ' de ' + MESES_L[x.getMonth()] + ' de ' + x.getFullYear(); }
  function hoy() { var n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); }
  function dias(a, b) { return Math.round((b - a) / 864e5); }

  // Estado de cada aviso según su fecha clave
  function estado(a) {
    var e = a.evento, t = hoy(), ini = d(e.inicio), fin = e.fin ? d(e.fin) : ini;
    if (t > fin) return { k: 'past', txt: e.fin ? 'Concluido' : 'Vigente' };
    if (e.fin && t >= ini) return { k: 'now', txt: 'En curso' };
    var n = dias(t, ini);
    return { k: n <= 14 ? 'soon' : 'next', txt: n === 0 ? 'Hoy' : n === 1 ? 'Mañana' : 'En ' + n + ' días', n: n };
  }

  function leidos() { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; } }
  function marcar(id) {
    var l = leidos();
    if (l.indexOf(id) < 0) { l.push(id); try { localStorage.setItem(KEY, JSON.stringify(l)); } catch (e) { } }
    pintarBadge(); pintarLista();
  }

  AVISOS.sort(function (a, b) { return d(b.fecha) - d(a.fecha); });

  var tools = document.querySelector('#navbar .n-tools');
  if (!tools) return;

  /* ── BOTÓN ── */
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'n-tool-btn cm-btn';
  btn.id = 'cmBtn';
  btn.setAttribute('aria-haspopup', 'dialog');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', 'cmPanel');
  btn.innerHTML = '<i class="fa-solid fa-bell" aria-hidden="true"></i><span class="cm-badge" hidden></span>';
  tools.insertBefore(btn, tools.firstChild);

  /* ── PANEL ── */
  var wrap = document.createElement('div');
  wrap.className = 'cm-root';
  wrap.innerHTML =
    '<div class="cm-scrim" data-cm-close></div>' +
    '<aside class="cm-panel" id="cmPanel" role="dialog" aria-modal="true" aria-labelledby="cmTitle" tabindex="-1">' +
    '  <header class="cm-head">' +
    '    <div><span class="cm-eyebrow"><i class="fa-solid fa-bullhorn" aria-hidden="true"></i>Centro de comunicados</span>' +
    '    <h2 id="cmTitle">Avisos <span>Haften</span></h2></div>' +
    '    <button type="button" class="cm-x" data-cm-close aria-label="Cerrar comunicados"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>' +
    '  </header>' +
    '  <div class="cm-stats" id="cmStats"></div>' +
    '  <div class="cm-filters" role="group" aria-label="Filtrar comunicados">' +
    '    <button type="button" class="cm-f on" data-f="all" aria-pressed="true">Todos</button>' +
    '    <button type="button" class="cm-f" data-f="Haften" aria-pressed="false">Haften</button>' +
    '    <button type="button" class="cm-f" data-f="Belimo" aria-pressed="false">Belimo</button>' +
    '  </div>' +
    '  <ol class="cm-list-cards" id="cmList"></ol>' +
    '  <footer class="cm-foot"><i class="fa-solid fa-circle-info" aria-hidden="true"></i>¿Dudas sobre algún aviso? <a href="/contacto">Escríbenos</a></footer>' +
    '</aside>' +
    '<div class="cm-reader" id="cmReader" role="dialog" aria-modal="true" aria-label="Comunicado" hidden>' +
    '  <div class="cm-reader-bar">' +
    '    <button type="button" class="cm-rb" id="cmBack"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i><span>Comunicados</span></button>' +
    '    <span class="cm-count" id="cmCount" aria-live="polite"></span>' +
    '    <a class="cm-rb cm-dl" id="cmDl" target="_blank" rel="noopener"><i class="fa-solid fa-file-pdf" aria-hidden="true"></i><span>PDF</span></a>' +
    '    <button type="button" class="cm-rb cm-rx" data-cm-close aria-label="Cerrar"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>' +
    '  </div>' +
    '  <div class="cm-stage"><div class="cm-book" id="cmBook"></div></div>' +
    '  <div class="cm-nav">' +
    '    <button type="button" class="cm-arrow" id="cmPrev" aria-label="Página anterior"><i class="fa-solid fa-chevron-left" aria-hidden="true"></i></button>' +
    '    <div class="cm-dots" id="cmDots" aria-hidden="true"></div>' +
    '    <button type="button" class="cm-arrow" id="cmNext" aria-label="Página siguiente"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button>' +
    '  </div>' +
    '</div>';
  document.body.appendChild(wrap);

  var panel = wrap.querySelector('#cmPanel'), list = wrap.querySelector('#cmList'), stats = wrap.querySelector('#cmStats');
  var reader = wrap.querySelector('#cmReader'), book = wrap.querySelector('#cmBook');
  var badge = btn.querySelector('.cm-badge'), filtro = 'all', ultimoFoco = null;

  function nuevos() { var l = leidos(); return AVISOS.filter(function (a) { return l.indexOf(a.id) < 0; }).length; }

  function pintarBadge() {
    var n = nuevos();
    badge.hidden = !n;
    badge.textContent = n;
    btn.classList.toggle('has-new', !!n);
    btn.setAttribute('aria-label', 'Comunicados' + (n ? ' (' + n + ' sin leer)' : ''));
  }

  function pintarStats() {
    // Próxima fecha clave entre los avisos que aún no pasan
    var prox = AVISOS.map(function (a) { return { a: a, s: estado(a) }; })
      .filter(function (x) { return x.s.k !== 'past'; })
      .sort(function (x, y) { return d(x.a.evento.inicio) - d(y.a.evento.inicio); })[0];
    var n = nuevos();
    stats.innerHTML =
      '<div class="cm-stat"><b>' + AVISOS.length + '</b><span>comunicados</span></div>' +
      '<div class="cm-stat' + (n ? ' hot' : '') + '"><b>' + n + '</b><span>sin leer</span></div>' +
      (prox ? '<button type="button" class="cm-stat cm-next" data-open="' + prox.a.id + '"><span class="cm-next-l">Próxima fecha</span><b>' +
        fCorta(prox.a.evento.inicio) + '</b><span>' + prox.a.evento.etiqueta + ' · ' + prox.s.txt.toLowerCase() + '</span></button>' : '');
  }

  function pintarLista() {
    var l = leidos();
    list.innerHTML = AVISOS.filter(function (a) { return filtro === 'all' || a.emisor === filtro; }).map(function (a, i) {
      var s = estado(a), nuevo = l.indexOf(a.id) < 0;
      return '<li class="cm-card' + (nuevo ? ' is-new' : '') + '" style="--i:' + i + '">' +
        '<button type="button" class="cm-card-btn" data-open="' + a.id + '">' +
        '<span class="cm-ico"><i class="fa-solid ' + a.icono + '" aria-hidden="true"></i></span>' +
        '<span class="cm-body">' +
        '<span class="cm-meta"><span class="cm-tag">' + a.emisor + ' · ' + a.tipo + '</span><time datetime="' + a.fecha + '">' + fCorta(a.fecha) + '</time>' +
        (nuevo ? '<span class="cm-new">Nuevo</span>' : '') + '</span>' +
        '<span class="cm-t">' + a.titulo + '</span>' +
        '<span class="cm-r">' + a.resumen + '</span>' +
        '<span class="cm-keys">' + a.claves.map(function (c) { return '<span><small>' + c[0] + '</small>' + c[1] + '</span>'; }).join('') + '</span>' +
        '<span class="cm-foot-row"><span class="cm-st st-' + s.k + '"><i></i>' + a.evento.etiqueta + ': ' + s.txt + '</span>' +
        '<span class="cm-read">Leer <i class="fa-solid fa-book-open" aria-hidden="true"></i></span></span>' +
        '</span></button></li>';
    }).join('');
    pintarStats();
  }

  function abrirPanel() {
    if (wrap.classList.contains('open')) return;
    ultimoFoco = document.activeElement;
    pintarLista();
    wrap.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    document.documentElement.classList.add('cm-lock');
    setTimeout(function () { panel.focus(); }, 30);
  }
  function cerrarTodo() {
    cerrarLibro(true);
    wrap.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    document.documentElement.classList.remove('cm-lock');
    if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
  }

  btn.addEventListener('click', function () { wrap.classList.contains('open') ? cerrarTodo() : abrirPanel(); });
  wrap.addEventListener('click', function (e) {
    if (e.target.closest('[data-cm-close]')) return cerrarTodo();
    var o = e.target.closest('[data-open]');
    if (o) return abrirLibro(o.getAttribute('data-open'));
    var f = e.target.closest('.cm-f');
    if (f) {
      filtro = f.getAttribute('data-f');
      wrap.querySelectorAll('.cm-f').forEach(function (b) { var on = b === f; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
      pintarLista();
    }
  });

  /* ── LIBRO ──
     Escritorio: dos páginas por pliego, cada hoja tiene frente y vuelta.
     Móvil: una página por hoja. Al pasar la hoja gira sobre su lomo. */
  var actual = null, hoja = 0, hojas = [], doble = false;
  var mq = window.matchMedia('(min-width: 860px)');

  function portada(a) {
    return '<div class="cm-cover">' +
      '<img src="assets/logos/logo-haften-white.png" alt="Haften" onerror="this.remove()">' +
      '<span class="cm-cover-tag"><i class="fa-solid ' + a.icono + '" aria-hidden="true"></i>' + a.emisor + ' · ' + a.tipo + '</span>' +
      '<h3>' + a.titulo + '</h3>' +
      '<time datetime="' + a.fecha + '">' + fLarga(a.fecha) + '</time>' +
      '<span class="cm-cover-hint">Toca o desliza para abrir <i class="fa-solid fa-hand-pointer" aria-hidden="true"></i></span>' +
      '</div>';
  }
  function contraportada(a) {
    return '<div class="cm-end">' +
      '<i class="fa-solid fa-circle-check cm-end-ico" aria-hidden="true"></i>' +
      '<h4>Fin del comunicado</h4>' +
      '<p>Descarga el documento original o contáctanos si necesitas apoyo con tus pedidos.</p>' +
      '<a class="cm-end-btn" href="' + a.pdf + '" target="_blank" rel="noopener"><i class="fa-solid fa-file-arrow-down" aria-hidden="true"></i>Descargar PDF' + (a.pdfNota ? ' <small>(' + a.pdfNota.toLowerCase() + ')</small>' : '') + '</a>' +
      '<a class="cm-end-link" href="/contacto"><i class="fa-solid fa-envelope" aria-hidden="true"></i>Contactar a un asesor</a>' +
      '</div>';
  }
  function pagina(html, n, total, a) {
    return '<div class="cm-page"><div class="cm-page-head"><span>' + a.emisor + '</span><span>' + a.tipo + '</span></div>' +
      '<div class="cm-page-body">' + html + '</div>' +
      '<div class="cm-page-num">' + n + ' / ' + total + '</div></div>';
  }

  function construir() {
    var a = actual, total = a.paginas.length;
    var caras = [portada(a)];
    a.paginas.forEach(function (p, i) { caras.push(pagina(p, i + 1, total, a)); });
    caras.push(contraportada(a));
    doble = mq.matches;
    if (doble && caras.length % 2) caras.splice(caras.length - 1, 0, '<div class="cm-page cm-blank"><span>Haf<em>ten</em></span></div>');
    hojas = [];
    var html = '';
    var paso = doble ? 2 : 1;
    for (var i = 0; i < caras.length; i += paso) {
      var frente = caras[i], vuelta = doble ? caras[i + 1] : '<div class="cm-page cm-blank"><span>Haf<em>ten</em></span></div>';
      html += '<div class="cm-leaf" data-l="' + hojas.length + '">' +
        '<div class="cm-face cm-front">' + frente + '</div>' +
        '<div class="cm-face cm-back">' + vuelta + '</div></div>';
      hojas.push(1);
    }
    book.className = 'cm-book ' + (doble ? 'is-double' : 'is-single');
    book.innerHTML = html;
    var dots = wrap.querySelector('#cmDots');
    dots.innerHTML = hojas.map(function () { return '<i></i>'; }).join('') + (doble ? '<i></i>' : '');
    hoja = Math.min(hoja, maxHoja());
    pintarHoja(true);
  }

  function maxHoja() { return doble ? hojas.length : hojas.length - 1; }

  function pintarHoja(sinAnim) {
    var leaves = book.querySelectorAll('.cm-leaf');
    book.classList.toggle('no-tr', !!sinAnim);
    leaves.forEach(function (lf, i) {
      var vuelta = i < hoja;
      lf.classList.toggle('flipped', vuelta);
      // las hojas volteadas se apilan a la izquierda, las demás a la derecha
      lf.style.zIndex = vuelta ? i + 1 : leaves.length - i;
      lf.setAttribute('aria-hidden', doble ? !(i === hoja || i === hoja - 1) : i !== hoja);
    });
    book.classList.toggle('at-start', hoja === 0);
    book.classList.toggle('at-end', doble && hoja === hojas.length);
    if (sinAnim) { void book.offsetWidth; book.classList.remove('no-tr'); }
    wrap.querySelector('#cmPrev').disabled = hoja === 0;
    wrap.querySelector('#cmNext').disabled = hoja >= maxHoja();
    wrap.querySelectorAll('#cmDots i').forEach(function (dt, i) { dt.classList.toggle('on', i === hoja); });
    var cuenta = wrap.querySelector('#cmCount');
    var tot = actual.paginas.length, a1 = doble ? 2 * hoja - 1 : hoja, a2 = Math.min(doble ? 2 * hoja : hoja, tot);
    cuenta.textContent = hoja === 0 ? 'Portada' : a1 > tot ? 'Final' : (a2 > a1 ? 'Páginas ' + a1 + '–' + a2 : 'Página ' + a1) + ' de ' + tot;
  }

  function ir(delta) {
    var n = Math.max(0, Math.min(maxHoja(), hoja + delta));
    if (n === hoja) return;
    hoja = n;
    pintarHoja(false);
  }

  function abrirLibro(id) {
    actual = AVISOS.filter(function (a) { return a.id === id; })[0];
    if (!actual) return;
    if (!wrap.classList.contains('open')) abrirPanel();
    hoja = 0;
    wrap.querySelector('#cmDl').href = actual.pdf;
    wrap.querySelector('#cmDl span').textContent = actual.pdfNota ? 'PDF (inglés)' : 'PDF';
    reader.setAttribute('aria-label', actual.titulo);
    construir();
    reader.hidden = false;
    requestAnimationFrame(function () { reader.classList.add('show'); });
    marcar(id);
    setTimeout(function () { wrap.querySelector('#cmNext').focus(); }, 60);
    // abre la portada sola después de un instante
    setTimeout(function () { if (actual && actual.id === id && hoja === 0 && !reader.hidden) ir(1); }, 900);
  }
  function cerrarLibro(silencio) {
    if (reader.hidden) return;
    reader.classList.remove('show');
    actual = null;
    setTimeout(function () { reader.hidden = true; book.innerHTML = ''; }, silencio ? 0 : 320);
    if (!silencio) panel.focus();
  }

  wrap.querySelector('#cmBack').addEventListener('click', function () { cerrarLibro(false); });
  wrap.querySelector('#cmPrev').addEventListener('click', function () { ir(-1); });
  wrap.querySelector('#cmNext').addEventListener('click', function () { ir(1); });
  book.addEventListener('click', function (e) {
    if (e.target.closest('a, .cm-table')) return;
    var r = book.getBoundingClientRect();
    ir(e.clientX < r.left + r.width / 2 ? -1 : 1);
  });

  // deslizar con el dedo
  var x0 = null;
  book.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  book.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 40) ir(dx < 0 ? 1 : -1);
  });

  var onMq = function () { if (actual) construir(); };
  mq.addEventListener ? mq.addEventListener('change', onMq) : mq.addListener(onMq);

  document.addEventListener('keydown', function (e) {
    if (!wrap.classList.contains('open')) return;
    if (e.key === 'Escape') { e.preventDefault(); reader.hidden ? cerrarTodo() : cerrarLibro(false); return; }
    if (!reader.hidden && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) { e.preventDefault(); ir(e.key === 'ArrowRight' ? 1 : -1); }
    if (e.key === 'Tab') {
      // mantiene el foco dentro de la capa activa
      var capa = reader.hidden ? panel : reader;
      var f = capa.querySelectorAll('button:not([disabled]), a[href], [tabindex="0"]');
      f = Array.prototype.filter.call(f, function (el) { return el.offsetParent !== null && !el.closest('[aria-hidden="true"]'); });
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  pintarBadge();

  // enlaces directos: /?comunicado=belimo-eb-033  o  #comunicados
  try {
    var q = new URLSearchParams(location.search).get('comunicado');
    if (q) setTimeout(function () { abrirLibro(q); }, 700);
    else if (location.hash === '#comunicados') setTimeout(abrirPanel, 700);
  } catch (e) { }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href="#comunicados"]');
    if (a) { e.preventDefault(); abrirPanel(); }
  });
})();

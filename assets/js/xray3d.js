/* HAFTEN — visor 3D con escáner de rayos X.
   Modelo ilustrativo: válvula de bola con actuador (Three.js r128).
   Lo que queda a la izquierda del plano de escaneo se ve en rayos X. */
(function () {
  'use strict';

  window.HaftenXray = function (stage) {
    var T = window.THREE;
    if (!T) return;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var noAnim = function () { return reduce || document.body.classList.contains('no-anim'); };

    var canvas = document.createElement('canvas');
    canvas.setAttribute('aria-label', 'Modelo 3D de una válvula de control con actuador. Arrastra para girarlo.');
    canvas.setAttribute('role', 'img');
    stage.insertBefore(canvas, stage.firstChild);
    var renderer;
    try {
      renderer = new T.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch (e) {
      stage.insertAdjacentHTML('beforeend', '<div class="xr-fallback">Tu navegador no admite la vista 3D.</div>');
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.localClippingEnabled = true;
    renderer.setClearColor(0x000000, 0);

    var scene = new T.Scene();
    var camera = new T.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 2.1, 12);
    camera.lookAt(0, 1.05, 0);

    scene.add(new T.HemisphereLight(0xffffff, 0x1b2a40, 0.95));
    var key = new T.DirectionalLight(0xffffff, 1.15); key.position.set(5, 8, 7); scene.add(key);
    var rim = new T.DirectionalLight(0xff8a76, 0.9); rim.position.set(-7, 3, -6); scene.add(rim);
    var fill = new T.DirectionalLight(0x9fc3ff, 0.35); fill.position.set(-4, -2, 6); scene.add(fill);

    /* planos de corte: sólido a la derecha, rayos X a la izquierda */
    var pSolid = new T.Plane(new T.Vector3(1, 0, 0), 0);
    var pXray = new T.Plane(new T.Vector3(-1, 0, 0), 0);

    var fresnelVS = [
      '#include <clipping_planes_pars_vertex>',
      'varying vec3 vN; varying vec3 vV;',
      'void main(){',
      '  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);',
      '  vN = normalize(normalMatrix * normal);',
      '  vV = normalize(-mvPosition.xyz);',
      '  gl_Position = projectionMatrix * mvPosition;',
      '  #include <clipping_planes_vertex>',
      '}'
    ].join('\n');
    var fresnelFS = [
      '#include <clipping_planes_pars_fragment>',
      'uniform vec3 uColor; uniform float uPow; uniform float uI; uniform float uBase;',
      'varying vec3 vN; varying vec3 vV;',
      'void main(){',
      '  #include <clipping_planes_fragment>',
      '  float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), uPow);',
      '  float a = clamp(f * uI + uBase, 0.0, 1.0);',
      '  gl_FragColor = vec4(uColor * a, 1.0);',
      '}'
    ].join('\n');
    function xrayMat(color, pow, intensity, base) {
      return new T.ShaderMaterial({
        uniforms: {
          uColor: { value: new T.Color(color) },
          uPow: { value: pow || 2.2 },
          uI: { value: intensity || 1.1 },
          uBase: { value: base == null ? 0.05 : base }
        },
        vertexShader: fresnelVS,
        fragmentShader: fresnelFS,
        transparent: true,
        depthWrite: false,
        blending: T.AdditiveBlending,
        side: T.DoubleSide,
        clipping: true,
        clippingPlanes: [pXray]
      });
    }
    function solidMat(color, metal, rough) {
      return new T.MeshStandardMaterial({ color: color, metalness: metal || 0, roughness: rough == null ? 0.5 : rough, clippingPlanes: [pSolid] });
    }
    var edgeMat = new T.LineBasicMaterial({ color: 0x9fc3ff, transparent: true, opacity: 0.28, blending: T.AdditiveBlending, depthWrite: false, clippingPlanes: [pXray] });

    var model = new T.Group();
    scene.add(model);
    var parts = {};      // id -> { xr: [materiales], anchor: Object3D }
    function tag(id, mat, anchor) {
      if (!id) return;
      var p = parts[id] || (parts[id] = { xr: [], anchor: anchor });
      p.xr.push(mat);
      if (!p.anchor) p.anchor = anchor;
    }

    /* cascarón: sólido + rayos X + aristas */
    function shell(geo, color, metal, rough, parent, id, edges) {
      var g = new T.Group();
      g.add(new T.Mesh(geo, solidMat(color, metal, rough)));
      var xm = xrayMat(0x8fb8ff, 2.4, 1.15, 0.035);
      g.add(new T.Mesh(geo, xm));
      if (edges !== false) g.add(new T.LineSegments(new T.EdgesGeometry(geo, 28), edgeMat));
      (parent || model).add(g);
      tag(id, xm, g);
      return g;
    }
    /* pieza interna: solo existe del lado de rayos X */
    var coreSolid = new T.MeshStandardMaterial({ color: 0xaeb8c4, metalness: 0.6, roughness: 0.32, emissive: 0x2a0905, clippingPlanes: [pXray] });
    var coreXr = {}, tinted = {};
    function core(geo, parent, id, color) {
      var g = new T.Group();
      var sm = coreSolid;
      if (color) sm = tinted[color] || (tinted[color] = new T.MeshStandardMaterial({ color: color, metalness: 0.3, roughness: 0.4, emissive: 0x1a0503, clippingPlanes: [pXray] }));
      g.add(new T.Mesh(geo, sm));
      var xm = coreXr[id];
      if (!xm) { xm = coreXr[id] = xrayMat(0xff7a66, 1.8, 1.25, 0.08); tag(id, xm, g); }
      g.add(new T.Mesh(geo, xm));
      (parent || model).add(g);
      return g;
    }

    /* ── TUBERÍA Y BRIDAS ── */
    var pipeGeo = new T.CylinderGeometry(0.36, 0.36, 1.35, 48);
    [-1, 1].forEach(function (s) {
      var p = shell(pipeGeo, 0x9aa5b2, 0.55, 0.38, null, s < 0 ? 'flow' : null);
      p.rotation.z = Math.PI / 2; p.position.x = s * 1.78;
      var neck = shell(new T.CylinderGeometry(0.46, 0.5, 0.42, 48), 0x7d8792, 0.6, 0.35);
      neck.rotation.z = Math.PI / 2; neck.position.x = s * 0.82;
      [1.06, 2.48].forEach(function (x) {
        var fl = shell(new T.CylinderGeometry(0.64, 0.64, 0.13, 48), 0x6f7a86, 0.65, 0.3);
        fl.rotation.z = Math.PI / 2; fl.position.x = s * x;
        for (var b = 0; b < 6; b++) {
          var a = b / 6 * Math.PI * 2;
          var bolt = new T.Mesh(new T.CylinderGeometry(0.045, 0.045, 0.22, 10), solidMat(0x3b4654, 0.7, 0.3));
          bolt.rotation.z = Math.PI / 2;
          bolt.position.set(s * x, Math.cos(a) * 0.52, Math.sin(a) * 0.52);
          model.add(bolt);
        }
      });
    });

    /* ── CUERPO DE LA VÁLVULA ── */
    var bodyGeo = new T.SphereGeometry(0.78, 56, 40);
    var body = shell(bodyGeo, 0x8a95a1, 0.6, 0.3, null, 'body', false);
    body.scale.set(1.18, 1, 1);
    shell(new T.CylinderGeometry(0.22, 0.3, 0.55, 40), 0x7d8792, 0.6, 0.32).position.y = 0.95;
    shell(new T.BoxGeometry(1.0, 0.08, 0.9), 0x3b4654, 0.5, 0.4).position.y = 1.26;

    /* ── ACTUADOR ── */
    function rounded(w, h, r) {
      var s = new T.Shape(), x = -w / 2, y = -h / 2;
      s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
      s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
      s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
      return s;
    }
    var houseGeo = new T.ExtrudeGeometry(rounded(2.15, 1.25, 0.24), { depth: 1.1, bevelEnabled: true, bevelThickness: 0.07, bevelSize: 0.07, bevelSegments: 4, curveSegments: 10 });
    houseGeo.center();
    var house = shell(houseGeo, 0xeef1f4, 0.05, 0.42, null, 'act');
    house.position.y = 2.0;
    var band = new T.Mesh(new T.BoxGeometry(2.32, 0.14, 1.26), solidMat(0x7b241b, 0.1, 0.5));
    band.position.y = 1.47; model.add(band);
    var plate = new T.Mesh(new T.BoxGeometry(1.05, 0.38, 0.03), solidMat(0x05162a, 0.2, 0.45));
    plate.position.set(-0.35, 2.05, 0.64); model.add(plate);
    var led = new T.Mesh(new T.SphereGeometry(0.045, 12, 8), new T.MeshBasicMaterial({ color: 0xff5a45, clippingPlanes: [pSolid] }));
    led.position.set(0.55, 2.3, 0.65); model.add(led);
    var knob = shell(new T.CylinderGeometry(0.24, 0.24, 0.18, 40), 0x05162a, 0.2, 0.4);
    knob.position.y = 2.72;
    var dial = new T.Mesh(new T.BoxGeometry(0.34, 0.03, 0.06), solidMat(0xc0473a, 0.1, 0.5));
    dial.position.y = 2.82; model.add(dial);
    var gland = shell(new T.CylinderGeometry(0.11, 0.13, 0.22, 20), 0x05162a, 0.2, 0.5);
    gland.rotation.z = Math.PI / 2; gland.position.set(1.27, 1.75, 0);
    var cable = new T.CatmullRomCurve3([new T.Vector3(1.36, 1.75, 0), new T.Vector3(1.9, 1.7, 0.1), new T.Vector3(2.3, 1.1, 0.35), new T.Vector3(2.45, 0.2, 0.9), new T.Vector3(2.4, -0.4, 1.4)]);
    shell(new T.TubeGeometry(cable, 40, 0.055, 10), 0x0a2038, 0.1, 0.6, null, null, false);

    /* ── INTERIOR ── */
    // bola con barreno (perfil de revolución)
    var R = 0.54, rb = 0.24, yc = Math.sqrt(R * R - rb * rb), prof = [];
    for (var i = 0; i <= 24; i++) { var yy = -yc + (2 * yc) * i / 24; prof.push(new T.Vector2(Math.sqrt(R * R - yy * yy), yy)); }
    prof.push(new T.Vector2(rb, yc)); prof.push(new T.Vector2(rb, -yc)); prof.push(prof[0].clone());
    var ballPivot = new T.Group(); model.add(ballPivot);
    var ball = core(new T.LatheGeometry(prof, 48), ballPivot, 'ball');
    ball.rotation.z = Math.PI / 2;
    var stem = core(new T.CylinderGeometry(0.07, 0.07, 1.75, 16), ballPivot, 'stem');
    stem.position.y = 1.2;
    [-1, 1].forEach(function (s) {
      var seat = core(new T.TorusGeometry(0.4, 0.05, 12, 40), null, 'ball', 0x0a2038);
      seat.rotation.y = Math.PI / 2; seat.position.x = s * 0.5;
    });
    // tren de engranes
    function gear(r, n, depth) {
      var g = new T.Group();
      var mats = [];
      var hub = core(new T.CylinderGeometry(r, r, depth, 40), g, 'gear');
      hub.rotation.x = Math.PI / 2;
      var toothGeo = new T.BoxGeometry(0.09, 0.12, depth);
      for (var k = 0; k < n; k++) {
        var a = k / n * Math.PI * 2;
        var t = core(toothGeo, g, 'gear');
        t.position.set(Math.cos(a) * (r + 0.04), Math.sin(a) * (r + 0.04), 0);
        t.rotation.z = a;
      }
      model.add(g);
      return g;
    }
    var gA = gear(0.4, 18, 0.12); gA.position.set(-0.32, 2.02, 0.18);
    var gB = gear(0.22, 10, 0.12); gB.position.set(0.36, 2.2, 0.18);
    var gC = gear(0.16, 8, 0.12); gC.position.set(0.66, 1.84, 0.18);
    var motor = core(new T.CylinderGeometry(0.2, 0.2, 0.62, 28), null, 'motor', 0x7b241b);
    motor.rotation.z = Math.PI / 2; motor.position.set(0.5, 2.36, -0.28);
    var pcb = core(new T.BoxGeometry(1.6, 0.52, 0.04), null, 'pcb', 0x0f4a3a);
    pcb.position.set(-0.05, 2.1, -0.46);
    for (var c = 0; c < 5; c++) {
      var chip = core(new T.BoxGeometry(0.16, 0.12, 0.05), null, 'pcb', 0x111111);
      chip.position.set(-0.6 + c * 0.28, 2.1 + (c % 2 ? 0.1 : -0.08), -0.42);
    }
    // resorte de retorno
    var hp = [];
    for (var h = 0; h <= 140; h++) { var ht = h / 140, ha = ht * Math.PI * 2 * 7; hp.push(new T.Vector3(-0.95 + ht * 0.7, Math.cos(ha) * 0.15, Math.sin(ha) * 0.15)); }
    var spring = core(new T.TubeGeometry(new T.CatmullRomCurve3(hp), 220, 0.025, 6), null, 'spring');
    spring.position.set(0, 1.72, -0.1);

    /* ── PARTÍCULAS DE FLUJO ── */
    var N = 320, pos = new Float32Array(N * 3), spd = new Float32Array(N);
    for (var q = 0; q < N; q++) {
      var ang = Math.random() * Math.PI * 2, rr = Math.sqrt(Math.random()) * 0.28;
      pos[q * 3] = -2.6 + Math.random() * 5.2;
      pos[q * 3 + 1] = Math.cos(ang) * rr;
      pos[q * 3 + 2] = Math.sin(ang) * rr;
      spd[q] = 0.6 + Math.random() * 0.8;
    }
    var pGeo = new T.BufferGeometry();
    pGeo.setAttribute('position', new T.BufferAttribute(pos, 3));
    var dot = document.createElement('canvas'); dot.width = dot.height = 64;
    var dc = dot.getContext('2d'), grd = dc.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, 'rgba(255,255,255,1)'); grd.addColorStop(.35, 'rgba(160,200,255,.7)'); grd.addColorStop(1, 'rgba(160,200,255,0)');
    dc.fillStyle = grd; dc.fillRect(0, 0, 64, 64);
    var pMat = new T.PointsMaterial({ size: 0.11, map: new T.CanvasTexture(dot), transparent: true, depthWrite: false, blending: T.AdditiveBlending, color: 0xbfd8ff, clippingPlanes: [pXray] });
    model.add(new T.Points(pGeo, pMat));

    /* ── LÁMINA DEL ESCÁNER ── */
    var sc = document.createElement('canvas'); sc.width = 4; sc.height = 256;
    var scx = sc.getContext('2d'), sg = scx.createLinearGradient(0, 0, 0, 256);
    sg.addColorStop(0, 'rgba(255,110,90,0)'); sg.addColorStop(.5, 'rgba(255,110,90,1)'); sg.addColorStop(1, 'rgba(255,110,90,0)');
    scx.fillStyle = sg; scx.fillRect(0, 0, 4, 256);
    var sheet = new T.Mesh(new T.PlaneGeometry(4.2, 5.6), new T.MeshBasicMaterial({ map: new T.CanvasTexture(sc), transparent: true, opacity: 0.22, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide }));
    sheet.rotation.y = Math.PI / 2; sheet.position.y = 1.05;
    scene.add(sheet);
    var lineMat = new T.LineBasicMaterial({ color: 0xff7a66, transparent: true, opacity: 0.9, blending: T.AdditiveBlending });
    var scanLine = new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(0, -1.75, 0), new T.Vector3(0, 3.85, 0)]), lineMat);
    scene.add(scanLine);

    model.position.set(-0.25, -0.1, 0);

    /* ── ETIQUETAS ── */
    var LABELS = [
      { id: 'act', n: '01', t: 'Actuador', off: [0.2, 0.75, 0] },
      { id: 'gear', n: '02', t: 'Tren de engranes', off: [0, 0.45, 0.2] },
      { id: 'stem', n: '03', t: 'Vástago', off: [0, -0.45, 0] },
      { id: 'ball', n: '04', t: 'Bola de control', off: [0, 0, 0.62] },
      { id: 'flow', n: '05', t: 'Flujo', off: [0, 0, 0.45] }
    ];
    var lblBox = stage.querySelector('.xr-labels');
    LABELS.forEach(function (L) {
      var el = document.createElement('span');
      el.className = 'xr-lbl';
      el.innerHTML = '<b>' + L.n + '</b><span>' + L.t + '</span>';
      lblBox.appendChild(el);
      L.el = el;
      L.v = new T.Vector3();
    });

    /* ── INTERACCIÓN ── */
    var rotY = -0.55, rotX = 0.1, dragging = false, lx = 0, ly = 0, idle = 0;
    canvas.addEventListener('pointerdown', function (e) { dragging = true; lx = e.clientX; ly = e.clientY; canvas.setPointerCapture(e.pointerId); });
    canvas.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      rotY += (e.clientX - lx) * 0.008;
      rotX = Math.max(-0.35, Math.min(0.6, rotX + (e.clientY - ly) * 0.005));
      lx = e.clientX; ly = e.clientY; idle = 0;
    });
    var up = function () { dragging = false; };
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', up);

    var range = stage.querySelector('[data-xr-range]');
    var btns = [].slice.call(stage.querySelectorAll('[data-xr-mode]'));
    var CUT_MIN = -3.2, CUT_MAX = 3.2;
    var cut = CUT_MIN, cutTarget = CUT_MIN;
    function setTarget(v, fromRange) {
      v = Math.max(0, Math.min(100, v));
      cutTarget = CUT_MIN + (CUT_MAX - CUT_MIN) * v / 100;
      if (!fromRange && range) range.value = v;
      btns.forEach(function (b) { b.setAttribute('aria-pressed', String((b.dataset.xrMode === 'xray') === (v >= 50))); });
    }
    if (range) range.addEventListener('input', function () { setTarget(+range.value, true); });
    btns.forEach(function (b) { b.addEventListener('click', function () { setTarget(b.dataset.xrMode === 'xray' ? 100 : 0); }); });

    var hi = null;
    function highlight(id) {
      hi = id;
      LABELS.forEach(function (L) { L.el.classList.toggle('on', L.id === id); });
      if (id && cutTarget < 0.5) setTarget(100);
    }
    [].slice.call(document.querySelectorAll('[data-xr-part]')).forEach(function (li) {
      var id = li.getAttribute('data-xr-part');
      li.addEventListener('mouseenter', function () { highlight(id); li.classList.add('on'); });
      li.addEventListener('mouseleave', function () { highlight(null); li.classList.remove('on'); });
      li.addEventListener('click', function () { highlight(hi === id ? null : id); });
    });

    /* ── TAMAÑO Y VISIBILIDAD ── */
    var W = 1, H = 1;
    function resize() {
      W = stage.clientWidth; H = stage.clientHeight;
      renderer.setSize(W, H, false);
      camera.aspect = W / H;
      camera.fov = W / H < 1.05 ? 31 : 29;
      camera.updateProjectionMatrix();
    }
    resize();
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(stage); else window.addEventListener('resize', resize);
    var visible = true;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) loop(); }, { threshold: 0 }).observe(stage);
    }
    // al aparecer: escaneo automático hasta la mitad
    setTimeout(function () { if (cutTarget === CUT_MIN) setTarget(52); }, 900);

    /* ── ANIMACIÓN ── */
    var clock = new T.Clock(), t = 0, running = false, valve = 0;
    var white = new T.Color(0xffffff);
    function frame() {
      running = false;
      if (!visible || document.hidden) return;
      var dt = Math.min(clock.getDelta(), 0.05), still = noAnim();
      t += dt; idle += dt;

      cut += (cutTarget - cut) * (still ? 1 : Math.min(1, dt * 3.2));
      pSolid.constant = -cut;
      pXray.constant = cut;
      sheet.position.x = scanLine.position.x = cut;
      var edge = Math.abs(cut) < 3.05;
      sheet.visible = scanLine.visible = edge;

      var sway = still || dragging ? 0 : Math.sin(t * 0.35) * 0.35 * Math.min(1, idle / 2);
      model.rotation.y += (rotY + sway - model.rotation.y) * (still ? 1 : 0.12);
      model.rotation.x += (rotX - model.rotation.x) * (still ? 1 : 0.12);

      // la válvula abre y cierra lento; los engranes la acompañan
      var target = still ? 0 : (Math.sin(t * 0.45) * 0.5 + 0.5) * 1.25;
      var dv = target - valve; valve = target;
      ballPivot.rotation.y = valve;
      gA.rotation.z -= dv * 3; gB.rotation.z += dv * 5.4; gC.rotation.z -= dv * 7.4;
      dial.rotation.y = valve;
      var open = Math.max(0.05, Math.cos(valve));
      if (!still) {
        for (var q = 0; q < N; q++) {
          var x = pos[q * 3] + spd[q] * dt * 1.4 * open;
          if (x > 2.6) x = -2.6;
          pos[q * 3] = x;
        }
        pGeo.attributes.position.needsUpdate = true;
      }
      led.material.color.setHex((t % 1.6) < 0.8 ? 0xff5a45 : 0x5a1a12);

      // resaltado de pieza
      Object.keys(parts).forEach(function (id) {
        var on = hi === id || (id === 'gear' && hi === 'act');
        parts[id].xr.forEach(function (m) {
          m.uniforms.uI.value += ((on ? 2.6 : (id === 'body' || id === 'act' || id === 'flow' ? 1.15 : 1.25)) - m.uniforms.uI.value) * 0.15;
          if (!m.userData.base) m.userData.base = m.uniforms.uColor.value.clone();
          m.uniforms.uColor.value.lerp(on ? white : m.userData.base, 0.08);
        });
      });

      // etiquetas
      var show = cut > -1.2;
      lblBox.classList.toggle('show', show);
      if (show) {
        LABELS.forEach(function (L) {
          var p = parts[L.id];
          if (!p || !p.anchor) return;
          L.v.set(L.off[0], L.off[1], L.off[2]);
          p.anchor.localToWorld(L.v);
          if (L.id === 'gear') { L.v.set(0, 0.62, 0); gA.localToWorld(L.v); }
          var vis = L.v.x < cut + 0.4;
          L.v.project(camera);
          var sx = (L.v.x * 0.5 + 0.5) * W, sy = (-L.v.y * 0.5 + 0.5) * H;
          L.el.style.transform = 'translate3d(' + sx.toFixed(1) + 'px,' + sy.toFixed(1) + 'px,0) translate(-50%,-50%)';
          L.el.style.opacity = vis ? '' : '0';
        });
      }

      renderer.render(scene, camera);
      loop();
    }
    function loop() { if (!running) { running = true; requestAnimationFrame(frame); } }
    document.addEventListener('visibilitychange', function () { if (!document.hidden) { clock.getDelta(); loop(); } });
    loop();
  };
})();

/* Slots de imagem — mostra o que existe, remove o que faltar.
   Colocou o arquivo em assets/img/? Aparece. Não colocou? O bloco some
   e o card fica só com texto, sem buraco nem ícone quebrado. */
(function () {
  var slots = document.querySelectorAll('.card__media, .row__media');

  Array.prototype.forEach.call(slots, function (slot) {
    var img = slot.querySelector('img');
    if (!img) { slot.remove(); return; }

    function ok() { slot.classList.add('is-loaded'); }
    function fail() { slot.remove(); }

    if (img.complete) {
      if (img.naturalWidth > 0) ok();
      else fail();
    } else {
      img.addEventListener('load', ok);
      img.addEventListener('error', fail);
    }
  });
})();

/* Menu mobile — abre/fecha, fecha no ESC, no clique fora e ao voltar pro desktop */
(function () {
  var toggle = document.querySelector('.nav__toggle');
  var links = document.getElementById('nav-links');
  if (!toggle || !links) return;

  var mq = window.matchMedia('(max-width: 47.9375em)');

  function setOpen(open) {
    toggle.setAttribute('aria-expanded', String(open));
    links.hidden = !open;
  }

  function sync() {
    if (mq.matches) {
      setOpen(false);
    } else {
      toggle.setAttribute('aria-expanded', 'false');
      links.hidden = false;
    }
  }

  toggle.addEventListener('click', function () {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  links.addEventListener('click', function (e) {
    if (mq.matches && e.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mq.matches && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });

  document.addEventListener('click', function (e) {
    if (!mq.matches) return;
    if (toggle.getAttribute('aria-expanded') !== 'true') return;
    if (e.target.closest('.nav')) return;
    setOpen(false);
  });

  if (mq.addEventListener) mq.addEventListener('change', sync);
  else mq.addListener(sync);

  sync();
})();

/* =========================================================================
   V2 — comportamentos de navegação e leitura
   ========================================================================= */

/* V2.6 — "27 pain points" vira 27 grande + rótulo pequeno. Texto idêntico. */
(function () {
  document.querySelectorAll('.field--stats .field__value > span').forEach(function (el) {
    var m = el.textContent.trim().match(/^([+\-]?\d[\d.,]*\s*%?)\s+(.+)$/);
    if (!m) return;
    el.innerHTML = '';
    var b = document.createElement('b');
    b.textContent = m[1].replace(/\s+/g, '');
    el.appendChild(b);
    el.appendChild(document.createTextNode(m[2]));
  });
})();

/* V2.7 — visualizador de imagem em tela cheia, no tamanho nativo.
   Resolve a exibição a 25% no celular sem tirar a imagem do fluxo. */
(function () {
  var slots = document.querySelectorAll('.row__media');
  if (!slots.length) return;

  var viewer = document.createElement('div');
  viewer.className = 'viewer';
  viewer.hidden = true;
  viewer.setAttribute('role', 'dialog');
  viewer.setAttribute('aria-modal', 'true');
  viewer.innerHTML =
    '<div class="viewer__bar">' +
      '<p class="viewer__cap"></p>' +
      '<button class="viewer__close" type="button" aria-label="Close">✕</button>' +
    '</div>' +
    '<div class="viewer__frame"><img alt=""></div>' +
    '<p class="viewer__hint">Arraste para explorar · Esc ou ✕ para fechar</p>';
  document.body.appendChild(viewer);

  var vImg = viewer.querySelector('img');
  var vCap = viewer.querySelector('.viewer__cap');
  var vClose = viewer.querySelector('.viewer__close');
  var frame = viewer.querySelector('.viewer__frame');
  var last = null;

  function open(img, caption) {
    last = document.activeElement;
    vImg.src = img.currentSrc || img.src;
    vImg.alt = img.alt || '';
    vCap.textContent = caption || img.alt || '';
    viewer.hidden = false;
    document.body.style.overflow = 'hidden';
    frame.scrollTop = 0; frame.scrollLeft = 0;
    vClose.focus();
  }
  function close() {
    viewer.hidden = true;
    vImg.removeAttribute('src');
    document.body.style.overflow = '';
    if (last && last.focus) last.focus();
  }

  Array.prototype.forEach.call(slots, function (slot) {
    var img = slot.querySelector('img');
    if (!img) return;
    var row = slot.closest('.row');
    var t = row && row.querySelector('.row__title');
    slot.setAttribute('role', 'button');
    slot.setAttribute('tabindex', '0');
    slot.setAttribute('aria-label', 'Enlarge: ' + (t ? t.textContent.trim() : (img.alt || 'image')));
    slot.addEventListener('click', function () { open(img, t ? t.textContent.trim() : ''); });
    slot.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(img, t ? t.textContent.trim() : ''); }
    });
  });

  vClose.addEventListener('click', close);
  viewer.addEventListener('click', function (e) { if (e.target === viewer || e.target === frame) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !viewer.hidden) close(); });
})();

/* V2.8 — progresso de leitura + volta ao topo */
(function () {
  var bar = document.querySelector('.progress span');
  var btn = document.querySelector('.to-top');
  if (btn) btn.hidden = false;

  function tick() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var y = window.scrollY;
    if (bar) bar.style.width = (h > 0 ? Math.min(100, (y / h) * 100) : 0) + '%';
    if (btn) btn.classList.toggle('is-on', y > window.innerHeight * 1.5);
  }
  if (btn) {
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      var skip = document.querySelector('.skip-link');
      if (skip) skip.focus();
    });
  }
  window.addEventListener('scroll', tick, { passive: true });
  window.addEventListener('resize', tick);
  tick();
})();

/* V2.4 — índice marca o projeto em que você está */
(function () {
  var links = document.querySelectorAll('.index-list a');
  if (!links.length || !('IntersectionObserver' in window)) return;
  var map = {};
  Array.prototype.forEach.call(links, function (a) {
    var el = document.querySelector(a.getAttribute('href'));
    if (el) map[el.id] = a;
  });
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      var a = map[en.target.id];
      if (a) a.setAttribute('aria-current', en.isIntersecting ? 'true' : 'false');
    });
  }, { rootMargin: '-25% 0px -60% 0px' });
  Object.keys(map).forEach(function (id) { obs.observe(document.getElementById(id)); });
})();


/* =========================================================================
   V4 — trilhas horizontais e divulgação progressiva
   ========================================================================= */

/* V4.2 — contador e barra de posição de cada trilha */
(function () {
  document.querySelectorAll('[data-rail]').forEach(function (rail) {
    var items = rail.children;
    var total = items.length;
    /* na Home a trilha não está dentro de .mod — o escopo cai para o pai */
    var mod = rail.closest('.mod') || rail.parentElement;
    var counter = mod && mod.querySelector('.mod__c b');
    var bar = mod && mod.querySelector('.rail__bar span');
    if (!total) return;

    if (mod) {
      var tot = mod.querySelector('.mod__c i');
      if (tot) tot.textContent = String(total).padStart(2, '0');
      /* trilha de um item só não é trilha: esconde contador e barra */
      if (total < 2) {
        var h = mod.querySelector('.mod__c'); if (h) h.style.display = 'none';
        var bb = mod.querySelector('.rail__bar'); if (bb) bb.style.display = 'none';
      }
    }
    if (bar) bar.style.width = (100 / total) + '%';

    function update() {
      var max = rail.scrollWidth - rail.clientWidth;
      var w = items[0].getBoundingClientRect().width + 14;
      var i = Math.min(total - 1, Math.round(rail.scrollLeft / w));
      if (counter) counter.textContent = String(i + 1).padStart(2, '0');
      if (bar) {
        var p = max > 0 ? rail.scrollLeft / max : 0;
        bar.style.transform = 'translateX(' + (p * (total - 1) * 100) + '%)';
      }
    }
    rail.addEventListener('scroll', function () {
      window.requestAnimationFrame(update);
    }, { passive: true });
    window.addEventListener('resize', update);

    /* teclado: setas percorrem a trilha quando ela tem foco */
    rail.setAttribute('tabindex', '0');
    rail.setAttribute('role', 'group');
    rail.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      var w = items[0].getBoundingClientRect().width + 14;
      rail.scrollBy({ left: e.key === 'ArrowRight' ? w : -w, behavior: 'smooth' });
    });

    update();
  });
})();

/* V4.3 / V4.6 — "Read" azul revela o texto longo.
   Uma regra só para os cartões de nota e para os registros de currículo. */
(function () {
  var n = 0;

  function wire(host, body, label) {
    if (!body) return;
    var id = 'fold-' + (++n);
    body.id = id;
    body.hidden = true;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ncard__more';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', id);
    btn.appendChild(document.createTextNode('Read'));
    if (label) btn.setAttribute('aria-label', 'Read about ' + label);
    btn.addEventListener('click', function () {
      var open = body.hidden;
      body.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
      btn.firstChild.nodeValue = open ? 'Close' : 'Read';
    });
    host.appendChild(btn);
  }

  document.querySelectorAll('.ncard').forEach(function (c) {
    var t = c.querySelector('.ncard__t');
    wire(c, c.querySelector('.ncard__body'), t ? t.textContent.trim() : '');
  });
})();


/* V5.3 — a nav some ao descer e volta ao subir, só no celular.
   Sempre visível no topo da página e sempre visível com o menu aberto. */
(function () {
  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav__toggle');
  if (!nav) return;

  var mq = window.matchMedia('(max-width: 47.9375em)');
  var last = window.scrollY;
  var limite = 320;               /* não esconde antes de sair do topo */

  function tick() {
    if (!mq.matches) { nav.classList.remove('is-tucked'); last = window.scrollY; return; }
    if (toggle && toggle.getAttribute('aria-expanded') === 'true') { nav.classList.remove('is-tucked'); return; }

    var y = window.scrollY;
    if (y < limite) nav.classList.remove('is-tucked');
    else if (y > last + 6) nav.classList.add('is-tucked');
    else if (y < last - 6) nav.classList.remove('is-tucked');
    last = y;
  }

  window.addEventListener('scroll', tick, { passive: true });
  mq.addEventListener ? mq.addEventListener('change', tick) : mq.addListener(tick);
})();

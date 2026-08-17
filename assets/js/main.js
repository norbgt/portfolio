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

(function () {
  'use strict';
  document.body.classList.add('has-js');
  var hamburger = document.querySelector('.nav-hamburger');
  var menu = document.querySelector('.nav-mobile');
  var mobile = window.matchMedia('(max-width: 767px)');

  if (hamburger && menu) {
    hamburger.hidden = false;
    function closeMenu(restoreFocus) {
      menu.hidden = true;
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Open menu');
      if (restoreFocus) hamburger.focus();
    }
    hamburger.addEventListener('click', function () {
      var open = hamburger.getAttribute('aria-expanded') !== 'true';
      menu.hidden = !open;
      hamburger.setAttribute('aria-expanded', String(open));
      hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { closeMenu(false); });
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !menu.hidden) closeMenu(true);
    });
    document.addEventListener('click', function (event) {
      if (!menu.hidden && !event.target.closest('.nav')) closeMenu(false);
    });
    mobile.addEventListener('change', function () { closeMenu(false); });
  }

  var controls = document.querySelector('.preview-controls');
  if (controls) {
    var buttons = Array.from(controls.querySelectorAll('button'));
    controls.hidden = false;
    controls.setAttribute('role', 'tablist');
    buttons.forEach(function (button, index) {
      button.id = 'tab-' + button.dataset.preview;
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-controls', 'preview-' + button.dataset.preview);
      var panel = document.getElementById('preview-' + button.dataset.preview);
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', button.id);
      panel.setAttribute('tabindex', '0');
      panel.hidden = index !== 0;
      button.setAttribute('aria-selected', String(index === 0));
      button.tabIndex = index === 0 ? 0 : -1;
      function select() {
        buttons.forEach(function (other) {
          var active = other === button;
          other.setAttribute('aria-selected', String(active));
          other.tabIndex = active ? 0 : -1;
          document.getElementById('preview-' + other.dataset.preview).hidden = !active;
        });
      }
      button.addEventListener('click', select);
      button.addEventListener('keydown', function (event) {
        var next;
        if (event.key === 'ArrowRight') next = (index + 1) % buttons.length;
        if (event.key === 'ArrowLeft') next = (index + buttons.length - 1) % buttons.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = buttons.length - 1;
        if (next !== undefined) {
          event.preventDefault();
          buttons[next].click();
          buttons[next].focus();
        }
      });
    });
  }
})();

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

  var tutorialPlayer = document.querySelector('.tutorial-player');
  if (tutorialPlayer) {
    var screen = tutorialPlayer.querySelector('.tutorial-screen');
    var lessons = Array.from(document.querySelectorAll('.tutorial-list a'));
    var currentLesson = lessons[0];
    tutorialPlayer.hidden = false;
    lessons.forEach(function (link, index) {
      var title = link.querySelector('strong').textContent;
      link.setAttribute('aria-label', 'Play tutorial ' + (index + 1) + ': ' + title);
      link.setAttribute('aria-controls', 'tutorial-player');
      link.querySelector('.lesson-duration').textContent = link.querySelector('.lesson-duration').textContent.replace('Watch on YouTube', 'Watch here');
      link.querySelector('.lesson-arrow').textContent = '▶';
      if (index === 0) link.setAttribute('aria-current', 'true');
      link.addEventListener('click', function (event) {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        currentLesson = link;
        lessons.forEach(function (other) { other.removeAttribute('aria-current'); });
        link.setAttribute('aria-current', 'true');
        var duration = link.querySelector('.lesson-duration').textContent.split(' · ')[0];
        document.getElementById('tutorial-position').textContent = 'Tutorial ' + String(index + 1).padStart(2, '0') + ' of ' + lessons.length + ' · ' + duration;
        document.getElementById('tutorial-current-title').textContent = title;
        tutorialPlayer.querySelector('.tutorial-external').href = link.href;
        playTutorial();
        if (window.matchMedia('(max-width: 1000px)').matches) {
          tutorialPlayer.scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start'});
        }
      });
    });
    function playTutorial() {
      var videoId = new URL(currentLesson.href).searchParams.get('v');
      if (!/^[\w-]{11}$/.test(videoId)) return;
      var frame = document.createElement('iframe');
      frame.src = 'https://www.youtube-nocookie.com/embed/' + videoId + '?autoplay=1&playsinline=1&rel=0';
      frame.title = 'Travel Planner tutorial: ' + currentLesson.querySelector('strong').textContent;
      frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      frame.allowFullscreen = true;
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      screen.replaceChildren(frame);
    }
    tutorialPlayer.querySelector('.tutorial-play').addEventListener('click', function () {
      playTutorial();
      screen.querySelector('iframe').focus();
    });
  }
})();

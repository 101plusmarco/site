/* ==========================================================
   main.js
   behaviour for the site. content lives in content.js,
   looks live in styles.css. this file should rarely need touching.
   ========================================================== */

(() => {
  'use strict';

  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointerQuery = window.matchMedia('(pointer: fine)');

  function prefersReducedMotion() {
    return reducedMotionQuery.matches;
  }

  function byId(id) {
    return document.getElementById(id);
  }

  /* ---------- toast (small pill message) ---------- */

  let toastTimerId = null;

  function showToast(message) {
    const toast = byId('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-on');
    clearTimeout(toastTimerId);
    toastTimerId = setTimeout(() => toast.classList.remove('is-on'), 3600);
  }

  /* ---------- loader: delayed departures board + tea progress ---------- */

  const loadingMessages = [
    'boiling the kettle',
    'locating the milk',
    'checking the time',
    'steeping (3 mins, not 4, i know)',
    'traffic stopped on the motorway'
  ];

  function initLoader() {
    const loader = byId('loader');
    if (!loader) return;

    if (sessionStorage.getItem('seenLoader') || prefersReducedMotion()) {
      loader.remove();
      return;
    }

    const bar = byId('loaderBar');
    const status = byId('loaderStatus');
    const percent = byId('loaderPercent');
    let progress = 0;
    let stepIndex = 0;

    function finish() {
      clearInterval(tickId);
      sessionStorage.setItem('seenLoader', '1');
      loader.classList.add('is-done');
      setTimeout(() => loader.remove(), 600);
    }

    const tickId = setInterval(() => {
      progress = Math.min(100, progress + Math.random() * 9 + 3);
      bar.style.width = `${progress}%`;
      percent.textContent = `${Math.floor(progress)}%`;

      const nextStep = Math.min(loadingMessages.length - 1, Math.floor(progress / 21));
      if (nextStep !== stepIndex) {
        stepIndex = nextStep;
        status.textContent = loadingMessages[stepIndex];
      }

      if (progress >= 100) {
        status.textContent = 'arrived roughly on time. (it is not.)';
        setTimeout(finish, 450);
        clearInterval(tickId);
      }
    }, 110);

    loader.addEventListener('click', finish);
    document.addEventListener('keydown', function onEscape(event) {
      if (event.key === 'Escape') {
        finish();
        document.removeEventListener('keydown', onEscape);
      }
    });
  }

  /* ---------- gantry nav: highlight the junction you're at ---------- */

  function initActiveNav() {
    const links = document.querySelectorAll('.gantry__link[href^="#"]');
    if (!links.length || !('IntersectionObserver' in window)) return;

    const sections = [...links]
      .map((link) => byId(link.getAttribute('href').slice(1)))
      .filter(Boolean);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          const isActive = link.getAttribute('href') === `#${entry.target.id}`;
          if (isActive) {
            link.setAttribute('aria-current', 'true');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach((section) => observer.observe(section));
  }

  /* ---------- scroll reveal ---------- */

  function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || prefersReducedMotion()) {
      items.forEach((item) => item.classList.add('is-in'));
      return;
    }

    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        activeObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    items.forEach((item) => observer.observe(item));
  }

  /* ---------- about: commits, now playing ---------- */

  function renderCommits() {
    const list = byId('commitList');
    if (!list || typeof commitLog === 'undefined') return;

    commitLog.forEach((commit) => {
      const item = document.createElement('li');
      item.className = 'commit';

      const hash = document.createElement('code');
      hash.textContent = commit.hash;

      const message = document.createElement('span');
      message.className = 'commit__message';
      message.textContent = commit.message;

      const date = document.createElement('time');
      date.dateTime = commit.date;
      date.textContent = commit.date;

      item.append(hash, message, date);
      list.appendChild(item);
    });
  }

  /* ---------- skills: honest bars ---------- */

  function renderSkills() {
    const container = byId('skillList');
    if (!container || typeof skillList === 'undefined') return;

    skillList.forEach((skill) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'skill reveal';
      if (skill.level < 20) wrapper.classList.add('skill--low');

      const top = document.createElement('div');
      top.className = 'skill__top';

      const name = document.createElement('span');
      name.textContent = skill.name;

      const note = document.createElement('span');
      note.className = 'skill__note';
      note.textContent = skill.note;

      top.append(name, note);

      const track = document.createElement('div');
      track.className = 'skill__track';
      track.setAttribute('role', 'meter');
      track.setAttribute('aria-label', `${skill.name}: ${skill.note}`);
      track.setAttribute('aria-valuemin', '0');
      track.setAttribute('aria-valuemax', '100');
      track.setAttribute('aria-valuenow', String(skill.level));
      track.style.setProperty('--skillLevel', `${skill.level}%`);

      const fill = document.createElement('span');
      fill.className = 'skill__fill';
      track.appendChild(fill);

      wrapper.append(top, track);
      container.appendChild(wrapper);
    });
  }

  /* ---------- projects ---------- */

  function badgeToneFor(status) {
    if (status.startsWith('shipped (')) return 'warn';
    if (status === 'shipped') return 'good';
    if (status.startsWith('abandoned')) return 'blue';
    return 'muted';
  }

  function createProjectCard(project) {
    const article = document.createElement('article');
    article.className = 'card project-card reveal';

    const top = document.createElement('div');
    top.className = 'project-card__top';

    const badge = document.createElement('span');
    badge.className = `badge badge--${badgeToneFor(project.status)}`;
    badge.textContent = project.status;
    top.appendChild(badge);

    if (project.note) {
      const note = document.createElement('span');
      note.className = 'project-card__note';
      note.textContent = project.note;
      top.appendChild(note);
    }

    const title = document.createElement('h3');
    title.className = 'project-card__title';
    title.textContent = project.title;

    const summary = document.createElement('p');
    summary.textContent = project.summary;

    const stack = document.createElement('ul');
    stack.className = 'stack';
    project.stack.forEach((item) => {
      const listItem = document.createElement('li');
      listItem.textContent = item;
      stack.appendChild(listItem);
    });

    const link = document.createElement('a');
    link.href = project.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = `${project.linkLabel} →`;
    link.setAttribute('aria-label', `${project.linkLabel}: ${project.title} (opens in a new tab)`);

    article.append(top, title, summary, stack, link);
    return article;
  }

  function renderProjects() {
    const standard = byId('projectsStandard');
    if (!standard || typeof projectList === 'undefined') return;

    projectList.forEach((project) => {
      standard.appendChild(createProjectCard(project));
    });
  }

  /* ---------- hero greeting: typed out, cycling through greetings ---------- */

  function initHeroGreeting() {
    const target = byId('heroGreeting');
    if (!target || typeof heroGreetings === 'undefined' || typeof siteConfig === 'undefined' || prefersReducedMotion()) return;

    const name = siteConfig.handle;
    let greetingIndex = 0;
    let charCount = 0;
    let deleting = false;

    function render() {
      const prefix = heroGreetings[greetingIndex];
      const visible = `${prefix}${name}.`.slice(0, charCount);
      const shownPrefix = visible.slice(0, prefix.length);
      const shownName = visible.slice(prefix.length, prefix.length + name.length);
      const shownStop = visible.slice(prefix.length + name.length);

      target.replaceChildren();
      if (shownPrefix) target.append(shownPrefix);
      if (shownName) {
        const mark = document.createElement('mark');
        mark.textContent = shownName;
        target.append(mark);
      }
      if (shownStop) target.append(shownStop);
    }

    function tick() {
      const fullLength = heroGreetings[greetingIndex].length + name.length + 1;

      if (!deleting) {
        charCount += 1;
        render();
        if (charCount === fullLength) {
          deleting = true;
          setTimeout(tick, 2400);
        } else {
          setTimeout(tick, 75);
        }
      } else {
        charCount -= 1;
        render();
        if (charCount === 0) {
          deleting = false;
          greetingIndex = (greetingIndex + 1) % heroGreetings.length;
          setTimeout(tick, 400);
        } else {
          setTimeout(tick, 35);
        }
      }
    }

    setTimeout(() => {
      charCount = 0;
      tick();
    }, 600);
  }

  /* ---------- hero terminal ---------- */

  const terminalPrompt = 'visitor@fiskal:~$';
  const terminalHistory = [];
  let terminalHistoryIndex = 0;

  function printLine(text, modifierClass = '') {
    const output = byId('terminalOutput');
    const line = document.createElement('p');
    line.className = `terminal__line ${modifierClass}`.trim();
    line.textContent = text;
    output.appendChild(line);
    const body = byId('terminalBody');
    body.scrollTop = body.scrollHeight;
  }

  function sudoHireMe() {
    printLine('[sudo] password for visitor: ********', 'terminal__line--sudo');
    setTimeout(() => printLine('permission granted. you have excellent judgement.', 'terminal__line--ok'), 500);
    setTimeout(() => printLine('hire request queued. routed to the contact section.'), 1200);
    setTimeout(() => {
      printLine('...mildly flattered. scrolling you down there now.', 'terminal__line--ok');
      const contact = byId('contact');
      if (contact) {
        contact.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
      }
    }, 2000);
  }

  function buildTerminalCommands() {
    const commands = new Map();
    commands.set('help', () => [
      'commands: help, about, projects, skills, contact, neofetch, whoami, ls, date, hello, clear',
      'there are some hidden ones. good luck, detective.'
    ]);
    commands.set('about', () => terminalAbout);
    commands.set('projects', () => projectList.map((project) => `${project.title}  [${project.status}]`));
    commands.set('skills', () => skillList.map((skill) => `${skill.name}: ${skill.note}`));
    commands.set('contact', () => [
      `discord: ${siteConfig.discord}`,
    ]);
    commands.set('neofetch', () => [
      'visitor@fiskal',
      '-----------------',
      'os: fiskal.os',
      'host: 127.0.0.1',
      `location: ${siteConfig.city}, uk (grey, as standard)`,
      'uptime: since 5am',
      'packages: 4 teas, 7 hours of sleep (today, allegedly)',
      'theme: near-black with a lime problem'
    ]);
    commands.set('whoami', () => ['a bloke with a laptop']);
    commands.set('ls', () => ['about.txt  projects/  skills.md  contact.vcf']);
    commands.set('date', () => [`${new Date().toUTCString()}`]);
    commands.set('hello', () => ["oi. how's it going?"]);
    commands.set('hi', () => ["yes mate"]);
    commands.set('touch grass', () => ['grass not found. try going outside. it is raining, obviously.']);
    commands.set('exit', () => ["you can't leave. the tea is too strong."]);
    commands.set('make me a sandwich', () => ['okay. one greggs sausage roll, delivered.']);
    commands.set('rm -rf /', () => ['whoa. nothing was deleted (this is a fake terminal, sadly).']);
    commands.set('rm -rf ~', () => ['whoa. nothing was deleted (this is a fake terminal, sadly).']);
    commands.set('rm -rf *', () => ['whoa. nothing was deleted (this is a fake terminal, sadly).']);
    return commands;
  }

  function runTerminalCommand(rawInput) {
    const input = rawInput.trim();
    const command = input.toLowerCase().replace(/\s+/g, ' ');
    printLine(`${terminalPrompt} ${input}`, 'terminal__line--cmd');
    if (!command) return;

    if (command === 'clear') {
      byId('terminalOutput').textContent = '';
      return;
    }

    if (command === 'sudo hire') {
      sudoHireMe();
      return;
    }

    if (command === 'hi hun') {
      printLine('hi babe');
      return;
    }

    if (command === 'status') {
      printLine('taken <333');
      return;
    }

    if (command === 'bf') {
      printLine('none of ya business mate');
      return;
    }

    if (command === 'sudo') {
      printLine('sudo: a verb is required, mate.', 'terminal__line--sudo');
      return;
    }

    if (command.startsWith('rm ')) {
      printLine('rm: nope. this is a sandbox, but your trust in me is not.', 'terminal__line--sudo');
      return;
    }

    const commands = buildTerminalCommands();
    const handler = commands.get(command);
    if (handler) {
      handler().forEach((line) => printLine(line));
      return;
    }

    if (command.startsWith('sudo ')) {
      printLine(`${command.slice(5)}: sudo is not a licence to do anything. (you are not root, you are a visitor.)`, 'terminal__line--sudo');
      return;
    }

    printLine(`command not found: ${command}. have you tried turning it off and on again?`);
  }

  function initTerminal() {
    const form = byId('terminalForm');
    const input = byId('terminalInput');
    const body = byId('terminalBody');
    if (!form || !input || !body) return;

    printLine('welcome to fiskal.os (real). type "help".', 'terminal__line--ok');

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const value = input.value;
      if (value.trim()) {
        terminalHistory.push(value);
        terminalHistoryIndex = terminalHistory.length;
      }
      runTerminalCommand(value);
      input.value = '';
    });

    input.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (terminalHistoryIndex > 0) {
          terminalHistoryIndex -= 1;
          input.value = terminalHistory[terminalHistoryIndex];
        }
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        terminalHistoryIndex = Math.min(terminalHistory.length, terminalHistoryIndex + 1);
        input.value = terminalHistory[terminalHistoryIndex] || '';
      }
    });

    body.addEventListener('click', (event) => {
      if (event.target.closest('a, button')) return;
      input.focus();
    });
  }

  /* ---------- tea rain (konami code and the 100 teas egg) ---------- */

  const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

  let teaRainRunning = false;

  function spawnTeaDrop() {
    const drop = document.createElement('span');
    drop.className = 'falling-tea';
    drop.setAttribute('aria-hidden', 'true');
    drop.textContent = Math.random() < 0.33 ? '🥐' : '🫖';
    drop.style.left = `${Math.random() * 100}vw`;
    document.body.appendChild(drop);

    const animation = drop.animate([
      { transform: 'translate3d(0, 0, 0) rotate(0deg)' },
      { transform: `translate3d(${(Math.random() - 0.5) * 120}px, 110vh, 0) rotate(${Math.random() * 540}deg)` }
    ], {
      duration: 2600 + Math.random() * 1600,
      delay: Math.random() * 1200,
      easing: 'linear',
      fill: 'backwards'
    });
    animation.onfinish = () => drop.remove();
  }

  function triggerTeaRain(message) {
    showToast(message);
    if (prefersReducedMotion()) return;

    for (let index = 0; index < 28; index += 1) {
      spawnTeaDrop();
    }
  }

  function spawnRainStreak() {
    const streak = document.createElement('span');
    streak.className = 'rain-streak';
    streak.setAttribute('aria-hidden', 'true');
    streak.style.left = `${Math.random() * 100}vw`;
    streak.style.height = `${14 + Math.random() * 18}px`;
    document.body.appendChild(streak);

    const animation = streak.animate([
      { transform: 'translate3d(0, -10vh, 0)' },
      { transform: 'translate3d(-12px, 110vh, 0)' }
    ], {
      duration: 900 + Math.random() * 700,
      easing: 'linear',
      fill: 'forwards'
    });
    animation.onfinish = () => streak.remove();
  }

  function startTeaRain(message) {
    showToast(message);
    if (prefersReducedMotion() || teaRainRunning) return;

    teaRainRunning = true;
    setInterval(() => {
      for (let index = 0; index < 3; index += 1) {
        spawnRainStreak();
      }
    }, 90);
  }

  function initKonami() {
    let position = 0;
    document.addEventListener('keydown', (event) => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      if (key === konamiSequence[position]) {
        position += 1;
        if (position === konamiSequence.length) {
          position = 0;
          triggerTeaRain('+30 lives. you are now a senior engineer. (you are not.)');
        }
      } else {
        position = key === konamiSequence[0] ? 1 : 0;
      }
    });
  }

  /* ---------- fake radio player controls ---------- */

  function initRadioControls() {
    const buttons = document.querySelectorAll('[data-radio]');
    if (!buttons.length) return;

    let paused = false;

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const action = button.dataset.radio;

        if (action === 'playPause') {
          paused = !paused;
          button.textContent = paused ? '▶' : '❚❚';
          button.setAttribute('aria-label', paused ? 'play' : 'pause');
          return;
        }

      });
    });
  }

  /* ---------- fun widgets: rizz, fuel, lights ---------- */

  function describeRizz(score) {
    if (score >= 95) return 'frankly unfair. we should not be allowed this.';
    if (score >= 80) return 'respectable. recruiters will love me.';
    if (score >= 70) return 'decent. but not good enough.';
    return 'low. looks like we\'re staying unemployed boys.';
  }

  function initRizzMeter() {
    const button = byId('rizzButton');
    const output = byId('rizzOutput');
    const verdict = byId('rizzVerdict');
    if (!button || !output || !verdict) return;

    button.addEventListener('click', () => {
      if (button.disabled) return;
      button.disabled = true;
      button.textContent = 'already checked.';

      const target = 61 + Math.floor(Math.random() * 39);
      verdict.textContent = 'calculating.';

      if (prefersReducedMotion()) {
        output.textContent = `recruiter rizz: ${target}%`;
        verdict.textContent = describeRizz(target);
        return;
      }

      const start = performance.now();
      const duration = 1400;

      function step(now) {
        const elapsed = Math.min(1, (now - start) / duration);
        const current = Math.round(target * elapsed);
        output.textContent = elapsed < 1
          ? `recruiter rizz: loading... ${current}%`
          : `recruiter rizz: ${target}%`;
        if (elapsed < 1) {
          requestAnimationFrame(step);
        } else {
          verdict.textContent = describeRizz(target);
        }
      }

      requestAnimationFrame(step);
    });
  }

  function initFuelCounter() {
    const buttons = document.querySelectorAll('[data-fuel]');
    if (!buttons.length) return;

    const fuel = { tea: 0, energyDrink: 0 };

    function renderFuel() {
      document.querySelectorAll('[data-fuel-out]').forEach((output) => {
        output.textContent = fuel[output.dataset.fuelOut] || 0;
      });
    }

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const key = button.dataset.fuel;
        fuel[key] = (fuel[key] || 0) + 1;
        renderFuel();

        if (key === 'tea' && fuel.tea === 100) {
          startTeaRain('oh look, british weather.');
        } else if (fuel[key] === 5) {
          showToast(key === 'tea' ? 'five teas. very proud.' : 'five energy drinks. please sleep.');
        }
      });
    });

    renderFuel();
  }

  function initLightJoke() {
    const button = byId('lightJoke');
    const flash = byId('lightFlash');
    if (!button || !flash) return;

    let busy = false;

    button.addEventListener('click', () => {
      if (busy) return;

      if (prefersReducedMotion()) {
        showToast('mate, my eyes. (reduced motion means no white flash, you\'re welcome)');
        return;
      }

      busy = true;
      flash.classList.add('is-on');
      setTimeout(() => {
        flash.classList.remove('is-on');
        busy = false;
      }, 1600);
    });
  }

  /* ---------- cookie banner ---------- */

  function initCookieBanner() {
    const banner = byId('cookieBanner');
    if (!banner) return;

    if (localStorage.getItem('cookieChoice')) return;
    banner.hidden = false;

    banner.addEventListener('click', (event) => {
      const choice = event.target.closest('[data-cookie]');
      if (!choice) return;

      const value = choice.dataset.cookie;
      localStorage.setItem('cookieChoice', value);

      if (value === 'harder') {
        banner.classList.add('is-shaking');
        showToast('woops, it fell into the tea');
        setTimeout(() => {
          banner.hidden = true;
        }, 450);
      } else {
        banner.hidden = true;
      }
    });
  }

  /* ---------- contact form: does absolutely nothing ---------- */

  function initContactForm() {
    const form = byId('contactForm');
    const status = byId('contactStatus');
    if (!form || !status) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      status.textContent = 'sent to the void!';
    });
  }

  /* ---------- pfp easter egg: click for British commentary ---------- */

  function initPfpEasterEgg() {
    const button = byId('pfpButton');
    const image = byId('pfpImage');
    const bubble = byId('pfpBubble');
    if (!button || !image || !bubble || typeof pfpLines === 'undefined') return;

    if (typeof siteConfig !== 'undefined') {
      image.src = siteConfig.pfpImage;
      image.alt = siteConfig.pfpAlt || '';
    }

    const showMissingImage = () => {
      image.hidden = true;
      bubble.textContent = 'no pfp.png yet. put one next to index.html.';
    };
    image.addEventListener('error', showMissingImage);
    if (image.complete && image.naturalWidth === 0) showMissingImage();

    let clicks = 0;

    button.addEventListener('click', () => {
      const line = pfpLines[clicks % pfpLines.length];
      clicks += 1;
      bubble.textContent = line;
      bubble.classList.add('is-on');
      image.style.transform = 'rotate(-6deg)';
      setTimeout(() => {
        image.style.transform = '';
      }, 300);
    });

    button.addEventListener('mouseleave', () => {
      bubble.classList.remove('is-on');
    });
  }

  /* ---------- custom cursor trail (fine pointers only) ---------- */

  function initCursor() {
    const cursor = byId('cursor');
    if (!cursor || prefersReducedMotion() || !finePointerQuery.matches) return;

    document.documentElement.classList.add('has-cursor');

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    window.addEventListener('pointermove', (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
    });

    function frame() {
      currentX += (targetX - currentX) * 0.22;
      currentY += (targetY - currentY) * 0.22;
      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      requestAnimationFrame(frame);
    }
    frame();
  }

  /* ---------- weather (open-meteo, no key) ---------- */

  function describeWeather(code) {
    if (code <= 1) return 'suspiciously sunny, be wary';
    if (code <= 3) return 'grey';
    if (code <= 48) return 'foggy, like my brain';
    if (code <= 67) return 'wet (obviously)';
    if (code <= 77) return 'snowing, the trains are cooked';
    if (code <= 82) return 'showery, classic';
    return 'thundering, stay in with a brew';
  }

  async function initWeather() {
    const target = byId('weatherText');
    if (!target || typeof siteConfig === 'undefined') return;

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${siteConfig.latitude}&longitude=${siteConfig.longitude}&current=weather_code,temperature_2m`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`weather request failed: ${response.status}`);
      const data = await response.json();
      const description = describeWeather(data.current.weather_code);
      target.textContent = `${description}, ${Math.round(data.current.temperature_2m)}°C`;
    } catch (error) {
      target.textContent = "grey (couldn't check, which is also grey)";
    }
  }

  /* ---------- footer bits (GMT) ---------- */

  function initFooter() {
    const year = byId('footerYear');
    if (year) year.textContent = String(new Date().getFullYear());
  }

  function initGmtClock() {
    const clock = byId('heroTime');
    if (!clock) return;

    function renderClock() {
      clock.textContent = new Date().toLocaleString('en-GB', {
        timeZone: 'Etc/GMT',
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    }

    renderClock();
    setInterval(renderClock, 1000);
  }

  /* ---------- boot ---------- */

  function initStartAtTop() {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    window.scrollTo(0, 0);
    window.addEventListener('load', () => window.scrollTo(0, 0));
  }

  function init() {
    initStartAtTop();
    renderCommits();
    renderSkills();
    renderProjects();

    initLoader();
    initActiveNav();
    initHeroGreeting();
    initReveal();
    initTerminal();
    initKonami();
    initRadioControls();
    initRizzMeter();
    initFuelCounter();
    initLightJoke();
    initCookieBanner();
    initContactForm();
    initPfpEasterEgg();
    initCursor();
    initFooter();
    initGmtClock();
    initWeather();
  }

  init();
})();

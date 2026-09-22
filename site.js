'use strict';
const root = document.documentElement;
const themeButton = document.querySelector('#theme-toggle');
let theme = 'light';
try {
  const saved = localStorage.getItem('portfolio-theme-v2');
  if (saved === 'dark' || saved === 'light') theme = saved;
} catch {}
function applyTheme() {
  root.dataset.theme = theme;
  if (themeButton) {
    const next = theme === 'dark' ? 'light' : 'dark';
    themeButton.textContent = next === 'light' ? 'Light mode' : 'Dark mode';
    themeButton.setAttribute('aria-label', `Switch to ${next} mode`);
    themeButton.setAttribute('aria-pressed', String(theme === 'dark'));
  }
  const color = document.querySelector('meta[name="theme-color"]');
  if (color) color.content = theme === 'dark' ? '#171e1a' : '#ffffff';
}
applyTheme();
if (themeButton) {
  themeButton.hidden = false;
  themeButton.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    applyTheme();
    try { localStorage.setItem('portfolio-theme-v2', theme); } catch {}
  });
}


const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const entrance = document.querySelector('#entrance');
if (entrance) {
  const openDoor = entrance.querySelector('.open-door');
  const skipDoor = entrance.querySelector('.skip-portal');
  const pauseDoors = entrance.querySelector('#pause-doors');
  const rig = entrance.querySelector('.hero-door-rig');
  const stage = entrance.querySelector('.portal-stage');
  const status = entrance.querySelector('.door-status');
  const work = document.querySelector('#work');
  const heading = work.querySelector('h2');
  const headingText = heading.textContent;
  let opening = false;
  let paused = false;
  let timers = [];
  let animations = [];
  let letterField;
  function clearTransition() {
    timers.forEach(clearTimeout);
    timers = [];
    animations.forEach(animation => animation.cancel());
    animations = [];
    letterField?.remove();
    letterField = null;
    document.body.classList.remove('crossing-door');
    document.body.style.removeProperty('--scrollbar-gap');
    work.classList.remove('work-arriving', 'work-visible');
    heading.textContent = headingText;
    heading.removeAttribute('aria-label');
    heading.classList.remove('arrival-heading');
    document.querySelector('main').inert = false;
  }
  function landed() {
    entrance.classList.add('is-landed');
    openDoor.disabled = false;
    status.textContent = 'Ready when you are.';
  }
  function positionWork() {
    history.replaceState(null, '', '#work');
    work.scrollIntoView({ behavior: 'instant', block: 'start' });
  }
  function revealWork() {
    clearTransition();
    entrance.classList.add('intro-complete');
    entrance.classList.remove('portal-cinematic');
    stage.style.removeProperty('transform-origin');
    work.setAttribute('tabindex', '-1');
    positionWork();
    work.focus({ preventScroll: true });
  }
  function animate(element, frames, options) {
    const animation = element.animate(frames, {...options, fill:'both'});
    animations.push(animation);
    return animation;
  }
  function buildLetters() {
    heading.classList.add('arrival-heading');
    letterField = document.createElement('div');
    letterField.className = 'letter-field';
    letterField.setAttribute('aria-hidden', 'true');
    document.body.append(letterField);
    const font = getComputedStyle(heading);
    const centerX = innerWidth * .5;
    const centerY = innerHeight * .48;
    Array.from(headingText).forEach((character, index) => {
      if (character === ' ') return;
      const range = document.createRange();
      range.setStart(heading.firstChild, index);
      range.setEnd(heading.firstChild, index + 1);
      const box = range.getBoundingClientRect();
      const letter = document.createElement('span');
      letter.className = 'flying-letter';
      letter.textContent = character;
      Object.assign(letter.style, {
        left:`${box.left}px`,top:`${box.top}px`,
        fontFamily:font.fontFamily,fontSize:font.fontSize,
        fontWeight:font.fontWeight,lineHeight:font.lineHeight,
        letterSpacing:font.letterSpacing,color:font.color
      });
      letterField.append(letter);
      const angle = index * 2.399;
      const radius = Math.min(innerWidth * .4, 430) * (.55 + (index % 4) * .12);
      const x = centerX + Math.cos(angle) * radius - box.left;
      const y = centerY + Math.sin(angle) * Math.min(innerHeight * .32, 230) - box.top;
      animate(letter, [
        {opacity:0,transform:`translate(${centerX-box.left}px,${centerY-box.top}px) rotate(${index*31}deg) scale(.15)`,filter:'blur(5px)'},
        {opacity:.85,transform:`translate(${x}px,${y-45}px) rotate(${index%2 ? 32 : -38}deg) scale(1.2)`,filter:'blur(0px)',offset:.27},
        {opacity:1,transform:`translate(${x*.62}px,${y*.7}px) rotate(${index%2 ? -12 : 14}deg) scale(1.05)`,filter:'blur(0px)',offset:.5},
        {opacity:1,transform:'translate(0,5px) rotate(0deg) scale(1)',filter:'blur(0px)',offset:.9},
        {opacity:1,transform:'translate(0,0) rotate(0deg) scale(1)',filter:'blur(0px)'}
      ], {duration:800,delay:1160 + (index % 6)*12,easing:'ease-in-out'});
    });
    const symbols = ['{','}','a','b','01','?','↗','x','y','∑','/','m'];
    for (let index = 0; index < 24; index++) {
      const mote = document.createElement('span');
      mote.className = 'letter-mote';
      mote.textContent = symbols[index % symbols.length];
      const angle = index * 2.399;
      const dx = Math.cos(angle) * innerWidth * .47;
      const dy = Math.sin(angle) * innerHeight * .42;
      Object.assign(mote.style,{left:`${centerX}px`,top:`${centerY}px`,fontSize:`${12+index%5*5}px`});
      letterField.append(mote);
      animate(mote,[
        {opacity:0,transform:'translate(0,0) scale(.2)'},
        {opacity:.3,transform:`translate(${dx*.65}px,${dy*.65}px) rotate(${index*17}deg) scale(1)`,offset:.4},
        {opacity:0,transform:`translate(${dx}px,${dy+110}px) rotate(${index*25}deg) scale(.65)`}
      ],{duration:700,delay:1150+index%6*12,easing:'ease-out'});
    }
  }
  function enterWorld() {
    if (opening || openDoor.disabled) return;
    opening = true;
    if (reducedMotion.matches || paused || typeof stage.animate !== 'function') {
      revealWork();
      return;
    }
    const scrollbarGap = innerWidth - document.documentElement.clientWidth;
    document.body.style.setProperty('--scrollbar-gap', `${scrollbarGap}px`);
    document.body.classList.add('crossing-door');
    entrance.classList.add('portal-cinematic');
    work.classList.add('work-arriving');
    document.querySelector('main').inert = true;
    positionWork();
    const frame = entrance.querySelector('.door-interior').getBoundingClientRect();
    const stageBox = stage.getBoundingClientRect();
    stage.style.transformOrigin = `${frame.left+frame.width/2-stageBox.left}px ${frame.top+frame.height/2-stageBox.top}px`;
    const zoom = Math.max(innerWidth/frame.width,innerHeight/frame.height)*1.4;
    buildLetters();
    entrance.classList.add('is-unlocking');
    status.textContent = 'Unlocking...';
    timers.push(setTimeout(() => entrance.classList.add('is-opening'), 300));
    animate(stage,[
      {transform:'scale(1)',opacity:1},
      {transform:'scale(1.06)',opacity:1,offset:.12},
      {transform:`scale(${zoom})`,opacity:1}
    ],{duration:650,delay:500,easing:'cubic-bezier(.6,.02,.28,1)'});
    animate(entrance,[{opacity:1},{opacity:0}],{duration:280,delay:1130,easing:'ease-in-out'});
    timers.push(setTimeout(() => work.classList.add('work-visible'),1350));
    timers.push(setTimeout(revealWork,2100));
  }
  openDoor.hidden = false;
  openDoor.disabled = true;
  pauseDoors.hidden = reducedMotion.matches;
  rig.addEventListener('animationend', event => {
    if (event.animationName === 'door-deliver') landed();
  });
  if (reducedMotion.matches) landed();
  openDoor.addEventListener('click', enterWorld);
  skipDoor.addEventListener('click', event => {
    event.preventDefault();
    revealWork();
  });
  pauseDoors.addEventListener('click', () => {
    paused = !paused;
    entrance.classList.toggle('motion-paused', paused);
    pauseDoors.textContent = paused ? 'Resume motion' : 'Pause motion';
    pauseDoors.setAttribute('aria-pressed', String(paused));
    if (paused) {
      landed();
      if (opening) revealWork();
    }
  });
  reducedMotion.addEventListener('change', () => {
    pauseDoors.hidden = reducedMotion.matches;
    if (reducedMotion.matches) {
      landed();
      if (opening) revealWork();
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && opening) revealWork();
  });
  window.addEventListener('resize', () => {
    if (opening && !entrance.classList.contains('intro-complete')) revealWork();
  });
  document.addEventListener('visibilitychange', () => {
    entrance.classList.toggle('is-hidden-tab', document.hidden);
    if (document.hidden && opening) revealWork();
  });
  if (location.hash) entrance.classList.add('intro-complete');
}

// These local examples illustrate product behavior using fictional data.
// They do not call AI services or transmit questions, transactions, or applications.
document.querySelectorAll('[data-demo="knowledge"]').forEach((demo) => {
  const policies = [
    {
      terms: ['remote', 'hybrid', 'home', 'office days'],
      title: 'Hybrid work policy', version: 'v2',
      answer: 'Two remote days per week.',
      detail: 'Coordinate your schedule with your manager.',
      quote: 'Team members may work remotely up to two days per week.'
    },
    {
      terms: ['expense', 'receipt', 'reimburse'],
      title: 'Expense policy', version: 'v3',
      answer: 'Submit expenses within 30 days.',
      detail: 'Attach an itemized receipt to each request.',
      quote: 'Submit reimbursement requests within 30 days of the purchase.'
    }
  ];
  const form = demo.querySelector('form');
  const input = demo.querySelector('input');
  const answer = demo.querySelector('.answer-content');
  const source = demo.querySelector('.source-content');
  const review = demo.querySelector('.review-question');
  function search() {
    const query = input.value.trim().toLowerCase();
    const policy = query && policies.find((item) => item.terms.some((term) => query.includes(term)));
    review.hidden = Boolean(policy);
    review.disabled = false;
    review.textContent = 'Send for review ↗';
    if (policy) {
      answer.innerHTML = `<h4>${policy.answer}</h4><p>${policy.detail}</p><span class="citation-chip">↗ ${policy.title} · ${policy.version}</span>`;
      source.innerHTML = `<div class="source-file"><span aria-hidden="true">▤</span><strong>${policy.title}</strong><span>${policy.version}</span></div><p><mark>${policy.quote}</mark> ${policy.detail}</p><span class="source-status">✓ Source passage displayed</span>`;
    } else {
      answer.innerHTML = '<h4>No supported answer.</h4><p>This sample collection has no matching policy. A reviewer can help fill the gap.</p>';
      source.innerHTML = '<div class="source-file"><span aria-hidden="true">?</span><strong>No source found</strong></div><p>Keep the question open instead of inventing an answer.</p><span class="source-status">Human review available</span>';
    }
  }
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    search();
  });
  demo.querySelectorAll('[data-question]').forEach((button) => {
    button.addEventListener('click', () => {
      input.value = button.dataset.question;
      search();
    });
  });
  review.addEventListener('click', () => {
    answer.innerHTML = '<h4>Added to the sample review queue.</h4><p>A person can find the right policy or clarify the question.</p>';
    review.textContent = 'Queued for review ✓';
    review.disabled = true;
  });
});

document.querySelectorAll('[data-demo="statement"]').forEach((demo) => {
  const extract = demo.querySelector('.extract-button');
  const resolve = demo.querySelector('.resolve-button');
  const reset = demo.querySelector('.demo-reset');
  const status = demo.querySelector('.extraction-status');
  const badge = demo.querySelector('.output-badge');
  const empty = demo.querySelector('.sheet-empty');
  const results = demo.querySelector('.sheet-results');
  const duplicate = demo.querySelector('.duplicate-row');
  extract.addEventListener('click', () => {
    extract.disabled = true;
    demo.classList.add('is-extracting');
    badge.textContent = 'Extracting sample rows...';
    status.textContent = 'Reading rows and checking for repeated transactions.';
    setTimeout(() => {
      demo.classList.remove('is-extracting');
      empty.hidden = true;
      results.hidden = false;
      extract.hidden = true;
      resolve.hidden = false;
      badge.textContent = '4 extracted · 1 needs review';
      status.textContent = 'Two identical software charges. Review before approving.';
    }, reducedMotion.matches ? 0 : 1000);
  });
  resolve.addEventListener('click', () => {
    duplicate.hidden = true;
    resolve.hidden = true;
    reset.hidden = false;
    badge.textContent = '3 records · Review complete';
    status.textContent = 'Duplicate excluded by the reviewer. Three records ready for export.';
  });
  reset.addEventListener('click', () => {
    reset.hidden = true;
    extract.hidden = false;
    extract.disabled = false;
    duplicate.hidden = false;
    results.hidden = true;
    empty.hidden = false;
    badge.textContent = 'Ready to extract';
    status.textContent = '4 rows in the source. Let’s check them.';
  });
});

document.querySelectorAll('[data-demo="rekindle"]').forEach((demo) => {
  const histories = {
    steady: {days:[1,3,5,7,9,11,13,15,17,19,21,23,25,27],icon:'↔',title:'Steady cadence',pattern:'A steady pattern of contact.',detail:'Regular recent contact provides an established pattern.',alt:'Contact every other day throughout the sample period.'},
    gap: {days:[1,3,5,7,9,11,13,15],icon:'↗',title:'A growing gap',pattern:'The last contact was 13 days ago.',detail:'Recent silence differs from the earlier pattern of frequent contact.',alt:'Regular contact for 15 days, followed by 13 days without contact.'},
    sparse: {days:[24,27],icon:'…',title:'No score yet',pattern:'Only two contact days are available.',detail:'The model withholds a score when contact history is insufficient.',alt:'Only two contact days in the sample period, too little history for a score.'}
  };
  const timeline = demo.querySelector('.contact-timeline');
  const output = demo.querySelector('.cadence-output');
  function setScenario(key) {
    const data = histories[key];
    timeline.innerHTML = Array.from({length:28}, (_,i) => `<span class="contact-day${data.days.includes(i+1) ? ' active' : key === 'gap' && i > 14 ? ' gap-day' : ''}" aria-hidden="true"></span>`).join('');
    timeline.setAttribute('aria-label',data.alt);
    output.dataset.state = key;
    output.querySelector('.signal-icon').textContent = data.icon;
    output.querySelector('h4').textContent = data.title;
    output.querySelector('p').textContent = data.detail;
    demo.querySelector('.pattern-symbol').textContent = data.icon;
    demo.querySelector('.pattern-summary p').textContent = data.pattern;
    demo.querySelectorAll('[data-scenario]').forEach((button) => button.setAttribute('aria-pressed',String(button.dataset.scenario === key)));
  }
  demo.querySelectorAll('[data-scenario]').forEach((button) => button.addEventListener('click',() => setScenario(button.dataset.scenario)));
  setScenario('steady');
});

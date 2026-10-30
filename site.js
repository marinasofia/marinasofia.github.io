// Marina Martin. A New York subway car at night, built in three.js.
// Each thing in the car opens part of the portfolio. lofi.html has the same content as a plain page.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const G = window.gsap;
if (G) G.ticker.lagSmoothing(0);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const LINKEDIN = 'https://www.linkedin.com/in/marinasofiaml/';
const GITHUB = 'https://github.com/marinasofia';
const $ = (s, r = document) => r.querySelector(s);
const INK = '#141b25';

/* ================= content ================= */
const LABEL = {
  about: ['About', 'Today\'s paper'], work: ['Work', 'Strip map'], terminal: ['Terminal', 'Sign'], contact: ['Contact', 'Payphone'],
  sourcer: ['01 Sourcer', 'Lead engine'], knowledge: ['02 Knowledge Assistant', 'Cite or abstain'], rekindle: ['03 Rekindle', 'iMessage agent']
};
const KIND = { about: 'sheet', work: 'sheet', contact: 'sheet', sourcer: 'platform', knowledge: 'platform', rekindle: 'platform', terminal: 'term' };

const nextUp = (id, n, title) => `<button type="button" class="next-up" data-go="${id}"><span><small>Next · ${n}</small><b>${title}</b></span><i aria-hidden="true">→</i></button>`;
const HTML = {
  about: `<header class="paper"><p class="masthead">The Daily Query</p><p class="dateline"><span>New York</span><span id="dateline"></span><span>Late edition</span></p></header>
    <h2 class="headline" id="sheetTitle">Local analyst checks the math twice</h2>
    <p class="deck">New York analyst will not take a number on faith</p>
    <p class="lede dropcap">Marina Martin likes questions with a number at the end, and she trusts the number only after she has tried to break it.</p>
    <section class="blk"><h3>The method</h3><p>She starts from the question someone needs answered. She cleans the data before believing it and checks every result against a baseline. When a model is part of the answer, rules go first and the model goes last.</p></section>
    <section class="blk"><h3>Where she is now</h3><p>Lives and works in New York. Finishing a BBA in Computer Information Systems with a minor in Computer Science.</p></section>
    <section class="blk"><h3>In her toolkit</h3><ul class="chips"><li>SQL</li><li>Python</li><li>pandas</li><li>scikit-learn</li><li>Tableau</li><li>Excel</li><li>A/B testing</li><li>Regression</li><li>LangGraph</li><li>LLM APIs</li><li>RAG</li><li>FastAPI</li><li>Git</li></ul></section>
    <section class="blk"><h3>Languages spoken</h3><p>English, Spanish and Russian.</p></section>
    <section class="blk">${nextUp('work', 'Work', 'All stops so far')}</section>`,
  work: `<div class="strip">
    <div class="strip-head"><span class="bullet">M</span><span>MM local</span><h2 id="sheetTitle">All stops so far</h2></div>
    <ol class="stops">
      <li><i aria-hidden="true"></i><div><b>Columbia University Irving Medical Center</b><time>Jun to Sep 2024</time><small>Data Analytics Intern. Improved SQL ETL pipelines for clinical data, cutting time to insight by 30%.</small></div></li>
      <li><i aria-hidden="true"></i><div><b>GHA, M&amp;A advisory</b><time>Mar to Jun 2026</time><small>Data &amp; AI Analyst. Automated outreach and follow ups across 15,000+ contacts, cutting manual messaging time 90%.</small></div></li>
      <li><i aria-hidden="true"></i><div><b>NYC Tech Talent Pipeline</b><time>Jun to Aug 2026</time><small>Data Analytics Resident. One of 30 residents chosen from 180 applicants.</small></div></li>
      <li><i aria-hidden="true"></i><div><b>AWS Jam, first place</b><time>Sep 2026</time><small>Team of four. Every challenge solved in 3 hours against an 8 hour estimate.</small></div></li>
      <li class="next"><i aria-hidden="true"></i><div><b>BBA, Computer Information Systems</b><time>2027 · next stop</time><small>Minor in Computer Science. Dean's List.</small></div></li>
    </ol>
    <div class="strip-head side"><span class="bullet">P</span><span>Project line</span><h3>Built along the way</h3></div>
    <ol class="stops side">
      <li><i aria-hidden="true"></i><button type="button" data-go="sourcer"><b>Sourcer</b><time>2026 · transfer here</time><small>A lead engine that reads 405 career sites every morning.</small></button></li>
      <li><i aria-hidden="true"></i><button type="button" data-go="knowledge"><b>Knowledge Assistant</b><time>2026 · transfer here</time><small>Policy answers that cite the exact passage, or refuse.</small></button></li>
      <li><i aria-hidden="true"></i><button type="button" data-go="rekindle"><b>Rekindle</b><time>2026 · private project</time><small>An iMessage agent that texts you first. 0.906 ROC AUC decay model.</small></button></li>
      <li><i aria-hidden="true"></i><a href="https://github.com/marinasofia/statement-agent" target="_blank" rel="noopener"><b>Statement Agent</b><time>Code on GitHub ↗</time><small>LangGraph agent that extracts PDF bank statements to Excel and trusts a number only when the balances reconcile.</small></a></li>
      <li><i aria-hidden="true"></i><a href="https://github.com/marinasofia/bank-churn-model" target="_blank" rel="noopener"><b>Bank Churn Model</b><time>Code on GitHub ↗</time><small>Class weighted logistic regression with a fairness audit by gender and income.</small></a></li>
    </ol>
    <p class="strip-foot">Message me on LinkedIn.</p>
  </div>`,
  contact: `<span class="kick">Contact</span>
    <h2 class="h-page" id="sheetTitle">Give me <em>a ring.</em></h2>
    <p class="lede">Hiring for a data or AI role, or curious how one of these was built? Send me a message on LinkedIn. The line is open.</p>
    <section class="blk"><h3>Elsewhere</h3><div class="rows"><a href="${LINKEDIN}" target="_blank" rel="noopener"><span>LinkedIn</span><em>marinasofiaml ↗</em></a><a href="${GITHUB}" target="_blank" rel="noopener"><span>GitHub</span><em>marinasofia ↗</em></a></div></section>
    <section class="blk"><h3>Taking calls about</h3><p>Data and AI internships and new grad roles, 2027.</p></section>`,
};

/* ================= platforms: each project is a station you step out onto ================= */
// Each project is three panels on one lightbox poster that rolls from one to the next.
// The poster carries the headline and a picture. The placard beside it carries the notes:
// the reasoning, and on the last panel what it's built with.
const LINES = {
  sourcer: {
    bullet: '1', color: '#2c4d78', name: 'SOURCER', sub: 'LEAD ENGINE', next: 'knowledge',
    stack: ['Python', 'SQL', 'Claude API', 'LangGraph', 'scikit-learn', 'MCP'], code: 'https://github.com/marinasofia/sourcer',
    proof: [['813,961', 'postings read in 57 runs'], ['16 / 20', 'top picks are jobs I\'d apply to'], ['26¢', 'for a daily run of 15,000']],
    stops: [
      { label: 'The idea', title: '40,118 postings in. The right few out.', art: 'sites',
        body: '<p>A lead engine I built for my own search. Every morning it reads 405 company career sites, scores what fits against my profile and texts me the best match. When I apply, it tailors my resume from facts I\'ve already approved.</p>' },
      { label: 'How it decides', title: 'Most postings never reach the model.', art: 'funnel',
        body: '<p>Plain rules go first, so on a typical morning 38,000 postings are ruled out before any model call. A budget is checked before every call, and every model answer is validated with exactly one retry.</p><p>It only drops a posting on an explicit signal. A wrong drop is a job I never see.</p>' },
      { label: 'The proof', title: 'Measured on every change.', art: 'proof',
        body: '<p>A test set of 322 labelled postings runs on every change and fails the build if any score gets worse. A second model learns nightly from what I pick and only takes over after beating the live scorer seven nights in a row.</p>' },
    ],
  },
  rekindle: {
    bullet: '3', color: '#a8321f', name: 'REKINDLE', sub: 'IMESSAGE AGENT', next: 'sourcer',
    stack: ['TypeScript', 'Python', 'scikit-learn', 'Supabase', 'Postgres', 'Claude'], private: 'Private project',
    proof: [['0.906', 'ROC AUC on people it never saw'], ['112,137', 'moments tested'], ['2 a day', 'check ins at most']],
    stops: [
      { label: 'The idea', title: 'Notices when people go quiet.', art: 'quiet',
        body: '<p>Rekindle predicts which relationships are fading and texts you first in iMessage, with a brief before a meeting or a nudge when someone has gone quiet. Nothing sends without your yes.</p>' },
      { label: 'How it decides', title: 'A nudge only when a silence is unusual.', art: 'decay',
        body: '<p>A model compares each silence with how often the two of you usually talk, so a quiet month means something for a close friend and nothing for an old classmate.</p><p>The agent asks for consent before any model call, and text other people wrote can\'t give it orders.</p>' },
      { label: 'The proof', title: 'Tested on people it never saw.', art: 'proof',
        body: '<p>The model was scored on people held out of training entirely, and its risk scores are tuned so a 70% risk means about 70%. Drafts are judged by how many actually get sent.</p><p>These numbers are measured inside the private project. Demo on request.</p>' },
    ],
  },
  knowledge: {
    bullet: '2', color: '#2f6b45', name: 'KNOWLEDGE ASSISTANT', sub: 'CITE OR ABSTAIN', next: 'rekindle',
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'pgvector', 'React', 'Claude'], code: 'https://github.com/marinasofia/knowledge-assistant',
    proof: [['10 / 10', 'unanswerable questions refused'], ['25 / 25', 'answerable questions answered'], ['64 ms', 'median answer under load']],
    stops: [
      { label: 'The idea', title: 'It shows the source, or says it doesn\'t know.', art: 'source',
        body: '<p>A workspace where a team asks questions about its own policies and gets back the exact approved passage that answers them. When two policies disagree it shows both, and when nothing covers the question it refuses instead of guessing.</p>' },
      { label: 'How it decides', title: 'Quote it, flag it, or refuse.', art: 'qa',
        body: '<p>Search finds the passages first. If they don\'t cover the question, it refuses. If two policies give different answers, it shows both until an admin decides which one wins. With Claude turned on, every claim has to cite an exact quote.</p><p>Hybrid semantic search scored a little higher, but a significance test showed the gap was noise, so the simpler keyword search stays the default.</p>' },
      { label: 'The proof', title: 'Tested like a product.', art: 'proof',
        body: '<p>60 labelled questions with a held out set, and the refuse threshold picked from a measured curve. Every workspace is locked twice, in the app and in the database itself. 85 backend tests, 8 browser tests, prompt injection tests and a written threat model run in CI.</p>' },
    ],
  },
};

/* ================= UI shell: sheet, platform, terminal ================= */
const sheet = $('#sheet'), sheetBody = $('#sheetBody'), term = $('#term'), placard = $('#placard');
const veil = $('#veil'), tip = $('#tip');
let open = null, lastFocus = null, busy = false;
let scene3d = null; // set once the scene exists

function render(id) {
  if (KIND[id] === 'sheet') {
    sheetBody.innerHTML = HTML[id]; sheetBody.scrollTop = 0;
    const dl = $('#dateline', sheetBody); if (dl) dl.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  }
}
function show(id) {
  const k = KIND[id];
  render(id);
  if (k === 'sheet') { sheet.classList.add('on'); $('.close', sheet).focus({ preventScroll: true }); stagger(sheetBody.children); }
  if (k === 'term') openTerm();
}
function hide(id) {
  const k = KIND[id];
  if (k === 'sheet') sheet.classList.remove('on');
  if (k === 'term') closeTerm();
}

/* ---------- the placard you read while standing on a platform ---------- */
function setStop(id, i) {
  const line = LINES[id], st = line.stops[i], last = i === line.stops.length - 1;
  const b = $('#plBullet'); b.textContent = line.bullet; b.style.background = line.color;
  $('#plStation').textContent = line.name;
  $('#plDots').innerHTML = line.stops.map((_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('');
  $('#plLabel').textContent = st.label; $('#plTitle').textContent = st.title; $('#plBody').innerHTML = st.body;
  // the last panel says what it's built with, as line bullets, and where to read the code
  const built = $('#plBuilt');
  built.hidden = !last;
  if (last) built.innerHTML = `<p class="pl-label">Built with</p><ul>${line.stack.map((t) => `<li style="--c:${line.color}">${t}</li>`).join('')}</ul>${line.code ? `<a href="${line.code}" target="_blank" rel="noopener">Read the code on GitHub ↗</a>` : ''}${line.private ? `<p class="pl-private">${line.private}, demo on request.</p>` : ''}`;
  $('#plPrev').disabled = i === 0;
  const nx = $('#plNext');
  if (last) { const n = LINES[line.next]; nx.textContent = `Next, ${n.name.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())} →`; nx.dataset.go = line.next; }
  else { nx.textContent = 'Next →'; delete nx.dataset.go; }
  if (G && !reduce) G.fromTo('#placard .pl-text > *', { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: .45, stagger: .05, ease: 'power2.out' });
}
function showPlacard(on) { placard.hidden = !on; document.body.classList.toggle('on-platform', on); if (on) { foldPlacard(matchMedia('(max-width:820px)').matches); $('#plNext').focus({ preventScroll: true }); } }
// on a phone the notes fold away so the poster shows whole; the header opens them
function foldPlacard(on) { placard.classList.toggle('folded', on); const f = $('#plFold'); f.setAttribute('aria-expanded', String(!on)); f.textContent = on ? 'Notes ▴' : 'Fold ▾'; }
$('#plFold').addEventListener('click', () => foldPlacard(!placard.classList.contains('folded')));
$('#plPrev').addEventListener('click', () => scene3d && scene3d.step(-1));
$('#plNext').addEventListener('click', (e) => { if (!e.currentTarget.dataset.go && scene3d) { e.stopPropagation(); scene3d.step(1); } });
function stagger(els) {
  if (reduce || !G) return;
  G.fromTo(els, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .7, stagger: .045, ease: 'power3.out', delay: .15 });
}
function fade(swap) {
  if (reduce || !G) { swap(); return; }
  veil.classList.add('on');
  G.timeline({ onComplete: () => veil.classList.remove('on') })
    .fromTo(veil, { opacity: 0 }, { opacity: 1, duration: .28, ease: 'power1.out' })
    .add(swap)
    .to(veil, { opacity: 0, duration: .45, ease: 'power1.inOut' }, '+=.05');
}
function setChrome(id) {
  document.body.classList.toggle('in-page', !!id);
  document.title = id ? `${LABEL[id][0].replace(/^\d+ /, '')} · Marina Martin` : 'Marina Martin · Data & AI';
  document.querySelectorAll('.nav [data-go]').forEach((b) => b.setAttribute('aria-current', b.dataset.go === id ? 'true' : 'false'));
}

function navigate(to, { push = true } = {}) {
  to = to || null;
  if (to && !KIND[to]) return;
  if (busy || to === open) return;
  const from = open;
  if (!from) lastFocus = document.activeElement;
  open = to;
  if (push) history.pushState({ id: to }, '', to ? '#/' + to : location.pathname + location.search);
  setChrome(to);
  hideTip();
  const plat = (id) => id && KIND[id] === 'platform';
  if (plat(to) && plat(from)) { scene3d.switchLine(to); return; }
  if (plat(to)) {
    if (from) hide(from);
    if (!scene3d) return;
    busy = true; showPlacard(false);
    scene3d.enterPlatform(to, () => { busy = false; showPlacard(true); });
    return;
  }
  if (plat(from)) {
    busy = true; showPlacard(false);
    document.body.classList.add('in-page');
    scene3d.leavePlatform(() => { busy = false; setChrome(open); if (to) { scene3d.focus(to); setTimeout(() => open === to && show(to), 380); } else restoreFocus(); });
    return;
  }
  // the camera travels to the object first, then the sheet slides in
  if (scene3d) scene3d.focus(to);
  if (from) hide(from);
  if (to) setTimeout(() => open === to && show(to), from ? 120 : (reduce ? 0 : 380));
  else restoreFocus();
}
function restoreFocus() { lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true }); }
const hashId = () => { const h = location.hash.replace(/^#\/?/, ''); return KIND[h] ? h : null; };
addEventListener('popstate', () => navigate(hashId(), { push: false }));
document.addEventListener('click', (e) => {
  const c = e.target.closest('[data-close]'); if (c) { navigate(null); return; }
  const b = e.target.closest('[data-go]'); if (!b) return;
  e.preventDefault(); navigate(b.dataset.go || null);
});
const KEYS = { a: 'about', w: 'work', t: 'terminal', c: 'contact', 1: 'sourcer', 2: 'knowledge', 3: 'rekindle' };
addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && open) { e.preventDefault(); navigate(null); return; }
  if (e.altKey || e.metaKey || e.ctrlKey) return;
  if (/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement && document.activeElement.tagName)) return;
  if (open && KIND[open] === 'platform' && scene3d) {
    const k = e.key.toLowerCase();
    if (k === 'arrowright' || k === 'd') { e.preventDefault(); scene3d.step(1); return; }
    if (k === 'arrowleft' || k === 'a') { e.preventDefault(); scene3d.step(-1); return; }
  }
  const id = KEYS[e.key.toLowerCase()];
  // from the car any key works; on a platform the number keys walk to another project
  if (id && (!open || (KIND[open] === 'platform' && KIND[id] === 'platform'))) { e.preventDefault(); navigate(id); }
  if (e.key.toLowerCase() === 'l' && !open) location.href = 'lofi.html';
});
// keep focus inside an open dialog
addEventListener('keydown', (e) => {
  if (e.key !== 'Tab' || !open) return;
  const box = { sheet, term, platform: placard }[KIND[open]]; if (!box) return;
  const f = [...box.querySelectorAll('button, a[href], input')].filter((x) => !x.disabled && x.offsetParent !== null);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});

// on a touch screen there is nothing to hover, so a one time hint says what to tap; it goes on the first tap
const touchHint = $('#touchHint');
if (touchHint && matchMedia('(hover: none)').matches) {
  let seen = false; try { seen = localStorage.getItem('mm-touch-hint') === '1'; } catch (e) { seen = false; }
  if (!seen) {
    touchHint.hidden = false;
    $('#gl').addEventListener('pointerdown', () => { touchHint.hidden = true; try { localStorage.setItem('mm-touch-hint', '1'); } catch (e) { /* storage blocked: the hint shows again next visit */ } }, { once: true });
  }
}
function showTip(id, x, y) { tip.innerHTML = `${LABEL[id][0]}<em>${LABEL[id][1]}</em>`; tip.style.left = x + 'px'; tip.style.top = y + 'px'; tip.classList.add('on'); }
function hideTip() { tip.classList.remove('on'); }

/* ================= terminal ================= */
const out = $('#termOut'), tin = $('#termIn'), tform = $('#termForm');
const hist = []; let hIdx = 0, termBooted = false;
const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
function print(html, cls = '') { const d = document.createElement('div'); if (cls) d.className = cls; d.innerHTML = html; out.append(d); out.scrollTop = out.scrollHeight; }
const goBtn = (id, label) => `<button type="button" data-go="${id}">${label}</button>`;
const CMDS = {
  help: () => print(`<span class="a">Commands</span>
  <span class="p">whoami</span>             who I am, in two lines
  <span class="p">ls</span>                 what's on this machine
  <span class="p">projects</span>           the three projects
  <span class="p">open</span> <span class="d">name</span>          open sourcer, knowledge, rekindle, work, about or contact
  <span class="p">ask</span> <span class="d">question</span>     ask the knowledge assistant a sample question
  <span class="p">work</span>               experience, in order
  <span class="p">contact</span>            how to reach me
  <span class="p">clear</span>              clear the screen
  <span class="p">exit</span>               back to the train`),
  whoami: () => print(`Marina Martin. Data analytics and applied AI, New York.
BBA in Computer Information Systems, minor in Computer Science, graduating 2027.`),
  ls: (a) => a[0] && a[0].startsWith('proj') ? CMDS.projects() : print(`about.txt   work.txt   contact.txt   <span class="a">projects/</span>`),
  projects: () => print(`<span class="a">sourcer/</span>     lead engine, 405 career sites read every morning   ${goBtn('sourcer', 'open')}
<span class="a">knowledge/</span>   policy answers that cite the passage, or refuse   ${goBtn('knowledge', 'open')}
<span class="a">rekindle/</span>    iMessage agent, 0.906 ROC AUC decay model, private project   ${goBtn('rekindle', 'open')}`),
  work: () => print(`2026  Data Analytics Resident, NYC Tech Talent Pipeline
2026  Data &amp; AI Analyst, GHA (M&amp;A advisory)
2024  Data Analytics Intern, Columbia University Irving Medical Center
<span class="d">${goBtn('work', 'open the notepad')} for details</span>`),
  contact: () => print(`linkedin  <a href="${LINKEDIN}" target="_blank" rel="noopener">marinasofiaml</a>
github    <a href="${GITHUB}" target="_blank" rel="noopener">marinasofia</a>`),
  cat: (a) => {
    const f = (a[0] || '').replace(/\.txt$/, '');
    if (f === 'about') return print(`I like questions with a number at the end, and I trust the number only after I've tried to break it.
Rules go first and the model goes last.`);
    if (f === 'work') return CMDS.work();
    if (f === 'contact') return CMDS.contact();
    if (f === 'resume.pdf' || f === 'resume') return CMDS.resume();
    print(`cat: ${esc(a[0] || '')}: No such file. Try <span class="p">ls</span>.`, 'e');
  },
  resume: () => print(`No resume here. Message me on <a href="${LINKEDIN}" target="_blank" rel="noopener">LinkedIn</a>.`),
  open: (a) => {
    const n = (a[0] || '').toLowerCase().replace(/\/$/, '').replace(/^knowledge.*/, 'knowledge');
    if (!KIND[n] || n === 'terminal') return print(`open: ${esc(a[0] || '')}: unknown. Try sourcer, knowledge, rekindle, work, about or contact.`, 'e');
    print(`<span class="d">opening ${n}</span>`); setTimeout(() => navigate(n), 350);
  },
  ask: async (a) => {
    const q = a.join(' ').replace(/["?]/g, '').toLowerCase();
    if (!q) return print('ask: try <span class="p">ask how much parental leave do we get</span>', 'e');
    const pause = () => new Promise((r) => setTimeout(r, reduce ? 0 : 380));
    print('searching 6 approved policies', 'd'); await pause();
    if (/remote|home/.test(q)) { print('found Remote work policy, section 2', 'd'); await pause(); print('"Two days a week, with manager approval."', 'p'); }
    else if (/meal|food|travel/.test(q)) { print('found two passages that disagree', 'd'); await pause(); print('$75 in Travel policy, $90 in Expenses policy', 'a'); print('conflict flagged for an admin to settle', 'a'); }
    else { print('no passage covers the question', 'd'); await pause(); print('refused: no approved document says this, so it won\'t guess', 'e'); }
    print(`<span class="d">${goBtn('knowledge', 'open the project')}</span>`);
  },
  clear: () => { out.innerHTML = ''; },
  exit: () => navigate(null),
  stops: () => CMDS.work(),
  sudo: () => print(`Permission denied. LinkedIn works better: <a href="${LINKEDIN}" target="_blank" rel="noopener">marinasofiaml</a>`, 'e'),
};
CMDS.sourcer = () => CMDS.open(['sourcer']); CMDS.rekindle = () => CMDS.open(['rekindle']); CMDS.knowledge = () => CMDS.open(['knowledge']);
CMDS.about = () => CMDS.open(['about']); CMDS.pwd = () => print('~'); CMDS['?'] = CMDS.help;
CMDS.cd = (a) => { const n = (a[0] || '').replace(/^\.\//, ''); if (!n || n === '~' || n === '..') return print('~'); CMDS.open([n]); };
CMDS.man = CMDS.help; CMDS.ls = ((ls) => (a) => (a[0] && /^(sourcer|rekindle|knowledge)/.test(a[0]) ? CMDS.open(a) : ls(a)))(CMDS.ls);
// forgive the way people actually type: "sourcer/", "./rekindle", "Knowledge Assistant", "cd sourcer"
const ALIAS = { 'knowledge-assistant': 'knowledge', knowledgeassistant: 'knowledge', assistant: 'knowledge', rag: 'knowledge', resume: 'resume', 'resume.pdf': 'resume', projects: 'projects', 'projects/': 'projects' };
function normalize(word) { const w = word.toLowerCase().replace(/^\.\//, '').replace(/\/+$/, '').replace(/\.txt$/, ''); return ALIAS[w] || w; }
tform.addEventListener('submit', (e) => {
  e.preventDefault();
  const raw = tin.value.trim(); tin.value = '';
  print(`<span class="p">~ %</span> ${esc(raw)}`);
  if (!raw) return;
  hist.push(raw); hIdx = hist.length;
  const words = raw.split(/\s+/);
  let [c, ...a] = words;
  if (/^knowledge assistant$/i.test(raw)) { c = 'knowledge'; a = []; }
  const name = normalize(c);
  const fn = CMDS[name] || (['work', 'about', 'contact'].includes(name) ? CMDS[name] : null);
  if (fn) { fn(a); return; }
  // close to a command? suggest it instead of a dead end
  const near = Object.keys(CMDS).find((k) => k.length > 2 && (k.startsWith(name.slice(0, 3)) || name.startsWith(k)));
  print(`zsh: command not found: ${esc(c)}.${near ? ` Did you mean <button type="button" data-cmd="${near}">${near}</button>?` : ''} Type <span class="p">help</span> for the list.`, 'e');
});
out.addEventListener('click', (e) => { const b = e.target.closest('[data-cmd]'); if (!b) return; tin.value = b.dataset.cmd; tform.requestSubmit(); });
tin.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' && hist.length) { hIdx = Math.max(0, hIdx - 1); tin.value = hist[hIdx]; e.preventDefault(); }
  if (e.key === 'ArrowDown' && hist.length) { hIdx = Math.min(hist.length, hIdx + 1); tin.value = hist[hIdx] || ''; e.preventDefault(); }
});
// keep the terminal inside the part of the screen the phone keyboard leaves visible
const vv = window.visualViewport;
if (vv) {
  const fitTerm = () => {
    const r = document.documentElement.style; r.setProperty('--vvh', vv.height + 'px'); r.setProperty('--vvt', vv.offsetTop + 'px');
    const kb = vv.height < innerHeight * .8; term.classList.toggle('kb', kb);
    if (!kb && scrollY) scrollTo(0, 0); // the keyboard closed: undo the scroll the phone made for it
  };
  vv.addEventListener('resize', fitTerm); vv.addEventListener('scroll', fitTerm); fitTerm();
}
function openTerm() {
  term.classList.add('on');
  if (!termBooted) {
    termBooted = true;
    print(`<span class="d">Last login ${new Date().toDateString()} on the MM line</span>`);
    print(`Hi, I'm Marina. Type <span class="p">help</span> to look around, or try <span class="p">ask how much parental leave do we get</span>.`);
  }
  setTimeout(() => tin.focus({ preventScroll: true }), 80);
}
function closeTerm() { term.classList.remove('on'); }

/* ================= shared three helpers ================= */
const rand = (() => { let s = 7; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
let ANISO = 4;
function canvasTex(w, h, draw, { srgb = true } = {}) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); draw(x, w, h);
  const t = new THREE.CanvasTexture(c); if (srgb) t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = ANISO;
  t.userData.redraw = () => { x.clearRect(0, 0, w, h); draw(x, w, h); t.needsUpdate = true; }; t.userData.ctx = x; return t;
}
function roundedShape(w, h, r) {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s;
}
// a rounded plate in the XY plane, depth along +Z, UVs mapped across the face
function plate(w, h, r, depth, { bevel = 0.004 } = {}) {
  const g = new THREE.ExtrudeGeometry(roundedShape(w, h, r), { depth, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 3, curveSegments: 16 });
  const p = g.attributes.position, uv = g.attributes.uv;
  for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) + w / 2) / w, (p.getY(i) + h / 2) / h);
  g.computeVertexNormals(); return g;
}
// the same plate lying flat: face up, top edge pointing away from the viewer
function slab(w, d, r, t, opts) { const g = plate(w, d, r, t, opts); g.rotateX(-Math.PI / 2); return g; }
function wrapText(x, text, maxW) { const w = text.split(' '); const lines = []; let cur = ''; for (const word of w) { const t = cur ? cur + ' ' + word : word; if (x.measureText(t).width > maxW && cur) { lines.push(cur); cur = word; } else cur = t; } lines.push(cur); return lines; }
function mk(geo, mat) { const m = new THREE.Mesh(geo, mat); m.castShadow = true; m.receiveShadow = true; return m; }

/* ================= the scene ================= */
const canvas = $('#gl');
const loader = $('#loader'), ldBar = $('#ldBar'), ldPct = $('#ldPct'), ldMsg = $('#ldMsg');
const progress = (p, msg) => { ldBar.style.setProperty('--p', p); ldPct.textContent = Math.round(p * 100) + '%'; if (msg) ldMsg.textContent = msg; };
const nextFrame = () => new Promise((r) => requestAnimationFrame(() => r()));

function buildScene() {
  ANISO = renderer.capabilities.getMaxAnisotropy();
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#020306');
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  const camera = new THREE.PerspectiveCamera(54, 1, 0.05, 40);

  /* ---------- the car: an old stainless steel train, seen from the opposite bench ---------- */
  const WZ = -1.25, CEIL = 2.36, CAR_ZC = .25; // CAR_ZC: the car's centre line, halfway between its two sides
  const env = (m, k = .35) => { m.envMapIntensity = k; return m; };
  const brushed = canvasTex(512, 512, (x, w, h) => { x.fillStyle = '#808080'; x.fillRect(0, 0, w, h); for (let i = 0; i < 1600; i++) { const v = rand() > .5 ? 255 : 0; x.fillStyle = `rgba(${v},${v},${v},.06)`; x.fillRect(0, rand() * h, w, 1); } }, { srgb: false });
  brushed.wrapS = brushed.wrapT = THREE.RepeatWrapping; brushed.repeat.set(2, 6);
  const steel = env(new THREE.MeshPhysicalMaterial({ color: '#676b71', metalness: .6, roughness: .38, roughnessMap: brushed }), 1.6);
  const cream = env(new THREE.MeshPhysicalMaterial({ color: '#a8987a', roughness: .5, clearcoat: .3 }), .3);
  const ceilMat = env(new THREE.MeshStandardMaterial({ color: '#e9e6df', roughness: .7 }), .2);
  const poleMat = env(new THREE.MeshPhysicalMaterial({ color: '#eceef1', metalness: 1, roughness: .1 }), 1);
  const rubber = env(new THREE.MeshStandardMaterial({ color: '#141518', roughness: .75 }), .2);
  const floorTex = canvasTex(1024, 1024, (x, w, h) => { x.fillStyle = '#3d4047'; x.fillRect(0, 0, w, h); for (let i = 0; i < 9000; i++) { const c = rand(); x.fillStyle = c > .66 ? 'rgba(255,255,255,.16)' : c > .33 ? 'rgba(0,0,0,.25)' : 'rgba(170,130,90,.14)'; x.fillRect(rand() * w, rand() * h, 2 + rand() * 3, 2 + rand() * 3); } });
  floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping; floorTex.repeat.set(4, 2);
  const floorMat = env(new THREE.MeshStandardMaterial({ map: floorTex, roughness: .65 }), .2);
  const box = (w, h, d, mat, x, y, z) => { const m = mk(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); scene.add(m); return m; };

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(9, 3.2), floorMat); floor.rotation.x = -Math.PI / 2; floor.position.set(0, 0, .3); floor.receiveShadow = true; scene.add(floor);
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(9, 2.6), ceilMat); ceil.rotation.x = Math.PI / 2; ceil.position.set(0, CEIL, .45); scene.add(ceil);
  const COVE = { y0: 2.0, z0: WZ, y1: CEIL, z1: -.86 };
  const coveLen = Math.hypot(COVE.y1 - COVE.y0, COVE.z1 - COVE.z0), coveTilt = Math.atan2(COVE.z1 - COVE.z0, COVE.y1 - COVE.y0);
  const nearStart = scene.children.length; // from here to the rail is one side of the car
  const cove = new THREE.Mesh(new THREE.PlaneGeometry(9, coveLen), ceilMat); cove.position.set(0, (COVE.y0 + COVE.y1) / 2, (COVE.z0 + COVE.z1) / 2); cove.rotation.x = coveTilt; cove.receiveShadow = true; scene.add(cove);
  const tubeMat = new THREE.MeshBasicMaterial({ color: '#f4f8ff', toneMapped: false });
  [-.55, .7].forEach((z) => { const t = new THREE.Mesh(new THREE.BoxGeometry(9, .012, .1), tubeMat); t.position.set(0, CEIL - .006, z); scene.add(t); });

  // the wall in segments: doors, windows in cream surrounds, steel panels
  const doors = [];
  const SEG = [[-3.2, -2.9, 'wall'], [-2.9, -2.3, 'win'], [-2.3, -1.95, 'wall'], [-1.95, -1.25, 'door'], [-1.25, -.98, 'wall'], [-.98, -.06, 'win'], [-.06, .06, 'wall'], [.06, .98, 'win'], [.98, 1.25, 'wall'], [1.25, 1.95, 'door'], [1.95, 2.3, 'wall'], [2.3, 2.9, 'win'], [2.9, 3.2, 'wall']];
  const WIN = { y0: 1.0, y1: 1.66, r: .09 };
  const darkGlass = new THREE.MeshPhysicalMaterial({ color: '#0b0f16', roughness: .05, transparent: true, opacity: .14, envMapIntensity: 1.2, depthWrite: false });
  const ring = (w, h, r, t, depth) => { const s = roundedShape(w, h, r); const hole = roundedShape(w - t * 2, h - t * 2, Math.max(.01, r - t)); s.holes.push(hole); const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false, curveSegments: 20 }); g.computeVertexNormals(); return g; };
  SEG.forEach(([a, b, k]) => {
    const w = b - a, cx = (a + b) / 2;
    if (k === 'wall') box(w, 2.0, .05, steel, cx, 1.0, WZ - .025);
    if (k === 'win') {
      const ww = w, wh = WIN.y1 - WIN.y0;
      box(w, WIN.y0 - .1, .05, steel, cx, (WIN.y0 - .1) / 2, WZ - .025);
      box(w, 2.0 - WIN.y1 - .1, .05, steel, cx, (WIN.y1 + .1 + 2.0) / 2, WZ - .025);
      // cream surround, recessed like the old cars
      const sur = mk(ring(ww, wh + .2, .02, .1, .05), cream); sur.position.set(cx, (WIN.y0 + WIN.y1) / 2, WZ - .05); scene.add(sur);
      const gas = mk(ring(ww - .14, wh - .02, WIN.r, .022, .03), rubber); gas.position.set(cx, (WIN.y0 + WIN.y1) / 2, WZ - .024); scene.add(gas);
      const bar = box(ww - .16, .018, .02, rubber, cx, WIN.y0 + wh * .72, WZ - .03);
      const g = new THREE.Mesh(new THREE.ShapeGeometry(roundedShape(ww - .16, wh - .05, WIN.r - .02), 20), darkGlass); g.position.set(cx, (WIN.y0 + WIN.y1) / 2, WZ - .035); g.renderOrder = 2; scene.add(g);
    }
    if (k === 'door') {
      box(w, .05, .05, steel, cx, 1.975, WZ - .025);
      const leaves = {};
      [-1, 1].forEach((s) => {
        const lx = cx + s * w / 4, lw = w / 2 - .006;
        // each leaf is its own group so the doors can slide open onto a platform
        const leaf = new THREE.Group(); scene.add(leaf);
        const part = (pw, ph, px, py) => { const m = mk(new THREE.BoxGeometry(pw, ph, .045), steel); m.position.set(px, py, WZ - .02); leaf.add(m); };
        part(lw, 1.0, lx, .5); part(lw, 1.95 - 1.74, lx, (1.74 + 1.95) / 2);
        part(.07, .74, lx - s * (lw / 2 - .035), 1.37); part(.07, .74, lx + s * (lw / 2 - .035), 1.37);
        const gas = mk(ring(lw - .12, .76, .06, .016, .02), rubber); gas.position.set(lx, 1.37, WZ - .0); leaf.add(gas);
        const g = new THREE.Mesh(new THREE.ShapeGeometry(roundedShape(lw - .15, .73, .05), 16), darkGlass); g.position.set(lx, 1.37, WZ - .01); g.renderOrder = 2; leaf.add(g);
        const seal = mk(new THREE.BoxGeometry(.012, 1.95, .05), rubber); seal.position.set(cx + s * .006, .975, WZ - .005); leaf.add(seal);
        doors.push({ leaf, s });
        leaves[s] = leaf;
      });
      const st = canvasTex(512, 120, (x, W, H) => { x.fillStyle = '#16181c'; x.fillRect(0, 0, W, H); x.fillStyle = '#f2f2ee'; x.font = '600 52px Geist, Arial'; x.textAlign = 'center'; x.fillText('lean on door', W / 2, 78); });
      const sticker = new THREE.Mesh(new THREE.PlaneGeometry(.17, .04), new THREE.MeshStandardMaterial({ map: st, roughness: .5 })); sticker.position.set(cx - w / 4 + .02, .9, WZ + .004); leaves[-1].add(sticker);
      const bulletTex = canvasTex(128, 128, (x, W) => { x.fillStyle = '#ffcf99'; x.beginPath(); x.arc(64, 64, 60, 0, 7); x.fill(); x.fillStyle = INK; x.font = '700 76px Geist, Arial'; x.textAlign = 'center'; x.fillText('M', 64, 92); });
      const bullet = new THREE.Mesh(new THREE.CircleGeometry(.03, 32), new THREE.MeshStandardMaterial({ map: bulletTex, roughness: .4 })); bullet.position.set(cx + w / 4, 1.84, WZ + .004); leaves[1].add(bullet); // both ride on their door leaf
    }
  });
  // car number, a small detail of the old fleet
  const numTex = canvasTex(256, 96, (x, W, H) => { x.fillStyle = '#16181c'; x.fillRect(0, 0, W, H); x.fillStyle = '#f2f2ee'; x.font = '600 62px Geist, Arial'; x.textAlign = 'center'; x.fillText('8341', W / 2, 70); });
  const carNo = new THREE.Mesh(new THREE.PlaneGeometry(.1, .0375), new THREE.MeshStandardMaterial({ map: numTex, roughness: .5 })); carNo.position.set(-1.115, 1.88, WZ + .004); scene.add(carNo);

  // orange and red fiberglass bucket seats on a cream base
  const seatCols = ['#e68a2e', '#e68a2e', '#d64a32', '#d64a32', '#e68a2e', '#e68a2e'];
  for (let i = 0; i < 6; i++) {
    const sx = -.95 + .158 + i * .317;
    const sm = env(new THREE.MeshPhysicalMaterial({ color: seatCols[i], roughness: .22, clearcoat: 1, clearcoatRoughness: .08 }), .7);
    const cushion = mk(plate(.3, .42, .06, .03, { bevel: .012 }), sm); cushion.rotation.x = -Math.PI / 2 + .07; cushion.position.set(sx, .45, WZ + .48); scene.add(cushion);
    const back = mk(plate(.3, .46, .06, .03, { bevel: .012 }), sm); back.rotation.x = -.13; back.position.set(sx, .52, WZ + .07); scene.add(back);
  }
  box(1.92, .06, .5, cream, 0, .42, WZ + .27);
  const grille = canvasTex(512, 128, (x, W, H) => { x.fillStyle = '#1b1c1f'; x.fillRect(0, 0, W, H); x.fillStyle = '#0a0a0b'; for (let r = 0; r < 8; r++) for (let c = 0; c < 64; c++) x.fillRect(c * 8 + (r % 2) * 4, r * 16 + 4, 5, 8); });
  grille.wrapS = THREE.RepeatWrapping; grille.repeat.set(4, 1);
  box(1.92, .38, .02, env(new THREE.MeshStandardMaterial({ map: grille, roughness: .6, metalness: .4 }), .3), 0, .2, WZ + .5);
  // poles and rail
  const pole = (x, z) => { const p = mk(new THREE.CylinderGeometry(.019, .019, CEIL, 24), poleMat); p.position.set(x, CEIL / 2, z); scene.add(p); return p; };
  pole(-1.1, WZ + .55); pole(1.1, WZ + .55);
  const rail = mk(new THREE.CylinderGeometry(.016, .016, 2.2, 24), poleMat); rail.rotation.z = Math.PI / 2; rail.position.set(0, 1.86, WZ + .55); scene.add(rail);
  // the other side of the car is the same side turned around, so the cabin is whole when you walk through it
  const farSide = new THREE.Group(); farSide.rotation.y = Math.PI; farSide.position.z = 2 * CAR_ZC;
  scene.children.slice(nearStart).forEach((o) => farSide.add(o.clone()));
  scene.add(farSide);
  // the room light that makes the near wall's steel glow comes from behind you; walls facing other ways get a less mirror-like finish so they read the same grey
  const steelSide = steel.clone(); steelSide.metalness = .25; steelSide.roughness = .5;
  farSide.traverse((o) => { if (o.material === steel) o.material = steelSide; });
  // end bulkheads, each with a storm door through to the next car
  const stormGlass = new THREE.MeshPhysicalMaterial({ color: '#0b0f16', roughness: .05, transparent: true, opacity: .55, depthWrite: false });
  [-1, 1].forEach((e) => {
    const ex = e * 3.27;
    box(.05, CEIL, 3.05, steelSide, ex, CEIL / 2, CAR_ZC);
    const door = box(.02, 1.95, .7, env(new THREE.MeshPhysicalMaterial({ color: '#676b71', metalness: .6, roughness: .35 }), 1.4), ex - e * .03, .975, CAR_ZC);
    const g = new THREE.Mesh(new THREE.PlaneGeometry(.4, .7), stormGlass); g.position.set(ex - e * .042, 1.35, CAR_ZC); g.rotation.y = -e * Math.PI / 2; scene.add(g);
    const gr = mk(ring(.46, .76, .05, .03, .015), rubber); gr.position.set(ex - e * .041, 1.35, CAR_ZC); gr.rotation.y = -e * Math.PI / 2; scene.add(gr);
    door.userData.end = true;
  });

  /* ---------- outside: the tunnel, and stations with mosaic signs ---------- */
  const tunnelTex = canvasTex(2048, 512, (x, w, h) => {
    x.fillStyle = '#1b2029'; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 40; i++) { x.fillStyle = `rgba(255,255,255,${.01 + rand() * .025})`; x.fillRect(rand() * w, 0, 30 + rand() * 120, h); }
    [[150, 7, '#252b35'], [190, 4, '#2d333d'], [330, 10, '#171b22'], [372, 3, '#323843']].forEach(([y, t, c]) => { x.fillStyle = c; x.fillRect(0, y, w, t); });
    for (let px = 0; px < w; px += 256) { x.fillStyle = '#12161c'; x.fillRect(px, 0, 22, h); }
    x.fillStyle = '#8a6a2a'; x.font = '700 40px Geist, Arial'; x.fillText('23', 600, 260);
  });
  tunnelTex.wrapS = THREE.RepeatWrapping; tunnelTex.repeat.set(2.2, 1);
  const tunnel = new THREE.Mesh(new THREE.PlaneGeometry(9, 2.4), new THREE.MeshBasicMaterial({ map: tunnelTex })); tunnel.position.set(0, 1.2, -2.15); scene.add(tunnel);
  const runLights = [];
  const lightGeo = new THREE.BoxGeometry(.55, .03, .02);
  for (let i = 0; i < 7; i++) { const m = new THREE.Mesh(lightGeo, new THREE.MeshBasicMaterial({ color: i % 2 ? '#cfe0ff' : '#ffcf8a', toneMapped: false })); m.position.set(-5 + i * 1.55, 1.3 + (i % 3) * .14, -2.12); scene.add(m); runLights.push(m); }

  // a station wall: white tile, a mosaic name tablet, and the stops cycle as the train runs
  const STATIONS = [
    ['MARINA', 'MARTIN', 'DATA  AND  AI', '#1f3a68', '#c9a24a'],
    ['UNION SQ.', 'UNION SQ.', 'CONNECTIONS', '#6e2a1f', '#c9a24a'],
    ['WALL ST.', 'WALL ST.', 'FINANCIAL DISTRICT', '#24452f', '#d9c48a'],
  ];
  let stationIdx = 0;
  const SW = 6; // station wall width in scene units, the tablets line up with the two windows
  const stationTex = canvasTex(4096, 1640, (x, w, h) => {
    const [left, right, sub, field, border] = STATIONS[stationIdx];
    const px = w / SW; // pixels per scene unit
    x.fillStyle = '#e9e5da'; x.fillRect(0, 0, w, h);
    for (let ty = 0; ty < h; ty += 46) for (let tx = 0; tx < w; tx += 92) { x.fillStyle = `rgba(255,255,255,${.25 + rand() * .3})`; x.fillRect(tx + 3, ty + 3, 86, 40); }
    x.fillStyle = 'rgba(80,72,60,.25)'; for (let ty = 0; ty < h; ty += 46) { x.fillRect(0, ty, w, 3); for (let tx = (ty / 46 % 2) * 46; tx < w; tx += 92) x.fillRect(tx, ty, 3, 46); }
    [[-.68, left], [.68, right]].forEach(([sx, name]) => {
      const cx = (sx + SW / 2) * px, tw = .82 * px, th = .3 * px, x0 = cx - tw / 2, y0 = h * .5 - th / 2 + .2 * px;
      x.fillStyle = border; x.fillRect(x0 - 22, y0 - 22, tw + 44, th + 44);
      x.fillStyle = '#efe9d8'; x.fillRect(x0 - 9, y0 - 9, tw + 18, th + 18);
      x.fillStyle = field; x.fillRect(x0, y0, tw, th);
      for (let i = 0; i < 2600; i++) { x.fillStyle = `rgba(${rand() > .5 ? 255 : 0},${rand() > .5 ? 255 : 0},${rand() > .5 ? 255 : 0},.07)`; x.fillRect(x0 + rand() * tw, y0 + rand() * th, 9, 9); }
      x.fillStyle = '#efe6cf'; x.textAlign = 'center';
      let fs = 150; x.font = `400 ${fs}px Newsreader, Georgia`; while (x.measureText(name).width > tw - 60 && fs > 60) { fs -= 6; x.font = `400 ${fs}px Newsreader, Georgia`; }
      x.fillText(name, cx, y0 + th * .58);
      x.font = '500 30px "Geist Mono", monospace'; x.fillText(sub, cx, y0 + th * .86);
      x.strokeStyle = 'rgba(0,0,0,.16)'; x.lineWidth = 1.5;
      for (let gx = x0; gx < x0 + tw; gx += 10) { x.beginPath(); x.moveTo(gx, y0); x.lineTo(gx, y0 + th); x.stroke(); }
      for (let gy = y0; gy < y0 + th; gy += 10) { x.beginPath(); x.moveTo(x0, gy); x.lineTo(x0 + tw, gy); x.stroke(); }
    });
    x.textAlign = 'left';
  });
  const station = new THREE.Mesh(new THREE.PlaneGeometry(SW, 2.4), new THREE.MeshBasicMaterial({ map: stationTex })); station.position.set(0, 1.33, -2.1); scene.add(station);
  const stationLight = new THREE.PointLight('#fff4e0', 0, 4, 1.4); stationLight.position.set(0, 1.4, -1.6); scene.add(stationLight);
  const sweep = new THREE.PointLight('#ffcf8a', 0, 3.5, 1.6); sweep.position.set(0, 1.4, -1.7); scene.add(sweep);
  const train = { v: 0 };

  /* ---------- light inside the car ---------- */
  const hemi = new THREE.HemisphereLight('#eef3ff', '#3a3530', .9); scene.add(hemi);
  const key = new THREE.DirectionalLight('#f4f8ff', 1.4); key.position.set(.6, 3.4, 1.4); key.target.position.set(0, .8, WZ);
  key.castShadow = true; key.shadow.mapSize.set(2048, 2048); Object.assign(key.shadow.camera, { left: -3, right: 3, top: 3, bottom: -1, near: .5, far: 8 }); key.shadow.normalBias = .02; key.shadow.radius = 5;
  scene.add(key, key.target);
  // the same light falling on the other side of the car, which you face when you walk back in
  const key2 = new THREE.DirectionalLight('#f4f8ff', 1.4); key2.position.set(-.6, 3.4, 2 * CAR_ZC - 1.4); key2.target.position.set(0, .8, 2 * CAR_ZC - WZ); scene.add(key2, key2.target);
  const fills = [-.55, .7].map((z) => { const l = new THREE.PointLight('#eaf1ff', 0, 4, 1.4); l.position.set(0, CEIL - .15, z); scene.add(l); return l; });

  const hit = []; const groups = {};
  const register = (id, g, normal = new THREE.Vector3(0, 0, 1)) => {
    (groups[id] = groups[id] || []).push(g);
    g.userData.home = g.position.clone(); g.userData.n = normal.clone().applyQuaternion(g.quaternion).normalize();
    g.traverse((o) => { if (o.isMesh) { o.userData.go = id; hit.push(o); } });
  };

  /* ---------- car cards: plain cream ads, the way the good ones are ---------- */
  const CARDS = {
    sourcer: ['40,118 job posts in one morning.', 'guess how many she read.', 'sourcer'],
    rekindle: ['when did you last call', 'your old mentor?', 'rekindle'],
    knowledge: ['ask it something it doesn\'t know.', 'it will tell you so.', 'knowledge assistant'],
  };
  const cardTex = (id) => canvasTex(1400, 700, (x, w, h) => {
    x.fillStyle = '#f1ece1'; x.fillRect(0, 0, w, h);
    const [a, b, brand] = CARDS[id];
    x.fillStyle = '#1b1b1b'; x.font = '400 84px Geist, Arial';
    x.fillText(a, 90, 200); x.fillText(b, 90, 305);
    x.fillRect(90, 360, 48, 6);
    x.font = '600 64px Newsreader, Georgia'; x.textAlign = 'right'; x.fillText(brand, w - 90, h - 90); x.textAlign = 'left';
    x.font = '500 26px "Geist Mono", monospace'; x.fillStyle = 'rgba(27,27,27,.5)'; x.fillText('marina martin · new york', 90, h - 98);
  });
  [['sourcer', -.66], ['rekindle', 0], ['knowledge', .66]].forEach(([id, cx]) => {
    const g = new THREE.Group(); g.position.set(cx, (COVE.y0 + COVE.y1) / 2 - .005, (COVE.z0 + COVE.z1) / 2 + .01); g.rotation.x = coveTilt; scene.add(g);
    g.add(mk(new THREE.BoxGeometry(.62, .315, .008), steel));
    const face = new THREE.Mesh(new THREE.PlaneGeometry(.6, .3), env(new THREE.MeshPhysicalMaterial({ map: cardTex(id), roughness: .45, clearcoat: .4 }), .2)); face.position.z = .0045; g.add(face);
    register(id, g);
  });
  // the same cards run along the other side
  scene.children.slice(-3).forEach((o) => farSide.add(o.clone()));

  /* ---------- strip map above the left door: Work ---------- */
  const STOPS = [['Columbia', '2024'], ['GHA', '2026'], ['Talent Pipeline', '2026'], ['Graduation', '2027']];
  const mapTex = canvasTex(1600, 340, (x, w, h) => {
    x.fillStyle = '#f4f1e8'; x.fillRect(0, 0, w, h);
    x.fillStyle = '#16181c'; x.fillRect(0, 0, w, 64); x.fillStyle = '#f4f1e8'; x.font = '600 30px Geist, Arial'; x.fillText('MM  local  ·  all stops so far', 30, 43);
    x.beginPath(); x.arc(w - 50, 32, 21, 0, 7); x.fillStyle = '#ffcf99'; x.fill(); x.fillStyle = INK; x.font = '700 24px Geist'; x.textAlign = 'center'; x.fillText('M', w - 50, 41); x.textAlign = 'left';
    const y = 190; x.strokeStyle = '#d64a32'; x.lineWidth = 16; x.beginPath(); x.moveTo(120, y); x.lineTo(w - 120, y); x.stroke();
    STOPS.forEach(([n, yr], i) => {
      const px = 160 + i * ((w - 320) / 3), last = i === STOPS.length - 1;
      x.beginPath(); x.arc(px, y, last ? 26 : 20, 0, 7); x.fillStyle = last ? '#16181c' : '#fff'; x.fill(); x.lineWidth = 7; x.strokeStyle = '#16181c'; x.stroke();
      x.fillStyle = INK; x.textAlign = 'center'; x.font = '600 36px Geist, Arial'; x.fillText(n, px, y - 46); x.font = '500 26px "Geist Mono", monospace'; x.fillStyle = '#5a6676'; x.fillText(last ? yr + ', next stop' : yr, px, y + 68); x.textAlign = 'left';
    });
  });
  const mapG = new THREE.Group(); mapG.position.set(-1.5, (COVE.y0 + COVE.y1) / 2 - .005, (COVE.z0 + COVE.z1) / 2 + .01); mapG.rotation.x = coveTilt; scene.add(mapG);
  mapG.add(mk(new THREE.BoxGeometry(.68, .155, .008), steel));
  const mapFace = new THREE.Mesh(new THREE.PlaneGeometry(.66, .14), env(new THREE.MeshPhysicalMaterial({ map: mapTex, roughness: .4, clearcoat: .4 }), .2)); mapFace.position.z = .0045; mapG.add(mapFace);
  register('work', mapG);

  /* ---------- the sign above the right door: the terminal ---------- */
  const SCREEN_LINES = [['p', '~ % '], ['', 'sourcer run'], ['d', '  40,118 read · 1,801 scored · top 94'], ['p', '~ % '], ['', 'ask "parental leave?"'], ['a', '  no approved source · refused'], ['p', '~ % '], ['', 'help']];
  const typing = { n: 0, cursor: true, blank: false };
  const COLORS = { p: '#ffb347', d: '#c98a3a', a: '#ffd27a', e: '#ff8f8f', '': '#ffcf99' };
  const screenTex = canvasTex(1600, 460, (x, w, h) => {
    x.fillStyle = '#0a0705'; x.fillRect(0, 0, w, h);
    if (typing.blank) return;
    // an amber dot matrix sign, like the old ones
    x.font = '500 40px "Geist Mono", monospace';
    let chars = typing.n, y = 80, cx = 30;
    for (let i = 0; i < SCREEN_LINES.length && chars > 0; i++) {
      const [c, t] = SCREEN_LINES[i]; const s = t.slice(0, chars); chars -= t.length;
      x.fillStyle = COLORS[c]; x.fillText(s, cx, y); cx += x.measureText(s).width;
      if (c !== 'p') { y += 54; cx = 30; }
    }
    if (typing.cursor) { x.fillStyle = '#ffb347'; x.fillRect(cx + 4, y - 36, 20, 44); }
    x.fillStyle = 'rgba(0,0,0,.55)'; for (let gy = 0; gy < h; gy += 6) x.fillRect(0, gy, w, 2); for (let gx = 0; gx < w; gx += 6) x.fillRect(gx, 0, 2, h);
  });
  const totalChars = SCREEN_LINES.reduce((a, [, t]) => a + t.length, 0);
  const lcd = new THREE.Group(); lcd.position.set(1.5, (COVE.y0 + COVE.y1) / 2 - .005, (COVE.z0 + COVE.z1) / 2 + .02); lcd.rotation.x = coveTilt; scene.add(lcd);
  lcd.add(mk(new THREE.BoxGeometry(.66, .2, .03), env(new THREE.MeshPhysicalMaterial({ color: '#1a1d22', roughness: .4, clearcoat: .6 }), .5)));
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(.62, .178), new THREE.MeshBasicMaterial({ map: screenTex, toneMapped: false })); screen.position.z = .016; lcd.add(screen);
  register('terminal', lcd);

  /* ---------- a brushed steel payphone with a rotary dial: Contact ---------- */
  const phone = new THREE.Group(); phone.position.set(1.115, 1.12, WZ + .01); scene.add(phone);
  const PW = .2, PH = .36;
  phone.add(mk(plate(PW, PH, .018, .055, { bevel: .006 }), steel));
  const cradle = mk(new THREE.BoxGeometry(.11, .02, .03), poleMat); cradle.position.set(0, PH / 2 - .03, .07); phone.add(cradle);
  const dial = new THREE.Group(); dial.position.set(0, .03, .064); phone.add(dial);
  const dialPlate = canvasTex(512, 512, (x, w, h) => {
    x.fillStyle = '#b9bdc2'; x.beginPath(); x.arc(w / 2, h / 2, 250, 0, 7); x.fill();
    for (let i = 0; i < 10; i++) {
      const a = (30 + i * 30) * Math.PI / 180; const px = w / 2 + Math.cos(a) * 178, py = h / 2 - Math.sin(a) * 178;
      x.fillStyle = '#efe7d3'; x.beginPath(); x.arc(px, py, 46, 0, 7); x.fill(); x.fillStyle = '#16181c'; x.font = '600 52px Geist, Arial'; x.textAlign = 'center'; x.fillText(String((i + 1) % 10), px, py + 18);
    }
    x.fillStyle = '#efe7d3'; x.beginPath(); x.arc(w / 2, h / 2, 108, 0, 7); x.fill();
    x.fillStyle = '#16181c'; x.font = 'italic 400 46px Newsreader, Georgia'; x.textAlign = 'center'; x.fillText('give me', w / 2, h / 2 - 6); x.fillText('a ring', w / 2, h / 2 + 42);
  });
  const dialFace = new THREE.Mesh(new THREE.CircleGeometry(.075, 64), env(new THREE.MeshPhysicalMaterial({ map: dialPlate, roughness: .3, metalness: .4 }), .6)); dial.add(dialFace);
  for (let i = 0; i < 10; i++) { const a = (30 + i * 30) * Math.PI / 180; const r = mk(new THREE.TorusGeometry(.0145, .0025, 8, 24), poleMat); r.position.set(Math.cos(a) * .052, Math.sin(a) * .052, .004); dial.add(r); }
  const stopper = mk(new THREE.BoxGeometry(.006, .02, .01), poleMat); stopper.position.set(Math.cos(-.55) * .056, Math.sin(-.55) * .056, .006); stopper.rotation.z = -.55; dial.add(stopper);
  // handset on the left side, cord coiled below
  const handset = new THREE.Group(); handset.position.set(-PW / 2 - .035, .02, .05); phone.add(handset);
  const hbar = mk(new THREE.CapsuleGeometry(.014, .2, 8, 16), steel); handset.add(hbar);
  const cupA = mk(new THREE.CylinderGeometry(.03, .026, .035, 24), steel); cupA.rotation.z = Math.PI / 2; cupA.position.set(.012, .115, 0); handset.add(cupA);
  const cupB = cupA.clone(); cupB.position.y = -.115; handset.add(cupB);
  const coil = []; for (let i = 0; i <= 260; i++) { const t = i / 260; coil.push(new THREE.Vector3(-PW / 2 - .035 + Math.cos(t * Math.PI * 2 * 18) * .012 + t * .05, -.1 - t * .2 + Math.sin(t * Math.PI) * -.03, .05 + Math.sin(t * Math.PI * 2 * 18) * .012)); }
  phone.add(mk(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(coil), 700, .0028, 6), poleMat));
  const label = canvasTex(400, 90, (x, w, h) => { x.fillStyle = '#c4c8cd'; x.fillRect(0, 0, w, h); x.fillStyle = '#2a2e34'; x.font = 'italic 600 54px Newsreader, Georgia'; x.textAlign = 'center'; x.fillText('Marina', w / 2, 64); });
  const lab = new THREE.Mesh(new THREE.PlaneGeometry(.12, .027), env(new THREE.MeshPhysicalMaterial({ map: label, metalness: .6, roughness: .35 }), .6)); lab.position.set(0, -.12, .062); phone.add(lab);
  register('contact', phone);

  /* ---------- a newspaper left on the seat: About ---------- */
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase();
  const paperTex = canvasTex(1100, 800, (x, w, h) => {
    x.fillStyle = '#ece7da'; x.fillRect(0, 0, w, h); x.fillStyle = '#141414';
    x.textAlign = 'center'; x.font = '400 104px UnifrakturMaguntia, serif'; x.fillText('The Daily Query', w / 2, 118);
    x.fillRect(40, 146, w - 80, 3); x.font = '500 20px "Geist Mono", monospace'; x.fillText(`NEW YORK, ${today}  ·  LATE EDITION`, w / 2, 176); x.fillRect(40, 190, w - 80, 1.5);
    x.font = '400 92px Anton, Impact, sans-serif'; x.fillText('LOCAL ANALYST CHECKS', w / 2, 300); x.fillText('THE MATH TWICE', w / 2, 398);
    x.fillRect(40, 424, w - 80, 1.5);
    x.font = 'italic 400 30px Newsreader, Georgia'; x.fillText('New York analyst will not take a number on faith', w / 2, 470);
    x.fillStyle = 'rgba(20,20,20,.42)'; for (let c = 0; c < 3; c++) for (let r = 0; r < 10; r++) x.fillRect(50 + c * 340, 510 + r * 26, 300 - (r % 4 === 3 ? 90 : 0), 9);
  });
  const news = new THREE.Group(); news.position.set(.5, .52, WZ + .5); news.rotation.set(0, -.28, 0); scene.add(news);
  const sheetNews = mk(slab(.36, .26, .003, .006, { bevel: 0 }), [env(new THREE.MeshStandardMaterial({ map: paperTex, roughness: .9 }), .1), env(new THREE.MeshStandardMaterial({ color: '#e2ddd2', roughness: .9 }), .1)]);
  sheetNews.rotation.x = .07; news.add(sheetNews);
  register('about', news, new THREE.Vector3(0, 1, 0));

  /* ---------- camera ---------- */
  const look = new THREE.Vector3();
  const view = { px: 0, py: 0, pz: 0, lx: 0, ly: 0, lz: 0, fov: 54 };
  let homeView = null, camBusy = false;
  function fit() {
    const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h;
    const portrait = w / h < .9;
    // on an upright phone, open wide enough that all three ad cards fit across the screen
    const fov = portrait ? Math.min(92, 70 + 30 * (.9 - w / h)) : 54;
    const vf = THREE.MathUtils.degToRad(fov), hf = 2 * Math.atan(Math.tan(vf / 2) * camera.aspect);
    const dist = portrait ? Math.min(2.75, 1.15 / Math.tan(hf / 2) + .2) : Math.min(2.75, 2.0 / Math.tan(hf / 2));
    homeView = { px: 0, py: 1.5, pz: WZ + dist, lx: 0, ly: portrait ? 1.3 : 1.5, lz: WZ, fov };
    if (!open && !camBusy) Object.assign(view, homeView);
    camera.updateProjectionMatrix();
  }
  addEventListener('resize', fit); fit();

  const wp = new THREE.Vector3();
  function viewFor(id) {
    if (!id) return homeView;
    const g = groups[id][0]; g.getWorldPosition(wp);
    const n = g.userData.n.clone();
    const sheetSide = KIND[id] === 'sheet' && innerWidth > 820;
    const d = { sourcer: .95, rekindle: .95, knowledge: .95, work: .95, terminal: 1.0, contact: .8, about: .7 }[id];
    const p = wp.clone().addScaledVector(n, d);
    if (id === 'about') p.add(new THREE.Vector3(0, 0, .35));
    const right = sheetSide ? .26 * d : 0;
    return { px: p.x + right * .6, py: p.y, pz: p.z, lx: wp.x + right, ly: wp.y, lz: wp.z, fov: innerWidth / innerHeight < .9 ? 64 : 42 };
  }
  function focus(id) {
    typing.blank = id === 'terminal'; screenTex.userData.redraw();
    const v = viewFor(id);
    if (reduce || !G) { Object.assign(view, v); return; }
    camBusy = true; G.killTweensOf(view);
    G.to(view, { ...v, duration: id ? 1.15 : 1.3, ease: 'power3.inOut', onComplete: () => { camBusy = false; } });
    nudge(id, .02);
  }
  function nudge(id, amt) {
    if (!G || reduce) return;
    Object.entries(groups).forEach(([k, gs]) => gs.forEach((g) => { const h = g.userData.home, n = g.userData.n, s = k === id ? amt : 0; G.to(g.position, { x: h.x + n.x * s, y: h.y + n.y * s, z: h.z + n.z * s, duration: .45, ease: 'power3.out' }); }));
  }

  /* ---------- the run: pull into a station, wait, pull out, ride the tunnel ---------- */
  let loopCall = null;
  function arrive() {
    stationTex.userData.redraw();
    station.position.x = 8; station.visible = true;
    G.to(train, { v: 0, duration: 3.4, ease: 'power2.out' });
    G.to(station.position, { x: 0, duration: 3.4, ease: 'power2.out', onComplete: () => { loopCall = G.delayedCall(6, depart); } });
  }
  function depart() {
    G.to(train, { v: 1, duration: 3, ease: 'power2.in' });
    G.to(station.position, { x: -8, duration: 3, ease: 'power2.in', onComplete: () => { station.visible = false; stationIdx = (stationIdx + 1) % STATIONS.length; loopCall = G.delayedCall(5, arrive); } });
  }

  /* ---------- the platform outside the left door: one lit poster per project, trains coming and going ---------- */
  // Everything built so far is the car. On the platform it's hidden and a train seen from outside takes its place.
  const carMeshes = [];
  scene.traverse((o) => { if (o.isMesh && o !== tunnel && o !== station && !runLights.includes(o)) carMeshes.push(o); });
  const showCar = (on) => carMeshes.forEach((m) => { m.visible = on; });

  const DOOR_X = -1.6, WALL = -5.3, EDGE = WZ - .06, X0 = -8, X1 = 20, PLEN = X1 - X0, PC = (X0 + X1) / 2;
  const plat = new THREE.Group(); plat.visible = false; scene.add(plat);
  const concreteTex = canvasTex(1024, 1024, (x, w, h) => { x.fillStyle = '#8f8b84'; x.fillRect(0, 0, w, h); for (let i = 0; i < 14000; i++) { const c = rand(); x.fillStyle = c > .7 ? 'rgba(255,255,255,.12)' : c > .35 ? 'rgba(0,0,0,.14)' : 'rgba(60,50,40,.1)'; x.fillRect(rand() * w, rand() * h, 1 + rand() * 4, 1 + rand() * 4); } x.strokeStyle = 'rgba(0,0,0,.22)'; x.lineWidth = 3; for (let g = 0; g <= w; g += 256) { x.beginPath(); x.moveTo(g, 0); x.lineTo(g, h); x.stroke(); x.beginPath(); x.moveTo(0, g); x.lineTo(w, g); x.stroke(); } });
  concreteTex.wrapS = concreteTex.wrapT = THREE.RepeatWrapping; concreteTex.repeat.set(PLEN / 2.5, 1.6);
  const pDepth = EDGE - WALL;
  const pFloor = new THREE.Mesh(new THREE.PlaneGeometry(PLEN, pDepth), env(new THREE.MeshStandardMaterial({ map: concreteTex, roughness: .55 }), .35));
  pFloor.rotation.x = -Math.PI / 2; pFloor.position.set(PC, 0, (EDGE + WALL) / 2); pFloor.receiveShadow = true; plat.add(pFloor);
  const tactile = canvasTex(256, 256, (x, w, h) => { x.fillStyle = '#e8b51f'; x.fillRect(0, 0, w, h); x.fillStyle = 'rgba(0,0,0,.18)'; for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) { x.beginPath(); x.arc(16 + c * 32, 16 + r * 32, 7, 0, 7); x.fill(); } });
  tactile.wrapS = tactile.wrapT = THREE.RepeatWrapping; tactile.repeat.set(PLEN / .6, 1);
  const strip = new THREE.Mesh(new THREE.PlaneGeometry(PLEN, .6), env(new THREE.MeshStandardMaterial({ map: tactile, roughness: .6 }), .2)); strip.rotation.x = -Math.PI / 2; strip.position.set(PC, .002, EDGE - .3); plat.add(strip);
  const lip = mk(new THREE.BoxGeometry(PLEN, .06, .08), env(new THREE.MeshStandardMaterial({ color: '#d9d4c8', roughness: .7 }), .2)); lip.position.set(PC, -.03, EDGE + .04); plat.add(lip);
  const edgeFace = mk(new THREE.BoxGeometry(PLEN, 1.1, .06), env(new THREE.MeshStandardMaterial({ color: '#2a2a2c', roughness: .9 }), .1)); edgeFace.position.set(PC, -.58, EDGE + .03); plat.add(edgeFace);
  // the trackbed and the far tunnel wall
  const bed = new THREE.Mesh(new THREE.PlaneGeometry(PLEN + 40, 3.4), env(new THREE.MeshStandardMaterial({ color: '#1b1a18', roughness: 1 }), .05)); bed.rotation.x = -Math.PI / 2; bed.position.set(PC, -1.1, .4); plat.add(bed);
  const railMat = env(new THREE.MeshStandardMaterial({ color: '#8a8580', roughness: .3, metalness: .9 }), .6);
  [-.55, .75].forEach((rz) => { const r = mk(new THREE.BoxGeometry(PLEN + 40, .08, .07), railMat); r.position.set(PC, -1.02, rz); plat.add(r); });
  for (let tx = X0 - 20; tx < X1 + 20; tx += .7) { const tie = mk(new THREE.BoxGeometry(.22, .06, 2.0), env(new THREE.MeshStandardMaterial({ color: '#2d2721', roughness: 1 }), .05)); tie.position.set(tx, -1.07, .1); plat.add(tie); }
  const farWall = new THREE.Mesh(new THREE.PlaneGeometry(PLEN + 40, 4.8), env(new THREE.MeshStandardMaterial({ color: '#2b2e33', roughness: .95 }), .1)); farWall.position.set(PC, 1.3, 2.0); farWall.rotation.y = Math.PI; plat.add(farWall);
  // white tile wall with a mosaic trim band
  const tileTex = canvasTex(1024, 512, (x, w, h) => { x.fillStyle = '#d8d3c6'; x.fillRect(0, 0, w, h); for (let ty = 0; ty < h; ty += 64) for (let tx = (ty / 64 % 2) * 64; tx < w + 128; tx += 128) { const g = x.createLinearGradient(0, ty, 0, ty + 60); g.addColorStop(0, '#f6f3ea'); g.addColorStop(1, '#e8e3d6'); x.fillStyle = g; x.fillRect(tx + 3, ty + 3, 122, 58); x.fillStyle = `rgba(255,255,255,${rand() * .25})`; x.fillRect(tx + 8, ty + 6, 60, 6); } });
  tileTex.wrapS = tileTex.wrapT = THREE.RepeatWrapping; tileTex.repeat.set(PLEN / 1.6, 3.6 / .8);
  const pWall = new THREE.Mesh(new THREE.PlaneGeometry(PLEN, 3.6), env(new THREE.MeshPhysicalMaterial({ map: tileTex, roughness: .25, clearcoat: .6, clearcoatRoughness: .2 }), .5));
  pWall.position.set(PC, 1.8, WALL); pWall.receiveShadow = true; plat.add(pWall);
  const trimTex = canvasTex(512, 64, (x, w, h) => { x.fillStyle = '#5b2a1c'; x.fillRect(0, 0, w, h); for (let i = 0; i < 600; i++) { x.fillStyle = ['#7a3a22', '#3e1d14', '#a0612e', '#2f4a3a'][i % 4]; x.fillRect(rand() * w, rand() * h, 7, 7); } x.fillStyle = '#c9a24a'; x.fillRect(0, 0, w, 6); x.fillRect(0, h - 6, w, 6); });
  trimTex.wrapS = THREE.RepeatWrapping; trimTex.repeat.set(PLEN, 1);
  const trim = new THREE.Mesh(new THREE.PlaneGeometry(PLEN, .14), env(new THREE.MeshStandardMaterial({ map: trimTex, roughness: .5 }), .2)); trim.position.set(PC, 2.32, WALL + .004); plat.add(trim);
  const baseBand = new THREE.Mesh(new THREE.PlaneGeometry(PLEN, .22), env(new THREE.MeshStandardMaterial({ color: '#4a2a1e', roughness: .6 }), .2)); baseBand.position.set(PC, .11, WALL + .004); plat.add(baseBand);
  // each end of the platform closes in a tiled wall with the station's name in mosaic, the track running on into the dark beside it
  const endTile = tileTex.clone(); endTile.needsUpdate = true; endTile.repeat.set(pDepth / 1.6, 3.6 / .8);
  const endMat = env(new THREE.MeshPhysicalMaterial({ map: endTile, roughness: .25, clearcoat: .6, clearcoatRoughness: .2 }), .5);
  const lintelTile = tileTex.clone(); lintelTile.needsUpdate = true; lintelTile.repeat.set((2.0 - EDGE) / 1.6, .5 / .8);
  const lintelMat = env(new THREE.MeshPhysicalMaterial({ map: lintelTile, roughness: .3, clearcoat: .5 }), .4);
  const nameTex = canvasTex(1600, 400, (c, w, h) => {
    c.fillStyle = '#c9a24a'; c.fillRect(0, 0, w, h); c.fillStyle = '#efe9d8'; c.fillRect(18, 18, w - 36, h - 36);
    c.fillStyle = '#1f3a68'; c.fillRect(34, 34, w - 68, h - 68);
    for (let i = 0; i < 9000; i++) { c.fillStyle = `rgba(${rand() > .5 ? 255 : 0},${rand() > .5 ? 255 : 0},${rand() > .5 ? 255 : 0},.07)`; c.fillRect(34 + rand() * (w - 78), 34 + rand() * (h - 78), 10, 10); }
    c.fillStyle = '#efe6cf'; c.textAlign = 'center'; let fs = 190; c.font = `400 ${fs}px Newsreader, Georgia`; while (c.measureText('MARINA MARTIN').width > w - 220) { fs -= 6; c.font = `400 ${fs}px Newsreader, Georgia`; } c.fillText('MARINA MARTIN', w / 2, 250);
    c.font = '500 40px "Geist Mono", monospace'; c.fillText('DATA  AND  AI', w / 2, 330);
    c.strokeStyle = 'rgba(0,0,0,.16)'; c.lineWidth = 1.5; for (let gx = 34; gx < w - 34; gx += 12) { c.beginPath(); c.moveTo(gx, 34); c.lineTo(gx, h - 34); c.stroke(); } for (let gy = 34; gy < h - 34; gy += 12) { c.beginPath(); c.moveTo(34, gy); c.lineTo(w - 34, gy); c.stroke(); }
  });
  const nameMat = env(new THREE.MeshStandardMaterial({ map: nameTex, roughness: .45 }), .3);
  [[X0, 1], [X1, -1]].forEach(([ex, f]) => {
    const g = new THREE.Group(); g.position.set(ex, 0, 0); g.rotation.y = f * Math.PI / 2; plat.add(g);
    // facing back along the platform: local x runs across it, from the wall to the platform edge
    const zc = (EDGE + WALL) / 2, lx = (z) => f * (z - zc) * -1;
    const wallM = new THREE.Mesh(new THREE.PlaneGeometry(pDepth, 3.6), endMat); wallM.position.set(0, 1.8, 0); wallM.receiveShadow = true; g.add(wallM);
    g.position.z = zc;
    const tablet = new THREE.Mesh(new THREE.PlaneGeometry(2.1, .525), nameMat); tablet.position.set(lx(-2.85), 1.95, .01); g.add(tablet); // nearer the track, clear of the columns
    [[.15, '#4a2a1e', .22, .11], [.14, null, .14, 2.32]].forEach(([, col, hgt, y]) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(pDepth, hgt), col ? env(new THREE.MeshStandardMaterial({ color: col, roughness: .6 }), .2) : trim.material); m.position.set(0, y, .006); g.add(m); });
    // over the track, a tiled lintel above the dark tunnel mouth, high enough for the trains to clear
    const lint = new THREE.Mesh(new THREE.PlaneGeometry(2.0 - EDGE + .1, .5), lintelMat); lint.position.set(lx((EDGE + 2.0) / 2), 3.35, 0); g.add(lint);
    const lamp = new THREE.PointLight('#fff2dc', 1.6, 5, 1.6); lamp.position.set(0, 2.9, 1.4); g.add(lamp);
  });
  // dark ceiling, steel beams, fluorescent fixtures
  const pCeil = new THREE.Mesh(new THREE.PlaneGeometry(PLEN + 40, 7.4), env(new THREE.MeshStandardMaterial({ color: '#23262b', roughness: .9 }), .1)); pCeil.rotation.x = Math.PI / 2; pCeil.position.set(PC, 3.6, -1.6); plat.add(pCeil);
  const beamMat = env(new THREE.MeshStandardMaterial({ color: '#2d3138', roughness: .6, metalness: .4 }), .3);
  for (let bx = X0; bx < X1; bx += 1.8) { const bm = mk(new THREE.BoxGeometry(.14, .32, 7.4), beamMat); bm.position.set(bx, 3.44, -1.6); plat.add(bm); }
  const fixMat = new THREE.MeshBasicMaterial({ color: '#f2f6ff', toneMapped: false });
  for (let fx = X0 + 1; fx < X1; fx += 2.4) [-2.5, -4.3].forEach((fz) => { const f = new THREE.Mesh(new THREE.BoxGeometry(1.3, .05, .14), fixMat); f.position.set(fx, 3.22, fz); plat.add(f); const hood = mk(new THREE.BoxGeometry(1.4, .08, .22), beamMat); hood.position.set(fx, 3.28, fz); plat.add(hood); });
  // green steel columns
  const colMat = env(new THREE.MeshPhysicalMaterial({ color: '#2f4a3a', roughness: .45, clearcoat: .5, metalness: .3 }), .5);
  const platLights = [];
  for (let cx = X0 + 1.2; cx < X1; cx += 2.7) {
    const col = new THREE.Group(); col.position.set(cx, 0, -3.95); plat.add(col);
    const web = mk(new THREE.BoxGeometry(.03, 3.6, .24), colMat); web.position.y = 1.8; col.add(web);
    [.12, -.12].forEach((fz) => { const f = mk(new THREE.BoxGeometry(.26, 3.6, .03), colMat); f.position.set(0, 1.8, fz); col.add(f); });
    const foot = mk(new THREE.BoxGeometry(.36, .12, .36), env(new THREE.MeshStandardMaterial({ color: '#1d2a22', roughness: .6 }), .2)); foot.position.y = .06; col.add(foot);
  }
  [-1, 3, 8, 14].forEach((lx) => { const l = new THREE.PointLight('#fff2dc', 0, 8, 1.5); l.position.set(lx, 3.0, -3.2); plat.add(l); platLights.push(l); });
  // the tunnel continues on both sides, so the platform can slide in and out of the windows
  const tunnelSeg = (cx) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(9, 2.4), tunnel.material); m.position.set(cx, 1.2, -2.15); plat.add(m); return m; };
  const tunL = [tunnelSeg(X0 - 4.5), tunnelSeg(X0 - 13.5)], tunR = [tunnelSeg(X1 + 4.5), tunnelSeg(X1 + 13.5)];
  const ENTER_X = -(X0 - 4.5), EXIT_X = -(X1 + 4.5);

  /* ---------- furniture along the wall ---------- */
  const woodBench = env(new THREE.MeshStandardMaterial({ map: canvasTex(512, 128, (x, w, h) => { x.fillStyle = '#7a4a28'; x.fillRect(0, 0, w, h); for (let i = 0; i < 60; i++) { x.strokeStyle = `rgba(${rand() > .5 ? '40,20,8' : '150,100,60'},.25)`; x.lineWidth = 1 + rand() * 2; const y = rand() * h; x.beginPath(); x.moveTo(0, y); x.bezierCurveTo(w * .3, y + rand() * 8 - 4, w * .6, y + rand() * 8 - 4, w, y); x.stroke(); } }), roughness: .55 }), .3);
  const blackSteel = env(new THREE.MeshPhysicalMaterial({ color: '#17191c', roughness: .45, metalness: .5 }), .5);
  const put = (g, m, x, y, z, ry = 0) => { m.position.set(x, y, z); m.rotation.y = ry; g.add(m); return m; };
  function stationBench(x) {
    const z = WALL + .55;
    for (let k = 0; k < 3; k++) put(plat, mk(new THREE.BoxGeometry(1.6, .035, .12), woodBench), x, .46, z - .14 + k * .14);
    for (let k = 0; k < 3; k++) { const s = put(plat, mk(new THREE.BoxGeometry(1.6, .1, .03), woodBench), x, .62 + k * .13, z - .24); s.rotation.x = -.12; }
    [-.68, 0, .68].forEach((lx) => put(plat, mk(new THREE.BoxGeometry(.05, .44, .38), blackSteel), x + lx, .22, z));
  }
  function stationBins(x) {
    const can = mk(new THREE.CylinderGeometry(.24, .22, .75, 28), env(new THREE.MeshStandardMaterial({ color: '#2a2d31', roughness: .5, metalness: .6 }), .4)); put(plat, can, x, .375, WALL + .45);
    const rec = mk(new THREE.BoxGeometry(.45, .85, .4), env(new THREE.MeshStandardMaterial({ color: '#1f5fa8', roughness: .45 }), .3)); put(plat, rec, x + .6, .425, WALL + .4);
  }
  function wallClock(x) {
    const tex = canvasTex(512, 512, (c) => {
      c.fillStyle = '#f7f5ee'; c.beginPath(); c.arc(256, 256, 250, 0, 7); c.fill();
      c.fillStyle = '#16181c'; for (let k = 0; k < 60; k++) { c.save(); c.translate(256, 256); c.rotate(k * Math.PI / 30); c.fillRect(-2, -236, 4, k % 5 ? 14 : 34); c.restore(); }
      const d = new Date(), hA = ((d.getHours() % 12) + d.getMinutes() / 60) * Math.PI / 6, mA = d.getMinutes() * Math.PI / 30;
      c.lineCap = 'round'; c.strokeStyle = '#16181c'; c.lineWidth = 14; c.beginPath(); c.moveTo(256, 256); c.lineTo(256 + Math.sin(hA) * 110, 256 - Math.cos(hA) * 110); c.stroke();
      c.lineWidth = 9; c.beginPath(); c.moveTo(256, 256); c.lineTo(256 + Math.sin(mA) * 170, 256 - Math.cos(mA) * 170); c.stroke();
    });
    const cl = new THREE.Group(); cl.position.set(x, 2.75, -3.2); cl.rotation.y = -Math.PI / 2; plat.add(cl);
    const rim = mk(new THREE.CylinderGeometry(.3, .3, .08, 40), blackSteel); rim.rotation.x = Math.PI / 2; cl.add(rim);
    [1, -1].forEach((sd) => { const f = new THREE.Mesh(new THREE.CircleGeometry(.27, 40), new THREE.MeshBasicMaterial({ map: tex, color: '#f0eee6' })); f.position.z = .041 * sd; if (sd < 0) f.rotation.y = Math.PI; cl.add(f); });
  }
  function stationSign(x) {
    const tex = canvasTex(1400, 200, (c, w) => {
      c.fillStyle = '#121315'; c.fillRect(0, 0, w, 200); c.fillStyle = '#fff'; c.fillRect(0, 14, w, 4);
      [['#d64a32', '1'], ['#2c4d78', '2'], ['#2f6b45', '3']].forEach(([col, n], i) => { c.fillStyle = col; c.beginPath(); c.arc(70 + i * 90, 110, 36, 0, 7); c.fill(); c.fillStyle = '#fff'; c.font = '700 44px Geist, Arial'; c.textAlign = 'center'; c.fillText(n, 70 + i * 90, 126); });
      c.textAlign = 'left'; c.font = '600 58px Geist, Arial'; c.fillText('Uptown & The Bronx', 360, 128);
    });
    const s = new THREE.Group(); s.position.set(x, 2.95, -3.0); s.rotation.y = -Math.PI / 2; plat.add(s);
    s.add(mk(new THREE.BoxGeometry(2.1, .3, .04), blackSteel));
    [1, -1].forEach((sd) => { const f = new THREE.Mesh(new THREE.PlaneGeometry(2.1, .3), new THREE.MeshBasicMaterial({ map: tex, color: '#e8e8e8' })); f.position.z = .021 * sd; if (sd < 0) f.rotation.y = Math.PI; s.add(f); });
  }
  stationBench(.4); wallClock(4.2); stationBins(6.2); stationSign(8.6); stationBench(11.4); wallClock(14.6); stationBins(16.6);

  // mosaic name tablets on the wall, repainted for each project
  let tabletLine = null;
  const tabletTex = canvasTex(1024, 260, (x, w, h) => {
    const line = tabletLine; if (!line) return;
    x.fillStyle = '#c9a24a'; x.fillRect(0, 0, w, h); x.fillStyle = '#efe9d8'; x.fillRect(12, 12, w - 24, h - 24); x.fillStyle = line.color; x.fillRect(24, 24, w - 48, h - 48);
    for (let i = 0; i < 2400; i++) { x.fillStyle = `rgba(${rand() > .5 ? 255 : 0},${rand() > .5 ? 255 : 0},${rand() > .5 ? 255 : 0},.08)`; x.fillRect(24 + rand() * (w - 48), 24 + rand() * (h - 48), 9, 9); }
    x.fillStyle = '#efe6cf'; x.textAlign = 'center'; let fs = 120; x.font = `400 ${fs}px Newsreader, Georgia`; while (x.measureText(line.name).width > w - 120) { fs -= 6; x.font = `400 ${fs}px Newsreader, Georgia`; }
    x.fillText(line.name, w / 2, 150); x.font = '500 28px "Geist Mono", monospace'; x.fillText(line.sub, w / 2, 205);
  });
  [2.2, 9.6, 15.4].forEach((tx) => { const t = new THREE.Mesh(new THREE.PlaneGeometry(1.4, .355), new THREE.MeshStandardMaterial({ map: tabletTex, roughness: .6 })); t.position.set(tx, 2.64, WALL + .006); plat.add(t); });

  /* ---------- the lightbox: one poster per project that rolls to the next panel ---------- */
  const lightbox = new THREE.Group(); plat.add(lightbox);
  const lbFrame = env(new THREE.MeshPhysicalMaterial({ color: '#2b2e33', metalness: .85, roughness: .28 }), .9);
  put(lightbox, mk(new THREE.BoxGeometry(1.34, 1.9, .16), lbFrame), 0, 1.4, 0);
  const lbBase = put(lightbox, mk(new THREE.BoxGeometry(.7, .42, .5), env(new THREE.MeshStandardMaterial({ color: '#2a2b2e', roughness: .5, metalness: .3 }), .3)), 0, .21, 0);
  const lb = { line: null, i: 0, from: 0, roll: 1, anim: 0, dirty: true };
  const W2 = 900, H2 = 1300;
  function panelArt(x, line, i, a) {
    const st = line.stops[i];
    x.fillStyle = '#efe6d0'; x.fillRect(0, 0, W2, H2);
    x.fillStyle = line.color; x.fillRect(0, 0, W2, 150);
    x.fillStyle = '#f3ecdc'; x.beginPath(); x.arc(84, 75, 44, 0, 7); x.fill(); x.fillStyle = line.color; x.font = '700 54px Geist, Arial'; x.textAlign = 'center'; x.fillText(line.bullet, 84, 94);
    x.textAlign = 'right'; x.fillStyle = '#f3ecdc'; x.font = '500 32px Geist, Arial'; x.fillText(`${i + 1} / ${line.stops.length}`, W2 - 50, 88);
    // the name as large as fits between the bullet and the count
    x.textAlign = 'left'; let ns = 56; x.font = `700 ${ns}px Geist, Arial`; while (x.measureText(line.name).width > W2 - 330 && ns > 34) { ns -= 2; x.font = `700 ${ns}px Geist, Arial`; }
    x.fillText(line.name, 152, 75 + ns * .36);
    x.fillStyle = '#a8321f'; x.font = '400 30px "Courier Prime", monospace'; x.fillText(st.label.toUpperCase(), 60, 225);
    x.fillStyle = '#1f1b16'; let fs = 96; x.font = `400 ${fs}px "Old Standard TT", Georgia`;
    let tl = wrapText(x, st.title, W2 - 120); while (tl.length > 3 && fs > 60) { fs -= 6; x.font = `400 ${fs}px "Old Standard TT", Georgia`; tl = wrapText(x, st.title, W2 - 120); }
    let y = 330; tl.forEach((l) => { x.fillText(l, 60, y); y += fs * 1.06; });
    y += 6; x.fillRect(60, y, W2 - 120, 4); x.fillRect(60, y + 10, W2 - 120, 1.5);
    const top = Math.max(y + 60, 660);
    if (st.art) ART[st.art](x, line, top, a);
    else { x.fillStyle = '#3d362c'; x.font = '400 38px "Libre Caslon Text", Georgia'; const words = st.body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); wrapText(x, words, W2 - 120).slice(0, 9).forEach((l, k) => x.fillText(l, 60, top + k * 56)); }
    // the last panel points on to the next stop, the way the car signs do
    if (i < line.stops.length - 1) { x.fillStyle = 'rgba(31,27,22,.55)'; x.font = '400 24px "Courier Prime", monospace'; x.fillText('MARINA MARTIN · NEW YORK', 60, H2 - 60); }
    else {
      const n = LINES[line.next], tx = `NEXT STOP  ${n.name}`; x.font = '700 24px "Courier Prime", monospace'; x.textAlign = 'right';
      x.fillStyle = '#1f1b16'; x.fillText(tx, W2 - 60 - 52, H2 - 60);
      x.fillStyle = n.color; x.beginPath(); x.arc(W2 - 60 - 18, H2 - 68, 18, 0, 7); x.fill();
      x.fillStyle = '#f3ecdc'; x.font = '700 22px Geist, Arial'; x.textAlign = 'center'; x.fillText(n.bullet, W2 - 60 - 18, H2 - 60); x.textAlign = 'left';
    }
  }
  // counts the first number in a string up from zero, keeping its commas and decimals
  function countUp(str, t) {
    if (t >= 1) return str;
    return str.replace(/[\d,]*\.?\d+/, (m) => {
      const v = parseFloat(m.replace(/,/g, '')) * t, dec = (m.split('.')[1] || '').length;
      return m.includes(',') ? Math.round(v).toLocaleString('en-US') : v.toFixed(dec);
    });
  }
  const ease = (t) => 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3);
  const ART = {
    // rules take out most postings before the model reads anything
    funnel(x, line, y0, a) {
      const rows = [['read', 40118], ['too senior', 26312], ['wrong place', 11128], ['not data or AI', 5593], ['gig work', 2655], ['to the model', 1801]];
      rows.forEach(([k, v], i) => { const t = ease(a * 1.6 - i * .14), y = y0 + i * 92, bw = (W2 - 120) * Math.sqrt(v / 40118) * t; x.fillStyle = i === rows.length - 1 ? '#a8321f' : line.color; x.globalAlpha = i === rows.length - 1 ? 1 : .4 + .6 * (1 - i / rows.length); x.fillRect(60, y, bw, 44); x.globalAlpha = Math.min(1, t * 2); x.fillStyle = '#1f1b16'; x.font = '400 28px "Courier Prime", monospace'; x.fillText(`${Math.round(v * t).toLocaleString('en-US')}  ${k}`, 60, y + 76); x.globalAlpha = 1; });
    },
    // the risk line climbs as a contact goes quiet, and a nudge fires at the line
    decay(x, line, y0, a) {
      const w = W2 - 120, h = 420, th = y0 + h * .38;
      x.strokeStyle = 'rgba(31,27,22,.25)'; x.lineWidth = 2; x.beginPath(); x.moveTo(60, y0 + h); x.lineTo(60 + w, y0 + h); x.stroke();
      x.setLineDash([12, 12]); x.strokeStyle = '#a8321f'; x.beginPath(); x.moveTo(60, th); x.lineTo(60 + w, th); x.stroke(); x.setLineDash([]);
      x.fillStyle = '#a8321f'; x.font = '400 26px "Courier Prime", monospace'; x.fillText('NUDGE', 60 + w - 110, th - 14);
      const f = (u) => y0 + h - h * .85 * (1 - Math.exp(-u * 2.6)) + (u > .72 ? (u - .72) * h * 2.2 : 0);
      const end = ease(a * 1.3); x.strokeStyle = '#1f1b16'; x.lineWidth = 6; x.beginPath();
      for (let k = 0; k <= 100 * end; k++) { const u = k / 100, px = 60 + u * w, py = Math.min(y0 + h, f(u)); k ? x.lineTo(px, py) : x.moveTo(px, py); } x.stroke();
      if (end > .62) { x.fillStyle = '#a8321f'; x.beginPath(); x.arc(60 + .62 * w, th, 14, 0, 7); x.fill(); x.fillStyle = '#1f1b16'; x.font = 'italic 400 32px "Libre Caslon Text", Georgia'; x.fillText('a check in, then back to normal', 60, y0 + h + 60); }
    },
    // three questions: one answered with its source, one conflict, one refusal
    qa(x, line, y0, a) {
      const cards = [
        ['How many days can I work remotely?', 'Two days a week, with manager approval.', 'Remote work policy, section 2', '#2f6b45'],
        ['What is the daily meal limit?', '$75 in one policy, $90 in another.', 'Conflict flagged for an admin', '#b7791f'],
        ['How much parental leave do we get?', 'No approved document covers this.', 'Refused, nothing to quote', '#a8321f'],
      ];
      cards.forEach(([q, ans, src, col], i) => {
        const t = ease(a * 2.2 - i * .45), y = y0 + i * 170; if (t <= 0) return;
        x.globalAlpha = t;
        x.fillStyle = '#1f1b16'; x.font = 'italic 400 30px "Libre Caslon Text", Georgia'; x.fillText(q, 60, y + 10);
        x.fillStyle = col; x.fillRect(60, y + 30, 6, 100);
        x.fillStyle = '#1f1b16'; x.font = '400 34px "Old Standard TT", Georgia'; wrapText(x, ans, W2 - 160).slice(0, 2).forEach((l, k) => x.fillText(l, 86, y + 70 + k * 40));
        x.fillStyle = col; x.font = '400 24px "Courier Prime", monospace'; x.fillText(src.toUpperCase(), 86, y + 124);
        x.globalAlpha = 1;
      });
    },
    // 405 career sites as a field of dots: most stay dark, a few light up, one becomes the morning text
    sites(x, line, y0, a) {
      const cols = 27, rows = 15, gap = 28, rg = 22, picked = new Set([31, 58, 97, 140, 166, 203, 251, 288, 319, 347, 372]), best = 203;
      for (let k = 0; k < cols * rows; k++) {
        const c = k % cols, r = Math.floor(k / cols), t = ease(a * 2 - (c + r) / 40); if (t <= 0) continue;
        const on = picked.has(k) && a > .45, px = 72 + c * gap, py = y0 + 12 + r * rg;
        x.globalAlpha = t; x.fillStyle = k === best && a > .6 ? '#a8321f' : on ? line.color : 'rgba(31,27,22,.18)';
        x.beginPath(); x.arc(px, py, k === best && a > .6 ? 10 : on ? 8 : 5, 0, 7); x.fill();
      }
      x.globalAlpha = 1;
      const t = ease(a * 1.6 - .9); if (t <= 0) return;
      const bx = 72 + (best % cols) * gap, by = y0 + 12 + Math.floor(best / cols) * rg, cy = y0 + rows * rg + 30;
      x.globalAlpha = t; x.strokeStyle = '#a8321f'; x.lineWidth = 3; x.beginPath(); x.moveTo(bx, by + 12); x.lineTo(bx, cy); x.stroke();
      x.fillStyle = '#1f1b16'; x.fillRect(60, cy, W2 - 120, 96);
      x.fillStyle = '#f3ecdc'; x.font = '400 24px "Courier Prime", monospace'; x.fillText('8:00 AM  ·  405 SITES READ', 88, cy + 36);
      x.font = '400 32px "Libre Caslon Text", Georgia'; x.fillText('One match worth your morning.', 88, cy + 76);
      x.globalAlpha = 1;
    },
    // the same five weeks of silence, read against two different habits
    quiet(x, line, y0, a) {
      const w = W2 - 120, rowsY = [y0 + 40, y0 + 290];
      const ppl = [
        ['A close friend', [0, .06, .12, .17, .23, .29, .35, .41, .47], 'Quiet 5 weeks. Unusual.', '#a8321f'],
        ['An old classmate', [0, .44], 'Quiet 5 weeks. Normal.', '#6a5f50'],
      ];
      ppl.forEach(([who, ticks, verdict, col], i) => {
        const y = rowsY[i], t = ease(a * 1.6 - i * .35); if (t <= 0) return;
        x.globalAlpha = t; x.fillStyle = '#1f1b16'; x.font = 'italic 400 32px "Libre Caslon Text", Georgia'; x.fillText(who, 60, y);
        x.strokeStyle = 'rgba(31,27,22,.35)'; x.lineWidth = 2; x.beginPath(); x.moveTo(60, y + 70); x.lineTo(60 + w * t, y + 70); x.stroke();
        x.fillStyle = line.color; ticks.forEach((u) => { if (u <= t) x.fillRect(60 + u * w - 3, y + 44, 6, 52); });
        if (t > .95) {
          const g0 = 60 + .78 * w, g1 = 60 + w; x.fillStyle = col; x.globalAlpha = .12; x.fillRect(g0, y + 40, g1 - g0, 60); x.globalAlpha = 1;
          x.strokeStyle = col; x.lineWidth = 3; x.beginPath(); x.moveTo(g0, y + 118); x.lineTo(g0, y + 128); x.lineTo(g1, y + 128); x.lineTo(g1, y + 118); x.stroke();
          x.fillStyle = col; x.font = '400 26px "Courier Prime", monospace'; x.textAlign = 'right'; x.fillText(verdict.toUpperCase(), g1, y + 170); x.textAlign = 'left';
        }
        x.globalAlpha = 1;
      });
    },
    // a question, and the line of the policy that answers it, highlighted where it sits
    source(x, line, y0, a) {
      const t1 = ease(a * 2), t2 = ease(a * 1.6 - .5);
      x.globalAlpha = t1; x.fillStyle = '#1f1b16'; x.font = 'italic 400 34px "Libre Caslon Text", Georgia'; x.fillText('How far ahead do I book flights?', 60, y0 + 20);
      x.font = '400 40px "Old Standard TT", Georgia'; x.fillText('At least 14 days before travel.', 60, y0 + 84);
      x.fillStyle = line.color; x.font = '400 26px "Courier Prime", monospace'; x.fillText('[1] TRAVEL POLICY, SECTION 4', 60, y0 + 126);
      x.globalAlpha = t2; const py = y0 + 170;
      x.fillStyle = '#fbf7ec'; x.fillRect(60, py, W2 - 120, 330); x.strokeStyle = 'rgba(31,27,22,.3)'; x.lineWidth = 2; x.strokeRect(60, py, W2 - 120, 330);
      x.fillStyle = '#1f1b16'; x.font = '700 22px "Courier Prime", monospace'; x.fillText('TRAVEL POLICY  ·  APPROVED', 88, py + 44);
      [0, 1, 2, 4, 5].forEach((r) => { x.fillStyle = 'rgba(31,27,22,.16)'; x.fillRect(88, py + 80 + r * 44, (W2 - 176) * (r === 2 ? .6 : r === 5 ? .45 : 1), 14); });
      x.fillStyle = line.color; x.globalAlpha = t2 * .22; x.fillRect(80, py + 200, W2 - 160, 50); x.globalAlpha = t2;
      x.fillStyle = '#1f1b16'; x.font = '400 28px "Libre Caslon Text", Georgia'; x.fillText('Flights must be booked at least 14 days', 92, py + 234);
      x.fillStyle = line.color; x.fillRect(80, py + 200, 5, 50);
      x.globalAlpha = 1;
    },
    // three numbers, set big
    proof(x, line, y0, a) {
      line.proof.forEach(([n, l], i) => { const t = ease(a * 1.8 - i * .2), y = y0 + 30 + i * 160; x.globalAlpha = t; x.fillStyle = line.color; x.font = '400 104px "Old Standard TT", Georgia'; x.fillText(countUp(n, ease(a * 1.4 - i * .2)), 60, y + 70); x.fillStyle = '#1f1b16'; x.font = '400 28px "Courier Prime", monospace'; wrapText(x, l.toUpperCase(), 380).forEach((s, k) => x.fillText(s, W2 - 440, y + 28 + k * 36)); x.globalAlpha = 1; });
    },
  };
  // the poster face is drawn as two panels on a roll, like the old scrolling lightboxes
  const lbTex = canvasTex(W2, H2, (x) => {
    if (!lb.line) return;
    if (lb.roll >= 1) { panelArt(x, lb.line, lb.i, lb.anim); return; }
    const off = ease(lb.roll) * H2 * lb.dir;
    x.save(); x.translate(0, -off); panelArt(x, lb.fromLine || lb.line, lb.from, 1); x.restore();
    x.save(); x.translate(0, lb.dir * H2 - off); panelArt(x, lb.line, lb.i, 0); x.restore();
    x.fillStyle = 'rgba(0,0,0,.25)'; x.fillRect(0, (lb.dir > 0 ? H2 - off : -off + H2) % H2 - 4, W2, 8);
  });
  const lbFace = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.733), new THREE.MeshBasicMaterial({ map: lbTex, toneMapped: false, color: '#fbf6ea' }));
  put(lightbox, lbFace, 0, 1.4, .081);
  const lbGlow = new THREE.PointLight('#fff1dc', 0, 3, 1.6); lbGlow.position.set(0, 1.4, .7); lightbox.add(lbGlow);

  // a split flap header above the poster, flipping to each panel's name
  const flap = { text: '', shown: '', t: 0 };
  const FLAPS = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·';
  const flapTex = canvasTex(1400, 150, (x, w, h) => {
    x.fillStyle = '#0d0f12'; x.fillRect(0, 0, w, h);
    const n = 32, cw = (w - 40) / n;
    for (let k = 0; k < n; k++) { const ch = flap.shown[k] || ' '; x.fillStyle = '#1c1f24'; x.fillRect(20 + k * cw + 2, 20, cw - 4, h - 40); x.fillStyle = '#0d0f12'; x.fillRect(20 + k * cw, h / 2 - 1, cw, 2); x.fillStyle = '#f2c230'; x.font = '700 54px "Courier Prime", monospace'; x.textAlign = 'center'; x.fillText(ch, 20 + k * cw + cw / 2, h / 2 + 19); }
  });
  const flapBoard = new THREE.Group(); flapBoard.position.set(0, 2.62, 0); lightbox.add(flapBoard);
  flapBoard.add(mk(new THREE.BoxGeometry(1.34, .18, .12), lbFrame));
  put(flapBoard, new THREE.Mesh(new THREE.PlaneGeometry(1.3, .14), new THREE.MeshBasicMaterial({ map: flapTex, toneMapped: false })), 0, 0, .061);
  [-.55, .55].forEach((hx) => put(flapBoard, mk(new THREE.CylinderGeometry(.008, .008, 1.0, 8), blackSteel), hx, .58, 0));
  function setFlap(text) { flap.text = text.toUpperCase().slice(0, 32).padEnd(32, ' '); flap.t = 0; if (reduce) { flap.shown = flap.text; flapTex.userData.redraw(); } }
  function stepFlap(dt) {
    if (flap.shown === flap.text) return;
    flap.t += dt; let out = '';
    for (let k = 0; k < 32; k++) out += flap.t > .25 + k * .035 ? flap.text[k] : FLAPS[Math.floor(rand() * FLAPS.length)];
    flap.shown = out; flapTex.userData.redraw();
  }

  /* ---------- trains seen from the platform ---------- */
  const CAR_L = 6.75;
  // the stainless car as it really looks: brushed steel that catches the light, seams, rust weeping from the corners,
  // scratched-in tags, tan gaskets round every window, and riders inside
  const SIDE_L = CAR_L - .16, SIDE_Y0 = -.255, SIDE_H = 2.75, SIDE_W = 2048, SIDE_PX_H = Math.round(2048 * SIDE_H / SIDE_L);
  const sideX = (x) => (SIDE_L / 2 - x) / SIDE_L * SIDE_W, sideY = (y) => (SIDE_Y0 + SIDE_H - y) / SIDE_H * SIDE_PX_H; // car metres to canvas pixels, seen from the platform
  const sideTex = canvasTex(SIDE_W, SIDE_PX_H, (x, w, h) => {
    const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#c9ccd0'); g.addColorStop(.5, '#b4b8bd'); g.addColorStop(1, '#9a9a96'); x.fillStyle = g; x.fillRect(0, 0, w, h);
    // broad bands where the platform lights reflect, then fine vertical brushing
    for (let i = 0; i < 26; i++) { const bx = rand() * w, bw = 20 + rand() * 140; const bg = x.createLinearGradient(bx, 0, bx + bw, 0); const c = rand() > .5 ? '255,255,255' : '40,40,45'; bg.addColorStop(0, `rgba(${c},0)`); bg.addColorStop(.5, `rgba(${c},${.05 + rand() * .1})`); bg.addColorStop(1, `rgba(${c},0)`); x.fillStyle = bg; x.fillRect(bx, 0, bw, h); }
    for (let i = 0; i < 9000; i++) { const v = rand() > .5 ? 255 : 0; x.fillStyle = `rgba(${v},${v},${v},${.015 + rand() * .03})`; x.fillRect(rand() * w, rand() * h, 1, 10 + rand() * 60); }
    // panel seams, the belt line under the windows, and rivets along them
    const seam = (y) => { x.fillStyle = 'rgba(30,30,32,.55)'; x.fillRect(0, sideY(y), w, 3); x.fillStyle = 'rgba(255,255,255,.35)'; x.fillRect(0, sideY(y) + 3, w, 2); for (let px = 8; px < w; px += 26) { x.fillStyle = 'rgba(40,40,40,.4)'; x.beginPath(); x.arc(px, sideY(y) + 10, 2.4, 0, 7); x.fill(); } };
    [2.32, 1.74, .9, .05].forEach(seam);
    [-3.0, -2.1, -.97, .97, 2.1, 3.0].forEach((vx) => { x.fillStyle = 'rgba(30,30,32,.35)'; x.fillRect(sideX(vx), 0, 2, h); });
    // grime rising from below, and rust that has wept down from window and door corners
    const gr = x.createLinearGradient(0, h * .62, 0, h); gr.addColorStop(0, 'rgba(70,58,44,0)'); gr.addColorStop(1, 'rgba(70,58,44,.45)'); x.fillStyle = gr; x.fillRect(0, 0, w, h);
    const weep = (px, py, len) => { for (let k = 0; k < 7; k++) { const ox = px + (rand() - .5) * 18, l = len * (.4 + rand() * .6); const wg = x.createLinearGradient(0, py, 0, py + l); wg.addColorStop(0, `rgba(120,60,30,${.25 + rand() * .2})`); wg.addColorStop(1, 'rgba(120,60,30,0)'); x.fillStyle = wg; x.fillRect(ox, py, 1.5 + rand() * 2.5, l); } };
    [[-.52, .9], [.52, .9], [2.6, .6], [-2.6, .6]].forEach(([wx, ww]) => { weep(sideX(wx - ww / 2), sideY(1.0), 90); weep(sideX(wx + ww / 2), sideY(1.0), 70); });
    [-1.6, 1.6].forEach((dx) => { weep(sideX(dx - .4), sideY(.1), 40); weep(sideX(dx + .4), sideY(1.95), 60); });
    // a scratched-in tag under one window, the kind etched with a key
    x.lineCap = 'round';
    for (let k = 0; k < 3; k++) { x.strokeStyle = k ? 'rgba(255,255,255,.18)' : 'rgba(60,50,40,.35)'; x.lineWidth = k ? 1.5 : 4; x.beginPath(); let px = sideX(.75), py = sideY(.6); x.moveTo(px, py); for (let i = 0; i < 9; i++) { x.bezierCurveTo(px + (rand() - .3) * 70, py - rand() * 90, px + (rand() - .2) * 80, py + rand() * 80, px += 18 + rand() * 20, py + (rand() - .5) * 40); } x.stroke(); }
    // the flag decal on the end panel
    const fx = sideX(3.17), fy = sideY(1.58), fw = sideX(2.93) - fx, fh = fw * .53;
    for (let i = 0; i < 13; i++) { x.fillStyle = i % 2 ? '#f4f1ea' : '#b8282e'; x.fillRect(fx, fy + i * fh / 13, fw, fh / 13 + .5); }
    x.fillStyle = '#2c3a6b'; x.fillRect(fx, fy, fw * .4, fh * 7 / 13); x.fillStyle = '#f4f1ea'; for (let r = 0; r < 5; r++) for (let c = 0; c < 6; c++) x.fillRect(fx + 4 + c * fw * .4 / 6.2, fy + 4 + r * fh * 7 / 13 / 5.4, 2, 2);
  });
  const sideRough = canvasTex(1024, 512, (x, w, h) => { x.fillStyle = '#5a5a5a'; x.fillRect(0, 0, w, h); for (let i = 0; i < 5000; i++) { const v = rand() > .5 ? 220 : 40; x.fillStyle = `rgba(${v},${v},${v},.08)`; x.fillRect(rand() * w, rand() * h, 1, 15 + rand() * 80); } const gr = x.createLinearGradient(0, h * .6, 0, h); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(1, 'rgba(255,255,255,.4)'); x.fillStyle = gr; x.fillRect(0, 0, w, h); }, { srgb: false });
  const sideMat = env(new THREE.MeshPhysicalMaterial({ map: sideTex, metalness: .55, roughness: .4, roughnessMap: sideRough, clearcoat: .2, clearcoatRoughness: .4 }), 2.2);
  const plainSteel = env(new THREE.MeshPhysicalMaterial({ color: '#b2b6bb', metalness: .55, roughness: .45, roughnessMap: sideRough }), 2);
  // a door leaf: brushed, dirtier at the foot, a rubber edge where the two meet
  const leafTex = canvasTex(256, 1024, (x, w, h) => {
    x.fillStyle = '#bcc0c5'; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 1500; i++) { const v = rand() > .5 ? 255 : 0; x.fillStyle = `rgba(${v},${v},${v},${.03 + rand() * .06})`; x.fillRect(rand() * w, rand() * h, 1, 20 + rand() * 90); }
    const gr = x.createLinearGradient(0, h * .55, 0, h); gr.addColorStop(0, 'rgba(80,62,44,0)'); gr.addColorStop(1, 'rgba(80,62,44,.5)'); x.fillStyle = gr; x.fillRect(0, 0, w, h);
    for (let k = 0; k < 5; k++) { x.fillStyle = `rgba(130,60,30,${.2 + rand() * .2})`; x.fillRect(rand() * w, h * (.82 + rand() * .1), 2, 40 + rand() * 60); }
  });
  const leafMat = env(new THREE.MeshPhysicalMaterial({ map: leafTex, metalness: .55, roughness: .38, roughnessMap: sideRough }), 2.2);
  const gasket = env(new THREE.MeshPhysicalMaterial({ color: '#9a8865', metalness: .35, roughness: .5, clearcoat: .2 }), .8);
  const shell = sideMat;
  // inside, through the glass: grey-white walls, blue benches, ads, a pole, and now and then someone riding home
  const RIDERS = [
    [{ x: .5, cap: '#c8322a', hood: '#b9bcbf', body: '#c8322a' }],
    [{ x: .3, hair: '#1d1714', body: '#2c3442' }, { x: .72, hair: '#5a3b22', body: '#6b5a44' }],
    [],
    [{ x: .62, hair: '#121212', hood: '#2a2a2a', body: '#1d1f22', phone: true }],
    [{ x: .4, cap: '#22324f', body: '#7b8a6a' }],
  ];
  const interiorTex = (riders) => canvasTex(512, 340, (x, w, h) => {
    const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#eef0ef'); g.addColorStop(.6, '#c9ccce'); g.addColorStop(1, '#8d9196'); x.fillStyle = g; x.fillRect(0, 0, w, h);
    x.fillStyle = '#fbfdff'; x.fillRect(0, 6, w, 7);
    // luggage rail and grab bars along the top
    x.fillStyle = '#9da2a8'; x.fillRect(0, 34, w, 5); x.fillRect(0, 58, w, 4); for (let px = 40; px < w; px += 110) x.fillRect(px, 34, 4, 28);
    // ad cards over the far windows
    [['#e9c23c', 30], ['#2f6fb0', 190], ['#e9e3d4', 350]].forEach(([c, px]) => { x.fillStyle = c; x.fillRect(px, 72, 130, 54); x.fillStyle = 'rgba(0,0,0,.35)'; x.fillRect(px + 10, 86, 70, 5); x.fillRect(px + 10, 98, 90, 4); });
    // the far window, dark tunnel behind it, with its own rounded frame
    x.fillStyle = '#d7dadd'; x.beginPath(); x.roundRect(120, 132, 280, 118, 26); x.fill(); x.fillStyle = '#23272c'; x.beginPath(); x.roundRect(134, 144, 252, 94, 20); x.fill();
    x.strokeStyle = 'rgba(255,255,255,.25)'; x.lineWidth = 1; for (let k = 0; k < 6; k++) { x.beginPath(); x.moveTo(134, 150 + k * 16); x.lineTo(386, 150 + k * 16); x.stroke(); }
    // the blue bench along the far wall
    x.fillStyle = '#2b4f8f'; x.fillRect(0, 256, w, 38); x.fillStyle = '#244379'; x.fillRect(0, 290, w, 50); x.fillStyle = 'rgba(255,255,255,.25)'; x.fillRect(0, 256, w, 3);
    // a stanchion
    x.fillStyle = '#c3c7cc'; x.fillRect(w * .44, 0, 6, h); x.fillStyle = 'rgba(255,255,255,.6)'; x.fillRect(w * .44 + 1, 0, 2, h);
    // riders, mostly seen from behind, the way you see them from the platform
    riders.forEach((r) => {
      const cx = r.x * w;
      x.fillStyle = r.body; x.beginPath(); x.ellipse(cx, h + 10, 78, 78, 0, Math.PI, 0); x.fill();
      if (r.hood) { x.fillStyle = r.hood; x.beginPath(); x.ellipse(cx, h - 50, 46, 26, 0, 0, 7); x.fill(); }
      x.fillStyle = '#6b4a35'; x.fillRect(cx - 12, h - 92, 24, 30);
      x.fillStyle = r.hair || '#2a1e17'; x.beginPath(); x.ellipse(cx, h - 112, 32, 36, 0, 0, 7); x.fill();
      if (r.cap) { x.fillStyle = r.cap; x.beginPath(); x.ellipse(cx, h - 122, 36, 30, 0, Math.PI, 0); x.fill(); x.fillRect(cx - 36, h - 124, 72, 10); x.fillStyle = 'rgba(0,0,0,.25)'; x.fillRect(cx - 34, h - 116, 68, 3); }
      if (r.phone) { x.fillStyle = '#9fc6ff'; x.globalAlpha = .5; x.beginPath(); x.ellipse(cx - 10, h - 70, 30, 12, 0, 0, 7); x.fill(); x.globalAlpha = 1; }
    });
    // the glass itself: a soft reflection across it
    const r = x.createLinearGradient(0, 0, w, h); r.addColorStop(.3, 'rgba(255,255,255,0)'); r.addColorStop(.42, 'rgba(255,255,255,.14)'); r.addColorStop(.5, 'rgba(255,255,255,0)'); x.fillStyle = r; x.fillRect(0, 0, w, h);
  });
  const winMats = RIDERS.map((rs) => new THREE.MeshBasicMaterial({ map: interiorTex(rs), color: '#d9dcdf', toneMapped: false }));
  let winPick = 0;
  const winGlow = winMats[2];
  const nextWin = () => winMats[(winPick++ * 3 + 1) % winMats.length];
  // the orange LED sign in a side window
  const ledTex = canvasTex(1024, 128, (x, w, h) => {
    x.fillStyle = '#0b0b0b'; x.fillRect(0, 0, w, h);
    x.fillStyle = '#ffae2b'; x.font = '700 88px "Courier Prime", monospace'; x.textBaseline = 'middle'; x.fillText('M', 24, h / 2 + 4); x.font = '700 64px "Courier Prime", monospace'; x.fillText('MARINA MARTIN-DATA & AI', 112, h / 2 + 4);
    x.fillStyle = 'rgba(0,0,0,.55)'; for (let px = 0; px < w; px += 6) x.fillRect(px, 0, 2, h); for (let py = 0; py < h; py += 6) x.fillRect(0, py, w, 2);
  });
  const ledMat = new THREE.MeshBasicMaterial({ map: ledTex, toneMapped: false });
  // what you see through an open door: the far side of the car, lit, with its bench and a pole
  const doorwayTex = canvasTex(128, 360, (x, w, h) => {
    const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#eef0ef'); g.addColorStop(.6, '#c4c7ca'); g.addColorStop(1, '#5a5d61'); x.fillStyle = g; x.fillRect(0, 0, w, h);
    x.fillStyle = '#fbfdff'; x.fillRect(0, 6, w, 10);
    x.fillStyle = '#d7dadd'; x.fillRect(10, h * .22, w - 20, h * .2); x.fillStyle = '#23272c'; x.fillRect(16, h * .24, w - 32, h * .16);
    x.fillStyle = '#2b4f8f'; x.fillRect(0, h * .58, w, h * .09);
    x.fillStyle = '#3b3d40'; x.fillRect(0, h * .67, w, h * .33);
    x.fillStyle = '#c9ccd0'; x.fillRect(w * .55, 0, 5, h);
  });
  const doorwayMat = new THREE.MeshBasicMaterial({ map: doorwayTex, color: '#cfc9bb', toneMapped: false });
  const capMat = env(new THREE.MeshPhysicalMaterial({ color: '#c3c7cc', metalness: .55, roughness: .4 }), 1.2);
  const underMat = env(new THREE.MeshStandardMaterial({ color: '#151618', roughness: .8, metalness: .3 }), .2);
  const wheelMat = env(new THREE.MeshStandardMaterial({ color: '#3a3836', roughness: .5, metalness: .8 }), .5);
  const lamp = (c) => new THREE.MeshBasicMaterial({ color: c, toneMapped: false });
  function frameAt(car, wx, wy, ww, wh) { const f = mk(ring(ww + .07, wh + .07, .1, .05, .03), gasket); f.position.set(wx, wy, -1.285); f.rotation.y = Math.PI; car.add(f); }
  // the end of the train: a cab face with headlights at the front, tail lights at the back
  function cabFace(car, front) {
    const sx = front ? 1 : -1, fx = sx * (CAR_L / 2 - .05);
    const face = new THREE.Group(); face.position.set(fx, 0, .12); face.rotation.y = sx * Math.PI / 2; car.add(face);
    put(face, mk(new THREE.BoxGeometry(2.8, 2.75, .04), capMat), 0, 1.12, 0);
    [[-.75, .5], [.0, .55], [.75, .5]].forEach(([wx, ww]) => { const g = new THREE.Mesh(new THREE.PlaneGeometry(ww, .7), new THREE.MeshPhysicalMaterial({ color: '#0d1116', roughness: .08, metalness: .2, clearcoat: 1 })); g.position.set(wx, 1.45, .025); face.add(g); });
    put(face, mk(new THREE.BoxGeometry(.56, 1.95, .02), rubber), 0, .78, .022);
    const sign = new THREE.Mesh(new THREE.CircleGeometry(.11, 32), lamp(front ? '#ffd27a' : '#2b2b2b')); sign.position.set(.75, 2.05, .03); face.add(sign);
    [-1, 1].forEach((k) => { const l = new THREE.Mesh(new THREE.CircleGeometry(.07, 24), lamp(front ? '#fffbe8' : '#ff2a1a')); l.position.set(k * 1.05, .45, .03); face.add(l); const l2 = new THREE.Mesh(new THREE.CircleGeometry(.04, 20), lamp(front ? '#fff1c4' : '#b31812')); l2.position.set(k * 1.05, 2.2, .03); face.add(l2); });
    if (front) { const hl = new THREE.PointLight('#fff4d6', 2.5, 7, 1.6); hl.position.set(0, .6, .6); face.add(hl); }
  }
  const hidden = new THREE.MeshBasicMaterial({ visible: false });
  // the platform side of the car you ride in, with real openings where its windows and doors are
  function cutSide() {
    const L = CAR_L - .16, y0 = -.255, H = 2.75, sh = new THREE.Shape();
    sh.moveTo(-L / 2, y0); sh.lineTo(L / 2, y0); sh.lineTo(L / 2, y0 + H); sh.lineTo(-L / 2, y0 + H); sh.lineTo(-L / 2, y0);
    const hole = (cx, cy, w, h) => { const q = new THREE.Path(); q.moveTo(cx - w / 2, cy - h / 2); q.lineTo(cx - w / 2, cy + h / 2); q.lineTo(cx + w / 2, cy + h / 2); q.lineTo(cx + w / 2, cy - h / 2); q.lineTo(cx - w / 2, cy - h / 2); sh.holes.push(q); };
    [-.52, .52].forEach((wx) => hole(wx, 1.33, .9, .64));
    [-2.6, 2.6].forEach((wx) => hole(wx, 1.33, .58, .64));
    [-1.6, 1.6].forEach((dx) => hole(dx, .975, .7, 1.95));
    const g = new THREE.ExtrudeGeometry(sh, { depth: .03, bevelEnabled: false });
    const pos = g.attributes.position, uv = g.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, (L / 2 - pos.getX(i)) / L, (pos.getY(i) - y0) / H);
    const m = mk(g, shell); m.position.z = -1.34; return m;
  }
  function makeTrain() {
    const t = new THREE.Group(); t.visible = false; plat.add(t);
    t.userData.doors = []; t.userData.inserts = [];
    for (let c = 0; c < 6; c++) {
      const car = new THREE.Group(); car.position.x = (c - 2) * CAR_L; t.add(car);
      const home = c === 2;
      // stand-ins for the cabin, seen while the real one is hidden
      const ins = (m) => { if (home) t.userData.inserts.push(m); return m; };
      put(car, mk(new THREE.BoxGeometry(CAR_L - .16, 2.75, 3.1), [plainSteel, plainSteel, plainSteel, plainSteel, plainSteel, home ? hidden : sideMat]), 0, 1.12, .27);
      if (home) car.add(cutSide());
      // a rounded roof line, and the air conditioning housings on top
      const roof = mk(new THREE.CylinderGeometry(4, 4, CAR_L - .16, 32, 1, true, Math.PI / 2 - .398, .796), capMat); roof.rotation.z = Math.PI / 2; roof.position.set(0, -1.32, .27); car.add(roof);
      [-1.6, 1.6].forEach((ax) => put(car, mk(new THREE.BoxGeometry(1.3, .18, 1.6), capMat), ax, 2.76, .27));
      put(car, mk(new THREE.BoxGeometry(CAR_L - .5, .62, 2.5), underMat), 0, -.52, .27);
      // two bogies, four wheels each, sitting on the rails
      [-1, 1].forEach((bx) => {
        put(car, mk(new THREE.BoxGeometry(2.0, .28, 1.9), underMat), bx * (CAR_L / 2 - 1.3), -.68, .12);
        [-.55, .55].forEach((wx) => [-.53, .77].forEach((wz) => { const wh = mk(new THREE.CylinderGeometry(.24, .24, .1, 20), wheelMat); wh.rotation.x = Math.PI / 2; wh.position.set(bx * (CAR_L / 2 - 1.3) + wx, -.76, wz); car.add(wh); }));
      });
      // the rubber gangway between cars
      if (c < 5) put(car, mk(new THREE.BoxGeometry(.2, 2.2, 1.6), rubber), CAR_L / 2, 1.0, .12);
      [[-.52, .9], [.52, .9], [2.6, .6], [-2.6, .6]].forEach(([wx, ww]) => { const w = new THREE.Mesh(new THREE.PlaneGeometry(ww, .62), nextWin()); w.position.set(wx, 1.33, -1.281); w.rotation.y = Math.PI; car.add(w); ins(w); frameAt(car, wx, 1.33, ww, .62); });
      [-1.6, 1.6].forEach((dx) => {
        ins(put(car, new THREE.Mesh(new THREE.PlaneGeometry(.7, 1.95), doorwayMat), dx, .975, -1.2805)).rotation.y = Math.PI;
        // a stainless frame with rounded top corners, and a diamond-plate threshold at the foot
        const df = mk(ring(.84, 2.08, .14, .07, .035), plainSteel); df.position.set(dx, 1.0, -1.28); df.rotation.y = Math.PI; car.add(df);
        put(car, mk(new THREE.BoxGeometry(.72, .02, .12), env(new THREE.MeshStandardMaterial({ color: '#8d8f91', metalness: .9, roughness: .5 }), .8)), dx, .005, -1.33);
        [-1, 1].forEach((s) => {
          const leaf = new THREE.Group(); leaf.position.set(dx + s * .175, .975, -1.3); car.add(leaf);
          leaf.add(mk(new THREE.BoxGeometry(.35, 1.95, .04), leafMat));
          const gwGeo = new THREE.ShapeGeometry(roundedShape(.22, .58, .09), 12), guv = gwGeo.attributes.uv; for (let i = 0; i < guv.count; i++) guv.setXY(i, .3 + (guv.getX(i) / .22 + .5) * .4, guv.getY(i) / .58 + .5); // a slice of the interior, not a tile
          const gw = new THREE.Mesh(gwGeo, nextWin()); gw.position.set(0, .4, -.021); gw.rotation.y = Math.PI; leaf.add(gw);
          const gf = mk(ring(.27, .63, .11, .035, .02), gasket); gf.position.set(0, .4, -.03); gf.rotation.y = Math.PI; leaf.add(gf);
          const edge = mk(new THREE.BoxGeometry(.02, 1.95, .05), rubber); edge.position.set(-s * .17, 0, 0); leaf.add(edge);
          t.userData.doors.push({ leaf, home: dx + s * .175, s }); ins(leaf);
        });
      });
      // the orange LED destination sign across the top of a window
      const led = new THREE.Mesh(new THREE.PlaneGeometry(.86, .11), ledMat); led.position.set(.52, 1.57, -1.283); led.rotation.y = Math.PI; car.add(led);
      if (c === 5) cabFace(car, true);
      if (c === 0) cabFace(car, false);
      // the cabin rides inside this car, so its shell must not shade the cabin from the car's own lights
      if (home) car.traverse((o) => { o.castShadow = false; });
    }
    return t;
  }
  const trainA = makeTrain();
  // true: the cabin itself rides in car 2, seen through its openings; false: the stand-ins take over
  function homeCar(on) { showCar(on); trainA.userData.inserts.forEach((m) => { m.visible = !on; }); }
  const doorsA = (on, d = .8) => trainA.userData.doors.forEach((dr) => { const x = dr.home + (on ? dr.s * .33 : 0); G && !reduce ? G.to(dr.leaf.position, { x, duration: d, ease: 'power2.inOut' }) : (dr.leaf.position.x = x); });
  let trainCall = null, trainTl = null, departTl = null;
  function trainCycle() {
    // at Rekindle you look across the tracks, so no train comes to stand in the way
    if (lineId === 'rekindle') { trainCall = G.delayedCall(6, trainCycle); return; }
    // another train pulls in, waits, and pulls out
    trainA.visible = true; trainA.position.x = -60; doorsA(false, .01);
    trainTl = G.timeline({ onComplete: () => { trainA.visible = false; trainCall = G.delayedCall(9, trainCycle); } })
      .to(trainA.position, { x: 0, duration: 4, ease: 'power2.out' })
      .add(() => doorsA(true), '+=.3').add(() => doorsA(false), '+=3.2')
      .to(trainA.position, { x: 70, duration: 4.5, ease: 'power2.in' }, '+=1');
  }

  /* ---------- three places on the platform, one per project ---------- */
  // Sourcer stands mid platform. Rekindle is the ad across the tracks, seen from the edge,
  // with rats working the trackbed. Knowledge Assistant hangs on the wall by the newsstand.
  const SPOTS = {
    sourcer: { pos: [2.0, 0, -3.35], ry: null, scale: 1, base: true,
      desk: { px: -2.0, py: 1.62, pz: -2.15, lx: 3.1, ly: 1.45, lz: -3.6, fov: 50 },
      mob: { px: -1.4, py: 1.6, pz: -2.25, lx: 2.0, ly: 1.75, lz: -3.35, fov: 64 } },
    rekindle: { pos: [6.3, -.78, 1.9], ry: Math.PI, scale: 1.35, base: false,
      desk: { px: 5.0, py: 1.55, pz: -1.85, lx: 5.65, ly: .78, lz: 1.0, fov: 58 },
      mob: { px: 6.3, py: 1.66, pz: -2.1, lx: 6.3, ly: .75, lz: 1.6, fov: 72 } },
    knowledge: { pos: [13.45, 0, WALL + .09], ry: 0, scale: 1, base: false,
      desk: { px: 12.4, py: 1.62, pz: -2.0, lx: 14.5, ly: 1.42, lz: -5.0, fov: 50 },
      // on a phone, stand back so the poster and the newsstand beside it share the screen
      mob: { px: 13.95, py: 1.6, pz: -1.6, lx: 13.95, ly: 1.75, lz: -5.3, fov: 78 } },
  };
  const spotView = (id) => ({ ...SPOTS[id][isPortrait() ? 'mob' : 'desk'] });
  function placePoster(id) {
    const sp = SPOTS[id]; lightbox.position.set(...sp.pos); lightbox.scale.setScalar(sp.scale); lbBase.visible = sp.base;
    const v = spotView(id); lightbox.rotation.y = sp.ry === null ? Math.atan2(v.px - sp.pos[0], v.pz - sp.pos[2]) : sp.ry;
  }

  // the trackbed below Rekindle: rats, and what people dropped
  // brown rat fur: dark along the back, lighter at the belly, in short strokes
  const furTex = canvasTex(256, 256, (x, w, h) => {
    const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#4a423b'); g.addColorStop(.55, '#6a5f55'); g.addColorStop(1, '#a39689'); x.fillStyle = g; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 5000; i++) { const px = rand() * w, py = rand() * h, l = 3 + rand() * 6; x.strokeStyle = `rgba(${rand() > .5 ? '30,24,20' : '170,155,140'},${.15 + rand() * .2})`; x.lineWidth = .8; x.beginPath(); x.moveTo(px, py); x.lineTo(px + l * .3, py + l); x.stroke(); }
  });
  const furBump = canvasTex(256, 256, (x, w, h) => { x.fillStyle = '#808080'; x.fillRect(0, 0, w, h); for (let i = 0; i < 6000; i++) { x.fillStyle = rand() > .5 ? '#fff' : '#000'; x.globalAlpha = .25; x.fillRect(rand() * w, rand() * h, 1, 3); } }, { srgb: false });
  const ratMat = env(new THREE.MeshPhysicalMaterial({ map: furTex, bumpMap: furBump, bumpScale: .6, roughness: .85, sheen: 1, sheenColor: new THREE.Color('#b8aa9c'), sheenRoughness: .6 }), .25);
  const pinkMat = env(new THREE.MeshPhysicalMaterial({ color: '#d79a92', roughness: .55, sheen: .5, sheenColor: new THREE.Color('#f2c6bf') }), .25);
  const earMat = env(new THREE.MeshStandardMaterial({ color: '#c98f86', roughness: .6, side: THREE.DoubleSide }), .2);
  const eyeMat = env(new THREE.MeshPhysicalMaterial({ color: '#050505', roughness: .05, clearcoat: 1 }), 1.2);
  const whiskerMat = new THREE.LineBasicMaterial({ color: '#d8d2c8', transparent: true, opacity: .3 });
  const ball = (r, mat, x, y, z, sx = 1, sy = 1, sz = 1, seg = 20) => { const m = mk(new THREE.SphereGeometry(r, seg, Math.round(seg * .7)), mat); m.position.set(x, y, z); m.scale.set(sx, sy, sz); return m; };
  // a tube that narrows from the root to the tip, for the tail
  function taperTube(curve, len, r0, r1) {
    const geo = new THREE.TubeGeometry(curve, len, r0, 8), pos = geo.attributes.position, c = new THREE.Vector3(), v = new THREE.Vector3();
    for (let i = 0; i <= len; i++) { const t = i / len; curve.getPointAt(t, c); const k = (r0 + (r1 - r0) * t) / r0; for (let j = 0; j <= 8; j++) { const n = i * 9 + j; v.fromBufferAttribute(pos, n).sub(c).multiplyScalar(k).add(c); pos.setXYZ(n, v.x, v.y, v.z); } }
    geo.computeVertexNormals(); return geo;
  }
  function makeRat() {
    const r = new THREE.Group();
    // the torso pivots at the hips, so the rat can sit up on its hind legs
    const torso = new THREE.Group(); torso.position.set(-.08, .03, 0); r.add(torso);
    const T = (m) => { m.position.x += .08; m.position.y -= .03; torso.add(m); return m; };
    T(ball(.07, ratMat, -.01, .068, 0, 1.75, .88, .95, 28));
    T(ball(.066, ratMat, -.075, .07, 0, 1.05, .98, 1.08, 24));
    T(ball(.046, ratMat, .125, .08, 0, 1.35, .92, .86, 24));
    const snout = mk(new THREE.ConeGeometry(.031, .07, 18), ratMat); snout.rotation.z = -Math.PI / 2; snout.position.set(.19, .072, 0); snout.scale.set(1, 1, .85); T(snout);
    T(ball(.0095, pinkMat, .226, .073, 0, 1, .9, 1.2, 12));
    [-1, 1].forEach((sd) => {
      T(ball(.0085, eyeMat, .155, .097, sd * .027, 1, 1, 1, 12));
      const ear = T(ball(.024, earMat, .115, .125, sd * .034, .28, 1, 1, 16)); ear.rotation.set(sd * -.35, sd * -.5, 0);
      const wpts = []; for (let k = 0; k < 4; k++) { const a = -.12 + k * .08; wpts.push(new THREE.Vector3(.21, .07, sd * .012), new THREE.Vector3(.225, .07 + a * .25, sd * .05)); }
      T(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(wpts), whiskerMat));
    });
    // legs: front paws hang from the torso, hind feet stay planted
    const legs = [];
    [[.07, .036, 0], [.07, -.036, 1], [-.1, .052, 1], [-.1, -.052, 0]].forEach(([lx, lz, ph], k) => {
      const leg = new THREE.Group(); leg.position.set(lx, .045, lz);
      const shin = mk(new THREE.CylinderGeometry(.012, .007, .04, 8), ratMat); shin.position.y = -.02; leg.add(shin);
      const foot = mk(new THREE.SphereGeometry(.01, 10, 6), pinkMat); foot.scale.set(k < 2 ? 1.6 : 2.6, .4, 1); foot.position.set(k < 2 ? .008 : .014, -.04, 0); leg.add(foot);
      (k < 2 ? torso : r).add(leg); if (k < 2) { leg.position.x += .08; leg.position.y -= .03; }
      leg.userData.ph = ph; legs.push(leg);
    });
    const tailRoot = new THREE.Group(); tailRoot.position.set(-.15, .045, 0); r.add(tailRoot);
    tailRoot.add(mk(taperTube(new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), new THREE.Vector3(-.09, -.03, .02), new THREE.Vector3(-.19, -.04, -.03), new THREE.Vector3(-.29, -.04, .03), new THREE.Vector3(-.36, -.035, -.01)]), 40, .011, .002), pinkMat));
    r.userData.torso = torso; r.userData.legs = legs; r.userData.tail = tailRoot;
    r.scale.setScalar(1.25); plat.add(r); return r;
  }
  const pizza = new THREE.Group();
  { const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.lineTo(.2, -.07); sh.quadraticCurveTo(.22, 0, .2, .07); sh.lineTo(0, 0);
    const slice = mk(new THREE.ExtrudeGeometry(sh, { depth: .012, bevelEnabled: false }), env(new THREE.MeshStandardMaterial({ color: '#f1c24b', roughness: .6 }), .2)); slice.rotation.x = -Math.PI / 2; pizza.add(slice);
    const crust = mk(new THREE.TorusGeometry(.2, .012, 6, 12, .7), env(new THREE.MeshStandardMaterial({ color: '#b97a3a', roughness: .8 }), .1)); crust.rotation.x = -Math.PI / 2; crust.rotation.z = -.35; pizza.add(crust);
    [[.08, .01], [.13, -.025], [.14, .03]].forEach(([px, pz]) => { const pep = mk(new THREE.CylinderGeometry(.018, .018, .006, 12), env(new THREE.MeshStandardMaterial({ color: '#a8321f', roughness: .6 }), .1)); pep.position.set(px, .014, pz); pizza.add(pep); }); }
  plat.add(pizza);
  const litter = [
    [mk(new THREE.BoxGeometry(.24, .04, .32), env(new THREE.MeshStandardMaterial({ color: '#d13b2f', roughness: .4, metalness: .3 }), .4)), 4.75, -1.06, 1.75, .6],
    [mk(new THREE.CylinderGeometry(.05, .04, .14, 16), env(new THREE.MeshStandardMaterial({ color: '#f2efe8', roughness: .7 }), .2)), 7.3, -1.05, 1.25, 1.2],
    [mk(new THREE.CylinderGeometry(.04, .04, .15, 16), env(new THREE.MeshStandardMaterial({ color: '#c8352a', roughness: .3, metalness: .7 }), .6)), 6.6, -1.06, .35, 2],
    [mk(new THREE.BoxGeometry(.42, .004, .3), env(new THREE.MeshStandardMaterial({ color: '#d9d4c6', roughness: .9 }), .1)), 7.9, -1.095, 1.6, .3],
  ];
  // a work light down on the trackbed, so the rats can be seen
  const bedLight = new THREE.PointLight('#ffe8c4', 3, 4.5, 1.4); bedLight.position.set(6.3, .1, .9); plat.add(bedLight);
  pizza.scale.setScalar(1.5);
  litter.forEach(([m, x, y, z, r]) => { m.position.set(x, y, z); m.rotation.set(r > 1 ? Math.PI / 2 : 0, r, 0); plat.add(m); });
  // each rat runs a loop of waypoints on the trackbed, stopping to sniff
  // they keep to the stretch of trackbed under the poster, so they stay in view
  // two of them, one at each end, so they're a detail and not the scene
  const RAT_PATHS = [
    [[5.2, 1.7], [5.7, 1.8], [6.0, 1.6], [5.5, 1.55]],
    [[8.9, 1.1], [8.4, 1.25], [8.0, 1.05], [8.6, .95]],
  ];
  const rats = RAT_PATHS.map((path, k) => { const r = makeRat(); r.userData = { ...r.userData, path, i: 0, x: path[0][0], z: path[0][1], wait: k * .7, phase: k }; r.position.set(path[0][0], -1.04, path[0][1]); return r; });
  function stepRats(dt, t) {
    rats.forEach((r, k) => {
      const u = r.userData;
      let rear = 0, walk = 0;
      if (u.wait > 0) {
        // stopped: sniff the air, and now and then sit up on the hind legs to look around
        u.wait -= dt; r.rotation.y += Math.sin(t * 6 + k) * .006;
        if (u.sitUp) rear = Math.min(1, Math.min(u.wait, u.waited += dt) * 2.5);
        u.torso.children[2].position.y = .05 + Math.sin(t * 18 + k) * .002;
      } else {
        const [tx, tz] = u.path[(u.i + 1) % u.path.length], dx = tx - u.x, dz = tz - u.z, d = Math.hypot(dx, dz), sp = .75 * dt;
        if (d < sp) { u.i = (u.i + 1) % u.path.length; u.x = tx; u.z = tz; u.wait = .6 + ((k * 7 + u.i * 3) % 5) * .4; u.sitUp = k !== 0 && (k + u.i) % 2 === 0; u.waited = 0; }
        else { u.x += dx / d * sp; u.z += dz / d * sp; const want = Math.atan2(-dz, dx); r.rotation.y += Math.atan2(Math.sin(want - r.rotation.y), Math.cos(want - r.rotation.y)) * Math.min(1, dt * 10); }
        walk = 1;
      }
      // on the ties between the rails, or down on the ballast past their ends
      r.position.set(u.x, (u.z > 1.12 ? -1.1 : -1.04) + walk * Math.abs(Math.sin(t * 16 + k)) * .006, u.z);
      u.torso.rotation.z = rear * .95;
      u.torso.position.y = .03 + rear * .02;
      u.legs.forEach((lg, j) => { lg.rotation.z = walk ? Math.sin(t * 16 + k + lg.userData.ph * Math.PI) * .35 : (j < 2 ? rear * -.9 : 0); });
      u.tail.rotation.y = Math.sin(t * (walk ? 8 : 3) + k) * (walk ? .25 : .12);
    });
    // the first rat has a slice of pizza and won't let go
    const r0 = rats[0]; pizza.position.set(r0.position.x + Math.cos(r0.rotation.y) * .3, r0.position.y + .004, r0.position.z - Math.sin(r0.rotation.y) * .3); pizza.rotation.y = r0.rotation.y;
  }

  // a newsstand by the Knowledge Assistant poster: a green booth with its flap propped up, magazines clipped
  // along the top, candy packed on the shelves, chips hanging at the sides, a cooler, papers and coffee cups
  const stand = new THREE.Group(); stand.position.set(15.35, 0, WALL + .55); plat.add(stand);
  const standGreen = env(new THREE.MeshPhysicalMaterial({ color: '#1f3d31', roughness: .45, clearcoat: .4 }), .4);
  const standDark = env(new THREE.MeshStandardMaterial({ color: '#122a21', roughness: .6 }), .3);
  const lit = (t) => new THREE.MeshBasicMaterial({ map: t, color: '#e6e1d6', toneMapped: false });
  // magazine covers, all made up: a masthead, a face, a few cover lines
  const MAST = ['METRO', 'LOOK', 'GOTHAM', 'MODE', 'CITY', 'NIGHT', 'FORM', 'BYTE', 'STYLE', 'WIRE', 'POP', 'SCENE', 'LUXE', 'WEEK', 'MUSE', 'DATA'];
  const COVER = ['#c8322a', '#f3ecdc', '#e8b51f', '#2c4d78', '#16181c', '#d9a7b5', '#2f6b45', '#f08a3c', '#eae6dc', '#7a3a5a', '#3a8fc2', '#1d1d1d', '#c9b48a', '#e14b6b', '#8fb8a2', '#f2f0ea'];
  const SKIN = ['#e8c2a0', '#a9714b', '#6b4430', '#f0d2b8', '#c48e64', '#8a5a3c'];
  const CW = 160, CH = 214, COLS = 8;
  const covers = canvasTex(CW * COLS, CH * 2, (c) => {
    MAST.forEach((name, i) => {
      const x0 = (i % COLS) * CW, y0 = Math.floor(i / COLS) * CH, bg = COVER[i], dark = ['#16181c', '#1d1d1d', '#2c4d78', '#7a3a5a', '#2f6b45'].includes(bg);
      c.fillStyle = bg; c.fillRect(x0, y0, CW, CH);
      const sk = SKIN[i % SKIN.length], hx = x0 + CW * (.42 + rand() * .16), hy = y0 + CH * .5;
      c.fillStyle = ['#1b120d', '#4a2c1a', '#c9a25a', '#0d0d0d', '#7a2f1c'][i % 5]; c.beginPath(); c.ellipse(hx, hy - 6, 38, 46, 0, 0, 7); c.fill();
      c.fillStyle = sk; c.beginPath(); c.ellipse(hx, hy + 4, 27, 35, 0, 0, 7); c.fill();
      c.fillStyle = 'rgba(0,0,0,.35)'; c.fillRect(hx - 15, hy - 2, 9, 3); c.fillRect(hx + 6, hy - 2, 9, 3);
      c.fillStyle = '#a3383a'; c.fillRect(hx - 8, hy + 22, 16, 4);
      c.fillStyle = ['#f2f0ea', '#16181c', '#c8322a', '#2c4d78', '#e8b51f'][(i + 2) % 5]; c.beginPath(); c.ellipse(hx, y0 + CH + 18, 70, 70, 0, Math.PI, 0); c.fill();
      c.fillStyle = sk; c.fillRect(hx - 9, hy + 34, 18, 18);
      c.fillStyle = dark ? '#f6f1e6' : ['#c8322a', '#16181c'][i % 2]; c.textAlign = 'center';
      let fs = 60; c.font = `700 ${fs}px "Old Standard TT", Georgia`; while (c.measureText(name).width > CW - 16) { fs -= 3; c.font = `700 ${fs}px "Old Standard TT", Georgia`; }
      c.fillText(name, x0 + CW / 2, y0 + 56);
      c.fillStyle = dark ? 'rgba(255,255,255,.8)' : 'rgba(0,0,0,.7)';
      for (let k = 0; k < 3; k++) c.fillRect(x0 + 10, y0 + 96 + k * 16, 30 + rand() * 18, 5);
      c.fillStyle = ['#e8b51f', '#f6f1e6', '#c8322a'][i % 3]; c.fillRect(x0 + CW - 52, y0 + 150, 42, 8);
    });
    c.textAlign = 'left';
  });
  const coverMat = env(new THREE.MeshStandardMaterial({ map: covers, roughness: .35 }), .3);
  const cover = (i, w = .2, h = .27) => {
    const g = new THREE.PlaneGeometry(w, h), uv = g.attributes.uv, u0 = (i % COLS) / COLS, v0 = 1 - (Math.floor(i / COLS) + 1) / 2;
    for (let k = 0; k < uv.count; k++) uv.setXY(k, u0 + uv.getX(k) / COLS, v0 + uv.getY(k) / 2);
    const m = new THREE.Mesh(g, coverMat); m.receiveShadow = true; return m;
  };
  // candy shelves: rows of wrappers, bright and packed tight
  const WRAP = ['#c8322a', '#f2c230', '#5b2a1a', '#2c6bb0', '#f08a3c', '#e14b6b', '#1f7a3e', '#7a3a8a', '#f6f1e6', '#16181c'];
  const candy = canvasTex(1024, 512, (c, w, h) => {
    c.fillStyle = '#2a1d14'; c.fillRect(0, 0, w, h);
    for (let row = 0; row < 4; row++) {
      const y = row * 128; c.fillStyle = '#9da2a8'; c.fillRect(0, y + 116, w, 12); c.fillStyle = '#f6f1e6'; c.fillRect(0, y + 117, w, 6);
      for (let x = 0; x < w;) {
        const bw = 22 + Math.floor(rand() * 4) * 8, bh = 70 + rand() * 30, col = WRAP[Math.floor(rand() * WRAP.length)];
        for (let s = 0; s < 3; s++) { c.fillStyle = col; c.fillRect(x + s * 2, y + 116 - bh + s * 4, bw - 2, bh); }
        c.fillStyle = 'rgba(255,255,255,.75)'; c.fillRect(x + 3, y + 116 - bh + 20, bw - 8, 7);
        c.fillStyle = WRAP[(WRAP.indexOf(col) + 3) % WRAP.length]; c.fillRect(x + 3, y + 116 - bh + 34, bw - 8, 10);
        c.fillStyle = 'rgba(255,255,255,.25)'; c.fillRect(x + 2, y + 116 - bh, 3, bh);
        x += bw + 2;
      }
    }
    // a hand-lettered price card
    c.fillStyle = '#f6f1e6'; c.fillRect(820, 140, 120, 56); c.fillStyle = '#16181c'; c.font = '700 26px "Courier Prime", monospace'; c.fillText('CANDY', 838, 164); c.fillText('$1.25', 838, 190);
  });
  // chip bags on a clip strip
  const chips = canvasTex(128, 640, (c, w, h) => {
    c.clearRect(0, 0, w, h); c.fillStyle = '#9da2a8'; c.fillRect(w / 2 - 3, 0, 6, h);
    for (let k = 0; k < 7; k++) { const y = 8 + k * 90, col = WRAP[(k * 3 + 1) % WRAP.length]; c.fillStyle = col; c.beginPath(); c.moveTo(18, y); c.lineTo(110, y); c.lineTo(104, y + 82); c.lineTo(24, y + 82); c.fill(); c.fillStyle = 'rgba(255,255,255,.8)'; c.fillRect(30, y + 28, 68, 14); c.fillStyle = 'rgba(0,0,0,.2)'; c.fillRect(18, y, 92, 6); c.fillStyle = '#d9d2c2'; c.fillRect(w / 2 - 8, y - 4, 16, 10); }
  });
  const chipMat = new THREE.MeshStandardMaterial({ map: chips, transparent: true, alphaTest: .5, roughness: .45, side: THREE.DoubleSide });
  // the cooler: lit shelves of bottles and cans
  const cooler = canvasTex(256, 640, (c, w, h) => {
    c.fillStyle = '#f2f6f8'; c.fillRect(0, 0, w, h);
    c.fillStyle = '#c8322a'; c.fillRect(0, 0, w, 44); c.fillStyle = '#2c6bb0'; c.fillRect(0, 30, w, 8); c.fillStyle = '#f2c230'; c.fillRect(0, 38, w, 6);
    for (let r = 0; r < 5; r++) {
      const y = 60 + r * 116; c.fillStyle = '#aab0b6'; c.fillRect(0, y + 106, w, 6);
      for (let x = 8; x < w - 20; x += 30) {
        const col = ['#c8322a', '#f08a3c', '#f2c230', '#2c6bb0', '#1f7a3e', '#e8eef2', '#7a3a8a'][Math.floor(rand() * 7)];
        if (r === 4) { c.fillStyle = col; c.fillRect(x, y + 58, 24, 46); c.fillStyle = '#c3c7cc'; c.fillRect(x, y + 54, 24, 6); continue; }
        c.fillStyle = col; c.globalAlpha = .85; c.fillRect(x, y + 34, 24, 70); c.beginPath(); c.moveTo(x, y + 34); c.lineTo(x + 8, y + 12); c.lineTo(x + 16, y + 12); c.lineTo(x + 24, y + 34); c.fill(); c.globalAlpha = 1;
        c.fillStyle = '#f6f1e6'; c.fillRect(x, y + 56, 24, 18); c.fillStyle = '#16181c'; c.fillRect(x + 8, y + 4, 8, 9);
      }
    }
    c.fillStyle = 'rgba(255,255,255,.18)'; c.fillRect(30, 0, 18, h); c.fillRect(64, 0, 6, h);
  });
  // the day's papers, folded on the counter
  const paper = canvasTex(256, 160, (c, w, h) => {
    c.fillStyle = '#ebe6d8'; c.fillRect(0, 0, w, h); c.fillStyle = '#16181c'; c.font = '700 30px "Old Standard TT", Georgia'; c.textAlign = 'center'; c.fillText('THE DAILY', w / 2, 34); c.fillRect(10, 42, w - 20, 2);
    c.font = '700 34px Anton, Impact'; c.fillText('TRAINS RUN LATE', w / 2, 84); c.fillStyle = '#9a958a'; for (let k = 0; k < 5; k++) c.fillRect(14, 98 + k * 11, w - 28, 5);
  });
  const paperMat = env(new THREE.MeshStandardMaterial({ map: paper, roughness: .8 }), .2);
  const paperEdge = env(new THREE.MeshStandardMaterial({ color: '#dcd6c6', roughness: .9 }), .2);
  // the blue paper coffee cup every deli in the city hands out
  const cupTex = canvasTex(256, 96, (c, w, h) => {
    c.fillStyle = '#2b5fa6'; c.fillRect(0, 0, w, h); c.fillStyle = '#f6f1e6';
    for (let x = 0; x < w; x += 16) { c.fillRect(x, 8, 12, 3); c.fillRect(x, 8, 3, 9); c.fillRect(x, h - 14, 12, 3); c.fillRect(x + 9, h - 23, 3, 9); }
    c.fillStyle = '#f2c230'; c.font = '700 15px "Old Standard TT", Georgia'; c.textAlign = 'center'; c.fillText('WE ARE HAPPY', w / 2, 46); c.fillText('TO SERVE YOU', w / 2, 64);
  });
  const cupMat = env(new THREE.MeshStandardMaterial({ map: cupTex, roughness: .5 }), .3);

  // the booth: back, sides, a roof with an overhang, and a lower cabinet
  put(stand, mk(new THREE.BoxGeometry(2.2, 2.3, .06), standGreen), 0, 1.15, -.42);
  [-1, 1].forEach((sx) => put(stand, mk(new THREE.BoxGeometry(.06, 2.3, .92), standGreen), sx * 1.07, 1.15, 0));
  const roof = put(stand, mk(new THREE.BoxGeometry(2.36, .07, 1.2), standGreen), 0, 2.35, .1); roof.rotation.x = .06;
  put(stand, mk(new THREE.BoxGeometry(2.14, .6, .5), standGreen), 0, .3, .2);
  [.0, .6].forEach((y) => put(stand, mk(new THREE.BoxGeometry(2.18, .03, .52), standDark), 0, y + .015, .2));
  // the header board, lettered like the old stands
  const standSign = canvasTex(1024, 160, (c, w, h) => {
    c.fillStyle = '#1a3329'; c.fillRect(0, 0, w, h); c.strokeStyle = '#c9a24a'; c.lineWidth = 3; c.strokeRect(10, 10, w - 20, h - 20);
    c.fillStyle = '#f2ede0'; c.textAlign = 'center'; c.font = '700 70px "Old Standard TT", Georgia'; c.fillText('NEWS · CANDY · COFFEE', w / 2, 102);
    c.font = '500 20px "Geist Mono", monospace'; c.fillStyle = '#c9a24a'; c.fillText('OPEN EARLY  ·  CLOSE LATE', w / 2, 136);
  });
  put(stand, new THREE.Mesh(new THREE.PlaneGeometry(2.14, .34), new THREE.MeshStandardMaterial({ map: standSign, roughness: .5 })), 0, 2.13, .465);
  put(stand, mk(new THREE.BoxGeometry(2.2, .36, .04), standGreen), 0, 2.13, .44);
  // the flap, propped up over the counter, with a fluorescent tube under it
  const flapG = new THREE.Group(); flapG.position.set(0, 1.93, .46); flapG.rotation.x = -.22; stand.add(flapG);
  put(flapG, mk(new THREE.BoxGeometry(2.1, .03, .5), standGreen), 0, 0, .25);
  put(stand, new THREE.Mesh(new THREE.BoxGeometry(1.7, .025, .025), new THREE.MeshBasicMaterial({ color: '#fdfaf0', toneMapped: false })), 0, 1.9, .62);
  // inside: the candy wall, a row of magazines clipped along the top, the cooler on the right
  put(stand, new THREE.Mesh(new THREE.PlaneGeometry(1.45, .78), lit(candy)), -.27, 1.38, -.385);
  [1.0, 1.19, 1.39, 1.58, 1.77].forEach((y) => put(stand, mk(new THREE.BoxGeometry(1.45, .015, .14), standDark), -.27, y, -.32));
  put(stand, mk(new THREE.CylinderGeometry(.004, .004, 2.1, 6), poleMat), 0, 1.97, .3).rotation.z = Math.PI / 2;
  for (let k = 0; k < 9; k++) { const m = cover((k * 5) % 16, .2, .26); m.position.set(-.92 + k * .23, 1.83, .3 + (k % 2) * .004); m.rotation.x = -.05; stand.add(m); }
  put(stand, mk(new THREE.BoxGeometry(.52, 1.3, .38), standDark), .76, 1.26, -.2);
  put(stand, new THREE.Mesh(new THREE.PlaneGeometry(.44, 1.18), lit(cooler)), .76, 1.27, -.005);
  put(stand, mk(new THREE.BoxGeometry(.02, .3, .02), poleMat), .55, 1.27, .01);
  const coolGlass = new THREE.Mesh(new THREE.PlaneGeometry(.46, 1.2), new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: .05, transparent: true, opacity: .12, depthWrite: false }));
  coolGlass.position.set(.76, 1.27, .0); coolGlass.renderOrder = 2; stand.add(coolGlass);
  // chips hanging down both sides of the opening
  [-.98, .99].forEach((x) => { const s = new THREE.Mesh(new THREE.PlaneGeometry(.14, .7), chipMat); s.position.set(x, 1.45, .42); stand.add(s); });
  // the counter, with the papers stacked on it and the coffee at one end
  put(stand, mk(new THREE.BoxGeometry(2.12, .04, .42), standDark), 0, .98, .2);
  [[-.55, .3], [-.2, .24], [.2, .2]].forEach(([x, n], k) => {
    const st = new THREE.Group(); st.position.set(x, 1.0, .25); st.rotation.y = (k - 1) * .08; stand.add(st);
    const hgt = n * .3; put(st, mk(new THREE.BoxGeometry(.3, hgt, .2), paperEdge), 0, hgt / 2, 0);
    const top = new THREE.Mesh(new THREE.PlaneGeometry(.3, .2), paperMat); top.rotation.x = -Math.PI / 2; top.position.y = hgt + .001; st.add(top);
  });
  put(stand, mk(new THREE.CylinderGeometry(.08, .09, .3, 24), poleMat), .6, 1.15, .18);
  put(stand, mk(new THREE.CylinderGeometry(.012, .012, .05, 8), rubber), .6, 1.05, .27).rotation.x = Math.PI / 2;
  for (let k = 0; k < 4; k++) { const cup = mk(new THREE.CylinderGeometry(.034, .026, .085, 20, 1, true), cupMat); cup.position.set(.78 + (k % 2) * .08, 1.043 + (k > 1 ? .02 : 0), .3 - Math.floor(k / 2) * .07); stand.add(cup); }
  // the stepped magazine rack across the front, covers leaning back
  [[.66, .44, 0], [.86, .3, 8]].forEach(([y, z, o]) => {
    put(stand, mk(new THREE.BoxGeometry(2.14, .05, .02), standDark), 0, y - .12, z + .07);
    for (let k = 0; k < 8; k++) { const m = cover((k + o) % 16); m.position.set(-.89 + k * .254, y, z); m.rotation.x = -.32; stand.add(m); }
  });
  // a poster pasted on the side you walk up to: a night skyline under a masthead
  const kioskPoster = canvasTex(480, 640, (c, w, h) => {
    const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#0d1630'); g.addColorStop(.55, '#3a3f6b'); g.addColorStop(.8, '#c9765a'); g.addColorStop(1, '#f0b673'); c.fillStyle = g; c.fillRect(0, 0, w, h);
    for (let k = 0; k < 120; k++) { c.fillStyle = `rgba(255,255,255,${rand() * .6})`; c.fillRect(rand() * w, rand() * h * .4, 1.5, 1.5); }
    let x = 0; while (x < w) { const bw = 30 + rand() * 50, bh = 140 + rand() * 300; c.fillStyle = '#0b0e18'; c.fillRect(x, h - bh, bw, bh); for (let wy = h - bh + 10; wy < h - 10; wy += 14) for (let wx = x + 5; wx < x + bw - 6; wx += 10) if (rand() > .55) { c.fillStyle = rand() > .3 ? '#ffd27a' : '#cfe0ff'; c.fillRect(wx, wy, 4, 6); } x += bw + 2; }
    c.fillStyle = '#f6f1e6'; c.textAlign = 'center'; c.font = '700 120px "Old Standard TT", Georgia'; c.fillText('METRO', w / 2, 120);
    c.font = '500 22px "Geist Mono", monospace'; c.fillText('THE CITY AFTER DARK', w / 2, 158);
    c.textAlign = 'left'; c.font = '700 34px Anton, Impact'; c.fillText('LAST TRAIN', 26, 250); c.font = '400 22px Geist, Arial'; c.fillText('Who rides at 3 a.m.', 26, 280);
  });
  const side = new THREE.Mesh(new THREE.PlaneGeometry(.6, .8), env(new THREE.MeshStandardMaterial({ map: kioskPoster, roughness: .35 }), .3)); side.position.set(-1.105, 1.35, .05); side.rotation.y = -Math.PI / 2; stand.add(side);
  // a green paper box beside it
  const box2 = new THREE.Group(); box2.position.set(1.45, 0, .1); stand.add(box2);
  put(box2, mk(new THREE.BoxGeometry(.36, .82, .34), standGreen), 0, .41, 0);
  const bw = new THREE.Mesh(new THREE.PlaneGeometry(.26, .22), paperMat); bw.position.set(0, .62, .171); box2.add(bw);
  const freeTex = canvasTex(128, 40, (c, w, h) => { c.fillStyle = '#1a3329'; c.fillRect(0, 0, w, h); c.fillStyle = '#f2ede0'; c.font = '700 28px Geist, Arial'; c.textAlign = 'center'; c.fillText('FREE', w / 2, 30); });
  put(box2, new THREE.Mesh(new THREE.PlaneGeometry(.2, .06), new THREE.MeshStandardMaterial({ map: freeTex, roughness: .5 })), 0, .78, .171);
  const standLight = new THREE.PointLight('#fff2d6', 1.6, 3.2, 1.6); standLight.position.set(0, 1.8, .7); stand.add(standLight);
  const innerLight = new THREE.PointLight('#ffe7c0', 1.4, 1.8, 1.8); innerLight.position.set(-.2, 1.6, .05); stand.add(innerLight);

  /* ---------- getting on and off ---------- */
  let mode = 'car', line = null, lineId = null;
  const doorsOpen = (on, d = .9) => doors.forEach((dr) => G && !reduce ? G.to(dr.leaf.position, { x: on ? dr.s * .33 : 0, duration: d, ease: 'power2.inOut' }) : (dr.leaf.position.x = on ? dr.s * .33 : 0));
  function stopLoop() { if (loopCall) loopCall.kill(); G.killTweensOf(station.position); station.visible = false; }
  const isPortrait = () => innerWidth / innerHeight < .9;
  const standView = () => spotView(lineId || 'sourcer');
  const cur = { px: 0, py: 0, pz: 0, lx: 0, ly: 0, lz: 0, fov: 50 }, last = { x: 0, z: 0 };
  const doorView = { px: DOOR_X, py: 1.6, pz: WZ + 1.0, lx: DOOR_X, ly: 1.4, lz: WALL, fov: 58 };
  // a phone held upright sees a narrow slice, so the walking views open wider there
  const wide = (fov, tall) => isPortrait() ? tall : fov;
  function setLine(id, i = 0) {
    const fromLine = lb.line; line = LINES[id]; lineId = id; tabletLine = line; tabletTex.userData.redraw();
    show(i, fromLine);
  }
  function show(i, fromLine) {
    const prev = lb.i; lb.fromLine = fromLine || lb.line; lb.from = fromLine ? 0 : prev; lb.line = line; lb.i = i; lb.anim = 0;
    lb.dir = fromLine || i >= prev ? 1 : -1;
    if (reduce || !G || (!fromLine && i === prev && lb.roll >= 1 && lb.started)) { lb.roll = 1; lb.anim = 1; }
    else { lb.roll = lb.started ? 0 : 1; }
    lb.started = true;
    setFlap(`${line.name} · ${line.stops[i].label}`);
    onStop(lineId, i);
  }
  function enterPlatform(id, done) {
    // a view across the tracks has to wait for the train to clear before turning to it
    const across = SPOTS[id][isPortrait() ? 'mob' : 'desk'].lz > 0;
    stopLoop(); lineId = id; placePoster(id); lightbox.visible = true; lb.started = false; lb.line = null; setLine(id, 0);
    // still pulling out of the last stop: let that platform run out, then the next one comes in
    let pre = 0;
    if (departTl) { departTl.kill(); departTl = null; if (plat.position.x < -.05) pre = Math.max(.3, (plat.position.x - EXIT_X) / 9); }
    const moving = train.v > .05 || pre > 0;
    plat.visible = true; if (!pre) plat.position.x = moving ? ENTER_X : 0;
    tunnel.visible = false; runLights.forEach((m) => { m.visible = false; });
    trainA.visible = false;
    if (reduce || !G) { plat.position.x = 0; train.v = 0; homeCar(false); trainA.visible = true; trainA.position.x = 0; tunnel.visible = false; Object.assign(view, standView()); Object.assign(cur, standView()); mode = 'platform'; done(); return; }
    camBusy = true; mode = 'entering'; G.killTweensOf(view);
    // the platform slides into the windows at train speed and comes to a stop
    const Tm = moving ? 2 * Math.abs(ENTER_X) / 9 : 1.4, T = pre + Tm; // when already stopped, the time to walk up to the door
    train.v = 0;
    G.timeline({ onComplete: () => { Object.assign(cur, view); camBusy = false; mode = 'platform'; done(); } })
      .to(plat.position, { keyframes: [...(pre ? [{ x: EXIT_X, duration: pre, ease: 'none' }, { x: ENTER_X, duration: 0 }] : []), { x: 0, duration: moving ? Tm : .01, ease: 'power2.out' }] }, 0)
      // turn to face the door first, then walk to it, so the first thing you see is the door, not a window
      .to(view, { lx: doorView.lx, ly: doorView.ly, lz: doorView.lz, fov: wide(doorView.fov, 74), duration: Math.min(T, .8), ease: 'power2.out' }, moving ? 0 : .01)
      // from a close look at something, step back into the aisle before heading for the door
      .to(view, { keyframes: [{ px: (view.px + doorView.px) / 2, py: 1.6, pz: Math.max(view.pz, CAR_ZC), duration: Math.min(T, 1.6) * .45, ease: 'power1.out' }, { px: doorView.px, py: doorView.py, pz: doorView.pz, duration: Math.min(T, 1.6) * .55, ease: 'power1.inOut' }] }, moving ? 0 : .01)
      // as it stops, the train around the cabin is there too, so stepping out never swaps anything
      .add(() => { trainA.position.x = 0; trainA.userData.doors.forEach((dr) => { dr.leaf.position.x = dr.home; }); homeCar(true); trainA.visible = true; doorsOpen(true); doorsA(true, .9); }, T - .2)
      // one continuous step: out through the door, clear of the car, turning toward the poster
      .to(view, { pz: -2.2, ly: 1.5, duration: 1.2, ease: 'power1.inOut' }, T + .75)
      // only once clear of the car's side does the walk along the platform begin, so it never cuts through the steel
      .to(view, { ...standView(), duration: 1.6 + Math.abs(standView().px - DOOR_X) * .12, ease: 'power2.inOut', overwrite: 'auto' }, across ? T + 3.1 : T + 1.75)
      // the train we came on shuts its doors and pulls out behind you
      .add(() => {
        doorsOpen(false, .6); doorsA(false, .6);
        G.to(trainA.position, { x: 70, duration: across ? 2.6 : 3.8, ease: 'power2.in', delay: .7, onStart: () => homeCar(false),
          onComplete: () => { trainA.visible = false; if (mode === 'platform') trainCall = G.delayedCall(6, trainCycle); } });
      }, T + 1.5)
  }
  // a train standing at the platform shuts its doors and pulls out; returns how long to wait for it
  function clearTrain() {
    if (trainCall) trainCall.kill(); if (trainTl) trainTl.kill();
    if (!trainA.visible || trainA.position.x > 30) return 0;
    G.killTweensOf(trainA.position);
    const done = () => { trainA.visible = false; if (mode === 'platform') trainCall = G.delayedCall(8, trainCycle); };
    // still deep in the tunnel: it simply never arrives
    if (trainA.position.x < -25) { done(); return 0; }
    // standing at the platform: doors shut, then it pulls out
    if (Math.abs(trainA.position.x) < .5) { doorsA(false, .45); doorsOpen(false, .45); G.to(trainA.position, { x: 70, duration: 2.6, ease: 'power2.in', delay: .5, onStart: () => homeCar(false), onComplete: done }); return 1.6; }
    // pulling in: it runs on through instead of stopping
    const x0 = trainA.position.x; doorsA(false, .2);
    G.to(trainA.position, { x: 70, duration: (70 - x0) / 22, ease: 'none', onComplete: done });
    return Math.max(0, (30 - x0) / 22);
  }
  function switchLine(id) {
    // walk to the next project's spot; its poster lights up as you arrive
    if (mode !== 'platform' || !G || reduce) { lineId = id; placePoster(id); setLine(id, 0); Object.assign(cur, standView()); return; }
    const to = spotView(id), dist = Math.hypot(to.px - cur.px, to.pz - cur.pz), T = 1.8 + dist * .14;
    // looking across the tracks needs them empty first
    const wait = to.lz > 0 ? clearTrain() : 0;
    G.killTweensOf(cur); G.killTweensOf(placard);
    // the placard fades while you walk and comes back with the new project as you arrive
    G.timeline({ delay: wait })
      .to(cur, { ...to, duration: T, ease: 'power2.inOut' }, 0)
      .to(placard, { opacity: 0, y: 12, duration: .3, ease: 'power2.in' }, 0)
      .add(() => { lightbox.visible = false; }, T * .12)
      .add(() => { lineId = id; placePoster(id); lightbox.visible = true; lb.started = false; lb.line = null; setLine(id, 0); if (trainCall) { trainCall.kill(); trainCall = G.delayedCall(4, trainCycle); } }, T * .35)
      .to(placard, { opacity: 1, y: 0, duration: .45, ease: 'power2.out' }, T * .8);
  }
  function leavePlatform(done) {
    mode = 'leaving';
    if (trainCall) trainCall.kill(); if (trainTl) trainTl.kill(); if (G) { G.killTweensOf(trainA.position); trainA.userData.doors.forEach((dr) => G.killTweensOf(dr.leaf.position)); }
    // inside: shut the doors and pull out
    const depart = () => {
      departTl = G.timeline({ onComplete: () => { departTl = null; } })
        .add(() => doorsOpen(false, .8), 0)
        .add(() => { trainA.visible = false; }, .9)
        .to(plat.position, { x: EXIT_X, duration: 2 * Math.abs(EXIT_X) / 9, ease: 'power2.in' }, 1.0)
        .add(() => { plat.visible = false; tunnel.visible = true; runLights.forEach((m) => { m.visible = true; }); plat.position.x = 0; train.v = 1; loopCall = G.delayedCall(6, arrive); });
    };
    if (reduce || !G) { homeCar(true); trainA.visible = false; doors.forEach((dr) => { dr.leaf.position.x = 0; }); plat.visible = false; tunnel.visible = true; runLights.forEach((m) => { m.visible = true; }); train.v = 1; Object.assign(view, homeView); mode = 'car'; done(); return; }
    camBusy = true;
    const waiting = trainA.visible && trainA.position.x > -1 && trainA.position.x < 1;
    const openNow = waiting && Math.abs(trainA.userData.doors[0].leaf.position.x - trainA.userData.doors[0].home) > .15;
    trainA.visible = true; trainA.position.x = waiting ? 0 : -60; if (!waiting) { doorsA(false, .01); homeCar(false); }
    const walk = 1.4 + Math.abs(view.px - DOOR_X) * .1, ARR = 3.4;
    // the cabin takes over car 2 once the train is standing still, with its doors where the train's are
    const settle = () => { homeCar(true); doors.forEach((dr) => { dr.leaf.position.x = openNow ? dr.s * .33 : 0; }); doorsOpen(true, openNow ? .01 : .9); doorsA(true, openNow ? .01 : .9); };
    const tl = G.timeline();
    let t0;
    if (waiting) {
      tl.add(settle, 0).to(view, { px: DOOR_X, py: 1.6, pz: -2.4, lx: DOOR_X, ly: 1.45, lz: 2, fov: wide(58, 74), duration: walk, ease: 'power2.inOut' }, 0);
      t0 = Math.max(walk, openNow ? 0 : 1);
    } else {
      // stand back by the door and look down the platform as the train pulls in, then turn to it as it stops
      tl.to(trainA.position, { x: 0, duration: ARR, ease: 'power3.out' }, 0)
        .to(view, { px: DOOR_X + 1.4, py: 1.6, pz: wide(-2.9, -3.3), lx: DOOR_X - 9, ly: 1.15, lz: wide(-.6, -1.9), fov: wide(56, 80), duration: Math.min(walk, ARR - 1), ease: 'power2.inOut' }, 0)
        .to(view, { px: DOOR_X, pz: -2.4, lx: DOOR_X, ly: 1.45, lz: 2, fov: wide(58, 74), duration: 1.1, ease: 'power2.inOut' }, ARR - .7)
        .add(settle, ARR + .05);
      t0 = ARR + 1.0;
    }
    // step in through the door, turn along the car, and sit facing the windows
    tl.to(view, { pz: -.6, ly: 1.4, duration: 1.1, ease: 'power1.inOut' }, t0)
      .to(view, { px: DOOR_X + 1.0, pz: .15, lx: 2.6, ly: 1.2, lz: 1.9, fov: homeView.fov, duration: .9, ease: 'power1.inOut' }, t0 + .85)
      .to(view, { ...homeView, duration: 1.2, ease: 'power2.inOut' }, t0 + 1.6)
      .add(depart, t0 + 1.9)
      // seated: the car is yours again while the platform slides away
      .add(() => { camBusy = false; mode = 'car'; done(); }, t0 + 2.8);
  }
  function step(d) {
    if (mode !== 'platform' || !line) return;
    const i = Math.max(0, Math.min(line.stops.length - 1, lb.i + d));
    if (i !== lb.i) show(i);
  }
  function platformClick(e) {
    ndc.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    if (ray.intersectObject(lbFace, false).length) step(lb.i < line.stops.length - 1 ? 1 : -(line.stops.length - 1));
  }
  let lbFrameT = 0;
  function platformFrame(dt, t) {
    if (mode === 'platform') {
      // a step bob while walking between spots, a slow sway while standing
      const speed = Math.hypot(cur.px - last.x, cur.pz - last.z) / Math.max(dt, .001); last.x = cur.px; last.z = cur.pz;
      const bob = Math.min(1, speed / 3) * Math.abs(Math.sin(t * 7)) * .035;
      view.px = cur.px + Math.sin(t * .3) * .04; view.py = cur.py + Math.sin(t * .5) * .015 + bob; view.pz = cur.pz; view.lx = cur.lx; view.ly = cur.ly + bob * .5; view.lz = cur.lz; view.fov = cur.fov;
    }
    stepRats(dt, t);
    platLights.forEach((l) => { l.intensity = 2.4; }); lbGlow.intensity = 1.2;
    stepFlap(dt);
    if (lb.line) {
      lbFrameT += dt;
      const moving = lb.roll < 1 || lb.anim < 1;
      if (lb.roll < 1) lb.roll = Math.min(1, lb.roll + dt / .9);
      else if (lb.anim < 1) lb.anim = Math.min(1, lb.anim + dt / 2.2);
      if (moving && lbFrameT > 1 / 30) { lbFrameT = 0; lbTex.userData.redraw(); }
    }
  }
  let onStop = () => {};

  /* ---------- picking ---------- */
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(9, 9), mouse = { x: 0, y: 0, sx: 0, sy: 0 };
  let hovered = null, downAt = null;
  addEventListener('pointermove', (e) => { mouse.x = e.clientX / innerWidth * 2 - 1; mouse.y = -(e.clientY / innerHeight) * 2 + 1; ndc.set(mouse.x, mouse.y); mouse.cx = e.clientX; mouse.cy = e.clientY; });
  canvas.addEventListener('pointerleave', () => ndc.set(9, 9));
  const pick = () => { if (open) return null; ray.setFromCamera(ndc, camera); const h = ray.intersectObjects(hit, false)[0]; return h ? h.object.userData.go : null; };
  canvas.addEventListener('pointerdown', (e) => { downAt = { x: e.clientX, y: e.clientY }; });
  canvas.addEventListener('click', (e) => {
    if (downAt && Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 6) return;
    if (mode === 'platform') { platformClick(e); return; }
    if (mode !== 'car') return;
    ndc.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
    const id = pick(); if (id) navigate(id);
  });
  function setHover(id) {
    if (id === hovered) return; hovered = id; canvas.style.cursor = id ? 'pointer' : '';
    document.querySelectorAll('.nav [data-go]').forEach((b) => b.classList.toggle('hot', b.dataset.go === id));
    if (!open) nudge(id, .015);
  }
  document.querySelectorAll('.nav [data-go]').forEach((b) => {
    b.addEventListener('pointerenter', () => !open && setHover(b.dataset.go));
    b.addEventListener('pointerleave', () => !open && setHover(null));
  });

  /* ---------- loop ---------- */
  const clock = new THREE.Clock(); let typeT = 0, blinkT = 0, visible = true;
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; });
  const power = { k: 0 };
  function frame() {
    requestAnimationFrame(frame);
    if (!visible) return;
    const dt = Math.min(clock.getDelta(), .05), t = clock.elapsedTime;
    const v = reduce ? 0 : train.v;
    tunnelTex.offset.x += dt * 2.2 * v; // 9 scene units a second, the speed the platform arrives at
    let near = 0;
    runLights.forEach((m) => { m.position.x -= dt * 9 * v; if (m.position.x < -5.5) m.position.x += 10.5; near = Math.max(near, 1 - Math.min(1, Math.abs(m.position.x) / 1.6)); });
    sweep.intensity = near * 2.2 * power.k * v;
    stationLight.intensity = station.visible ? 2.4 * (1 - Math.min(1, Math.abs(station.position.x) / 6)) * power.k : 0;
    const rock = reduce || mode !== 'car' ? 0 : .35 + .65 * v;
    if (plat.visible) platformFrame(dt, t);
    mouse.sx += ((open ? 0 : mouse.x) - mouse.sx) * .05; mouse.sy += ((open ? 0 : mouse.y) - mouse.sy) * .05;
    if (Math.abs(camera.fov - view.fov) > .01) { camera.fov = view.fov; camera.updateProjectionMatrix(); }
    const par = reduce || mode !== 'car' ? 0 : 1;
    camera.position.set(view.px + mouse.sx * .06 * par, view.py + mouse.sy * .03 * par + Math.sin(t * 2.1) * .004 * rock, view.pz);
    look.set(view.lx + mouse.sx * .12 * par, view.ly + mouse.sy * .07 * par, view.lz); camera.lookAt(look);
    camera.rotateZ(Math.sin(t * .9) * .0035 * rock);
    tubeMat.color.setScalar(.25 + .75 * power.k); fills.forEach((l) => { l.intensity = 1.6 * power.k; }); hemi.intensity = .9 * power.k + .05; key.intensity = 1.4 * power.k; key2.intensity = 1.1 * power.k;
    typeT += dt; blinkT += dt;
    if (typeT > (typing.n >= totalChars ? 5 : .05)) { typeT = 0; typing.n = typing.n >= totalChars ? 0 : typing.n + (reduce ? totalChars : 1); screenTex.userData.redraw(); }
    if (blinkT > .5) { blinkT = 0; typing.cursor = !typing.cursor; screenTex.userData.redraw(); }
    if (mode === 'car' && !open && !camBusy) setHover(pick()); else if (open) setHover(null);
    if (hovered && !open) showTip(hovered, mouse.cx, mouse.cy); else if (!open) hideTip();
    renderer.render(scene, camera);
  }
  function intro() {
    if (reduce || !G) { Object.assign(view, homeView); power.k = 1; station.position.x = 0; frame(); return; }
    Object.assign(view, { ...homeView, pz: homeView.pz - .35, ly: homeView.ly - .05 }); camBusy = true;
    G.to(view, { ...homeView, duration: 2.6, ease: 'power3.inOut', onComplete: () => { camBusy = false; } });
    G.timeline({ delay: .3 }).to(power, { k: .7, duration: .05 }).to(power, { k: .05, duration: .09 }).to(power, { k: .85, duration: .05 }).to(power, { k: .2, duration: .12 }).to(power, { k: 1, duration: .5, ease: 'power2.out' });
    G.fromTo('.intro > *', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 1, stagger: .1, ease: 'power3.out', delay: 1.3 });
    // the first stop carries her name
    train.v = 1; station.visible = false; loopCall = G.delayedCall(.2, arrive);
    frame();
  }
  onStop = (id, i) => setStop(id, i);
  // the station's ceiling, beams and signs hang over the car; they must not put the cabin in shadow when it stands here
  const bb = new THREE.Box3();
  plat.traverse((o) => { if (o.isMesh && o.castShadow && bb.setFromObject(o).min.y > 2.3) o.castShadow = false; });
  return { focus, intro, enterPlatform, leavePlatform, switchLine, step };
}

/* ================= boot ================= */
let renderer;
try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' }); }
catch (err) { renderer = null; }

if (!renderer) {
  // no WebGL: the plain page has everything
  location.replace('lofi.html');
} else {
  progress(.1, 'Loading type');
  await Promise.race([
    Promise.all(['400 64px Newsreader', 'italic 400 64px Newsreader', '500 32px "Geist Mono"', '500 32px Geist', '400 64px UnifrakturMaguntia', '400 64px Anton', '400 32px "Old Standard TT"', '400 32px "Libre Caslon Text"', '400 32px "Courier Prime"'].map((f) => document.fonts.load(f))),
    new Promise((r) => setTimeout(r, 2500))
  ]).catch(() => {});
  progress(.3, 'Stand clear of the closing doors');
  await nextFrame();
  scene3d = buildScene();
  progress(1, 'Ready');
  await new Promise((r) => setTimeout(r, reduce ? 0 : 250));
  loader.classList.add('done');
  scene3d.intro();
  const id = hashId();
  if (id) setTimeout(() => navigate(id, { push: false }), reduce ? 0 : 500);
}

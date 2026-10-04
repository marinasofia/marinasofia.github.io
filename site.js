'use strict';

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const CANCELLED = Symbol('cancelled');
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const money = n => {
  const sign = n < 0 ? '−' : '+';
  return `${sign}$${Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
const plain = n => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function el(tag, attrs = {}, html = '') {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (key === 'class') node.className = value;
    else node.setAttribute(key, value);
  }
  if (html) node.innerHTML = html;
  return node;
}

/* ---------- Sound: needle drop, crackle, and a generated loop per album ---------- */

const MOODS = {
  sourcer:   { bpm: 104, wave: 'sawtooth', cutoff: 1300, arp: 'eighths', chords: [[57, 60, 64, 67], [53, 57, 60, 64], [50, 53, 57, 62], [52, 55, 59, 64]] },
  rekindle:  { bpm: 72,  wave: 'triangle', cutoff: 950,  arp: 'sparse',  chords: [[50, 54, 57, 61], [47, 50, 54, 57], [43, 47, 50, 54], [45, 49, 52, 57]] },
  knowledge: { bpm: 64,  wave: 'sine',     cutoff: 1500, arp: 'bells',   chords: [[48, 55, 60, 64], [45, 52, 57, 60], [41, 48, 53, 57], [43, 50, 55, 59]] },
  statement: { bpm: 90,  wave: 'square',   cutoff: 720,  arp: 'ticks',   chords: [[40, 47, 52, 59], [45, 52, 57, 64], [43, 50, 55, 62], [42, 49, 54, 61]] }
};
const mtof = m => 440 * 2 ** ((m - 69) / 12);

const sound = {
  ctx: null,
  master: null,
  muted: false,
  music: null,
  crackle: null,
  tracks: {},

  ensure() {
    if (!this.ctx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return false;
      this.ctx = new Ctx();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 0.9;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return true;
  },

  noise(seconds, pops) {
    const rate = this.ctx.sampleRate;
    const buffer = this.ctx.createBuffer(1, rate * seconds, rate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * 0.06;
      if (pops && Math.random() < 0.00035) {
        const size = 0.4 + Math.random() * 0.6;
        for (let j = 0; j < 40 && i + j < data.length; j += 1) data[i + j] += (Math.random() * 2 - 1) * size * (1 - j / 40);
      }
    }
    return buffer;
  },

  drop() {
    if (!this.ensure()) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.frequency.setValueAtTime(95, t);
    osc.frequency.exponentialRampToValueAtTime(38, t + 0.22);
    gain.gain.setValueAtTime(0.55, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    osc.connect(gain).connect(this.master);
    osc.start(t);
    osc.stop(t + 0.32);
    this.startCrackle();
    // Crackle is a short lead-in only; it fades once the music is in.
    const lead = this.crackle;
    setTimeout(() => { if (this.crackle === lead) this.stopCrackle(); }, 2600);
  },

  startCrackle() {
    if (this.crackle) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noise(3, true);
    src.loop = true;
    const band = this.ctx.createBiquadFilter();
    band.type = 'bandpass';
    band.frequency.value = 3200;
    band.Q.value = 0.6;
    const gain = this.ctx.createGain();
    gain.gain.value = 0.0001;
    gain.gain.exponentialRampToValueAtTime(0.16, this.ctx.currentTime + 0.4);
    src.connect(band).connect(gain).connect(this.master);
    src.start();
    this.crackle = { src, gain };
  },

  stopCrackle() {
    if (!this.crackle) return;
    const { src, gain } = this.crackle;
    const t = this.ctx.currentTime;
    gain.gain.cancelScheduledValues(t);
    gain.gain.setTargetAtTime(0.0001, t, 0.25);
    src.stop(t + 1.5);
    this.crackle = null;
  },

  voice(midi, start, length, wave, bus, level) {
    const osc = this.ctx.createOscillator();
    const env = this.ctx.createGain();
    osc.type = wave;
    osc.frequency.value = mtof(midi);
    osc.detune.value = (Math.random() - 0.5) * 12;
    env.gain.setValueAtTime(0.0001, start);
    env.gain.linearRampToValueAtTime(level, start + Math.min(0.8, length * 0.3));
    env.gain.setTargetAtTime(0.0001, start + length * 0.85, length * 0.25);
    osc.connect(env).connect(bus);
    osc.start(start);
    osc.stop(start + length * 1.8);
  },

  pluck(midi, start, bus, level = 0.12, wave = 'sine') {
    const osc = this.ctx.createOscillator();
    const env = this.ctx.createGain();
    osc.type = wave;
    osc.frequency.value = mtof(midi);
    env.gain.setValueAtTime(level, start);
    env.gain.exponentialRampToValueAtTime(0.0001, start + 0.9);
    osc.connect(env).connect(bus);
    osc.start(start);
    osc.stop(start + 1);
  },

  tick(start, bus) {
    const src = this.ctx.createBufferSource();
    src.buffer = this.hat || (this.hat = this.noise(0.05, false));
    const hp = this.ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 7000;
    const env = this.ctx.createGain();
    env.gain.setValueAtTime(0.5, start);
    env.gain.exponentialRampToValueAtTime(0.0001, start + 0.05);
    src.connect(hp).connect(env).connect(bus);
    src.start(start);
  },

  playGenerated(mood) {
    if (!this.ensure()) return;
    const m = MOODS[mood];
    const bus = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = m.cutoff;
    filter.Q.value = 0.5;
    bus.gain.value = 0.0001;
    bus.gain.exponentialRampToValueAtTime(0.16, this.ctx.currentTime + 2.5);
    bus.connect(filter).connect(this.master);
    const beat = 60 / m.bpm;
    let next = this.ctx.currentTime + 0.1;
    let step = 0;
    const schedule = () => {
      while (next < this.ctx.currentTime + 0.3) {
        const chord = m.chords[Math.floor(step / 8) % m.chords.length];
        const half = step % 8;
        if (half === 0) {
          chord.forEach(n => this.voice(n, next, beat * 4, m.wave, bus, 0.07));
          this.voice(chord[0] - 12, next, beat * 4, 'sine', bus, 0.16);
        }
        if (m.arp === 'eighths') this.pluck(chord[half % chord.length] + 12, next, bus, 0.08, 'triangle');
        if (m.arp === 'sparse' && half % 4 === 2) this.pluck(chord[(half / 2) % chord.length] + 12, next, bus, 0.09);
        if (m.arp === 'bells' && half % 4 === 0) this.pluck(chord[(step / 4) % chord.length] + 24, next, bus, 0.06);
        if (m.arp === 'ticks') {
          this.tick(next, bus);
          if (half % 2 === 0) this.pluck(chord[0], next, bus, 0.1, 'triangle');
        }
        next += beat / 2;
        step += 1;
      }
    };
    schedule();
    this.music = { bus, timer: setInterval(schedule, 60) };
  },

  // Unlock a track inside the click that chose it, so browsers allow playback a moment later.
  prime(mood) {
    const src = document.getElementById(mood)?.dataset.song;
    if (!src) return;
    const audio = this.tracks[mood] || (this.tracks[mood] = new Audio(src));
    audio.loop = true;
    audio.preload = 'auto';
    audio.muted = true;
    audio.claimed = false;
    audio.play().then(() => {
      // Only undo the unlock if the real playback has not claimed this track yet.
      if (!audio.claimed) audio.pause();
      audio.muted = this.muted;
    }).catch(() => {});
  },

  play(mood) {
    this.stopMusic();
    const src = document.getElementById(mood)?.dataset.song;
    const audio = this.tracks[mood] || (src && (this.tracks[mood] = new Audio(src)));
    if (!audio) { this.playGenerated(mood); return; }
    audio.claimed = true;
    audio.loop = true;
    audio.muted = this.muted;
    audio.volume = 0;
    audio.currentTime = 0;
    const music = { audio };
    this.music = music;
    const fallback = () => { if (this.music === music) { this.music = null; this.playGenerated(mood); } };
    audio.addEventListener('error', fallback, { once: true });
    audio.play().then(() => this.fade(audio, 0.85, 1800)).catch(fallback);
  },

  fade(audio, to, ms, done) {
    const from = audio.volume;
    const t0 = performance.now();
    const step = now => {
      const p = Math.min(1, (now - t0) / ms);
      audio.volume = from + (to - from) * p;
      if (p < 1) requestAnimationFrame(step);
      else if (done) done();
    };
    requestAnimationFrame(step);
  },

  chime() {
    if (!this.music || !this.ctx || this.muted) return;
    const t = this.ctx.currentTime + 0.02;
    [72, 76, 79].forEach((n, i) => this.pluck(n, t + i * 0.08, this.master, 0.08));
  },

  stopMusic() {
    const music = this.music;
    if (!music) return;
    this.music = null;
    if (music.audio) {
      this.fade(music.audio, 0, 600, () => music.audio.pause());
      return;
    }
    const { bus, timer } = music;
    clearInterval(timer);
    const t = this.ctx.currentTime;
    bus.gain.cancelScheduledValues(t);
    bus.gain.setTargetAtTime(0.0001, t, 0.25);
    setTimeout(() => bus.disconnect(), 2000);
  },

  stopAll() {
    this.stopMusic();
    this.stopCrackle();
  },

  setMuted(muted) {
    this.muted = muted;
    if (this.music?.audio) this.music.audio.muted = muted;
    try { localStorage.setItem('records-muted', muted ? '1' : '0'); } catch {}
    if (this.master) this.master.gain.setTargetAtTime(muted ? 0 : 0.9, this.ctx.currentTime, 0.08);
  }
};
try { sound.muted = localStorage.getItem('records-muted') === '1'; } catch {}

/* ---------- Sourcer: postings through the rules, then one model call ---------- */

const POSTINGS = [
  { title: 'AI Engineer Intern', co: 'Lumen Health', age: '3d', where: 'New York', yrs: '0', score: 'Fit' },
  { title: 'ML Engineer, New Grad', co: 'Parcelwise', age: '6d', where: 'Remote US', yrs: '1', score: 'Fit' },
  { title: 'Data Engineer', co: 'Tessellate', age: '34d', where: 'New York', yrs: '1', cut: 0, why: 'Stale' },
  { title: 'Applied AI Associate', co: 'Northwind Labs', age: '2d', where: 'London', yrs: '0', cut: 1, why: 'Location' },
  { title: 'Senior AI Engineer', co: 'Quarry', age: '1d', where: 'New York', yrs: 'n/a', cut: 4, why: 'Senior' },
  { title: 'Solutions Engineer', co: 'Brightline', age: '5d', where: 'Remote US', yrs: '4', cut: 2, why: '4 yrs' },
  { title: 'AI Engineer Intern', co: 'Lumen Health, via a job board', age: '3d', where: 'New York', yrs: '0', cut: 3, why: 'Duplicate' },
  { title: 'Forward Deployed Engineer', co: 'Kestrel', age: '9d', where: 'New York', yrs: '2', score: 'Stretch' },
  { title: 'Analytics Engineer', co: 'Ostrich Data', age: '40d', where: 'Remote US', yrs: '1', cut: 0, why: 'Stale' },
  { title: 'Research Engineer', co: 'Tidewater', age: '4d', where: 'San Francisco', yrs: '1', cut: 1, why: 'Location' },
  { title: 'Backend Engineer', co: 'Marlow', age: '7d', where: 'Remote US', yrs: '5', cut: 2, why: '5 yrs' },
  { title: 'Engineering Manager', co: 'Fennel', age: '10d', where: 'New York', yrs: 'n/a', score: 'Misfit' }
];

const sourcer = {
  init(ctx) {
    const list = el('div', { class: 'postings', role: 'table', 'aria-label': 'Sample postings' });
    list.append(el('div', { class: 'posting posting-head', role: 'row' },
      '<span role="columnheader">Posting</span><span role="columnheader">Age</span><span role="columnheader" class="where">Where</span><span role="columnheader">Result</span>'));
    ctx.rows = POSTINGS.map(p => {
      const yrs = p.yrs === 'n/a' ? 'years not stated' : `${p.yrs} ${p.yrs === '1' ? 'yr' : 'yrs'} asked`;
      const row = el('div', { class: 'posting', role: 'row' },
        `<span role="cell"><b>${p.title}</b><span class="co">${p.co}, ${yrs}</span></span><span role="cell">${p.age}</span><span role="cell" class="where">${p.where}</span><span role="cell" data-result></span>`);
      list.append(row);
      return row;
    });
    ctx.body.replaceChildren(list);
  },
  async run(ctx) {
    for (let g = 0; g < 5; g += 1) {
      ctx.gate(g, 'active');
      await ctx.sleep(380);
      const cut = POSTINGS.map((p, i) => [p, i]).filter(([p]) => p.cut === g);
      for (const [p, i] of cut) {
        ctx.rows[i].classList.add('is-cut');
        ctx.rows[i].querySelector('[data-result]').innerHTML = `<span class="why">${p.why}</span>`;
        await ctx.sleep(160);
      }
      ctx.gate(g, 'pass', `−${cut.length}`);
    }
    ctx.gate(5, 'active');
    ctx.say('Four postings left. Each gets one Haiku call that parses and scores, checked against a schema.');
    await ctx.sleep(900);
    POSTINGS.forEach((p, i) => {
      if (p.score) ctx.rows[i].querySelector('[data-result]').innerHTML = `<span class="score">${p.score}</span>`;
    });
    ctx.gate(5, 'pass', '4 sent');
    ctx.say('8 of 12 were cut by rules that cost nothing. Fit and stretch roles go to the morning text.');
    await ctx.stamp('4 of 12 reached the model', 'Sample data');
  }
};

/* ---------- ReKindle: Rekindle drafts, the person sends ---------- */

const rekindle = {
  init(ctx) {
    ctx.thread = el('div', { class: 'thread' });
    ctx.thread.append(el('p', { class: 'msg msg--note' }, 'Your thread with Rekindle in Messages'));
    ctx.body.replaceChildren(ctx.thread);
  },
  add(ctx, who, html, mod) {
    const msg = el('p', { class: `msg msg--${mod}` }, `<span class="msg-who">${who}</span>${html}`);
    ctx.thread.append(msg);
    return msg;
  },
  async run(ctx) {
    this.add(ctx, 'You', 'Met Priya Shah at the fintech meetup tonight.', 'me');
    await ctx.sleep(600);
    this.add(ctx, 'Rekindle', 'Saved to Priya.', 'agent');
    await ctx.sleep(800);
    ctx.thread.append(el('p', { class: 'msg msg--note' }, 'Next morning, 9:00'));
    ctx.gate(0, 'active');
    await ctx.sleep(700);
    this.add(ctx, 'Rekindle', 'How was the fintech meetup? You met Priya Shah. Want me to draft follow-ups while it&rsquo;s fresh?', 'agent');
    ctx.gate(0, 'pass', 'Texted first');
    this.add(ctx, 'You', 'Yes please', 'me');
    ctx.gate(1, 'active');
    await ctx.sleep(800);
    this.add(ctx, 'Rekindle', 'Draft for Priya:<blockquote>Hi Priya, good to meet you at the fintech meetup. Open to a coffee next week?</blockquote>Copy it and send when you&rsquo;re ready.', 'agent');
    ctx.gate(1, 'pass', 'Drafted');
    ctx.gate(2, 'active');
    ctx.say('Your turn. Rekindle never messages your contacts.');

    const copy = el('button', { class: 'btn btn--solid', type: 'button' }, 'Copy draft');
    const no = el('button', { class: 'btn btn--ghost', type: 'button' }, 'Not now');
    const choices = el('div', { class: 'choices' });
    choices.append(copy, no);
    ctx.thread.append(choices);
    copy.focus({ preventScroll: true });
    const answer = await ctx.wait(new Promise(resolve => {
      copy.addEventListener('click', () => resolve(true), { once: true });
      no.addEventListener('click', () => resolve(false), { once: true });
    }));
    choices.remove();

    if (answer) {
      ctx.gate(2, 'pass', 'Copied');
      ctx.gate(3, 'active');
      await ctx.sleep(600);
      ctx.gate(3, 'pass', 'Sent by you');
      ctx.say('You send it yourself, from your own phone.');
      await ctx.stamp('Sent by you', 'Rekindle only drafts');
    } else {
      this.add(ctx, 'You', 'Not now', 'me');
      ctx.gate(2, 'fail', 'Held');
      ctx.gate(3, 'skip');
      await ctx.sleep(500);
      this.add(ctx, 'Rekindle', 'Okay. I&rsquo;ll keep it here if you want it later.', 'agent');
      ctx.say('The draft stays a draft. Rekindle never sends on your behalf.');
      await ctx.stamp('Held', 'Nothing sent', true);
    }
  }
};

/* ---------- Knowledge Assistant: cite or abstain ---------- */

const QUESTIONS = [
  {
    q: 'How many days a week can I work remotely?',
    found: '3 passages', bytes: '1.1 KB',
    passage: 'Employees may work remotely up to <mark>three days per week</mark>. Coordinate your office days with your manager.',
    source: 'Remote work policy, Remote work'
  },
  {
    q: 'What is the daily meal limit when I travel?',
    found: '2 passages', bytes: '0.8 KB',
    conflict: [
      { passage: 'The domestic business travel meal allowance is <mark>$75 per day</mark>, including tax and tips.', source: 'Travel and expenses, Meal reimbursement' },
      { passage: 'The domestic business travel meal allowance for field team employees is <mark>$90 per day</mark>, including tax and tips.', source: 'Field team handbook, Meal reimbursement' }
    ]
  },
  {
    q: 'How much parental leave do we get?',
    found: '0 relevant', bytes: '0 KB',
    missing: 'a parental leave policy'
  }
];

const knowledge = {
  init(ctx) {
    const set = el('fieldset', { class: 'asks' });
    set.append(el('legend', {}, 'Choose a question'));
    const name = `ask-${Math.random().toString(36).slice(2, 7)}`;
    QUESTIONS.forEach((item, i) => {
      const label = el('label', { class: 'ask' });
      const input = el('input', { type: 'radio', name, value: String(i) });
      if (i === 0) input.checked = true;
      label.append(input, document.createTextNode(item.q));
      set.append(label);
    });
    ctx.set = set;
    ctx.slot = el('div');
    ctx.body.replaceChildren(set, ctx.slot);
    set.addEventListener('change', () => { if (ctx.done) ctx.rerun(); });
  },
  async run(ctx) {
    const pick = QUESTIONS[Number(ctx.set.querySelector('input:checked').value)];
    ctx.slot.replaceChildren();
    ctx.gate(0, 'active');
    await ctx.sleep(320);
    ctx.gate(0, 'pass', 'Member');
    ctx.gate(1, 'active');
    await ctx.sleep(520);
    ctx.gate(1, 'pass', pick.found);
    ctx.gate(2, 'active');
    await ctx.sleep(360);
    ctx.gate(2, 'pass', pick.bytes);
    ctx.gate(3, 'active');
    await ctx.sleep(560);

    if (pick.missing) {
      ctx.slot.append(el('div', { class: 'answer is-abstain' },
        `<span class="lbl">Abstained</span><p>No approved document in this workspace answers this.</p><p>Missing: ${pick.missing}.</p>`));
      ctx.gate(3, 'pass', 'Abstained');
      ctx.say('No source, no answer. It says what is missing instead of guessing.');
      await ctx.stamp('Abstained', 'No source found', true);
    } else if (pick.conflict) {
      ctx.slot.append(el('div', { class: 'answer is-abstain' },
        `<span class="lbl">Conflicting policies</span>` +
        pick.conflict.map(c => `<p>${c.passage}</p><cite>${c.source}</cite>`).join('') +
        '<p>Flagged until an administrator sets which policy takes precedence.</p>'));
      ctx.gate(3, 'pass', 'Conflict flagged');
      ctx.say('Two approved policies disagree, so it shows both and flags the conflict instead of picking one.');
      await ctx.stamp('Flagged', 'Policies disagree', true);
    } else {
      ctx.slot.append(el('div', { class: 'answer' },
        `<span class="lbl">Approved passage</span><p>${pick.passage}</p><cite>${pick.source}</cite>`));
      ctx.gate(3, 'pass', 'Cited');
      ctx.say('The answer is the approved passage itself, word for word, with its source.');
      await ctx.stamp('Cited', pick.source);
    }
  }
};

/* ---------- Statement Agent: the arithmetic decides ---------- */

const OPENING = 2400;
const CLOSING = 1997.5;
const LINES = [
  { date: '09/03', desc: 'Client payment', amount: 1200 },
  { date: '09/04', desc: 'Software subscription', amount: -42 },
  { date: '09/04', desc: 'Software subscription', amount: -42 },
  { date: '09/06', desc: 'Office supplies', amount: -18.5, misread: -15.8 },
  { date: '09/12', desc: 'Rent', amount: -1500 }
];

const statement = {
  init(ctx) {
    const table = el('table', { class: 'stmt' });
    table.innerHTML = '<caption class="visually-hidden">Sample statement lines</caption><thead><tr><th scope="col">Date</th><th scope="col">Description</th><th scope="col" class="num">Extracted</th></tr></thead>';
    const tbody = el('tbody');
    ctx.lines = LINES.map(line => {
      const row = el('tr', {}, `<td>${line.date}</td><td>${line.desc}</td><td class="num" data-amt>not read</td>`);
      tbody.append(row);
      return row;
    });
    table.append(tbody);
    ctx.sum = el('dl', { class: 'sum' },
      `<dt>Opening balance</dt><dd>${plain(OPENING)}</dd>` +
      '<dt>Lines extracted</dt><dd data-net>not read</dd>' +
      '<dt class="total">Computed closing</dt><dd class="total" data-calc>not checked</dd>' +
      `<dt>Closing on statement</dt><dd>${plain(CLOSING)}</dd>`);
    ctx.body.replaceChildren(table, ctx.sum);
  },
  total(values) {
    return Math.round((OPENING + values.reduce((a, b) => a + b, 0)) * 100) / 100;
  },
  async run(ctx) {
    ctx.gate(0, 'active');
    await ctx.sleep(420);
    ctx.gate(0, 'pass', 'Text layer');
    ctx.gate(1, 'active');
    const first = LINES.map(l => l.misread ?? l.amount);
    for (let i = 0; i < LINES.length; i += 1) {
      await ctx.sleep(200);
      ctx.lines[i].querySelector('[data-amt]').textContent = money(first[i]);
    }
    ctx.gate(1, 'pass', '5 lines');
    ctx.gate(2, 'active');
    await ctx.sleep(500);
    const net = ctx.sum.querySelector('[data-net]');
    const calc = ctx.sum.querySelector('[data-calc]');
    net.textContent = money(first.reduce((a, b) => a + b, 0));
    const wrong = this.total(first);
    calc.textContent = plain(wrong);
    calc.className = 'total is-off';
    ctx.gate(2, 'fail', `Off $${(wrong - CLOSING).toFixed(2)}`);
    ctx.say(`The lines add up to ${plain(wrong)}. The statement says ${plain(CLOSING)}. Not trusted yet.`);
    await ctx.sleep(1100);

    ctx.gate(3, 'active');
    await ctx.sleep(800);
    const i = LINES.findIndex(l => l.misread);
    ctx.lines[i].querySelector('[data-amt]').innerHTML =
      `<s>${money(LINES[i].misread)}</s><span class="fix">${money(LINES[i].amount)}</span>`;
    const right = LINES.map(l => l.amount);
    net.textContent = money(right.reduce((a, b) => a + b, 0));
    calc.textContent = plain(this.total(right));
    calc.className = 'total is-ok';
    ctx.gate(3, 'pass', 'Reconciled');
    ctx.say(`The repair agent searched the statement for the $${(wrong - CLOSING).toFixed(2)} gap, found $18.50 printed on the Office supplies line, and corrected that one row, citing the line. Now the totals match to the cent.`);
    await ctx.sleep(900);

    ctx.gate(4, 'active');
    ctx.lines[i].classList.add('is-flag');
    ctx.lines[i].children[1].insertAdjacentHTML('beforeend', ' <span class="flag">Agent edit</span>');
    ctx.say('A reviewer sees the agent\'s edit next to the statement line it cites, and approves it into the history.');
    const approve = el('button', { class: 'btn btn--solid', type: 'button' }, 'Approve the edit');
    ctx.extra(approve);
    approve.focus({ preventScroll: true });
    await ctx.wait(new Promise(resolve => approve.addEventListener('click', resolve, { once: true })));
    approve.remove();
    ctx.lines[i].classList.remove('is-flag');
    ctx.lines[i].querySelector('.flag').remove();
    ctx.gate(4, 'pass', 'Approved');
    ctx.say('Checked by arithmetic, fixed from the source, approved by a person, ready for the spreadsheet.');
    await ctx.stamp('Reconciled', 'Ready for Excel');
  }
};

const DEMOS = { sourcer, rekindle, knowledge, statement };

/* ---------- Run engine shared by every sample ---------- */

function setupRun(run) {
  const demo = DEMOS[run.dataset.demo];
  if (!demo) return;
  const gates = [...run.querySelectorAll('.gate')];
  const runButton = run.querySelector('[data-run]');
  const resetButton = run.querySelector('[data-reset]');
  const status = run.querySelector('[data-status]');
  const stamp = run.querySelector('[data-stamp]');
  const foot = run.querySelector('.run-foot');
  const intro = status.textContent;
  let token = 0;

  const ctx = {
    body: run.querySelector('[data-body]'),
    done: false,
    sleep(ms) {
      const mine = token;
      return wait(reducedMotion.matches ? Math.min(ms, 60) : ms)
        .then(() => { if (mine !== token) throw CANCELLED; });
    },
    wait(promise) {
      const mine = token;
      return promise.then(value => { if (mine !== token) throw CANCELLED; return value; });
    },
    gate(i, state, out = '') {
      const gate = gates[i];
      gate.classList.remove('is-active', 'is-pass', 'is-fail', 'is-skip');
      gate.classList.add(`is-${state}`);
      if (state !== 'active') gate.querySelector('[data-out]').textContent = out;
      if (state === 'fail') gate.querySelector('use').setAttribute('href', '#i-cross');
    },
    say(text) { status.textContent = text; },
    extra(node) { foot.insertBefore(node, status); },
    stamp(text, small = '', red = false) {
      stamp.innerHTML = `${text}${small ? `<small>${small}</small>` : ''}`;
      stamp.classList.toggle('is-red', red);
      stamp.classList.remove('is-stamped');
      void stamp.offsetWidth;
      stamp.classList.add('is-stamped');
      if (!red) sound.chime();
      return Promise.resolve();
    },
    rerun() { reset(false); start(); }
  };

  function reset(rebuild = true) {
    token += 1;
    ctx.done = false;
    gates.forEach(gate => {
      gate.classList.remove('is-active', 'is-pass', 'is-fail', 'is-skip');
      gate.querySelector('[data-out]').textContent = '';
      gate.querySelector('use').setAttribute('href', '#i-check');
    });
    stamp.classList.remove('is-stamped', 'is-red');
    stamp.textContent = '';
    foot.querySelectorAll('.btn:not([data-run]):not([data-reset])').forEach(node => node.remove());
    status.textContent = intro;
    if (rebuild) demo.init(ctx);
    runButton.disabled = false;
    runButton.hidden = false;
    resetButton.hidden = true;
  }

  async function start() {
    runButton.disabled = true;
    resetButton.hidden = false;
    try {
      await demo.run(ctx);
      ctx.done = true;
      runButton.hidden = run.dataset.demo !== 'knowledge';
      runButton.disabled = false;
    } catch (error) {
      if (error !== CANCELLED) throw error;
    }
  }

  demo.init(ctx);
  runButton.hidden = false;
  runButton.addEventListener('click', () => {
    if (ctx.done) reset(false);
    start();
  });
  resetButton.addEventListener('click', () => { reset(); runButton.focus(); });
}

document.querySelectorAll('.run[data-demo]').forEach(setupRun);

/* ---------- The crate ---------- */

const crate = document.querySelector('[data-crate]');
const sleeves = crate ? [...crate.querySelectorAll('.sleeve')] : [];
const picks = [...document.querySelectorAll('[data-pick]')];
let front = 0;
let flipping = false;

function layoutCrate() {
  const n = sleeves.length;
  sleeves.forEach((sleeve, i) => {
    const k = (i - front + n) % n;
    sleeve.style.setProperty('--k', k);
    sleeve.classList.toggle('is-front', k === 0);
    sleeve.tabIndex = k === 0 ? 0 : -1;
    if (k === 0) sleeve.removeAttribute('aria-hidden');
    else sleeve.setAttribute('aria-hidden', 'true');
  });
  picks.forEach((pick, i) => pick.setAttribute('aria-current', String(i === front)));
}

async function flip(dir) {
  if (flipping || !sleeves.length) return;
  flipping = true;
  const n = sleeves.length;
  const quick = reducedMotion.matches;
  if (dir > 0) {
    const leaving = sleeves[front];
    if (!quick) {
      leaving.classList.add('is-leaving');
      await wait(400);
      leaving.classList.remove('is-leaving');
      leaving.classList.add('is-returning');
    }
    front = (front + 1) % n;
    layoutCrate();
    void leaving.offsetWidth;
    leaving.classList.remove('is-returning');
  } else {
    front = (front - 1 + n) % n;
    const coming = sleeves[front];
    if (!quick) coming.classList.add('is-returning', 'is-leaving');
    layoutCrate();
    void coming.offsetWidth;
    coming.classList.remove('is-returning');
    await wait(20);
    coming.classList.remove('is-leaving');
    if (!quick) await wait(380);
  }
  flipping = false;
}

async function flipTo(index) {
  while (front !== index) {
    const n = sleeves.length;
    await flip(((index - front + n) % n) <= n / 2 ? 1 : -1);
  }
}

if (crate) {
  layoutCrate();
  document.querySelectorAll('[data-flip]').forEach(button =>
    button.addEventListener('click', () => flip(Number(button.dataset.flip))));
  crate.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); flip(1).then(() => sleeves[front].focus()); }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); flip(-1).then(() => sleeves[front].focus()); }
  });
  crate.addEventListener('wheel', event => {
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY) && Math.abs(event.deltaX) > 12) {
      event.preventDefault();
      flip(event.deltaX > 0 ? 1 : -1);
    }
  }, { passive: false });
  let startX = null;
  crate.addEventListener('pointerdown', event => { startX = event.clientX; });
  crate.addEventListener('pointerup', event => {
    if (startX === null) return;
    const dx = event.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 40) { crate.dataset.swiped = '1'; flip(dx < 0 ? 1 : -1); }
  });
  sleeves.forEach(sleeve => sleeve.addEventListener('click', event => {
    event.preventDefault();
    if (crate.dataset.swiped) { delete crate.dataset.swiped; return; }
    if (sleeve.classList.contains('is-front')) player.open(sleeve.dataset.record, { sound: true, from: sleeve });
  }));
  picks.forEach((pick, i) => pick.addEventListener('click', event => {
    event.preventDefault();
    if (i === front) player.open(sleeves[i].dataset.record, { sound: true, from: sleeves[i] });
    else flipTo(i);
  }));
  document.querySelector('[data-play-front]')?.addEventListener('click', event => {
    event.preventDefault();
    player.open(sleeves[front].dataset.record, { sound: true, from: sleeves[front] });
  });
}

/* ---------- The turntable and the room ---------- */

const ARM_REST = 0;
const ARM_OUTER = 17;
const ARM_INNER = 33;

const inView = node => {
  const r = node.getBoundingClientRect();
  return r.bottom > 0 && r.top < innerHeight;
};

const player = {
  room: document.getElementById('room'),
  current: null,
  index: 0,
  spin: null,
  playing: false,

  get slot() { return this.room.querySelector('[data-slot]'); },
  get arm() { return this.room.querySelector('.arm'); },
  record(id) {
    const node = document.getElementById(id);
    return node?.classList.contains('record') ? node : null;
  },
  sleeve(id) { return sleeves.find(s => s.dataset.record === id); },
  tracks() { return [...this.record(this.current).querySelectorAll('.track')]; },

  makeDisc(id) {
    const source = this.sleeve(id).querySelector('.disc').cloneNode(true);
    const path = source.querySelector('path[id]');
    const tp = source.querySelector('textPath');
    path.id = `${path.id}-deck`;
    tp.setAttribute('href', `#${path.id}`);
    source.dataset.record = id;
    return source;
  },

  setShopInert(on) {
    document.querySelectorAll('.topbar, .shop, .glance, .discography, .counter, .skip').forEach(node => { node.inert = on; });
  },

  show(id) {
    document.querySelectorAll('.record.is-active').forEach(r => r.classList.remove('is-active'));
    const record = this.record(id);
    record.classList.add('is-active');
    record.querySelector('.liner-drawer').open = false;
    this.room.querySelector('[data-now]').textContent = record.querySelector('.record-title').textContent;
    this.current = id;
    this.goto(0, { quiet: true });
  },

  // One track on stage at a time; the needle sits on that track's groove.
  goto(n, { quiet = false } = {}) {
    const tracks = this.tracks();
    const last = tracks.length - 1;
    const next = Math.max(0, Math.min(last, n));
    const wasBonus = this.index === last;
    this.index = next;
    tracks.forEach((track, i) => track.classList.toggle('is-shown', i === next));
    const record = this.record(this.current);
    record.querySelectorAll('.tracklist a').forEach(link => {
      const on = Number(link.dataset.track) === next;
      link.classList.toggle('is-current', on);
      if (on) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
    const label = tracks[next].querySelector('.tno').textContent;
    record.querySelector('[data-pos]').textContent = `${label}, ${next + 1} of ${tracks.length}`;
    record.querySelector('[data-step="-1"]').disabled = next === 0;
    record.querySelector('[data-step="1"]').disabled = next === last;
    record.querySelector('.stage').scrollTop = 0;
    if (this.playing) this.arm.style.setProperty('--arm', `${ARM_OUTER + (ARM_INNER - ARM_OUTER) * next / last}deg`);
    if (!reducedMotion.matches && (next === last) !== wasBonus && !quiet) {
      this.slot.classList.remove('is-flipping');
      void this.slot.offsetWidth;
      this.slot.classList.add('is-flipping');
    }
    if (!quiet) {
      const heading = tracks[next].querySelector('h3');
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
  },

  async open(id, { sound: withSound = false, from = null, push = true } = {}) {
    if (!this.record(id)) return;
    if (withSound) { sound.ensure(); sound.prime(id); }
    if (this.room.classList.contains('is-open')) { this.swapTo(id, withSound); return; }
    const sleeve = from || this.sleeve(id);
    const sleeveIndex = sleeves.indexOf(sleeve);
    if (sleeveIndex !== front && sleeveIndex >= 0) { front = sleeveIndex; layoutCrate(); }
    const morph = document.startViewTransition && !reducedMotion.matches && inView(sleeve);
    if (morph && from) {
      sleeve.classList.add('is-pulling');
      await wait(480);
    }
    const disc = this.makeDisc(id);
    this.slot.replaceChildren(disc);
    const sleeveDisc = sleeve.querySelector('.disc');

    const update = () => {
      sleeveDisc.style.viewTransitionName = '';
      disc.style.viewTransitionName = morph ? 'vinyl' : '';
      this.show(id);
      this.room.classList.add('is-open');
      document.body.classList.add('is-playing');
      this.setShopInert(true);
    };
    if (morph) {
      sleeveDisc.style.viewTransitionName = 'vinyl';
      await document.startViewTransition(update).finished.catch(() => {});
    } else {
      update();
    }
    disc.style.viewTransitionName = '';
    if (push) history.pushState({ record: id }, '', `#${id}`);
    this.room.querySelector('[data-lift]').focus({ preventScroll: true });

    const drop = this.room.querySelector('[data-drop]');
    if (withSound) { drop.hidden = true; this.dropNeedle(); }
    else { drop.hidden = false; this.room.dataset.lit = id; }
  },

  async dropNeedle() {
    const id = this.current;
    this.room.querySelector('[data-drop]').hidden = true;
    sound.ensure();
    const last = this.tracks().length - 1;
    this.arm.style.setProperty('--arm', `${ARM_OUTER + (ARM_INNER - ARM_OUTER) * this.index / last}deg`);
    await wait(reducedMotion.matches ? 0 : 880);
    if (this.current !== id) return;
    sound.drop();
    this.spinTo(1, 1500);
    await wait(reducedMotion.matches ? 0 : 350);
    this.room.dataset.lit = id;
    this.playing = true;
    await wait(1100);
    if (this.current === id && this.playing) sound.play(id);
  },

  spinTo(target, ms) {
    if (reducedMotion.matches) return;
    const disc = this.slot.querySelector('.disc');
    if (!disc) return;
    if (!this.spin || this.spin.effect.target !== disc) {
      this.spin = disc.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], { duration: 1818, iterations: Infinity });
      this.spin.playbackRate = 0.0001;
    }
    const anim = this.spin;
    const from = anim.playbackRate;
    const t0 = performance.now();
    const step = now => {
      const p = Math.min(1, (now - t0) / ms);
      const rate = from + (target - from) * (1 - (1 - p) ** 3);
      const wow = target > from && p > 0.6 && p < 1 ? Math.sin(p * 20) * 0.02 : 0;
      anim.updatePlaybackRate(Math.max(0.0001, rate + wow));
      if (p < 1 && anim === this.spin) requestAnimationFrame(step);
      else if (target === 0) anim.pause();
    };
    if (anim.playState === 'paused') anim.play();
    requestAnimationFrame(step);
  },

  async lift() {
    this.playing = false;
    sound.stopAll();
    this.arm.style.setProperty('--arm', `${ARM_REST}deg`);
    this.spinTo(0, 700);
    delete this.room.dataset.lit;
    await wait(reducedMotion.matches ? 0 : 700);
  },

  async close({ push = true } = {}) {
    if (!this.room.classList.contains('is-open')) return;
    const id = this.current;
    await this.lift();
    const sleeve = this.sleeve(id);
    const disc = this.slot.querySelector('.disc');
    const sleeveDisc = sleeve.querySelector('.disc');
    const morph = document.startViewTransition && !reducedMotion.matches && disc;
    const update = () => {
      if (disc) disc.style.viewTransitionName = '';
      sleeveDisc.style.viewTransitionName = morph ? 'vinyl' : '';
      this.room.classList.remove('is-open');
      document.body.classList.remove('is-playing');
      this.setShopInert(false);
      document.getElementById('crate').scrollIntoView({ block: 'center', behavior: 'instant' });
    };
    if (morph) {
      disc.style.viewTransitionName = 'vinyl';
      await document.startViewTransition(update).finished.catch(() => {});
    } else {
      update();
    }
    sleeveDisc.style.viewTransitionName = '';
    this.spin?.cancel();
    this.spin = null;
    this.slot.replaceChildren();
    this.current = null;
    sleeve.classList.remove('is-pulling');
    if (push) history.pushState(null, '', '#crate');
    sleeve.focus({ preventScroll: true });
  },

  async swapTo(id, withSound = true) {
    if (id === this.current) return;
    const wasPlaying = this.playing || withSound;
    this.playing = false;
    sound.stopMusic();
    this.arm.style.setProperty('--arm', `${ARM_REST}deg`);
    const old = this.slot.querySelector('.disc');
    const quick = reducedMotion.matches;
    if (old && !quick) {
      this.spinTo(0, 500);
      await old.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-130%) rotate(-40deg)', opacity: 0 }], { duration: 520, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', fill: 'forwards' }).finished;
    }
    this.spin?.cancel();
    this.spin = null;
    const disc = this.makeDisc(id);
    this.slot.replaceChildren(disc);
    this.show(id);
    history.replaceState({ record: id }, '', `#${id}`);
    const idx = sleeves.findIndex(s => s.dataset.record === id);
    if (idx >= 0) { sleeves.forEach(s => s.classList.remove('is-pulling')); front = idx; layoutCrate(); }
    if (!quick) await disc.animate([{ transform: 'translateX(130%) rotate(40deg)', opacity: 0 }, { transform: 'translateX(0)' }], { duration: 560, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }).finished;
    if (wasPlaying) this.dropNeedle();
    else { this.room.dataset.lit = id; this.room.querySelector('[data-drop]').hidden = false; }
  }
};

if (player.room) {
  const room = player.room;
  room.querySelector('[data-lift]').addEventListener('click', () => player.close());
  room.querySelector('[data-drop]').addEventListener('click', () => { sound.prime(player.current); player.dropNeedle(); });
  room.querySelectorAll('[data-swap]').forEach(button => button.addEventListener('click', () => {
    const i = sleeves.findIndex(s => s.dataset.record === player.current);
    const n = sleeves.length;
    const id = sleeves[(i + Number(button.dataset.swap) + n) % n].dataset.record;
    sound.prime(id);
    player.swapTo(id, true);
  }));
  room.querySelectorAll('[data-next]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    sound.prime(link.dataset.next);
    player.swapTo(link.dataset.next, true);
  }));
  room.querySelectorAll('.tracklist a').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    player.goto(Number(link.dataset.track));
  }));
  room.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () =>
    player.goto(player.index + Number(button.dataset.step))));
  room.querySelectorAll('[data-goto]').forEach(button => button.addEventListener('click', () =>
    player.goto(button.dataset.goto === 'bonus' ? player.tracks().length - 1 : player.index + 1)));

  const mute = room.querySelector('[data-mute]');
  const paintMute = () => {
    mute.setAttribute('aria-pressed', String(sound.muted));
    mute.setAttribute('aria-label', sound.muted ? 'Turn sound on' : 'Mute sound');
    mute.querySelector('use').setAttribute('href', sound.muted ? '#i-mute' : '#i-sound');
  };
  paintMute();
  mute.addEventListener('click', () => { sound.setMuted(!sound.muted); paintMute(); });

  document.addEventListener('keydown', event => {
    if (!room.classList.contains('is-open')) return;
    if (event.key === 'Escape') { player.close(); return; }
    if (event.target instanceof Element && event.target.closest('input, textarea, select, summary, button')) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); player.goto(player.index + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); player.goto(player.index - 1); }
  });

  document.querySelectorAll('[data-read], [data-play]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    player.open(link.dataset.read || link.dataset.play, { sound: Boolean(link.dataset.play) });
  }));

  const fromHash = () => {
    const id = location.hash.slice(1);
    if (player.record(id)) player.open(id, { push: false });
    else if (room.classList.contains('is-open')) player.close({ push: false });
  };
  window.addEventListener('popstate', fromHash);
  if (player.record(location.hash.slice(1))) {
    history.replaceState({ record: location.hash.slice(1) }, '', location.hash);
    player.open(location.hash.slice(1), { push: false });
  }
}

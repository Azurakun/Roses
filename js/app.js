/* ==========================================================
   Apotek Gelap: logika aplikasi
   ========================================================== */
(function () {
  'use strict';

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  const state = { data: [], kategori: {}, cat: 'semua', minDanger: 0, q: '', openId: null, perShelf: 0, busy: false };

  const el = {
    shelves: $('#shelves'), empty: $('#shelf-empty'), count: $('#shelf-count'),
    chips: $('#chips-kategori'), skulls: $('#skull-filter'), search: $('#cari'),
    sheet: $('#sheet'), backdrop: $('#sheet-backdrop'), slot: $('#specimen-slot'), specimen: $('#specimen'),
    pageRight: $('#page-right'), inner: $('.sheet-inner')
  };

  const SKULL = (cls = '') => `<svg class="${cls}" viewBox="-7 -6 14 16" aria-hidden="true"><path fill="currentColor" d="M0 -5 C-4.2 -5 -5.4 -2 -5.4 0.2 C-5.4 2.2 -4.4 3.2 -3.2 3.6 V5.2 H3.2 V3.6 C4.4 3.2 5.4 2.2 5.4 0.2 C5.4 -2 4.2 -5 0 -5 Z M-2 -1.4 a1.35 1.35 0 1 0 0.01 0 Z M2 -1.4 a1.35 1.35 0 1 0 0.01 0 Z" fill-rule="evenodd"/><path d="M-5.6 6.6 L5.6 9.2 M5.6 6.6 L-5.6 9.2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`;

  /* ---------- Muat data ---------- */
  async function load() {
    document.body.insertAdjacentHTML('afterbegin', Vials.sharedDefs());
    try {
      const res = await fetch('data/racun.json', { cache: 'no-cache' });
      if (!res.ok) throw new Error(res.status);
      const json = await res.json();
      state.data = json.racun;
      state.kategori = json.kategori;
    } catch (err) {
      el.shelves.innerHTML = `<div class="load-error"><p><strong>Rak belum bisa dimuat.</strong> Browser memblokir pembacaan <code>data/racun.json</code> saat halaman dibuka langsung dari file.</p><p>Jalankan server lokal di folder proyek, misalnya <code>python -m http.server 8080</code> atau <code>npx serve</code>, lalu buka <code>http://localhost:8080</code>.</p></div>`;
      return;
    }
    buildFilters();
    renderShelves('reveal');
    window.addEventListener('hashchange', route);
    route(true);
  }

  /* ---------- Filter ---------- */
  function buildFilters() {
    const cats = [['semua', 'Semua']].concat(Object.entries(state.kategori));
    el.chips.innerHTML = cats.map(([k, v]) => `<button type="button" class="chip" data-cat="${k}" aria-pressed="${k === state.cat}">${esc(v)}</button>`).join('');
    el.chips.addEventListener('click', (e) => {
      const b = e.target.closest('.chip'); if (!b) return;
      state.cat = b.dataset.cat;
      $$('.chip', el.chips).forEach((c) => c.setAttribute('aria-pressed', c === b));
      renderShelves('refilter');
    });

    let html = '';
    for (let i = 1; i <= 5; i++) html += `<button type="button" class="skull-btn" data-lvl="${i}" aria-label="Bahaya minimal ${i} dari 5" aria-pressed="false">${SKULL()}</button>`;
    html += `<button type="button" class="skull-clear" hidden>semua</button>`;
    el.skulls.innerHTML = html;
    el.skulls.addEventListener('click', (e) => {
      if (e.target.closest('.skull-clear')) { state.minDanger = 0; }
      else {
        const b = e.target.closest('.skull-btn'); if (!b) return;
        const lvl = +b.dataset.lvl;
        state.minDanger = state.minDanger === lvl ? 0 : lvl;
      }
      paintSkulls();
      renderShelves('refilter');
    });

    let t;
    el.search.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(() => { state.q = el.search.value.trim().toLowerCase(); renderShelves('refilter'); }, 140);
    });
    $('#reset-filter').addEventListener('click', resetFilters);
  }

  function paintSkulls() {
    $$('.skull-btn', el.skulls).forEach((b) => {
      const on = +b.dataset.lvl <= state.minDanger;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', +b.dataset.lvl === state.minDanger);
    });
    $('.skull-clear', el.skulls).hidden = state.minDanger === 0;
  }

  function resetFilters() {
    state.cat = 'semua'; state.minDanger = 0; state.q = ''; el.search.value = '';
    $$('.chip', el.chips).forEach((c) => c.setAttribute('aria-pressed', c.dataset.cat === 'semua'));
    paintSkulls();
    renderShelves('refilter');
  }

  function filtered() {
    return state.data.filter((p) => {
      if (state.cat !== 'semua' && p.kategori !== state.cat) return false;
      if (p.bahaya < state.minDanger) return false;
      if (state.q) {
        const hay = [p.nama, p.namaIlmiah, p.id, state.kategori[p.kategori], p.subKategori || ''].join(' ').toLowerCase();
        if (hay.indexOf(state.q) < 0) return false;
      }
      return true;
    });
  }

  /* ---------- Rak ---------- */
  function computePerShelf() {
    const w = el.shelves.clientWidth || window.innerWidth;
    const vw = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--vial-w')) || 118;
    return Math.max(2, Math.min(4, Math.floor(w / (vw * 1.42))));
  }

  function vialButton(p, i) {
    const skulls = Array.from({ length: 5 }, (_, k) => SKULL(k < p.bahaya ? '' : 'off')).join('');
    const scale = p.vial.skala || 1;
    return `<button type="button" class="vial" data-id="${p.id}" style="--i:${i};--s:${scale}"
        aria-label="${esc(p.nama)}, ${esc(state.kategori[p.kategori])}, bahaya ${p.bahaya} dari 5. Buka catatan.">
      <span class="vial-tag" aria-hidden="true"><span>${esc(p.nama)}</span><span class="vt-danger">${skulls.replace(/class="off"/g, 'style="opacity:.25"')}</span></span>
      <span class="vial-art">${Vials.render(p, 'shelf')}</span>
    </button>`;
  }

  function renderShelves(mode) {
    const list = filtered();
    state.perShelf = computePerShelf();
    const n = state.perShelf;
    let html = '';
    const rows = Math.max(1, Math.ceil(list.length / n));
    for (let r = 0; r < rows; r++) {
      const chunk = list.slice(r * n, r * n + n);
      html += `<div class="shelf" style="--shelf:${r}"><div class="shelf-row">${chunk.map((p, i) => vialButton(p, i)).join('')}</div><div class="shelf-board" style="--shelf:${r}"></div></div>`;
    }
    el.shelves.classList.remove('reveal', 'refilter');
    el.shelves.innerHTML = list.length ? html : '';
    el.empty.hidden = list.length > 0;
    if (mode && !reduceMotion()) { void el.shelves.offsetWidth; el.shelves.classList.add(mode); }

    const total = state.data.length;
    el.count.textContent = list.length === total
      ? `${total} botol di rak`
      : list.length === 0 ? 'Tidak ada botol yang cocok' : `${list.length} dari ${total} botol cocok`;

    if (state.openId) {
      const b = el.shelves.querySelector(`.vial[data-id="${state.openId}"]`);
      if (b) b.classList.add('is-taken');
    }
  }

  el.shelves.addEventListener('click', (e) => {
    const b = e.target.closest('.vial'); if (!b) return;
    openPoison(b.dataset.id, b);
  });

  let rt;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => { if (computePerShelf() !== state.perShelf && state.data.length) renderShelves(); }, 160);
  });

  /* ---------- Panel detail ---------- */
  const byId = (id) => state.data.find((p) => p.id === id);

  function fillSheet(p) {
    $('#sheet-no').textContent = p.katalog;
    $('#sheet-note').textContent = p.ringkas;
    $('#sheet-title').textContent = p.nama;
    $('#sheet-sci').textContent = p.namaIlmiah;
    $('#sheet-cat').textContent = state.kategori[p.kategori] + (p.subKategori ? ` · ${p.subKategori}` : '');
    $('#sheet-danger').innerHTML = Array.from({ length: 5 }, (_, k) => SKULL(k < p.bahaya ? '' : 'off')).join('') +
      `<span class="danger-txt">bahaya ${p.bahaya}/5</span>`;
    $('#sheet-danger').setAttribute('aria-label', `Tingkat bahaya ${p.bahaya} dari 5`);
    $('#sheet-danger').setAttribute('role', 'img');
    $('#sheet-wujud').textContent = p.wujud.deskripsi;
    $('#sheet-swatch').innerHTML = p.wujud.warna.map((w) => `<li><i style="background:${w.hex}"></i>${esc(w.nama)}</li>`).join('');
    $('#sheet-asal').textContent = p.asal.deskripsi;
    $('#sheet-paparan').innerHTML = p.asal.paparan.map((x) => `<li>${esc(x)}</li>`).join('');
    $('#sheet-kerja').textContent = p.caraKerja;
    const stageName = { awal: 'Awal', lanjut: 'Lanjut', berat: 'Berat' };
    $('#sheet-gejala').innerHTML = ['awal', 'lanjut', 'berat'].filter((k) => p.gejala[k]).map((k) =>
      `<li class="stage-${k}"><span class="stage-tag">${stageName[k]}</span><ul>${p.gejala[k].map((g) => `<li>${esc(g)}</li>`).join('')}</ul></li>`).join('');
    $('#sheet-antidot').textContent = p.penawar.nama;
    $('#sheet-antidot-note').textContent = p.penawar.catatan;
    $('#sheet-do').innerHTML = p.p3k.lakukan.map((x) => `<li>${esc(x)}</li>`).join('');
    $('#sheet-dont').innerHTML = p.p3k.jangan.map((x) => `<li>${esc(x)}</li>`).join('');
    $('#sheet-trivia').innerHTML = p.sejarah.map((s) => `<div class="trivia"><h4>${esc(s.judul)}</h4><p>${esc(s.isi)}</p></div>`).join('');
  }

  function flyClone(svg, from, to, duration, returning) {
    const fly = document.createElement('div');
    fly.className = 'flying';
    fly.style.left = from.left + 'px';
    fly.style.top = from.top + 'px';
    fly.style.width = from.width + 'px';
    fly.appendChild(svg.cloneNode(true));
    document.body.appendChild(fly);
    const s = to.width / from.width;
    const dx = to.left - from.left, dy = to.top - from.top;
    const mid = returning
      ? { transform: `translate(${dx * 0.7}px, ${dy * 0.7 - 40}px) scale(${1 + (s - 1) * 0.75}) rotate(3deg)`, offset: 0.6 }
      : { transform: `translate(${dx * 0.12}px, ${dy * 0.12 - 70}px) scale(${1 + (s - 1) * 0.25}) rotate(-5deg)`, offset: 0.3 };
    const anim = fly.animate([
      { transform: 'translate(0,0) scale(1) rotate(0deg)' },
      mid,
      { transform: `translate(${dx}px, ${dy}px) scale(${s}) rotate(0deg)` }
    ], { duration, easing: 'cubic-bezier(.45,.05,.25,1)', fill: 'forwards' });
    return anim.finished.then(() => fly);
  }

  let lastFocus = null;

  async function openPoison(id, originBtn) {
    const p = byId(id);
    if (!p || state.busy || state.openId) return;
    state.busy = true;
    state.openId = id;
    lastFocus = originBtn || document.activeElement;

    fillSheet(p);
    el.slot.innerHTML = `<span class="vial-art">${Vials.render(p, 'panel')}</span>`;
    el.sheet.hidden = false;
    el.backdrop.hidden = false;
    document.body.classList.add('sheet-open');
    el.pageRight.scrollTop = 0; el.inner.scrollTop = 0;
    if (location.hash !== '#/racun/' + id) history.replaceState(null, '', '#/racun/' + id);

    const originSvg = originBtn && originBtn.querySelector('.vial-svg');
    if (!originSvg || reduceMotion()) {
      el.slot.style.visibility = 'visible';
      requestAnimationFrame(() => { el.backdrop.classList.add('is-open'); el.sheet.classList.add('is-open'); });
      if (originBtn) originBtn.classList.add('is-taken');
      await wait(reduceMotion() ? 20 : 500);
      return finishOpen();
    }

    el.sheet.classList.add('measure');
    const to = el.slot.getBoundingClientRect();
    el.sheet.classList.remove('measure');
    void el.sheet.offsetWidth;

    const from = originSvg.getBoundingClientRect();
    originBtn.classList.add('is-taken');
    el.slot.style.visibility = 'hidden';
    el.backdrop.classList.add('is-open');
    setTimeout(() => el.sheet.classList.add('is-open'), 200);
    const fly = await flyClone(originSvg, from, to, 780, false);
    el.slot.style.visibility = 'visible';
    fly.remove();
    finishOpen();
  }

  function finishOpen() {
    state.busy = false;
    el.specimen.classList.add('is-lifted', 'shine');
    setTimeout(() => el.specimen.classList.remove('is-lifted', 'shine'), 1700);
    $('#sheet-title').setAttribute('tabindex', '-1');
    $('#sheet-title').focus({ preventScroll: true });
  }

  async function closeSheet(instant) {
    if (!state.openId || (state.busy && !instant)) return;
    state.busy = true;
    const id = state.openId;
    const originBtn = el.shelves.querySelector(`.vial[data-id="${id}"]`);
    const slotSvg = el.slot.querySelector('.vial-svg');
    const visible = originBtn && isInView(originBtn);

    if (!instant && originBtn && slotSvg && visible && !reduceMotion()) {
      const from = slotSvg.getBoundingClientRect();
      const to = originBtn.querySelector('.vial-svg').getBoundingClientRect();
      el.slot.style.visibility = 'hidden';
      el.sheet.classList.remove('is-open');
      el.backdrop.classList.remove('is-open');
      const fly = await flyClone(slotSvg, from, to, 640, true);
      originBtn.classList.remove('is-taken');
      fly.remove();
    } else {
      el.sheet.classList.remove('is-open');
      el.backdrop.classList.remove('is-open');
      if (!instant) await wait(reduceMotion() ? 20 : 450);
      if (originBtn) originBtn.classList.remove('is-taken');
    }
    el.sheet.hidden = true;
    el.backdrop.hidden = true;
    el.slot.innerHTML = '';
    document.body.classList.remove('sheet-open');
    state.openId = null;
    state.busy = false;
    if (location.hash.indexOf('#/racun/') === 0) history.replaceState(null, '', '#/rak');
    if (!instant) {
      const target = originBtn || lastFocus;
      if (target && document.contains(target)) target.focus({ preventScroll: true });
    }
  }

  function isInView(node) {
    const r = node.getBoundingClientRect();
    return r.bottom > 0 && r.top < window.innerHeight && r.width > 0;
  }

  // goyangkan vial di panel
  el.specimen.addEventListener('click', () => {
    const art = el.slot.querySelector('.vial-art'); if (!art) return;
    art.classList.remove('shake'); void art.offsetWidth; art.classList.add('shake');
    el.specimen.classList.remove('shine'); void el.specimen.offsetWidth; el.specimen.classList.add('shine');
    clearTimeout(art._t);
    art._t = setTimeout(() => { art.classList.remove('shake'); el.specimen.classList.remove('shine'); }, 3400);
  });

  $('#sheet-close').addEventListener('click', () => closeSheet());
  $('#sheet-x').addEventListener('click', () => closeSheet());
  el.backdrop.addEventListener('click', () => closeSheet());

  document.addEventListener('keydown', (e) => {
    if (!state.openId) return;
    if (e.key === 'Escape') { e.preventDefault(); closeSheet(); return; }
    if (e.key === 'Tab') {
      const f = $$('button, a[href], [tabindex]:not([tabindex="-1"])', el.sheet).filter((n) => n.offsetParent !== null || n === el.pageRight);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || !el.sheet.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (document.activeElement === last || !el.sheet.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- Router ---------- */
  function route(initial) {
    const h = location.hash.replace(/^#\/?/, '');
    const [view, arg] = h.split('/');
    const target = ['darurat', 'tentang'].indexOf(view) >= 0 ? view : 'rak';

    if (state.openId && !(view === 'racun' && arg === state.openId)) closeSheet(true);

    $$('.view').forEach((v) => { v.hidden = v.dataset.view !== target; });
    $$('.nav a').forEach((a) => {
      if (a.dataset.nav === target) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });

    if (target !== 'rak') {
      window.scrollTo(0, 0);
      const h1 = $(`[data-view="${target}"] h1`);
      if (h1 && initial !== true) { h1.setAttribute('tabindex', '-1'); h1.focus({ preventScroll: true }); }
    }

    if (view === 'racun' && arg && byId(arg) && !state.openId) {
      const delay = initial === true && !reduceMotion() ? 1500 : 0;
      setTimeout(() => {
        const b = el.shelves.querySelector(`.vial[data-id="${arg}"]`);
        if (b) b.scrollIntoView({ block: 'center', behavior: 'instant' });
        openPoison(arg, b);
      }, delay);
    }
  }

  /* ---------- Debu melayang ---------- */
  function dust() {
    const c = $('.bg-dust');
    if (!c || reduceMotion()) return;
    const ctx = c.getContext('2d');
    let W, H, dpr, motes = [];
    function size() {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = c.width = innerWidth * dpr; H = c.height = innerHeight * dpr;
    }
    size(); addEventListener('resize', size);
    const N = innerWidth < 700 ? 26 : 50;
    for (let i = 0; i < N; i++) {
      motes.push({ x: Math.random() * W, y: Math.random() * H, r: (0.4 + Math.random() * 1.5) * dpr, vx: (Math.random() - 0.5) * 0.12 * dpr, vy: (-0.04 - Math.random() * 0.1) * dpr, a: 0.1 + Math.random() * 0.4, ph: Math.random() * 6.28 });
    }
    let run = true;
    document.addEventListener('visibilitychange', () => { run = !document.hidden; if (run) requestAnimationFrame(tick); });
    function tick(t) {
      if (!run) return;
      ctx.clearRect(0, 0, W, H);
      for (const m of motes) {
        m.x += m.vx + Math.sin(t / 3000 + m.ph) * 0.08 * dpr; m.y += m.vy;
        if (m.y < -10) { m.y = H + 10; m.x = Math.random() * W; }
        if (m.x < -10) m.x = W + 10; if (m.x > W + 10) m.x = -10;
        // lebih terang di dekat cahaya lampu (atas tengah)
        const glow = 1 - Math.min(1, Math.hypot(m.x - W / 2, m.y) / (H * 0.9));
        ctx.globalAlpha = m.a * (0.35 + glow * 0.9) * (0.75 + 0.25 * Math.sin(t / 700 + m.ph));
        ctx.fillStyle = '#f6d9a0';
        ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, 6.283); ctx.fill();
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  dust();
  load();
})();

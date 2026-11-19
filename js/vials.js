/* ==========================================================
   Apotek Gelap: pembuat vial SVG
   Setiap racun digambar dari parameter `vial` di data/racun.json:
   bentuk botol, tutup, warna kaca, kertas label, dan isi.
   ========================================================== */
(function (global) {
  'use strict';

  const VB = { w: 120, h: 212 };

  const GLASS = {
    hijau:   { tint: '#6f9a76', edge: '#b9dbbd', deep: '#22392a' },
    cokelat: { tint: '#9a6e3c', edge: '#e3bd8a', deep: '#3d2814' },
    bening:  { tint: '#a3b8b1', edge: '#e6f0ec', deep: '#3f4f4a' }
  };

  /* ---------- Bentuk botol (viewBox 120 x 212, dasar di y=208) ---------- */
  const SHAPES = {
    kotak: {
      d: 'M50 40 V58 L28 76 V200 Q28 208 36 208 H84 Q92 208 92 200 V76 L70 58 V40 Z',
      rim: { x: 47, y: 34, w: 26, h: 8 }, neck: { x: 50, w: 20, top: 40 },
      cav: { x1: 29, x2: 91, y1: 76, y2: 207 },
      label: { x: 33, y: 112, w: 54, h: 50 }
    },
    apoteker: {
      d: 'M48 46 V58 Q48 66 36 70 Q22 75 22 90 V198 Q22 208 32 208 H88 Q98 208 98 198 V90 Q98 75 84 70 Q72 66 72 58 V46 Z',
      rim: { x: 45, y: 40, w: 30, h: 8 }, neck: { x: 48, w: 24, top: 46 },
      cav: { x1: 23, x2: 97, y1: 74, y2: 207 },
      label: { x: 28, y: 116, w: 64, h: 50 }
    },
    labu: {
      d: 'M52 36 V104 A52 52 0 1 0 68 104 V36 Z',
      rim: { x: 48, y: 30, w: 24, h: 8 }, neck: { x: 52, w: 16, top: 36 },
      cav: { x1: 9, x2: 111, y1: 110, y2: 207 },
      label: { x: 32, y: 140, w: 56, h: 36, rot: -3 }
    },
    tabung: {
      d: 'M46 40 V194 A14 14 0 0 0 74 194 V40 Z',
      rim: { x: 42, y: 36, w: 36, h: 6 }, neck: { x: 46, w: 28, top: 40 },
      cav: { x1: 47, x2: 73, y1: 44, y2: 207 },
      label: { mode: 'tag' },
      tag: { from: [74, 54], hole: [95, 64], rot: 8, wrap: [46, 74, 54] },
      stand: 'rak'
    },
    kerucut: {
      d: 'M51 40 V92 L22 194 Q19 208 32 208 H88 Q101 208 98 194 L69 92 V40 Z',
      rim: { x: 47, y: 34, w: 26, h: 7 }, neck: { x: 51, w: 18, top: 40 },
      cav: { x1: 22, x2: 98, y1: 92, y2: 207 },
      label: { x: 34, y: 168, w: 52, h: 30 }
    },
    tinggi: {
      d: 'M34 54 Q34 46 42 46 H78 Q86 46 86 54 V200 Q86 208 78 208 H42 Q34 208 34 200 Z',
      rim: { x: 31, y: 42, w: 58, h: 8 }, neck: { x: 36, w: 48, top: 46 },
      cav: { x1: 35, x2: 85, y1: 50, y2: 207 },
      label: { x: 38, y: 158, w: 44, h: 38 }
    },
    ampul: {
      d: 'M50 208 Q46 208 46 200 V124 Q46 114 54 108 Q57 105 57 98 Q50 92 52 80 Q55 64 60 60 Q65 64 68 80 Q70 92 63 98 Q63 105 66 108 Q74 114 74 124 V200 Q74 208 70 208 Z',
      rim: null, neck: { x: 57, w: 6, top: 60 },
      cav: { x1: 47, x2: 73, y1: 110, y2: 207 },
      label: { mode: 'tag' },
      tag: { from: [63, 103], hole: [88, 106], rot: 10, wrap: [57, 63, 103] },
      stand: 'balok'
    },
    tetes: {
      d: 'M54 30 V94 Q30 118 30 160 Q30 208 60 208 Q90 208 90 160 Q90 118 66 94 V30 Z',
      rim: { x: 50, y: 24, w: 20, h: 8 }, neck: { x: 54, w: 12, top: 30 },
      cav: { x1: 31, x2: 89, y1: 100, y2: 207 },
      label: { x: 35, y: 140, w: 50, h: 42 }
    },
    pipih: {
      d: 'M50 42 V62 Q24 72 24 122 V178 Q24 208 60 208 Q96 208 96 178 V122 Q96 72 70 62 V42 Z',
      rim: { x: 46, y: 36, w: 28, h: 8 }, neck: { x: 50, w: 20, top: 42 },
      cav: { x1: 25, x2: 95, y1: 68, y2: 207 },
      label: { x: 32, y: 116, w: 56, h: 44 }
    },
    gabus: {
      d: 'M52 44 V72 Q52 80 42 86 Q32 92 32 106 V200 Q32 208 40 208 H80 Q88 208 88 200 V106 Q88 92 78 86 Q68 80 68 72 V44 Z',
      rim: { x: 48, y: 38, w: 24, h: 8 }, neck: { x: 52, w: 16, top: 44 },
      cav: { x1: 33, x2: 87, y1: 88, y2: 207 },
      label: { x: 36, y: 114, w: 48, h: 40 }
    },
    silinder: {
      d: 'M26 84 V200 Q26 208 34 208 H86 Q94 208 94 200 V84 Z',
      rim: { x: 22, y: 76, w: 76, h: 10 }, neck: { x: 26, w: 68, top: 84 },
      cav: { x1: 27, x2: 93, y1: 84, y2: 207 },
      label: { x: 32, y: 118, w: 56, h: 42 }
    },
    toples: {
      d: 'M32 78 V72 Q32 66 40 66 H80 Q88 66 88 72 V78 Q100 86 100 106 V198 Q100 208 90 208 H30 Q20 208 20 198 V106 Q20 86 32 78 Z',
      rim: null, neck: { x: 32, w: 56, top: 66 },
      cav: { x1: 21, x2: 99, y1: 80, y2: 207 },
      label: { x: 28, y: 162, w: 64, h: 38 }
    }
  };

  /* ---------- Utilitas ---------- */
  function hash(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function makeRng(seed) {
    let a = seed;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const f = (n) => Math.round(n * 10) / 10;
  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    const t = amt < 0 ? 0 : 255, p = Math.abs(amt);
    r = Math.round((t - r) * p + r); g = Math.round((t - g) * p + g); b = Math.round((t - b) * p + b);
    return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
  }
  const pick = (r, arr) => arr[Math.floor(r() * arr.length)];
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  let counter = 0;

  /* ---------- Cairan ---------- */
  function liquid(uid, y, color, op, dur, amp) {
    return `<g class="liq" style="transform-origin:60px ${f(y)}px;--dur:${dur}s;--amp:${amp}">
      <rect x="-60" y="${f(y)}" width="240" height="${VB.h}" fill="${color}" opacity="${op}"/>
      <rect x="-60" y="${f(y)}" width="240" height="${VB.h}" fill="url(#${uid}-ld)"/>
      <rect x="-60" y="${f(y - 0.6)}" width="240" height="2" fill="#fff" opacity="${f(Math.min(0.55, op * 0.4 + 0.18) * 100) / 100}"/>
      <rect x="-60" y="${f(y + 1.6)}" width="240" height="5" fill="${shade(color, -0.25)}" opacity="${f(op * 30) / 100}"/>
    </g>`;
  }

  function motes(r, cav, y, n, color) {
    let s = '<g class="motes">';
    for (let i = 0; i < n; i++) {
      const x = cav.x1 + 6 + r() * (cav.x2 - cav.x1 - 12);
      const dx = (r() - 0.5) * 18, dy = -(10 + r() * 34);
      s += `<circle cx="${f(x)}" cy="${f(y + r() * 4)}" r="${f(0.5 + r() * 1.1)}" fill="${color}" style="--dx:${f(dx)}px;--dy:${f(dy)}px;--dl:${f(r() * 0.35)}s"/>`;
    }
    return s + '</g>';
  }

  /* ---------- Isi vial ---------- */
  function contents(p, sh, uid, r) {
    const v = p.vial, cav = sh.cav;
    const bottom = cav.y2, w = cav.x2 - cav.x1;
    const level = cav.y2 - (cav.y2 - cav.y1) * (v.level || 0.5);
    const cx = (cav.x1 + cav.x2) / 2;
    const low = sh.label && sh.label.y ? Math.min(bottom - 10, sh.label.y + 4) : bottom - 10;
    let s = '';

    switch (v.isi) {
      case 'kristal': {
        const top = (x) => level + Math.pow(Math.abs(x - cx) / (w / 2), 2) * 9;
        s += `<path d="M${cav.x1} ${bottom} L${cav.x1} ${f(top(cav.x1))} Q${cx} ${f(level - 8)} ${cav.x2} ${f(top(cav.x2))} L${cav.x2} ${bottom} Z" fill="#dedad0"/>`;
        const tones = ['#f7f5ef', '#ffffff', '#e8e5dc', '#efece4', '#d8d4c9'];
        for (let i = 0; i < 110; i++) {
          const x = cav.x1 + 1 + r() * (w - 2);
          const t = top(x) - 1;
          const y = t + Math.pow(r(), 0.8) * (bottom - t);
          const sz = 1.4 + r() * 2.8, n = 4 + Math.floor(r() * 3), a0 = r() * 6.28;
          let pts = [];
          for (let k = 0; k < n; k++) {
            const a = a0 + (k / n) * 6.28, rr = sz * (0.6 + r() * 0.5);
            pts.push(f(x + Math.cos(a) * rr) + ',' + f(y + Math.sin(a) * rr));
          }
          s += `<polygon points="${pts.join(' ')}" fill="${pick(r, tones)}" stroke="#b9b5aa" stroke-width="0.3"/>`;
        }
        for (let i = 0; i < 7; i++) {
          const x = cav.x1 + 6 + r() * (w - 12), y = top(x) + 2 + r() * 14;
          s += `<path class="glint" style="--dl:${f(r() * 3)}s" d="M${f(x)} ${f(y - 2.4)} L${f(x + 0.5)} ${f(y - 0.5)} L${f(x + 2.4)} ${f(y)} L${f(x + 0.5)} ${f(y + 0.5)} L${f(x)} ${f(y + 2.4)} L${f(x - 0.5)} ${f(y + 0.5)} L${f(x - 2.4)} ${f(y)} L${f(x - 0.5)} ${f(y - 0.5)} Z" fill="#fff"/>`;
        }
        s += motes(r, cav, level - 2, 12, '#f4f2ec');
        break;
      }
      case 'bubuk': {
        // bubuk menempel di dinding kaca
        s += `<rect x="${cav.x1}" y="${f(cav.y1 + 6)}" width="5" height="${f(level - cav.y1)}" fill="#f1efe9" opacity="0.18"/>`;
        s += `<rect x="${cav.x2 - 5}" y="${f(cav.y1 + 6)}" width="5" height="${f(level - cav.y1)}" fill="#f1efe9" opacity="0.14"/>`;
        for (let i = 0; i < 70; i++) {
          const side = r() < 0.5;
          const x = side ? cav.x1 + r() * 9 : cav.x2 - r() * 9;
          const y = cav.y1 + 8 + Math.pow(r(), 0.6) * (level - cav.y1 - 4);
          s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(0.4 + r() * 1.1)}" fill="#f6f4ee" opacity="${f((0.35 + r() * 0.6) * 100) / 100}"/>`;
        }
        for (let i = 0; i < 26; i++) {
          const x = cav.x1 + 6 + r() * (w - 12), y = cav.y1 + 6 + r() * (level - cav.y1 - 10);
          s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(0.3 + r() * 0.5)}" fill="#f6f4ee" opacity="0.5"/>`;
        }
        s += `<path d="M${cav.x1} ${bottom} V${f(level + 4)} Q${cav.x1 + 6} ${f(level - 4)} ${f(cx - 8)} ${f(level - 6)} Q${cx + 4} ${f(level - 9)} ${f(cav.x2 - 8)} ${f(level - 2)} Q${cav.x2} ${f(level)} ${cav.x2} ${f(level + 6)} V${bottom} Z" fill="url(#${uid}-pw)"/>`;
        for (let i = 0; i < 40; i++) {
          const x = cav.x1 + 3 + r() * (w - 6), y = level + r() * (bottom - level);
          s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(0.4 + r() * 0.7)}" fill="#d9d5ca" opacity="0.6"/>`;
        }
        s += motes(r, cav, level - 6, 22, '#f6f4ee');
        break;
      }
      case 'beri': {
        s += liquid(uid, level, v.warnaCairan || '#e8eedc', 0.2, 5, 1);
        s += '<g class="floaters">';
        const berries = [];
        const rowY = [bottom - 9, bottom - 24, bottom - 38, level + 12];
        const perRow = [5, 4, 3, 2];
        rowY.forEach((y, ri) => {
          for (let k = 0; k < perRow[ri]; k++) {
            const span = w * (ri === 3 ? 0.5 : 0.85 - ri * 0.12);
            const x = cx - span / 2 + (k + 0.5) * (span / perRow[ri]) + (r() - 0.5) * 6;
            berries.push([x, y + (r() - 0.5) * 6, 7 + r() * 2.4]);
          }
        });
        berries.forEach(([x, y, rr], i) => {
          s += `<g class="bob" style="--dl:${f(i * 0.3)}s">
            <circle cx="${f(x)}" cy="${f(y)}" r="${f(rr)}" fill="#0e0c12" stroke="#2c2433" stroke-width="0.6"/>
            <circle cx="${f(x)}" cy="${f(y)}" r="${f(rr)}" fill="url(#${uid}-bg)"/>
            <ellipse cx="${f(x - rr * 0.38)}" cy="${f(y - rr * 0.4)}" rx="${f(rr * 0.28)}" ry="${f(rr * 0.18)}" fill="#fff" opacity="0.75" transform="rotate(-30 ${f(x - rr * 0.38)} ${f(y - rr * 0.4)})"/>
            <circle cx="${f(x + rr * 0.35)}" cy="${f(y + rr * 0.3)}" r="${f(rr * 0.08)}" fill="#fff" opacity="0.35"/>
          </g>`;
          if (i % 3 === 0) {
            const cy = y - rr + 1; let pts = [];
            for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + (k / 10) * 6.28, q = k % 2 ? 1.6 : 4.4; pts.push(f(x + Math.cos(a) * q) + ',' + f(cy + Math.sin(a) * q * 0.55)); }
            s += `<polygon points="${pts.join(' ')}" fill="#3d5a2c"/>`;
          }
        });
        s += '</g>';
        break;
      }
      case 'batang': {
        s += liquid(uid, level, v.warnaCairan || '#f1e9b8', 0.5, 4.5, 1);
        s += '<g class="floaters">';
        const stems = [[cx - 3, bottom - 40, 70, -8], [cx + 4, bottom - 70, 54, 12], [cx - 2, level + 28, 34, -20]];
        stems.forEach(([x, y, h, a], i) => {
          let spots = '';
          for (let k = 0; k < 9; k++) spots += `<ellipse cx="${f((r() - 0.5) * 4)}" cy="${f((r() - 0.5) * h * 0.9)}" rx="${f(0.7 + r() * 1.2)}" ry="${f(0.9 + r() * 1.8)}" fill="#6b2a4f" opacity="0.9"/>`;
          s += `<g class="bob" style="--dl:${i * 0.7}s"><g transform="translate(${f(x)} ${f(y)}) rotate(${a})">
            <rect x="-3.2" y="${f(-h / 2)}" width="6.4" height="${h}" rx="3" fill="#6f8f3a"/>
            <rect x="-3.2" y="${f(-h / 2)}" width="2" height="${h}" rx="1" fill="#9db866" opacity="0.6"/>
            ${spots}
            <rect x="-3.6" y="${f(-h / 6)}" width="7.2" height="1.6" fill="#55702b"/>
          </g></g>`;
        });
        for (let i = 0; i < 3; i++) {
          const x = cav.x1 + 4 + r() * (w - 8), y = level + 10 + r() * 40;
          s += `<path d="M${f(x)} ${f(y)} q3 -4 6 -1 q-2 1 -1 3 q3 -2 5 1" fill="none" stroke="#6f8f3a" stroke-width="1.2" stroke-linecap="round"/>`;
        }
        s += '</g>';
        break;
      }
      case 'kelopak': {
        s += liquid(uid, level, v.warnaCairan || '#e9efe2', 0.22, 5, 1);
        s += '<g class="floaters">';
        for (let i = 0; i < 4; i++) {
          const x = cx + (r() - 0.5) * (w * 0.55), y = level + 12 + r() * (low - level - 14), a = r() * 180;
          s += `<g class="bob" style="--dl:${f(r() * 3)}s"><g transform="translate(${f(x)} ${f(y)}) rotate(${f(a)}) scale(${f(1.1 + r() * 0.4)})">
            <path d="M0 -15 Q6.5 0 0 15 Q-6.5 0 0 -15 Z" fill="#2f4a2a"/><path d="M0 -14 V14" stroke="#4f6e42" stroke-width="0.7"/></g></g>`;
        }
        const pinks = ['#f2a3b8', '#e98aa5', '#f6bccb', '#f5f0ea', '#e07a96'];
        for (let i = 0; i < 10; i++) {
          const y = level + 6 + r() * (low - level - 6), half = (w / 2) * (0.35 + 0.6 * (y - cav.y1) / (bottom - cav.y1));
          const x = cx + (r() - 0.5) * 2 * half, a = r() * 180;
          const c = pick(r, pinks);
          s += `<g class="bob" style="--dl:${f(r() * 3)}s"><g transform="translate(${f(x)} ${f(y)}) rotate(${f(a)}) scale(1.45)">
            <path d="M0 0 C-6 -2 -7 -9 -2 -11 C0 -12 1 -12 2 -11 C7 -9 6 -2 0 0 Z" fill="${c}" stroke="${shade(c, -0.18)}" stroke-width="0.4"/>
            <path d="M0 -1 V-9" stroke="${shade(c, -0.2)}" stroke-width="0.4" opacity="0.6"/></g></g>`;
        }
        s += '</g>';
        break;
      }
      case 'lonceng': {
        s += `<path d="M${cx + 2} ${bottom} C${cx - 6} ${bottom - 50} ${cx + 8} ${level + 50} ${cx - 2} ${level}" fill="none" stroke="#6b6a3a" stroke-width="2"/>`;
        for (let i = 0; i < 4; i++) {
          const x = cav.x1 + 4 + r() * (w - 8);
          s += `<path d="M${f(x)} ${bottom} q${f(-4 + r() * 8)} -8 ${f(-2 + r() * 4)} -16 q4 6 3 16 Z" fill="#7a6a3c" opacity="0.8"/>`;
        }
        const tones = ['#b0578f', '#9c4a7e', '#c47aa6', '#a8628c'];
        const n = 7;
        for (let i = 0; i < n; i++) {
          const t = i / (n - 1);
          const y = low - 14 - t * (low - level - 14);
          const side = i % 2 ? 1 : -1;
          const x = cx + side * (5 + r() * 6);
          const c = pick(r, tones);
          let spots = '';
          for (let k = 0; k < 4; k++) spots += `<circle cx="${f((r() - 0.5) * 6)}" cy="${f(12 + r() * 4)}" r="0.7" fill="#4a1f3a"/>`;
          s += `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(side * (25 + r() * 25))}) scale(1.55)">
            <path d="M0 0 C-3 2 -4 9 -6.5 15 Q0 18.5 6.5 15 C4 9 3 2 0 0 Z" fill="${c}" stroke="${shade(c, -0.3)}" stroke-width="0.4"/>
            <path d="M-1 2 C-2 7 -3 11 -4 14" stroke="${shade(c, 0.25)}" stroke-width="0.6" fill="none" opacity="0.6"/>
            <ellipse cx="0" cy="15.2" rx="6.3" ry="2" fill="${shade(c, 0.35)}"/>
            ${spots}
          </g>`;
        }
        break;
      }
      case 'cairan': {
        s += liquid(uid, level, v.warnaCairan || '#eef3ee', 0.26, 3.6, 1.2);
        for (let i = 0; i < 6; i++) {
          s += `<circle class="bubble" style="--dl:${f(r() * 4)}s" cx="${f(cav.x1 + 4 + r() * (w - 8))}" cy="${f(level + 6 + r() * (bottom - level - 10))}" r="${f(0.5 + r() * 0.9)}" fill="none" stroke="#fff" stroke-width="0.4" opacity="0.7"/>`;
        }
        break;
      }
      case 'kental': {
        const visc = v.kekentalan == null ? 1 : v.kekentalan;
        const c = v.warnaCairan;
        for (let i = 0; i < 6; i++) {
          const x = cav.x1 + 3 + r() * (w - 6), h = 6 + r() * 18;
          s += `<rect x="${f(x)}" y="${f(level - h)}" width="${f(1.4 + r() * 1.6)}" height="${f(h + 4)}" rx="1" fill="${c}" opacity="${f((0.25 + r() * 0.25) * 100) / 100}"/>`;
        }
        s += liquid(uid, level, c, 0.86, f(5 + visc * 5), f(0.5 + (1 - visc) * 0.5));
        s += '<g class="floaters">';
        for (let i = 0; i < 7; i++) {
          s += `<circle cx="${f(cav.x1 + 6 + r() * (w - 12))}" cy="${f(level + 6 + r() * (bottom - level - 12))}" r="${f(0.6 + r() * 1.4)}" fill="${shade(c, 0.45)}" opacity="0.7"/>`;
        }
        s += '</g>';
        break;
      }
      case 'merkuri': {
        const y = level;
        s += `<g class="beads">
          <path d="M${cav.x1} ${bottom} V${f(y + 6)} Q${cav.x1 + 1} ${f(y)} ${cav.x1 + 8} ${f(y)} H${cav.x2 - 8} Q${cav.x2 - 1} ${f(y)} ${cav.x2} ${f(y + 6)} V${bottom} Z" fill="url(#${uid}-mp)"/>
          <rect class="merc-shine" x="${cav.x1}" y="${f(y + 1)}" width="14" height="${f(bottom - y)}" fill="url(#${uid}-ms)"/>`;
        const beads = [];
        for (let i = 0; i < 9; i++) {
          const rr = 1.6 + r() * 3.6;
          const onWall = i > 5;
          const x = onWall ? (r() < 0.5 ? cav.x1 + rr + 1 : cav.x2 - rr - 1) : cav.x1 + 8 + r() * (w - 16);
          const by = onWall ? y - 6 - r() * 30 : y - rr * 0.8;
          beads.push([x, by, rr]);
        }
        beads.forEach(([x, by, rr], i) => {
          s += `<circle cx="${f(x)}" cy="${f(by)}" r="${f(rr)}" fill="url(#${uid}-mb)"/>
                <circle class="glint" style="--dl:${f(i * 0.45)}s" cx="${f(x - rr * 0.35)}" cy="${f(by - rr * 0.4)}" r="${f(Math.max(0.5, rr * 0.25))}" fill="#fff"/>`;
        });
        s += `<ellipse cx="${cx}" cy="${f(y + 2)}" rx="${f(w / 2 - 10)}" ry="1.2" fill="#fff" opacity="0.7"/></g>`;
        break;
      }
      case 'pelet': {
        const greys = ['#6d7378', '#5b6166', '#7b8186', '#646a70', '#71777c'];
        const top = level;
        const items = [];
        for (let i = 0; i < 40; i++) {
          const x = cav.x1 + 4 + r() * (w - 8);
          const y = bottom - 3 - Math.pow(r(), 1.1) * (bottom - top - 3);
          items.push([x, y]);
        }
        items.sort((a, b) => a[1] - b[1]);
        items.forEach(([x, y]) => {
          const rx = 3 + r() * 3, ry = 2.4 + r() * 2.2, a = r() * 180, c = pick(r, greys);
          if (r() < 0.3) {
            s += `<polygon points="${f(x - rx)},${f(y)} ${f(x - rx * 0.2)},${f(y - ry)} ${f(x + rx)},${f(y - ry * 0.3)} ${f(x + rx * 0.4)},${f(y + ry)}" fill="${c}" stroke="#3f4448" stroke-width="0.4"/>`;
          } else {
            s += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" transform="rotate(${f(a)} ${f(x)} ${f(y)})" fill="${c}" stroke="#3f4448" stroke-width="0.4"/>
                  <ellipse cx="${f(x - rx * 0.3)}" cy="${f(y - ry * 0.35)}" rx="${f(rx * 0.4)}" ry="${f(ry * 0.25)}" fill="#a7adb2" opacity="0.28"/>`;
          }
        });
        break;
      }
      case 'jamur': {
        s += liquid(uid, level, v.warnaCairan || '#edf1e4', 0.24, 5.5, 0.9);
        s += '<g class="floaters">';
        const olives = ['#8a8f45', '#9a9b4f', '#a3a45a', '#7d8240', '#b3ad62'];
        for (let i = 0; i < 6; i++) {
          const x = cav.x1 + 16 + r() * (w - 32), y = level + 12 + r() * (low - level - 12), a = (r() - 0.5) * 120;
          const c = pick(r, olives);
          let gills = '';
          for (let k = -8; k <= 8; k += 2.6) gills += `<path d="M${f(k)} ${f(1.5 - Math.abs(k) * 0.12)} V3.2" stroke="#d6cfb8" stroke-width="0.45"/>`;
          s += `<g class="bob" style="--dl:${f(r() * 3)}s"><g transform="translate(${f(x)} ${f(y)}) rotate(${f(a)}) scale(${f(0.95 + r() * 0.35)})">
            <path d="M-13 3 Q-12 -9 0 -10 Q12 -9 13 3 Z" fill="${c}"/>
            <path d="M-10.5 3 Q0 -5.5 10.5 3 Z" fill="#f1ecdc"/>
            ${gills}
            <path d="M-13 3 H13" stroke="#e4ddc6" stroke-width="1"/>
          </g></g>`;
        }
        for (let i = 0; i < 2; i++) {
          const x = cav.x1 + 14 + r() * (w - 28), y = bottom - 10 - r() * 16;
          s += `<g transform="rotate(${f(70 + r() * 40)} ${f(x)} ${f(y)})"><rect x="${f(x - 9)}" y="${f(y - 2.5)}" width="18" height="5" rx="2.5" fill="#f3efe2"/><rect x="${f(x - 2)}" y="${f(y - 3.4)}" width="3" height="6.8" rx="1" fill="#e6dfca"/></g>`;
        }
        s += '</g>';
        break;
      }
    }
    return s;
  }

  /* ---------- Tutup ---------- */
  function cork(cx, w, top, bot, color, r) {
    const tw = w + 4, bw = w - 2;
    let dots = '';
    for (let i = 0; i < 14; i++) dots += `<circle cx="${f(cx + (r() - 0.5) * (bw - 1))}" cy="${f(top + 2 + r() * (bot - top - 3))}" r="${f(0.3 + r() * 0.5)}" fill="${shade(color, -0.35)}" opacity="0.7"/>`;
    return `<path d="M${f(cx - tw / 2)} ${top} H${f(cx + tw / 2)} L${f(cx + bw / 2)} ${bot} H${f(cx - bw / 2)} Z" fill="${color}"/>
      <path d="M${f(cx + tw / 2 - 3)} ${top} L${f(cx + bw / 2 - 2)} ${bot} H${f(cx + bw / 2)} L${f(cx + tw / 2)} ${top} Z" fill="${shade(color, -0.25)}"/>
      <ellipse cx="${cx}" cy="${top}" rx="${f(tw / 2)}" ry="1.8" fill="${shade(color, 0.18)}"/>${dots}`;
  }

  function capBefore(v, sh, r) {
    // bagian tutup yang masuk ke leher botol (digambar sebelum kaca)
    const n = sh.neck, rim = sh.rim, cx = 60;
    switch (v.tutup) {
      case 'gabus': case 'lilin': return cork(cx, n.w, rim.y - 14, rim.y + 12, v.tutup === 'lilin' ? '#a77b4f' : v.warnaTutup, r);
      case 'gabus-lebar': return cork(cx, n.w - 2, rim.y - 12, rim.y + 10, v.warnaTutup, r);
      case 'karet': {
        const c = v.warnaTutup, tw = n.w + 6, bw = n.w - 1, top = rim.y - 16, bot = rim.y + 12;
        return `<path d="M${f(cx - tw / 2)} ${top + 2} Q${f(cx - tw / 2)} ${top} ${f(cx - tw / 2 + 2)} ${top} H${f(cx + tw / 2 - 2)} Q${f(cx + tw / 2)} ${top} ${f(cx + tw / 2)} ${top + 2} L${f(cx + bw / 2)} ${bot} H${f(cx - bw / 2)} Z" fill="${c}"/>
          <path d="M${f(cx - tw / 2 + 2)} ${top + 1} L${f(cx - bw / 2 + 2)} ${bot}" stroke="${shade(c, 0.3)}" stroke-width="1.2" opacity="0.6"/>
          <ellipse cx="${cx}" cy="${top + 0.6}" rx="${f(tw / 2 - 2)}" ry="1.4" fill="${shade(c, 0.25)}"/>`;
      }
      case 'sumbat-kaca': case 'sumbat-faset':
        return `<rect x="${n.x + 2}" y="${rim.y - 4}" width="${n.w - 4}" height="18" rx="2" fill="${v.warnaTutup}" opacity="0.55"/>`;
      default: return '';
    }
  }

  function capAfter(v, sh, r, uid) {
    const rim = sh.rim, n = sh.neck, cx = 60;
    switch (v.tutup) {
      case 'ulir': {
        const c = v.warnaTutup, x = rim.x - 2, y = rim.y - 16, w = rim.w + 4, h = rim.h + 16;
        let ridges = '';
        for (let k = x + 3; k < x + w - 2; k += 2.4) ridges += `<path d="M${f(k)} ${y + 3} V${y + h - 2}" stroke="${shade(c, 0.22)}" stroke-width="0.6" opacity="0.7"/>`;
        return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${c}"/>${ridges}
          <rect x="${x}" y="${y}" width="${w}" height="3" rx="1.5" fill="${shade(c, 0.3)}"/>
          <rect x="${x + 2}" y="${y + 3}" width="4" height="${h - 5}" fill="#fff" opacity="0.1"/>`;
      }
      case 'sumbat-kaca': {
        const c = v.warnaTutup, y = rim.y - 12;
        return `<rect x="${n.x - 1}" y="${y + 6}" width="${n.w + 2}" height="6" rx="2" fill="${c}" opacity="0.85"/>
          <ellipse cx="${cx}" cy="${y}" rx="${f(rim.w * 0.58)}" ry="10" fill="${c}" opacity="0.88"/>
          <ellipse cx="${cx}" cy="${y}" rx="${f(rim.w * 0.58)}" ry="10" fill="url(#${uid}-g)" opacity="0.6"/>
          <ellipse cx="${cx - 5}" cy="${y - 4}" rx="4" ry="2.4" fill="#fff" opacity="0.45"/>`;
      }
      case 'sumbat-faset': {
        const c = v.warnaTutup, b = rim.y - 2;
        return `<polygon points="${cx},${b - 30} ${cx + 12},${b - 20} ${cx + 8},${b - 4} ${cx - 8},${b - 4} ${cx - 12},${b - 20}" fill="${c}" opacity="0.88"/>
          <polyline points="${cx - 12},${b - 20} ${cx},${b - 16} ${cx + 12},${b - 20}" fill="none" stroke="${shade(c, 0.5)}" stroke-width="0.7"/>
          <path d="M${cx} ${b - 30} V${b - 16} M${cx} ${b - 16} L${cx - 8} ${b - 4} M${cx} ${b - 16} L${cx + 8} ${b - 4}" stroke="${shade(c, -0.3)}" stroke-width="0.6"/>
          <polygon points="${cx},${b - 30} ${cx - 12},${b - 20} ${cx},${b - 16}" fill="#fff" opacity="0.3"/>
          <rect x="${n.x}" y="${b - 5}" width="${n.w}" height="5" rx="1.5" fill="${c}" opacity="0.8"/>`;
      }
      case 'lilin': {
        const c = v.warnaTutup, top = rim.y - 16, x1 = rim.x - 2, x2 = rim.x + rim.w + 2;
        let drips = '';
        for (let k = 0; k < 4; k++) {
          const dx = x1 + 3 + r() * (x2 - x1 - 6), len = 8 + r() * 14;
          drips += `<path d="M${f(dx - 2)} ${rim.y + 6} V${f(rim.y + 6 + len)} a2 2 0 0 0 4 0 V${rim.y + 6} Z" fill="${c}"/>`;
        }
        return `<path d="M${x1} ${rim.y + 8} V${top + 6} Q${x1} ${top} ${cx} ${top - 1} Q${x2} ${top} ${x2} ${top + 6} V${rim.y + 8} Z" fill="${c}"/>${drips}
          <path d="M${x1 + 2} ${top + 6} Q${x1 + 4} ${top + 2} ${cx - 2} ${top + 1}" stroke="#fff" stroke-width="1.2" opacity="0.25" fill="none"/>
          <circle cx="${cx}" cy="${rim.y + 1}" r="5.5" fill="${shade(c, -0.2)}"/><circle cx="${cx}" cy="${rim.y + 1}" r="3.8" fill="none" stroke="${shade(c, 0.25)}" stroke-width="0.6"/>`;
      }
      case 'pita':
        return `<rect x="54.5" y="99" width="11" height="3.2" rx="1" fill="${v.warnaTutup}"/><rect x="54.5" y="99" width="11" height="1" fill="#fff" opacity="0.3"/>`;
      case 'kaleng': {
        const c = v.warnaTutup, x = rim.x - 2, y = rim.y - 14, w = rim.w + 4, h = rim.h + 12;
        return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="url(#${uid}-tin)"/>
          <path d="M${x + 2} ${y + 5} H${x + w - 2} M${x + 2} ${y + h - 5} H${x + w - 2}" stroke="${shade(c, -0.35)}" stroke-width="0.8"/>
          <rect x="${x}" y="${y}" width="${w}" height="2.4" rx="1.2" fill="${shade(c, 0.4)}"/>`;
      }
      case 'kubah-kaca': {
        const c = v.warnaTutup;
        return `<path d="M26 68 Q60 34 94 68 Z" fill="${c}" opacity="0.32" stroke="${shade(c, 0.4)}" stroke-width="0.9"/>
          <path d="M34 62 Q44 50 56 47" stroke="#fff" stroke-width="1.6" opacity="0.4" fill="none" stroke-linecap="round"/>
          <rect x="24" y="64" width="72" height="6" rx="2.5" fill="${c}" opacity="0.55" stroke="${shade(c, 0.4)}" stroke-width="0.6"/>
          <circle cx="60" cy="45" r="6" fill="${c}" opacity="0.7" stroke="${shade(c, 0.4)}" stroke-width="0.6"/><circle cx="58" cy="43" r="1.8" fill="#fff" opacity="0.6"/>`;
      }
      default: return '';
    }
  }

  /* ---------- Label ---------- */
  function splitName(name) {
    if (name.length <= 9 || name.indexOf(' ') < 0) return [name];
    const words = name.split(' ');
    let best = [name], bestMax = Infinity;
    for (let i = 1; i < words.length; i++) {
      const a = words.slice(0, i).join(' '), b = words.slice(i).join(' ');
      const m = Math.max(a.length, b.length);
      if (m < bestMax) { bestMax = m; best = [a, b]; }
    }
    return best;
  }

  function skullIcon(x, y, s, color) {
    return `<g transform="translate(${f(x)} ${f(y)}) scale(${s})" fill="${color}">
      <path d="M0 -5 C-4 -5 -5 -2 -5 0 C-5 2 -4 3 -3 3.4 V5 H3 V3.4 C4 3 5 2 5 0 C5 -2 4 -5 0 -5 Z"/>
      <circle cx="-2" cy="-0.2" r="1.25" fill="#f3ead6"/><circle cx="2" cy="-0.2" r="1.25" fill="#f3ead6"/>
      <path d="M0 1.4 L-0.7 2.6 H0.7 Z" fill="#f3ead6"/>
      <path d="M-6 6 L6 9 M6 6 L-6 9" stroke="${color}" stroke-width="1.3" stroke-linecap="round"/>
    </g>`;
  }

  function pufferIcon(x, y, s) {
    let spikes = '';
    for (let k = 0; k < 12; k++) { const a = (k / 12) * 6.28; spikes += `<path d="M${f(Math.cos(a) * 5)} ${f(Math.sin(a) * 4.4)} L${f(Math.cos(a) * 6.6)} ${f(Math.sin(a) * 5.8)}" stroke="#2b1d14" stroke-width="0.5"/>`; }
    return `<g transform="translate(${f(x)} ${f(y)}) scale(${s})">${spikes}
      <ellipse cx="0" cy="0" rx="5" ry="4.4" fill="#d9b867" stroke="#2b1d14" stroke-width="0.5"/>
      <path d="M5 0 L8.5 -2.6 V2.6 Z" fill="#d9b867" stroke="#2b1d14" stroke-width="0.5"/>
      <circle cx="-2.2" cy="-1" r="0.9" fill="#2b1d14"/><path d="M-4.6 1.2 q0.6 0.5 1.2 0" stroke="#2b1d14" stroke-width="0.4" fill="none"/></g>`;
  }

  function wrapLabel(p, sh, r) {
    const L = sh.label, v = p.vial, ink = v.tinta || '#2b1d14', paper = v.kertas;
    const rot = (r() - 0.5) * 3.5 + (L.rot || 0);
    const cx = L.x + L.w / 2, cy = L.y + L.h / 2;
    const lines = splitName(v.labelNama || p.nama);
    const longest = Math.max.apply(null, lines.map((l) => l.length));
    const hasSkull = (v.detail || []).indexOf('tengkorak') >= 0;
    const avail = L.h - 13;
    let fs = Math.min(14, (L.w - 6) / (longest * 0.43), avail / (lines.length * 1.02));
    fs = f(fs);
    const blockH = lines.length * fs * 0.98;
    const startY = L.y + 10 + (avail - blockH) / 2 + fs * 0.78;
    let text = '';
    lines.forEach((ln, i) => {
      text += `<text x="${f(cx)}" y="${f(startY + i * fs * 0.98)}" font-family="'Caveat', cursive" font-weight="700" font-size="${fs}" fill="${ink}" text-anchor="middle">${esc(ln)}</text>`;
    });
    const stain = `<circle cx="${f(L.x + 6 + r() * (L.w - 12))}" cy="${f(L.y + 6 + r() * (L.h - 12))}" r="${f(5 + r() * 7)}" fill="#7a5a2a" opacity="0.08"/>`;
    return `<g class="label" transform="rotate(${f(rot)} ${f(cx)} ${f(cy)})">
      <rect x="${L.x}" y="${L.y}" width="${L.w}" height="${L.h}" rx="1.5" fill="${paper}" stroke="${shade(paper, -0.3)}" stroke-width="0.7"/>
      <rect x="${L.x}" y="${L.y}" width="${L.w}" height="${L.h}" rx="1.5" fill="url(#paper-age)"/>
      ${stain}
      <rect x="${L.x + 2}" y="${L.y + 2}" width="${L.w - 4}" height="${L.h - 4}" fill="none" stroke="${ink}" stroke-width="0.45" opacity="0.5"/>
      <text x="${f(cx)}" y="${L.y + 8.4}" font-family="'Special Elite', monospace" font-size="4.6" fill="${ink}" opacity="0.8" text-anchor="middle" letter-spacing="0.4">${esc(p.katalog)}</text>
      <path d="M${L.x + 8} ${L.y + 10.2} H${L.x + L.w - 8}" stroke="${ink}" stroke-width="0.35" opacity="0.5"/>
      ${text}
      ${hasSkull ? skullIcon(L.x + L.w - 7, L.y + 6.4, 0.5, '#7a1f24') + skullIcon(L.x + 7, L.y + 6.4, 0.5, '#7a1f24') : ''}
    </g>`;
  }

  function tagLabel(p, sh, r) {
    const T = sh.tag, v = p.vial, ink = v.tinta || '#2b1d14', paper = v.kertas;
    const [hx, hy] = T.hole;
    const fish = (v.detail || []).indexOf('buntal') >= 0;
    const name = v.labelNama || p.nama;
    const textLen = fish ? 30 : 44;
    const fs = f(Math.min(11, textLen / (name.length * 0.43)));
    const midY = fish ? 19 : 30;
    const wrap = T.wrap;
    return `<path d="M${wrap[0]} ${wrap[2] - 1} Q60 ${wrap[2] + 3} ${wrap[1]} ${wrap[2] - 1}" stroke="#cdbb94" stroke-width="0.9" fill="none"/>
      <path d="M${T.from[0]} ${T.from[1]} Q${f((T.from[0] + hx) / 2 + 2)} ${f(T.from[1] - 2)} ${hx} ${hy + 2}" stroke="#cdbb94" stroke-width="0.8" fill="none"/>
      <g class="label" transform="translate(${hx} ${hy}) rotate(${T.rot})">
        <path d="M-6 -1 L6 -1 L12.5 6 V56 H-12.5 V6 Z" fill="${paper}" stroke="${shade(paper, -0.3)}" stroke-width="0.7"/>
        <path d="M-6 -1 L6 -1 L12.5 6 V56 H-12.5 V6 Z" fill="url(#paper-age)"/>
        <circle cx="0" cy="3" r="1.8" fill="#2a1a10"/><circle cx="0" cy="3" r="2.6" fill="none" stroke="${shade(paper, -0.25)}" stroke-width="0.6"/>
        <text transform="translate(${f(fs * 0.34)} ${midY + 6}) rotate(-90)" font-family="'Caveat', cursive" font-weight="700" font-size="${fs}" fill="${ink}" text-anchor="middle">${esc(name)}</text>
        <text transform="translate(9 ${midY + 6}) rotate(-90)" font-family="'Special Elite', monospace" font-size="3.8" fill="${ink}" opacity="0.75" text-anchor="middle">${esc(p.katalog)}</text>
        ${fish ? pufferIcon(-1, 48, 0.85) : ''}
      </g>`;
  }

  /* ---------- Detail kecil ---------- */
  function details(p, sh, r, uid) {
    const v = p.vial, d = v.detail || [], cav = sh.cav;
    let s = '';
    if (d.indexOf('rusuk') >= 0) {
      for (const x of [32, 35.5, 84.5, 88]) s += `<path d="M${x} 84 V198" stroke="#fff" stroke-width="0.9" opacity="0.16"/>`;
    }
    if (d.indexOf('retak') >= 0) {
      const x = cav.x2 - 10 - r() * 6, y = cav.y1 + 10 + r() * 10;
      s += `<path d="M${f(x)} ${f(y)} l-3 6 l3 3 l-5 7 l2 4 l-3 6 M${f(x - 3)} ${f(y + 9)} l4 3 l-1 4" fill="none" stroke="#fff" stroke-width="0.55" opacity="0.6" stroke-linejoin="bevel"/>
            <path d="M${f(x + 0.6)} ${f(y + 0.4)} l-3 6 l3 3 l-5 7" fill="none" stroke="#000" stroke-width="0.4" opacity="0.3"/>`;
    }
    if (d.indexOf('lilin') >= 0 && sh.rim) {
      const c = v.warnaLilin || '#7a1f24', y = sh.rim.y - 12;
      let drips = '';
      for (let k = 0; k < 3; k++) { const dx = 52 + r() * 16, len = 5 + r() * 12; drips += `<path d="M${f(dx - 1.6)} ${y} V${f(y + len)} a1.6 1.6 0 0 0 3.2 0 V${y} Z" fill="${c}"/>`; }
      s += `${drips}<circle cx="60" cy="${y}" r="8.5" fill="${c}"/><circle cx="60" cy="${y}" r="6" fill="none" stroke="${shade(c, 0.28)}" stroke-width="0.7"/>
        <path d="M57 ${y - 2.5} L60 ${y + 2.8} L63 ${y - 2.5} M58.2 ${y + 0.3} H61.8" stroke="${shade(c, 0.32)}" stroke-width="0.8" fill="none"/>
        <ellipse cx="57" cy="${y - 4}" rx="2.6" ry="1.4" fill="#fff" opacity="0.22"/>`;
    }
    return s;
  }

  function stand(sh) {
    if (sh.stand === 'rak') {
      return `<g class="stand">
        <rect x="30" y="200" width="60" height="8" rx="1.5" fill="#4a2c18"/><rect x="30" y="200" width="60" height="1.6" fill="#7a5032"/>
        <rect x="32" y="150" width="4" height="52" fill="#4a2c18"/><rect x="84" y="150" width="4" height="52" fill="#3b2213"/>
        <rect x="30" y="148" width="60" height="7" rx="1.5" fill="#5a3620"/><rect x="30" y="148" width="60" height="1.6" fill="#8a5c3a"/>
        <ellipse cx="60" cy="151.5" rx="14.5" ry="2" fill="#24140a" opacity="0.6"/>
      </g>`;
    }
    if (sh.stand === 'balok') {
      return `<g class="stand">
        <rect x="36" y="184" width="48" height="24" rx="2" fill="#5a3620"/><rect x="36" y="184" width="48" height="2" fill="#8a5c3a"/>
        <path d="M40 192 H80 M40 200 H80" stroke="#3b2213" stroke-width="0.6" opacity="0.7"/>
      </g>`;
    }
    return '';
  }

  /* ---------- Render ---------- */
  function render(p, ctx) {
    const v = p.vial, sh = SHAPES[v.bentuk] || SHAPES.kotak;
    const g = GLASS[v.kaca] || GLASS.hijau;
    const uid = `v-${p.id}-${ctx || 'x'}-${counter++}`;
    const r = makeRng(hash(p.id));
    const cav = sh.cav;
    const visc = v.isi === 'kental' ? (v.kekentalan == null ? 1 : v.kekentalan) : v.isi === 'merkuri' ? 0.15 : 0;

    const defs = `<defs>
      <clipPath id="${uid}-c"><path d="${sh.d}"/></clipPath>
      <linearGradient id="${uid}-g" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stop-color="${g.deep}" stop-opacity="0.55"/>
        <stop offset="0.12" stop-color="${g.edge}" stop-opacity="0.32"/>
        <stop offset="0.22" stop-color="#ffffff" stop-opacity="0.18"/>
        <stop offset="0.4" stop-color="${g.tint}" stop-opacity="0.06"/>
        <stop offset="0.75" stop-color="${g.tint}" stop-opacity="0.1"/>
        <stop offset="0.92" stop-color="${g.deep}" stop-opacity="0.45"/>
        <stop offset="1" stop-color="${g.deep}" stop-opacity="0.7"/>
      </linearGradient>
      <linearGradient id="${uid}-ld" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="0.6" stop-color="#000" stop-opacity="0.22"/></linearGradient>
      <linearGradient id="${uid}-sw" x1="0" x2="1" y1="0" y2="0.3"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.5" stop-color="#fff9e6" stop-opacity="0.55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <linearGradient id="${uid}-pw" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fbfaf6"/><stop offset="1" stop-color="#d8d4c8"/></linearGradient>
      <radialGradient id="${uid}-bg" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="#4a3b55" stop-opacity="0.8"/><stop offset="0.5" stop-color="#14101a" stop-opacity="0"/></radialGradient>
      <linearGradient id="${uid}-mp" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#f7f9fb"/><stop offset="0.25" stop-color="#9aa1a8"/><stop offset="0.5" stop-color="#e3e6ea"/><stop offset="0.8" stop-color="#5f666d"/><stop offset="1" stop-color="#a9afb5"/></linearGradient>
      <linearGradient id="${uid}-ms" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.5" stop-color="#fff" stop-opacity="0.85"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <radialGradient id="${uid}-mb" cx="0.35" cy="0.3" r="0.75"><stop offset="0" stop-color="#ffffff"/><stop offset="0.35" stop-color="#d4d8dd"/><stop offset="0.8" stop-color="#6b7178"/><stop offset="1" stop-color="#3f454b"/></radialGradient>
      <linearGradient id="${uid}-tin" x1="0" x2="1"><stop offset="0" stop-color="#3e4246"/><stop offset="0.3" stop-color="#8b9095"/><stop offset="0.55" stop-color="#5b5f63"/><stop offset="1" stop-color="#2f3235"/></linearGradient>
    </defs>`;

    const rimSvg = sh.rim
      ? `<rect x="${sh.rim.x}" y="${sh.rim.y}" width="${sh.rim.w}" height="${sh.rim.h}" rx="3" fill="${g.tint}" opacity="0.38" stroke="${g.edge}" stroke-width="0.9" stroke-opacity="0.7"/>
         <rect x="${sh.rim.x + 2}" y="${sh.rim.y + 1.5}" width="${f(sh.rim.w * 0.3)}" height="1.6" rx="0.8" fill="#fff" opacity="0.45"/>`
      : '';

    const highlight = `<rect x="${cav.x1 + 4}" y="${cav.y1 + 6}" width="3.4" height="${f((cav.y2 - cav.y1) * 0.62)}" rx="1.7" fill="#fff" opacity="0.28"/>
      <rect x="${cav.x1 + 9}" y="${cav.y1 + 10}" width="1.4" height="${f((cav.y2 - cav.y1) * 0.35)}" rx="0.7" fill="#fff" opacity="0.16"/>
      <rect x="${sh.neck.x + 2}" y="${sh.neck.top + 2}" width="2" height="${f(Math.max(8, cav.y1 - sh.neck.top - 4))}" rx="1" fill="#fff" opacity="0.25"/>`;

    const labelSvg = sh.label.mode === 'tag' ? tagLabel(p, sh, r) : wrapLabel(p, sh, r);

    return `<svg class="vial-svg" viewBox="0 0 ${VB.w} ${VB.h}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style="--visc:${visc}" overflow="visible">
      ${defs}
      ${capBefore(v, sh, r)}
      <path d="${sh.d}" fill="${g.tint}" opacity="0.16"/>
      <g clip-path="url(#${uid}-c)">
        ${contents(p, sh, uid, r)}
        <path d="${sh.d}" fill="url(#${uid}-g)"/>
        ${highlight}
        <rect class="sweep" x="-40" y="0" width="34" height="${VB.h}" fill="url(#${uid}-sw)"/>
        <path d="${sh.d}" fill="none" stroke="${g.deep}" stroke-width="4" opacity="0.28"/>
      </g>
      <path d="${sh.d}" fill="none" stroke="${g.edge}" stroke-width="1.1" stroke-opacity="0.65"/>
      ${rimSvg}
      ${details(p, sh, r, uid)}
      ${capAfter(v, sh, r, uid)}
      ${labelSvg}
      ${stand(sh)}
    </svg>`;
  }

  // gradasi kertas tua bersama (dipasang sekali di dokumen)
  function sharedDefs() {
    return `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
      <radialGradient id="paper-age" cx="0.5" cy="0.45" r="0.75">
        <stop offset="0.55" stop-color="#7a5a2a" stop-opacity="0"/>
        <stop offset="1" stop-color="#5a3a14" stop-opacity="0.35"/>
      </radialGradient></defs></svg>`;
  }

  global.Vials = { render, sharedDefs, skullIcon };
})(window);

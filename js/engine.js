/* fx-50FH II 運算引擎(COMP 模式)— 依 fx-50F PLUS 手冊(RCA502903)
   內部 15 位精度、手冊附錄優先次序表、逐函數輸入範圍、分數/度分秒型態 */
const Engine = (() => {

  const PI = 3.1415926535898;        // 手冊:3.14159265358980
  const E_CONST = 2.71828182845904;  // 手冊:2.71828182845904

  class CalcError extends Error {
    constructor(name, pos) { super(name); this.errName = name; this.pos = pos; }
  }
  const MATH = p => new CalcError('Math ERROR', p);
  const SYN  = p => new CalcError('Syntax ERROR', p);
  const STK  = p => new CalcError('Stack ERROR', p);

  /* ---------- 數值核心 ---------- */
  function r15(x) {
    if (!isFinite(x)) throw MATH();
    if (x === 0) return 0;
    const a = Math.abs(x);
    if (a >= 1e100) throw MATH();
    if (a < 1e-99) return 0;
    return parseFloat(x.toPrecision(15));
  }
  const isFrac = v => typeof v === 'object' && v !== null && v.d !== undefined;
  const isDms  = v => typeof v === 'object' && v !== null && v.dms === true;
  const isCplx = v => typeof v === 'object' && v !== null && v.im !== undefined;
  function mkCplx(re, im) {
    re = re === 0 ? 0 : r15(re); im = im === 0 ? 0 : r15(im);
    if (im === 0) return re;
    return { re, im };
  }
  const cRe = v => isCplx(v) ? v.re : toNum(v);
  const cIm = v => isCplx(v) ? v.im : 0;
  function gcd(a, b) { if (a < 0n) a = -a; while (b) { [a, b] = [b, a % b]; } return a < 1n ? 1n : a; }
  function mkFrac(n, d) {
    if (d === 0n) throw MATH();
    if (d < 0n) { n = -n; d = -d; }
    const g = gcd(n, d); n /= g; d /= g;
    if (d === 1n) return r15(Number(n));
    return { n, d };
  }
  const mkDms = v => ({ dms: true, v });
  function fracToNum(v) { return r15(Number(v.n) / Number(v.d)); }
  function toNum(v) {
    if (isCplx(v)) { if (v.im !== 0) throw MATH(); return v.re; }
    if (isFrac(v)) return fracToNum(v);
    if (isDms(v)) return v.v;
    return v;
  }
  function asFrac(v) {
    if (isFrac(v)) return v;
    if (typeof v === 'number' && Number.isInteger(v) && Math.abs(v) < 1e15) return { n: BigInt(v), d: 1n };
    return null;
  }
  // 帶分數顯示元素總數(整數+分子+分母+分隔符)
  function fracElems(v, improper) {
    let n = v.n < 0n ? -v.n : v.n, d = v.d;
    if (!improper && n >= d) {
      const w = n / d, r = n % d;
      return String(w).length + String(r).length + String(d).length + 2;
    }
    return String(n).length + String(d).length + 1;
  }
  function chkFrac(v) {
    if (!isFrac(v)) return v;
    if (fracElems(v, false) > 10 && fracElems(v, true) > 10) return fracToNum(v);
    return v;
  }
  // 小數 → 分數(結果 ab/c 切換):連分數有理逼近
  // 循環小數都轉到(3⁻¹=0.333333333333333 → 1⌟3),
  // 條件:分數化返 15 位內部值要完全一致,且顯示元素 ≤10
  function decimalToFrac(x) {
    if (typeof x !== 'number' || !isFinite(x) || x === 0) return null;
    const neg = x < 0, a = Math.abs(x);
    const target = a.toPrecision(15);
    let p0 = 0, q0 = 1, p1 = 1, q1 = 0, val = a;
    for (let i = 0; i < 40; i++) {
      const ai = Math.floor(val);
      const p2 = ai * p1 + p0, q2 = ai * q1 + q0;
      if (q2 > 1e10 || p2 > 1e10) break;
      p0 = p1; q0 = q1; p1 = p2; q1 = q2;
      if (q2 > 0 && (p2 / q2).toPrecision(15) === target) {
        if (q2 === 1) return null;   // 整數,冇得轉
        const f = mkFrac(BigInt(neg ? -p2 : p2), BigInt(q2));
        if (!isFrac(f)) return null;
        if (fracElems(f, false) > 10 && fracElems(f, true) > 10) return null;
        return f;
      }
      const rem = val - ai;
      if (rem < 1e-15) break;
      val = 1 / rem;
    }
    return null;
  }

  function add(a, b) {
    if (isCplx(a) || isCplx(b)) return mkCplx(cRe(a) + cRe(b), cIm(a) + cIm(b));
    if (isDms(a) || isDms(b)) return mkDms(r15(toNum(a) + toNum(b)));
    const fa = asFrac(a), fb = asFrac(b);
    if ((isFrac(a) || isFrac(b)) && fa && fb) return chkFrac(mkFrac(fa.n * fb.d + fb.n * fa.d, fa.d * fb.d));
    return r15(toNum(a) + toNum(b));
  }
  function sub(a, b) {
    if (isCplx(a) || isCplx(b)) return mkCplx(cRe(a) - cRe(b), cIm(a) - cIm(b));
    if (isDms(a) || isDms(b)) return mkDms(r15(toNum(a) - toNum(b)));
    const fa = asFrac(a), fb = asFrac(b);
    if ((isFrac(a) || isFrac(b)) && fa && fb) return chkFrac(mkFrac(fa.n * fb.d - fb.n * fa.d, fa.d * fb.d));
    return r15(toNum(a) - toNum(b));
  }
  function mul(a, b) {
    if (isCplx(a) || isCplx(b)) {
      const ar = cRe(a), ai = cIm(a), br = cRe(b), bi = cIm(b);
      return mkCplx(ar * br - ai * bi, ar * bi + ai * br);
    }
    const da = isDms(a), db = isDms(b);
    if (da !== db) return mkDms(r15(toNum(a) * toNum(b)));   // 度分秒 × 小數 → 度分秒
    if (da && db) return r15(toNum(a) * toNum(b));
    const fa = asFrac(a), fb = asFrac(b);
    if ((isFrac(a) || isFrac(b)) && fa && fb) return chkFrac(mkFrac(fa.n * fb.n, fa.d * fb.d));
    return r15(toNum(a) * toNum(b));
  }
  function div(a, b) {
    if (isCplx(a) || isCplx(b)) {
      const ar = cRe(a), ai = cIm(a), br = cRe(b), bi = cIm(b);
      const d = br * br + bi * bi;
      if (d === 0) throw MATH();
      return mkCplx((ar * br + ai * bi) / d, (ai * br - ar * bi) / d);
    }
    const da = isDms(a), db = isDms(b);
    if (da !== db) {
      const nb = toNum(b); if (nb === 0) throw MATH();
      return mkDms(r15(toNum(a) / nb));
    }
    const fa = asFrac(a), fb = asFrac(b);
    if (!da && (isFrac(a) || isFrac(b)) && fa && fb) {
      if (fb.n === 0n) throw MATH();
      return chkFrac(mkFrac(fa.n * fb.d, fa.d * fb.n));
    }
    const nb = toNum(b);
    if (nb === 0) throw MATH();
    return r15(toNum(a) / nb);
  }
  function negv(a) {
    if (isCplx(a)) return mkCplx(-a.re, -a.im);
    if (isFrac(a)) return { n: -a.n, d: a.d };
    if (isDms(a)) return mkDms(-a.v);
    return a === 0 ? 0 : r15(-a);
  }

  // 連分數求有理逼近(負底數指數用)
  function ratApprox(y) {
    if (Number.isInteger(y)) return { p: y, q: 1 };
    let x = Math.abs(y), p0 = 0, q0 = 1, p1 = 1, q1 = 0;
    for (let i = 0; i < 40; i++) {
      const a = Math.floor(x);
      const p2 = a * p1 + p0, q2 = a * q1 + q0;
      if (q2 > 1e6) return null;
      p0 = p1; q0 = q1; p1 = p2; q1 = q2;
      if (Math.abs(Math.abs(y) - p1 / q1) < 1e-13 * Math.max(1, Math.abs(y))) {
        return { p: y < 0 ? -p1 : p1, q: q1 };
      }
      const f = x - a;
      if (f < 1e-13) break;
      x = 1 / f;
    }
    return null;
  }
  function powv(x, y) {
    x = toNum(x); y = toNum(y);
    if (x === 0) { if (y > 0) return 0; throw MATH(); }
    if (x < 0) {
      const fr = ratApprox(y);
      if (!fr || fr.q % 2 === 0) throw MATH();
      const lg = y * Math.log10(-x);
      if (lg >= 100) throw MATH();
      const mag = Math.pow(-x, y);
      return r15(fr.p % 2 === 0 ? mag : -mag);
    }
    const lg = y * Math.log10(x);
    if (lg >= 100) throw MATH();
    if (lg <= -100) return 0;
    return r15(Math.pow(x, y));
  }
  function xroot(x, y) { // {x}ˣ√({y}) = y^(1/x)
    x = toNum(x); y = toNum(y);
    if (x === 0) throw MATH();
    if (y === 0) { if (x > 0) return 0; throw MATH(); }
    if (y < 0) {
      const fr = ratApprox(x);
      if (!fr || fr.p % 2 === 0) throw MATH();
      const mag = Math.pow(-y, 1 / x);
      return r15(-mag);
    }
    const lg = (1 / x) * Math.log10(y);
    if (lg >= 100) throw MATH();
    if (lg <= -100) return 0;
    return r15(Math.pow(y, 1 / x));
  }

  /* ---------- 角度 ---------- */
  function toRad(v, unit) {
    if (unit === 'R') return v;
    if (unit === 'G') return v * PI / 200;
    return v * PI / 180;
  }
  function fromRad(v, unit) {
    if (unit === 'R') return r15(v);
    if (unit === 'G') return r15(v * 200 / PI);
    return r15(v * 180 / PI);
  }
  function trigRangeCheck(v, u) {
    const a = Math.abs(v);
    if (u === 'D' && a >= 9e9) throw MATH();
    if (u === 'R' && a >= 157079632.7) throw MATH();
    if (u === 'G' && a >= 1e10) throw MATH();
  }
  function reduceAngle(v, u) {
    const full = u === 'D' ? 360 : u === 'G' ? 400 : 2 * PI;
    if (u !== 'R' && Math.abs(v) >= full) return v % full;
    return v;
  }
  function sinU(v, u) {
    trigRangeCheck(v, u);
    if (u === 'D' && v % 180 === 0) return 0;
    if (u === 'G' && v % 200 === 0) return 0;
    return r15(Math.sin(toRad(reduceAngle(v, u), u)));
  }
  function cosU(v, u) {
    trigRangeCheck(v, u);
    if (u === 'D' && Math.abs(v % 180) === 90) return 0;
    if (u === 'G' && Math.abs(v % 200) === 100) return 0;
    return r15(Math.cos(toRad(reduceAngle(v, u), u)));
  }
  function tanU(v, u) {
    trigRangeCheck(v, u);
    if (u === 'D') { if (v % 180 === 0) return 0; if (Math.abs(v % 180) === 90) throw MATH(); }
    if (u === 'G') { if (v % 200 === 0) return 0; if (Math.abs(v % 200) === 100) throw MATH(); }
    return r15(Math.tan(toRad(reduceAngle(v, u), u)));
  }

  function fact(v) {
    const x = toNum(v);
    if (!Number.isInteger(x) || x < 0 || x > 69) throw MATH();
    let r = 1;
    for (let i = 2; i <= x; i++) r = r15(r * i);
    return r;
  }
  function nPr(n, r) {
    n = toNum(n); r = toNum(r);
    if (!Number.isInteger(n) || !Number.isInteger(r) || n < 0 || r < 0 || r > n || n >= 1e10) throw MATH();
    let v = 1;
    for (let i = 0; i < r; i++) v = r15(v * (n - i));
    return v;
  }
  function nCr(n, r) {
    n = toNum(n); r = toNum(r);
    if (!Number.isInteger(n) || !Number.isInteger(r) || n < 0 || r < 0 || r > n || n >= 1e10) throw MATH();
    r = Math.min(r, n - r);
    let v = 1;
    for (let i = 1; i <= r; i++) v = v * (n - r + i) / i;
    if (v >= 1e100) throw MATH();
    return r15(v < 1e15 ? Math.round(v) : v);
  }

  /* ---------- 解析器(手冊 E-71 優先次序) ----------
     1 括號函數  2 後置(x² x³ x⁻¹ x! °'" ° ʳ ᵍ ^( ˣ√( %)  3 分數
     4 前綴負號  6 nPr nCr ∠  7 ×÷同隱式乘法(左至右)  8 +−         */
  function evaluate(tokens, env) {
    let pos = 0, depth = 0;

    const peek = () => tokens[pos];
    const atEnd = () => pos >= tokens.length;
    const next = () => tokens[pos++];

    function enter() { if (++depth > 24) throw STK(pos); }
    function leave() { depth--; }

    function startsFactor(tk) {
      if (!tk) return false;
      return ['pi', 'econst', 'var', 'ans', 'ran', 'lp', 'pfunc', 'i', 'const'].includes(tk.t);
    }

    function parseExpr() {
      enter();
      let l = parseMulDiv();
      while (!atEnd() && peek().t === 'op' && (peek().d === '+' || peek().d === '-')) {
        const op = next().d;
        const r = parseMulDiv();
        l = op === '+' ? add(l, r) : sub(l, r);
      }
      leave();
      return l;
    }
    function attach(e, p) { if (e.errName && (e.pos === undefined || e.pos === null)) e.pos = p; throw e; }
    function parseMulDiv() {
      enter();
      let l = parseNprSeq();
      for (;;) {
        if (!atEnd() && peek().t === 'op' && (peek().d === '×' || peek().d === '÷')) {
          const opPos = pos;
          const op = next().d;
          const r = parseNprSeq();
          try { l = op === '×' ? mul(l, r) : div(l, r); }
          catch (e) { attach(e, opPos + 1); }   // 游標跳到出錯運算元(手冊 E-13)
        } else if (!atEnd() && startsFactor(peek())) {
          l = mul(l, parseNprSeq());   // 隱式乘法同 ×÷ 同級,左至右
        } else break;
      }
      leave();
      return l;
    }
    function parseNprSeq() {
      enter();
      let l = parseNeg();
      while (!atEnd() && (peek().t === 'npr' || peek().t === 'ncr' || peek().t === 'ang')) {
        const op = next().t;
        const r = parseNeg();
        if (op === 'ang') {   // r∠θ 極座標輸入(CMPLX)
          const rr = toNum(l), th = toRad(toNum(r), env.angle);
          l = mkCplx(rr * Math.cos(th), rr * Math.sin(th));
        }
        else l = op === 'npr' ? nPr(l, r) : nCr(l, r);
      }
      leave();
      return l;
    }
    function parseNeg() {
      enter();
      let v;
      if (!atEnd() && (peek().t === 'neg' || (peek().t === 'op' && peek().d === '-'))) {
        next(); v = negv(parseNeg());
      } else {
        v = parseFrac();
      }
      leave();
      return v;
    }
    function parseFrac() {
      enter();
      let a = parsePostfix();
      if (!atEnd() && peek().t === 'frac') {
        next();
        const b = parsePostfix();
        if (!atEnd() && peek().t === 'frac') {
          next();
          const c = parsePostfix();
          a = buildFrac3(a, b, c);
        } else {
          a = buildFrac2(a, b);
        }
      }
      leave();
      return a;
    }
    function buildFrac2(a, b) {
      const fa = asFrac(a), fb = asFrac(b);
      if (fa && fb && fa.d === 1n && fb.d === 1n && !isFrac(a) && !isFrac(b)) return chkFrac(mkFrac(fa.n, fb.n));
      return div(a, b);   // 非整數元素 → 小數結果
    }
    function buildFrac3(a, b, c) {
      const fa = asFrac(a), fb = asFrac(b), fc = asFrac(c);
      if (fa && fb && fc && fa.d === 1n && fb.d === 1n && fc.d === 1n &&
          !isFrac(a) && !isFrac(b) && !isFrac(c)) {
        if (fc.n === 0n) throw MATH();
        const sign = fa.n < 0n ? -1n : 1n;
        const w = fa.n < 0n ? -fa.n : fa.n;
        return chkFrac(mkFrac(sign * (w * fc.n + fb.n), fc.n));
      }
      return add(a, div(b, c));
    }
    function parsePostfix() {
      enter();
      let v = parsePrimary();
      while (!atEnd()) {
        const tk = peek();
        if (tk.t === 'sq') {
          next();
          if (isCplx(v)) v = mul(v, v);
          else if (isFrac(v)) v = chkFrac(mkFrac(v.n * v.n, v.d * v.d));
          else { const n = toNum(v); if (Math.abs(n) >= 1e50) throw MATH(); v = r15(n * n); }
        }
        else if (tk.t === 'cube') {
          next();
          if (isCplx(v)) v = mul(mul(v, v), v);
          else if (isFrac(v)) v = chkFrac(mkFrac(v.n ** 3n, v.d ** 3n));
          else { const n = toNum(v); v = r15(n * n * n); }
        }
        else if (tk.t === 'inv') {
          next();
          if (isCplx(v)) v = div(1, v);
          else if (isFrac(v)) v = chkFrac(mkFrac(v.d, v.n));
          else { const n = toNum(v); if (n === 0) throw MATH(); v = r15(1 / n); }
        }
        else if (tk.t === 'fact') { next(); v = fact(v); }
        else if (tk.t === 'pct') { next(); v = r15(toNum(v) / 100); }
        else if (tk.t === 'powp') { // {m}^({n})
          next();
          const arg = parseExpr();
          if (!atEnd() && peek().t === 'rp') next();
          else if (!atEnd()) throw SYN(pos);
          v = powv(v, arg);
        }
        else if (tk.t === 'xrootp') { // {m}ˣ√({n})
          next();
          const arg = parseExpr();
          if (!atEnd() && peek().t === 'rp') next();
          else if (!atEnd()) throw SYN(pos);
          v = xroot(v, arg);
        }
        else if (tk.t === 'aunit') { // ° ʳ ᵍ 角度單位覆寫
          next();
          v = fromRad(toRad(toNum(v), tk.name), env.angle);
        }
        else break;
      }
      leave();
      return v;
    }
    function parseNumber() {
      let s = '';
      while (!atEnd() && (peek().t === 'd' || peek().t === '.')) s += next().d;
      if (s === '' || s === '.') throw SYN(pos);
      if ((s.match(/\./g) || []).length > 1) throw SYN(pos);
      let v = parseFloat(s);
      if (!atEnd() && peek().t === 'exp') {
        next();
        let esign = 1, es = '';
        while (!atEnd() && (peek().t === 'neg' || (peek().t === 'op' && peek().d === '-'))) { next(); esign = -esign; }
        while (!atEnd() && peek().t === 'd') es += next().d;
        if (es === '' || es.length > 2) throw SYN(pos);
        v = r15(v * Math.pow(10, esign * parseInt(es, 10)));
      }
      // 度分秒:{deg}°{min}°[{sec}°]
      if (!atEnd() && peek().t === 'dms') {
        next();
        const deg = v;
        let min = 0, sec = 0;
        if (deg >= 1e100) throw MATH();
        if (!atEnd() && (peek().t === 'd' || peek().t === '.')) {
          let ms = '';
          const save = pos;
          while (!atEnd() && (peek().t === 'd' || peek().t === '.')) ms += next().d;
          if (!atEnd() && peek().t === 'dms') {
            next();
            min = parseFloat(ms);
            if (!atEnd() && (peek().t === 'd' || peek().t === '.')) {
              let ss = '';
              const save2 = pos;
              while (!atEnd() && (peek().t === 'd' || peek().t === '.')) ss += next().d;
              if (!atEnd() && peek().t === 'dms') { next(); sec = parseFloat(ss); }
              else { pos = save2; }
            }
          } else { pos = save; }
        }
        if (min < 0 || sec < 0 || min >= 1e100 || sec >= 1e100) throw MATH();
        return mkDms(r15(deg + min / 60 + sec / 3600));
      }
      return r15(v);
    }
    function parsePrimary() {
      enter();
      if (atEnd()) throw SYN(pos);
      const tk = peek();
      let v;
      if (tk.t === 'd' || tk.t === '.') v = parseNumber();
      else if (tk.t === 'i') { next(); v = { re: 0, im: 1 }; }
      else if (tk.t === 'pi') { next(); v = PI; }
      else if (tk.t === 'econst') { next(); v = E_CONST; }
      else if (tk.t === 'ans') { next(); v = env.ans; }
      else if (tk.t === 'var') { next(); v = env.mem[tk.name] !== undefined ? env.mem[tk.name] : 0; }
      else if (tk.t === 'ran') { next(); v = Math.floor(Math.random() * 1000) / 1000; }
      else if (tk.t === 'const') { next(); v = tk.value; }
      else if (tk.t === 'lp') {
        next();
        v = parseExpr();
        if (!atEnd() && peek().t === 'rp') next();
        else if (!atEnd()) throw SYN(pos);
      }
      else if (tk.t === 'pfunc') {
        const fPos = pos;
        next();
        const name = tk.name;
        const args = [parseExpr()];
        while (!atEnd() && peek().t === 'comma') { next(); args.push(parseExpr()); }
        if (!atEnd() && peek().t === 'rp') next();
        else if (!atEnd()) throw SYN(pos);
        try { v = applyPfunc(name, args); }
        catch (e) { if (e.errName && (e.pos === undefined || e.pos === null)) e.pos = fPos; throw e; }
      }
      else throw SYN(pos);
      leave();
      return v;
    }
    function applyPfunc(name, args) {
      const u = env.angle;
      const one = () => { if (args.length !== 1) throw SYN(pos); return toNum(args[0]); };
      const oneRaw = () => { if (args.length !== 1) throw SYN(pos); return args[0]; };
      const a = { get 0() { return toNum(args[0]); }, get 1() { return toNum(args[1]); }, length: args.length };
      switch (name) {
        case 'sin': return sinU(one(), u);
        case 'cos': return cosU(one(), u);
        case 'tan': return tanU(one(), u);
        case 'asin': { const n = one(); if (n < -1 || n > 1) throw MATH(); return fromRad(Math.asin(n), u); }
        case 'acos': { const n = one(); if (n < -1 || n > 1) throw MATH(); return fromRad(Math.acos(n), u); }
        case 'atan': return fromRad(Math.atan(one()), u);
        case 'sinh': { const n = one(); if (Math.abs(n) > 230.2585092) throw MATH(); return r15(Math.sinh(n)); }
        case 'cosh': { const n = one(); if (Math.abs(n) > 230.2585092) throw MATH(); return r15(Math.cosh(n)); }
        case 'tanh': return r15(Math.tanh(one()));
        case 'asinh': return r15(Math.asinh(one()));
        case 'acosh': { const n = one(); if (n < 1) throw MATH(); return r15(Math.acosh(n)); }
        case 'atanh': { const n = one(); if (Math.abs(n) >= 1) throw MATH(); return r15(Math.atanh(n)); }
        case 'log': {
          if (a.length === 1) { if (a[0] <= 0) throw MATH(); return r15(Math.log10(a[0])); }
          if (a.length === 2) { // log(m,n) 底 m
            if (a[0] <= 0 || a[0] === 1 || a[1] <= 0) throw MATH();
            return r15(Math.log(a[1]) / Math.log(a[0]));
          }
          throw SYN(pos);
        }
        case 'ln': { const n = one(); if (n <= 0) throw MATH(); return r15(Math.log(n)); }
        case 'exp10': { const n = one(); if (n >= 100) throw MATH(); return n <= -100 ? 0 : r15(Math.pow(10, n)); }
        case 'expe': { const n = one(); if (n >= 230.2585093) throw MATH(); return n <= -230.2585093 ? 0 : r15(Math.exp(n)); }
        case 'sqrt': { const n = one(); if (n < 0) throw MATH(); return r15(Math.sqrt(n)); }
        case 'cbrt': return r15(Math.cbrt(one()));
        case 'Abs': {
          const z = oneRaw();
          if (isCplx(z)) return r15(Math.hypot(z.re, z.im));
          return r15(Math.abs(toNum(z)));
        }
        case 'arg': {
          const z = oneRaw();
          return fromRad(Math.atan2(cIm(z), cRe(z)), u);
        }
        case 'Conjg': {
          const z = oneRaw();
          if (isCplx(z)) return mkCplx(z.re, -z.im);
          return toNum(z);
        }
        case 'Rnd': return roundDisp(one(), env.setup);
        case 'Pol': {
          if (a.length !== 2) throw SYN(pos);
          if (a[0] === 0 && a[1] === 0) throw MATH();
          const r = r15(Math.hypot(a[0], a[1]));
          const th = fromRad(Math.atan2(a[1], a[0]), u);
          env.mem.X = r; env.mem.Y = th;
          return r;
        }
        case 'Rec': {
          if (a.length !== 2) throw SYN(pos);
          if (a[0] < 0) throw MATH();
          trigRangeCheck(a[1], u);
          const x = r15(a[0] * Math.cos(toRad(a[1], u)));
          const y = r15(a[0] * Math.sin(toRad(a[1], u)));
          env.mem.X = x; env.mem.Y = y;
          return x;
        }
        default: throw SYN(pos);
      }
    }

    let result = parseExpr();
    // 結尾顯示格式覆寫:▸a+bi / ▸r∠θ(CMPLX)
    if (!atEnd() && peek().t === 'dispov') {
      const tk = next();
      env.dispOverride = tk.name;   // 'rect' | 'polar'
    }
    if (!atEnd()) throw SYN(pos);
    return result;
  }

  /* ---------- 顯示格式化 ---------- */
  function roundDisp(x, setup) {
    if (setup.mode === 'fix') return r15(parseFloat(x.toFixed(setup.digits)));
    if (setup.mode === 'sci') return r15(parseFloat(x.toPrecision(Math.max(1, setup.digits))));
    return r15(parseFloat(x.toPrecision(10)));
  }

  function dmsText(v) {
    const neg = v < 0;
    let a = Math.abs(v);
    // 秒捨入到 0.01 再進位
    let d = Math.floor(a);
    let rm = (a - d) * 60;
    let m = Math.floor(rm);
    let s = Math.round((rm - m) * 60 * 100) / 100;
    if (s >= 60) { s -= 60; m += 1; }
    if (m >= 60) { m -= 60; d += 1; }
    let st = Number.isInteger(s) ? s + '.' : String(s);   // 秒係整數就加尾隨小數點(教學片:2°30°0.)
    return (neg ? '-' : '') + d + '°' + m + '°' + st;
  }

  // 回傳 {text, expo}
  function format(v, setup, opts) {
    opts = opts || {};
    if (isDms(v)) {
      if (Math.abs(v.v) <= 9999999.999722222 + 1e-6) return { text: dmsText(v.v), expo: '' };
      v = v.v; // 超出範圍 → 小數
    }
    if (isFrac(v)) {
      let n = v.n, d = v.d;
      const neg = n < 0n; if (neg) n = -n;
      const improper = !!opts.improper;
      let text;
      if (improper || n < d) text = (neg ? '-' : '') + String(n) + '⌋' + String(d);
      else {
        const w = n / d, r = n % d;
        text = (neg ? '-' : '') + String(w) + '⌋' + String(r) + '⌋' + String(d);
      }
      return { text, expo: '' };
    }
    let x = v;
    if (x === 0) {
      if (setup.mode === 'fix') return { text: (0).toFixed(setup.digits), expo: '' };
      if (setup.mode === 'sci') return { text: fixMantissa((0).toPrecision(setup.digits === 0 ? 10 : setup.digits)), expo: '00' };
      return { text: '0.', expo: '' };
    }
    const ax = Math.abs(x);

    if (setup.mode === 'fix') {
      if (ax < 1e10) {
        let t = x.toFixed(setup.digits);
        if (t.replace(/[-.]/g, '').length <= 12) return { text: t, expo: '' };
      }
      return sciForm(x, 10);
    }
    if (setup.mode === 'sci') return sciForm(x, setup.digits === 0 ? 10 : setup.digits, true);

    const lo = setup.norm === 2 ? 1e-9 : 1e-2;
    if (ax >= 1e10 || ax < lo) return sciForm(x, 10);
    let y = parseFloat(x.toPrecision(10));
    if (Math.abs(y) >= 1e10) return sciForm(x, 10);
    return { text: decText(y), expo: '' };
  }
  function decText(y) {
    let s = y.toString();
    if (s.includes('e') || s.includes('E')) {
      s = y.toFixed(20).replace(/0+$/, '').replace(/\.$/, '');
    }
    if (!s.includes('.')) s += '.';   // 真機:整數尾隨小數點
    return s;
  }
  function sciForm(x, sig, pad) {
    let e = Math.floor(Math.log10(Math.abs(x)));
    let m = x / Math.pow(10, e);
    m = parseFloat(m.toPrecision(sig));
    if (Math.abs(m) >= 10) { m /= 10; e += 1; m = parseFloat(m.toPrecision(sig)); }
    // Sci 模式補足有效位數尾隨零(真機:2.000000000×10⁰⁰);Norm 唔補(5.×10⁻³)
    const mt = pad ? m.toPrecision(sig) : m.toString();
    // 指數兩位零墊(教學片:×10⁻⁰⁶)
    const et = (e < 0 ? '-' : '') + String(Math.abs(e)).padStart(2, '0');
    return { text: fixMantissa(mt), expo: et };
  }
  function fixMantissa(s) {
    if (!s.includes('.')) s += '.';
    return s;
  }

  /* ---------- BASE 模式(手冊 E-52~55) ----------
     內部 32-bit;顯示範圍:BIN 10-bit、OCT 30-bit、DEC/HEX 32-bit */
  const BASE_BITS = { 2: 10, 8: 30, 10: 32, 16: 32 };
  function baseRangeChk(v, base) {
    const bits = BASE_BITS[base];
    const lo = -Math.pow(2, bits - 1), hi = Math.pow(2, bits - 1) - 1;
    if (v < lo || v > hi) throw MATH();
    return v;
  }
  function formatBase(v, base) {
    baseRangeChk(v, base);
    if (base === 10) return String(v);
    const bits = BASE_BITS[base];
    const pat = v < 0 ? v + Math.pow(2, bits) : v;
    return pat.toString(base).toUpperCase();
  }
  function evaluateBase(tokens, env) {
    let pos = 0;
    const peek = () => tokens[pos];
    const next = () => tokens[pos++];
    const atEnd = () => pos >= tokens.length;
    const chk32 = v => { if (v < -2147483648 || v > 2147483647 || !isFinite(v)) throw MATH(); return v; };
    const to32 = v => v | 0;

    function parseOr() {
      let l = parseAnd();
      while (!atEnd() && ['or', 'xor', 'xnor'].includes(peek().t)) {
        const op = next().t;
        const r = parseAnd();
        if (op === 'or') l = to32(l) | to32(r);
        else if (op === 'xor') l = to32(l) ^ to32(r);
        else l = ~(to32(l) ^ to32(r));
      }
      return l;
    }
    function parseAnd() {
      let l = parseAddSub();
      while (!atEnd() && peek().t === 'and') { next(); l = to32(l) & to32(parseAddSub()); }
      return l;
    }
    function parseAddSub() {
      let l = parseMulDiv();
      while (!atEnd() && peek().t === 'op' && (peek().d === '+' || peek().d === '-')) {
        const op = next().d;
        const r = parseMulDiv();
        l = chk32(op === '+' ? l + r : l - r);
      }
      return l;
    }
    function parseMulDiv() {
      let l = parseNegB();
      while (!atEnd() && peek().t === 'op' && (peek().d === '×' || peek().d === '÷')) {
        const op = next().d;
        const r = parseNegB();
        if (op === '×') l = chk32(l * r);
        else { if (r === 0) throw MATH(); l = Math.trunc(l / r); }   // 小數部分捨去
      }
      return l;
    }
    function parseNegB() {
      if (!atEnd() && (peek().t === 'neg' || (peek().t === 'op' && peek().d === '-'))) {
        next(); return chk32(-parseNegB());
      }
      return parsePrimaryB();
    }
    function parseNumberB(base) {
      let s = '';
      while (!atEnd() && peek().t === 'd') s += next().d;
      if (s === '') throw SYN(pos);
      for (const ch of s) { if (parseInt(ch, 16) >= base || isNaN(parseInt(ch, 16))) throw SYN(pos); }
      const v = parseInt(s, base);
      // 輸入值當成該底嘅位元圖案解釋(如 BIN 1111110101 = −11)
      const bits = BASE_BITS[base];
      const wrap = v >= Math.pow(2, bits - 1) && v < Math.pow(2, bits) ? v - Math.pow(2, bits) : v;
      return chk32(wrap);
    }
    function parsePrimaryB() {
      if (atEnd()) throw SYN(pos);
      const tk = peek();
      if (tk.t === 'bpre') { next(); return parseNumberB({ d: 10, h: 16, b: 2, o: 8 }[tk.name]); }
      if (tk.t === 'd') return parseNumberB(env.base);
      if (tk.t === 'ans') { next(); return chk32(Math.trunc(toNum(env.ans))); }
      if (tk.t === 'var') { next(); return chk32(Math.trunc(toNum(env.mem[tk.name] || 0))); }
      if (tk.t === 'lp') {
        next();
        const v = parseOr();
        if (!atEnd() && peek().t === 'rp') next();
        else if (!atEnd()) throw SYN(pos);
        return v;
      }
      if (tk.t === 'pfunc' && (tk.name === 'Not' || tk.name === 'Neg')) {
        next();
        const v = parseOr();
        if (!atEnd() && peek().t === 'rp') next();
        else if (!atEnd()) throw SYN(pos);
        return tk.name === 'Not' ? ~to32(v) : chk32(-v);
      }
      throw SYN(pos);
    }

    const result = parseOr();
    if (!atEnd()) throw SYN(pos);
    return baseRangeChk(result, env.base);
  }

  return {
    evaluate, format, r15, isFrac, isDms, isCplx, mkCplx, cRe, cIm,
    toNum, mkDms, decimalToFrac, fracElems,
    evaluateBase, formatBase, fromRad, decText,
    CalcError, PI, E: E_CONST,
  };
})();

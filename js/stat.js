/* SD / REG 統計模組(手冊 E-38~52)
   數據:{x, y, f};迴歸七款:Lin Log Exp Pwr Inv Quad AB */
const Stat = (() => {
  const ERR = () => new Engine.CalcError('Math ERROR');
  const r15 = Engine.r15;

  let data = [];
  let regType = 'Lin';

  function clear() { data = []; }
  function setType(t) { regType = t; }
  function getType() { return regType; }
  function items() { return data; }
  function nItems() { return data.length; }
  function push(x, y, f) { data.push({ x, y: y || 0, f: f === undefined ? 1 : f }); }
  function del(i) { if (i >= 0 && i < data.length) data.splice(i, 1); }
  function setField(i, field, v) { if (data[i]) data[i][field] = v; }

  function rawSums() {
    let n = 0, sx = 0, sx2 = 0, sx3 = 0, sx4 = 0, sy = 0, sy2 = 0, sxy = 0, sx2y = 0;
    for (const d of data) {
      n += d.f;
      sx += d.f * d.x; sx2 += d.f * d.x * d.x;
      sx3 += d.f * Math.pow(d.x, 3); sx4 += d.f * Math.pow(d.x, 4);
      sy += d.f * d.y; sy2 += d.f * d.y * d.y;
      sxy += d.f * d.x * d.y; sx2y += d.f * d.x * d.x * d.y;
    }
    return { n, sx, sx2, sx3, sx4, sy, sy2, sxy, sx2y };
  }

  // 迴歸用變換(u = f(x), v = g(y))
  function txPoint(d) {
    switch (regType) {
      case 'Lin': return [d.x, d.y];
      case 'Log': if (d.x <= 0) throw ERR(); return [Math.log(d.x), d.y];
      case 'Exp': if (d.y <= 0) throw ERR(); return [d.x, Math.log(d.y)];
      case 'Pwr': if (d.x <= 0 || d.y <= 0) throw ERR(); return [Math.log(d.x), Math.log(d.y)];
      case 'Inv': if (d.x === 0) throw ERR(); return [1 / d.x, d.y];
      case 'AB':  if (d.y <= 0) throw ERR(); return [d.x, Math.log(d.y)];
      default: return [d.x, d.y];
    }
  }
  function txSums() {
    let n = 0, su = 0, su2 = 0, sv = 0, sv2 = 0, suv = 0;
    for (const d of data) {
      const [u, v] = txPoint(d);
      n += d.f; su += d.f * u; su2 += d.f * u * u;
      sv += d.f * v; sv2 += d.f * v * v; suv += d.f * u * v;
    }
    return { n, su, su2, sv, sv2, suv };
  }

  // 非二次迴歸係數(手冊 E-47~50 公式)
  function coeffLinear() {
    const { n, su, su2, sv, sv2, suv } = txSums();
    if (n === 0) throw ERR();
    const den = n * su2 - su * su;
    if (den === 0) throw ERR();
    const slope = (n * suv - su * sv) / den;
    const icept = (sv - slope * su) / n;
    const rden = (n * su2 - su * su) * (n * sv2 - sv * sv);
    const r = rden > 0 ? (n * suv - su * sv) / Math.sqrt(rden) : NaN;
    let a, b;
    switch (regType) {
      case 'Lin': case 'Log': case 'Inv': a = icept; b = slope; break;
      case 'Exp': case 'Pwr': a = Math.exp(icept); b = slope; break;
      case 'AB': a = Math.exp(icept); b = Math.exp(slope); break;
    }
    if (!isFinite(r)) throw ERR();
    return { a: r15(a), b: r15(b), r: r15(r) };
  }
  function coeffQuad() {
    const { n, sx, sx2, sx3, sx4, sy, sxy, sx2y } = rawSums();
    if (n === 0) throw ERR();
    const Sxx = sx2 - sx * sx / n;
    const Sxy = sxy - sx * sy / n;
    const Sxx2 = sx3 - sx * sx2 / n;
    const Sx2x2 = sx4 - sx2 * sx2 / n;
    const Sx2y = sx2y - sx2 * sy / n;
    const den = Sxx * Sx2x2 - Sxx2 * Sxx2;
    if (den === 0) throw ERR();
    const b = (Sxy * Sx2x2 - Sx2y * Sxx2) / den;
    const c = (Sx2y * Sxx - Sxy * Sxx2) / den;
    const a = (sy - b * sx - c * sx2) / n;
    return { a: r15(a), b: r15(b), c: r15(c) };
  }
  function coeff() { return regType === 'Quad' ? coeffQuad() : coeffLinear(); }

  // 統計命令(S-SUM / S-VAR token)
  function statFn(name) {
    const s = rawSums();
    const need = () => { if (s.n === 0) throw ERR(); };
    switch (name) {
      case 'sx2': return r15(s.sx2);
      case 'sx': return r15(s.sx);
      case 'n': return s.n;
      case 'sy2': return r15(s.sy2);
      case 'sy': return r15(s.sy);
      case 'sxy': return r15(s.sxy);
      case 'sx2y': return r15(s.sx2y);
      case 'sx3': return r15(s.sx3);
      case 'sx4': return r15(s.sx4);
      case 'xbar': need(); return r15(s.sx / s.n);
      case 'xsn': need(); return r15(Math.sqrt(Math.max(0, s.sx2 / s.n - Math.pow(s.sx / s.n, 2))));
      case 'xsn1': {
        if (s.n < 2) throw ERR();
        const m = s.sx / s.n;
        return r15(Math.sqrt(Math.max(0, (s.sx2 - s.n * m * m) / (s.n - 1))));
      }
      case 'ybar': need(); return r15(s.sy / s.n);
      case 'ysn': need(); return r15(Math.sqrt(Math.max(0, s.sy2 / s.n - Math.pow(s.sy / s.n, 2))));
      case 'ysn1': {
        if (s.n < 2) throw ERR();
        const m = s.sy / s.n;
        return r15(Math.sqrt(Math.max(0, (s.sy2 - s.n * m * m) / (s.n - 1))));
      }
      case 'ra': return coeff().a;
      case 'rb': return coeff().b;
      case 'rc': { if (regType !== 'Quad') throw ERR(); return coeff().c; }
      case 'rr': { if (regType === 'Quad') throw ERR(); return coeff().r; }
      case 'minX': { if (!data.length) throw ERR(); return r15(Math.min(...data.map(d => d.x))); }
      case 'maxX': { if (!data.length) throw ERR(); return r15(Math.max(...data.map(d => d.x))); }
      case 'minY': { if (!data.length) throw ERR(); return r15(Math.min(...data.map(d => d.y))); }
      case 'maxY': { if (!data.length) throw ERR(); return r15(Math.max(...data.map(d => d.y))); }
      default: throw ERR();
    }
  }

  // 推算值 x̂ ŷ(前值作 y 或 x)
  function statPost(name, v) {
    const co = coeff();
    if (regType === 'Quad') {
      const { a, b, c } = co;
      if (name === 'yhat') return r15(a + b * v + c * v * v);
      const D = b * b - 4 * c * (a - v);
      if (D < 0 || c === 0) throw ERR();
      if (name === 'xhat1') return r15((-b + Math.sqrt(D)) / (2 * c));
      if (name === 'xhat2') return r15((-b - Math.sqrt(D)) / (2 * c));
      throw ERR();
    }
    const { a, b } = co;
    if (name === 'yhat') {
      switch (regType) {
        case 'Lin': return r15(a + b * v);
        case 'Log': if (v <= 0) throw ERR(); return r15(a + b * Math.log(v));
        case 'Exp': return r15(a * Math.exp(b * v));
        case 'Pwr': if (v <= 0) throw ERR(); return r15(a * Math.pow(v, b));
        case 'Inv': if (v === 0) throw ERR(); return r15(a + b / v);
        case 'AB': return r15(a * Math.pow(b, v));
      }
    }
    if (name === 'xhat' || name === 'xhat1' || name === 'xhat2') {
      switch (regType) {
        case 'Lin': if (b === 0) throw ERR(); return r15((v - a) / b);
        case 'Log': if (b === 0) throw ERR(); return r15(Math.exp((v - a) / b));
        case 'Exp': if (b === 0 || v / a <= 0) throw ERR(); return r15(Math.log(v / a) / b);
        case 'Pwr': if (b === 0 || v / a <= 0) throw ERR(); return r15(Math.pow(v / a, 1 / b));
        case 'Inv': if (v === a) throw ERR(); return r15(b / (v - a));
        case 'AB': if (v / a <= 0 || b <= 0 || b === 1) throw ERR(); return r15(Math.log(v / a) / Math.log(b));
      }
    }
    throw ERR();
  }

  return { clear, setType, getType, items, nItems, push, del, setField, statFn, statPost };
})();

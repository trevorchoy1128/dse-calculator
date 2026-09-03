/* 鍵盤佈局 + 狀態機(app 控制器)— 依 fx-50F PLUS 手冊行為 */

/* ---- 佈局(% 座標,相對 #keys 容器;依官方產品圖量度) ---- */
const KEY_DEFS = [
  ['shift', 5.8,  8.4, 13.7, 5.4, 'k-grey k-pill', '', '<span class="c-shift">SHIFT</span>'],
  ['alpha', 21.4, 8.4, 13.7, 5.4, 'k-grey k-pill', '', '<span class="c-alpha">ALPHA</span>'],
  ['mode',  68.1, 8.4, 13.7, 5.4, 'k-grey k-pill', '', '<span class="c-plain">MODE</span><span class="c-shift">SETUP</span>'],
  ['on',    83.7, 8.4, 13.7, 5.4, 'k-grey k-pill', '', '<span class="c-plain">ON</span>'],

  ['prog', 5.8,  21, 13.7, 5.4, 'k-orange k-pill', 'Prog', '<span class="c-shift">EXIT</span>'],
  ['fmla', 21.4, 21, 13.7, 5.4, 'k-orange k-pill', 'FMLA', ''],
  ['inv',  68.1, 21, 13.7, 5.4, 'k-grey k-pill k-it', '<i>x</i><sup>-1</sup>', '<span class="c-shift"><i>x</i>!</span><span class="c-green">LOGIC</span>'],
  ['cube', 83.7, 21, 13.7, 5.4, 'k-grey k-pill k-it', '<i>x</i><sup>3</sup>', '<span class="c-shift">³√</span>'],

  ['abc',  5.8,  29.9, 13.7, 5.1, 'k-dark', 'a<span class="sm">b/c</span>', '<span class="c-shift">d/c</span>'],
  ['sqrt', 21.4, 29.9, 13.7, 5.1, 'k-dark', '√', ''],
  ['sq',   36.9, 29.9, 13.7, 5.1, 'k-dark', '<i>x</i><sup>2</sup>', '<span class="c-green">DEC</span>'],
  ['pow',  52.5, 29.9, 13.7, 5.1, 'k-dark', '^', '<span class="c-shift">ˣ√</span><span class="c-green">HEX</span>'],
  ['log',  68.1, 29.9, 13.7, 5.1, 'k-dark', 'log', '<span class="c-shift">10<sup>x</sup></span><span class="c-green">BIN</span>'],
  ['ln',   83.7, 29.9, 13.7, 5.1, 'k-dark', 'ln', '<span class="c-shift">e<sup>x</sup></span><span class="c-alpha"><i>e</i></span><span class="c-green">OCT</span>'],

  ['neg',  5.8,  38.8, 13.7, 5.1, 'k-dark', '(−)', '<span class="c-shift">∠</span><span class="c-alpha">A</span>'],
  ['dms',  21.4, 38.8, 13.7, 5.1, 'k-dark', '°’”', '<span class="c-alpha">B</span>'],
  ['hyp',  36.9, 38.8, 13.7, 5.1, 'k-dark', 'hyp', '<span class="c-alpha">C</span>'],
  ['sin',  52.5, 38.8, 13.7, 5.1, 'k-dark', 'sin', '<span class="c-shift">sin<sup>-1</sup></span><span class="c-alpha">D</span>'],
  ['cos',  68.1, 38.8, 13.7, 5.1, 'k-dark', 'cos', '<span class="c-shift">cos<sup>-1</sup></span><span class="c-green">E</span>'],
  ['tan',  83.7, 38.8, 13.7, 5.1, 'k-dark', 'tan', '<span class="c-shift">tan<sup>-1</sup></span><span class="c-green">F</span>'],

  ['rcl',  5.8,  47.7, 13.7, 5.1, 'k-dark', 'RCL', '<span class="c-shift">STO</span>'],
  ['eng',  21.4, 47.7, 13.7, 5.1, 'k-dark', 'ENG', '<span class="c-shift">←</span><span class="c-alpha"><i>i</i></span>'],
  ['lp',   36.9, 47.7, 13.7, 5.1, 'k-dark', '(', '<span class="c-shift">%</span>'],
  ['rp',   52.5, 47.7, 13.7, 5.1, 'k-dark', ')', '<span class="c-shift">Abs</span><span class="c-alpha">X</span>'],
  ['comma',68.1, 47.7, 13.7, 5.1, 'k-dark', ',', '<span class="c-shift">;</span><span class="c-alpha">Y</span>'],
  ['mplus',83.7, 47.7, 13.7, 5.1, 'k-dark', 'M+', '<span class="c-shift">M−</span><span class="c-alpha">M</span>'],

  ['d7', 5.8,  56.6, 15.8, 6.4, 'k-dark k-num', '7', '<span class="c-shift">CONST</span>'],
  ['d8', 24.7, 56.6, 15.8, 6.4, 'k-dark k-num', '8', ''],
  ['d9', 43.7, 56.6, 15.8, 6.4, 'k-dark k-num', '9', '<span class="c-shift">CLR</span>'],
  ['del',62.6, 56.6, 15.8, 6.4, 'k-red k-num', 'DEL', '<span class="c-shift">INS</span>'],
  ['ac', 81.6, 56.6, 15.8, 6.4, 'k-red k-num', 'AC', '<span class="c-shift">OFF</span>'],

  ['d4', 5.8,  67, 15.8, 6.4, 'k-dark k-num', '4', ''],
  ['d5', 24.7, 67, 15.8, 6.4, 'k-dark k-num', '5', ''],
  ['d6', 43.7, 67, 15.8, 6.4, 'k-dark k-num', '6', ''],
  ['mul',62.6, 67, 15.8, 6.4, 'k-dark k-num', '×', '<span class="c-shift">nPr</span>'],
  ['div',81.6, 67, 15.8, 6.4, 'k-dark k-num', '÷', '<span class="c-shift">nCr</span>'],

  ['d1', 5.8,  77.3, 15.8, 6.4, 'k-dark k-num', '1', '<span class="c-shift">S-SUM</span>'],
  ['d2', 24.7, 77.3, 15.8, 6.4, 'k-dark k-num', '2', '<span class="c-shift">S-VAR</span>'],
  ['d3', 43.7, 77.3, 15.8, 6.4, 'k-dark k-num', '3', '<span class="c-shift">P-CMD</span>'],
  ['add',62.6, 77.3, 15.8, 6.4, 'k-dark k-num', '+', '<span class="c-shift">Pol(</span>'],
  ['sub',81.6, 77.3, 15.8, 6.4, 'k-dark k-num', '−', '<span class="c-shift">Rec(</span>'],

  ['d0', 5.8,  87.7, 15.8, 6.4, 'k-dark k-num', '0', '<span class="c-shift">Rnd</span>'],
  ['dot',24.7, 87.7, 15.8, 6.4, 'k-dark k-num', '·', '<span class="c-shift">Ran#</span>'],
  ['expk',43.7,87.7, 15.8, 6.4, 'k-dark k-num', 'EXP', '<span class="c-shift">π</span>'],
  ['ans',62.6, 87.7, 15.8, 6.4, 'k-dark k-num', 'Ans', '<span class="c-shift">DRG▸</span>'],
  ['exe',81.6, 87.7, 15.8, 6.4, 'k-dark k-num', 'EXE', '<span class="c-shift">Re⇔Im</span>'],
];

/* ---- App 狀態 ---- */
const App = (() => {
  const S = {
    mode: 'COMP', angle: 'D',
    setup: { mode: 'norm', norm: 1, digits: 0 },   // 預設 Norm1(手冊 E-10)
    fracImproper: false,       // SETUP 分數格式:false=ab/c 帶分數
    cmplxPolar: false, freqOn: true,
    contrast: 20,   // 預設最深色
    shift: false, alpha: false,
    hypPending: 0,             // 0 無 | 1 hyp | 2 hyp⁻¹
    insertOver: false,
    tokens: [], cursor: 0,
    phase: 'off',              // 預設熄機,撳 ON 先開(真機行為)| input | result | error | menu | fmla | off
    result: null, resultSuffix: '',
    dispImproper: false, dispAlt: null,  // dispAlt: null|'dec'|'frac'|'dms'
    altFracCache: null,
    error: null,
    mem: { A:0, B:0, C:0, D:0, X:0, Y:0, M:0 },
    ans: 0,
    history: [], histIdx: null,
    pending: null,             // 'STO' | 'RCL'
    menu: null,
    lastVal: 0,   // 下行保留數值(輸入期間唔消失;跟隨現時顯示格式)
    base: 10,               // BASE 模式當前底
    showIm: false,          // CMPLX:false=實部/r,true=虛部/θ
    resultOverride: null,   // CMPLX 單次顯示覆寫 'rect'|'polar'
    fvars: {},              // FMLA 公式變數
    fmla: null,             // FMLA 狀態 {mode:'no'|'browse'|'var'|'result', ...}
    engExp: null,           // ENG 工程記數指數(null=正常顯示)
  };

  const VAR_KEYS = { neg:'A', dms:'B', hyp:'C', sin:'D', rp:'X', comma:'Y', mplus:'M' };

  // 40 個科學常數(手冊 E-25/26,10 頁 × 4)
  const CONSTS = [
    ['mp', 1.67262171e-27], ['mn', 1.67492728e-27], ['me', 9.1093826e-31], ['mμ', 1.8835314e-28],
    ['a0', 0.5291772108e-10], ['h', 6.6260693e-34], ['μN', 5.05078343e-27], ['μB', 927.400949e-26],
    ['ℏ', 1.05457168e-34], ['α', 7.297352568e-3], ['re', 2.817940325e-15], ['λc', 2.426310238e-12],
    ['γp', 2.67522205e8], ['λcp', 1.3214098555e-15], ['λcn', 1.3195909067e-15], ['R∞', 10973731.568525],
    ['u', 1.66053886e-27], ['μp', 1.41060671e-26], ['μe', -928.476412e-26], ['μn', -0.96623645e-26],
    ['μμ', -4.49044799e-26], ['F', 96485.3383], ['e', 1.60217653e-19], ['NA', 6.0221415e23],
    ['k', 1.3806505e-23], ['Vm', 22.413996e-3], ['R', 8.314472], ['C0', 299792458],
    ['C1', 3.74177138e-16], ['C2', 1.4387752e-2], ['σ', 5.670400e-8], ['ε0', 8.854187817e-12],
    ['μ0', 12.566370614e-7], ['φ0', 2.06783372e-15], ['g', 9.80665], ['G0', 7.748091733e-5],
    ['Z0', 376.730313461], ['t', 273.15], ['G', 6.6742e-11], ['atm', 101325],
  ];
  const APO_MS = 10 * 60 * 1000;   // 10 分鐘自動熄機
  let apoTimer = null;
  function resetApo() {
    if (apoTimer) clearTimeout(apoTimer);
    apoTimer = setTimeout(() => { S.phase = 'off'; render(); }, APO_MS);
  }

  /* ---- token 工廠 ---- */
  const T = {
    d: c => ({ t:'d', d:c }),
    dot: () => ({ t:'.', d:'.' }),
    exp: () => ({ t:'exp', d:'ᴇ' }),
    op: c => ({ t:'op', d:c }),
    neg: () => ({ t:'neg', d:'-' }),
    powp: () => ({ t:'powp', d:'^(' }),
    xrootp: () => ({ t:'xrootp', d:'ˣ√(' }),
    frac: () => ({ t:'frac', d:'⌋' }),
    dms: () => ({ t:'dms', d:'°' }),
    sq: () => ({ t:'sq', d:'²' }),
    cube: () => ({ t:'cube', d:'³' }),
    inv: () => ({ t:'inv', d:'⁻¹' }),
    fact: () => ({ t:'fact', d:'!' }),
    pct: () => ({ t:'pct', d:'%' }),
    aunit: (n, disp) => ({ t:'aunit', name:n, d:disp }),
    pfunc: (name, disp) => ({ t:'pfunc', name, d:disp }),
    lp: () => ({ t:'lp', d:'(' }),
    rp: () => ({ t:'rp', d:')' }),
    comma: () => ({ t:'comma', d:',' }),
    pi: () => ({ t:'pi', d:'π' }),
    econst: () => ({ t:'econst', d:'e' }),
    ran: () => ({ t:'ran', d:'Ran#' }),
    ans: () => ({ t:'ans', d:'Ans' }),
    variable: n => ({ t:'var', name:n, d:n }),
    npr: () => ({ t:'npr', d:'P' }),
    ncr: () => ({ t:'ncr', d:'C' }),
    imag: () => ({ t:'i', d:'i' }),
    ang: () => ({ t:'ang', d:'∠' }),
    cmd: (name, disp) => ({ t:'cmd', name, d: disp !== undefined ? disp : name }),
    sto: () => ({ t:'sto', d:'→' }),
    relop: name => ({ t:'relop', name, d:name }),
    semi: () => ({ t:'semi', d:';' }),
    stat: (name, disp) => ({ t:'stat', name, d:disp }),
    stpost: (name, disp) => ({ t:'stpost', name, d:disp }),
    dispov: (n, disp) => ({ t:'dispov', name:n, d:disp }),
    logicop: n => ({ t:n, d:n }),                 // and / or / xor / xnor
    bpre: n => ({ t:'bpre', name:n, d:n }),       // d h b o 前綴
    hexd: c => ({ t:'d', d:c }),                  // HEX 用 A~F
  };

  /* ---- 顯示 ---- */
  function lineText(tokens) { return tokens.map(t => t.d).join(''); }
  function charPosOf(tokens, tokIdx) {
    let p = 0;
    for (let i = 0; i < tokIdx && i < tokens.length; i++) p += tokens[i].d.length;
    return p;
  }

  function indicators() {
    const cplxRes = S.phase === 'result' && Engine.isCplx(S.result);
    return {
      S: S.shift, A: S.alpha,
      M: (() => { try { return Engine.toNum(S.mem.M) !== 0; } catch (e) { return true; } })(),
      STO: S.pending === 'STO', RCL: S.pending === 'RCL',
      hyp: S.hypPending > 0,
      D: S.angle === 'D', R: S.angle === 'R', G: S.angle === 'G',
      FIX: S.setup.mode === 'fix', SCI: S.setup.mode === 'sci',
      CMPLX: S.mode === 'CMPLX', SD: S.mode === 'SD', REG: S.mode === 'REG',
      RI: cplxRes,
      iInd: cplxRes && S.showIm && !cplxPolarNow(),
      angInd: cplxRes && S.showIm && cplxPolarNow(),
      disp: false,
    };
  }

  function cplxPolarNow() {
    if (S.resultOverride) return S.resultOverride === 'polar';
    return S.cmplxPolar;
  }
  function currentResultDisplay() {
    let v = S.result;
    if (S.mode === 'BASE') {
      return { text: Engine.formatBase(Engine.toNum(v), S.base), expo: '' };
    }
    if (S.engExp !== null && !Engine.isCplx(v)) {   // ENG 工程記數顯示
      const x = Engine.toNum(v);
      const mant = Engine.r15(x / Math.pow(10, S.engExp));
      const et = (S.engExp < 0 ? '-' : '') + String(Math.abs(S.engExp)).padStart(2, '0');
      return { text: Engine.decText(mant), expo: et };
    }
    if (Engine.isCplx(v)) {   // 複數:先顯示實部/r,SHIFT EXE 切換
      let part;
      if (cplxPolarNow()) {
        part = S.showIm ? Engine.fromRad(Math.atan2(v.im, v.re), S.angle)
                        : Engine.r15(Math.hypot(v.re, v.im));
      } else {
        part = S.showIm ? v.im : v.re;
      }
      return Engine.format(part, S.setup, {});
    }
    if (S.dispAlt === 'dec') v = Engine.toNum(v);
    else if (S.dispAlt === 'frac' && S.altFracCache) v = S.altFracCache;
    else if (S.dispAlt === 'dms') v = Engine.mkDms(Engine.toNum(v));
    return Engine.format(v, S.setup, { improper: S.fracImproper !== S.dispImproper });
  }

  function render() {
    resetApo();
    if (S.phase === 'off') { LCD.draw({ topText:'', cursorPos:null, bottomText:'', expo:'', indicators:{} }); return; }

    if (S.phase === 'menu') {
      const m = S.menu;
      const arrows = m.kind === 'mode';   // 教學片:只有 MODE 選單有邊緣 ◄ ►,SETUP 冇
      const opts = {
        topText: m.lines[m.page][0], cursorPos: null,
        expo: '', indicators: indicators(),
        scrollL: arrows, scrollR: arrows,
      };
      if (m.kind === 'clrconf' || m.plain) {
        opts.bottomText = m.lines[m.page][1]; opts.bottomIsText = true;
      } else if (m.kind === 'contrast') {
        opts.bottomText = 'CASIO'; opts.bottomBigCentre = true;
        opts.scrollL = false; opts.scrollR = false;
      } else {
        opts.menuBottomCols = m.lines[m.page][1];
      }
      LCD.draw(opts);
      return;
    }
    if (S.phase === 'error') {
      LCD.draw({ topText: centre(S.error.name), cursorPos: null, bottomText: '', expo:'', indicators: indicators() });
      return;
    }
    if (S.phase === 'fmla') { renderFmla(); return; }
    if (S.phase === 'statv') { renderStatView(); return; }
    if (S.phase === 'pedit') { renderPedit(); return; }
    if (S.phase === 'prun') { renderPrun(); return; }

    const text = lineText(S.tokens) + (S.phase === 'result' ? S.resultSuffix : '');
    let cursorPos = null, start = 0;
    if (S.phase === 'input') {
      const cChar = charPosOf(S.tokens, S.cursor);
      if (cChar > 15) start = cChar - 15;
      cursorPos = cChar - start;
    } else if (text.length > 16) {
      start = text.length - 16;
    }
    const top = text.substring(start, start + 16);

    let bottom = '', expo = '';
    if (S.phase === 'result') {
      const f = currentResultDisplay();
      bottom = f.text; expo = f.expo;
    } else if (S.phase === 'input') {
      // 輸入期間下行保留上次數值(用現時顯示設定格式化,改完 Sci/Fix 即時反映)
      if (S.mode === 'BASE') {
        try { bottom = Engine.formatBase(Math.trunc(Engine.toNum(S.lastVal)), S.base); }
        catch (e) { bottom = '0'; }
      } else {
        const lv = Engine.isCplx(S.lastVal) ? S.lastVal.re : S.lastVal;
        const f = Engine.format(lv, S.setup, { improper: S.fracImproper });
        bottom = f.text; expo = f.expo;
      }
    }
    LCD.draw({
      topText: top, cursorPos, cursorOver: S.insertOver,
      cursorBox: S.tokens.length >= 91,
      scrollL: start > 0, scrollR: text.length > start + 16,
      bottomText: bottom, expo, indicators: indicators(),
      histMark: S.history.length > 0,
      baseLetter: S.mode === 'BASE' ? { 10:'d', 16:'H', 2:'b', 8:'o' }[S.base] : '',
    });
  }
  function centre(s) {
    const pad = Math.max(0, Math.floor((16 - s.length) / 2));
    return ' '.repeat(pad) + s;
  }

  /* ---- 編輯 ---- */
  function beginInputIfNeeded() {
    if (S.phase === 'result' || S.phase === 'error') {
      S.tokens = []; S.cursor = 0; S.phase = 'input';
      S.resultSuffix = ''; S.dispAlt = null; S.dispImproper = false; S.engExp = null;
    }
  }
  function insertTok(tok) {
    beginInputIfNeeded();
    const cap = S.phase === 'pedit'
      ? Math.max(0, Prog.CAPACITY - (Prog.bytesUsed() - S.tokens.length))
      : 99;                                  // 輸入區 99 bytes;程式區共 680 bytes
    if (S.tokens.length >= cap) return;
    if (S.insertOver && S.cursor < S.tokens.length) S.tokens[S.cursor] = tok;
    else S.tokens.splice(S.cursor, 0, tok);
    S.cursor++;
    S.histIdx = null;
  }
  // 喺結果畫面撳運算子/後置函數 → 自動以 Ans 開頭(手冊 E-20)
  function insertOp(tok) {
    if (S.phase === 'result') {
      S.tokens = [T.ans()]; S.cursor = 1; S.phase = 'input';
      S.resultSuffix = ''; S.dispAlt = null; S.dispImproper = false; S.engExp = null;
    }
    insertTok(tok);
  }
  function delTok() {
    if (S.phase !== 'input' && S.phase !== 'pedit' && S.phase !== 'prun') return;
    if (S.insertOver) {
      if (S.cursor < S.tokens.length) S.tokens.splice(S.cursor, 1);
      else if (S.cursor > 0) { S.tokens.splice(S.cursor - 1, 1); S.cursor--; }
    } else if (S.cursor > 0) {
      S.tokens.splice(S.cursor - 1, 1); S.cursor--;
    }
  }

  /* ---- 執行 ---- */
  function doExe() {
    if (S.phase === 'result') return;      // 結果畫面 EXE 無動作
    if (!S.tokens.length) return;
    // 函數單獨輸入 + EXE → 自動補 Ans(手冊 E-20)
    if (S.tokens.length === 1 && S.tokens[0].t === 'pfunc') S.tokens.push(T.ans());
    runEval();
  }
  function runEval(suffix, after) {
    try {
      const env = Object.assign({ angle: S.angle, mem: S.mem, ans: S.ans, setup: S.setup, base: S.base }, statEnvExtras());
      const v = S.mode === 'BASE' ? Engine.evaluateBase(S.tokens, env) : Engine.evaluate(S.tokens, env);
      S.ans = v;
      S.result = v; S.lastVal = v; S.resultSuffix = suffix || '';
      S.dispAlt = null; S.dispImproper = false; S.engExp = null; S.altFracCache = null;
      S.showIm = false;
      S.resultOverride = env.dispOverride || null;
      if (after) after(v);
      S.history.push({ tokens: S.tokens.slice(), value: v, suffix: S.resultSuffix });
      if (S.history.length > 30) S.history.shift();
      S.histIdx = null;
      S.phase = 'result';
      S.cursor = S.tokens.length;
    } catch (e) {
      S.phase = 'error';
      S.error = { name: e.errName || 'Syntax ERROR', pos: Math.min(e.pos || 0, S.tokens.length) };
    }
  }

  /* ---- 選單 ---- */
  function openModeMenu() {
    S.phase = 'menu';
    S.menu = {
      kind: 'mode', page: 0,
      lines: [
        menuLines(['COMP', 'CMPLX', 'BASE']),
        menuLines(['SD', 'REG', 'PRGM'], 4),
      ],
    };
  }
  function openSetupMenu() {
    S.phase = 'menu';
    S.menu = {
      kind: 'setup', page: 0,
      lines: [
        menuLines(['Deg', 'Rad', 'Gra']),
        menuLines(['Fix', 'Sci', 'Norm']),
        menuLines(['ab/c', 'd/c']),
        menuLines(['a+bi', 'r∠θ']),
        menuLines(['FreqOn', 'FreqOff']),
        menuLines(['Contrast']),
      ],
    };
  }
  function openClrMenu() {
    S.phase = 'menu';
    const stat = S.mode === 'SD' || S.mode === 'REG';
    S.menu = {
      kind: 'clr', page: 0, statVariant: stat,
      lines: [stat ? menuLines(['Stat', 'Setup', 'All']) : menuLines(['Mem', 'Setup', 'All'])],
    };
  }
  function openDrgMenu() {
    S.phase = 'menu';
    S.menu = { kind: 'drg', page: 0, lines: [menuLines(['Deg', 'Rad', 'Gra'])], keepInput: true };
  }
  function openConstMenu() {   // CONST 十頁,每頁 4 個(手冊 E-24)
    const lines = [];
    for (let p = 0; p < 10; p++) {
      let top = ' ', bot = ' ';
      for (let i = 0; i < 4; i++) {
        const sym = CONSTS[p * 4 + i][0];
        top += sym.padEnd(4, ' ');
        bot += (i + 1) + '   ';
      }
      lines.push([top, bot]);
    }
    S.phase = 'menu';
    S.menu = { kind: 'constm', page: 0, lines };
  }
  function openLogicMenu() {   // BASE:LOGIC 三頁(手冊 E-54)
    S.phase = 'menu';
    S.menu = {
      kind: 'logic', page: 1,
      lines: [
        menuLines(['d', 'h', 'b', 'o']),
        menuLines(['and', 'or', 'xnor']),
        menuLines(['xor', 'Not', 'Neg']),
      ],
    };
  }
  function exitMenu() {
    S.phase = (S.menu && S.menu.returnPhase) || 'input';
    S.menu = null;
  }
  // 通用選單行:項目喺 16 格內置中平均分佈,數字對齊項目中間下面
  function menuLines(items, startDigit) {
    const W = 16;
    const total = items.reduce((s, it) => s + it.length, 0);
    const k = items.length;
    let gap = k > 1 ? Math.max(1, Math.min(4, Math.floor((W - total - 2) / (k - 1)))) : 0;
    let margin = Math.max(0, Math.floor((W - total - gap * (k - 1)) / 2));
    let top = ' '.repeat(margin), bot = '';
    items.forEach((it, i) => {
      const startCol = top.length;
      top += it + (i < k - 1 ? ' '.repeat(gap) : '');
      const digitCol = startCol + Math.floor((it.length - 1) / 2);
      while (bot.length < digitCol) bot += ' ';
      bot += String((startDigit || 1) + i);
    });
    return [top, bot];
  }

  function menuKey(id, shift) {
    const m = S.menu;
    if (m.kind === 'msg') return;   // Data Clear! 訊息期間唔收鍵
    if (id === 'on') { exitMenu(); S.tokens = []; S.cursor = 0; return; }
    if (id === 'ac') { exitMenu(); return; }
    if (id === 'prog' && shift) { exitMenu(); return; }      // EXIT
    if (id === 'prog' && m.kind === 'parea') { exitMenu(); return; }   // Prog 再撳一次退出(用戶實機核實)
    if (id === 'mode') {
      if (shift) { openSetupMenu(); return; }
      if (m.kind === 'mode') {   // MODE 順序:1 2 3 → 4 5 6 → 退出(用戶實機核實)
        if (m.page < m.lines.length - 1) m.page++;
        else exitMenu();
        return;
      }
      openModeMenu(); return;
    }
    if (id === 'rep_l' || id === 'rep_r') {
      if (m.kind === 'contrast') {   // Contrast 調節畫面:◄► 調深淺
        S.contrast = Math.max(0, Math.min(20, S.contrast + (id === 'rep_r' ? 1 : -1)));
        LCD.setContrast(S.contrast);
        return;
      }
      if (m.lines.length > 1) m.page = (m.page + (id === 'rep_r' ? 1 : m.lines.length - 1)) % m.lines.length;
      return;
    }
    // 模式選單顯示期間 +/- 可調對比(手冊 E-6)
    if (m.kind === 'mode' && (id === 'add' || id === 'sub')) {
      S.contrast = Math.max(0, Math.min(20, S.contrast + (id === 'add' ? 1 : -1)));
      LCD.setContrast(S.contrast);
      return;
    }
    const digit = { d1:1, d2:2, d3:3, d4:4, d5:5, d6:6, d7:7, d8:8, d9:9, d0:0 }[id];
    if (digit === undefined) return;

    if (m.kind === 'mode') {   // 兩頁,數字 1~6 全域有效
      const pick = { 1:'COMP', 2:'CMPLX', 3:'BASE', 4:'SD', 5:'REG', 6:'PRGM' }[digit];
      if (pick) {
        S.mode = pick; exitMenu();
        S.tokens = []; S.cursor = 0; S.history = []; S.histIdx = null; S.phase = 'input';
        S.lastVal = 0; S.base = 10; S.fvars = {}; S.fmla = null;
        S.showIm = false; S.resultOverride = null;
        S.ans = Engine.isCplx(S.ans) ? S.ans.re : S.ans;   // 轉模式清虛部(手冊 E-20)
        Stat.clear();   // 轉模式清統計數據(手冊 E-38)
        if (pick === 'REG') openRegTypeMenu();
        else if (pick === 'PRGM') openPrgmMenu();
      }
      return;
    }
    if (m.kind === 'setup') {
      if (m.page === 0) { const u = { 1:'D', 2:'R', 3:'G' }[digit]; if (u) { S.angle = u; exitMenu(); } }
      else if (m.page === 1) {
        if (digit === 1) S.menu = { kind:'fixdig', page:0, lines:[['Fix 0~9?', '']] };
        else if (digit === 2) S.menu = { kind:'scidig', page:0, lines:[['Sci 0~9?', '']] };
        else if (digit === 3) S.menu = { kind:'normdig', page:0, lines:[['Norm 1~2?', '']] };
      }
      else if (m.page === 2) { if (digit === 1) { S.fracImproper = false; exitMenu(); } else if (digit === 2) { S.fracImproper = true; exitMenu(); } }
      else if (m.page === 3) { if (digit === 1) { S.cmplxPolar = false; exitMenu(); } else if (digit === 2) { S.cmplxPolar = true; exitMenu(); } }
      else if (m.page === 4) {
        if (digit === 1) { S.freqOn = true; Stat.clear(); exitMenu(); }
        else if (digit === 2) { S.freqOn = false; Stat.clear(); exitMenu(); }
      }
      else if (m.page === 5) {   // 撳 1 先入 Contrast 調節畫面(手冊 E-6)
        if (digit === 1) S.menu = { kind: 'contrast', page: 0, lines: [['◂LIGHT     DARK▸', '']] };
      }
      return;
    }
    if (m.kind === 'fixdig') { S.setup = { mode:'fix', digits: digit, norm: S.setup.norm }; exitMenu(); return; }
    if (m.kind === 'scidig') { S.setup = { mode:'sci', digits: digit === 0 ? 10 : digit, norm: S.setup.norm }; exitMenu(); return; }
    if (m.kind === 'normdig') { if (digit === 1 || digit === 2) { S.setup = { mode:'norm', norm: digit, digits: 0 }; exitMenu(); } return; }
    if (m.kind === 'clr') {
      // 揀完顯示指令名(真機款,教學片核實:ClrSetup),EXE 執行,AC 取消
      if (digit === 1) {
        S.menu = m.statVariant
          ? { kind:'clrconf', what:'stat', page:0, lines:[[' ClrStat', '']] }
          : { kind:'clrconf', what:'mem', page:0, lines:[[' ClrMemory', '']] };
      }
      else if (digit === 2) S.menu = { kind:'clrconf', what:'setup', page:0, lines:[[' ClrSetup', '']] };
      else if (digit === 3) S.menu = { kind:'clrconf', what:'all', page:0, lines:[[' ClrAll', '']] };
      return;
    }
    if (m.kind === 'drg') {
      const u = { 1:'D', 2:'R', 3:'G' }[digit];
      if (u) {
        exitMenu();
        insertOp(T.aunit(u, { D:'°', R:'ʳ', G:'ᵍ' }[u]));
      }
      return;
    }
    if (m.kind === 'regtype') {
      const pick = m.page === 0
        ? { 1:'Lin', 2:'Log', 3:'Exp', 4:'Pwr' }[digit]
        : { 1:'Inv', 2:'Quad', 3:'AB' }[digit];
      if (pick) { Stat.setType(pick); exitMenu(); }
      return;
    }
    if (m.kind === 'ssum') {
      const pages = [
        [['sx2', 'Σx²'], ['sx', 'Σx'], ['n', 'n']],
        [['sy2', 'Σy²'], ['sy', 'Σy'], ['sxy', 'Σxy']],
        [['sx2y', 'Σx²y'], ['sx3', 'Σx³'], ['sx4', 'Σx⁴']],
      ];
      const it = pages[m.page] && pages[m.page][digit - 1];
      if (it) { exitMenu(); insertTok(T.stat(it[0], it[1])); }
      return;
    }
    if (m.kind === 'svarsd') {
      const pages = [
        [['xbar', ''], ['xsn', 'xσn'], ['xsn1', 'xσn-1']],
        [['minX', 'minX'], ['maxX', 'maxX']],
      ];
      const it = pages[m.page] && pages[m.page][digit - 1];
      if (it) { exitMenu(); insertTok(T.stat(it[0], it[1])); }
      return;
    }
    if (m.kind === 'svarreg') {
      if (digit === 1) openRegVarMenu();
      else if (digit === 2) openMinMaxMenu();
      else if (digit === 3) openRegTypeMenu();
      return;
    }
    if (m.kind === 'rvar') {
      const quad = Stat.getType() === 'Quad';
      const pages = [
        [['xbar', ''], ['xsn', 'xσn'], ['xsn1', 'xσn-1']],
        [['ybar', ''], ['ysn', 'yσn'], ['ysn1', 'yσn-1']],
        quad ? [['ra', 'a'], ['rb', 'b'], ['rc', 'c']] : [['ra', 'a'], ['rb', 'b'], ['rr', 'r']],
        quad ? [['xhat1', '1'], ['xhat2', '2'], ['yhat', '']] : [['xhat', ''], ['yhat', '']],
      ];
      const it = pages[m.page] && pages[m.page][digit - 1];
      if (it) {
        exitMenu();
        if (it[0].startsWith('xhat') || it[0] === 'yhat') insertOp(T.stpost(it[0], it[1]));
        else insertTok(T.stat(it[0], it[1]));
      }
      return;
    }
    if (m.kind === 'minmax') {
      const pages = [
        [['minX', 'minX'], ['maxX', 'maxX']],
        [['minY', 'minY'], ['maxY', 'maxY']],
      ];
      const it = pages[m.page] && pages[m.page][digit - 1];
      if (it) { exitMenu(); insertTok(T.stat(it[0], it[1])); }
      return;
    }
    if (m.kind === 'prgm') {
      if (digit === 1) openAreaMenu('edit');
      else if (digit === 2) openAreaMenu('run');
      else if (digit === 3) openAreaMenu('del');
      return;
    }
    if (m.kind === 'parea') {
      if (digit >= 1 && digit <= 4) {
        const idx = digit - 1;
        const a = Prog.areas()[idx];
        if (m.action === 'edit') {
          if (a) { S.menu = null; enterEdit(idx); }
          else openRunModeMenu(idx);
        } else if (m.action === 'run') {
          if (a && a.tokens.length) { S.menu = null; startProgram(idx); }
        } else if (m.action === 'del') {
          Prog.set(idx, null);
          openAreaMenu('del');
        }
      }
      return;
    }
    if (m.kind === 'prunmode') {
      const pick = { 1:'COMP', 2:'CMPLX', 3:'BASE', 4:'SD', 5:'REG' }[digit];
      if (pick) {
        Prog.set(m.areaIdx, { mode: pick, tokens: [] });
        S.menu = null;
        enterEdit(m.areaIdx);
      }
      return;
    }
    if (m.kind === 'pcmd') {
      const pg = PCMD_PAGES[m.page];
      if (pg && pg[digit - 1]) {
        const factory = pg[digit - 1][1];
        exitMenu();
        insertTok(factory());
      }
      return;
    }
    if (m.kind === 'constm') {
      if (digit >= 1 && digit <= 4) {
        const c = CONSTS[m.page * 4 + (digit - 1)];
        exitMenu();
        insertTok({ t: 'const', d: c[0], value: c[1] });
      }
      return;
    }
    if (m.kind === 'logic') {
      if (m.page === 0) {
        const p = { 1:'d', 2:'h', 3:'b', 4:'o' }[digit];
        if (p) { exitMenu(); insertTok(T.bpre(p)); }
      } else if (m.page === 1) {
        const op = { 1:'and', 2:'or', 3:'xnor' }[digit];
        if (op) { exitMenu(); insertOp(T.logicop(op)); }
      } else {
        if (digit === 1) { exitMenu(); insertOp(T.logicop('xor')); }
        else if (digit === 2) { exitMenu(); insertTok(T.pfunc('Not', 'Not(')); }
        else if (digit === 3) { exitMenu(); insertTok(T.pfunc('Neg', 'Neg(')); }
      }
      return;
    }
  }
  function menuExe() {
    const m = S.menu;
    if (m && m.kind === 'clrconf') {
      if (m.what === 'stat') Stat.clear();
      if (m.what === 'mem' || m.what === 'all') {
        for (const k in S.mem) S.mem[k] = 0;
        S.ans = 0; S.fvars = {};
      }
      if (m.what === 'all') { Stat.clear(); Prog.load('[null,null,null,null]'); }
      // 短暫顯示 Data Clear! 再返正常畫面(教學片核實)
      S.menu = { kind: 'msg', page: 0, lines: [[' Data Clear!', '']] };
      setTimeout(() => {
        if (S.phase === 'menu' && S.menu && S.menu.kind === 'msg') {
          S.menu = null; S.phase = 'input';
          S.tokens = []; S.cursor = 0; S.lastVal = 0;
          render();
        }
      }, 1200);
      return;
      if (m.what === 'setup' || m.what === 'all') {
        S.mode = 'COMP'; S.angle = 'D';
        S.setup = { mode:'norm', norm:1, digits:0 };
        S.fracImproper = false; S.cmplxPolar = false; S.freqOn = true;
      }
      if (m.what === 'all') { S.history = []; S.tokens = []; S.cursor = 0; }
      exitMenu();
    }
  }

  /* ---- SD / REG 統計 ---- */
  function statEnvExtras() {
    if (S.mode === 'SD' || S.mode === 'REG') {
      return { statFn: Stat.statFn, statPost: Stat.statPost };
    }
    return {};
  }
  function openRegTypeMenu(returnPhase) {
    S.phase = 'menu';
    S.menu = {
      kind: 'regtype', page: 0, returnPhase,
      lines: [menuLines(['Lin', 'Log', 'Exp', 'Pwr']), menuLines(['Inv', 'Quad', 'AB-Exp'])],
    };
  }
  function openSSumMenu() {
    S.phase = 'menu';
    const lines = S.mode === 'SD'
      ? [menuLines(['Σx²', 'Σx', 'n'])]
      : [menuLines(['Σx²', 'Σx', 'n']), menuLines(['Σy²', 'Σy', 'Σxy']), menuLines(['Σx²y', 'Σx³', 'Σx⁴'])];
    S.menu = { kind: 'ssum', page: 0, lines };
  }
  function openSVarMenu() {
    S.phase = 'menu';
    if (S.mode === 'SD') {
      S.menu = { kind: 'svarsd', page: 0, lines: [menuLines(['', 'xσn', 'xσn-1']), menuLines(['minX', 'maxX'])] };
    } else {
      S.menu = { kind: 'svarreg', page: 0, lines: [menuLines(['VAR', 'MINMAX', 'TYPE'])] };
    }
  }
  function openRegVarMenu() {
    S.phase = 'menu';
    const quad = Stat.getType() === 'Quad';
    S.menu = {
      kind: 'rvar', page: 0,
      lines: [
        menuLines(['', 'xσn', 'xσn-1']),
        menuLines(['', 'yσn', 'yσn-1']),
        quad ? menuLines(['a', 'b', 'c']) : menuLines(['a', 'b', 'r']),
        quad ? menuLines(['1', '2', '']) : menuLines(['', '']),
      ],
    };
  }
  function openMinMaxMenu() {
    S.phase = 'menu';
    S.menu = { kind: 'minmax', page: 0, lines: [menuLines(['minX', 'maxX']), menuLines(['minY', 'maxY'])] };
  }
  // 頂層(唔入括號)分割 x , y ; f
  function parseDTParts(tokens) {
    let depth = 0, commaAt = -1, semiAt = -1;
    for (let i = 0; i < tokens.length; i++) {
      const tk = tokens[i];
      if (['lp', 'pfunc', 'powp', 'xrootp'].includes(tk.t)) depth++;
      else if (tk.t === 'rp') depth--;
      else if (depth === 0 && tk.t === 'comma') { if (commaAt < 0) commaAt = i; }
      else if (depth === 0 && tk.t === 'semi') semiAt = i;
    }
    const env = Object.assign({ angle: S.angle, mem: S.mem, ans: S.ans, setup: S.setup }, statEnvExtras());
    const ev = seg => Engine.toNum(Engine.evaluate(seg, env));
    const xEnd = commaAt >= 0 ? commaAt : (semiAt >= 0 ? semiAt : tokens.length);
    const out = { x: ev(tokens.slice(0, xEnd)), y: undefined, f: 1 };
    if (commaAt >= 0) out.y = ev(tokens.slice(commaAt + 1, semiAt >= 0 ? semiAt : tokens.length));
    if (semiAt >= 0) {
      if (!S.freqOn) throw new Engine.CalcError('Syntax ERROR');
      out.f = ev(tokens.slice(semiAt + 1));
      if (!Number.isInteger(out.f) || out.f <= 0) throw new Engine.CalcError('Math ERROR');
    }
    return out;
  }
  function statCap() {
    if (S.mode === 'SD') return S.freqOn ? 40 : 80;
    return S.freqOn ? 26 : 40;
  }
  function doDT() {
    try {
      if (!S.tokens.length) {   // 空輸入 DT:重複上一筆
        const it = Stat.items();
        if (!it.length) return;
        if (it.length >= statCap()) { S.phase = 'error'; S.error = { name: 'Data Full', pos: 0 }; return; }
        const last = it[it.length - 1];
        Stat.push(last.x, last.y, last.f);
      } else {
        if (Stat.nItems() >= statCap()) { S.phase = 'error'; S.error = { name: 'Data Full', pos: 0 }; return; }
        const p = parseDTParts(S.tokens);
        if (S.mode === 'REG' && p.y === undefined) throw new Engine.CalcError('Syntax ERROR');
        if (S.mode === 'SD' && p.y !== undefined) throw new Engine.CalcError('Syntax ERROR');
        Stat.push(p.x, p.y, p.f);
      }
      // 顯示 n=(筆數)
      S.tokens = []; S.cursor = 0;
      S.phase = 'result';
      S.result = Stat.statFn('n');
      S.lastVal = S.result;
      S.resultSuffix = 'n=';
      S.dispAlt = null; S.dispImproper = false; S.engExp = null;
      S.histIdx = null;
    } catch (e) {
      S.phase = 'error';
      S.error = { name: e.errName || 'Syntax ERROR', pos: 0 };
    }
  }
  // 統計數據瀏覽(▲▼)
  function statFields() {
    const out = [];
    Stat.items().forEach((d, i) => {
      out.push({ i, field: 'x', label: 'x' + (i + 1) + '=' });
      if (S.mode === 'REG') out.push({ i, field: 'y', label: 'y' + (i + 1) + '=' });
      if (S.freqOn) out.push({ i, field: 'f', label: 'Freq' + (i + 1) + '=' });
    });
    return out;
  }
  function statViewKey(id, shift) {
    const fields = statFields();
    if (!fields.length) { S.phase = 'input'; return; }
    if (S.sv.idx >= fields.length) S.sv.idx = fields.length - 1;
    const cur = fields[S.sv.idx];
    if (id === 'ac' || id === 'on') { S.phase = 'input'; S.tokens = []; S.cursor = 0; return; }
    if (id === 'rep_d') { if (S.sv.idx < fields.length - 1) S.sv.idx++; S.tokens = []; return; }
    if (id === 'rep_u') { if (S.sv.idx > 0) S.sv.idx--; S.tokens = []; return; }
    if (id === 'mplus' && shift) {   // CL:刪除成筆樣本
      Stat.del(cur.i);
      S.sv.idx = 0; S.tokens = [];
      if (!Stat.items().length) S.phase = 'input';
      return;
    }
    // 輸入新值
    const digit = { d0:'0',d1:'1',d2:'2',d3:'3',d4:'4',d5:'5',d6:'6',d7:'7',d8:'8',d9:'9' }[id];
    if (digit !== undefined && !shift) { S.tokens.push(T.d(digit)); return; }
    if (id === 'dot') { S.tokens.push(T.dot()); return; }
    if (id === 'neg') { S.tokens.push(T.neg()); return; }
    if (id === 'expk' && !shift) { S.tokens.push(T.exp()); return; }
    if (id === 'del') { S.tokens.pop(); return; }
    if (id === 'exe') {
      if (!S.tokens.length) return;
      try {
        const env = { angle: S.angle, mem: S.mem, ans: S.ans, setup: S.setup };
        const v = Engine.toNum(Engine.evaluate(S.tokens, env));
        if (cur.field === 'f' && (!Number.isInteger(v) || v <= 0)) throw new Engine.CalcError('Math ERROR');
        Stat.setField(cur.i, cur.field, v);
        S.tokens = [];
      } catch (e) {
        S.phase = 'error'; S.error = { name: e.errName || 'Syntax ERROR', pos: 0 }; S.tokens = [];
      }
      return;
    }
  }
  function renderStatView() {
    const fields = statFields();
    if (!fields.length) { S.phase = 'input'; render(); return; }
    if (S.sv.idx >= fields.length) S.sv.idx = fields.length - 1;
    const cur = fields[S.sv.idx];
    const d = Stat.items()[cur.i];
    const val = cur.field === 'x' ? d.x : cur.field === 'y' ? d.y : d.f;
    let top, bottom, expo = '';
    if (S.tokens.length) {
      top = cur.label + lineText(S.tokens);
      bottom = '';
    } else {
      top = cur.label;
      const f = Engine.format(val, S.setup, {});
      bottom = f.text; expo = f.expo;
    }
    LCD.draw({ topText: top.substring(0, 16), cursorPos: S.tokens.length ? Math.min(15, top.length) : null, bottomText: bottom, expo, indicators: indicators() });
  }

  /* ---- PRGM 程式模式 ---- */
  const PCMD_PAGES = [
    [['?', T.cmd.bind(null, '?')], ['→', T.sto], [':', T.cmd.bind(null, ':')], ['◢', T.cmd.bind(null, '◢')]],
    [['⇒', T.cmd.bind(null, '⇒')], ['Goto', T.cmd.bind(null, 'Goto', 'Goto ')], ['Lbl', T.cmd.bind(null, 'Lbl', 'Lbl ')], ['Break', T.cmd.bind(null, 'Break')]],
    [['=', T.relop.bind(null, '=')], ['≠', T.relop.bind(null, '≠')], ['>', T.relop.bind(null, '>')], ['≥', T.relop.bind(null, '≥')]],
    [['<', T.relop.bind(null, '<')], ['≤', T.relop.bind(null, '≤')], ['If', T.cmd.bind(null, 'If', 'If ')], ['Then', T.cmd.bind(null, 'Then', 'Then ')]],
    [['Else', T.cmd.bind(null, 'Else', 'Else ')], ['IfEnd', T.cmd.bind(null, 'IfEnd')], ['For', T.cmd.bind(null, 'For', 'For ')], ['To', T.cmd.bind(null, 'To', ' To ')]],
    [['Step', T.cmd.bind(null, 'Step', ' Step ')], ['Next', T.cmd.bind(null, 'Next')]],
    [['While', T.cmd.bind(null, 'While', 'While ')], ['WhileEnd', T.cmd.bind(null, 'WhileEnd')]],
    [['Deg', T.cmd.bind(null, 'Deg')], ['Rad', T.cmd.bind(null, 'Rad')], ['Gra', T.cmd.bind(null, 'Gra')], ['Fix', T.cmd.bind(null, 'Fix', 'Fix ')]],
    [['Sci', T.cmd.bind(null, 'Sci', 'Sci ')], ['Norm', T.cmd.bind(null, 'Norm', 'Norm ')], ['FreqOn', T.cmd.bind(null, 'FreqOn')], ['FreqOff', T.cmd.bind(null, 'FreqOff')]],
    [['ClrMemory', T.cmd.bind(null, 'ClrMemory')], ['ClrStat', T.cmd.bind(null, 'ClrStat')]],
    [['Dec', T.cmd.bind(null, 'Dec')], ['Hex', T.cmd.bind(null, 'Hex')], ['Bin', T.cmd.bind(null, 'Bin')], ['Oct', T.cmd.bind(null, 'Oct')]],
    [['DT', T.cmd.bind(null, 'DT')], [';', T.semi]],
  ];
  function openPrgmMenu() {
    S.phase = 'menu';
    S.menu = { kind: 'prgm', page: 0, lines: [menuLines(['EDIT', 'RUN', 'DEL'])] };
  }
  function openAreaMenu(action, returnPhase) {   // action: 'edit'|'run'|'del'
    S.phase = 'menu';
    const title = { edit: 'EDIT  Program', run: 'RUN  Program', del: 'DELETE Program' }[action];
    const used = Prog.areas().map((a, i) => a ? String(i + 1) : '').join('');
    const free = String(Prog.bytesFree());
    const bot = ' P-' + used.padEnd(6, ' ') + free.padStart(4, ' ');
    S.menu = { kind: 'parea', action, page: 0, lines: [[title, bot]], plain: true, returnPhase };
  }
  function openProgPicker() {   // 機外撳 Prog:P1 P2 P3 P4 揀區畫面(手冊 E-64)
    S.phase = 'menu';
    S.menu = { kind: 'parea', action: 'run', page: 0, lines: [menuLines(['P1', 'P2', 'P3', 'P4'])] };
  }
  function openRunModeMenu(areaIdx) {
    S.phase = 'menu';
    S.menu = {
      kind: 'prunmode', areaIdx, page: 0,
      lines: [['MODE: COMP CMPLX', '      1    2'], ['MODE: BASE SD REG', '      3   4   5']],
    };
  }
  function openPcmdMenu() {
    S.phase = 'menu';
    S.menu = {
      kind: 'pcmd', page: 0, returnPhase: 'pedit',
      lines: PCMD_PAGES.map(pg => menuLines(pg.map(x => x[0]))),
    };
  }
  function enterEdit(areaIdx) {
    const prog = Prog.areas()[areaIdx];
    S.pe = { area: areaIdx };
    S.tokens = prog.tokens;   // 直接編輯(同一個 array)
    S.cursor = prog.tokens.length;
    S.phase = 'pedit';
  }
  function peditExit() {
    S.pe = null;
    S.tokens = []; S.cursor = 0;
    openPrgmMenu();
    if (S.mode !== 'PRGM') { S.menu = null; S.phase = 'input'; }
  }
  function peditKey(id, shift, alpha) {
    // RCL / STO 之後直接撳變數鍵(A B C D X Y M)入變數,唔使 ALPHA(真機行為)
    if (S.pePending) {
      S.pePending = null;
      const v = VAR_KEYS[id];
      if (v && !shift && !alpha) { insertTok(T.variable(v)); return true; }
    }
    if (id === 'exe' && !shift) { insertTok(T.cmd(':')); return true; }
    if (id === 'ac' || (id === 'prog' && shift) || id === 'on') { peditExit(); return true; }
    if (id === 'prog' || (id === 'd3' && shift)) { openPcmdMenu(); return true; }
    if (id === 'rcl') {
      if (shift) insertTok(T.sto());   // STO:入 → 符號,跟住直接撳字母
      S.pePending = 'v';
      return true;
    }
    if (id === 'mplus' && !alpha) {
      const prog = Prog.areas()[S.pe.area];
      const statProg = prog.mode === 'SD' || prog.mode === 'REG';
      if (statProg && !shift) insertTok(T.cmd('DT'));
      else insertTok(shift ? T.cmd('M−') : T.cmd('M+'));
      return true;
    }
    if (id === 'comma' && shift) { insertTok(T.semi()); return true; }
    if (id === 'rep_u') { S.cursor = 0; return true; }      // ▲ 去程式開頭
    if (id === 'rep_d') { S.cursor = S.tokens.length; return true; }
    if (id === 'mode') { S.pe = null; S.tokens = []; S.cursor = 0; shift ? openSetupMenu() : openModeMenu(); return true; }
    return false;   // 其他鍵行預設 token 插入
  }
  function progRunEnv(prog) {
    const base = { angle: S.angle, mem: S.mem, ans: S.ans, setup: S.setup, base: S.base };
    if (prog.mode === 'SD' || prog.mode === 'REG') {
      base.statFn = Stat.statFn; base.statPost = Stat.statPost;
    }
    return base;
  }
  function startProgram(areaIdx) {
    const prog = Prog.areas()[areaIdx];
    if (!prog || !prog.tokens.length) return;
    const ctx = {
      evalTokens(seg) {
        const env = progRunEnv(prog);
        env.ans = S.ans;
        const v = prog.mode === 'BASE' ? Engine.evaluateBase(seg, env) : Engine.evaluate(seg, env);
        return v;
      },
      assign(name, val) { S.mem[name] = val; },
      getVar(name) { return S.mem[name] !== undefined ? S.mem[name] : 0; },
      setAns(v) { S.ans = v; },
      applyCmd(name, arg) {
        switch (name) {
          case 'Deg': S.angle = 'D'; break;
          case 'Rad': S.angle = 'R'; break;
          case 'Gra': S.angle = 'G'; break;
          case 'Fix': S.setup = { mode: 'fix', digits: Math.min(9, arg), norm: S.setup.norm }; break;
          case 'Sci': S.setup = { mode: 'sci', digits: arg === 0 ? 10 : arg, norm: S.setup.norm }; break;
          case 'Norm': S.setup = { mode: 'norm', norm: arg === 2 ? 2 : 1, digits: 0 }; break;
          case 'FreqOn': S.freqOn = true; Stat.clear(); break;
          case 'FreqOff': S.freqOn = false; Stat.clear(); break;
          case 'ClrMemory': for (const k in S.mem) S.mem[k] = 0; break;
          case 'ClrStat': Stat.clear(); break;
          case 'Dec': S.base = 10; break;
          case 'Hex': S.base = 16; break;
          case 'Bin': S.base = 2; break;
          case 'Oct': S.base = 8; break;
        }
      },
      doDT(seg) {
        const saveTokens = S.tokens, saveMode = S.mode;
        S.mode = prog.mode; S.tokens = seg;
        try {
          const p = parseDTParts(seg);
          if (Stat.nItems() >= statCap()) throw new Engine.CalcError('Data Full');
          Stat.push(p.x, p.y, p.f);
        } finally { S.tokens = saveTokens; S.mode = saveMode; }
      },
      doM(val, minus) {
        const nv = Engine.isCplx(val) ? val.re : Engine.toNum(val);
        const om = Engine.isCplx(S.mem.M) ? S.mem.M.re : Engine.toNum(S.mem.M);
        S.mem.M = Engine.r15(minus ? om - nv : om + nv);
      },
      onWait(w) {
        S.runWait = w;
        S.tokens = []; S.cursor = 0;
        render();
      },
      onEnd(v) {
        S.run = null; S.runWait = null;
        S.result = v; S.ans = v; S.lastVal = v;
        S.resultSuffix = '';
        S.tokens = []; S.cursor = 0;
        S.phase = 'result';
        render();
      },
      onError(e, pos) {
        S.run = null; S.runWait = null;
        S.phase = 'error';
        S.error = { name: e.errName || 'Syntax ERROR', pos: 0 };
        S.runErr = { area: areaIdx, pos };
        render();
      },
    };
    S.run = { area: areaIdx, prog, runner: Prog.Runner(prog, ctx) };
    S.runWait = null;
    S.phase = 'prun';
    S.tokens = []; S.cursor = 0;
    S.run.runner.start();
  }
  function runKey(id, shift, alpha) {
    if (id === 'ac' || id === 'on') {   // 中斷程式
      if (S.run) S.run.runner.abort();
      S.run = null; S.runWait = null;
      S.phase = 'input'; S.tokens = []; S.cursor = 0;
      return true;
    }
    const w = S.runWait;
    if (!w) return true;   // 執行中,唔收鍵
    if (w.type === 'pause') {
      if (id === 'exe' && !shift) { S.runWait = null; S.run.runner.resumePause(); return true; }
      return true;
    }
    // prompt:輸入表達式
    if (id === 'exe' && !shift) {
      if (!S.tokens.length) return true;
      try {
        const v = S.run.runner && S.run ? Engine.evaluate(S.tokens, progRunEnv(S.run.prog)) : 0;
        S.tokens = []; S.cursor = 0;
        S.runWait = null;
        S.run.runner.resumePrompt(v);
      } catch (e) {
        S.run.runner.abort(); S.run = null; S.runWait = null;
        S.phase = 'error'; S.error = { name: e.errName || 'Syntax ERROR', pos: 0 };
      }
      return true;
    }
    if (['mode', 'prog', 'fmla', 'rcl', 'mplus'].includes(id)) return true;   // 提示中封鎖
    return false;   // 其他鍵照常插入 token(輸入應答)
  }
  function renderPedit() {
    const text = lineText(S.tokens);
    const cChar = charPosOf(S.tokens, S.cursor);
    let start = 0;
    if (cChar > 15) start = cChar - 15;
    LCD.draw({
      topText: text.substring(start, start + 16),
      cursorPos: cChar - start, cursorOver: S.insertOver,
      scrollL: start > 0, scrollR: text.length > start + 16,
      bottomText: '', expo: '',
      smallRight: String(S.tokens.length).padStart(3, '0'),
      indicators: indicators(),
    });
  }
  function renderPrun() {
    const w = S.runWait;
    if (!w) {   // 執行中
      LCD.draw({ topText: '', cursorPos: null, bottomText: '', expo: '', indicators: indicators() });
      return;
    }
    if (w.type === 'pause') {
      const f = Engine.format(w.value, S.setup, {});
      const ind = indicators(); ind.disp = true;
      LCD.draw({ topText: '', cursorPos: null, bottomText: f.text, expo: f.expo, indicators: ind });
      return;
    }
    // prompt:上行「A?」(輸入時替換),下行顯示該變數而家嘅值(教學片核實)
    const top = S.tokens.length ? lineText(S.tokens) : w.varName + '?';
    let bottom = '', expo = '';
    try {
      const cur = S.mem[w.varName] !== undefined ? S.mem[w.varName] : 0;
      const f = Engine.format(Engine.isCplx(cur) ? cur.re : cur, S.setup, {});
      bottom = f.text; expo = f.expo;
    } catch (e) {}
    LCD.draw({
      topText: top.substring(0, 16),
      cursorPos: Math.min(15, top.length),
      bottomText: bottom, expo, indicators: indicators(),
    });
  }

  /* ---- STO / RCL / M+ ---- */
  function handlePending(id) {
    const v = VAR_KEYS[id] || (id === 'mplus' ? 'M' : null);
    if (!v) { S.pending = null; return false; }
    if (S.pending === 'STO') {
      if (S.tokens.length && S.phase === 'input') {
        runEval('→' + v, val => { S.mem[v] = val; });
      } else {
        S.tokens = [T.ans()];
        runEval('→' + v, val => { S.mem[v] = val; });
      }
    } else { // RCL:顯示「A=」+ 數值(教學片 t=3250;並更新 Ans,手冊 E-20)
      S.tokens = [T.variable(v)];
      runEval('=');
    }
    S.pending = null;
    return true;
  }

  function doMPlus(minus) {
    const realOf = v => Engine.isCplx(v) ? v.re : Engine.toNum(v);
    if (S.phase === 'input' && S.tokens.length) {
      runEval(minus ? 'M−' : 'M+', val => {
        const nv = realOf(val), om = realOf(S.mem.M);
        S.mem.M = Engine.r15(minus ? om - nv : om + nv);
      });
    } else {
      const nv = realOf(S.ans), om = realOf(S.mem.M);
      S.mem.M = Engine.r15(minus ? om - nv : om + nv);
    }
    render();
  }

  /* ---- 結果顯示切換(ab/c、°'" 於結果畫面) ---- */
  function toggleFracDec() {
    const v = S.result;
    if (Engine.isCplx(v)) return;
    if (Engine.isFrac(v)) {
      S.dispAlt = S.dispAlt === 'dec' ? null : 'dec';
    } else if (typeof v === 'number' || Engine.isDms(v)) {
      if (S.dispAlt === 'frac') { S.dispAlt = null; return; }
      const f = Engine.decimalToFrac(Engine.toNum(v));
      if (f) { S.altFracCache = f; S.dispAlt = 'frac'; }
    }
  }
  function toggleDmsDec() {
    const v = S.result;
    if (Engine.isCplx(v)) return;
    if (Engine.isDms(v)) S.dispAlt = S.dispAlt === 'dec' ? null : 'dec';
    else S.dispAlt = S.dispAlt === 'dms' ? null : 'dms';
  }

  /* ---- FMLA(23 條內置公式,COMP 限定)---- */
  const pad2 = n => String(n).padStart(2, '0');
  function openFmla() {
    S.phase = 'fmla';
    S.fmla = { mode: 'no', numBuf: '', idx: 0, vi: 0, results: null, ri: 0 };
    S.tokens = []; S.cursor = 0;
  }
  function exitFmla() {
    S.fmla = null; S.phase = 'input';
    S.tokens = []; S.cursor = 0;
  }
  function runFormula() {
    const F = S.fmla, def = FMLA[F.idx];
    const v = {};
    for (const name of def.vars) v[name] = S.fvars[name] !== undefined ? S.fvars[name] : 0;
    try {
      F.results = def.calc(v, S.angle);
      F.mode = 'result'; F.ri = 0;
      S.ans = F.results[0][1]; S.lastVal = S.ans;
    } catch (e) {
      S.phase = 'error';
      S.error = { name: e.errName || 'Math ERROR', pos: 0 };
      S.fmla = null; S.tokens = [];
    }
  }
  function fmlaKey(id, shift) {
    const F = S.fmla;
    if (id === 'ac' || id === 'on' || id === 'fmla' || (id === 'prog' && shift)) { exitFmla(); return; }   // FMLA 再撳一次退出
    const digit = { d1:1, d2:2, d3:3, d4:4, d5:5, d6:6, d7:7, d8:8, d9:9, d0:0 }[id];

    if (F.mode === 'no') {
      if (digit !== undefined) {
        F.numBuf += digit;
        if (F.numBuf.length >= 2) {
          const no = parseInt(F.numBuf, 10);
          if (no >= 1 && no <= 23) {
            // 兩位數選定 → 短暫顯示公式名(~半秒)再自動跳入變數輸入(用戶實機核實)
            F.idx = no - 1; F.mode = 'browse';
            const cur = F;
            setTimeout(() => {
              if (S.phase === 'fmla' && S.fmla === cur && cur.mode === 'browse') {
                cur.mode = 'var'; cur.vi = 0;
                S.tokens = []; S.cursor = 0;
                render();
              }
            }, 500);
          }
          F.numBuf = '';
        }
      }
      else if (id === 'rep_d') { F.mode = 'browse'; F.idx = 0; }
      else if (id === 'rep_u') { F.mode = 'browse'; F.idx = FMLA.length - 1; }
      return;
    }
    if (F.mode === 'browse') {
      if (id === 'rep_d') F.idx = (F.idx + 1) % FMLA.length;
      else if (id === 'rep_u') F.idx = (F.idx + FMLA.length - 1) % FMLA.length;
      else if (id === 'exe') { F.mode = 'var'; F.vi = 0; S.tokens = []; S.cursor = 0; }
      return;
    }
    if (F.mode === 'var') {
      const def = FMLA[F.idx], name = def.vars[F.vi];
      if (digit !== undefined && !shift) { S.tokens.push(T.d(String(digit))); S.cursor = S.tokens.length; return; }
      if (id === 'dot') { S.tokens.push(T.dot()); S.cursor = S.tokens.length; return; }
      if (id === 'neg') { S.tokens.push(T.neg()); S.cursor = S.tokens.length; return; }
      if (id === 'expk') { S.tokens.push(shift ? T.pi() : T.exp()); S.cursor = S.tokens.length; return; }
      if (id === 'del') { S.tokens.pop(); S.cursor = S.tokens.length; return; }
      if (id === 'exe') {
        if (S.tokens.length) {
          try {
            const env = { angle: S.angle, mem: S.mem, ans: S.ans, setup: S.setup };
            S.fvars[name] = Engine.toNum(Engine.evaluate(S.tokens, env));
          } catch (e) {
            S.phase = 'error'; S.error = { name: e.errName || 'Syntax ERROR', pos: 0 };
            S.fmla = null; S.tokens = [];
            return;
          }
          S.tokens = []; S.cursor = 0;
        }
        F.vi++;
        if (F.vi >= def.vars.length) runFormula();
        return;
      }
      return;
    }
    if (F.mode === 'result') {
      if (id === 'exe') {
        if (F.ri + 1 < F.results.length) { F.ri++; S.ans = F.results[F.ri][1]; S.lastVal = S.ans; }
        else { F.mode = 'var'; F.vi = 0; S.tokens = []; S.cursor = 0; }   // EXE 重新由頭執行(手冊 E-57)
      }
      return;
    }
  }
  function renderFmla() {
    const F = S.fmla, def = FMLA[F.idx];
    let top = '', bottom = '', prefix = '', varLetter = '', expo = '';
    if (F.mode === 'no') {
      top = 'Formula No.?';
      bottom = F.numBuf;
    } else if (F.mode === 'browse') {
      top = pad2(def.no) + ':' + def.name;
      if (F.lastRes) {   // 下行保留上次公式結果(手冊 E-57 畫面)
        const f = Engine.format(F.lastRes.value, S.setup, {});
        bottom = f.text; expo = f.expo; varLetter = F.lastRes.name;
      }
    } else if (F.mode === 'var') {
      // 真機 layout:輸入即時顯示喺左上算式行;右下保留該變數上次嘅值 + 變數名細字
      const name = def.vars[F.vi];
      varLetter = name;
      top = lineText(S.tokens);
      const f = Engine.format(S.fvars[name] !== undefined ? S.fvars[name] : 0, S.setup, {});
      bottom = f.text; expo = f.expo;
      LCD.draw({
        topText: top.substring(0, 16), cursorPos: Math.min(15, top.length),
        cursorOver: S.insertOver,
        bottomText: bottom, expo, baseLetter: varLetter, indicators: indicators(),
      });
      return;
    } else if (F.mode === 'result') {
      top = pad2(def.no) + ':' + def.name;
      prefix = F.results[F.ri][0] + '=';
      const f = Engine.format(F.results[F.ri][1], S.setup, {});
      bottom = f.text; expo = f.expo;
      F.lastRes = { name: F.results[F.ri][0], value: F.results[F.ri][1] };
    }
    LCD.draw({
      topText: top.substring(0, 16), cursorPos: null,
      bottomText: bottom, expo, bottomPrefix: prefix,
      baseLetter: varLetter, indicators: indicators(),
    });
  }

  /* ---- BASE 模式按鍵(手冊 E-52~55)---- */
  function baseKey(id, shift, alpha) {
    if (S.phase === 'menu' || S.phase === 'off') return false;
    const HEXL = { neg:'A', dms:'B', hyp:'C', sin:'D', cos:'E', tan:'F' };
    if (!shift && !alpha && HEXL[id]) {
      if (id === 'neg' && S.base !== 16) return false;   // 非 HEX 之下 (−) 照舊做負號
      insertTok(T.hexd(HEXL[id]));
      return true;
    }
    if (!shift && { sq:10, pow:16, log:2, ln:8 }[id] !== undefined) {
      S.base = { sq:10, pow:16, log:2, ln:8 }[id];
      return true;   // 結果畫面按此轉底顯示;輸入中轉輸入底
    }
    if (id === 'inv' && !shift) { openLogicMenu(); return true; }
    // BASE 不支援嘅鍵:小數點、EXP、分數、函數、nPr/nCr、DRG 等
    if (['dot', 'expk', 'abc', 'sqrt', 'cube', 'eng', 'comma'].includes(id)) return true;
    if (shift && ['mul', 'div', 'ans', 'inv', 'log', 'ln', 'sq', 'pow', 'add', 'sub', 'lp', 'rp', 'd0', 'dot'].includes(id)) return true;
    return false;
  }

  /* ---- CMPLX 模式特殊鍵(手冊 E-34~37)---- */
  function cmplxKey(id, shift, alpha) {
    if (S.phase === 'menu' || S.phase === 'off') return false;
    if (id === 'eng' && !shift && !alpha) { insertTok(T.imag()); return true; }
    if (shift && id === 'lp') { insertTok(T.pfunc('arg', 'arg(')); return true; }
    if (shift && id === 'comma') { insertTok(T.pfunc('Conjg', 'Conjg(')); return true; }
    if (shift && id === 'neg') { insertOp(T.ang()); return true; }
    if (shift && id === 'add') { insertTok(T.dispov('polar', '▸r∠θ')); return true; }
    if (shift && id === 'sub') { insertTok(T.dispov('rect', '▸a+bi')); return true; }
    return false;
  }

  /* ---- 主鍵處理 ---- */
  function press(id) {
    if (S.phase === 'off') {
      if (id === 'on') { S.phase = 'input'; S.tokens = []; S.cursor = 0; S.insertOver = false; S.history = []; render(); }
      return;
    }

    if (id === 'shift') { S.shift = !S.shift; S.alpha = false; render(); return; }
    if (id === 'alpha') { S.alpha = !S.alpha; S.shift = false; render(); return; }

    const shift = S.shift, alpha = S.alpha;
    S.shift = false; S.alpha = false;

    if (S.phase === 'menu') {
      if (id === 'exe') menuExe(); else menuKey(id, shift);
      render(); return;
    }
    if (S.phase === 'fmla') { fmlaKey(id, shift); render(); return; }
    if (S.phase === 'statv') { statViewKey(id, shift); render(); return; }
    if (S.phase === 'pedit') { if (peditKey(id, shift, alpha)) { render(); return; } }
    if (S.phase === 'prun') { if (runKey(id, shift, alpha)) { render(); return; } }
    if (S.mode === 'BASE' && baseKey(id, shift, alpha)) { render(); return; }
    if (S.mode === 'CMPLX' && cmplxKey(id, shift, alpha)) { render(); return; }
    // SD / REG 專用鍵
    if ((S.mode === 'SD' || S.mode === 'REG') && S.phase !== 'pedit' && S.phase !== 'prun') {
      if (id === 'mplus' && !alpha) {
        if (!shift) { doDT(); render(); return; }
        render(); return;   // CL 只喺數據瀏覽畫面有效
      }
      if (id === 'd1' && shift) { openSSumMenu(); render(); return; }
      if (id === 'd2' && shift) { openSVarMenu(); render(); return; }
      if (id === 'comma' && shift) { insertTok(T.semi()); render(); return; }
      if ((id === 'rep_u' || id === 'rep_d') && (S.phase === 'input' || S.phase === 'result') && !S.tokens.length) {
        if (Stat.items().length) {
          S.phase = 'statv';
          S.sv = { idx: id === 'rep_u' ? statFields().length - 1 : 0 };
          S.tokens = []; S.cursor = 0;
        }
        render(); return;
      }
    }

    if (S.pending && handlePending(id)) { render(); return; }
    S.pending = null;

    // hyp 待決:hyp→sinh(,SHIFT hyp→sinh⁻¹((手冊 E-28)
    if (S.hypPending && ['sin','cos','tan'].includes(id)) {
      const inv = S.hypPending === 2 || shift;
      const names = inv ? { sin:'asinh', cos:'acosh', tan:'atanh' } : { sin:'sinh', cos:'cosh', tan:'tanh' };
      const disps = inv ? { sin:'sinh⁻¹(', cos:'cosh⁻¹(', tan:'tanh⁻¹(' } : { sin:'sinh(', cos:'cosh(', tan:'tanh(' };
      S.hypPending = 0;
      insertTok(T.pfunc(names[id], disps[id]));
      render(); return;
    }
    if (S.hypPending && id !== 'hyp') S.hypPending = 0;

    if (alpha) {
      if (VAR_KEYS[id]) { insertTok(T.variable(VAR_KEYS[id])); render(); return; }
      if (id === 'ln') { insertTok(T.econst()); render(); return; }   // e 常數
    }

    switch (id) {
      case 'on':
        S.phase = 'input'; S.tokens = []; S.cursor = 0; S.insertOver = false;
        S.hypPending = 0; S.pending = null; S.menu = null;
        S.history = []; S.histIdx = null;
        S.lastVal = 0;
        S.run = null; S.runWait = null; S.pe = null; S.fmla = null;
        if (S.mode === 'PRGM') S.mode = 'COMP';   // 開機一律顯示 0. 畫面(用戶核實)
        break;
      case 'ac':
        if (shift) { S.phase = 'off'; break; }
        S.tokens = []; S.cursor = 0; S.phase = 'input';
        S.resultSuffix = ''; S.dispAlt = null; S.dispImproper = false; S.engExp = null;
        S.lastVal = 0;   // AC 顯示歸 0.
        break;
      case 'del':
        if (shift) { S.insertOver = !S.insertOver; break; }
        delTok();
        break;
      case 'exe':
        if (shift) {   // Re⇔Im:CMPLX 模式功能(手冊 E-34)
          if (S.mode === 'CMPLX' && S.phase === 'result' && Engine.isCplx(S.result)) S.showIm = !S.showIm;
          break;
        }
        doExe(); break;
      case 'mode': shift ? openSetupMenu() : openModeMenu(); break;
      case 'prog':
        if (!shift && S.phase !== 'off') openProgPicker();   // Prog 鍵:P1~P4 揀區執行
        break;
      case 'fmla': if (S.mode === 'COMP' && S.phase !== 'off') openFmla(); break;

      case 'rep_l': case 'rep_r': {
        if (S.phase === 'error') {
          if (S.runErr) {   // 程式出錯:入編輯畫面,游標喺出錯位置
            const re = S.runErr; S.runErr = null;
            enterEdit(re.area);
            S.cursor = Math.min(re.pos, S.tokens.length);
            break;
          }
          S.phase = 'input'; S.cursor = Math.min(S.error.pos, S.tokens.length);
          break;
        }
        if (S.phase === 'result') {   // ◄=游標去尾,►=去頭(手冊 E-19)
          S.phase = 'input'; S.resultSuffix = ''; S.dispAlt = null; S.dispImproper = false; S.engExp = null;
          S.cursor = (id === 'rep_l') ? S.tokens.length : 0;
          S.histIdx = null;
          break;
        }
        if (id === 'rep_l' && S.cursor > 0) S.cursor--;
        if (id === 'rep_r' && S.cursor < S.tokens.length) S.cursor++;
        break;
      }
      case 'rep_u': case 'rep_d': {
        if (!S.history.length) break;
        if (S.phase === 'input' && S.tokens.length && S.histIdx === null) break;  // 輸入中唔回帶
        if (S.histIdx === null) {
          if (id === 'rep_d') break;
          S.histIdx = S.history.length - 1;
          if (S.phase === 'result') S.histIdx = Math.max(0, S.history.length - 2);
        } else {
          if (id === 'rep_u' && S.histIdx > 0) S.histIdx--;
          else if (id === 'rep_d' && S.histIdx < S.history.length - 1) S.histIdx++;
          else break;
        }
        const h = S.history[S.histIdx];
        S.tokens = h.tokens.slice();
        S.cursor = S.tokens.length;
        S.result = h.value; S.resultSuffix = h.suffix || '';
        S.dispAlt = null; S.dispImproper = false; S.engExp = null;
        S.phase = 'result';
        break;
      }

      case 'd0': if (shift) { insertTok(T.pfunc('Rnd','Rnd(')); break; } insertTok(T.d('0')); break;
      case 'd1': insertTok(T.d('1')); break;
      case 'd2': insertTok(T.d('2')); break;
      case 'd3': insertTok(T.d('3')); break;
      case 'd4': insertTok(T.d('4')); break;
      case 'd5': insertTok(T.d('5')); break;
      case 'd6': insertTok(T.d('6')); break;
      case 'd7': if (shift) { openConstMenu(); break; } insertTok(T.d('7')); break;
      case 'd8': insertTok(T.d('8')); break;
      case 'd9': if (shift) { openClrMenu(); break; } insertTok(T.d('9')); break;
      case 'dot': insertTok(shift ? T.ran() : T.dot()); break;
      case 'expk': insertTok(shift ? T.pi() : T.exp()); break;

      case 'add': shift ? insertTok(T.pfunc('Pol','Pol(')) : insertOp(T.op('+')); break;
      case 'sub': shift ? insertTok(T.pfunc('Rec','Rec(')) : insertOp(T.op('-')); break;
      case 'mul': insertOp(shift ? T.npr() : T.op('×')); break;
      case 'div': insertOp(shift ? T.ncr() : T.op('÷')); break;
      case 'pow': insertOp(shift ? T.xrootp() : T.powp()); break;

      case 'neg': insertTok(T.neg()); break;
      case 'abc': {
        if (shift) {   // d/c:帶分數 ↔ 假分數
          if (S.phase === 'result') S.dispImproper = !S.dispImproper;
          break;
        }
        if (S.phase === 'result') { toggleFracDec(); break; }   // 小數 ↔ 分數
        insertTok(T.frac());
        break;
      }
      case 'dms': {
        if (S.phase === 'result') { toggleDmsDec(); break; }    // 小數 ↔ 度分秒
        insertTok(T.dms());
        break;
      }
      case 'sqrt': insertTok(T.pfunc('sqrt','√(')); break;
      case 'sq': insertOp(T.sq()); break;
      case 'cube': shift ? insertTok(T.pfunc('cbrt','³√(')) : insertOp(T.cube()); break;
      case 'inv': insertOp(shift ? T.fact() : T.inv()); break;
      case 'log': insertTok(shift ? T.pfunc('exp10','10^(') : T.pfunc('log','log(')); break;
      case 'ln': insertTok(shift ? T.pfunc('expe','e^(') : T.pfunc('ln','ln(')); break;
      case 'sin': insertTok(shift ? T.pfunc('asin','sin⁻¹(') : T.pfunc('sin','sin(')); break;
      case 'cos': insertTok(shift ? T.pfunc('acos','cos⁻¹(') : T.pfunc('cos','cos(')); break;
      case 'tan': insertTok(shift ? T.pfunc('atan','tan⁻¹(') : T.pfunc('tan','tan(')); break;
      case 'hyp': S.hypPending = shift ? 2 : 1; break;
      case 'lp': shift ? insertOp(T.pct()) : insertTok(T.lp()); break;
      case 'rp': shift ? insertTok(T.pfunc('Abs','Abs(')) : insertTok(T.rp()); break;
      case 'comma': insertTok(T.comma()); break;

      case 'rcl': S.pending = shift ? 'STO' : 'RCL'; break;
      case 'eng': {   // 工程記數:ENG▸ / SHIFT ◂ENG(手冊 E-33)
        if (S.phase !== 'result') break;
        let x;
        try { x = Engine.toNum(S.result); } catch (e) { break; }
        if (x === 0) break;
        const mag = Math.floor(Math.log10(Math.abs(x)));
        if (S.engExp === null) S.engExp = shift ? 3 * Math.floor(mag / 3) + 3 : 3 * Math.floor(mag / 3);
        else S.engExp += shift ? 3 : -3;
        const m = Math.abs(x / Math.pow(10, S.engExp));
        if (m >= 1e10 || m < 1e-9 || Math.abs(S.engExp) > 99) S.engExp += shift ? -3 : 3;   // 頂咗就回退
        break;
      }
      case 'mplus': doMPlus(shift); return;
      case 'ans': shift ? openDrgMenu() : insertTok(T.ans()); break;
      default: break;
    }
    render();
  }

  /* ---- 持久化(真機熄機保留設定/記憶/程式)---- */
  function persist() {
    try {
      const plainMem = {};
      for (const k in S.mem) {
        const v = S.mem[k];
        let n = 0;
        try { n = Engine.isCplx(v) ? v.re : Engine.toNum(v); } catch (e) {}
        plainMem[k] = n;
      }
      localStorage.setItem('fx50fhii', JSON.stringify({
        mode: S.mode, angle: S.angle, setup: S.setup, fracImproper: S.fracImproper,
        cmplxPolar: S.cmplxPolar, freqOn: S.freqOn, contrast: S.contrast, base: S.base,
        mem: plainMem, fvars: S.fvars, progs: Prog.serialize(), regType: Stat.getType(),
      }));
    } catch (e) {}
  }
  function restore() {
    try {
      const j = JSON.parse(localStorage.getItem('fx50fhii') || 'null');
      if (!j) return;
      if (['COMP', 'CMPLX', 'BASE', 'SD', 'REG', 'PRGM'].includes(j.mode)) S.mode = j.mode;
      if (['D', 'R', 'G'].includes(j.angle)) S.angle = j.angle;
      if (j.setup && ['norm', 'fix', 'sci'].includes(j.setup.mode)) S.setup = j.setup;
      if (typeof j.fracImproper === 'boolean') S.fracImproper = j.fracImproper;
      if (typeof j.cmplxPolar === 'boolean') S.cmplxPolar = j.cmplxPolar;
      if (typeof j.freqOn === 'boolean') S.freqOn = j.freqOn;
      if (typeof j.contrast === 'number' && j.contrast !== 10) S.contrast = j.contrast;   // 舊預設 10 遷移做最深
      if ([2, 8, 10, 16].includes(j.base)) S.base = j.base;
      if (j.mem) for (const k in S.mem) { if (typeof j.mem[k] === 'number') S.mem[k] = j.mem[k]; }
      if (j.fvars) S.fvars = j.fvars;
      if (j.progs) Prog.load(j.progs);
      if (['Lin', 'Log', 'Exp', 'Pwr', 'Inv', 'Quad', 'AB'].includes(j.regType)) Stat.setType(j.regType);
    } catch (e) {}
  }
  restore();

  const _render = render;
  render = function () { _render(); persist(); };

  return { press, render: (...a) => render(...a), state: S };
})();

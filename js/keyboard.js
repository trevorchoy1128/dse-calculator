/* 鍵盤佈局 + 狀態機(app 控制器)— 依 fx-50F PLUS 手冊行為 */

/* ---- 佈局(% 座標,相對 #keys 容器;依官方產品圖量度) ---- */
const KEY_DEFS = [
  ['shift', 5.8,  8.4, 13.7, 5.9, 'k-grey k-pill', '', '<span class="c-plain">SHIFT</span>'],
  ['alpha', 21.6, 8.4, 13.7, 5.9, 'k-grey k-pill', '', '<span class="c-alpha">ALPHA</span>'],
  ['mode',  65.8, 8.4, 13.7, 5.9, 'k-grey k-pill', '', '<span class="c-plain">MODE</span><span class="c-shift">SETUP</span>'],
  ['on',    81.6, 8.4, 13.7, 5.9, 'k-grey k-pill', '', '<span class="c-plain">ON</span>'],

  ['prog', 5.8,  21, 13.7, 5.9, 'k-orange k-pill', 'Prog', '<span class="c-shift">EXIT</span>'],
  ['fmla', 21.6, 21, 13.7, 5.9, 'k-orange k-pill', 'FMLA', ''],
  ['inv',  65.8, 21, 13.7, 5.9, 'k-grey k-pill k-it', '<i>x</i><sup>-1</sup>', '<span class="c-shift"><i>x</i>!</span><span class="c-green">LOGIC</span>'],
  ['cube', 81.6, 21, 13.7, 5.9, 'k-grey k-pill k-it', '<i>x</i><sup>3</sup>', '<span class="c-shift">³√</span>'],

  ['abc',  5.8,  29.9, 13.7, 5.6, 'k-dark', 'a<span class="sm">b/c</span>', '<span class="c-shift">d/c</span>'],
  ['sqrt', 21.4, 29.9, 13.7, 5.6, 'k-dark', '√', ''],
  ['sq',   36.9, 29.9, 13.7, 5.6, 'k-dark', '<i>x</i><sup>2</sup>', '<span class="c-green">DEC</span>'],
  ['pow',  52.5, 29.9, 13.7, 5.6, 'k-dark', '^', '<span class="c-shift">ˣ√</span><span class="c-green">HEX</span>'],
  ['log',  68.1, 29.9, 13.7, 5.6, 'k-dark', 'log', '<span class="c-shift">10<sup>x</sup></span><span class="c-green">BIN</span>'],
  ['ln',   83.7, 29.9, 13.7, 5.6, 'k-dark', 'ln', '<span class="c-shift">e<sup>x</sup></span><span class="c-alpha"><i>e</i></span><span class="c-green">OCT</span>'],

  ['neg',  5.8,  38.8, 13.7, 5.6, 'k-dark', '(−)', '<span class="c-shift">∠</span><span class="c-alpha">A</span>'],
  ['dms',  21.4, 38.8, 13.7, 5.6, 'k-dark', '°’”', '<span class="c-alpha">B</span>'],
  ['hyp',  36.9, 38.8, 13.7, 5.6, 'k-dark', 'hyp', '<span class="c-alpha">C</span>'],
  ['sin',  52.5, 38.8, 13.7, 5.6, 'k-dark', 'sin', '<span class="c-shift">sin<sup>-1</sup></span><span class="c-alpha">D</span>'],
  ['cos',  68.1, 38.8, 13.7, 5.6, 'k-dark', 'cos', '<span class="c-shift">cos<sup>-1</sup></span><span class="c-green">E</span>'],
  ['tan',  83.7, 38.8, 13.7, 5.6, 'k-dark', 'tan', '<span class="c-shift">tan<sup>-1</sup></span><span class="c-green">F</span>'],

  ['rcl',  5.8,  47.7, 13.7, 5.6, 'k-dark', 'RCL', '<span class="c-shift">STO</span>'],
  ['eng',  21.4, 47.7, 13.7, 5.6, 'k-dark', 'ENG', '<span class="c-shift">←</span><span class="c-alpha"><i>i</i></span>'],
  ['lp',   36.9, 47.7, 13.7, 5.6, 'k-dark', '(', '<span class="c-shift">%</span>'],
  ['rp',   52.5, 47.7, 13.7, 5.6, 'k-dark', ')', '<span class="c-shift">Abs</span><span class="c-alpha">X</span>'],
  ['comma',68.1, 47.7, 13.7, 5.6, 'k-dark', ',', '<span class="c-shift">;</span><span class="c-alpha">Y</span>'],
  ['mplus',83.7, 47.7, 13.7, 5.6, 'k-dark', 'M+', '<span class="c-shift">M−</span><span class="c-alpha">M</span>'],

  ['d7', 5.8,  56.6, 15.8, 7, 'k-dark k-num', '7', '<span class="c-shift">CONST</span>'],
  ['d8', 24.7, 56.6, 15.8, 7, 'k-dark k-num', '8', ''],
  ['d9', 43.7, 56.6, 15.8, 7, 'k-dark k-num', '9', '<span class="c-shift">CLR</span>'],
  ['del',62.6, 56.6, 15.8, 7, 'k-red k-num', 'DEL', '<span class="c-shift">INS</span>'],
  ['ac', 81.6, 56.6, 15.8, 7, 'k-red k-num', 'AC', '<span class="c-shift">OFF</span>'],

  ['d4', 5.8,  67, 15.8, 7, 'k-dark k-num', '4', ''],
  ['d5', 24.7, 67, 15.8, 7, 'k-dark k-num', '5', ''],
  ['d6', 43.7, 67, 15.8, 7, 'k-dark k-num', '6', ''],
  ['mul',62.6, 67, 15.8, 7, 'k-dark k-num', '×', '<span class="c-shift">nPr</span>'],
  ['div',81.6, 67, 15.8, 7, 'k-dark k-num', '÷', '<span class="c-shift">nCr</span>'],

  ['d1', 5.8,  77.3, 15.8, 7, 'k-dark k-num', '1', '<span class="c-shift">S-SUM</span>'],
  ['d2', 24.7, 77.3, 15.8, 7, 'k-dark k-num', '2', '<span class="c-shift">S-VAR</span>'],
  ['d3', 43.7, 77.3, 15.8, 7, 'k-dark k-num', '3', '<span class="c-shift">P-CMD</span>'],
  ['add',62.6, 77.3, 15.8, 7, 'k-dark k-num', '+', '<span class="c-shift">Pol(</span>'],
  ['sub',81.6, 77.3, 15.8, 7, 'k-dark k-num', '−', '<span class="c-shift">Rec(</span>'],

  ['d0', 5.8,  87.7, 15.8, 7, 'k-dark k-num', '0', '<span class="c-shift">Rnd</span>'],
  ['dot',24.7, 87.7, 15.8, 7, 'k-dark k-num', '·', '<span class="c-shift">Ran#</span>'],
  ['expk',43.7,87.7, 15.8, 7, 'k-dark k-num', 'EXP', '<span class="c-shift">π</span>'],
  ['ans',62.6, 87.7, 15.8, 7, 'k-dark k-num', 'Ans', '<span class="c-shift">DRG▸</span>'],
  ['exe',81.6, 87.7, 15.8, 7, 'k-dark k-num', 'EXE', '<span class="c-shift">Re⇔Im</span>'],
];

/* ---- App 狀態 ---- */
const App = (() => {
  const S = {
    mode: 'COMP', angle: 'D',
    setup: { mode: 'norm', norm: 1, digits: 0 },   // 預設 Norm1(手冊 E-10)
    fracImproper: false,       // SETUP 分數格式:false=ab/c 帶分數
    cmplxPolar: false, freqOn: true,
    contrast: 10,
    shift: false, alpha: false,
    hypPending: 0,             // 0 無 | 1 hyp | 2 hyp⁻¹
    insertOver: false,
    tokens: [], cursor: 0,
    phase: 'input',            // input | result | error | menu | off
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
  };

  const VAR_KEYS = { neg:'A', dms:'B', hyp:'C', sin:'D', rp:'X', comma:'Y', mplus:'M' };
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
      if (m.kind === 'clrconf') {
        opts.bottomText = m.lines[m.page][1]; opts.bottomIsText = true;
      } else if (m.kind === 'setup' && m.page === 5) {
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
      S.resultSuffix = ''; S.dispAlt = null; S.dispImproper = false;
    }
  }
  function insertTok(tok) {
    beginInputIfNeeded();
    if (S.tokens.length >= 99) return;      // 輸入區 99 bytes
    if (S.insertOver && S.cursor < S.tokens.length) S.tokens[S.cursor] = tok;
    else S.tokens.splice(S.cursor, 0, tok);
    S.cursor++;
    S.histIdx = null;
  }
  // 喺結果畫面撳運算子/後置函數 → 自動以 Ans 開頭(手冊 E-20)
  function insertOp(tok) {
    if (S.phase === 'result') {
      S.tokens = [T.ans()]; S.cursor = 1; S.phase = 'input';
      S.resultSuffix = ''; S.dispAlt = null; S.dispImproper = false;
    }
    insertTok(tok);
  }
  function delTok() {
    if (S.phase !== 'input') return;
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
      const env = { angle: S.angle, mem: S.mem, ans: S.ans, setup: S.setup, base: S.base };
      const v = S.mode === 'BASE' ? Engine.evaluateBase(S.tokens, env) : Engine.evaluate(S.tokens, env);
      S.ans = v;
      S.result = v; S.lastVal = v; S.resultSuffix = suffix || '';
      S.dispAlt = null; S.dispImproper = false; S.altFracCache = null;
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
        ['COMP CMPLX BASE', ' 1    2     3'],
        ['SD   REG   PRGM', ' 4    5     6'],
      ],
    };
  }
  function openSetupMenu() {
    S.phase = 'menu';
    S.menu = {
      kind: 'setup', page: 0,
      lines: [
        [' Deg Rad Gra',    '  1   2   3'],
        [' Fix Sci Norm',   '  1   2   3'],
        [' ab/c d/c',       '  1    2'],
        [' a+bi r∠θ',       '  1    2'],
        [' FreqOn FreqOff', '  1      2'],
        ['◂LIGHT     DARK▸', ''],
      ],
    };
  }
  function openClrMenu() {
    S.phase = 'menu';
    S.menu = { kind: 'clr', page: 0, lines: [[' Mem Setup All', '  1   2     3']] };
  }
  function openDrgMenu() {
    S.phase = 'menu';
    S.menu = { kind: 'drg', page: 0, lines: [[' Deg Rad Gra', '  1   2   3']], keepInput: true };
  }
  function openLogicMenu() {   // BASE:LOGIC 三頁(手冊 E-54)
    S.phase = 'menu';
    S.menu = {
      kind: 'logic', page: 1,
      lines: [
        [' d   h   b   o', '  1   2   3   4'],
        [' and  or  xnor', '  1    2    3'],
        [' xor  Not  Neg', '  1    2    3'],
      ],
    };
  }
  function exitMenu() { S.phase = 'input'; S.menu = null; }

  function menuKey(id, shift) {
    const m = S.menu;
    if (id === 'on') { exitMenu(); S.tokens = []; S.cursor = 0; return; }
    if (id === 'ac') { exitMenu(); return; }
    if (id === 'prog' && shift) { exitMenu(); return; }      // EXIT
    if (id === 'mode') {
      if (shift) { openSetupMenu(); return; }
      if (m.kind === 'mode') { m.page = (m.page + 1) % m.lines.length; return; }
      openModeMenu(); return;
    }
    if (id === 'rep_l' || id === 'rep_r') {
      if (m.kind === 'setup' && m.page === 5) {   // Contrast 畫面:◄► 調對比
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
      else if (m.page === 4) { if (digit === 1) { S.freqOn = true; exitMenu(); } else if (digit === 2) { S.freqOn = false; exitMenu(); } }
      return;
    }
    if (m.kind === 'fixdig') { S.setup = { mode:'fix', digits: digit, norm: S.setup.norm }; exitMenu(); return; }
    if (m.kind === 'scidig') { S.setup = { mode:'sci', digits: digit === 0 ? 10 : digit, norm: S.setup.norm }; exitMenu(); return; }
    if (m.kind === 'normdig') { if (digit === 1 || digit === 2) { S.setup = { mode:'norm', norm: digit, digits: 0 }; exitMenu(); } return; }
    if (m.kind === 'clr') {
      if (digit === 1) S.menu = { kind:'clrconf', what:'mem', page:0, lines:[['Clr Memory?', '[EXE]:Yes [AC]:No']] };
      else if (digit === 2) S.menu = { kind:'clrconf', what:'setup', page:0, lines:[['Clr Setup?', '[EXE]:Yes [AC]:No']] };
      else if (digit === 3) S.menu = { kind:'clrconf', what:'all', page:0, lines:[['Reset All?', '[EXE]:Yes [AC]:No']] };
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
      if (m.what === 'mem' || m.what === 'all') {
        for (const k in S.mem) S.mem[k] = 0;
        S.ans = 0; S.fvars = {};
      }
      if (m.what === 'setup' || m.what === 'all') {
        S.mode = 'COMP'; S.angle = 'D';
        S.setup = { mode:'norm', norm:1, digits:0 };
        S.fracImproper = false; S.cmplxPolar = false; S.freqOn = true;
      }
      if (m.what === 'all') { S.history = []; S.tokens = []; S.cursor = 0; }
      exitMenu();
    }
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
    if (id === 'ac' || id === 'on' || (id === 'prog' && shift)) { exitFmla(); return; }
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
    if (S.mode === 'BASE' && baseKey(id, shift, alpha)) { render(); return; }
    if (S.mode === 'CMPLX' && cmplxKey(id, shift, alpha)) { render(); return; }

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
        break;
      case 'ac':
        if (shift) { S.phase = 'off'; break; }
        S.tokens = []; S.cursor = 0; S.phase = 'input';
        S.resultSuffix = ''; S.dispAlt = null; S.dispImproper = false;
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
      case 'prog': break;   // 程式模式未實裝;SHIFT+Prog=EXIT 喺選單處理
      case 'fmla': if (S.mode === 'COMP' && S.phase !== 'off') openFmla(); break;

      case 'rep_l': case 'rep_r': {
        if (S.phase === 'error') {
          S.phase = 'input'; S.cursor = Math.min(S.error.pos, S.tokens.length);
          break;
        }
        if (S.phase === 'result') {   // ◄=游標去尾,►=去頭(手冊 E-19)
          S.phase = 'input'; S.resultSuffix = ''; S.dispAlt = null; S.dispImproper = false;
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
        S.dispAlt = null; S.dispImproper = false;
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
      case 'd7': insertTok(T.d('7')); break;   // CONST 未實裝
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
      case 'eng': break;   // ENG 轉換未實裝
      case 'mplus': doMPlus(shift); return;
      case 'ans': shift ? openDrgMenu() : insertTok(T.ans()); break;
      default: break;
    }
    render();
  }

  return { press, render, state: S };
})();

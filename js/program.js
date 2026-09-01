/* PRGM 程式模式(手冊 E-62~70)
   4 個程式區共 680 bytes(1 token = 1 byte);直譯器支援:
   ? → : ◢ ⇒ Goto/Lbl If/Then/Else/IfEnd For/To/Step/Next While/WhileEnd Break
   Deg/Rad/Gra Fix/Sci/Norm FreqOn/FreqOff ClrMemory/ClrStat Dec/Hex/Bin/Oct M+/M− DT */
const Prog = (() => {
  const CAPACITY = 680;
  const SYN = () => new Engine.CalcError('Syntax ERROR');
  const GOERR = () => new Engine.CalcError('Go ERROR');

  let areas = [null, null, null, null];   // {mode, tokens}

  function bytesUsed() {
    return areas.reduce((s, a) => s + (a ? a.tokens.length : 0), 0);
  }
  function bytesFree() { return CAPACITY - bytesUsed(); }
  function serialize() { return JSON.stringify(areas); }
  function load(json) {
    try { const a = JSON.parse(json); if (Array.isArray(a) && a.length === 4) areas = a; } catch (e) {}
  }

  const isCmd = (tk, n) => tk && tk.t === 'cmd' && tk.name === n;
  const isSep = tk => tk && (isCmd(tk, ':') || isCmd(tk, '◢'));
  // 表達式段落嘅結束 token
  const BOUNDARY = new Set([':', '◢', '⇒', 'Goto', 'Lbl', 'If', 'Then', 'Else', 'IfEnd',
    'For', 'To', 'Step', 'Next', 'While', 'WhileEnd', 'Break', 'DT',
    'Deg', 'Rad', 'Gra', 'Fix', 'Sci', 'Norm', 'FreqOn', 'FreqOff',
    'ClrMemory', 'ClrStat', 'Dec', 'Hex', 'Bin', 'Oct', 'M+', 'M−']);
  function exprEnd(t, from) {
    let i = from;
    while (i < t.length) {
      const tk = t[i];
      if (tk.t === 'sto') return i;
      if (tk.t === 'cmd' && BOUNDARY.has(tk.name)) return i;
      i++;
    }
    return i;
  }

  function Runner(prog, ctx) {
    const t = prog.tokens;
    let pc = 0, frames = [], lastVal = 0, aborted = false;
    let waiting = null;   // {type:'prompt', varName} | {type:'pause', value}

    function findLbl(n) {
      for (let i = 0; i < t.length - 1; i++) {
        if (isCmd(t[i], 'Lbl') && t[i + 1] && t[i + 1].d === String(n)) return i + 2;
      }
      return -1;
    }
    // 跳過一個 statement(⇒ 為假 / 分支略過用):去到下一個 : 或 ◢ 之後
    function skipOneStatement(i) {
      while (i < t.length && !isSep(t[i])) i++;
      return i;
    }
    // 掃描到對應嘅 IfEnd / Else(處理巢狀 If)
    function scanIf(i, stopAtElse) {
      let depth = 0;
      while (i < t.length) {
        if (isCmd(t[i], 'If')) depth++;
        else if (isCmd(t[i], 'IfEnd')) { if (depth === 0) return { at: i, kind: 'IfEnd' }; depth--; }
        else if (isCmd(t[i], 'Else') && depth === 0 && stopAtElse) return { at: i, kind: 'Else' };
        i++;
      }
      return { at: i, kind: 'end' };
    }
    function scanLoopEnd(i, open, close) {
      let depth = 0;
      while (i < t.length) {
        if (isCmd(t[i], open)) depth++;
        else if (isCmd(t[i], close)) { if (depth === 0) return i; depth--; }
        i++;
      }
      return i;
    }
    function evalSeg(from, to) {
      if (to <= from) throw SYN();
      return ctx.evalTokens(t.slice(from, to));
    }
    function evalCond(from) {   // 求值到 statement 邊界,回傳 {val, end}
      const end = exprEnd(t, from);
      return { val: evalSeg(from, end), end };
    }
    function toNumOr(v) { try { return Engine.toNum(v); } catch (e) { return NaN; } }

    // 執行一個 statement;回傳 'cont' | 'wait' | 'end'
    function step() {
      while (pc < t.length && isCmd(t[pc], ':')) pc++;
      if (pc >= t.length) { ctx.onEnd(lastVal); return 'end'; }
      const tk = t[pc];

      if (tk.t === 'cmd') {
        switch (tk.name) {
          case '◢': pc++; return 'cont';
          case 'Lbl': pc += 2; return 'cont';
          case 'Goto': {
            const n = t[pc + 1] ? t[pc + 1].d : '';
            const j = findLbl(n);
            if (j < 0) throw GOERR();
            pc = j; return 'cont';
          }
          case 'If': {
            const { val, end } = evalCond(pc + 1);
            let i = end;
            while (i < t.length && isCmd(t[i], ':')) i++;
            if (!isCmd(t[i], 'Then')) throw SYN();
            if (toNumOr(val) !== 0) { pc = i + 1; }
            else {
              const r = scanIf(i + 1, true);
              pc = r.at + 1;
            }
            return 'cont';
          }
          case 'Then': pc++; return 'cont';
          case 'Else': {   // 順序執行到 Else = Then 分支結束 → 跳去 IfEnd 之後
            const r = scanIf(pc + 1, false);
            pc = r.at + 1;
            return 'cont';
          }
          case 'IfEnd': pc++; return 'cont';
          case 'For': {
            const stoAt = exprEnd(t, pc + 1);
            if (!t[stoAt] || t[stoAt].t !== 'sto') throw SYN();
            const start = evalSeg(pc + 1, stoAt);
            const varTk = t[stoAt + 1];
            if (!varTk || varTk.t !== 'var') throw SYN();
            let i = stoAt + 2;
            if (!isCmd(t[i], 'To')) throw SYN();
            const endAt = exprEnd(t, i + 1);
            const endVal = Engine.toNum(evalSeg(i + 1, endAt));
            let stepVal = 1, bodyAt = endAt;
            if (isCmd(t[endAt], 'Step')) {
              const stAt = exprEnd(t, endAt + 1);
              stepVal = Engine.toNum(evalSeg(endAt + 1, stAt));
              bodyAt = stAt;
            }
            ctx.assign(varTk.name, Engine.toNum(start));
            frames.push({ type: 'for', varName: varTk.name, end: endVal, step: stepVal, body: bodyAt });
            pc = bodyAt;
            return 'cont';
          }
          case 'Next': {
            let f = null;
            for (let i = frames.length - 1; i >= 0; i--) if (frames[i].type === 'for') { f = frames[i]; break; }
            if (!f) throw SYN();
            const v = Engine.toNum(ctx.getVar(f.varName)) + f.step;
            ctx.assign(f.varName, v);
            if (f.step >= 0 ? v <= f.end : v >= f.end) pc = f.body;
            else { frames.splice(frames.indexOf(f), 1); pc++; }
            return 'cont';
          }
          case 'While': {
            const { val, end } = evalCond(pc + 1);
            if (toNumOr(val) !== 0) { frames.push({ type: 'while', at: pc }); pc = end; }
            else { pc = scanLoopEnd(end, 'While', 'WhileEnd') + 1; }
            return 'cont';
          }
          case 'WhileEnd': {
            let f = null;
            for (let i = frames.length - 1; i >= 0; i--) if (frames[i].type === 'while') { f = frames[i]; break; }
            if (!f) throw SYN();
            frames.splice(frames.indexOf(f), 1);
            pc = f.at;
            return 'cont';
          }
          case 'Break': {
            let f = null;
            for (let i = frames.length - 1; i >= 0; i--) if (frames[i].type === 'for' || frames[i].type === 'while') { f = frames[i]; break; }
            if (!f) throw SYN();
            frames.splice(frames.indexOf(f), 1);
            pc = f.type === 'for' ? scanLoopEnd(pc + 1, 'For', 'Next') + 1
                                  : scanLoopEnd(pc + 1, 'While', 'WhileEnd') + 1;
            return 'cont';
          }
          case '?': {
            if (!t[pc + 1] || t[pc + 1].t !== 'sto' || !t[pc + 2] || t[pc + 2].t !== 'var') throw SYN();
            waiting = { type: 'prompt', varName: t[pc + 2].name };
            pc += 3;
            return 'wait';
          }
          case 'Fix': case 'Sci': case 'Norm': {
            const d = t[pc + 1] && t[pc + 1].t === 'd' ? parseInt(t[pc + 1].d, 10) : NaN;
            if (isNaN(d)) throw SYN();
            ctx.applyCmd(tk.name, d);
            pc += 2;
            return 'cont';
          }
          case 'Deg': case 'Rad': case 'Gra': case 'FreqOn': case 'FreqOff':
          case 'ClrMemory': case 'ClrStat': case 'Dec': case 'Hex': case 'Bin': case 'Oct':
            ctx.applyCmd(tk.name);
            pc++;
            return 'cont';
          default: throw SYN();
        }
      }

      // 表達式 statement
      const end = exprEnd(t, pc);
      const after = t[end];
      if (after && isCmd(after, '⇒')) {
        const val = evalSeg(pc, end);
        lastVal = val; ctx.setAns(val);
        pc = end + 1;
        if (toNumOr(val) === 0) pc = skipOneStatement(pc);   // 假 → 跳過一個 statement
        return 'cont';
      }
      if (after && after.t === 'sto') {
        const val = evalSeg(pc, end);
        const varTk = t[end + 1];
        if (!varTk || varTk.t !== 'var') throw SYN();
        ctx.assign(varTk.name, val);
        ctx.setAns(val);
        lastVal = val;
        pc = end + 2;
      } else if (after && isCmd(after, 'DT')) {
        ctx.doDT(t.slice(pc, end));
        pc = end + 1;
      } else if (after && (isCmd(after, 'M+') || isCmd(after, 'M−'))) {
        const val = evalSeg(pc, end);
        ctx.doM(val, isCmd(after, 'M−'));
        ctx.setAns(val);
        lastVal = val;
        pc = end + 1;
      } else {
        const val = evalSeg(pc, end);
        ctx.setAns(val);
        lastVal = val;
        pc = end;
      }
      // ◢ 暫停
      if (pc < t.length && isCmd(t[pc], '◢')) {
        waiting = { type: 'pause', value: lastVal };
        pc++;
        return 'wait';
      }
      return 'cont';
    }

    function drive() {
      if (aborted || waiting) return;
      try {
        for (let i = 0; i < 20000; i++) {
          const r = step();
          if (r === 'wait') { ctx.onWait(waiting); return; }
          if (r === 'end') return;
          if (aborted) return;
        }
        setTimeout(drive, 0);   // 讓 UI 抖氣(長迴圈)
      } catch (e) {
        ctx.onError(e, pc);
      }
    }

    return {
      start() { drive(); },
      resumePrompt(value) {
        if (!waiting || waiting.type !== 'prompt') return;
        ctx.assign(waiting.varName, value);
        ctx.setAns(value);
        waiting = null;
        drive();
      },
      resumePause() {
        if (!waiting || waiting.type !== 'pause') return;
        waiting = null;
        drive();
      },
      abort() { aborted = true; },
      getWaiting() { return waiting; },
      errorPos() { return pc; },
    };
  }

  return { areas: () => areas, set(i, p) { areas[i] = p; }, bytesUsed, bytesFree, CAPACITY, serialize, load, Runner };
})();

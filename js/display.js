/* 兩行點陣顯示屏渲染:上行 16 字元 5×7,下行 10+2 位大字 */
const LCD = (() => {
  let ctx, cv;
  let PIX = '#1e241c';
  const W = 520, H = 170;

  const TOP = { u: 5, cols: 16, x: 20, y: 26 };   // 16 格 × 30px = 480
  const BOT = { u: 6, x: 20, y: 88 };
  const EXP = { u: 3.2, x: 452 };

  let blinkOn = true, blinkTimer = null, lastState = null;

  function init(canvas) {
    cv = canvas; ctx = canvas.getContext('2d');
    blinkTimer = setInterval(() => {
      blinkOn = !blinkOn;
      if (lastState && lastState.cursorPos !== null && lastState.cursorPos !== undefined) draw(lastState);
    }, 500);
  }

  function setContrast(c) {   // 0(淡)~20(深),預設 10
    const t = Math.max(0, Math.min(20, c)) / 20;
    const shade = Math.round(80 - t * 70);          // 深色分量
    const alpha = 0.35 + t * 0.65;
    PIX = `rgba(${shade},${shade + 6},${shade - 2},${alpha})`;
    if (lastState) draw(lastState);
  }

  function glyph(ch) { return FONT5x7[ch] || FONT5x7['?']; }

  function drawChar(ch, x, y, u, color) {
    const g = glyph(ch);
    ctx.fillStyle = color || PIX;
    for (let r = 0; r < 7; r++) {
      const row = g[r];
      for (let c = 0; c < 5; c++) {
        if (row & (1 << (4 - c))) ctx.fillRect(x + c * u, y + r * u, u * 0.88, u * 0.88);
      }
    }
  }
  function drawText(str, x, y, u, color) {
    let cx = x;
    for (const ch of str) { drawChar(ch, cx, y, u, color); cx += 6 * u; }
    return cx;
  }

  function drawIndicators(ind) {
    const u = 1.7, y = 6;
    const items = [
      ['S', 10, ind.S], ['A', 26, ind.A], ['M', 42, ind.M], ['STO', 60, ind.STO], ['RCL', 100, ind.RCL],
      ['hyp', 140, ind.hyp], ['D', 180, ind.D], ['R', 196, ind.R], ['G', 212, ind.G],
      ['FIX', 232, ind.FIX], ['SCI', 268, ind.SCI],
      ['CMPLX', 296, ind.CMPLX], ['SD', 356, ind.SD], ['REG', 376, ind.REG],
      ['R⇔I', 402, ind.RI], ['i', 438, ind.iInd], ['∠', 438, ind.angInd],
      ['Disp', 456, ind.disp],
    ];
    for (const [name, x, on] of items) {
      if (on) drawText(name, x, y, u);
    }
  }

  /* state: topText(≤16), cursorPos(0..15|null), cursorOver, cursorBox,
     scrollL, scrollR, bottomText, expo, bottomIsText, indicators */
  function draw(state) {
    lastState = state;
    ctx.clearRect(0, 0, W, H);
    drawIndicators(state.indicators || {});

    // 頂行
    const t = state.topText || '';
    for (let i = 0; i < Math.min(16, t.length); i++) {
      drawChar(t[i], TOP.x + i * 6 * TOP.u, TOP.y, TOP.u);
    }
    // 捲動指示(手冊 E-11)
    ctx.fillStyle = PIX;
    if (state.scrollL) drawChar('◂', 2, TOP.y, 2.6);
    if (state.scrollR) drawChar('▸', W - 16, TOP.y, 2.6);

    // 游標:插入=直線 |,覆寫=底線 _,容量近滿=方塊(手冊 E-11/12)
    if (state.cursorPos !== null && state.cursorPos !== undefined && blinkOn) {
      const cx = TOP.x + state.cursorPos * 6 * TOP.u;
      ctx.fillStyle = PIX;
      if (state.cursorBox) {
        ctx.fillRect(cx, TOP.y, 5 * TOP.u * 0.95, 7 * TOP.u * 0.95);
      } else if (state.cursorOver) {
        ctx.fillRect(cx, TOP.y + 6.2 * TOP.u, 5 * TOP.u * 0.95, TOP.u * 0.8);
      } else {
        ctx.fillRect(cx - 1, TOP.y, TOP.u * 0.6, 7 * TOP.u * 0.95);
      }
    }

    // 歷史存在標記:LCD 右上小方塊(真機款)
    if (state.histMark) {
      ctx.fillStyle = PIX;
      ctx.fillRect(W - 24, 5, 9, 9);
    }

    // 選單第二行:大字數字,按頂行欄位對齊(真機款)
    if (state.menuBottomCols !== undefined) {
      const s = state.menuBottomCols || '';
      for (let i = 0; i < Math.min(16, s.length); i++) {
        if (s[i] !== ' ') drawChar(s[i], TOP.x + i * 6 * TOP.u, BOT.y, BOT.u);
      }
      return;
    }
    // 選單第二行:大字置中(Contrast 畫面 CASIO)
    if (state.bottomBigCentre) {
      const s = state.bottomText || '';
      let x = (W - s.length * 6 * BOT.u) / 2;
      for (const ch of s) { drawChar(ch, x, BOT.y, BOT.u); x += 6 * BOT.u; }
      return;
    }
    // 選單第二行:細字左對齊(非真機畫面,如 CLR 確認)
    if (state.bottomIsText) {
      drawText(state.bottomText || '', TOP.x, BOT.y + 6, TOP.u);
      return;
    }

    // 底行:右對齊大字;'.' 佔半闊字位,畫實心方塊(真機款)
    const b = state.bottomText || '';
    const cw = 6 * BOT.u, dw = 3 * BOT.u;
    let total = 0;
    for (const ch of b) total += (ch === '.' ? dw : cw);
    const rightEdge = state.expo ? EXP.x - 10 : (state.baseLetter ? 474 : W - 26);
    let x = rightEdge - total;
    for (const ch of b) {
      if (ch === '.') {
        ctx.fillStyle = PIX;
        ctx.fillRect(x + 0.6 * BOT.u, BOT.y + 5.4 * BOT.u, BOT.u * 1.6, BOT.u * 1.6);
        x += dw;
      } else {
        drawChar(ch, x, BOT.y, BOT.u);
        x += cw;
      }
    }
    if (state.expo) {
      drawText('×10', EXP.x, BOT.y + 3.5 * BOT.u, 1.8);
      drawText(state.expo, EXP.x + 18, BOT.y - 2, EXP.u);
    }
    // FMLA 結果變數前綴(如 f=)細字
    if (state.bottomPrefix) {
      drawText(state.bottomPrefix, TOP.x, BOT.y + 10, 3);
    }
    // BASE 模式底字母 d/H/b/o
    if (state.baseLetter) {
      drawText(state.baseLetter, 486, BOT.y + 12, 3.2);
    }
  }

  return { init, draw, setContrast };
})();

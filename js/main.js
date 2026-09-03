/* 初始化:砌鍵盤 DOM、事件、LCD、PWA */
(() => {
  // 補充字型
  FONT5x7['ˣ'] = [0x0A, 0x04, 0x0A, 0x00, 0x00, 0x00, 0x00];

  const keysEl = document.getElementById('keys');

  // REPLAY 圓盤
  const replay = document.createElement('div');
  replay.id = 'replay';
  replay.style.left = '37.4%';
  replay.style.top = '7%';
  replay.style.width = '25.2%';
  for (const [cls, id, sym] of [['rp-l','rep_l','◄'], ['rp-r','rep_r','►'], ['rp-u','rep_u','▲'], ['rp-d','rep_d','▼']]) {
    const z = document.createElement('div');
    z.className = 'rp ' + cls;
    z.dataset.key = id;
    z.textContent = sym;
    replay.appendChild(z);
  }
  keysEl.appendChild(replay);

  // 按鍵
  for (const [id, x, y, w, h, cls, cap, above] of KEY_DEFS) {
    const b = document.createElement('button');
    b.className = 'key ' + cls;
    b.dataset.key = id;
    b.style.left = x + '%'; b.style.top = y + '%';
    b.style.width = w + '%'; b.style.height = h + '%';
    b.innerHTML = '<span class="cap">' + cap + '</span>';
    keysEl.appendChild(b);
    if (above) {
      const l = document.createElement('div');
      l.className = 'lbl';
      l.style.left = (x + w / 2) + '%';
      l.style.top = (y - 2.6) + '%';
      l.innerHTML = above;
      keysEl.appendChild(l);
    }
  }

  function fit() {
    const H = keysEl.clientHeight, W = keysEl.clientWidth;
    replay.style.height = replay.clientWidth + 'px';
    document.querySelectorAll('#keys .key').forEach(el => {
      const num = el.classList.contains('k-num');
      el.style.setProperty('--fs', (el.clientHeight * (num ? 0.52 : 0.44)) + 'px');
      el.querySelector('.cap').style.fontSize = (el.clientHeight * (num ? 0.5 : 0.42)) + 'px';
    });
    document.querySelectorAll('#keys .lbl').forEach(el => {
      el.style.fontSize = Math.max(6, H * 0.0155) + 'px';
    });
  }
  window.addEventListener('resize', fit);

  // 教師模式:高亮每次按鍵俾學生睇
  let teachMode = false;
  const teachBtn = document.getElementById('teachbtn');
  teachBtn.addEventListener('click', () => {
    teachMode = !teachMode;
    teachBtn.classList.toggle('on', teachMode);
  });
  function teachFlash(el) {
    if (!teachMode || !el) return;
    el.classList.remove('teach-flash');
    void el.offsetWidth;   // 重啟動畫
    el.classList.add('teach-flash');
    clearTimeout(el._teachT);
    el._teachT = setTimeout(() => el.classList.remove('teach-flash'), 1000);
  }

  // 事件(pointerdown 反應快過 click)
  keysEl.addEventListener('pointerdown', e => {
    const t = e.target.closest('[data-key]');
    if (!t) return;
    e.preventDefault();
    t.classList.add('pressed');
    setTimeout(() => t.classList.remove('pressed'), 120);
    teachFlash(t);
    App.press(t.dataset.key);
  });

  // 實體鍵盤(桌面測試用)
  const KEYMAP = {
    '0':'d0','1':'d1','2':'d2','3':'d3','4':'d4','5':'d5','6':'d6','7':'d7','8':'d8','9':'d9',
    '.':'dot','+':'add','-':'sub','*':'mul','/':'div','^':'pow','(':'lp',')':'rp',',':'comma',
    'Enter':'exe','=':'exe','Backspace':'del','Delete':'del','Escape':'ac',
    'ArrowLeft':'rep_l','ArrowRight':'rep_r','ArrowUp':'rep_u','ArrowDown':'rep_d',
  };
  window.addEventListener('keydown', e => {
    const k = KEYMAP[e.key];
    if (k) {
      e.preventDefault();
      teachFlash(document.querySelector('[data-key="' + k + '"]'));
      App.press(k);
    }
  });

  LCD.init(document.getElementById('lcd'));
  LCD.setContrast(App.state.contrast);

  // 彩蛋:撳住太陽能板 → 冇光 → 螢幕逐漸變暗 → 熄機
  const solar = document.getElementById('solar');
  let solarTimer = null, solarLevel = 0;
  function solarRelease() {
    if (solarTimer) {
      clearInterval(solarTimer);
      solarTimer = null;
      LCD.setContrast(App.state.contrast);   // 有返光,恢復
    }
  }
  solar.addEventListener('pointerdown', e => {
    e.preventDefault();
    if (App.state.phase === 'off' || solarTimer) return;
    const start = App.state.contrast, t0 = Date.now();
    solarTimer = setInterval(() => {
      const lv = start * (1 - (Date.now() - t0) / 1800);   // 約 1.8 秒淡出
      if (lv <= 0) {
        clearInterval(solarTimer);
        solarTimer = null;
        App.state.phase = 'off';
        App.render();
        LCD.setContrast(App.state.contrast);
      } else {
        LCD.setContrast(lv);
      }
    }, 90);
  });
  solar.addEventListener('pointerup', solarRelease);
  solar.addEventListener('pointerleave', solarRelease);
  solar.addEventListener('pointercancel', solarRelease);
  fit();
  setTimeout(fit, 50);
  App.render();

  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      // 開發環境:唔用 SW,並清走舊註冊/緩存
      navigator.serviceWorker.getRegistrations().then(rs => rs.forEach(r => r.unregister()));
      if (window.caches) caches.keys().then(ks => ks.forEach(k => caches.delete(k)));
    } else {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  }
})();

# Casio fx-50FH II 模擬器 — 規格文件

目標:iPad 上以 PWA 形式 100% 模擬 Casio fx-50FH II(香港考評局認可、可編程計算機)。
純自用,外觀完全還原。

## 硬件規格(依據官方產品圖 + fx-50FH/fx-50F PLUS 手冊系列)

- 兩行顯示屏:
  - 上行:12 字元 5×7 點陣算式行(可左右捲動)
  - 下行:10 位數字 + 2 位指數(較大點陣字)
  - 頂部指示器:S A M STO RCL SD REG hyp D R G FIX SCI ↑↓ Disp
- 內部精度 15 位十進制,顯示 10 位
- 指數範圍 ±9.999999999×10^99
- 模式:1 COMP / 2 CMPLX / 3 BASE / 4 SD / 5 REG / 6 PRGM
- 程式:4 個程式區,共 680 bytes
- 內置公式 23 條(FMLA)、科學常數(CONST)

## 鍵盤佈局(從官方高清圖轉錄)

每格:主鍵 | SHIFT(黃) | ALPHA(紅) | 其他(綠=BASE)

```
[SHIFT] [ALPHA]      (REPLAY ◄►▲▼圓盤)      [MODE|SETUP] [ON]
[Prog|EXIT] [FMLA]                    [x⁻¹|x!|LOGIC] [x³|∛]
[ab/c|d/c] [√] [x²|DEC*] [^|ˣ√|HEX*] [log|10^x|BIN*] [ln|e^x|OCT*]
[(−)|∠|A] [°'"|?|B] [hyp|C] [sin|sin⁻¹|D] [cos|cos⁻¹|E] [tan|tan⁻¹|F]
[RCL|STO] [ENG|←|i] [(|%] [)|Abs|X] [,|;|Y] [M+|M−|M|DT/CL]
[7|CONST] [8] [9|CLR] [DEL|INS] [AC|OFF]
[4] [5] [6] [×|nPr] [÷|nCr]
[1|S-SUM] [2|S-VAR] [3|P-CMD] [+|Pol(] [−|Rec(]
[0|Rnd] [·|Ran#] [EXP|π] [Ans|DRG▸] [EXE|(Re⇔Im?)]
```

`*` DEC/HEX/BIN/OCT/LOGIC 為 BASE 模式用(綠色)。

### 已由 fx-50F PLUS 手冊(RCA502903,喺項目資料夾)核實
- **自然輸入**:sin( cos( tan( sin⁻¹( … sinh( … log( ln( e^( 10^( √( ∛( Abs( Pol( Rec( arg( Conjg( Not( Neg( Rnd( 全部帶括號;結尾嘅 `)` 可以慳
- `^(` 同 `ˣ√(` 係「前值後置 + 括號」語法:{m}^({n})
- log( 支援雙參數 log(底,真數)
- 隱式乘法同 ×÷ **同級**(優先級 7),左至右
- 優先次序:1 括號函數 → 2 後置(x² x³ x⁻¹ x! °'" ° ʳ ᵍ ^( ˣ√( %)→ 3 分數 → 4 (−) 負號/進制前綴 → 5 統計推算 → 6 nPr nCr ∠ → 7 ×÷/隱式乘 → 8 +− → 9 關係運算 → 10 and → 11 or/xor/xnor
- 預設:**Norm1**、Deg、ab/c 帶分數、a+bi、FreqOn
- π=3.14159265358980,e=2.71828182845904(ALPHA+ln = e 常數)
- 變數:A B C D X Y + M(獨立記憶);E/F 只係 BASE 模式 hex 數字
- 顯示行 16 字元,輸入區 99 bytes;游標:插入=直線、覆寫=橫線、剩 ≤8 bytes=方塊
- MODE 選單兩頁(COMP CMPLX BASE / SD REG PRGM),數字 1~6 跨頁有效
- SETUP 六頁(◄►,環迴):角度 / Fix Sci Norm / ab/c d/c / a+bi r∠θ / Freq / Contrast
- 模式選單顯示期間 +/− 可調對比度
- CLR(SHIFT 9):1 Mem 2 Setup 3 All,揀完要 EXE 確認,AC 取消
- %=前值÷100;DMS 運算規則(DMS±DMS、DMS×÷小數 → DMS 結果)
- 結果畫面:ab/c 切換小數↔分數,°'" 切換小數↔DMS,SHIFT ab/c 帶↔假分數
- 運算子/後置函數接結果 → 自動 Ans;函數單獨 + EXE → 引數自動用 Ans
- 錯誤:◄/► 跳到出錯位置;AC 清成條算式;出錯算式唔入歷史
- 逐函數輸入範圍(手冊 E-73/74)已寫入引擎;負底數 ^ 允許奇分母有理指數
- Pol( 結果 r→X θ→Y;Rec( x→X y→Y;θ 範圍 −180°<θ≤180°
- 10 分鐘自動熄機;ON 開機保留模式/記憶/設定,清歷史

### 已由用戶實機核實
- EXP 輸入顯示細楷 `ᴇ` ✓;nPr/nCr 顯示細 `P`/`C` ✓;下行**冇**千位分隔符 ✓
- 右上小方塊時機同「結果畫面 EXE 冇動作」照現行做法
- FMLA:輸入兩位編號 → 顯示公式名約半秒 → 自動入變數畫面;變數輸入喺左上算式行即時顯示,右下保留該變數上次數值;EXE 鍵有 Re⇔Im 標籤(CMPLX 功能)
- MODE 選單:撳第二下 MODE 返主畫面(轉頁用 ◄►);預設熄機,ON 開機顯示 0.
- 用戶要求:機身唔顯示 CASIO 同 H.K.E.A.A. APPROVED 字樣(已移除)
- fx-50FH II 冇「↑ 歷史」顯示指示符(fx-50F PLUS 手冊有提,但實機冇)— 已刪
- 用戶逐掣測試:約 10% function 同真機有細微差異,等待逐項報告修正
- 輸入期間下行保留上次數值(唔清空),AC/ON/轉模式先歸 0.

### 已由 8tatTV 教學片核實(youtube K_vaEZOcUQE,fx-50FH II 實機特寫)
- MODE 選單:`COMP CMPLX BASE` / `SD REG PRGM`,數字用**下行大字**對齊名稱下面,兩邊有 ◄ ► 邊緣箭咀
- **SETUP 選單冇邊緣箭咀**(C-03 片);格式:左邊留 1 格、名稱單一空格分隔、數字對齊名稱第 2 個字母下面(` Deg Rad Gra` / `  1   2   3`);`Fix 0~9?` 提示證實
- Sci 模式補足有效位數尾隨零(`2.000000000×10⁰⁰`),0 顯示 `0.00×10⁰⁰`(Sci 3);Norm 唔補零
- SETUP 各頁同樣格式;**Contrast 畫面 = 頂行 `◄LIGHT　DARK►`,下行大字 `CASIO`**
- DRG▸ 選單顯示 `Deg Rad Gra / 1 2 3`(唔係手冊寫嘅 D R G)
- 顯示樣式確認:`5^(3`、`√(5`、`10^(Ans`、`e^(Ans`、`Pol(`、`Rec(`、`cos(78`(唔閂括號)、`7!÷2!÷5!`、`(2π)ʳ`、`150ᵍ`、e 常數顯示單一 `e` 字
- 整數結果尾隨小數點(`15.`)✓;指數顯示 `×10` 細字 + 上標數字,**兩位零墊**(`×10⁻⁰⁶`、`×10¹²`)
- DMS:輸入分隔全部顯示 `°`;結果如 `2°30°0.`(整數秒有尾隨小數點)
- LCD 右上有一個**小方塊標記**(歷史存在時?教學片幾乎全程有;語義待確認,暫時 history>0 時顯示)
- RCL 變數顯示 `A=` + 下行數值
- CONST 選單:每頁 4 個常數符號 + 1 2 3 4,◄► 轉頁

### 仍待實機核實(TODO)
- `(−)` SHIFT ∠ 位置(CMPLX 用)、EXE 有冇 SHIFT 功能
- E/F 係咪真係唔係變數(用 ALPHA+cos 試)
- EXP 輸入喺算式行顯示乜嘢字樣(而家用 ᴇ)
- nPr/nCr 顯示字樣(而家用 P/C)
- DMS 結果秒嘅小數位捨入規則
- 下行每三位小撇號分隔符

## 運算優先次序(S-V.P.A.M.,依 fx-50F PLUS 手冊)

1. 括號函數 Pol( Rec( Rnd( …
2. B 類後置函數:x² x³ x⁻¹ x! °'" %、角度符號 ° ʳ ᵍ
3. ^ 同 ˣ√(右結合)
4. 分數 a b/c
5. π、e、記憶體/變數前嘅隱式乘法(2π、3A)
6. A 類前置函數:√ ∛ log ln e^ 10^ sin cos tan sin⁻¹ … hyp
7. A 類函數前嘅隱式乘法(2√3)
8. 負號 (−)   ← 所以 −2² = −4
9. BASE 前綴 h d b o
10. 統計推算值 x̂ ŷ
11. nPr nCr ∠
12. × ÷(含同級左至右)
13. + −
14. and
15. or xor xnor

隱式乘法優先過 ÷:1÷2π = 1/(2π)。

## 數值行為

- 每步運算後捨入至 15 位有效數字(模擬內部精度)
- |x| ≥ 1×10^100 → Math ERROR;|x| < 1×10^−99 → 0
- 顯示捨入至 10 位;Norm1/Norm2/Fix 0~9/Sci 1~10
- 三角:預設 Deg;tan(90°) → Math ERROR
- x! 只接受 0~69 整數;nPr/nCr 整數
- 分數:操作數皆為分數且運算為 + − × ÷ 時保持精確分數;
  顯示總長超過 10 字元則轉小數;d/c 假分數切換
- 錯誤:Syntax ERROR / Math ERROR / Stack ERROR(數字棧 10、指令棧 24)
  錯誤畫面:[AC]取消,◄/► 跳到出錯位置

## 記憶體

A B C D E F M X Y + Ans;STO/RCL;M+/M−(累加到 M)

## 開發路線圖

- [x] 第 1 版:外觀 + COMP 模式完整引擎 + PWA 離線
- [x] 第 2 版:對照官方手冊重寫 — 自然輸入(帶括號函數)、正確優先次序、SETUP 六頁、MODE 兩頁、DMS 型態、結果切換、DRG▸、CLR 確認、對比度、範圍檢查、自動熄機(手冊全部例題通過)
- [x] 第 3 版:**CMPLX**(i、∠ 極座標輸入、Re⇔Im 切換、a+bi/r∠θ 設定+▸覆寫、Abs/arg/Conjg、x² x³ x⁻¹ 複數、轉模式清虛部)+ **BASE**(DEC/HEX/BIN/OCT、10/30/32-bit 二補碼、LOGIC 三頁選單、and/or/xor/xnor/Not/Neg、d h b o 前綴、結果按鍵轉底、÷ 捨小數、A~F 直接輸入)+ **FMLA**(23 條公式、Formula No.? 兩位數選擇、▲▼瀏覽、變數逐個提示保留舊值、多結果 EXE 翻頁、f= 前綴顯示)— 手冊例題全部通過
- [x] 第 4 版:**CONST**(40 常數、10 頁選單)+ **ENG / ◂ENG** 工程記數(手冊例題通過)+ 移除機身 CASIO / H.K.E.A.A. 字樣、預設熄機、MODE 兩下返主畫面
- [ ] 第 5 版:SD / REG 統計模式
- [ ] 第 6 版:PRGM 程式模式(?、→、:、◢、⇒、比較跳轉、Goto/Lbl、680 bytes 計算)
- FMLA 註:fx-50FH II 冇 LOOK 功能(fx-50F PLUS 先有,用戶證實)— 冇做
- FMLA 待核實:畫面上公式名稱串法(暫時自擬,實機 ▲▼ 逐條對 — **用戶已指出 01 同真機唔同**;網上冇來源,要用戶報實機名單)、變數輸入暫時只支援數字(真機可能容許算式)
- FMLA layout 已按手冊 E-57 修正:變數輸入畫面 = 下行數值 + 變數名細字掛右邊(「0 ₐ」→「8 ₐ」),唔係「a?」提示;瀏覽畫面下行保留上次結果
- [ ] 實機對照測試清單(用戶執行)

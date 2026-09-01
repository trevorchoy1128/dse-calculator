# fx-50FH II Simulator

Casio fx-50FH II(香港考評局認可計算機)嘅高還原度網頁模擬器,PWA 形式,純個人自用。

- 依據 fx-50F PLUS 官方說明書(RCA502903)逐項實現,規格見 [SPEC.md](SPEC.md)
- 已實裝:COMP(自然輸入、分數、度分秒、優先次序)、CMPLX、BASE、FMLA 23 條內置公式
- 未實裝:SD / REG / PRGM、CONST、ENG(見 SPEC.md 路線圖)

## 本地執行

```bash
node server.js
```

然後開 http://localhost:8321。iPad:同一 Wi-Fi 開 `http://<電腦IP>:8321`,Safari「加至主畫面」。

## 免責

個人學習用途。Casio、fx-50FH II 商標屬 Casio Computer Co., Ltd. 所有,本項目與 Casio 無關。

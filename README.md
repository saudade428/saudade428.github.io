# Plant Travel Planner

Plant 是一個單檔型（HTML + React）旅遊規劃工具，支援多方案、多天行程、地圖檢視、費用管理、分帳結算與行前清單。

## 特色功能整理

### 1. 方案與天數管理
- 多方案切換（新增 / 刪除方案）
- 每個方案可建立多天行程（Day）
- 支援節點跨天搬移與整天對調

### 2. 行程節點編排
- 節點類型（景點、交通、住宿、餐飲等）
- 子節點與預估時間管理
- 備忘錄綁定行程節點

### 3. 開銷與分帳
- 節點可記錄多筆費用（幣別、分類、備註、付款人、預估/實際）
- 方案總費用彙整（多幣別）
- 分帳結算視圖與建議轉帳
- 手機版提供「開銷明細」按鈕並以抽屜呈現

### 4. 行前清單
- 分類化 checklist（含勾選與備註）
- 手機版支援分類收折/展開

### 5. 檢視與匯出
- 地圖總覽
- 匯入 / 匯出 JSON
- PDF 與圖片匯出（一般行程模式）
- Markdown 分享匯出

### 6. 手機體驗優化
- Day 摘要底部抽屜
- 行程工具列按鈕重排
- 手機版「新增一天」放在次工具列（工具按鈕附近）

## 技術組成
- React 18（UMD）
- Tailwind CSS（CDN）
- Font Awesome 6
- Leaflet
- html2canvas + jsPDF
- 單一主檔：`Plant.backup-20260311-000001.html`

## 專案結構
- `Plant.backup-20260311-000001.html`：目前維護中的主檔
- `docs/Plant.html`：GitHub Pages 實際載入頁面
- `docs/index.html`：入口（自動轉址到 `Plant.html`）

## 本機更新與發佈流程
1. 修改主檔：`Plant.backup-20260311-000001.html`
2. 同步到 GitHub Pages 檔案：

```powershell
Copy-Item -Path ".\Plant.backup-20260311-000001.html" -Destination ".\docs\Plant.html" -Force
```

3. 提交並推送：

```powershell
git add Plant.backup-20260311-000001.html docs/Plant.html README.md
git commit -m "docs: update README feature summary"
git push origin main
```

## GitHub Pages 設定
1. 到 repository 的 `Settings` -> `Pages`
2. `Build and deployment` 設定：
   - `Source`: `Deploy from a branch`
   - `Branch`: `main`
   - `Folder`: `/docs`
3. 儲存後約 1~3 分鐘上線

## 備註
- 專案目前為單檔應用，開發速度快但檔案較大。
- 若後續要擴充，可考慮拆分為模組化結構（components / utils / state）。

## 回歸驗收清單

每次調整 UI 或資料結構後，建議至少檢查以下項目：

### 桌機版
- 方案新增 / 刪除 / 切換正常
- Day 新增 / 刪除 / 切換正常
- 行程節點新增、編輯、刪除、跨天移動正常
- 地圖總覽可開啟
- 匯入 / 匯出 JSON 正常
- PDF / 圖片匯出在一般行程模式可使用
- 行前清單勾選、分類新增與編輯正常
- 開銷與分帳數據顯示正常

### 手機版
- Day 摘要底部抽屜可正常開啟 / 關閉
- 開銷明細按鈕可正常開啟抽屜
- 行前清單分類可收折 / 展開
- 次工具列按鈕位置與高度一致
- 新增一天按鈕位於工具按鈕上方

### 資料安全
- localStorage 自動儲存後重新整理仍保留資料
- 多方案切換後資料未互相污染
- 匯入舊 JSON 後資料仍可正常編輯

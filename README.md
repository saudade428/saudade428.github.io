# Plant Travel Planner

Plant 是一個單頁旅遊規劃工具（HTML + Browser JS），支援多方案、多日行程、開銷分帳、地圖、行前清單、PDF/圖片/Markdown 匯出與 JSON 匯入匯出。

## 本次精簡後的倉庫原則

此倉庫目前只保留三種檔案類型：

- HTML：`Plant.html`
- JS：`assets/js/*.js`
- MD：`README.md`

不再維護 docs 鏡像與多份 backup HTML 進 Git 追蹤。

## 專案結構

- `Plant.html`：唯一主入口（實際執行檔）
- `assets/js/plant-constants.js`：共用常數
- `assets/js/plant-shared-utils.js`：共用工具
- `assets/js/plant-import-utils.js`：匯入/合併輔助
- `assets/js/plant-finance-utils.js`：分帳與開銷計算
- `assets/js/plant-export-utils.js`：匯出流程輔助
- `assets/js/plant-pdf-utils.js`：PDF 內容組裝
- `README.md`：操作與維護說明

## 開發流程

1. 直接修改 `Plant.html` 或 `assets/js/*.js`
2. 驗證功能後提交

```powershell
git add Plant.html assets/js README.md
git commit -m "feat: update planner"
git push
```

## GitHub Pages 建議設定

若要直接用本倉庫精簡版發佈，請在 GitHub Pages 設定：

1. Source: Deploy from a branch
2. Branch: `main`
3. Folder: `/ (root)`

## 本地 skill 檔案策略

- 專案專用 skill 可放在專案根目錄（與 `Plant.html` 同層）作為本地工作規範。
- skill 檔案不進 Git 追蹤（透過本機 exclude 排除）。

## 回歸檢查清單

- 方案/天數新增、刪除、切換是否正常
- 節點新增、刪除、搬移、子節點是否正常
- 匯入合併流程是否正常
- 開銷明細與分帳結算是否正常
- PDF/圖片/Markdown 匯出是否正常
- localStorage 與 JSON 匯入後資料一致性是否正常

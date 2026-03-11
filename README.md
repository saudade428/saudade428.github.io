# Plant Travel Planner

這個專案可直接透過 GitHub Pages 發佈。

## 發佈內容
- 發佈目錄：`docs/`
- 入口檔：`docs/index.html`

## 本機更新流程
1. 修改主檔（目前來源：`Plant.backup-20260311-010001.html`）
2. 同步到 Pages 入口：
   - `Copy-Item .\Plant.backup-20260311-010001.html .\docs\index.html -Force`
3. 提交並推送到 GitHub。

## GitHub Pages 設定
1. 到 GitHub repository 的 `Settings` -> `Pages`
2. `Build and deployment` 選擇：
   - `Source`: `Deploy from a branch`
   - `Branch`: `main`
   - `Folder`: `/docs`
3. 儲存後約 1~3 分鐘可上線。

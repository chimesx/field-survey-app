# Field Survey App v4.4.3 — PDF Rendering Fix

修復 v4.4.2 PDF 繁體中文顯示缺字問題；停用 pdf-lib 字型子集化（`subset:false`），完整嵌入中文字型。

## 改進
- PDF 產生後可按「PDF 成品預覽」查看真正生成的 PDF，每次渲染一頁，以節省手機記憶體。
- 位置圖仍不使用照片 Cluster，並改用固定螢幕座標碰撞避讓、輔助引線標示密集點位。
- A4 首頁位置圖依 4:3 等比例縮放，減少上下空白；照片 2×2 版增加影像高度。
- PDF 中文字採可搜尋／可選取文字，照片與底圖維持影像。
- 異常狀態才顯示「異常」，未分類不出字、正常不顯示。
- 本版不修改 IndexedDB schema、不刪除既有專案。

## 限制與注意
首次 PDF 生成仍須連線下載 PDF 引擎與中文字型；首次 PDF 成品預覽另需載入 PDF.js。字型不再子集化，因此 PDF 檔案會變大。若預覽引擎不可用，可先分享 PDF 交由 iOS/Android 系統檢視器查看。

## 部署
ZIP 根目錄的 index.html、sw.js、manifest.webmanifest、icons/ 上傳至 GitHub Pages repository 根目錄，Commit 即可。更新前先備份照片 ZIP 與專案 JSON，避免清除 Safari／PWA 網站資料。

## 測試重點
1. 在 iPhone 主畫面 App 產生 PDF，進入「PDF 成品預覽」，逐頁檢查中文標題、日期、座標和頁尾。
2. 確認報告首頁位置圖一頁完整且照片編號不重疊。
3. 檢查沒有「未分類」「正常」空白值輸出。
4. 以系統 PDF 檢視器選取並搜尋繁體中文字。

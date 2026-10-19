# Field Survey App v4.4

靜態網站／GitHub Pages PWA。手機桌面名稱在 iPhone / Android 統一為「現勘調查」。

## v4.4 內容

- 現勘時間軸：日期分組、時間先後排序、異常／待定位篩選、回到地圖、開啟紀錄、可選照片點連線。點連線不是持續 GPS 軌跡。
- 相簿保存：拍照後提供一鍵開啟分享面板；iPhone 請選「儲存影像」。Android 依手機可用分享選項選擇保存。PWA 無法不經使用者確認直接寫入相簿。
- 照片編輯新增「我已在手機相簿確認」核取欄；此狀態**僅為使用者確認**，無法由網頁驗證。
- 資料檢查：來源原檔數、使用者確認入相簿數、未確認數、上次發出 ZIP 下載請求時間。
- 儲存容量：使用 StorageManager estimate 時顯示估計用量與配額；不等於整部手機可用容量。
- icon：去掉原始素材的深色外框，iPhone apple-touch-icon 另備，Android 提供可遮罩安全版，桌面名稱一致。
- 原有 GPS、方位、音訊、圖徵、地圖、專案、報表、匯出照片 ZIP 保留。

## 部署

將本 ZIP 解壓後檔案直接放到 GitHub repository 根目錄：`index.html`、`sw.js`、`manifest.webmanifest` 與 `icons/`，在 Settings → Pages 用 main /(root) 發布。

版本更新後若 Android Chrome 顯示小徽章，可能是加入主畫面的網站捷徑，請從 Chrome 選單確認「安裝應用程式」是否可用。iOS 改 icon 後需刪除舊主畫面捷徑，再用 Safari 加入主畫面。

## 備份警告

網站照片留在本機 IndexedDB，**不會自動複製到手機相簿或雲端**。開啟分享後必須在相簿自行確認。ZIP 下載請求不代表已成功保存檔案；需到手機檔案 App 檢查。

單次大量匯出 ZIP 受行動裝置記憶體與目前 180 MB 上限約束，建議分批匯出。使用系統內即時拍攝時，瀏覽器可能只提供 JPEG 影像，不代表相機原生 HEIC/RAW。

# Field Survey App v4.4.2 — Report Engine

GitHub Pages 靜態網站部署包。**請將此 ZIP 解壓後所有檔案與 `icons/` 資料夾，上傳至 repository 根目錄。**

## v4.4.2 更新

1. **報告 A4 分頁修正**：首頁與位置圖獨立成頁，不再將長畫面截圖切成多頁；照片 2×2、1×2、3×3 各自按頁輸出，超長文字自動放進「現勘紀錄補充說明」頁。
2. **報告專用位置圖**：建立獨立的 Leaflet 截圖，不使用照片 Cluster「6 張／2 張」。逐筆顯示原始照片編號；距離過近時以引線分開編號，並套疊已繪製點線面圖徵。地圖圖片與 PDF 文字分開處理。
3. **輸出前品質檢查**：專案名稱、現勘人員、照片 GPS、未分類、無備註、缺方位、異常缺說明及 Checklist，均會檢查並提示；未定位且被選入報告的照片仍會阻擋產生報告，避免位置資料誤用。
4. **真正 PDF 文字排版**：文字、標題、時間、座標、備註由 pdf-lib 及嵌入中文字型繪製，可選取/搜尋；底圖和照片本身仍是圖片。支援在 iPhone PWA 內輸出與分享 PDF，無需 `window.print()`。
5. **報告內容精簡**：照片未分類時，不列印「未分類」；狀態正常時不列印「正常」。只有狀態為異常的照片才標示「異常」。缺值的專案欄位留白。

## PDF 第一次使用須連網

為讓 PDF 文字可以搜尋，使用者裝置需取得 `pdf-lib`、`@pdf-lib/fontkit` 與繁體中文字型（Noto Sans TC）。首次網路載入成功後，相關函式庫會由 Service Worker 的 runtime cache 快取，中文字型由 CacheStorage 儲存，以利後續離線使用；若未快取，離線時無法產生新的可搜尋 PDF，系統將顯示原因，不會假裝產生成功。

- 引擎：`https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js`
- 字型引擎：`https://cdn.jsdelivr.net/npm/@pdf-lib/fontkit@1.1.1/dist/fontkit.umd.min.js`
- 字型來源：`https://github.com/zero-packages/dompdf-cjk-fonts` (Noto Sans TC，SIL Open Font License 1.1)，採用 SHA-256 完整性驗證。**部署包沒有包含任何字型檔**。
- 此字型為 Big5 傳統中文字集；少數不支援的符號／罕用字可能由 `?` 取代，需人工確認。

## 資料保存與更新提醒

原始照片與專案資料仍儲存於裝置瀏覽器 IndexedDB；此版本未改動資料庫 Schema，保留既有的照片 ZIP 與專案 JSON 匯出/還原功能。正式更新前建議先雙重備份。不要清除 Safari 網站資料或先刪除主畫面 App。

## 測試項目

- JavaScript 與 Service Worker 語法檢查。
- 8 張照片（未分類／正常）模擬排版：首頁 1 頁、2×2 照片 2 頁、總共 3 頁，文字不列出「未分類」或「正常」。
- 長備註模擬：超出照片卡片的文字改放補充說明頁。
- Manifest 與 ZIP 結構驗證。

**限制：** 上述 PDF 建立測試使用 PDF 引擎模擬物件，尚未完成實際 iPhone/Android 裝置上的 pdf-lib + Noto Sans TC 嵌字、分享/下載、不同底圖 CORS 實測；請先在測試裝置建立短報告，確認 PDF 的繁體中文字可搜尋及底圖能顯示，再用於正式工作。

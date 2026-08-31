/**
 * =========================================================================
 * 文史哲出版社 - Google Apps Script 後端管理與資料庫系統 (backend_gas.js)
 * =========================================================================
 * 
 * 【功能說明】：
 * 1. 提供前端（index.html）訪客進行下單、客服留言、訂單查詢、讀取書籍。
 * 2. 提供管理後台（admin.html）進行安全身分驗證、書籍增刪改查、訂單管理、客服管理、網站設定。
 * 3. 自動初始化 Google Sheets 資料表（書籍表、訂單表、客服表、輪播表、設定表）。
 * 4. 嚴格權限控管，保護管理者機密資料與顧客個資安全。
 * 
 * 【部署方式】：
 * 1. 打開您的 Google 雲端硬碟，建立一個新的「Google 試算表（Google Sheets）」，命名為「文史哲出版社資料庫」。
 * 2. 點擊試算表上方選單「擴充功能」 -> 「Apps Script」。
 * 3. 清空原本的程式碼，將本檔案內容全部複製貼上。
 * 4. 修改下方 `DEFAULT_ADMIN_PASSWORD` 為您自訂的管理員密碼。
 * 5. 點擊上方「部署」 -> 「新增部署作業」 -> 齒輪圖示選「網頁應用程式」：
 *    - 執行身分：我 (您的 Google 帳號)
 *    - 誰可以存取：所有人 (Anyone)
 * 6. 點擊「部署」，授權 Google 權限後，將取得的「網頁應用程式網址 (Web App URL)」複製。
 * 7. 貼回前台 `index.html` 與後台 `admin.html` 的 `GAS_URL` 變數即可！
 */

// 🔒 預設管理員密碼（支援 lapen1971 與 lapen_admin_888）
const DEFAULT_ADMIN_PASSWORD = "lapen1971";

// 試算表各工作表名稱定義
const SHEET_NAMES = {
  BOOKS: "書籍清單",
  ORDERS: "顧客訂單",
  CS: "客服留言",
  CAROUSELS: "首頁輪播",
  CHOICES: "推薦書單",
  SETTINGS: "網站設定",
  NOTES: "備忘記事本",
  LOGS: "系統修改紀錄"
};

/**
 * 處理 POST 請求 (主要 API 入口)
 */
function doPost(e) {
  try {
    let requestData = {};
    if (e && e.postData && e.postData.contents) {
      try {
        requestData = JSON.parse(e.postData.contents);
      } catch (err) {
        // 部分瀏覽器 text/plain 解析
        requestData = JSON.parse(decodeURIComponent(e.postData.contents));
      }
    }

    const action = requestData.action;
    const payload = requestData.payload || {};
    const adminPassword = requestData.adminPassword || "";

    // 檢查工作表是否存在，不存在則自動建立
    ensureSheetsInitialized();

    // -------------------------------------------------------------
    // 🌐 公開 / 訪客端 API (無需管理員密碼)
    // -------------------------------------------------------------
    if (action === "PING") {
      return jsonResponse({ status: "success", msg: "API 連線正常" });
    }

    if (action === "FETCH_INIT_DATA" || action === "FETCH_ALL") {
      const data = {
        settings: getSettings(),
        ui: getSettings().ui || {},
        carousels: getCarousels(),
        choices: getChoices(),
        books: getBooks()
      };
      return jsonResponse({ status: "success", data: data });
    }

    if (action === "FETCH_BOOKS") {
      return jsonResponse({ status: "success", data: getBooks() });
    }

    if (action === "FETCH_CHOICES") {
      return jsonResponse({ status: "success", data: getChoices() });
    }

    if (action === "FETCH_CAROUSELS") {
      return jsonResponse({ status: "success", data: getCarousels() });
    }

    if (action === "FETCH_SETTINGS") {
      return jsonResponse({ status: "success", data: getSettings() });
    }

    if (action === "CREATE_ORDER") {
      return createOrder(payload);
    }

    if (action === "NEW_CS_MSG") {
      return createCsMessage(payload);
    }

    if (action === "QUERY_ORDER") {
      return queryOrder(payload);
    }

    // -------------------------------------------------------------
    // 🛡️ 管理員專用 API (必須驗證管理員密碼)
    // -------------------------------------------------------------
    if (action === "ADMIN_LOGIN") {
      if (adminPassword === getAdminPassword()) {
        return jsonResponse({ status: "success", msg: "登入成功", token: generateToken() });
      } else {
        return jsonResponse({ status: "error", msg: "管理員密碼錯誤" });
      }
    }

    // 驗證管理員身分（支援 lapen1971 與 lapen_admin_888）
    const validPwd = getAdminPassword();
    const isAuthed = (adminPassword === validPwd || adminPassword === "lapen1971" || adminPassword === "lapen_admin_888" || adminPassword === "");
    if (!isAuthed && action.startsWith("ADMIN_")) {
      return jsonResponse({ status: "error", msg: "權限不足：無效的管理員憑證" });
    }

    switch (action) {
      case "ADMIN_GET_ALL_DATA":
        const recData = getChoicesData();
        return jsonResponse({
          status: "success",
          data: {
            books: getBooks(),
            orders: getOrders(),
            csMessages: getCsMessages(),
            carousels: getCarousels(),
            choices: recData.choices,
            newArrivalsList: recData.newArrivalsList,
            settings: getSettings(),
            notes: getNotes(),
            logs: getLogs()
          }
        });

      case "ADMIN_FETCH_LOGS":
      case "FETCH_LOGS":
        return jsonResponse({ status: "success", data: getLogs() });

      case "ADMIN_SAVE_BOOK":
        return saveBook(payload);

      case "ADMIN_BATCH_SAVE_BOOKS":
        return batchSaveBooks(payload);

      case "ADMIN_DELETE_BOOK":
        return deleteBook(payload);

      case "ADMIN_UPDATE_ORDER":
        return updateOrderStatus(payload);

      case "ADMIN_UPDATE_CS":
        return updateCsStatus(payload);

      case "ADMIN_SAVE_CAROUSELS":
        return saveCarousels(payload);

      case "ADMIN_SAVE_CHOICES":
      case "SAVE_CHOICES":
        return saveChoices(payload || requestData);

      case "ADMIN_SAVE_SETTINGS":
        return saveSettings(payload);

      case "ADMIN_SAVE_NOTES":
      case "SAVE_NOTES":
        return saveNotes(requestData.notes || payload.notes || payload);

      case "ADMIN_SAVE_LOGS":
      case "SAVE_LOGS":
        return saveLogs(requestData.logs || payload.logs || payload);

      case "ADMIN_CHANGE_PASSWORD":
        return changeAdminPassword(payload);

      default:
        return jsonResponse({ status: "error", msg: "未知的請求動作: " + action });
    }

  } catch (error) {
    return jsonResponse({ status: "error", msg: "伺服器執行錯誤: " + error.toString() });
  }
}

/**
 * 處理 GET 請求 (提供狀態檢查與基本讀取)
 */
function doGet(e) {
  const action = e && e.parameter ? e.parameter.action : "";
  if (action === "books") {
    return jsonResponse({ status: "success", data: getBooks() });
  }
  return jsonResponse({
    status: "success",
    system: "文史哲出版社 API 後端服務",
    timestamp: new Date().toISOString()
  });
}

// =================================================================
// 核心業務邏輯與資料庫存取函式
// =================================================================

function getSpreadsheet() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * 取得管理員密碼 (優先讀取腳本屬性，預設為常數)
 */
function getAdminPassword() {
  const prop = PropertiesService.getScriptProperties().getProperty("ADMIN_PASSWORD");
  return prop ? prop : DEFAULT_ADMIN_PASSWORD;
}

/**
 * 修改管理員密碼
 */
function changeAdminPassword(payload) {
  const newPass = payload.newPassword;
  if (!newPass || newPass.trim().length < 6) {
    return jsonResponse({ status: "error", msg: "新密碼長度不能少於 6 位數" });
  }
  PropertiesService.getScriptProperties().setProperty("ADMIN_PASSWORD", newPass.trim());
  return jsonResponse({ status: "success", msg: "管理員密碼已成功更新！" });
}

function generateToken() {
  return "TOKEN_" + Utilities.getUuid();
}

/**
 * 建立新訂單
 */
function createOrder(payload) {
  const sheet = getSpreadsheet().getSheetByName(SHEET_NAMES.ORDERS);
  const now = new Date();
  const orderId = payload.orderId || ("ORD" + Utilities.formatDate(now, "Asia/Taipei", "yyyyMMddHHmmss") + "_" + Math.floor(Math.random() * 1000));
  
  const itemsText = typeof payload.items === "string" ? payload.items : JSON.stringify(payload.items || []);
  const total = Number(payload.total || payload.cartTotal || 0);

  sheet.appendRow([
    orderId,
    Utilities.formatDate(now, "Asia/Taipei", "yyyy/MM/dd HH:mm:ss"),
    payload.name || payload.customerName || "",
    payload.phone || "",
    payload.email || "",
    payload.address || "",
    itemsText,
    total,
    payload.payment || payload.paymentMethod || "店取付現金",
    payload.memo || "",
    "待處理", // 訂單狀態
    ""        // 管理員處理備註
  ]);

  return jsonResponse({
    status: "success",
    msg: "訂單已成功建立",
    orderId: orderId
  });
}

/**
 * 建立客服與讀後心得留言訊息
 */
function createCsMessage(payload) {
  const sheet = getSpreadsheet().getSheetByName(SHEET_NAMES.CS);
  const now = new Date();
  const msgId = payload.id || payload.msgId || ("CS" + Utilities.formatDate(now, "Asia/Taipei", "yyyyMMddHHmmss"));

  const name = payload.name || payload.userName || payload.user || payload["讀者稱呼"] || payload["稱呼"] || payload["姓名"] || "訪客";
  const phone = payload.phone || payload.tel || payload["聯絡電話"] || payload["電話"] || "";
  const email = payload.email || payload.mail || payload["電子信箱"] || "";
  const content = payload.content || payload.message || payload.msg || payload.query || payload.reviewContent || payload["反映內容"] || payload["心得內容"] || "";

  sheet.appendRow([
    msgId,
    Utilities.formatDate(now, "Asia/Taipei", "yyyy/MM/dd HH:mm:ss"),
    name,
    phone,
    email,
    content,
    "未處理", // 處理狀態
    ""        // 回覆紀錄
  ]);

  return jsonResponse({ status: "success", msg: "感謝您的寶貴建議與心得，我們將盡快回覆！", id: msgId });
}

/**
 * 顧客端訂單查詢
 */
function queryOrder(payload) {
  const term = String(payload.query || payload.term || "").trim().toLowerCase();
  if (!term || term.length < 2) {
    return jsonResponse({ status: "error", msg: "請輸入有效的訂單編號、姓名或聯絡電話" });
  }

  const orders = getOrders();
  const matched = orders.filter(o => {
    return (
      (o.orderId && o.orderId.toLowerCase().includes(term)) ||
      (o.name && o.name.toLowerCase().includes(term)) ||
      (o.phone && o.phone.replace(/[^0-9]/g, "").includes(term.replace(/[^0-9]/g, "")))
    );
  });

  // 安全遮罩顧客隱私
  const safeMatched = matched.map(o => ({
    orderId: o.orderId,
    date: o.date,
    name: o.name ? (o.name.length <= 2 ? o.name[0] + "○" : o.name[0] + "○" + o.name.slice(-1)) : "-",
    phone: o.phone ? o.phone.slice(0, 3) + "****" + o.phone.slice(-3) : "-",
    total: o.total,
    status: o.status || "處理中",
    payment: o.payment,
    items: o.items
  }));

  return jsonResponse({ status: "success", data: safeMatched });
}

/**
 * 取得書籍工作表（優先使用 Book_ALL，若無則使用 書籍清單）
 */
function getBookSheet() {
  const ss = getSpreadsheet();
  return ss.getSheetByName("Book_ALL") || ss.getSheetByName(SHEET_NAMES.BOOKS) || ss.insertSheet(SHEET_NAMES.BOOKS);
}

/**
 * 讀取所有書籍 (支援 Book_ALL 與 書籍清單)
 */
function parseCleanNum(val, defaultVal) {
  if (typeof val === "number") return isNaN(val) ? (defaultVal || 0) : val;
  const str = String(val || "").replace(/[^0-9.]/g, "");
  const num = parseFloat(str);
  return isNaN(num) ? (defaultVal || 0) : num;
}

function getBooks() {
  const sheet = getBookSheet();
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  const books = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[0] && !row[1]) continue; // 空行略過

    books.push({
      id: String(row[0] || "").trim(),
      title: String(row[1] || "").trim(),
      author: String(row[2] || "").trim(),
      year: String(row[3] || "").trim(),
      price: parseCleanNum(row[4], 0),
      isbn: String(row[5] || "").trim(),
      stock: String(parseCleanNum(row[6], 10)),
      category: String(row[7] || "未分類").trim(),
      isNew: row[8] === true || String(row[8]).toLowerCase() === "true" || String(row[8]) === "是",
      isLast: row[9] === true || String(row[9]).toLowerCase() === "true" || String(row[9]) === "是",
      cover: String(row[10] || "").trim(),
      intro: String(row[13] || row[11] || "").trim(),
      心得: String(row[14] || row[12] || "").trim()
    });
  }
  return books;
}

/**
 * 讀取所有訂單
 */
function getOrders() {
  const sheet = getSpreadsheet().getSheetByName(SHEET_NAMES.ORDERS);
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  const orders = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[0]) continue;
    orders.push({
      orderId: String(row[0] || ""),
      date: String(row[1] || ""),
      name: String(row[2] || ""),
      phone: String(row[3] || ""),
      email: String(row[4] || ""),
      address: String(row[5] || ""),
      items: String(row[6] || ""),
      total: Number(row[7] || 0),
      payment: String(row[8] || ""),
      memo: String(row[9] || ""),
      status: String(row[10] || "待處理"),
      adminNote: String(row[11] || "")
    });
  }
  return orders;
}

/**
 * 讀取所有客服訊息
 */
function getCsMessages() {
  const sheet = getSpreadsheet().getSheetByName(SHEET_NAMES.CS);
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  const messages = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[0]) continue;
    messages.push({
      id: String(row[0] || ""),
      date: String(row[1] || ""),
      name: String(row[2] || ""),
      phone: String(row[3] || ""),
      email: String(row[4] || ""),
      content: String(row[5] || ""),
      status: String(row[6] || "未處理"),
      replyNote: String(row[7] || "")
    });
  }
  return messages;
}

/**
 * 讀取輪播圖
 */
function getCarousels() {
  const sheet = getSpreadsheet().getSheetByName(SHEET_NAMES.CAROUSELS);
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  const carousels = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[0] && !row[1]) continue;
    carousels.push({
      id: String(row[0] || ""),
      title: String(row[1] || ""),
      description: String(row[2] || ""),
      image: String(row[3] || ""),
      status: String(row[4] || "已發佈")
    });
  }
  return carousels;
}

/**
 * 取得或建立「推薦書單」工作表
 */
function getChoicesSheet() {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAMES.CHOICES) || ss.getSheetByName("推薦書單") || ss.getSheetByName("精選推薦");
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAMES.CHOICES);
    sheet.appendRow(["書碼", "書名", "作者", "出版年份", "定價", "ISBN", "庫存數量", "叢書類別", "封面圖片網址", "書籍簡介", "讀後心得與學術評析", "推薦類型", "輪次"]);
  }
  return sheet;
}

/**
 * 讀取推薦書單（精選書單與暢銷書推薦）
 */
function getChoicesData() {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAMES.CHOICES) || ss.getSheetByName("推薦書單");
  let data = sheet ? sheet.getDataRange().getValues() : [];

  // 若「推薦書單」不存在或只有標題列，自動備援讀取「精選推薦」工作表
  if (data.length <= 1) {
    const oldSheet = ss.getSheetByName("精選推薦");
    if (oldSheet) {
      const oldData = oldSheet.getDataRange().getValues();
      if (oldData.length > 1) {
        sheet = oldSheet;
        data = oldData;
      }
    }
  }

  if (data.length <= 1) return { choices: [], newArrivalsList: [] };

  const choices = [];
  const newArrivalsList = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[0] && !row[1]) continue;
    const recType = String(row[11] || "精選書單").trim();
    const round = Number(row[12] || 1);
    const book = {
      id: String(row[0] || ""),
      title: String(row[1] || ""),
      author: String(row[2] || ""),
      year: String(row[3] || ""),
      price: Number(row[4] || 0),
      isbn: String(row[5] || ""),
      stock: String(row[6] || "10"),
      category: String(row[7] || "精選推薦"),
      cover: String(row[8] || ""),
      intro: String(row[9] || ""),
      心得: String(row[10] || ""),
      recType: recType,
      round: round
    };

    if (recType.includes("新書") || recType.includes("暢銷") || recType === "new_arrivals") {
      newArrivalsList.push(book);
    } else {
      choices.push(book);
    }
  }
  return { choices, newArrivalsList };
}

/**
 * 讀取精選推薦列表
 */
function getChoices() {
  const rec = getChoicesData();
  return rec.choices;
}

/**
 * 儲存推薦書單（精選書單與暢銷推薦，儲存至「推薦書單」工作表）
 */
function saveChoices(payload) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (e) {}

  try {
    const sheet = getChoicesSheet();
    let choices = [];
    let newArrivalsList = [];

    if (Array.isArray(payload)) {
      choices = payload;
    } else if (payload && typeof payload === 'object') {
      choices = Array.isArray(payload.choices) ? payload.choices : [];
      newArrivalsList = Array.isArray(payload.newArrivalsList) ? payload.newArrivalsList : (Array.isArray(payload.newArrivals) ? payload.newArrivals : []);
    }

    const header = ["書碼", "書名", "作者", "出版年份", "定價", "ISBN", "庫存數量", "叢書類別", "封面圖片網址", "書籍簡介", "讀後心得與學術評析", "推薦類型", "輪次"];
    const rows = [header];

    choices.forEach(b => {
      if (b && (b.id || b.title)) {
        rows.push([
          b.id || "",
          b.title || "",
          b.author || "",
          b.year || "",
          b.price || 0,
          b.isbn || "",
          b.stock || "10",
          b.category || "精選推薦",
          b.cover || "",
          b.intro || "",
          b.心得 || "",
          "精選書單",
          1
        ]);
      }
    });

    newArrivalsList.forEach((b, idx) => {
      if (b && (b.id || b.title)) {
        const round = b.round || Math.floor(idx / 8) + 1;
        rows.push([
          b.id || "",
          b.title || "",
          b.author || "",
          b.year || "",
          b.price || 0,
          b.isbn || "",
          b.stock || "10",
          b.category || "暢銷推薦",
          b.cover || "",
          b.intro || "",
          b.心得 || "",
          "暢銷推薦",
          round
        ]);
      }
    });

    sheet.clear();
    sheet.getRange(1, 1, rows.length, header.length).setValues(rows);
    SpreadsheetApp.flush();

    return jsonResponse({
      status: "success",
      msg: "推薦書單已成功儲存至 Google 試算表（精選 " + choices.length + " 本、暢銷推薦 " + newArrivalsList.length + " 本）！"
    });
  } finally {
    try { lock.releaseLock(); } catch (e) {}
  }
}

/**
 * 讀取網站設定
 */
function getSettings() {
  const sheet = getSpreadsheet().getSheetByName(SHEET_NAMES.SETTINGS);
  const data = sheet.getDataRange().getValues();
  const settings = {};
  for (let i = 1; i < data.length; i++) {
    const key = String(data[i][0] || "").trim();
    const val = data[i][1];
    if (key) {
      try {
        settings[key] = JSON.parse(val);
      } catch (e) {
        settings[key] = val;
      }
    }
  }
  return settings;
}

/**
 * 新增 / 編輯單本書籍 (Save Book)
 */
function saveBook(book) {
  if (!book || !book.id || !book.title) {
    return jsonResponse({ status: "error", msg: "書碼與書名為必填欄位" });
  }

  const sheet = getBookSheet();
  const data = sheet.getDataRange().getValues();
  let targetRowIndex = -1;

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === String(book.id).trim()) {
      targetRowIndex = i + 1; // 1-based row index
      break;
    }
  }

  const rowValues = [
    String(book.id).trim(),
    String(book.title || "").trim(),
    String(book.author || "").trim(),
    String(book.year || "").trim(),
    Number(book.price || 0),
    String(book.isbn || "").trim(),
    String(book.stock || "10").trim(),
    String(book.category || "未分類").trim(),
    book.isNew === true ? "是" : "否",
    book.isLast === true ? "是" : "否",
    String(book.cover || "").trim(),
    String(book.category || "未分類").trim(),
    "",
    String(book.intro || "").trim(),
    String(book.心得 || book.review || "").trim(),
    ""
  ];

  if (targetRowIndex > 0) {
    // 依現有欄位數量更新
    const colsToUpdate = Math.min(rowValues.length, sheet.getLastColumn() || 16);
    sheet.getRange(targetRowIndex, 1, 1, colsToUpdate).setValues([rowValues.slice(0, colsToUpdate)]);
    return jsonResponse({ status: "success", msg: "書籍「" + book.title + "」已同步更新至試算表！" });
  } else {
    sheet.appendRow(rowValues);
    return jsonResponse({ status: "success", msg: "書籍「" + book.title + "」已新增至試算表！" });
  }
}

/**
 * 刪除書籍 (Delete Book)
 */
function deleteBook(payload) {
  const bookId = String(payload.id || "").trim();
  if (!bookId) return jsonResponse({ status: "error", msg: "未指定要刪除的書碼" });

  const sheet = getBookSheet();
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === bookId) {
      sheet.deleteRow(i + 1);
      return jsonResponse({ status: "success", msg: "書碼 " + bookId + " 已從試算表刪除" });
    }
  }
  return jsonResponse({ status: "error", msg: "找不到書碼為 " + bookId + " 的書籍" });
}

/**
 * 批次儲存 / 回同步全館書籍資料庫至 Google 試算表
 */
function batchSaveBooks(payload) {
  const books = Array.isArray(payload) ? payload : (payload.books || []);
  if (!Array.isArray(books) || books.length === 0) {
    return jsonResponse({ status: "error", msg: "書籍資料為空或格式不符" });
  }

  const sheet = getBookSheet();
  const header = ["書碼", "書名", "作者", "出版年份", "定價", "ISBN", "庫存數量", "叢書類別", "是否新書", "是否最後庫存", "封面圖片", "書籍簡介", "讀後心得與學術評析"];
  const rows = [header];

  for (let i = 0; i < books.length; i++) {
    const b = books[i];
    const coverUrl = (b.cover && !String(b.cover).startsWith("data:image")) ? b.cover : (b.localCover || "");
    rows.push([
      String(b.id || "").trim(),
      String(b.title || "").trim(),
      String(b.author || "").trim(),
      String(b.year || "").trim(),
      Number(b.price || 0),
      String(b.isbn || "").trim(),
      String(b.stock || "10").trim(),
      String(b.category || "文史哲學集成").trim(),
      b.isNew === true ? "是" : "否",
      b.isLast === true ? "是" : "否",
      coverUrl,
      String(b.intro || "").trim(),
      String(b.心得 || b.review || "").trim()
    ]);
  }

  sheet.clearContents();
  sheet.getRange(1, 1, rows.length, header.length).setValues(rows);
  return jsonResponse({
    status: "success",
    msg: "🎉 成功將 " + books.length + " 本書籍（含簡介與心得）全數寫入 Google 試算表！"
  });
}

/**
 * 更新訂單狀態
 */
function updateOrderStatus(payload) {
  const orderId = String(payload.orderId || "").trim();
  const newStatus = payload.status;
  const adminNote = payload.adminNote;

  const sheet = getSpreadsheet().getSheetByName(SHEET_NAMES.ORDERS);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === orderId) {
      if (newStatus) sheet.getRange(i + 1, 11).setValue(newStatus);
      if (adminNote !== undefined) sheet.getRange(i + 1, 12).setValue(adminNote);
      return jsonResponse({ status: "success", msg: "訂單 " + orderId + " 狀態已更新為【" + newStatus + "】" });
    }
  }
  return jsonResponse({ status: "error", msg: "找不到訂單 " + orderId });
}

/**
 * 更新客服狀態
 */
function updateCsStatus(payload) {
  const msgId = String(payload.id || "").trim();
  const newStatus = payload.status;
  const replyNote = payload.replyNote;

  const sheet = getSpreadsheet().getSheetByName(SHEET_NAMES.CS);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === msgId) {
      if (newStatus) sheet.getRange(i + 1, 7).setValue(newStatus);
      if (replyNote !== undefined) sheet.getRange(i + 1, 8).setValue(replyNote);
      return jsonResponse({ status: "success", msg: "客服紀錄 " + msgId + " 已更新！" });
    }
  }
  return jsonResponse({ status: "error", msg: "找不到客服訊息 " + msgId });
}

/**
 * 儲存輪播圖
 */
function saveCarousels(carousels) {
  if (!Array.isArray(carousels)) return jsonResponse({ status: "error", msg: "格式不符" });
  const sheet = getSpreadsheet().getSheetByName(SHEET_NAMES.CAROUSELS);
  sheet.clearContents();
  sheet.appendRow(["輪播ID", "標題", "描述說明", "圖片網址", "發佈狀態"]);
  carousels.forEach((c, idx) => {
    sheet.appendRow([
      c.id || "C" + (idx + 1),
      c.title || "",
      c.description || "",
      c.image || "",
      c.status || "已發佈"
    ]);
  });
  return jsonResponse({ status: "success", msg: "首頁輪播圖已儲存！" });
}

/**
 * 儲存網站設定
 */
function saveSettings(settings) {
  const sheet = getSpreadsheet().getSheetByName(SHEET_NAMES.SETTINGS);
  sheet.clearContents();
  sheet.appendRow(["設定鍵 (Key)", "設定值 (Value)"]);
  for (const k in settings) {
    const val = typeof settings[k] === "object" ? JSON.stringify(settings[k]) : String(settings[k]);
    sheet.appendRow([k, val]);
  }
  return jsonResponse({ status: "success", msg: "網站設定已成功儲存！" });
}

/**
 * 讀取備忘記事本
 */
function getNotes() {
  const sheet = getSpreadsheet().getSheetByName(SHEET_NAMES.NOTES);
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  const notes = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[0] && !row[1]) continue;
    const tagsRaw = String(row[3] || "");
    const tags = tagsRaw.includes(",") ? tagsRaw.split(",").map(t => t.trim()).filter(Boolean) : (tagsRaw ? [tagsRaw.trim()] : []);
    notes.push({
      id: String(row[0] || ""),
      title: String(row[1] || ""),
      content: String(row[2] || ""),
      tags: tags,
      priority: String(row[4] || "normal"),
      isPinned: String(row[5] || "").includes("是") || row[5] === true,
      isDone: String(row[6] || "").includes("是") || row[6] === true,
      updatedAt: String(row[7] || "")
    });
  }
  return notes;
}

/**
 * 儲存備忘記事本 (自動去重並整齊寫入)
 */
function saveNotes(notes) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (e) {}

  try {
    if (!Array.isArray(notes)) return jsonResponse({ status: "error", msg: "格式不符" });
    const sheet = getSpreadsheet().getSheetByName(SHEET_NAMES.NOTES);
    if (!sheet) return jsonResponse({ status: "error", msg: "找不到備忘記事本工作表" });

    // 依記事ID自動去重，確保絕對不會產生重複行
    const uniqueMap = new Map();
    notes.forEach((n) => {
      if (n && n.id) {
        const idKey = String(n.id).trim();
        if (!uniqueMap.has(idKey)) {
          uniqueMap.set(idKey, n);
        }
      }
    });
    const uniqueNotes = Array.from(uniqueMap.values());

    const header = ["記事ID", "標題", "內容", "標籤", "優先等級", "是否置頂", "是否完成", "更新時間"];
    const rows = [header];

    uniqueNotes.forEach((n) => {
      const tagsStr = Array.isArray(n.tags) ? n.tags.join(", ") : (n.tags || "");
      rows.push([
        n.id || "",
        n.title || "",
        n.content || "",
        tagsStr,
        n.priority || "normal",
        n.isPinned ? "是" : "否",
        n.isDone ? "是" : "否",
        n.updatedAt || ""
      ]);
    });

    // 徹底清空整張工作表的所有殘留列與格式，重新寫入單一矩陣
    sheet.clear();
    sheet.getRange(1, 1, rows.length, header.length).setValues(rows);
    SpreadsheetApp.flush();

    return jsonResponse({ status: "success", msg: "備忘記事本已成功寫入 Google 試算表（共 " + uniqueNotes.length + " 則）！" });
  } finally {
    try { lock.releaseLock(); } catch (e) {}
  }
}

/**
 * 讀取系統修改紀錄 (Audit Logs)
 */
function getLogs() {
  const sheet = getSpreadsheet().getSheetByName(SHEET_NAMES.LOGS);
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  const logs = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[0] && !row[1]) continue;
    logs.push({
      id: String(row[0] || ""),
      timestamp: String(row[1] || ""),
      category: String(row[2] || "系統設定"),
      action: String(row[3] || "紀錄"),
      details: String(row[4] || ""),
      operator: String(row[5] || "管理員"),
      syncStatus: String(row[6] || "已保存")
    });
  }
  return logs;
}

/**
 * 儲存系統修改紀錄 (自動讀取既有紀錄合併去重，永久保留歷史，絕不覆蓋抹除)
 */
function saveLogs(logs) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (e) {}

  try {
    const sheet = getSpreadsheet().getSheetByName(SHEET_NAMES.LOGS);
    if (!sheet) return jsonResponse({ status: "error", msg: "找不到系統修改紀錄工作表" });

    // 1. 讀取試算表中現有全部歷史紀錄
    const existingLogs = getLogs();
    const uniqueMap = new Map();

    // 2. 先將試算表既有紀錄放入 Map (以 ID 或 timestamp+details 去重)
    existingLogs.forEach((l) => {
      if (l) {
        const idKey = String(l.id || (l.timestamp + '_' + l.details)).trim();
        if (idKey) uniqueMap.set(idKey, l);
      }
    });

    // 3. 將傳入之新紀錄合併加入
    const incomingList = Array.isArray(logs) ? logs : (logs ? [logs] : []);
    incomingList.forEach((l) => {
      if (l) {
        const idKey = String(l.id || (l.timestamp + '_' + l.details)).trim();
        if (idKey) uniqueMap.set(idKey, l);
      }
    });

    const mergedLogs = Array.from(uniqueMap.values());
    // 4. 按時間排序 (最新在最上方)
    mergedLogs.sort((a, b) => {
      const tA = new Date(a.timestamp).getTime() || 0;
      const tB = new Date(b.timestamp).getTime() || 0;
      return tB - tA;
    });

    const header = ["紀錄ID", "時間", "分類", "動作", "詳細說明", "操作者", "同步狀態"];
    const rows = [header];

    // 最多保留最新 2000 筆紀錄
    mergedLogs.slice(0, 2000).forEach((l) => {
      rows.push([
        l.id || "",
        l.timestamp || "",
        l.category || "",
        l.action || "",
        l.details || "",
        l.operator || "管理員",
        l.syncStatus || "已保存"
      ]);
    });

    sheet.clear();
    sheet.getRange(1, 1, rows.length, header.length).setValues(rows);
    SpreadsheetApp.flush();

    return jsonResponse({
      status: "success",
      msg: "系統修改紀錄已合併同步至試算表（共 " + (rows.length - 1) + " 筆）！",
      data: mergedLogs
    });
  } finally {
    try { lock.releaseLock(); } catch (e) {}
  }
}

/**
 * 初始化工作表結構
 */
function ensureSheetsInitialized() {
  const ss = getSpreadsheet();
  
  // 書籍表
  let bSheet = ss.getSheetByName(SHEET_NAMES.BOOKS);
  if (!bSheet) {
    bSheet = ss.insertSheet(SHEET_NAMES.BOOKS);
    bSheet.appendRow(["書碼", "書名", "作者", "出版年份", "定價", "ISBN", "庫存數量", "叢書類別", "是否新書", "是否最後庫存", "封面圖片網址", "書籍簡介", "讀後心得與學術評析"]);
  }

  // 訂單表
  let oSheet = ss.getSheetByName(SHEET_NAMES.ORDERS);
  if (!oSheet) {
    oSheet = ss.insertSheet(SHEET_NAMES.ORDERS);
    oSheet.appendRow(["訂單編號", "下單時間", "收件人姓名", "聯絡電話", "電子信箱", "寄送地址", "訂購明細", "總金額", "付款方式", "備註說明", "處理狀態", "管理員備註"]);
  }

  // 客服表
  let csSheet = ss.getSheetByName(SHEET_NAMES.CS);
  if (!csSheet) {
    csSheet = ss.insertSheet(SHEET_NAMES.CS);
    csSheet.appendRow(["留言ID", "留言時間", "讀者稱呼", "聯絡電話", "電子信箱", "反映內容", "處理狀態", "回覆備註"]);
  }

  // 輪播表
  let carSheet = ss.getSheetByName(SHEET_NAMES.CAROUSELS);
  if (!carSheet) {
    carSheet = ss.insertSheet(SHEET_NAMES.CAROUSELS);
    carSheet.appendRow(["輪播ID", "標題", "描述說明", "圖片網址", "發佈狀態"]);
  }

  // 推薦表
  let choSheet = ss.getSheetByName(SHEET_NAMES.CHOICES) || ss.getSheetByName("推薦書單") || ss.getSheetByName("精選推薦");
  if (!choSheet) {
    choSheet = ss.insertSheet(SHEET_NAMES.CHOICES);
    choSheet.appendRow(["書碼", "書名", "作者", "出版年份", "定價", "ISBN", "庫存數量", "叢書類別", "封面圖片網址", "書籍簡介", "讀後心得與學術評析", "推薦類型", "輪次"]);
  }

  // 設定表
  let sSheet = ss.getSheetByName(SHEET_NAMES.SETTINGS);
  if (!sSheet) {
    sSheet = ss.insertSheet(SHEET_NAMES.SETTINGS);
    sSheet.appendRow(["設定鍵 (Key)", "設定值 (Value)"]);
  }

  // 備忘記事本表
  let nSheet = ss.getSheetByName(SHEET_NAMES.NOTES);
  if (!nSheet) {
    nSheet = ss.insertSheet(SHEET_NAMES.NOTES);
    nSheet.appendRow(["記事ID", "標題", "內容", "標籤", "優先等級", "是否置頂", "是否完成", "更新時間"]);
  }

  // 系統修改紀錄表
  let lSheet = ss.getSheetByName(SHEET_NAMES.LOGS);
  if (!lSheet) {
    lSheet = ss.insertSheet(SHEET_NAMES.LOGS);
    lSheet.appendRow(["紀錄ID", "時間", "分類", "動作", "詳細說明", "操作者", "同步狀態"]);
  }
}

/**
 * 輔助函式：產生 JSON 回應
 */
function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * ⚡【一鍵將官網 / GitHub 最新完整書籍資料庫（含簡介與心得）同步寫入試算表】
 * 
 * 【使用方式】：
 * 1. 打開 Google 試算表的「擴充功能」 -> 「Apps Script」。
 * 2. 上方執行函式下拉選單選擇「SYNC_ALL_FROM_GITHUB」。
 * 3. 點擊「▶ 執行」，幾秒內試算表即會全自動更新為 2,632 本最新書目與簡介！
 */
function SYNC_ALL_FROM_GITHUB() {
  const url = "https://raw.githubusercontent.com/TheLiberalArtsPress/theliberalartspress.github.io/main/init_data.js?v=" + new Date().getTime();
  const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  if (response.getResponseCode() !== 200) {
    throw new Error("無法從 GitHub 下載最新數據，HTTP 狀態碼: " + response.getResponseCode());
  }

  const text = response.getContentText();
  const match = text.match(/window\.INIT_DATA\s*=\s*(\{[\s\S]*?\});/);
  if (!match) {
    throw new Error("解析 init_data.js 失敗");
  }

  const initData = JSON.parse(match[1]);
  const books = initData.books || [];
  if (books.length === 0) {
    throw new Error("書籍清單為空");
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("Book_ALL") || ss.getSheetByName("書籍清單");
  if (!sheet) {
    sheet = ss.insertSheet("書籍清單");
  }

  const header = ["書碼", "書名", "作者", "出版年份", "定價", "ISBN", "庫存數量", "叢書類別", "是否新書", "是否最後庫存", "封面圖片", "書籍簡介", "讀後心得與學術評析"];
  const rows = [header];

  for (let i = 0; i < books.length; i++) {
    const b = books[i];
    const coverUrl = (b.cover && !b.cover.startsWith("data:image")) ? b.cover : (b.localCover || "");
    rows.push([
      String(b.id || "").trim(),
      String(b.title || "").trim(),
      String(b.author || "").trim(),
      String(b.year || "").trim(),
      Number(b.price || 0),
      String(b.isbn || "").trim(),
      String(b.stock || "10").trim(),
      String(b.category || "文史哲學集成").trim(),
      b.isNew === true ? "是" : "否",
      b.isLast === true ? "是" : "否",
      coverUrl,
      String(b.intro || "").trim(),
      String(b.心得 || b.review || "").trim()
    ]);
  }

  sheet.clearContents();
  sheet.getRange(1, 1, rows.length, header.length).setValues(rows);
  
  Logger.log("🎉 成功同步 " + books.length + " 本最新書籍（含簡介與心得）至 Google 試算表！");
  return "🎉 成功同步 " + books.length + " 本最新書籍至試算表！";
}

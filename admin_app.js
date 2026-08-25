const {
  useState,
  useEffect,
  useMemo,
  useRef
} = React;
const DEFAULT_GAS_URL = "https://script.google.com/macros/s/AKfycbwokskAB0yjrBz3aIhK9QI_phYEH6KtKoEMrLLKWzOooYjABVF0Nsqs2idMzxKyjqr3/exec";
const DEFAULT_PASS = "lapen_admin_888";
const SVG_FALLBACK = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='140' viewBox='0 0 100 140'%3E%3Crect width='100%25' height='100%25' fill='%23EDE5DC'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='serif' font-size='11' fill='%238C5A2B'%3E封面暫缺%3C/text%3E%3C/svg%3E";

// 🛡️ 安全存儲輔助函式（防止 QuotaExceededError 崩潰）
const safeSetStorage = (key, val) => {
  try {
    localStorage.setItem(key, typeof val === 'string' ? val : JSON.stringify(val));
  } catch (e) {
    console.warn("Storage quota limit reached for:", key);
  }
};
const safeGetStorage = (key, defaultVal = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
};

// 🗄️ IndexedDB 大容量資料庫 (支援數百 MB 典籍與封面存儲)
const DB_NAME = 'LapenAdminDB';
const STORE_NAME = 'books_store';
function getDB() {
  return new Promise(resolve => {
    try {
      const req = window.indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = e => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      req.onsuccess = e => resolve(e.target.result);
      req.onerror = () => resolve(null);
    } catch (e) {
      resolve(null);
    }
  });
}
async function saveBooksToIndexedDB(booksList) {
  try {
    const db = await getDB();
    if (!db) return;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(booksList, 'admin_books');
  } catch (e) {
    console.warn("IndexedDB save error:", e);
  }
}
async function loadBooksFromIndexedDB() {
  try {
    const db = await getDB();
    if (!db) return null;
    return new Promise(resolve => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get('admin_books');
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    });
  } catch (e) {
    return null;
  }
}
function AdminApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem('lapen_admin_logged') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [savedPassword, setSavedPassword] = useState(() => {
    try {
      return localStorage.getItem('lapen_admin_pwd') || DEFAULT_PASS;
    } catch (e) {
      return DEFAULT_PASS;
    }
  });
  const [activeTab, setActiveTab] = useState('books');
  const [gasUrl, setGasUrl] = useState(() => {
    try {
      return localStorage.getItem('lapen_gas_url') || DEFAULT_GAS_URL;
    } catch (e) {
      return DEFAULT_GAS_URL;
    }
  });
  const [syncMessage, setSyncMessage] = useState(null);
  const staticData = typeof window !== "undefined" && window.STATIC_DATA || {};

  // 初始化書籍 (優先靜態資料庫)
  const [books, setBooks] = useState(() => staticData.books || []);

  // 初始化訂單
  const [orders, setOrders] = useState(() => {
    return safeGetStorage('lapen_admin_orders', [{
      orderId: "ORD20260825001",
      date: "2026/08/25 18:30:12",
      name: "王大明",
      phone: "0912-345-678",
      email: "wang@example.com",
      address: "台北市大安區和平東路一段 100 號",
      items: "《中國圖書史略》x 1, 《滿文原檔選讀譯注》x 1",
      total: 1020,
      payment: "店取付現金",
      memo: "請協助挑選書況良好之書籍，感謝！",
      status: "待處理",
      adminNote: ""
    }]);
  });

  // 初始化客服反映
  const [csMessages, setCsMessages] = useState(() => {
    return safeGetStorage('lapen_admin_cs', [{
      id: "CS2026082501",
      date: "2026/08/25 19:15:00",
      name: "陳教授",
      phone: "0922-888-999",
      email: "chen@univ.edu.tw",
      content: "請問《滿語叢刊》一套 50 冊是否有提供大學研究室採購優惠折扣？",
      status: "未處理",
      replyNote: ""
    }]);
  });
  const [carousels, setCarousels] = useState(() => {
    return safeGetStorage('lapen_admin_carousels', staticData.carousels || []);
  });
  const [settings, setSettings] = useState(() => staticData.settings || {});

  // 書籍管理 UI 狀態
  const [bookSearch, setBookSearch] = useState('');
  const [bookCatFilter, setBookCatFilter] = useState('全部');
  const [bookPage, setBookPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [editingBook, setEditingBook] = useState(null);
  const [bookFormData, setBookFormData] = useState({
    id: '',
    title: '',
    author: '',
    year: '',
    price: '',
    isbn: '',
    stock: '10',
    category: '文學',
    isNew: false,
    isLast: false,
    cover: '',
    intro: '',
    心得: ''
  });

  // 訂單管理 UI 狀態
  const [orderFilter, setOrderFilter] = useState('全部');
  const [orderSearch, setOrderSearch] = useState('');
  const [viewingOrder, setViewingOrder] = useState(null);

  // 客服管理 UI 狀態
  const [csFilter, setCsFilter] = useState('全部');
  const [viewingCs, setViewingCs] = useState(null);
  const showToast = (msg, type = 'info') => {
    setSyncMessage({
      msg,
      type
    });
    setTimeout(() => setSyncMessage(null), 3500);
  };

  // 啟動時從 IndexedDB 載入已修改的書籍 (若有)
  useEffect(() => {
    loadBooksFromIndexedDB().then(saved => {
      if (saved && Array.isArray(saved) && saved.length > 0) {
        setBooks(saved);
      }
    });
  }, []);

  // 當書籍異動時，儲存至 IndexedDB
  useEffect(() => {
    if (books && books.length > 0) {
      saveBooksToIndexedDB(books);
    }
  }, [books]);

  // 訂單與客服留言變更時，安全存入 localStorage
  useEffect(() => {
    safeSetStorage('lapen_admin_orders', orders);
  }, [orders]);
  useEffect(() => {
    safeSetStorage('lapen_admin_cs', csMessages);
  }, [csMessages]);
  useEffect(() => {
    safeSetStorage('lapen_admin_carousels', carousels);
  }, [carousels]);
  const handleLogin = e => {
    e.preventDefault();
    if (passwordInput === savedPassword) {
      setIsLoggedIn(true);
      try {
        sessionStorage.setItem('lapen_admin_logged', 'true');
      } catch (e) {}
      setLoginError('');
      showToast('管理員登入成功！歡迎使用後台系統', 'success');
    } else {
      setLoginError('密碼不正確，請重新輸入（預設密碼為：lapen_admin_888）');
    }
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
    try {
      sessionStorage.removeItem('lapen_admin_logged');
    } catch (e) {}
    setPasswordInput('');
  };
  const categoriesList = useMemo(() => {
    const set = new Set();
    books.forEach(b => {
      if (b.category && b.category.trim()) set.add(b.category.trim());
    });
    return ['全部', ...Array.from(set).sort()];
  }, [books]);
  const filteredBooks = useMemo(() => {
    const q = bookSearch.trim().toLowerCase();
    return books.filter(b => {
      const matchCat = bookCatFilter === '全部' || b.category === bookCatFilter;
      if (!matchCat) return false;
      if (!q) return true;
      return String(b.id || '').toLowerCase().includes(q) || String(b.title || '').toLowerCase().includes(q) || String(b.author || '').toLowerCase().includes(q) || String(b.year || '').toLowerCase().includes(q) || String(b.isbn || '').toLowerCase().includes(q);
    });
  }, [books, bookSearch, bookCatFilter]);
  const totalPages = Math.ceil(filteredBooks.length / pageSize) || 1;
  const paginatedBooks = useMemo(() => {
    const start = (bookPage - 1) * pageSize;
    return filteredBooks.slice(start, start + pageSize);
  }, [filteredBooks, bookPage, pageSize]);
  const handleOpenEditBook = (book = null) => {
    if (book) {
      setEditingBook(book);
      setBookFormData({
        id: book.id || '',
        title: book.title || '',
        author: book.author || '',
        year: book.year || '',
        price: book.price !== undefined ? book.price : '',
        isbn: book.isbn || '',
        stock: book.stock !== undefined ? book.stock : '10',
        category: book.category || '文學',
        isNew: !!book.isNew,
        isLast: !!book.isLast,
        cover: book.cover || book.image || '',
        intro: book.intro || '',
        心得: book.心得 || book.review || ''
      });
    } else {
      const nextId = String(books.length + 1).padStart(5, '0');
      setEditingBook('NEW');
      setBookFormData({
        id: nextId,
        title: '',
        author: '',
        year: '115年',
        price: '300',
        isbn: '',
        stock: '10',
        category: '文史哲學集成',
        isNew: true,
        isLast: false,
        cover: '',
        intro: '',
        心得: ''
      });
    }
  };
  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("圖片檔案過大，建議上傳 2MB 以下的圖片以保證網頁載入速度！");
      return;
    }
    const reader = new FileReader();
    reader.onload = ev => {
      setBookFormData(prev => ({
        ...prev,
        cover: ev.target.result
      }));
      showToast('圖片已成功轉換並載入預覽', 'success');
    };
    reader.readAsDataURL(file);
  };
  const handleSaveBook = e => {
    e.preventDefault();
    if (!bookFormData.id.trim() || !bookFormData.title.trim()) {
      alert("書碼與書名為必填欄位！");
      return;
    }
    const newBookObj = {
      id: String(bookFormData.id).trim(),
      title: String(bookFormData.title).trim(),
      author: String(bookFormData.author).trim(),
      year: String(bookFormData.year).trim(),
      price: Number(bookFormData.price) || 0,
      isbn: String(bookFormData.isbn).trim(),
      stock: String(bookFormData.stock).trim() || '10',
      category: String(bookFormData.category).trim() || '未分類',
      isNew: Boolean(bookFormData.isNew),
      isLast: Boolean(bookFormData.isLast),
      cover: bookFormData.cover.trim(),
      intro: bookFormData.intro.trim(),
      心得: bookFormData.心得.trim()
    };
    if (editingBook === 'NEW') {
      const exists = books.some(b => String(b.id) === newBookObj.id);
      if (exists) {
        alert(`書碼 ${newBookObj.id} 已經存在，請更換其他書碼！`);
        return;
      }
      setBooks(prev => [newBookObj, ...prev]);
      showToast(`新書《${newBookObj.title}》已成功新增！`, 'success');
    } else {
      setBooks(prev => prev.map(b => String(b.id) === String(editingBook.id) ? newBookObj : b));
      showToast(`書籍《${newBookObj.title}》資料已更新！`, 'success');
    }
    setEditingBook(null);
  };
  const handleDeleteBook = book => {
    if (window.confirm(`確定要刪除書籍【${book.id}】《${book.title}》嗎？此動作無法復原！`)) {
      setBooks(prev => prev.filter(b => String(b.id) !== String(book.id)));
      showToast(`書籍《${book.title}》已刪除`, 'danger');
    }
  };
  const handleExportDataJs = () => {
    // 💡 同步更新「編輯特別推薦」中的書籍資訊（例如價格、書名等）
    const updatedChoices = (staticData.choices || []).map(c => {
      const matchingBook = books.find(b => String(b.id) === String(c.id));
      if (matchingBook) {
        return {
          ...c,
          title: matchingBook.title,
          author: matchingBook.author,
          year: matchingBook.year,
          price: matchingBook.price,
          stock: matchingBook.stock,
          category: matchingBook.category,
          cover: matchingBook.cover,
          localCover: matchingBook.localCover,
          intro: matchingBook.intro,
          心得: matchingBook.心得
        };
      }
      return c;
    });

    const fullData = {
      settings: settings,
      ui: staticData.ui || {},
      carousels: carousels,
      choices: updatedChoices,
      books: books
    };
    const fileContent = "window.STATIC_DATA = " + JSON.stringify(fullData, null, 2) + ";";
    const blob = new Blob([fileContent], {
      type: 'application/javascript;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('已生成並下載最新 data.js！請記得將檔案覆蓋專案目錄並推送到 GitHub 即可更新網站。', 'success');
  };
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.orderId === orderId ? {
      ...o,
      status: newStatus
    } : o));
    if (viewingOrder && viewingOrder.orderId === orderId) {
      setViewingOrder(prev => ({
        ...prev,
        status: newStatus
      }));
    }
    showToast(`訂單 ${orderId} 狀態已更新為【${newStatus}】`, 'success');
  };
  const handleDeleteOrder = orderId => {
    if (window.confirm(`確定要刪除訂單 ${orderId} 嗎？`)) {
      setOrders(prev => prev.filter(o => o.orderId !== orderId));
      setViewingOrder(null);
      showToast(`訂單 ${orderId} 已刪除`, 'danger');
    }
  };
  const handleUpdateCsStatus = (msgId, newStatus) => {
    setCsMessages(prev => prev.map(m => m.id === msgId ? {
      ...m,
      status: newStatus
    } : m));
    if (viewingCs && viewingCs.id === msgId) {
      setViewingCs(prev => ({
        ...prev,
        status: newStatus
      }));
    }
    showToast(`客服反映 ${msgId} 狀態已更新為【${newStatus}】`, 'success');
  };
  const handleDeleteCs = msgId => {
    if (window.confirm(`確定要刪除此客服留言嗎？`)) {
      setCsMessages(prev => prev.filter(m => m.id !== msgId));
      setViewingCs(null);
      showToast(`客服留言已刪除`, 'danger');
    }
  };
  const handleSaveNewPassword = e => {
    e.preventDefault();
    const newPwd = e.target.newPwd.value.trim();
    if (newPwd.length < 6) {
      alert('密碼長度不得少於 6 位數！');
      return;
    }
    setSavedPassword(newPwd);
    safeSetStorage('lapen_admin_pwd', newPwd);
    e.target.reset();
    showToast('管理員密碼已成功更新！', 'success');
  };
  const handleSaveGasUrl = e => {
    e.preventDefault();
    const url = e.target.gasUrl.value.trim();
    setGasUrl(url);
    safeSetStorage('lapen_gas_url', url);
    showToast('Google Apps Script API 網址已儲存！', 'success');
  };
  if (!isLoggedIn) {
    return /*#__PURE__*/React.createElement("div", {
      className: "min-h-screen flex items-center justify-center bg-[#241D17] px-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "max-w-md w-full bg-[#FAF8F5] rounded-2xl shadow-2xl p-8 border border-[#8C5A2B]/30"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-center mb-8"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-16 h-16 bg-[#8C5A2B] text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
    }, /*#__PURE__*/React.createElement("svg", {
      className: "w-8 h-8",
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "2",
      d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    }))), /*#__PURE__*/React.createElement("h2", {
      className: "text-2xl font-bold font-serif text-[#241D17]"
    }, "\u6587\u53F2\u54F2\u51FA\u7248\u793E"), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-[#8C5A2B] mt-1 tracking-wider"
    }, "\u7DB2\u7AD9\u5F8C\u53F0\u7BA1\u7406\u7CFB\u7D71")), /*#__PURE__*/React.createElement("form", {
      onSubmit: handleLogin,
      className: "space-y-5"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      className: "block text-xs font-bold text-[#4A3B32] uppercase mb-2"
    }, "\u7BA1\u7406\u54E1\u5B58\u53D6\u5BC6\u78BC"), /*#__PURE__*/React.createElement("input", {
      type: "password",
      value: passwordInput,
      onChange: e => setPasswordInput(e.target.value),
      placeholder: "\u8ACB\u8F38\u5165\u7BA1\u7406\u5BC6\u78BC (\u9810\u8A2D: lapen_admin_888)",
      className: "w-full px-4 py-3 rounded-xl border border-[#D4C5B9] focus:outline-none focus:ring-2 focus:ring-[#8C5A2B] bg-white text-sm",
      required: true
    })), loginError && /*#__PURE__*/React.createElement("div", {
      className: "p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200"
    }, loginError), /*#__PURE__*/React.createElement("button", {
      type: "submit",
      className: "w-full py-3.5 bg-[#8C5A2B] hover:bg-[#6B421E] text-white font-bold rounded-xl shadow-md transition duration-200 flex items-center justify-center gap-2"
    }, /*#__PURE__*/React.createElement("span", null, "\u9A57\u8B49\u4E26\u9032\u5165\u5F8C\u53F0"), /*#__PURE__*/React.createElement("svg", {
      className: "w-4 h-4",
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "2",
      d: "M14 5l7 7m0 0l-7 7m7-7H3"
    })))), /*#__PURE__*/React.createElement("div", {
      className: "mt-8 pt-6 border-t border-[#E8DCCE] text-center"
    }, /*#__PURE__*/React.createElement("a", {
      href: "index.html",
      className: "text-xs text-[#8C5A2B] hover:underline flex items-center justify-center gap-1"
    }, /*#__PURE__*/React.createElement("svg", {
      className: "w-4 h-4",
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "2",
      d: "M10 19l-7-7m0 0l7-7m-7 7h18"
    })), /*#__PURE__*/React.createElement("span", null, "\u8FD4\u56DE\u51FA\u7248\u793E\u5B98\u65B9\u7DB2\u7AD9\u9996\u9801")))));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen flex flex-col md:flex-row bg-[#F4EFEA]"
  }, syncMessage && /*#__PURE__*/React.createElement("div", {
    className: `fixed top-5 right-5 z-50 px-5 py-3.5 rounded-xl shadow-xl text-sm font-bold flex items-center gap-3 transition-all duration-300 ${syncMessage.type === 'success' ? 'bg-emerald-800 text-white' : syncMessage.type === 'danger' ? 'bg-rose-800 text-white' : 'bg-[#241D17] text-white'}`
  }, /*#__PURE__*/React.createElement("span", null, syncMessage.msg)), /*#__PURE__*/React.createElement("aside", {
    className: "w-full md:w-64 bg-[#241D17] text-[#FAF8F5] flex flex-col shrink-0 shadow-2xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-6 border-b border-[#3D3126]"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 rounded-xl bg-[#8C5A2B] flex items-center justify-center text-white font-serif font-bold text-xl shadow"
  }, "\u6587"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "font-bold font-serif text-lg leading-tight"
  }, "\u6587\u53F2\u54F2\u51FA\u7248\u793E"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-[#BFAF9E]"
  }, "\u5F8C\u53F0\u7BA1\u7406\u7CFB\u7D71")))), /*#__PURE__*/React.createElement("nav", {
    className: "p-4 space-y-1.5 flex-1"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setActiveTab('dashboard'),
    className: `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${activeTab === 'dashboard' ? 'bg-[#8C5A2B] text-white shadow-md' : 'text-[#D4C5B9] hover:bg-[#32271F]'}`
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
  })), /*#__PURE__*/React.createElement("span", null, "\u7E3D\u89BD\u5100\u8868\u677F")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setActiveTab('books'),
    className: `w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition ${activeTab === 'books' ? 'bg-[#8C5A2B] text-white shadow-md' : 'text-[#D4C5B9] hover:bg-[#32271F]'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
  })), /*#__PURE__*/React.createElement("span", null, "\u66F8\u7C4D\u5EAB\u5B58\u7BA1\u7406")), /*#__PURE__*/React.createElement("span", {
    className: "text-xs bg-[#3D3126] px-2 py-0.5 rounded-full text-[#E8DCCE]"
  }, books.length)), /*#__PURE__*/React.createElement("button", {
    onClick: () => setActiveTab('orders'),
    className: `w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition ${activeTab === 'orders' ? 'bg-[#8C5A2B] text-white shadow-md' : 'text-[#D4C5B9] hover:bg-[#32271F]'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
  })), /*#__PURE__*/React.createElement("span", null, "\u9867\u5BA2\u8A02\u55AE\u7BA1\u7406")), orders.filter(o => o.status === '待處理').length > 0 && /*#__PURE__*/React.createElement("span", {
    className: "text-xs bg-amber-600 px-2 py-0.5 rounded-full text-white font-bold"
  }, orders.filter(o => o.status === '待處理').length)), /*#__PURE__*/React.createElement("button", {
    onClick: () => setActiveTab('cs'),
    className: `w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition ${activeTab === 'cs' ? 'bg-[#8C5A2B] text-white shadow-md' : 'text-[#D4C5B9] hover:bg-[#32271F]'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
  })), /*#__PURE__*/React.createElement("span", null, "\u5BA2\u670D\u8207\u5EFA\u8B70")), csMessages.filter(m => m.status === '未處理').length > 0 && /*#__PURE__*/React.createElement("span", {
    className: "text-xs bg-rose-600 px-2 py-0.5 rounded-full text-white font-bold"
  }, csMessages.filter(m => m.status === '未處理').length)), /*#__PURE__*/React.createElement("button", {
    onClick: () => setActiveTab('carousels'),
    className: `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${activeTab === 'carousels' ? 'bg-[#8C5A2B] text-white shadow-md' : 'text-[#D4C5B9] hover:bg-[#32271F]'}`
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
  })), /*#__PURE__*/React.createElement("span", null, "\u9996\u9801\u8F2A\u64AD\u5716")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setActiveTab('settings'),
    className: `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${activeTab === 'settings' ? 'bg-[#8C5A2B] text-white shadow-md' : 'text-[#D4C5B9] hover:bg-[#32271F]'}`
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
  }), /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
  })), /*#__PURE__*/React.createElement("span", null, "\u7CFB\u7D71\u8207\u5BC6\u78BC\u8A2D\u5B9A"))), /*#__PURE__*/React.createElement("div", {
    className: "p-4 border-t border-[#3D3126] space-y-2"
  }, /*#__PURE__*/React.createElement("a", {
    href: "index.html",
    target: "_blank",
    className: "w-full flex items-center justify-center gap-2 py-2.5 bg-[#3D3126] hover:bg-[#4E3E31] text-xs text-[#E8DCCE] rounded-xl transition font-medium"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
  })), /*#__PURE__*/React.createElement("span", null, "\u9810\u89BD\u5B98\u7DB2\u524D\u53F0")), /*#__PURE__*/React.createElement("button", {
    onClick: handleLogout,
    className: "w-full flex items-center justify-center gap-2 py-2.5 bg-red-950/40 hover:bg-red-900/60 text-xs text-red-300 rounded-xl transition font-medium border border-red-900/50"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
  })), /*#__PURE__*/React.createElement("span", null, "\u5B89\u5168\u767B\u51FA")))), /*#__PURE__*/React.createElement("main", {
    className: "flex-1 flex flex-col min-w-0 overflow-y-auto"
  }, /*#__PURE__*/React.createElement("header", {
    className: "bg-white border-b border-[#E8DCCE] px-6 py-4 flex items-center justify-between shadow-sm shrink-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-bold font-serif text-[#241D17]"
  }, activeTab === 'dashboard' && '總覽儀表板', activeTab === 'books' && '書籍庫存與內容管理', activeTab === 'orders' && '顧客訂單管理', activeTab === 'cs' && '客服與建議反映', activeTab === 'carousels' && '首頁輪播圖管理', activeTab === 'settings' && '系統與安全設定')), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: handleExportDataJs,
    className: "px-4 py-2 bg-[#8C5A2B] hover:bg-[#6B421E] text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-2",
    title: "\u5C07\u6240\u6709\u4FEE\u6539\u5BEB\u5165 data.js \u4E0B\u8F09"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
  })), /*#__PURE__*/React.createElement("span", null, "\uD83D\uDCE5 \u4E00\u9375\u5C0E\u51FA data.js (\u66F4\u65B0\u5B98\u7DB2)")))), /*#__PURE__*/React.createElement("div", {
    className: "p-6 flex-1 space-y-6"
  }, activeTab === 'dashboard' && /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-5 rounded-2xl border border-[#E8DCCE] shadow-sm flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-bold text-[#8C5A2B]"
  }, "\u5168\u9928\u66F8\u7C4D\u7E3D\u6578"), /*#__PURE__*/React.createElement("h3", {
    className: "text-3xl font-bold text-[#241D17] mt-1 font-serif"
  }, books.length, " ", /*#__PURE__*/React.createElement("span", {
    className: "text-sm font-normal text-gray-500"
  }, "\u672C"))), /*#__PURE__*/React.createElement("div", {
    className: "w-12 h-12 rounded-xl bg-amber-50 text-[#8C5A2B] flex items-center justify-center"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-6 h-6",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-5 rounded-2xl border border-[#E8DCCE] shadow-sm flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-bold text-amber-700"
  }, "\u5F85\u8655\u7406\u8A02\u55AE"), /*#__PURE__*/React.createElement("h3", {
    className: "text-3xl font-bold text-amber-900 mt-1 font-serif"
  }, orders.filter(o => o.status === '待處理').length, " ", /*#__PURE__*/React.createElement("span", {
    className: "text-sm font-normal text-gray-500"
  }, "\u7B46"))), /*#__PURE__*/React.createElement("div", {
    className: "w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-6 h-6",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-5 rounded-2xl border border-[#E8DCCE] shadow-sm flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-bold text-rose-700"
  }, "\u672A\u56DE\u8986\u5BA2\u670D\u53CD\u6620"), /*#__PURE__*/React.createElement("h3", {
    className: "text-3xl font-bold text-rose-900 mt-1 font-serif"
  }, csMessages.filter(m => m.status === '未處理').length, " ", /*#__PURE__*/React.createElement("span", {
    className: "text-sm font-normal text-gray-500"
  }, "\u5247"))), /*#__PURE__*/React.createElement("div", {
    className: "w-12 h-12 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-6 h-6",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-5 rounded-2xl border border-[#E8DCCE] shadow-sm flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-bold text-emerald-700"
  }, "\u6536\u9304\u53E2\u66F8\u985E\u5225"), /*#__PURE__*/React.createElement("h3", {
    className: "text-3xl font-bold text-emerald-900 mt-1 font-serif"
  }, categoriesList.length - 1, " ", /*#__PURE__*/React.createElement("span", {
    className: "text-sm font-normal text-gray-500"
  }, "\u7A2E"))), /*#__PURE__*/React.createElement("div", {
    className: "w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-6 h-6",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
  })))))), activeTab === 'books' && /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-2xl border border-[#E8DCCE] shadow-sm flex flex-col overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-5 border-b border-[#E8DCCE] bg-[#FAF8F5] flex flex-wrap items-center justify-between gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center gap-3 flex-1 min-w-[280px]"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative flex-1 min-w-[200px]"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: bookSearch,
    onChange: e => {
      setBookSearch(e.target.value);
      setBookPage(1);
    },
    placeholder: "\u641C\u5C0B\u66F8\u540D\u3001\u66F8\u78BC\u3001\u4F5C\u8005\u3001ISBN...",
    className: "w-full pl-9 pr-4 py-2 bg-white border border-[#D4C5B9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8C5A2B]"
  }), /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4 text-gray-400 absolute left-3 top-3",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
  }))), /*#__PURE__*/React.createElement("select", {
    value: bookCatFilter,
    onChange: e => {
      setBookCatFilter(e.target.value);
      setBookPage(1);
    },
    className: "px-3 py-2 bg-white border border-[#D4C5B9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8C5A2B]"
  }, categoriesList.map(cat => /*#__PURE__*/React.createElement("option", {
    key: cat,
    value: cat
  }, cat)))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => handleOpenEditBook(null),
    className: "px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold rounded-xl shadow transition flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M12 4v16m8-8H4"
  })), /*#__PURE__*/React.createElement("span", null, "\u65B0\u589E\u66F8\u7C4D")))), /*#__PURE__*/React.createElement("div", {
    className: "overflow-x-auto"
  }, /*#__PURE__*/React.createElement("table", {
    className: "w-full text-left text-sm"
  }, /*#__PURE__*/React.createElement("thead", {
    className: "bg-[#FAF8F5] text-[#8C5A2B] font-bold text-xs uppercase border-b border-[#E8DCCE]"
  }, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4 w-16 text-center"
  }, "\u66F8\u78BC"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4 w-16 text-center"
  }, "\u5C01\u9762"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "\u66F8\u540D"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "\u4F5C\u8005"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "\u51FA\u7248\u5E74\u4EFD"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "\u53E2\u66F8\u985E\u5225"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4 text-right"
  }, "\u5B9A\u50F9"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4 text-center"
  }, "\u5EAB\u5B58"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4 text-center"
  }, "\u64CD\u4F5C"))), /*#__PURE__*/React.createElement("tbody", {
    className: "divide-y divide-[#E8DCCE]/60"
  }, paginatedBooks.length === 0 ? /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: "9",
    className: "py-12 text-center text-gray-400"
  }, "\u6C92\u6709\u627E\u5230\u7B26\u5408\u689D\u4EF6\u7684\u66F8\u7C4D")) : paginatedBooks.map(book => /*#__PURE__*/React.createElement("tr", {
    key: book.id,
    className: "hover:bg-[#FAF8F5]/80 transition"
  }, /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 font-mono text-xs text-gray-600 text-center font-bold"
  }, book.id), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 text-center"
  }, /*#__PURE__*/React.createElement("img", {
    src: book.localCover || book.cover || book.image || SVG_FALLBACK,
    onError: e => {
      e.target.src = SVG_FALLBACK;
    },
    alt: "",
    className: "w-10 h-14 object-cover rounded shadow-sm mx-auto border border-[#E8DCCE]"
  })), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 font-serif font-bold text-[#241D17]"
  }, /*#__PURE__*/React.createElement("div", null, book.title), book.isbn && /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] font-sans font-normal text-gray-400"
  }, "ISBN: ", book.isbn)), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 text-gray-700"
  }, book.author || '-'), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 text-xs text-gray-600"
  }, book.year || '-'), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4"
  }, /*#__PURE__*/React.createElement("span", {
    className: "px-2.5 py-0.5 rounded-full text-xs bg-amber-50 text-[#8C5A2B] border border-amber-200"
  }, book.category || '未分類')), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 text-right font-bold text-[#8C5A2B]"
  }, "NT$ ", book.price), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 text-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: `text-xs px-2 py-0.5 rounded-full ${Number(book.stock) > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`
  }, book.stock || '10')), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 text-center space-x-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => handleOpenEditBook(book),
    className: "px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-xs font-bold transition"
  }, "\u7DE8\u8F2F"), /*#__PURE__*/React.createElement("button", {
    onClick: () => handleDeleteBook(book),
    className: "px-3 py-1 bg-rose-100 hover:bg-rose-200 text-rose-900 rounded-lg text-xs font-bold transition"
  }, "\u522A\u9664"))))))), /*#__PURE__*/React.createElement("div", {
    className: "p-4 border-t border-[#E8DCCE] bg-[#FAF8F5] flex items-center justify-between text-xs text-gray-600"
  }, /*#__PURE__*/React.createElement("div", null, "\u5171 ", /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-[#8C5A2B]"
  }, filteredBooks.length), " \u672C\u66F8\u7C4D\uFF08\u7B2C ", bookPage, " / ", totalPages, " \u9801\uFF09"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setBookPage(1),
    disabled: bookPage === 1,
    className: "px-2.5 py-1.5 rounded-lg border border-[#D4C5B9] bg-white disabled:opacity-40"
  }, "\u9996\u9801"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setBookPage(prev => Math.max(1, prev - 1)),
    disabled: bookPage === 1,
    className: "px-2.5 py-1.5 rounded-lg border border-[#D4C5B9] bg-white disabled:opacity-40"
  }, "\u4E0A\u4E00\u9801"), /*#__PURE__*/React.createElement("span", {
    className: "px-3 py-1.5 font-bold text-[#8C5A2B]"
  }, bookPage), /*#__PURE__*/React.createElement("button", {
    onClick: () => setBookPage(prev => Math.min(totalPages, prev + 1)),
    disabled: bookPage === totalPages,
    className: "px-2.5 py-1.5 rounded-lg border border-[#D4C5B9] bg-white disabled:opacity-40"
  }, "\u4E0B\u4E00\u9801"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setBookPage(totalPages),
    disabled: bookPage === totalPages,
    className: "px-2.5 py-1.5 rounded-lg border border-[#D4C5B9] bg-white disabled:opacity-40"
  }, "\u672B\u9801")))), activeTab === 'orders' && /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-2xl border border-[#E8DCCE] shadow-sm flex flex-col overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-5 border-b border-[#E8DCCE] bg-[#FAF8F5] flex flex-wrap items-center justify-between gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: orderSearch,
    onChange: e => setOrderSearch(e.target.value),
    placeholder: "\u641C\u5C0B\u8A02\u55AE\u7DE8\u865F\u3001\u59D3\u540D\u3001\u96FB\u8A71...",
    className: "px-4 py-2 bg-white border border-[#D4C5B9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8C5A2B]"
  }), /*#__PURE__*/React.createElement("select", {
    value: orderFilter,
    onChange: e => setOrderFilter(e.target.value),
    className: "px-3 py-2 bg-white border border-[#D4C5B9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8C5A2B]"
  }, /*#__PURE__*/React.createElement("option", {
    value: "\u5168\u90E8"
  }, "\u5168\u90E8\u72C0\u614B"), /*#__PURE__*/React.createElement("option", {
    value: "\u5F85\u8655\u7406"
  }, "\u5F85\u8655\u7406"), /*#__PURE__*/React.createElement("option", {
    value: "\u8655\u7406\u4E2D"
  }, "\u8655\u7406\u4E2D"), /*#__PURE__*/React.createElement("option", {
    value: "\u5DF2\u51FA\u8CA8"
  }, "\u5DF2\u51FA\u8CA8"), /*#__PURE__*/React.createElement("option", {
    value: "\u5DF2\u5B8C\u6210"
  }, "\u5DF2\u5B8C\u6210"), /*#__PURE__*/React.createElement("option", {
    value: "\u5DF2\u53D6\u6D88"
  }, "\u5DF2\u53D6\u6D88")))), /*#__PURE__*/React.createElement("div", {
    className: "overflow-x-auto"
  }, /*#__PURE__*/React.createElement("table", {
    className: "w-full text-left text-sm"
  }, /*#__PURE__*/React.createElement("thead", {
    className: "bg-[#FAF8F5] text-[#8C5A2B] font-bold text-xs uppercase border-b border-[#E8DCCE]"
  }, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "\u8A02\u55AE\u7DE8\u865F"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "\u4E0B\u55AE\u6642\u9593"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "\u6536\u4EF6\u4EBA"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "\u96FB\u8A71"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4 text-right"
  }, "\u7E3D\u91D1\u984D"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "\u4ED8\u6B3E\u65B9\u5F0F"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4 text-center"
  }, "\u8A02\u55AE\u72C0\u614B"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4 text-center"
  }, "\u64CD\u4F5C"))), /*#__PURE__*/React.createElement("tbody", {
    className: "divide-y divide-[#E8DCCE]/60"
  }, orders.filter(o => {
    if (orderFilter !== '全部' && o.status !== orderFilter) return false;
    if (!orderSearch) return true;
    const q = orderSearch.toLowerCase();
    return o.orderId && o.orderId.toLowerCase().includes(q) || o.name && o.name.toLowerCase().includes(q) || o.phone && o.phone.includes(q);
  }).map(order => /*#__PURE__*/React.createElement("tr", {
    key: order.orderId,
    className: "hover:bg-[#FAF8F5]/80 transition"
  }, /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 font-mono font-bold text-xs text-[#241D17]"
  }, order.orderId), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 text-xs text-gray-500"
  }, order.date), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 font-bold text-[#4A3B32]"
  }, order.name), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 text-xs font-mono"
  }, order.phone), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 text-right font-bold text-[#8C5A2B]"
  }, "NT$ ", order.total), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 text-xs"
  }, order.payment), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 text-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: `text-xs px-2.5 py-1 rounded-full font-bold ${order.status === '待處理' ? 'badge-pending' : order.status === '已出貨' ? 'badge-info' : order.status === '已完成' ? 'badge-success' : 'badge-danger'}`
  }, order.status)), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 text-center space-x-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setViewingOrder(order),
    className: "px-3 py-1 bg-[#8C5A2B] hover:bg-[#6B421E] text-white rounded-lg text-xs font-bold transition"
  }, "\u67E5\u770B\u660E\u7D30"), /*#__PURE__*/React.createElement("button", {
    onClick: () => handleDeleteOrder(order.orderId),
    className: "px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg text-xs font-bold transition"
  }, "\u522A\u9664")))))))), activeTab === 'cs' && /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-2xl border border-[#E8DCCE] shadow-sm flex flex-col overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-5 border-b border-[#E8DCCE] bg-[#FAF8F5]"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-serif font-bold text-base text-[#241D17]"
  }, "\u8B80\u8005\u53CD\u6620\u8207\u5EFA\u8B70\u7D00\u9304")), /*#__PURE__*/React.createElement("div", {
    className: "divide-y divide-[#E8DCCE]/60"
  }, csMessages.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "p-12 text-center text-gray-400"
  }, "\u76EE\u524D\u5C1A\u7121\u5BA2\u670D\u53CD\u6620\u7D00\u9304") : csMessages.map(msg => /*#__PURE__*/React.createElement("div", {
    key: msg.id,
    className: "p-5 hover:bg-[#FAF8F5]/80 transition flex flex-col md:flex-row justify-between gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-2 flex-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-[#241D17] text-base"
  }, msg.name), /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-gray-400"
  }, msg.date), /*#__PURE__*/React.createElement("span", {
    className: `text-xs px-2 py-0.5 rounded-full font-bold ${msg.status === '未處理' ? 'badge-danger' : 'badge-success'}`
  }, msg.status)), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-[#8C5A2B] font-mono flex gap-4"
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDCDE ", msg.phone || '未提供電話'), /*#__PURE__*/React.createElement("span", null, "\u2709\uFE0F ", msg.email || '未提供 Email')), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-[#4A3B32] bg-[#FAF8F5] p-3 rounded-xl border border-[#E8DCCE]/60 mt-2"
  }, msg.content), msg.replyNote && /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200 mt-1"
  }, /*#__PURE__*/React.createElement("strong", null, "\u56DE\u8986\u5099\u8A3B\uFF1A"), " ", msg.replyNote)), /*#__PURE__*/React.createElement("div", {
    className: "flex md:flex-col items-end justify-center gap-2"
  }, msg.status === '未處理' ? /*#__PURE__*/React.createElement("button", {
    onClick: () => handleUpdateCsStatus(msg.id, '已回覆'),
    className: "px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow"
  }, "\u6A19\u8A18\u70BA\u5DF2\u56DE\u8986") : /*#__PURE__*/React.createElement("button", {
    onClick: () => handleUpdateCsStatus(msg.id, '未處理'),
    className: "px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-xs font-bold transition"
  }, "\u91CD\u8A2D\u70BA\u672A\u8655\u7406"), /*#__PURE__*/React.createElement("button", {
    onClick: () => handleDeleteCs(msg.id),
    className: "px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 rounded-xl text-xs font-bold transition"
  }, "\u522A\u9664\u7D00\u9304")))))), activeTab === 'carousels' && /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-2xl border border-[#E8DCCE] shadow-sm p-6 space-y-6"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-serif font-bold text-lg text-[#241D17]"
  }, "\u9996\u9801\u5927\u5716\u8F2A\u64AD\u7BA1\u7406"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-3 gap-6"
  }, carousels.map((car, idx) => /*#__PURE__*/React.createElement("div", {
    key: car.id || idx,
    className: "bg-[#FAF8F5] rounded-2xl border border-[#E8DCCE] overflow-hidden shadow-sm flex flex-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-44 bg-gray-200 relative overflow-hidden"
  }, /*#__PURE__*/React.createElement("img", {
    src: car.localImage || car.image,
    alt: car.title,
    className: "w-full h-full object-cover"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute top-2 right-2 bg-[#241D17]/80 text-white text-[11px] px-2 py-0.5 rounded-full"
  }, "\u8F2A\u64AD ", idx + 1)), /*#__PURE__*/React.createElement("div", {
    className: "p-4 flex-1 flex flex-col justify-between space-y-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: "font-serif font-bold text-base text-[#241D17]"
  }, car.title), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-600 mt-1 line-clamp-2"
  }, car.description)), /*#__PURE__*/React.createElement("div", {
    className: "pt-2 border-t border-[#E8DCCE] text-right"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold"
  }, car.status || '已發佈'))))))), activeTab === 'settings' && /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-6 rounded-2xl border border-[#E8DCCE] shadow-sm space-y-4"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-serif font-bold text-lg text-[#241D17]"
  }, "\uD83D\uDD12 \u4FEE\u6539\u5F8C\u53F0\u7BA1\u7406\u54E1\u5BC6\u78BC"), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSaveNewPassword,
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold text-[#4A3B32] mb-1"
  }, "\u65B0\u7BA1\u7406\u54E1\u5BC6\u78BC"), /*#__PURE__*/React.createElement("input", {
    type: "password",
    name: "newPwd",
    placeholder: "\u8ACB\u8F38\u5165\u81F3\u5C11 6 \u4F4D\u6578\u5BC6\u78BC",
    className: "w-full px-4 py-2.5 border border-[#D4C5B9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8C5A2B]",
    required: true
  })), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "px-5 py-2.5 bg-[#8C5A2B] hover:bg-[#6B421E] text-white text-xs font-bold rounded-xl shadow transition"
  }, "\u5132\u5B58\u65B0\u5BC6\u78BC"))), /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-6 rounded-2xl border border-[#E8DCCE] shadow-sm space-y-4"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-serif font-bold text-lg text-[#241D17]"
  }, "\u2601\uFE0F Google Apps Script (GAS) API \u7DB2\u5740"), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSaveGasUrl,
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold text-[#4A3B32] mb-1"
  }, "GAS Web App URL"), /*#__PURE__*/React.createElement("input", {
    type: "url",
    name: "gasUrl",
    defaultValue: gasUrl,
    placeholder: "https://script.google.com/macros/s/.../exec",
    className: "w-full px-4 py-2.5 border border-[#D4C5B9] rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#8C5A2B]",
    required: true
  })), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "px-5 py-2.5 bg-[#241D17] hover:bg-[#3D3126] text-white text-xs font-bold rounded-xl shadow transition"
  }, "\u5132\u5B58 API \u7DB2\u5740")))))), editingBook && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-[#FAF8F5] w-full max-w-3xl rounded-2xl shadow-2xl border border-[#8C5A2B]/40 overflow-hidden my-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-[#241D17] text-white px-6 py-4 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-serif font-bold text-lg"
  }, editingBook === 'NEW' ? '➕ 新增書籍至資料庫' : `✏️ 編輯書籍《${bookFormData.title}》`), /*#__PURE__*/React.createElement("button", {
    onClick: () => setEditingBook(null),
    className: "text-gray-400 hover:text-white text-xl font-bold"
  }, "\u2715")), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSaveBook,
    className: "p-6 space-y-5 max-h-[80vh] overflow-y-auto custom-scrollbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-3 gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold text-[#4A3B32] mb-1"
  }, "\u66F8\u78BC (ID) *"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: bookFormData.id,
    onChange: e => setBookFormData({
      ...bookFormData,
      id: e.target.value
    }),
    placeholder: "\u4F8B\u5982\uFF1A00001",
    disabled: editingBook !== 'NEW',
    className: "w-full px-3 py-2 border border-[#D4C5B9] rounded-xl text-sm font-mono bg-white disabled:bg-gray-100",
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "sm:col-span-2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold text-[#4A3B32] mb-1"
  }, "\u66F8\u540D (Title) *"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: bookFormData.title,
    onChange: e => setBookFormData({
      ...bookFormData,
      title: e.target.value
    }),
    placeholder: "\u8ACB\u8F38\u5165\u5B8C\u6574\u66F8\u540D",
    className: "w-full px-3 py-2 border border-[#D4C5B9] rounded-xl text-sm font-serif font-bold bg-white",
    required: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-3 gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold text-[#4A3B32] mb-1"
  }, "\u4F5C\u8005 (Author)"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: bookFormData.author,
    onChange: e => setBookFormData({
      ...bookFormData,
      author: e.target.value
    }),
    placeholder: "\u4F8B\u5982\uFF1A\u660C\u5F7C\u5F97\u8457",
    className: "w-full px-3 py-2 border border-[#D4C5B9] rounded-xl text-sm bg-white"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold text-[#4A3B32] mb-1"
  }, "\u51FA\u7248\u5E74\u4EFD (Year)"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: bookFormData.year,
    onChange: e => setBookFormData({
      ...bookFormData,
      year: e.target.value
    }),
    placeholder: "\u4F8B\u5982\uFF1A82\u5E74 \u5E73\u4E00",
    className: "w-full px-3 py-2 border border-[#D4C5B9] rounded-xl text-sm bg-white"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold text-[#4A3B32] mb-1"
  }, "\u53E2\u66F8\u985E\u5225 (Category)"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: bookFormData.category,
    onChange: e => setBookFormData({
      ...bookFormData,
      category: e.target.value
    }),
    placeholder: "\u4F8B\u5982\uFF1A\u6587\u53F2\u54F2\u5B78\u96C6\u6210",
    className: "w-full px-3 py-2 border border-[#D4C5B9] rounded-xl text-sm bg-white",
    list: "category-options"
  }), /*#__PURE__*/React.createElement("datalist", {
    id: "category-options"
  }, categoriesList.filter(c => c !== '全部').map(c => /*#__PURE__*/React.createElement("option", {
    key: c,
    value: c
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-3 gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold text-[#4A3B32] mb-1"
  }, "\u5B9A\u50F9 (Price NT$)"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: bookFormData.price,
    onChange: e => setBookFormData({
      ...bookFormData,
      price: e.target.value
    }),
    placeholder: "\u4F8B\u5982\uFF1A350",
    className: "w-full px-3 py-2 border border-[#D4C5B9] rounded-xl text-sm bg-white font-mono"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold text-[#4A3B32] mb-1"
  }, "ISBN \u570B\u969B\u66F8\u78BC"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: bookFormData.isbn,
    onChange: e => setBookFormData({
      ...bookFormData,
      isbn: e.target.value
    }),
    placeholder: "\u4F8B\u5982\uFF1A978-957-547-143-9",
    className: "w-full px-3 py-2 border border-[#D4C5B9] rounded-xl text-sm bg-white font-mono"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold text-[#4A3B32] mb-1"
  }, "\u5EAB\u5B58\u6578\u91CF (Stock)"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: bookFormData.stock,
    onChange: e => setBookFormData({
      ...bookFormData,
      stock: e.target.value
    }),
    placeholder: "\u4F8B\u5982\uFF1A10",
    className: "w-full px-3 py-2 border border-[#D4C5B9] rounded-xl text-sm bg-white font-mono"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "p-4 bg-white rounded-xl border border-[#E8DCCE] space-y-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold text-[#8C5A2B]"
  }, "\u66F8\u7C4D\u5C01\u9762\u5716\u7247\u8A2D\u5B9A"), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row gap-4 items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-20 h-28 bg-gray-100 rounded-lg border border-gray-300 overflow-hidden shrink-0 flex items-center justify-center"
  }, /*#__PURE__*/React.createElement("img", {
    src: bookFormData.cover || SVG_FALLBACK,
    onError: e => {
      e.target.src = SVG_FALLBACK;
    },
    alt: "\u9810\u89BD",
    className: "w-full h-full object-cover"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 space-y-2 w-full"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: bookFormData.cover.startsWith('data:') ? '已載入本機圖片 (Base64)' : bookFormData.cover,
    onChange: e => setBookFormData({
      ...bookFormData,
      cover: e.target.value
    }),
    placeholder: "\u8F38\u5165\u5716\u7247\u7DB2\u5740 (Google Drive \u7E2E\u5716\u6216\u4EFB\u4F55\u5716\u7247 URL)",
    className: "w-full px-3 py-2 border border-[#D4C5B9] rounded-lg text-xs bg-[#FAF8F5]"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "cursor-pointer px-3 py-1.5 bg-[#8C5A2B] hover:bg-[#6B421E] text-white text-xs font-bold rounded-lg transition inline-flex items-center gap-1"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-3.5 h-3.5",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
  })), /*#__PURE__*/React.createElement("span", null, "\u9078\u64C7\u672C\u6A5F\u5716\u7247\u4E0A\u50B3"), /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: "image/*",
    onChange: handleImageUpload,
    className: "hidden"
  })), bookFormData.cover && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setBookFormData({
      ...bookFormData,
      cover: ''
    }),
    className: "text-xs text-red-600 hover:underline"
  }, "\u6E05\u9664\u5716\u7247"))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold text-[#4A3B32] mb-1"
  }, "\uD83D\uDCD6 \u66F8\u7C4D\u7C21\u4ECB (Intro / Description)"), /*#__PURE__*/React.createElement("textarea", {
    rows: "4",
    value: bookFormData.intro,
    onChange: e => setBookFormData({
      ...bookFormData,
      intro: e.target.value
    }),
    placeholder: "\u8ACB\u8F38\u5165\u672C\u66F8\u4E4B\u5B78\u8853\u80CC\u666F\u3001\u5167\u5BB9\u6458\u8981\u6216\u51FA\u7248\u7279\u8272...",
    className: "w-full px-3 py-2 border border-[#D4C5B9] rounded-xl text-sm bg-white"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold text-[#4A3B32] mb-1"
  }, "\u270D\uFE0F \u8B80\u5F8C\u5FC3\u5F97\u8207\u5B78\u8853\u8A55\u6790 (Review / Commentary)"), /*#__PURE__*/React.createElement("textarea", {
    rows: "4",
    value: bookFormData.心得,
    onChange: e => setBookFormData({
      ...bookFormData,
      心得: e.target.value
    }),
    placeholder: "\u8ACB\u8F38\u5165\u7DE8\u8F2F\u8A55\u8FF0\u3001\u5C0E\u8B80\u8A55\u6790\u6216\u8B80\u5F8C\u5FC3\u5F97...",
    className: "w-full px-3 py-2 border border-[#D4C5B9] rounded-xl text-sm bg-white"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-end gap-3 pt-4 border-t border-[#E8DCCE]"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setEditingBook(null),
    className: "px-5 py-2.5 rounded-xl border border-[#D4C5B9] text-gray-700 text-sm font-bold hover:bg-gray-100 transition"
  }, "\u53D6\u6D88"), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "px-6 py-2.5 rounded-xl bg-[#8C5A2B] hover:bg-[#6B421E] text-white text-sm font-bold shadow-md transition"
  }, "\u78BA\u8A8D\u5132\u5B58\u66F8\u7C4D"))))), viewingOrder && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-[#FAF8F5] w-full max-w-xl rounded-2xl shadow-2xl border border-[#8C5A2B]/40 overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-[#241D17] text-white px-6 py-4 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-serif font-bold text-lg"
  }, "\u8A02\u55AE\u660E\u7D30 #", viewingOrder.orderId), /*#__PURE__*/React.createElement("button", {
    onClick: () => setViewingOrder(null),
    className: "text-gray-400 hover:text-white text-xl font-bold"
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    className: "p-6 space-y-4 text-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-3 bg-white p-4 rounded-xl border border-[#E8DCCE]"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "\u6536\u4EF6\u4EBA\uFF1A"), " ", viewingOrder.name), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "\u806F\u7D61\u96FB\u8A71\uFF1A"), " ", viewingOrder.phone), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "\u96FB\u5B50\u4FE1\u7BB1\uFF1A"), " ", viewingOrder.email || '無'), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "\u4E0B\u55AE\u6642\u9593\uFF1A"), " ", viewingOrder.date), /*#__PURE__*/React.createElement("div", {
    className: "col-span-2"
  }, /*#__PURE__*/React.createElement("strong", null, "\u5BC4\u9001\u5730\u5740\uFF1A"), " ", viewingOrder.address || '自取 / 門市'), /*#__PURE__*/React.createElement("div", {
    className: "col-span-2"
  }, /*#__PURE__*/React.createElement("strong", null, "\u4ED8\u6B3E\u65B9\u5F0F\uFF1A"), " ", viewingOrder.payment), viewingOrder.memo && /*#__PURE__*/React.createElement("div", {
    className: "col-span-2 text-amber-900 bg-amber-50 p-2 rounded"
  }, /*#__PURE__*/React.createElement("strong", null, "\u5099\u8A3B\uFF1A"), " ", viewingOrder.memo)), /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-4 rounded-xl border border-[#E8DCCE]"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-xs text-[#8C5A2B] uppercase mb-2"
  }, "\u8A02\u8CFC\u5546\u54C1\u6E05\u55AE"), /*#__PURE__*/React.createElement("p", {
    className: "font-mono text-xs whitespace-pre-line text-gray-800"
  }, viewingOrder.items), /*#__PURE__*/React.createElement("div", {
    className: "mt-3 pt-3 border-t border-gray-200 text-right text-base font-bold text-[#8C5A2B]"
  }, "\u7E3D\u91D1\u984D\uFF1ANT$ ", viewingOrder.total)), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between pt-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-bold text-gray-600"
  }, "\u8B8A\u66F4\u72C0\u614B\uFF1A"), ['待處理', '處理中', '已出貨', '已完成', '已取消'].map(st => /*#__PURE__*/React.createElement("button", {
    key: st,
    onClick: () => handleUpdateOrderStatus(viewingOrder.orderId, st),
    className: `text-xs px-2.5 py-1 rounded-lg font-bold ${viewingOrder.status === st ? 'bg-[#8C5A2B] text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`
  }, st))))))));
}
ReactDOM.createRoot(document.getElementById('admin-root')).render( /*#__PURE__*/React.createElement(AdminApp, null));
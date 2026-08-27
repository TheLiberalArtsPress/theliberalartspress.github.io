function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const {
  useState,
  useEffect,
  useMemo,
  useRef,
  memo,
  useCallback
} = React;
const SVG_COVER_FALLBACK = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='600' viewBox='0 0 400 600'%3E%3Crect width='100%25' height='100%25' fill='%23F4EFEA'/%3E%3Crect x='20' y='20' width='360' height='560' fill='none' stroke='%23E8DCCE' stroke-width='2' stroke-dasharray='6 6'/%3E%3Ctext x='50%25' y='48%25' dominant-baseline='middle' text-anchor='middle' font-family='serif' font-size='20' font-weight='bold' fill='%238C5A2B'%3E典籍書目封面%3C/text%3E%3Ctext x='50%25' y='54%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%23BFAF9E'%3E文史哲出版社%3C/text%3E%3C/svg%3E";
const handleImgError = (e, fallbackSrc = SVG_COVER_FALLBACK) => {
  e.target.onerror = null;
  e.target.src = fallbackSrc;
};
const maskName = name => {
  if (!name || name === '-') return '-';
  const str = String(name).trim();
  if (str.length <= 1) return str;
  if (str.length === 2) return str[0] + "○";
  if (str.length === 3) return str[0] + "○" + str[2];
  return str[0] + "○".repeat(str.length - 2) + str[str.length - 1];
};
const maskPhone = phone => {
  if (!phone || phone === '-') return '-';
  const str = String(phone).replace(/^'/, "").trim();
  if (str.length <= 6) return "****";
  return str.substring(0, 3) + "*".repeat(str.length - 6) + str.substring(str.length - 3);
};
const Icon = memo(({
  name,
  size = 18,
  className = ""
}) => {
  const icons = {
    BookOpen: /*#__PURE__*/React.createElement("path", {
      d: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"
    }),
    ShoppingCart: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
      cx: "9",
      cy: "21",
      r: "1"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "20",
      cy: "21",
      r: "1"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
    })),
    Compass: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "10"
    }), /*#__PURE__*/React.createElement("polygon", {
      points: "16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"
    })),
    User: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
      d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "7",
      r: "4"
    })),
    MessageCircle: /*#__PURE__*/React.createElement("path", {
      d: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
    }),
    Search: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
      cx: "11",
      cy: "11",
      r: "8"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "21",
      y1: "21",
      x2: "16.65",
      y2: "16.65"
    })),
    Zap: /*#__PURE__*/React.createElement("polygon", {
      points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2"
    }),
    FileText: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
      d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: "14 2 14 8 20 8"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "16",
      y1: "13",
      x2: "8",
      y2: "13"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "16",
      y1: "17",
      x2: "8",
      y2: "17"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: "10 9 9 9 8 9"
    })),
    ChevronRight: /*#__PURE__*/React.createElement("polyline", {
      points: "9 18 15 12 9 6"
    }),
    ChevronLeft: /*#__PURE__*/React.createElement("polyline", {
      points: "15 18 9 12 15 6"
    }),
    ChevronDown: /*#__PURE__*/React.createElement("polyline", {
      points: "6 9 12 15 18 9"
    }),
    ChevronUp: /*#__PURE__*/React.createElement("polyline", {
      points: "18 15 12 9 6 15"
    }),
    X: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("line", {
      x1: "18",
      y1: "6",
      x2: "6",
      y2: "18"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "6",
      y1: "6",
      x2: "18",
      y2: "18"
    })),
    Sparkles: /*#__PURE__*/React.createElement("path", {
      d: "m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"
    }),
    CheckCircle: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
      d: "M22 11.08V12a10 10 0 1 1-5.93-9.14"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: "22 4 12 14.01 9 11.01"
    })),
    Clock: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "10"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: "12 6 12 12 16 14"
    })),
    Database: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("ellipse", {
      cx: "12",
      cy: "5",
      rx: "9",
      ry: "3"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"
    })),
    Trash2: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("polyline", {
      points: "3 6 5 6 21 6"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "10",
      y1: "11",
      x2: "10",
      y2: "17"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "14",
      y1: "11",
      x2: "14",
      y2: "17"
    })),
    Plus: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "5",
      x2: "12",
      y2: "19"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "5",
      y1: "12",
      x2: "19",
      y2: "12"
    })),
    Minus: /*#__PURE__*/React.createElement("line", {
      x1: "5",
      y1: "12",
      x2: "19",
      y2: "12"
    }),
    RefreshCw: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("polyline", {
      points: "23 4 23 10 17 10"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: "1 20 1 14 7 14"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"
    })),
    MapPin: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
      d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "10",
      r: "3"
    })),
    Phone: /*#__PURE__*/React.createElement("path", {
      d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
    }),
    Mail: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
      d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: "22,6 12,13 2,6"
    })),
    Printer: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("polyline", {
      points: "6 9 6 2 18 2 18 9"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "6",
      y: "14",
      width: "12",
      height: "8"
    })),
    CreditCard: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
      x: "1",
      y: "4",
      width: "22",
      height: "16",
      rx: "2",
      ry: "2"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "1",
      y1: "10",
      x2: "23",
      y2: "10"
    })),
    Globe: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "10"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "2",
      y1: "12",
      x2: "22",
      y2: "12"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
    })),
    LinkIcon: /*#__PURE__*/React.createElement("path", {
      d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
    }),
    Share2: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
      cx: "18",
      cy: "5",
      r: "3"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "6",
      cy: "12",
      r: "3"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "18",
      cy: "19",
      r: "3"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "8.59",
      y1: "13.51",
      x2: "15.42",
      y2: "17.49"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "15.41",
      y1: "6.51",
      x2: "8.59",
      y2: "10.49"
    })),
    Send: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("line", {
      x1: "22",
      y1: "2",
      x2: "11",
      y2: "13"
    }), /*#__PURE__*/React.createElement("polygon", {
      points: "22 2 15 22 11 13 2 9 22 2"
    })),
    Brain: /*#__PURE__*/React.createElement("path", {
      d: "M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"
    }),
    Cpu: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
      x: "4",
      y: "4",
      width: "16",
      height: "16",
      rx: "2"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "9",
      y: "9",
      width: "6",
      height: "6"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M15 2v2 M9 2v2 M15 20v2 M9 20v2 M2 15h2 M2 9h2 M20 15h2 M20 9h2"
    })),
    Info: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "10"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "16",
      x2: "12",
      y2: "12"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "8",
      x2: "12.01",
      y2: "8"
    })),
    Check: /*#__PURE__*/React.createElement("polyline", {
      points: "20 6 9 17 4 12"
    }),
    LayoutDashboard: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
      x: "3",
      y: "3",
      width: "7",
      height: "9"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "14",
      y: "3",
      width: "7",
      height: "5"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "14",
      y: "12",
      width: "7",
      height: "9"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "3",
      y: "16",
      width: "7",
      height: "5"
    })),
    Maximize: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("polyline", {
      points: "15 3 21 3 21 9"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: "9 21 3 21 3 15"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "21",
      y1: "3",
      x2: "14",
      y2: "10"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "3",
      y1: "21",
      x2: "10",
      y2: "14"
    })),
    Minimize: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("polyline", {
      points: "4 14 10 14 10 20"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: "20 10 14 10 14 4"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "14",
      y1: "10",
      x2: "21",
      y2: "3"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "10",
      y1: "14",
      x2: "3",
      y2: "21"
    }))
  };
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: size,
    height: size,
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    fill: "none",
    className: `shrink-0 inline-block ${className}`
  }, icons[name] || /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "8"
  }));
});
const ModernLogo = ({
  className = "w-8 h-8",
  color1 = "var(--dark-color)",
  color2 = "var(--primary-color)"
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 40 40",
  className: className,
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, /*#__PURE__*/React.createElement("polygon", {
  points: "18,30 8,10 13,8 23,28",
  fill: color1
}), /*#__PURE__*/React.createElement("polygon", {
  points: "22,30 32,10 27,8 17,28",
  fill: color2
}));
const GAS_URL = "https://script.google.com/macros/s/AKfycbzfD3v4jWMQVOMIPeoqnZ24XEHoCMFz1h4Tapw4sjPlTAtBa4Ow8TTTNaK8ktssR9F9dg/exec";

// 🟢 【效能優化】：支援動態圖片尺寸 (卡片預設 400px 節省頻寬，Modal 詳細頁載入 1000px 高清圖)
const formatImageUrl = (url, width = 400) => {
  if (!url) return SVG_COVER_FALLBACK;
  let strUrl = String(url).trim();
  if (!strUrl) return SVG_COVER_FALLBACK;
  if (strUrl.startsWith('data:image') || strUrl.startsWith('assets/')) return strUrl;
  let driveId = null;
  if (strUrl.includes('drive.google.com')) {
    const match = strUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) || strUrl.match(/id=([a-zA-Z0-9_-]+)/);
    if (match) driveId = match[1];
  } else if (/^[a-zA-Z0-9_-]{20,}$/.test(strUrl) && !strUrl.includes("/")) {
    driveId = strUrl;
  }
  if (driveId) return `https://drive.google.com/thumbnail?id=${driveId}&sz=w${width}`;
  return strUrl;
};
const safeGetStorage = key => {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    return null;
  }
};
const safeSetStorage = (key, val) => {
  try {
    localStorage.setItem(key, val);
  } catch (e) {}
};
const getBookIntro = book => {
  if (!book) return '';
  for (const key of Object.keys(book)) {
    const k = key.trim().toLowerCase();
    if (k.includes('intro') || k.includes('list') || k.includes('description') || k.includes('簡介') || k.includes('介紹') || k === 'n' || k === '13') {
      const val = String(book[key] || '').trim();
      if (val) return val;
    }
  }
  const customIntro = String(book.intro || book['書籍介紹'] || '').trim();
  if (customIntro) return customIntro;

  const authorName = (book.author && book.author !== '未標記') ? book.author : '名家學者';
  const categoryName = book.category || '文史哲典籍';
  const yearText = book.year ? `，出版於 ${book.year}` : '';
  return `《${book.title}》由 ${authorName} 撰述${yearText}，收錄於文史哲出版社經典系列【${categoryName}】。文史哲出版社自 1971 年由創辦人彭正雄社長創立以來，深耕文史哲學術出版逾半世紀，本著考據翔實、義理通達之精神，為華人文學、歷史考訂與哲學思想傳承重要薪火。本書歷經多年沉澱與學術淬鍊，為研讀相關專題、文獻考據及學人探討之重要典籍。`;
};

const getBookReview = book => {
  if (!book) return '';
  for (const key of Object.keys(book)) {
    const k = key.trim().toLowerCase();
    if (k.includes('心得') || k.includes('review') || k.includes('評析') || k === 'o' || k === '14') {
      const val = String(book[key] || '').trim();
      if (val) return val;
    }
  }
  if (book.title && book.title.includes('塔裡的女人')) {
    return `《塔裡的女人》是一部充滿浪漫與悲劇色彩的愛情小說。閱讀過程中，最令人印象深刻的，不只是男女主角的愛情故事，而是作者對人性、命運與人生選擇的深刻描寫。`;
  }
  const authorName = (book.author && book.author !== '未標記') ? book.author : '作者';
  return `本書凝聚 ${authorName} 深厚之學術造詣與文獻功底。文史哲學術評析指出，此作在版本源流考辨、文史義理梳理與當代文化傳承視角下，皆展現出極高之典藏與學術研讀價值。無論作為博碩士學人深造研究，或文史愛好者研讀考證，皆屬案頭必備之重要著述。`;
};
const fallbackCarousels = [{
  id: 'fb1',
  title: '傳承千年智慧',
  description: '致力於出版高品質文學、歷史、哲學著作。讓深厚底蘊更貼近當代讀者。',
  image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1200'
}];
const fallbackBooks = [{
  id: 'fb_1',
  title: '正在向資料庫索取書籍',
  author: '讀取中',
  year: '讀取中',
  price: 0,
  category: '文學',
  stock: 10,
  cover: SVG_COVER_FALLBACK,
  心得: ''
}];
const defaultUI = {
  themeColor: '#8C5A2B',
  darkThemeColor: '#241D17',
  lightBgColor: '#FAF8F5',
  bgLightColor: '#F4EFEA',
  textDarkColor: '#3D3126',
  borderColor: '#E8DCCE',
  accentColor: '#BFAF9E',
  footerBgColor: '#161210',
  bodyFont: 'Noto Sans TC',
  titleFont: 'Noto Serif TC',
  frontendLogoUrl: '',
  frontendName: '文史哲出版社',
  menuAbout: '關於我們',
  menuPresident: '關於社長',
  menuContact: '聯繫我們',
  menuNewArrivals: '新書上市',
  menuSearch: '書籍檢索',
  menuCart: '我的書包',
  menuAdmin: '臉書(FB)入口',
  heroHeading1: '傳承千年智慧',
  heroHeading2: '點亮數位未來',
  heroSubheading: '致力於出版高品質文學、歷史、哲學著作。讓深厚底蘊更貼近當代讀者。',
  sectionTitleFeatured: '精選好書',
  sectionTitleRecommendation: '編輯特別推薦',
  sectionMoreBooksBtn: '探索更多書籍',
  footerBrandDesc: '創立於1971年，以出版大學院校研究論著及文史書籍為主。在多位名師的傳授與薰陶下，致力為文化出版事業奉獻，傳承千年智慧。',
  footerStoryBtn: '閱讀完整品牌故事',
  footerContactTitle: '聯絡我們',
  footerAddress: '10074 台北市羅斯福路一段七十二巷四號',
  footerPhone: '886-2-2351-1028',
  footerFax: 'Fax: 886-2-2396-5656',
  footerEmail: 'lapentw@gmail.com',
  footerHours: '營業時間：週一到週五 AM9:00~PM6:00',
  footerTransfer: '郵政劃撥：05128812號 彭正雄帳戶',
  footerLinksTitle: '推薦好站',
  footerFacebookLinkText: '文史哲出版社臉書(FB)',
  footerFacebookUrl: 'https://www.facebook.com/people/%E6%96%87%E5%8F%B2%E5%93%B2%E5%87%BA%E7%89%88%E7%A4%BE/61590146114229/?locale=zh_TW',
  footerWikiLinkText: '文史哲出版社（維基百科）',
  footerWikiUrl: 'https://zh.wikipedia.org/wiki/文史哲出版社',
  footerSeriesLinkText: '文史哲學集成（維基百科）',
  footerSeriesUrl: 'https://zh.wikipedia.org/wiki/文史哲學集成',
  footerJournalLinkText: '文史哲學術叢刊（維基百科）',
  footerJournalUrl: 'https://zh.wikipedia.org/wiki/文史哲學術叢刊',
  footerNclLinkText: '國家圖書館',
  footerNclUrl: 'https://www.ncl.edu.tw/',
  footerBookLinkText: '全國新書資訊網(ISBN 書目查詢)',
  footerBookUrl: 'https://isbn.ncl.edu.tw/NEW_ISBNNet/index.php',
  footerCopyright: '傳承文化 ‧ 創新閱讀',
  csTitle: '客服與建議',
  csNamePlaceholder: '您的稱呼',
  csPhonePlaceholder: '聯絡電話',
  csEmailPlaceholder: '電子信箱 (Email)',
  csMessagePlaceholder: '請問您有什麼建議或問題想反映？',
  csSubmitBtn: '送出反映',
  csSubmittingBtn: '傳送中...',
  aboutStoryTitle: '品牌故事',
  aboutCloseBtn: '關閉',
  aboutIntroTitle: '出版社簡介',
  aboutIntroP1: '「文史哲出版社」創立於1971年8月1日，主要致力於出版大學院校研究論著及文史相關書籍。出版範圍涵蓋總類、哲學類、宗教類、社會科學類、史地類、語文類以及美術史類等領域，為華文學術出版的重要推手之一。1992年3月11日改組為「文史哲出版社有限公司」，持續深耕學術出版市場。',
  aboutIntroP2: '本社創辦人彭正雄先生，曾師事台大教授吳相湘，並多次向毛子水、鄭騫、高明等學者請意，亦獲嚴靈峰、戴君仁、夏德儀、昌彼得、林尹等名師指導。在諸位學者的薰陶與傳授之下，逐步培養出對古籍整理的深厚興趣，並奠定投身文化出版事業的志向。',
  aboutConceptTitle: '經營理念',
  aboutConceptP1: '文史哲出版社以出版「文史圖書」及「學術專業圖書」為核心宗旨，目前已累積出版書籍約2500種，其中約2100種仍可供讀者選購。由於學術出版品在海外行銷較具挑戰，本社現正積極拓展網路通路與電子書市場，期望進一步打開華文地區之出版版圖。',
  aboutAuthorTitle: '代表作家與學術著作',
  aboutAuthorIntro: '本社出版眾知知之作家與學者作品，包括：',
  aboutAuthorLit: '文學作家：',
  aboutAuthorLitItems: '無名氏（卜乃夫）《塔裡的女人》\n馮馮《霧航》\n紀弦、羅門、辛鬱等',
  aboutAuthorAcad: '學術著作：',
  aboutAuthorAcadItems: '昌彼得《中國目錄學》\n嚴靈峰、高明、潘重規、林尹、陳新雄、李威熊、黃永武、王更生等學者著作\n龔鵬程、鄭樑生《中日關係史研究論集》（共14冊）\n莊吉發《清史論集》（1–30集）\n《滿語叢刊》（共50冊）\n蔡宗陽《文心雕龍與經學》、《修辭學》等',
  aboutStartExploringBtn: '開始探索好書',
  searchTitle: '書籍目錄查詢',
  searchSubtitle: '圖書檢索',
  searchFilterTitle: '進階篩選器',
  searchLabelCode: '書碼查詢',
  searchLabelTitle: '書名關鍵字',
  searchLabelAuthor: '作者關鍵字',
  searchLabelYear: '出版年',
  searchLabelCategory: '書籍類別 (同步中)',
  searchBtnQuery: '查詢',
  searchTableHeaderCode: '書碼',
  searchTableHeaderTitle: '書名',
  searchTableHeaderAuthor: '作者',
  searchTableHeaderYear: '出版年',
  searchTableHeaderPrice: '定價',
  searchTableHeaderCategory: '叢書類別',
  searchTableHeaderAction: '操作',
  newArrivalsTitle: '新書上市 - 推薦',
  newArrivalsBtnRefresh: '再換一批看看',
  newArrivalsCloseBtn: '關閉',
  cartTitle: '我的書包',
  cartCloseBtn: '關閉',
  cartEmptyText: '目前書包裡空空如也...',
  cartCheckoutTitle: '填寫收件資訊',
  cartLabelName: '收件人姓名',
  cartLabelPhone: '聯絡電話',
  cartLabelEmail: '電子信箱 Email',
  cartLabelAddress: '詳細寄送地址',
  cartLabelPayment: '付款方式',
  cartLabelMemo: '寄件備註 (選填)',
  cartMemoPlaceholder: '若有特殊收件需求請填寫於此...',
  cartBtnCheckout: '確認結帳下單',
  cartCheckingOutBtn: '訂單處理中...',
  cartOptionCash: '店取付現金 (預設)',
  cartOptionTransfer: '銀行轉帳（運費另計）',
  cartTotalLabel: '總計金額',
  cartBookCountLabel: '共 {count} 本書',
  msgLoadingInventory: '完整庫存同步中...',
  msgLoadedInventory: '最新庫存已載入',
  msgLoadingMoreBooks: '正在從雲端載入更多書目...',
  msgOutOfStock: '已售罄',
  msgNoBooksFound: '此分類目前沒有相關書籍喔！',
  msgSearchingBooks: '雲端書庫正在尋找符合此分類的書籍...',
  urlAboutPresident: 'https://hanlinma.github.io/candyni/%E9%97%9C%E6%96%87%E7%A4%BE%E9%95%B7.html',
  urlContactUs: 'https://hanlinma.github.io/candyni/%E8%81%AF%E7%B9%AB%E6%88%91%E5%80%91.html'
};
function App() {
  const initData = typeof window !== "undefined" && (window.INIT_DATA || window.STATIC_DATA) || {};
  const staticData = typeof window !== "undefined" && window.STATIC_DATA || {};
  const [ui, setUi] = useState(() => initData.ui && Object.keys(initData.ui).length > 0 ? initData.ui : defaultUI);
  const [settings, setSettings] = useState(() => initData.settings && Object.keys(initData.settings).length > 0 ? initData.settings : {
    systemName: '文史哲出版社',
    systemSubName: 'The Liberal Arts Press'
  });
  const [carousels, setCarousels] = useState(() => initData.carousels && initData.carousels.length > 0 ? initData.carousels : fallbackCarousels);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [books, setBooks] = useState(() => (staticData.books && staticData.books.length > 0) ? staticData.books : (initData.initialBooks && initData.initialBooks.length > 0 ? initData.initialBooks : []));
  const [choiceBooks, setChoiceBooks] = useState(() => initData.choices && initData.choices.length > 0 ? initData.choices : []);
  const [newArrivalsList, setNewArrivalsList] = useState(() => initData.newArrivalsList || []);
  const [recommendationRound, setRecommendationRound] = useState(0);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isRecommendationHovered, setIsRecommendationHovered] = useState(false);
  const [isCartDetailsOpen, setIsCartDetailsOpen] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState('店取付現金');
  const [isBooksLoading, setIsBooksLoading] = useState(() => !(staticData.books && staticData.books.length > 0));
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSubmittingCS, setIsSubmittingCS] = useState(false);
  const [lastActionTime, setLastActionTime] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [visibleCount, setVisibleCount] = useState(8);
  const [iframeModal, setIframeModal] = useState({
    isOpen: false,
    url: '',
    title: ''
  });
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isRandomBooksOpen, setIsRandomBooksOpen] = useState(false);
  const randomBooksScrollRef = useRef(null);
  const [searchForm, setSearchForm] = useState({
    code: '',
    title: '',
    author: '',
    year: '',
    category: ''
  });
  const [appliedSearch, setAppliedSearch] = useState({
    code: '',
    title: '',
    author: '',
    year: '',
    category: ''
  });
  const [searchVisibleCount, setSearchVisibleCount] = useState(8);
  const [randomBooks, setRandomBooks] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isAllCategoriesExpanded, setIsAllCategoriesExpanded] = useState(false);
  const [submittedDetail, setSubmittedDetail] = useState(null);
  const [isOrderQueryOpen, setIsOrderQueryOpen] = useState(false);
  const [orderQueryInput, setOrderQueryInput] = useState('');
  const [queryResults, setQueryResults] = useState([]);
  const [isQueryingGAS, setIsQueryingGAS] = useState(false);
  const [hasQueried, setHasQueried] = useState(false);
  const [selectedBookDetail, setSelectedBookDetail] = useState(null);
  const [isBookDetailFullscreen, setIsBookDetailFullscreen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewBook, setReviewBook] = useState(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiSelectedBookId, setAiSelectedBookId] = useState('');
  const [aiAnalysisResult, setAiAnalysisResult] = useState('');
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiCustomQuestion, setAiCustomQuestion] = useState('');
  const [logoClickCount, setLogoClickCount] = useState(0);
  const sliderRef = useRef(null);
  const hasFetchedRef = useRef(false);
  const showMsg = useCallback(text => {
    setNotification(text);
    setTimeout(() => setNotification(null), 3000);
  }, []);
  const checkRateLimit = useCallback(() => {
    return true;
  }, []);
  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll, {
      passive: true
    });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 🔍 SEO 與專屬書籍 / 分類直達網址支援 (?book=ID 或 ?category=名稱)
  useEffect(() => {
    if (!books || books.length === 0) return;
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const bookParam = urlParams.get('book') || urlParams.get('id');
      const catParam = urlParams.get('category');
      if (bookParam) {
        const found = books.find(b => String(b.id) === String(bookParam) || b.title === bookParam);
        if (found) setSelectedBookDetail(found);
      }
      if (catParam) {
        setSelectedCategory(catParam);
        const searchEl = document.getElementById('search-section') || document.querySelector('.search-table-container');
        if (searchEl) searchEl.scrollIntoView({ behavior: 'smooth' });
      }
    } catch(e) {
      console.warn("URL parse error:", e);
    }
  }, [books]);

  // 🏷️ 結構化數據 (Schema.org / JSON-LD) 與動態標題
  useEffect(() => {
    if (selectedBookDetail) {
      const title = `《${selectedBookDetail.title}》${selectedBookDetail.author ? `・${selectedBookDetail.author}` : ''} - 文史哲出版社官方網站`;
      document.title = title;
      try {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('book', selectedBookDetail.id || selectedBookDetail.title);
        window.history.replaceState(null, '', currentUrl.toString());
      } catch(e) {}

      let script = document.getElementById('schema-book-jsonld');
      if (!script) {
        script = document.createElement('script');
        script.id = 'schema-book-jsonld';
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      const cleanAuthor = String(selectedBookDetail.author || '').replace(/著|編|校|註|輯/g, '').trim();
      const bookSchema = {
        "@context": "https://schema.org",
        "@type": "Book",
        "name": selectedBookDetail.title,
        "headline": `《${selectedBookDetail.title}》- 文史哲出版社`,
        "author": {
          "@type": "Person",
          "name": cleanAuthor || "文史哲作者",
          "sameAs": `https://zh.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(cleanAuthor)}`
        },
        "publisher": {
          "@type": "Organization",
          "name": "文史哲出版社有限公司",
          "url": "https://theliberalartspress.github.io/",
          "foundingDate": "1971"
        },
        "offers": {
          "@type": "Offer",
          "price": selectedBookDetail.price || 0,
          "priceCurrency": "TWD",
          "availability": (selectedBookDetail.stock > 0 || selectedBookDetail.stock === undefined) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          "url": window.location.href
        },
        "image": selectedBookDetail.localCover ? `https://theliberalartspress.github.io/${selectedBookDetail.localCover}` : selectedBookDetail.cover,
        "description": getBookIntro(selectedBookDetail),
        "genre": selectedBookDetail.category || "學術文史",
        "inLanguage": "zh-Hant",
        "keywords": `${selectedBookDetail.title}, ${cleanAuthor}, ${selectedBookDetail.category}, 文史哲出版社, 國學研究, 古典文獻, 學術出版`,
        "sameAs": [
          `https://zh.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(selectedBookDetail.title)}`,
          `https://scholar.google.com.tw/scholar?q=${encodeURIComponent(selectedBookDetail.title + ' ' + cleanAuthor)}`,
          `https://aleweb.ncl.edu.tw/F?func=find-b&find_code=WRD&request=${encodeURIComponent(selectedBookDetail.title)}`
        ]
      };
      if (selectedBookDetail.isbn) bookSchema.isbn = selectedBookDetail.isbn;
      script.textContent = JSON.stringify(bookSchema);
    } else {
      document.title = '文史哲出版社官方網站｜1971年創立・文學歷史哲學專業學術出版';
      try {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.delete('book');
        currentUrl.searchParams.delete('id');
        window.history.replaceState(null, '', currentUrl.pathname + (currentUrl.searchParams.toString() ? '?' + currentUrl.searchParams.toString() : ''));
      } catch(e) {}
      const script = document.getElementById('schema-book-jsonld');
      if (script) script.remove();
    }
  }, [selectedBookDetail]);
  const syncWithGAS = useCallback(async (action, payloadData = null) => {
    try {
      const currentOrigin = window.location.origin;
      const safeOrigin = currentOrigin.includes("usercontent.goog") ? "https://candylovema.github.io" : currentOrigin;
      const payloadObj = {
        action,
        payload: payloadData,
        origin: safeOrigin
      };
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const response = await fetch(GAS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payloadObj),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return await response.json();
    } catch (e) {
      return {
        status: 'error',
        msg: e.toString()
      };
    }
  }, []);

  // 🟢 雙重事件驅動 + 即時響應載入全館 2,632 冊書籍
    useEffect(() => {
        const applyLoadedData = (customData) => {
            const dataToUse = customData || (typeof window !== "undefined" ? window.STATIC_DATA : null);
            if (dataToUse && dataToUse.books && dataToUse.books.length > 0) {
                setBooks(dataToUse.books);
                if (dataToUse.choices) setChoiceBooks(dataToUse.choices);
                if (dataToUse.newArrivalsList) setNewArrivalsList(dataToUse.newArrivalsList);
                if (dataToUse.carousels) setCarousels(dataToUse.carousels);
                if (dataToUse.settings) setSettings(prev => ({ ...prev, ...dataToUse.settings }));
                if (dataToUse.ui) setUi(prev => ({ ...prev, ...dataToUse.ui }));
                setIsBooksLoading(false);
                return true;
            }
            return false;
        };

        // 1. 若已經在記憶體中，立即套用
        if (applyLoadedData()) return;

        // 2. 監聽 data.js 載入完成的自訂廣播事件
        const onDataLoaded = (e) => {
            applyLoadedData(e.detail);
        };
        window.addEventListener('lapenDataLoaded', onDataLoaded);

        // 3. 備用輪詢（確保在任何特殊瀏覽器事件遺失情況下也能捕捉）
        const interval = setInterval(() => {
            if (applyLoadedData()) {
                clearInterval(interval);
                window.removeEventListener('lapenDataLoaded', onDataLoaded);
            }
        }, 100);

        return () => {
            window.removeEventListener('lapenDataLoaded', onDataLoaded);
            clearInterval(interval);
        };
    }, []);
  const handleOrderQuerySubmit = async e => {
    e.preventDefault();
    const term = orderQueryInput.trim().toLowerCase();
    if (term.length < 2) return showMsg("請輸入至少 2 個字以供精確比對");
    setIsQueryingGAS(true);
    setHasQueried(true);

    // 1. 優先比對本機訂單資料
    let localMatches = [];
    try {
      const cachedOrders = localStorage.getItem('lapen_admin_orders');
      if (cachedOrders) {
        const parsed = JSON.parse(cachedOrders);
        localMatches = parsed.filter(ord => {
          const oId = String(ord.orderId || ord.id || ord['訂單編號'] || '').toLowerCase();
          const oCust = String(ord.name || ord.customer || ord['客戶姓名'] || '').toLowerCase();
          const oPhone = String(ord.phone || ord['電話'] || '').toLowerCase();
          return oId.includes(term) || oCust.includes(term) || oPhone.includes(term);
        });
      }
    } catch (err) {}

    // 2. 查詢線上後端訂單資料
    try {
      const res = await syncWithGAS('QUERY_ORDER', {
        query: term
      });
      if (res && res.status === 'success' && Array.isArray(res.data) && res.data.length > 0) {
        const combined = [...localMatches, ...res.data];
        const uniqueOrders = Array.from(new Map(combined.map(item => [item.orderId || item.id, item])).values());
        setQueryResults(uniqueOrders);
      } else if (localMatches.length > 0) {
        setQueryResults(localMatches);
      } else {
        setQueryResults([]);
        showMsg("未找到符合的訂單記錄");
      }
    } catch (error) {
      if (localMatches.length > 0) {
        setQueryResults(localMatches);
      } else {
        showMsg("查詢出錯，請稍候重試");
      }
    } finally {
      setIsQueryingGAS(false);
    }
  };
  useEffect(() => {
    if (carousels.length <= 1) return;
    const timer = setInterval(() => setCarouselIndex(prev => (prev + 1) % carousels.length), 5000);
    return () => clearInterval(timer);
  }, [carousels.length]);
  const dynamicCategories = useMemo(() => {
    const priorityCats = ['文史哲學集成', '文史哲學術叢刊', '文學叢刊', '文史哲詩叢'];
    const existingCats = [...new Set(books.map(b => b.category).filter(c => c && c.trim() !== ""))];
    const presentPriority = priorityCats.filter(cat => existingCats.includes(cat));
    const remainingPriority = priorityCats.filter(cat => !existingCats.includes(cat));
    const orderedPriority = [...presentPriority, ...remainingPriority];
    const otherCats = existingCats.filter(c => !priorityCats.includes(c) && c !== '全部');
    return ['全部', ...orderedPriority, ...otherCats];
  }, [books]);
  const visibleCategories = useMemo(() => {
    if (isAllCategoriesExpanded) return dynamicCategories;
    return dynamicCategories.slice(0, 5);
  }, [dynamicCategories, isAllCategoriesExpanded]);
  const excelCategories = useMemo(() => {
    const cats = books.map(b => b.category).filter(c => c && c.trim() !== "");
    return [...new Set(cats)].sort();
  }, [books]);
  const filteredBooks = useMemo(() => {
    const list = selectedCategory === '全部' ? books : books.filter(b => b.category === selectedCategory);
    const shuffled = [...list];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [books, selectedCategory]);
  const visibleBooks = useMemo(() => filteredBooks.slice(0, visibleCount), [filteredBooks, visibleCount]);
  const displayChoiceBooks = useMemo(() => {
    const sourceList = choiceBooks.length > 0 ? choiceBooks : books.slice(0, 10);
    return sourceList.map(cb => {
      const liveBook = books.find(b => b.id && cb.id && String(b.id) === String(cb.id) || b.title && cb.title && b.title === cb.title);
      if (liveBook) {
        return {
          ...cb,
          ...liveBook,
          price: liveBook.price !== undefined ? liveBook.price : cb.price,
          cover: liveBook.localCover || liveBook.cover || cb.cover || cb.image
        };
      }
      return cb;
    });
  }, [choiceBooks, books]);
  const analyzeBookWithGemini = async (targetBook, customQ = "") => {
    if (!targetBook) return;
    setIsAiAnalyzing(true);
    setAiAnalysisResult("");
    try {
      const apiKey = "";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
      const systemPrompt = `你是一位享譽華文出版界的權威國學專家與「文史哲出版社」資深學術總編輯。你的任務是針對華文書籍進行極具深度、嚴謹、精闢且優美的學術解析與導讀。請以典雅流暢的繁體中文回答。`;
      let userPrompt = `請為以下書籍進行深度學術解析與閱讀導引：\n`;
      userPrompt += `■ 書名：${targetBook.title}\n`;
      userPrompt += `■ 作者：${targetBook.author || '未標明'}\n`;
      userPrompt += `■ 出版年份：${targetBook.year || '未標明'}\n`;
      userPrompt += `■ 叢書類別：${targetBook.category || '通用'}\n`;
      userPrompt += `■ 書籍編號：${targetBook.id || '無'}\n`;
      const bookIntroText = getBookIntro(targetBook);
      if (bookIntroText) userPrompt += `■ 既有書籍介紹與綱要：${bookIntroText}\n`;
      const bookReviewThought = getBookReview(targetBook);
      if (bookReviewThought) userPrompt += `■ 編輯部特色心得評析：${bookReviewThought}\n`;
      if (customQ.trim()) {
        userPrompt += `\n【讀者特別提問】：${customQ.trim()}\n請針對上述問題進行深入解答。`;
      } else {
        userPrompt += `\n請包含以下四大解讀維度：\n`;
        userPrompt += `1. 📜【時代背景與學術脈絡】（分析本書在該領域的歷史定位與學術價值）\n`;
        userPrompt += `2. 💡【三大核心旨趣與研讀亮點】（列出最值得細細品味的3個重點）\n`;
        userPrompt += `3. 🎯【適合閱讀對象與深度思考題】（提供給研究者或一般讀者的進階思考方向）\n`;
        userPrompt += `4. ✒️【主編精闢一句話導讀】（用一句深具文化底蘊的話總結本書靈魂）`;
      }
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: userPrompt
            }]
          }],
          systemInstruction: {
            parts: [{
              text: systemPrompt
            }]
          }
        })
      });
      const result = await response.json();
      const generatedText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      setAiAnalysisResult(generatedText || "⚠️ 無法取得 AI 分析結果，請稍後重試。");
    } catch (error) {
      setAiAnalysisResult(`❌ AI 分析過程發生錯誤：${error.message}`);
    } finally {
      setIsAiAnalyzing(false);
    }
  };
  const handleLogoSecretClick = () => {
    const newCount = logoClickCount + 1;
    setLogoClickCount(newCount);
    if (newCount >= 3) {
      setLogoClickCount(0);
      setIsAiModalOpen(true);
      if (books.length > 0 && !aiSelectedBookId) {
        const firstBook = books[0];
        setAiSelectedBookId(firstBook.id || firstBook.title);
        analyzeBookWithGemini(firstBook);
      }
      showMsg("✨ 已解鎖隱藏 AI 書籍學術分析儀！");
    }
  };
  const getRecommendedBooksForRound = roundIdx => {
    const designatedRaw = (newArrivalsList && newArrivalsList.length > 0) ? newArrivalsList : (choiceBooks && choiceBooks.length > 0 ? choiceBooks : []);
    const designatedBooks = designatedRaw.map(cb => {
      const live = books.find(b => (b.id && cb.id && String(b.id) === String(cb.id)) || (b.title && cb.title && b.title === cb.title));
      return live ? { ...cb, ...live, cover: live.localCover || live.cover || cb.cover || cb.image } : cb;
    }).filter(Boolean);

    const pageSize = 8;
    const totalDesignatedRounds = Math.ceil(designatedBooks.length / pageSize);

    if (roundIdx < totalDesignatedRounds) {
      const start = roundIdx * pageSize;
      const slice = designatedBooks.slice(start, start + pageSize);
      if (slice.length > 0) {
        if (slice.length < pageSize && books.length > slice.length) {
          const sliceIds = new Set(slice.map(b => b.id || b.title));
          const fillers = books.filter(b => !sliceIds.has(b.id || b.title)).sort(() => 0.5 - Math.random()).slice(0, pageSize - slice.length);
          return [...slice, ...fillers];
        }
        return slice;
      }
    }

    if (books.length > 0) {
      const shuffled = [...books].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, pageSize);
    }
    return [];
  };

  const openRandomBooksModal = (isNextRound = false) => {
    setIsMobileMenuOpen(false);
    let nextRound = 0;
    if (isNextRound === true) {
      nextRound = recommendationRound + 1;
      setRecommendationRound(nextRound);
    } else {
      setRecommendationRound(0);
      nextRound = 0;
    }
    const resultBooks = getRecommendedBooksForRound(nextRound);
    setRandomBooks(resultBooks);
    setIsRandomBooksOpen(true);
    if (isNextRound) {
      setTimeout(() => {
        if (randomBooksScrollRef.current) {
          randomBooksScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
        const scrollEl = document.getElementById('random-books-scroll-container');
        if (scrollEl) {
          scrollEl.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 50);
    }
  };
  const openReviewModalForBook = book => {
    setReviewBook(book);
    setIsReviewModalOpen(true);
  };
  const handleReviewSubmit = async e => {
    e.preventDefault();
    if (isSubmittingReview || !checkRateLimit()) return;
    const name = sanitizeInput(e.target.name.value);
    const contact = sanitizeInput(e.target.contact.value);
    const content = sanitizeInput(e.target.content.value);
    if (name.length < 2) return showMsg("請輸入您的稱呼");
    if (content.length < 5) return showMsg("讀後感言請至少輸入 5 個字");
    setIsSubmittingReview(true);
    setLastActionTime(Date.now());
    showMsg("心得傳送中...");
    const combinedQuery = `【書籍名稱】《${reviewBook ? reviewBook.title : '未知'}》\n【聯絡資訊】${contact || '未提供'}\n─────────────────\n【讀後心得感言】\n${content}`;
    const submitId = `REV-${Date.now().toString().slice(-6)}`;
    const newLog = {
      id: submitId,
      platform: 'Web讀後心得交流',
      user: name,
      query: combinedQuery
    };
    const res = await syncWithGAS('NEW_CS_MSG', newLog);
    setIsSubmittingReview(false);
    if (res && res.status === 'success') {
      e.target.reset();
      setIsReviewModalOpen(false);
      showMsg("感謝您的寶貴心得，已成功送出與編輯部交流！");
    } else {
      showMsg(`傳送失敗：${res ? res.msg : '伺服器無回應'}`);
    }
  };
  const handleSearchSubmit = e => {
    e.preventDefault();
    setAppliedSearch(searchForm);
    setSearchVisibleCount(8);
  };
  const indexSearchBooks = useMemo(() => {
    return books.filter(b => {
      const matchCode = !appliedSearch.code || b.id && b.id.toString().includes(appliedSearch.code);
      const matchTitle = !appliedSearch.title || b.title && b.title.includes(appliedSearch.title);
      const matchAuthor = !appliedSearch.author || b.author && b.author.includes(appliedSearch.author);
      const matchPage = !appliedSearch.year || b.year && b.year.toString().includes(appliedSearch.year);
      const matchCat = !appliedSearch.category || appliedSearch.category === '全部' || b.category === appliedSearch.category;
      return matchCode && matchTitle && matchAuthor && matchPage && matchCat;
    });
  }, [books, appliedSearch]);
  const visibleSearchBooks = useMemo(() => indexSearchBooks.slice(0, searchVisibleCount), [indexSearchBooks, searchVisibleCount]);
  const addToCart = book => {
    if (book.stock <= 0) return showMsg("抱歉，目前缺貨中！");
    setCart(prev => {
      const existing = prev.find(i => i.id === book.id);
      if (existing) return prev.map(i => i.id === book.id ? {
        ...i,
        qty: i.qty + 1
      } : i);
      return [...prev, {
        ...book,
        qty: 1
      }];
    });
    showMsg(`已加入書包: ${book.title}`);
  };
  const removeFromCart = id => setCart(prev => prev.filter(i => i.id !== id));
  const updateCartQty = (id, delta) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = i.qty + delta;
        if (newQty < 1) return null;
        if (newQty > i.stock) {
          showMsg("已達庫存上限！");
          return i;
        }
        return {
          ...i,
          qty: newQty
        };
      }
      return i;
    }).filter(Boolean));
  };
  const cartTotal = useMemo(() => cart.reduce((sum, i) => sum + (Number(i.price) || 0) * i.qty, 0), [cart]);
  const sanitizeInput = val => {
    if (val === undefined || val === null) return "";
    let str = String(val).trim();
    if (/^[=\+\-\@]/.test(str)) return "'" + str;
    return str;
  };
  const handleCheckout = async e => {
    e.preventDefault();
    if (isCheckingOut || !checkRateLimit()) return;
    const formData = new FormData(e.target);
    const info = Object.fromEntries(formData);
    const name = sanitizeInput(info.name);
    const phone = sanitizeInput(info.phone);
    const email = sanitizeInput(info.email);
    const address = sanitizeInput(info.address);
    const memo = sanitizeInput(info.memo);
    if (name.length < 2) return showMsg("請輸入正確的收件人姓名");
    if (!/^\+?[0-9\-\s]{8,15}$/.test(info.phone.replace(/[^0-9\+]/g, ''))) return showMsg("請輸入有效的聯絡電話");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email)) return showMsg("請輸入正確的電子信箱格式");
    if (address.length < 6) return showMsg("請輸入正確的詳細寄送地址");
    setIsCheckingOut(true);
    setLastActionTime(Date.now());
    showMsg("訂單處理中，請稍候...");
    const now = new Date();
    const pad = n => n.toString().padStart(2, '0');
    const formattedDate = `${now.getFullYear()}/${pad(now.getMonth() + 1)}/${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    const rawItems = cart.map(i => ({
      title: i.title,
      qty: i.qty,
      price: i.price
    }));
    const itemsStr = cart.map(i => `${sanitizeInput(i.title)} (數量: ${i.qty})`).join('\n');
    const dateStr = `${now.getFullYear().toString().slice(-2)}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
    const randStr = Math.floor(1000 + Math.random() * 9000);
    const orderId = `ORD-${dateStr}-${randStr}`;
    const newOrder = {
      orderId: orderId,
      id: orderId,
      name: name,
      customer: name,
      phone: phone,
      email: email,
      address: address,
      payment: info.payment,
      items: itemsStr,
      total: cartTotal,
      status: '待處理',
      date: formattedDate,
      memo: memo,
      '訂單編號': orderId,
      '客戶姓名': name,
      '電話': phone,
      '電子信箱': email,
      'Email': email,
      '地址': address,
      '付款方式': info.payment,
      '購買項目': itemsStr,
      '總金額': cartTotal,
      '狀態': '待處理',
      '日期': formattedDate
    };

    try {
      // 💾 同步存入後台本機資料庫
      try {
        const existingOrders = JSON.parse(localStorage.getItem('lapen_admin_orders') || '[]');
        localStorage.setItem('lapen_admin_orders', JSON.stringify([newOrder, ...existingOrders]));
      } catch (e) {}

      // 🚀 異步背景發送至 Google 雲端
      syncWithGAS('CREATE_ORDER', newOrder).catch(err => console.log("Order sync error:", err));

      setBooks(books.map(b => {
        const ci = cart.find(c => c.id === b.id);
        return ci ? {
          ...b,
          stock: b.stock - ci.qty
        } : b;
      }));
      setSubmittedDetail({
        type: 'order',
        data: {
          id: orderId,
          customer: name,
          phone,
          email,
          address,
          payment: info.payment,
          memo,
          date: formattedDate,
          total: cartTotal,
          items: rawItems
        }
      });
      setCart([]);
      setIsCartOpen(false);
      showMsg(`訂單已成功建立！訂單編號：${orderId}`);
    } finally {
      setIsCheckingOut(false);
    }
  };
  const handleCSSubmit = async e => {
    e.preventDefault();
    if (isSubmittingCS) return;
    const formData = new FormData(e.target);
    const name = sanitizeInput(formData.get("name") || "");
    const phone = sanitizeInput(formData.get("phone") || "");
    const email = sanitizeInput(formData.get("email") || "");
    const msg = sanitizeInput(formData.get("message") || "");

    if (name.length < 2) return showMsg("請輸入您的稱呼");
    if (!phone || phone.length < 8) return showMsg("請輸入有效的聯絡電話");
    if (!email || !email.includes("@")) return showMsg("請輸入正確的電子信箱格式");
    if (msg.length < 2) return showMsg("反映內容請至少輸入2個字");

    setIsSubmittingCS(true);
    const submitId = `CS-${Date.now().toString().slice(-6)}`;
    const newLog = {
      id: submitId,
      msgId: submitId,
      name: name,
      userName: name,
      user: name,
      phone: phone,
      tel: phone,
      email: email,
      mail: email,
      content: msg,
      message: msg,
      msg: msg,
      date: new Date().toLocaleString(),
      status: '未處理',
      platform: 'Web官網',
      query: `【聯絡電話】${phone}\n【Email信箱】${email}\n─────────────────\n【反映內容】\n${msg}`,
      '留言編號': submitId,
      '稱呼': name,
      '姓名': name,
      '電話': phone,
      '電子信箱': email,
      '反映內容': msg,
      '狀態': '未處理',
      '時間': new Date().toLocaleString()
    };

    // 💾 同步存入後台本機客服留言庫
    try {
      const existingCS = JSON.parse(localStorage.getItem('lapen_admin_cs') || '[]');
      localStorage.setItem('lapen_admin_cs', JSON.stringify([newLog, ...existingCS]));
    } catch (err) {}

    // 🚀 背景異步發送至 Google 雲端
    syncWithGAS('NEW_CS_MSG', newLog).catch(err => console.log("CS sync error:", err));

    setSubmittedDetail({
      type: 'cs',
      data: {
        id: submitId,
        name,
        phone,
        email,
        message: msg,
        date: new Date().toLocaleString()
      }
    });
    setIsContactOpen(false);
    setIsSubmittingCS(false);
    showMsg("感謝您的反映，客服專員將盡快回覆！");
  };
  const scrollSlider = direction => {
    if (sliderRef.current) {
      const {
        scrollLeft,
        clientWidth,
        scrollWidth
      } = sliderRef.current;
      const maxScroll = scrollWidth - clientWidth;
      if (direction === 'right') {
        if (scrollLeft >= maxScroll - 15) sliderRef.current.scrollTo({
          left: 0,
          behavior: 'smooth'
        });else sliderRef.current.scrollTo({
          left: scrollLeft + clientWidth * 0.8,
          behavior: 'smooth'
        });
      } else {
        if (scrollLeft <= 15) sliderRef.current.scrollTo({
          left: maxScroll,
          behavior: 'smooth'
        });else sliderRef.current.scrollTo({
          left: scrollLeft - clientWidth * 0.8,
          behavior: 'smooth'
        });
      }
    }
  };
  useEffect(() => {
    if (displayChoiceBooks.length === 0 || isRecommendationHovered) return;
    const timer = setInterval(() => scrollSlider('right'), 3800);
    return () => clearInterval(timer);
  }, [displayChoiceBooks.length, isRecommendationHovered]);
  const renderListFromLines = (text, defaultLines) => {
    const lines = text ? text.split('\n').filter(l => l.trim() !== '') : defaultLines;
    return lines.map((line, idx) => /*#__PURE__*/React.createElement("li", {
      key: idx
    }, line));
  };
  const rootStyle = {
    '--primary-color': ui.themeColor,
    '--dark-color': ui.darkThemeColor,
    '--bg-color': ui.lightBgColor,
    '--bg-light': ui.bgLightColor,
    '--text-dark': ui.textDarkColor,
    '--border-color': ui.borderColor,
    '--accent-color': ui.accentColor,
    '--footer-bg': ui.footerBgColor
  };
  return /*#__PURE__*/React.createElement("div", {
    style: rootStyle,
    className: "min-h-screen font-serif transition-all duration-300 relative pb-10 flex flex-col"
  }, /*#__PURE__*/React.createElement("nav", {
    className: "p-3.5 md:px-8 flex justify-between items-center glass-nav sticky top-0 z-40 transition-all"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2.5 sm:space-x-3 select-none shrink-0 group"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2.5 cursor-pointer",
    onClick: () => window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, ui.frontendLogoUrl ? /*#__PURE__*/React.createElement("img", {
    src: formatImageUrl(ui.frontendLogoUrl, 200),
    className: "w-8 h-8 md:w-9 md:h-9 object-contain",
    alt: "Logo",
    onError: e => handleImgError(e, SVG_COVER_FALLBACK)
  }) : /*#__PURE__*/React.createElement(ModernLogo, {
    className: "w-8 h-8 md:w-9 md:h-9 transition-transform group-hover:rotate-6"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col whitespace-nowrap"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-base md:text-xl font-black text-[var(--dark-color)] tracking-[0.06em] font-sans"
  }, ui.frontendName || settings.systemName), /*#__PURE__*/React.createElement("span", {
    className: "text-[8px] md:text-[9px] tracking-[0.22em] text-[var(--primary-color)] font-sans font-bold uppercase block"
  }, ui.systemSubName || settings.systemSubName))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setIsMobileMenuOpen(!isMobileMenuOpen),
    className: "lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--primary-color)] text-white font-sans font-bold text-xs shadow-md hover:bg-[var(--dark-color)] active:scale-95 transition-all border border-white/40 ml-1",
    "aria-label": "\u529F\u80FD\u9078\u55AE\u5207\u63DB"
  }, /*#__PURE__*/React.createElement("span", null, isMobileMenuOpen ? "收合選單" : "展開選單"), /*#__PURE__*/React.createElement(Icon, {
    name: "ChevronDown",
    size: 15,
    className: `transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-180' : ''}`
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2 xl:space-x-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hidden lg:flex space-x-1 xl:space-x-3 text-xs xl:text-[14px] font-sans font-bold text-[var(--text-dark)] items-center whitespace-nowrap"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setIsAboutOpen(true),
    className: "hover:text-[var(--primary-color)] hover:bg-white/60 transition-all flex items-center gap-1.5 px-3 py-2 rounded-full"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Compass",
    size: 16
  }), " ", ui.menuAbout), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setIframeModal({
      isOpen: true,
      url: ui.urlAboutPresident,
      title: ui.menuPresident
    }),
    className: "hover:text-[var(--primary-color)] hover:bg-white/60 transition-all flex items-center gap-1.5 px-3 py-2 rounded-full"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "User",
    size: 16
  }), " ", ui.menuPresident), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setIframeModal({
      isOpen: true,
      url: ui.urlContactUs,
      title: ui.menuContact
    }),
    className: "hover:text-[var(--primary-color)] hover:bg-white/60 transition-all flex items-center gap-1.5 px-3 py-2 rounded-full"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "MessageCircle",
    size: 16
  }), " ", ui.menuContact), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: openRandomBooksModal,
    className: "hover:text-[var(--primary-color)] hover:bg-white/60 transition-all flex items-center gap-1.5 px-3 py-2 rounded-full"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Zap",
    size: 16
  }), " ", ui.menuNewArrivals), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setIsSearchModalOpen(true),
    className: "hover:text-[var(--primary-color)] hover:bg-white/60 transition-all flex items-center gap-1.5 px-3 py-2 rounded-full"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Search",
    size: 16
  }), " ", ui.menuSearch), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setIsOrderQueryOpen(true),
    className: "text-white bg-[var(--primary-color)] hover:bg-[var(--dark-color)] transition-all flex items-center gap-1.5 px-4 py-2 rounded-full shadow-sm hover:shadow active:scale-95"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "FileText",
    size: 15
  }), " \u8A02\u55AE\u67E5\u8A62")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2 xl:space-x-3 border-l pl-2 xl:pl-4 border-[var(--border-color)] shrink-0"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setIsCartOpen(true),
    className: "relative bg-white/80 border border-[var(--accent-color)]/70 text-[var(--dark-color)] px-3.5 xl:px-5 py-2 rounded-full flex items-center gap-2 hover:bg-[var(--primary-color)] hover:text-white hover:border-[var(--primary-color)] transition-all shadow-sm font-sans font-bold group"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "ShoppingCart",
    size: 17,
    className: "group-hover:scale-110 transition-transform"
  }), /*#__PURE__*/React.createElement("span", {
    className: "hidden sm:inline"
  }, ui.menuCart), cart.length > 0 && /*#__PURE__*/React.createElement("span", {
    className: "absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[11px] min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center font-bold shadow-md border-2 border-white animate-bounce"
  }, cart.length)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => window.open('https://www.facebook.com/people/%E6%96%87%E5%8F%B2%E5%93%B2%E5%87%BA%E7%89%88%E7%A4%BE/61590146114229/?locale=zh_TW', '_blank'),
    className: "hidden sm:flex bg-[#1877F2] text-white px-4 py-2 rounded-full text-xs xl:text-sm font-sans items-center gap-1.5 hover:bg-[#145CB8] transition-all shadow-sm font-bold active:scale-95"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "LayoutDashboard",
    size: 16
  }), " ", /*#__PURE__*/React.createElement("span", {
    className: "hidden md:inline"
  }, ui.menuAdmin)))), isMobileMenuOpen && /*#__PURE__*/React.createElement("div", {
    className: "absolute top-full left-0 w-full glass-modal border-b border-[var(--border-color)] shadow-2xl flex flex-col p-3 lg:hidden z-50 animate-in font-sans rounded-b-2xl"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      setIsMobileMenuOpen(false);
      setIsAboutOpen(true);
    },
    className: "text-left font-bold text-[var(--text-dark)] hover:text-[var(--primary-color)] hover:bg-white/60 p-3 rounded-xl flex items-center gap-3 transition"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Compass",
    size: 18,
    className: "text-[var(--primary-color)]"
  }), " ", ui.menuAbout), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      setIsMobileMenuOpen(false);
      setIframeModal({
        isOpen: true,
        url: ui.urlAboutPresident,
        title: ui.menuPresident
      });
    },
    className: "text-left font-bold text-[var(--text-dark)] hover:text-[var(--primary-color)] hover:bg-white/60 p-3 rounded-xl flex items-center gap-3 transition"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "User",
    size: 18,
    className: "text-[var(--primary-color)]"
  }), " ", ui.menuPresident), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      setIsMobileMenuOpen(false);
      setIframeModal({
        isOpen: true,
        url: ui.urlContactUs,
        title: ui.menuContact
      });
    },
    className: "text-left font-bold text-[var(--text-dark)] hover:text-[var(--primary-color)] hover:bg-white/60 p-3 rounded-xl flex items-center gap-3 transition"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "MessageCircle",
    size: 18,
    className: "text-[var(--primary-color)]"
  }), " ", ui.menuContact), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      setIsMobileMenuOpen(false);
      openRandomBooksModal();
    },
    className: "text-left font-bold text-[var(--text-dark)] hover:text-[var(--primary-color)] hover:bg-white/60 p-3 rounded-xl flex items-center gap-3 transition"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Zap",
    size: 18,
    className: "text-[var(--primary-color)]"
  }), " ", ui.menuNewArrivals), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      setIsMobileMenuOpen(false);
      setIsSearchModalOpen(true);
    },
    className: "text-left font-bold text-[var(--text-dark)] hover:text-[var(--primary-color)] hover:bg-white/60 p-3 rounded-xl flex items-center gap-3 transition"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Search",
    size: 18,
    className: "text-[var(--primary-color)]"
  }), " ", ui.menuSearch), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      setIsMobileMenuOpen(false);
      setIsOrderQueryOpen(true);
    },
    className: "text-left font-bold text-[var(--primary-color)] hover:bg-white/60 p-3 rounded-xl flex items-center gap-3 transition"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "FileText",
    size: 18,
    className: "text-[var(--primary-color)]"
  }), " \u8A02\u55AE\u67E5\u8A62"), /*#__PURE__*/React.createElement("div", {
    className: "border-t border-[var(--border-color)]/60 my-1"
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      setIsMobileMenuOpen(false);
      window.open('https://www.facebook.com/people/%E6%96%87%E5%8F%B2%E5%93%B2%E5%87%BA%E7%89%88%E7%A4%BE/61590146114229/?locale=zh_TW', '_blank');
    },
    className: "text-center font-bold text-white bg-[#1877F2] p-3 rounded-xl flex items-center justify-center gap-2 transition sm:hidden shadow-md mx-1 my-1"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "LayoutDashboard",
    size: 16
  }), " ", ui.menuAdmin))), /*#__PURE__*/React.createElement("main", {
    className: "flex-1 max-w-7xl mx-auto w-full p-4 md:p-8"
  }, /*#__PURE__*/React.createElement("section", {
    className: "text-center mb-6 py-8 animate-in"
  }, /*#__PURE__*/React.createElement("span", {
    className: "inline-block text-[11px] font-sans font-bold tracking-[0.3em] uppercase text-[var(--primary-color)] bg-[var(--primary-color)]/10 px-3.5 py-1 rounded-full mb-3"
  }, "Est. 1971 \u30FB \u5C08\u696D\u4EBA\u6587\u5B78\u8853\u8AD6\u8457\u51FA\u7248"), /*#__PURE__*/React.createElement("h2", {
    className: "text-3xl md:text-5xl font-black mb-4 text-[var(--dark-color)] leading-tight font-serif tracking-widest"
  }, ui.heroHeading1, " ", /*#__PURE__*/React.createElement("span", {
    className: "text-[var(--primary-color)]"
  }, ui.heroHeading2)), /*#__PURE__*/React.createElement("p", {
    className: "text-[var(--text-dark)] max-w-2xl mx-auto leading-relaxed text-base md:text-lg font-sans font-medium"
  }, ui.heroSubheading)), carousels.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "relative w-full max-w-6xl mx-auto h-[320px] md:h-[460px] rounded-3xl overflow-hidden shadow-2xl mb-14 group border border-white/60 bg-[#1A1412] flex items-center justify-center"
  }, carousels.map((c, idx) => {
    const isFbSlide = c.title?.toLowerCase().includes('fb') || c.title?.includes('臉書') || c.description?.toLowerCase().includes('fb') || c.description?.includes('臉書') || c.image?.includes('61590146114229') || c.id === 'fb1' || idx === 0;
    const slideLink = c.link || c.url || (isFbSlide ? "https://www.facebook.com/people/%E6%96%87%E5%8F%B2%E5%93%B2%E5%87%BA%E7%89%88%E7%A4%BE/61590146114229/?locale=zh_TW" : null);
    const SlideContainer = slideLink ? 'a' : 'div';
    const slideProps = slideLink ? {
      href: slideLink,
      target: "_blank",
      rel: "noopener noreferrer",
      className: `absolute inset-0 transition-opacity duration-1000 flex items-center justify-center cursor-pointer group/slide ${idx === carouselIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`
    } : {
      className: `absolute inset-0 transition-opacity duration-1000 flex items-center justify-center ${idx === carouselIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`
    };
    const bannerImgSrc = formatImageUrl(c.image || c.localImage, 1200);
    return /*#__PURE__*/React.createElement(SlideContainer, _extends({
      key: c.id || idx
    }, slideProps), /*#__PURE__*/React.createElement("img", {
      src: bannerImgSrc,
      alt: "",
      "aria-hidden": "true",
      className: "absolute inset-0 w-full h-full object-cover blur-2xl scale-125 opacity-40 brightness-75 pointer-events-none"
    }), /*#__PURE__*/React.createElement("div", {
      className: "absolute inset-0 bg-gradient-to-t from-[var(--dark-color)]/90 via-transparent to-black/20 z-10 pointer-events-none"
    }), /*#__PURE__*/React.createElement("img", {
      src: bannerImgSrc,
      alt: c.title || "Banner",
      className: "relative z-10 w-full h-full object-contain mx-auto transition-transform duration-700 group-hover/slide:scale-[1.01]",
      onError: e => handleImgError(e, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1200')
    }), /*#__PURE__*/React.createElement("div", {
      className: "absolute bottom-0 left-0 right-0 z-20 p-6 md:p-10 text-white flex flex-col md:flex-row md:items-end justify-between gap-4"
    }, /*#__PURE__*/React.createElement("div", null, c.title && /*#__PURE__*/React.createElement("h3", {
      className: "text-2xl md:text-4xl font-black mb-2 font-serif tracking-widest text-[var(--bg-light)] drop-shadow-md"
    }, c.title), c.description && /*#__PURE__*/React.createElement("p", {
      className: "text-xs md:text-base max-w-3xl text-stone-200 line-clamp-2 drop-shadow font-sans leading-relaxed"
    }, c.description)), isFbSlide && /*#__PURE__*/React.createElement("div", {
      className: "shrink-0 inline-flex items-center gap-2 bg-blue-600/90 hover:bg-blue-600 text-white font-sans font-bold text-xs md:text-sm px-4 py-2.5 rounded-full shadow-lg transition-all hover:scale-105"
    }, /*#__PURE__*/React.createElement("span", null, "\u9EDE\u64CA\u524D\u5F80\u5B98\u65B9\u81C9\u66F8\u7C89\u7D72\u5C08\u9801 \u2197"))));
  }), carousels.length > 1 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setCarouselIndex(prev => (prev - 1 + carousels.length) % carousels.length),
    className: "absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-[var(--dark-color)] text-white p-2.5 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 border border-white/20"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "ChevronLeft",
    size: 20
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setCarouselIndex(prev => (prev + 1) % carousels.length),
    className: "absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-[var(--dark-color)] text-white p-2.5 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 border border-white/20"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "ChevronRight",
    size: 20
  })))), /*#__PURE__*/React.createElement("section", {
    id: "new-books",
    className: "mb-16 scroll-mt-24"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-end mb-6 border-b border-[var(--border-color)] pb-3"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-2xl md:text-3xl font-black text-[var(--dark-color)] flex items-center gap-2.5 font-serif tracking-widest"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "BookOpen",
    size: 28,
    className: "text-[var(--primary-color)]"
  }), " ", ui.sectionTitleFeatured), isBooksLoading ? /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-[var(--primary-color)] font-sans font-bold flex items-center gap-1.5 bg-[var(--border-color)]/40 px-3 py-1 rounded-full"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "RefreshCw",
    size: 12,
    className: "animate-spin"
  }), " ", ui.msgLoadingInventory) : /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-[var(--text-dark)] font-sans font-bold flex items-center gap-1.5 bg-white/70 border border-[var(--border-color)]/60 px-3 py-1 rounded-full"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Database",
    size: 12
  }), " ", ui.msgLoadedInventory)), /*#__PURE__*/React.createElement("div", {
    className: "mb-10 relative group",
    onMouseEnter: () => setIsRecommendationHovered(true),
    onMouseLeave: () => setIsRecommendationHovered(false)
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-lg font-bold text-[var(--text-dark)] flex items-center gap-2 mb-3 px-1"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Sparkles",
    size: 18,
    className: "text-[var(--primary-color)]"
  }), " ", ui.sectionTitleRecommendation), /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => scrollSlider('left'),
    className: "absolute -left-3 md:-left-4 top-[45%] -translate-y-1/2 z-10 bg-white/90 backdrop-blur-md border border-[var(--border-color)] hover:bg-[var(--bg-light)] p-2.5 rounded-full text-[var(--text-dark)] shadow-md transition-all"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "ChevronLeft",
    size: 20
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => scrollSlider('right'),
    className: "absolute -right-3 md:-right-4 top-[45%] -translate-y-1/2 z-10 bg-white/90 backdrop-blur-md border border-[var(--border-color)] hover:bg-[var(--bg-light)] p-2.5 rounded-full text-[var(--text-dark)] shadow-md transition-all"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "ChevronRight",
    size: 20
  })), /*#__PURE__*/React.createElement("div", {
    ref: sliderRef,
    className: "flex overflow-x-auto gap-5 snap-x snap-mandatory hide-scrollbar pb-4 px-1 pt-1"
  }, displayChoiceBooks.map(book => /*#__PURE__*/React.createElement("div", {
    key: `rec-${book.id}`,
    className: "min-w-[240px] w-[240px] snap-start shrink-0 glass-card rounded-2xl overflow-hidden flex flex-col cursor-pointer group/card",
    onClick: () => setSelectedBookDetail(book)
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-52 bg-[var(--bg-light)]/60 relative overflow-hidden p-3.5 flex justify-center items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full relative book-spine-shadow group-hover/card:scale-105 transition-transform duration-500 rounded overflow-hidden"
  }, /*#__PURE__*/React.createElement("img", {
    src: formatImageUrl(book.cover, 400),
    loading: "lazy",
    decoding: "async",
    className: "h-full w-auto object-contain rounded",
    alt: book.title,
    onError: e => handleImgError(e, SVG_COVER_FALLBACK)
  })), /*#__PURE__*/React.createElement("div", {
    className: "absolute top-2.5 left-2.5 bg-gradient-to-r from-[var(--primary-color)] to-[var(--dark-color)] text-white text-[11px] px-2.5 py-1 rounded-md font-sans font-bold shadow-md border border-white/30 z-10"
  }, book.category), book.stock <= 0 && /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 bg-[var(--dark-color)]/80 backdrop-blur-[2px] flex items-center justify-center text-white font-black tracking-[0.2em] text-sm"
  }, ui.msgOutOfStock)), /*#__PURE__*/React.createElement("div", {
    className: "p-4 flex flex-col flex-1 bg-white/70 border-t border-[var(--border-color)]/40"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-base mb-1 text-[var(--dark-color)] line-clamp-1 group-hover/card:text-[var(--primary-color)] transition-colors",
    title: book.title
  }, book.title), /*#__PURE__*/React.createElement("p", {
    className: "text-[var(--primary-color)] font-black text-base font-sans mt-auto mb-2.5"
  }, "NT$ ", book.price), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: e => {
      e.stopPropagation();
      addToCart(book);
    },
    className: "w-full bg-white border border-[var(--accent-color)]/70 text-[var(--text-dark)] py-1.5 rounded-xl font-bold hover:bg-[var(--primary-color)] hover:border-[var(--primary-color)] hover:text-white transition-all text-xs flex justify-center items-center gap-1.5 shadow-sm active:scale-95"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "ShoppingCart",
    size: 13
  }), " \u52A0\u5165\u66F8\u5305"))))))), dynamicCategories.length > 1 && /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2.5 mb-8 justify-center font-sans border-t border-[var(--border-color)]/60 pt-6"
  }, visibleCategories.map(cat => /*#__PURE__*/React.createElement("button", {
    type: "button",
    key: cat,
    onClick: () => {
      setSelectedCategory(cat);
      setVisibleCount(8);
    },
    className: `px-5 py-2 rounded-full text-sm font-bold transition-all border ${selectedCategory === cat ? 'bg-[var(--dark-color)] text-white border-[var(--dark-color)] shadow-md scale-105' : 'bg-white/80 border-[var(--border-color)] text-[var(--text-dark)] hover:border-[var(--primary-color)] hover:bg-white'}`
  }, cat)), dynamicCategories.length > 5 && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setIsAllCategoriesExpanded(!isAllCategoriesExpanded),
    className: "px-5 py-2 rounded-full text-sm font-bold transition-all border border-[var(--primary-color)] text-[var(--primary-color)] bg-white/80 hover:bg-[var(--primary-color)] hover:text-white flex items-center gap-1 active:scale-95"
  }, isAllCategoriesExpanded ? "收合類別" : "更多類別", /*#__PURE__*/React.createElement(Icon, {
    name: isAllCategoriesExpanded ? "ChevronUp" : "ChevronDown",
    size: 14
  }))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
  }, isBooksLoading && books.length <= 1 ? Array.from({
    length: 8
  }).map((_, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "glass-card rounded-2xl overflow-hidden p-4 space-y-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-60 rounded-xl skeleton-shimmer"
  }), /*#__PURE__*/React.createElement("div", {
    className: "h-5 w-3/4 rounded skeleton-shimmer"
  }), /*#__PURE__*/React.createElement("div", {
    className: "h-4 w-1/3 rounded skeleton-shimmer"
  }))) : visibleBooks.map(book => /*#__PURE__*/React.createElement("div", {
    key: book.id,
    className: "group glass-card rounded-2xl overflow-hidden flex flex-col cursor-pointer",
    onClick: () => setSelectedBookDetail(book)
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-64 bg-[var(--bg-light)]/50 relative overflow-hidden p-4 flex justify-center items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full relative book-spine-shadow group-hover:scale-105 transition-transform duration-500 rounded overflow-hidden"
  }, /*#__PURE__*/React.createElement("img", {
    src: formatImageUrl(book.cover, 400),
    loading: "lazy",
    decoding: "async",
    className: "h-full w-auto object-contain rounded",
    alt: book.title,
    onError: e => handleImgError(e, SVG_COVER_FALLBACK)
  })), /*#__PURE__*/React.createElement("div", {
    className: "absolute top-3 left-3 bg-gradient-to-r from-[var(--primary-color)] to-[var(--dark-color)] text-white text-xs px-2.5 py-1 rounded-md font-sans font-bold shadow-md border border-white/30 z-10"
  }, book.category), book.stock <= 0 && /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 bg-[var(--dark-color)]/75 backdrop-blur-[2px] flex items-center justify-center text-white font-black tracking-[0.3em] text-xl"
  }, ui.msgOutOfStock)), /*#__PURE__*/React.createElement("div", {
    className: "p-5 flex flex-col flex-1 bg-white/80 border-t border-[var(--border-color)]/40"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-lg mb-2 text-[var(--dark-color)] line-clamp-2 font-serif leading-snug group-hover:text-[var(--primary-color)] transition-colors",
    title: book.title
  }, book.title), /*#__PURE__*/React.createElement("p", {
    className: "text-[var(--primary-color)] font-black mb-4 text-xl font-sans mt-auto"
  }, "NT$ ", book.price), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: e => {
      e.stopPropagation();
      addToCart(book);
    },
    className: "w-full bg-white border border-[var(--accent-color)]/70 text-[var(--text-dark)] py-2.5 rounded-xl font-bold hover:bg-[var(--primary-color)] hover:border-[var(--primary-color)] hover:text-white transition-all flex items-center justify-center gap-2 font-sans shadow-sm active:scale-95 text-sm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "ShoppingCart",
    size: 16
  }), " \u52A0\u5165\u66F8\u5305"))))), visibleBooks.length === 0 && !isBooksLoading && /*#__PURE__*/React.createElement("div", {
    className: "py-16 text-center font-bold text-[var(--primary-color)] flex flex-col items-center justify-center gap-2"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Database",
    size: 32
  }), /*#__PURE__*/React.createElement("span", null, ui.msgNoBooksFound)), filteredBooks.length > visibleCount && /*#__PURE__*/React.createElement("div", {
    className: "text-center mt-12 font-sans relative"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 flex items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full border-t border-[var(--border-color)]/60"
  })), /*#__PURE__*/React.createElement("div", {
    className: "relative flex justify-center"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setVisibleCount(prev => prev + 8),
    className: "bg-white border border-[var(--accent-color)] text-[var(--text-dark)] px-7 py-2.5 rounded-full font-bold hover:bg-[var(--dark-color)] hover:text-white transition-all shadow-sm flex items-center gap-2 text-sm active:scale-95"
  }, ui.sectionMoreBooksBtn, " ", /*#__PURE__*/React.createElement(Icon, {
    name: "ChevronRight",
    size: 16
  })))))), /*#__PURE__*/React.createElement("footer", {
    className: "bg-[var(--footer-bg)] text-[var(--accent-color)] pt-14 pb-8 font-sans border-t-4 border-[var(--primary-color)] mt-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-7xl mx-auto px-6 lg:px-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "md:col-span-4 flex flex-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3.5 mb-5"
  }, ui.frontendLogoUrl ? /*#__PURE__*/React.createElement("img", {
    src: formatImageUrl(ui.frontendLogoUrl, 200),
    className: "w-10 h-10 object-contain",
    alt: "Logo",
    onError: e => handleImgError(e, SVG_COVER_FALLBACK)
  }) : /*#__PURE__*/React.createElement(ModernLogo, {
    className: "w-10 h-10",
    color1: "#FAF8F5",
    color2: "var(--primary-color)"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: "text-xl font-sans font-black text-white tracking-[0.12em]"
  }, ui.frontendName || settings.systemName), /*#__PURE__*/React.createElement("span", {
    className: "text-[9px] font-bold tracking-[0.2em] text-[var(--primary-color)] uppercase"
  }, ui.systemSubName || settings.systemSubName))), /*#__PURE__*/React.createElement("p", {
    className: "text-xs md:text-sm leading-relaxed mb-5 text-justify text-stone-300"
  }, ui.footerBrandDesc), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setIsAboutOpen(true),
    className: "text-white border border-white/20 bg-white/5 hover:bg-[var(--primary-color)] px-4 py-2 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1.5 w-max"
  }, ui.footerStoryBtn, " ", /*#__PURE__*/React.createElement(Icon, {
    name: "ChevronRight",
    size: 14
  }))), /*#__PURE__*/React.createElement("div", {
    className: "md:col-span-5"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-base font-bold text-white mb-4 border-b border-white/10 pb-2.5 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "MapPin",
    size: 16,
    className: "text-[var(--primary-color)]"
  }), " ", ui.footerContactTitle), /*#__PURE__*/React.createElement("ul", {
    className: "space-y-3 text-xs md:text-sm"
  }, /*#__PURE__*/React.createElement("li", {
    className: "flex items-start gap-2.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "MapPin",
    size: 16,
    className: "mt-0.5 shrink-0 text-[var(--primary-color)]"
  }), " ", /*#__PURE__*/React.createElement("span", null, ui.footerAddress)), /*#__PURE__*/React.createElement("li", {
    className: "flex items-center gap-2.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Phone",
    size: 16,
    className: "shrink-0 text-[var(--primary-color)]"
  }), " ", /*#__PURE__*/React.createElement("span", null, ui.footerPhone)), /*#__PURE__*/React.createElement("li", {
    className: "flex items-center gap-2.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Printer",
    size: 16,
    className: "shrink-0 text-[var(--primary-color)]"
  }), " ", /*#__PURE__*/React.createElement("span", null, ui.footerFax)), /*#__PURE__*/React.createElement("li", {
    className: "flex items-center gap-2.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Mail",
    size: 16,
    className: "shrink-0 text-[var(--primary-color)]"
  }), " ", /*#__PURE__*/React.createElement("a", {
    href: `mailto:${ui.footerEmail}`,
    className: "hover:text-white transition"
  }, ui.footerEmail)), /*#__PURE__*/React.createElement("li", {
    className: "flex items-center gap-2.5 text-stone-200"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Clock",
    size: 16,
    className: "shrink-0 text-[var(--primary-color)]"
  }), /*#__PURE__*/React.createElement("span", {
    className: "bg-white/10 px-2.5 py-0.5 rounded text-xs font-bold"
  }, ui.footerHours)), /*#__PURE__*/React.createElement("li", {
    className: "flex items-center gap-2.5 border-t border-white/10 pt-3"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "CreditCard",
    size: 16,
    className: "shrink-0 text-[var(--primary-color)]"
  }), " ", /*#__PURE__*/React.createElement("span", null, ui.footerTransfer)))), /*#__PURE__*/React.createElement("div", {
    className: "md:col-span-3"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-base font-bold font-serif text-white mb-4 border-b border-white/10 pb-2.5 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "LinkIcon",
    size: 16,
    className: "text-amber-500"
  }), " ", ui.footerLinksTitle || '推薦好站'), /*#__PURE__*/React.createElement("ul", {
    className: "space-y-2 text-xs md:text-sm"
  }, [
    { text: ui.footerFacebookLinkText || '文史哲出版社臉書(FB)', url: ui.footerFacebookUrl || 'https://www.facebook.com/people/%E6%96%87%E5%8F%B2%E5%93%B2%E5%87%BA%E7%89%88%E7%A4%BE/61590146114229/?locale=zh_TW' },
    { text: ui.footerWikiLinkText || '文史哲出版社（維基百科）', url: ui.footerWikiUrl || 'https://zh.wikipedia.org/wiki/%E6%96%87%E5%8F%B2%E5%93%B2%E5%87%BA%E7%89%88%E7%A4%BE' },
    { text: ui.footerSeriesLinkText || '文史哲學集成（維基百科）', url: ui.footerSeriesUrl || 'https://zh.wikipedia.org/wiki/%E6%96%87%E5%8F%B2%E5%93%B2%E5%AD%B8%E9%9B%86%E6%88%90' },
    { text: ui.footerJournalLinkText || '文史哲學術叢刊（維基百科）', url: ui.footerJournalUrl || 'https://zh.wikipedia.org/wiki/%E6%96%87%E5%8F%B2%E5%93%B2%E5%AD%B8%E8%A1%93%E5%8F%A2%E5%88%8A' },
    { text: ui.footerNclLinkText || '國家圖書館', url: ui.footerNclUrl || 'https://www.ncl.edu.tw/' },
    { text: ui.footerBookLinkText || '全國新書資訊網(ISBN 書目查詢)', url: ui.footerBookUrl || 'https://isbn.ncl.edu.tw/NEW_ISBNNet/index.php' }
  ].map((item, idx) => /*#__PURE__*/React.createElement("li", {
    key: idx
  }, /*#__PURE__*/React.createElement("a", {
    href: item.url,
    target: "_blank",
    rel: "noreferrer",
    className: "hover:text-white hover:translate-x-1 transition-all flex items-center gap-3 bg-[#241D17]/80 hover:bg-[#3D3126] border border-white/10 hover:border-amber-500/40 p-2.5 rounded-xl shadow-sm text-stone-200 group"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-2 h-2 rounded-full bg-amber-600 shrink-0 group-hover:scale-125 transition-transform"
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-serif tracking-wide text-xs sm:text-sm font-medium"
  }, item.text))))))), /*#__PURE__*/React.createElement("div", {
    className: "mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-stone-400 font-bold"
  }, /*#__PURE__*/React.createElement("p", null, "\xA9 ", new Date().getFullYear(), " ", ui.frontendName || settings.systemName, " ", ui.systemSubName || settings.systemSubName, "."), /*#__PURE__*/React.createElement("p", {
    className: "mt-2 md:mt-0 flex items-center gap-2 cursor-pointer select-none",
    onClick: handleLogoSecretClick,
    title: "\u9EDE\u64CA\u4E09\u6B21\u89E3\u9396\u96B1\u85CF AI \u5206\u6790"
  }, /*#__PURE__*/React.createElement(ModernLogo, {
    className: "w-3.5 h-3.5 opacity-40 hover:opacity-100 transition-opacity",
    color1: "#FFF",
    color2: "#FFF"
  }), /*#__PURE__*/React.createElement("span", null, ui.footerCopyright), /*#__PURE__*/React.createElement(Icon, {
    name: "Sparkles",
    size: 11,
    className: "text-amber-400 opacity-60"
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3"
  }, isContactOpen && /*#__PURE__*/React.createElement("div", {
    className: "glass-modal w-80 shadow-2xl rounded-2xl border border-[var(--border-color)] overflow-hidden animate-in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-dark p-3.5 text-white flex justify-between items-center font-sans border-b-2 border-[var(--primary-color)]"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-bold flex items-center gap-2 text-sm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "MessageCircle",
    size: 16
  }), " ", ui.csTitle), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setIsContactOpen(false),
    className: "hover:bg-white/20 p-1 rounded-full transition"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "X",
    size: 15
  }))), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleCSSubmit,
    className: "p-4 space-y-3 font-sans"
  }, /*#__PURE__*/React.createElement("input", {
    name: "name",
    placeholder: ui.csNamePlaceholder,
    required: true,
    className: "w-full border border-[var(--border-color)] glass-input p-2 rounded-xl text-xs outline-none"
  }), /*#__PURE__*/React.createElement("input", {
    name: "phone",
    placeholder: ui.csPhonePlaceholder,
    required: true,
    className: "w-full border border-[var(--border-color)] glass-input p-2 rounded-xl text-xs outline-none"
  }), /*#__PURE__*/React.createElement("input", {
    name: "email",
    type: "email",
    placeholder: ui.csEmailPlaceholder,
    required: true,
    className: "w-full border border-[var(--border-color)] glass-input p-2 rounded-xl text-xs outline-none"
  }), /*#__PURE__*/React.createElement("textarea", {
    name: "message",
    placeholder: ui.csMessagePlaceholder,
    required: true,
    className: "w-full border border-[var(--border-color)] glass-input p-2 text-xs rounded-xl h-20 outline-none resize-none"
  }), /*#__PURE__*/React.createElement("button", {
    disabled: isSubmittingCS,
    className: `w-full bg-[var(--primary-color)] hover:bg-[var(--dark-color)] text-white py-2.5 rounded-xl font-bold shadow transition-all flex justify-center items-center gap-1.5 text-xs ${isSubmittingCS ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`
  }, isSubmittingCS ? /*#__PURE__*/React.createElement(Icon, {
    name: "Clock",
    size: 14,
    className: "animate-spin"
  }) : null, isSubmittingCS ? ui.csSubmittingBtn : ui.csSubmitBtn))), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col gap-2.5"
  }, showBackToTop && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => window.scrollTo({
      top: 0,
      behavior: 'smooth'
    }),
    className: "bg-white/90 text-[var(--dark-color)] hover:bg-[var(--dark-color)] hover:text-white w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all border border-[var(--border-color)] self-end animate-in"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "ChevronUp",
    size: 20
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setIsContactOpen(!isContactOpen),
    className: "bg-[var(--primary-color)] text-white hover:bg-[var(--dark-color)] w-12 h-12 rounded-full shadow-xl flex items-center justify-center hover:scale-105 transition-all border-2 border-white"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: isContactOpen ? "X" : "MessageCircle",
    size: 22
  })))), isAboutOpen && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 bg-black/60 backdrop-blur-md z-[150] flex justify-center items-center p-4 md:p-8",
    onClick: () => setIsAboutOpen(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-modal w-full max-w-3xl max-h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in border border-white/80",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-dark p-4 flex justify-between items-center border-b-2 border-[var(--primary-color)]"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-serif font-black text-white flex items-center gap-2.5 tracking-wider"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Compass",
    size: 20,
    className: "text-[var(--primary-color)]"
  }), " ", ui.aboutStoryTitle), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setIsAboutOpen(false),
    className: "bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full text-xs font-bold text-white transition flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "X",
    size: 14
  }), " ", ui.aboutCloseBtn)), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 overflow-y-auto p-6 md:p-10 font-sans"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl md:text-3xl font-sans font-black text-[var(--dark-color)] mb-6 text-center tracking-[0.08em] border-b pb-4 border-[var(--border-color)]"
  }, ui.frontendName || settings.systemName), /*#__PURE__*/React.createElement("div", {
    className: "space-y-6 text-[var(--text-dark)] leading-relaxed text-justify text-sm md:text-base"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-lg text-[var(--dark-color)] mb-2 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Compass",
    size: 18,
    className: "text-[var(--primary-color)]"
  }), " ", ui.aboutIntroTitle), /*#__PURE__*/React.createElement("p", {
    className: "drop-cap"
  }, ui.aboutIntroP1)), /*#__PURE__*/React.createElement("div", {
    className: "bg-[var(--bg-light)] p-5 rounded-2xl border-l-4 border-[var(--primary-color)] text-xs md:text-sm"
  }, ui.aboutIntroP2), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-lg text-[var(--dark-color)] mb-2 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Globe",
    size: 18,
    className: "text-[var(--primary-color)]"
  }), " ", ui.aboutConceptTitle), /*#__PURE__*/React.createElement("p", null, ui.aboutConceptP1)), /*#__PURE__*/React.createElement("div", {
    className: "pt-4 border-t border-[var(--border-color)]/60"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-lg text-[var(--dark-color)] mb-3 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "BookOpen",
    size: 18,
    className: "text-[var(--primary-color)]"
  }), " ", ui.aboutAuthorTitle), /*#__PURE__*/React.createElement("div", {
    className: "glass-dark text-stone-200 p-5 rounded-2xl space-y-4 text-xs md:text-sm"
  }, /*#__PURE__*/React.createElement("p", null, ui.aboutAuthorIntro), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-[var(--primary-color)] font-bold block mb-1"
  }, ui.aboutAuthorLit), /*#__PURE__*/React.createElement("ul", {
    className: "list-disc list-inside pl-2 space-y-1"
  }, renderListFromLines(ui.aboutAuthorLitItems, ['無名氏（卜乃夫）《塔裡的女人》', '馮馮《霧航》', '紀弦、羅門、辛鬱等']))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-[var(--primary-color)] font-bold block mb-1"
  }, ui.aboutAuthorAcad), /*#__PURE__*/React.createElement("ul", {
    className: "list-disc list-inside pl-2 space-y-1"
  }, renderListFromLines(ui.aboutAuthorAcadItems, ['昌彼得《中國目錄學》', '嚴靈峰、高明、潘重規、林尹等學者著作'])))))), /*#__PURE__*/React.createElement("div", {
    className: "mt-8 text-center"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setIsAboutOpen(false),
    className: "bg-[var(--primary-color)] hover:bg-[var(--dark-color)] text-white px-7 py-2.5 rounded-full font-bold shadow transition-colors text-sm"
  }, ui.aboutStartExploringBtn))))), isSearchModalOpen && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 glass-modal z-[150] overflow-y-auto animate-in flex flex-col"
  }, /*#__PURE__*/React.createElement("nav", {
    className: "p-4 md:px-8 border-b border-[var(--border-color)] flex justify-between items-center glass-nav sticky top-0 z-40"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3"
  }, /*#__PURE__*/React.createElement(ModernLogo, {
    className: "w-7 h-7"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "text-lg font-black text-[var(--dark-color)] font-sans"
  }, ui.searchTitle), /*#__PURE__*/React.createElement("span", {
    className: "text-[9px] tracking-wider text-[var(--primary-color)] font-sans font-bold"
  }, ui.frontendName || settings.systemName, ui.searchSubtitle))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setIsCartOpen(true),
    className: "relative bg-white/80 border border-[var(--accent-color)] text-[var(--dark-color)] px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "ShoppingCart",
    size: 15
  }), /*#__PURE__*/React.createElement("span", null, ui.menuCart), cart.length > 0 && /*#__PURE__*/React.createElement("span", {
    className: "bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
  }, cart.length)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setIsSearchModalOpen(false),
    className: "bg-[var(--accent-color)]/20 border border-[var(--accent-color)] hover:bg-[var(--accent-color)]/40 px-3.5 py-1.5 rounded-full text-xs font-bold text-[var(--text-dark)] transition flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "X",
    size: 14
  }), " \u95DC\u9589\u6AA2\u7D22"))), /*#__PURE__*/React.createElement("main", {
    className: "flex-1 max-w-7xl mx-auto w-full p-4 md:p-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-6 flex justify-between items-end border-b border-[var(--border-color)] pb-3"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-xl md:text-2xl font-black text-[var(--dark-color)] font-serif"
  }, ui.searchFilterTitle), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-[var(--primary-color)] font-sans font-bold"
  }, "\u67E5\u8A62\u5230\u5171 ", /*#__PURE__*/React.createElement("span", {
    className: "text-base font-black bg-[var(--border-color)]/40 px-2 py-0.5 rounded"
  }, indexSearchBooks.length), " \u672C\u66F8\u7C4D")), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSearchSubmit,
    className: "glass-card p-5 md:p-6 rounded-2xl border mb-8 font-sans"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold text-[var(--text-dark)] mb-1"
  }, ui.searchLabelCode), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: searchForm.code,
    onChange: e => setSearchForm({
      ...searchForm,
      code: e.target.value
    }),
    className: "w-full glass-input p-2.5 rounded-xl text-xs outline-none"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold text-[var(--text-dark)] mb-1"
  }, ui.searchLabelTitle), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: searchForm.title,
    onChange: e => setSearchForm({
      ...searchForm,
      title: e.target.value
    }),
    className: "w-full glass-input p-2.5 rounded-xl text-xs outline-none"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold text-[var(--text-dark)] mb-1"
  }, ui.searchLabelAuthor), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: searchForm.author,
    onChange: e => setSearchForm({
      ...searchForm,
      author: e.target.value
    }),
    className: "w-full glass-input p-2.5 rounded-xl text-xs outline-none"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold text-[var(--text-dark)] mb-1"
  }, ui.searchLabelYear), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: searchForm.year,
    onChange: e => setSearchForm({
      ...searchForm,
      year: e.target.value
    }),
    className: "w-full glass-input p-2.5 rounded-xl text-xs outline-none"
  })), /*#__PURE__*/React.createElement("div", {
    className: "md:col-span-2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold text-[var(--text-dark)] mb-1"
  }, ui.searchLabelCategory), /*#__PURE__*/React.createElement("select", {
    value: searchForm.category,
    onChange: e => setSearchForm({
      ...searchForm,
      category: e.target.value
    }),
    className: "w-full glass-input p-2.5 rounded-xl text-xs font-bold text-[var(--dark-color)] outline-none"
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "\u5168\u90E8"), excelCategories.map(cat => /*#__PURE__*/React.createElement("option", {
    key: cat,
    value: cat
  }, cat))))), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "bg-[var(--primary-color)] hover:bg-[var(--dark-color)] text-white px-6 py-2.5 rounded-full font-bold transition flex items-center gap-1.5 shadow text-xs active:scale-95"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Search",
    size: 15
  }), " ", ui.searchBtnQuery)), /*#__PURE__*/React.createElement("div", {
    className: "glass-card border rounded-2xl overflow-hidden shadow-sm font-sans mb-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "overflow-x-auto"
  }, /*#__PURE__*/React.createElement("table", {
    className: "w-full text-left border-collapse min-w-[850px]"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    className: "glass-dark text-white text-xs border-b border-[var(--primary-color)]"
  }, /*#__PURE__*/React.createElement("th", {
    className: "p-3 font-bold text-center"
  }, ui.searchTableHeaderAction), /*#__PURE__*/React.createElement("th", {
    className: "p-3 font-bold whitespace-nowrap"
  }, ui.searchTableHeaderCode), /*#__PURE__*/React.createElement("th", {
    className: "p-3 font-bold min-w-[180px]"
  }, ui.searchTableHeaderTitle), /*#__PURE__*/React.createElement("th", {
    className: "p-3 font-bold"
  }, ui.searchTableHeaderPrice), /*#__PURE__*/React.createElement("th", {
    className: "p-3 font-bold"
  }, ui.searchTableHeaderAuthor), /*#__PURE__*/React.createElement("th", {
    className: "p-3 font-bold"
  }, ui.searchTableHeaderYear), /*#__PURE__*/React.createElement("th", {
    className: "p-3 font-bold"
  }, ui.searchTableHeaderCategory))), /*#__PURE__*/React.createElement("tbody", {
    className: "divide-y divide-[var(--border-color)]/50 text-xs"
  }, visibleSearchBooks.map((book, idx) => /*#__PURE__*/React.createElement("tr", {
    key: book.id || idx,
    className: "hover:bg-white/80 transition-colors text-[var(--dark-color)] cursor-pointer",
    onClick: () => setSelectedBookDetail(book)
  }, /*#__PURE__*/React.createElement("td", {
    className: "p-2.5 text-center",
    onClick: e => e.stopPropagation()
  }, book.stock > 0 ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => addToCart(book),
    className: "bg-white border border-[var(--accent-color)]/80 text-[var(--dark-color)] p-2 rounded-lg hover:bg-[var(--primary-color)] hover:text-white transition shadow-sm mx-auto active:scale-95"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "ShoppingCart",
    size: 15
  })) : /*#__PURE__*/React.createElement("span", {
    className: "text-gray-400 font-bold text-[10px] bg-gray-100 px-1.5 py-0.5 rounded"
  }, "\u7F3A\u8CA8")), /*#__PURE__*/React.createElement("td", {
    className: "p-3 font-mono text-[var(--primary-color)] font-bold"
  }, book.id || '-'), /*#__PURE__*/React.createElement("td", {
    className: "p-3 font-bold flex items-center gap-2.5"
  }, /*#__PURE__*/React.createElement("img", {
    src: formatImageUrl(book.cover, 200),
    loading: "lazy",
    decoding: "async",
    className: "w-8 h-10 object-cover rounded shadow-sm border bg-white",
    onError: e => handleImgError(e, SVG_COVER_FALLBACK)
  }), book.title), /*#__PURE__*/React.createElement("td", {
    className: "p-3 font-bold text-[var(--primary-color)]"
  }, book.price ? `${book.price}元` : '-'), /*#__PURE__*/React.createElement("td", {
    className: "p-3"
  }, book.author || '-'), /*#__PURE__*/React.createElement("td", {
    className: "p-3"
  }, book.year || '-'), /*#__PURE__*/React.createElement("td", {
    className: "p-3"
  }, book.category || '-'))))))), indexSearchBooks.length > searchVisibleCount && /*#__PURE__*/React.createElement("div", {
    className: "text-center font-sans mb-8"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setSearchVisibleCount(prev => prev + 8),
    className: "bg-white border border-[var(--accent-color)] text-[var(--dark-color)] px-6 py-2 rounded-full font-bold hover:bg-[var(--dark-color)] hover:text-white transition flex items-center gap-1.5 mx-auto text-xs"
  }, ui.searchBtnMore, " ", /*#__PURE__*/React.createElement(Icon, {
    name: "ChevronRight",
    size: 15
  }))))), isRandomBooksOpen && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 bg-black/60 backdrop-blur-md z-[150] flex justify-center items-center p-4 md:p-8",
    onClick: () => setIsRandomBooksOpen(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-modal w-full max-w-5xl max-h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-dark p-4 flex justify-between items-center border-b-2 border-[var(--primary-color)]"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2.5 flex-wrap"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-serif font-black text-white flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Zap",
    size: 20,
    className: "text-[var(--primary-color)]"
  }), " ", ui.newArrivalsTitle), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] bg-white/20 text-white px-2.5 py-0.5 rounded-full font-sans font-bold border border-white/30"
  }, (newArrivalsList && newArrivalsList.length > 0) ? (recommendationRound < Math.ceil(newArrivalsList.length / 8) ? `第 ${recommendationRound + 1} 輪推薦 (共 ${Math.ceil(newArrivalsList.length / 8)} 輪)` : `全館精選隨機推薦 (第 ${recommendationRound + 1} 輪)`) : `全館精選推薦 (第 ${recommendationRound + 1} 輪)`)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setIsRandomBooksOpen(false),
    className: "bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full text-xs font-bold text-white transition flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "X",
    size: 14
  }), " ", ui.newArrivalsCloseBtn)), /*#__PURE__*/React.createElement("div", {
    id: "random-books-scroll-container",
    ref: randomBooksScrollRef,
    className: "flex-1 overflow-y-auto p-5 md:p-6 font-sans scroll-smooth"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
  }, randomBooks.map(book => /*#__PURE__*/React.createElement("div", {
    key: book.id,
    className: "glass-card rounded-xl overflow-hidden flex flex-col cursor-pointer",
    onClick: () => setSelectedBookDetail(book)
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-48 bg-[var(--bg-light)]/50 relative overflow-hidden p-3 flex justify-center items-center"
  }, /*#__PURE__*/React.createElement("img", {
    src: formatImageUrl(book.cover, 400),
    loading: "lazy",
    decoding: "async",
    className: "h-full w-auto object-contain rounded book-spine-shadow",
    alt: book.title,
    onError: e => handleImgError(e, SVG_COVER_FALLBACK)
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute top-2 left-2 bg-gradient-to-r from-[var(--primary-color)] to-[var(--dark-color)] text-white text-[10px] px-2 py-0.5 rounded font-bold shadow-md border border-white/30 z-10"
  }, book.category)), /*#__PURE__*/React.createElement("div", {
    className: "p-3.5 flex flex-col flex-1 bg-white/70"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-sm mb-1 line-clamp-2",
    title: book.title
  }, book.title), /*#__PURE__*/React.createElement("p", {
    className: "text-[var(--primary-color)] font-black text-base font-sans mt-auto mb-2"
  }, "NT$ ", book.price), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: e => {
      e.stopPropagation();
      addToCart(book);
    },
    className: "w-full bg-white border border-[var(--accent-color)] text-[var(--text-dark)] py-1.5 rounded-lg font-bold hover:bg-[var(--primary-color)] hover:text-white transition text-xs flex items-center justify-center gap-1"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "ShoppingCart",
    size: 14
  }), " \u52A0\u5165\u66F8\u5305"))))), /*#__PURE__*/React.createElement("div", {
    className: "mt-6 text-center"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => openRandomBooksModal(true),
    className: "bg-[var(--primary-color)] hover:bg-[var(--dark-color)] text-white px-6 py-2.5 rounded-full font-bold shadow transition flex items-center justify-center mx-auto gap-1.5 text-xs active:scale-95"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Zap",
    size: 15
  }), " ", ui.newArrivalsBtnRefresh, ` (換看第 ${recommendationRound + 2} 輪)`))))), isCartOpen && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex justify-center items-start md:items-center p-0 md:p-6 overflow-y-auto",
    onClick: () => setIsCartOpen(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: `glass-modal w-full h-auto md:h-[82vh] ${isCartDetailsOpen ? 'md:max-w-4xl' : 'md:max-w-md'} flex flex-col md:flex-row shadow-2xl rounded-t-3xl md:rounded-3xl overflow-hidden mt-4 md:mt-0 font-sans shrink-0 border border-white/80`,
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex md:hidden shrink-0 bg-white border-b text-xs w-full"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setIsCartDetailsOpen(true),
    className: `flex-1 py-3 text-center font-bold border-b-2 flex items-center justify-center gap-1 ${isCartDetailsOpen ? 'border-[var(--primary-color)] text-[var(--primary-color)] font-black' : 'border-transparent text-gray-400'}`
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "ShoppingCart",
    size: 14
  }), " 1. \u78BA\u8A8D\u66F8\u5305 (", cart.reduce((s, i) => s + i.qty, 0), ")"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      if (cart.length > 0) setIsCartDetailsOpen(false);else showMsg("書包內尚無圖書！");
    },
    className: `flex-1 py-3 text-center font-bold border-b-2 flex items-center justify-center gap-1 ${!isCartDetailsOpen ? 'border-[var(--primary-color)] text-[var(--primary-color)] font-black' : 'border-transparent text-gray-400'}`
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "FileText",
    size: 14
  }), " 2. \u6536\u4EF6\u7D50\u5E33")), isCartDetailsOpen && /*#__PURE__*/React.createElement("div", {
    className: "flex-1 flex flex-col bg-transparent overflow-hidden border-b md:border-b-0 md:border-r border-[var(--border-color)]"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-4 border-b border-[var(--border-color)] flex justify-between items-center bg-white/70 shrink-0"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-black flex items-center gap-2 text-[var(--dark-color)] font-serif"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "ShoppingCart",
    size: 22,
    className: "text-[var(--primary-color)]"
  }), " ", ui.cartTitle), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setIsCartOpen(false),
    className: "bg-white border border-[var(--accent-color)] px-3 py-1 rounded-full text-xs font-bold text-[var(--text-dark)] flex items-center gap-1"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "X",
    size: 14
  }), " ", ui.cartCloseBtn)), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 overflow-y-auto p-4 space-y-3"
  }, cart.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "text-center py-16 flex flex-col items-center gap-3 text-stone-400"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "ShoppingCart",
    size: 40
  }), /*#__PURE__*/React.createElement("p", {
    className: "text-sm font-bold text-[var(--primary-color)]"
  }, ui.cartEmptyText)) : cart.map(i => /*#__PURE__*/React.createElement("div", {
    key: i.id,
    className: "flex gap-3 items-center glass-card p-3 rounded-xl relative"
  }, /*#__PURE__*/React.createElement("img", {
    src: formatImageUrl(i.cover, 200),
    alt: i.title,
    className: "w-14 h-20 object-cover rounded border",
    onError: e => handleImgError(e, SVG_COVER_FALLBACK)
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col flex-1 pr-6"
  }, /*#__PURE__*/React.createElement("p", {
    className: "font-bold text-sm text-[var(--dark-color)] line-clamp-1"
  }, i.title), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-[var(--primary-color)] font-black my-1"
  }, "NT$ ", i.price), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center border border-[var(--accent-color)]/70 rounded-lg overflow-hidden h-7 w-max bg-white"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => updateCartQty(i.id, -1),
    className: "px-2 hover:bg-stone-100 font-bold"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Minus",
    size: 12
  })), /*#__PURE__*/React.createElement("span", {
    className: "px-3 text-xs font-bold border-x border-[var(--accent-color)]/70"
  }, i.qty), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => updateCartQty(i.id, 1),
    className: "px-2 hover:bg-stone-100 font-bold"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Plus",
    size: 12
  })))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => removeFromCart(i.id),
    className: "absolute top-3 right-3 text-stone-400 hover:text-red-500 p-1"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Trash2",
    size: 16
  }))))), cart.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "p-3.5 bg-white border-t md:hidden"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setIsCartDetailsOpen(false),
    className: "w-full bg-[var(--primary-color)] text-white py-3 rounded-xl font-bold flex justify-center items-center gap-1.5 text-sm"
  }, "\u4E0B\u4E00\u6B65\uFF1A\u586B\u5BEB\u6536\u4EF6\u8CC7\u8A0A ", /*#__PURE__*/React.createElement(Icon, {
    name: "ChevronRight",
    size: 16
  })))), cart.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: `w-full md:w-[360px] bg-white/90 p-5 flex flex-col shrink-0 overflow-y-auto ${isCartDetailsOpen ? 'hidden md:flex' : 'flex'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-card p-4 rounded-xl border mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-baseline justify-between text-left"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-sm text-[var(--dark-color)]"
  }, ui.cartTotalLabel), /*#__PURE__*/React.createElement("span", {
    className: "text-2xl font-black text-[var(--primary-color)]"
  }, "NT$ ", cartTotal.toLocaleString()))), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleCheckout,
    className: "space-y-3 flex-1 flex flex-col text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs font-bold text-[var(--primary-color)] border-b pb-1.5 flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "MapPin",
    size: 14
  }), " ", ui.cartCheckoutTitle), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-2.5"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-gray-600 mb-1"
  }, ui.cartLabelName), /*#__PURE__*/React.createElement("input", {
    name: "name",
    required: true,
    className: "w-full glass-input p-2 rounded-lg outline-none"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-gray-600 mb-1"
  }, ui.cartLabelPhone), /*#__PURE__*/React.createElement("input", {
    name: "phone",
    required: true,
    className: "w-full glass-input p-2 rounded-lg outline-none"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-gray-600 mb-1"
  }, ui.cartLabelEmail), /*#__PURE__*/React.createElement("input", {
    name: "email",
    type: "email",
    required: true,
    className: "w-full glass-input p-2 rounded-lg outline-none"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-gray-600 mb-1"
  }, ui.cartLabelAddress), /*#__PURE__*/React.createElement("input", {
    name: "address",
    required: true,
    className: "w-full glass-input p-2 rounded-lg outline-none"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-gray-600 mb-1"
  }, ui.cartLabelPayment), /*#__PURE__*/React.createElement("select", {
    name: "payment",
    value: selectedPayment,
    onChange: e => setSelectedPayment(e.target.value),
    className: "w-full glass-input p-2 rounded-lg font-bold outline-none"
  }, /*#__PURE__*/React.createElement("option", {
    value: "\u5E97\u53D6\u4ED8\u73FE\u91D1"
  }, ui.cartOptionCash), /*#__PURE__*/React.createElement("option", {
    value: "\u9280\u884C\u8F49\u5E33\uFF08\u904B\u8CBB\u53E6\u8A08\uFF09"
  }, "\u9280\u884C\u8F49\u5E33\uFF08\u904B\u8CBB\u53E6\u8A08\uFF09"))), selectedPayment === '銀行轉帳（運費另計）' && /*#__PURE__*/React.createElement("div", {
    className: "bg-amber-50/90 backdrop-blur-sm border border-amber-200 rounded-xl p-3.5 text-xs text-[var(--text-dark)] leading-relaxed animate-in text-left"
  }, /*#__PURE__*/React.createElement("p", {
    className: "font-bold text-[var(--primary-color)] mb-1 flex items-center gap-1"
  }, "\uD83C\uDFE6 \u90F5\u653F\u5283\u64A5\u8CC7\u8A0A\uFF1A"), /*#__PURE__*/React.createElement("p", {
    className: "mb-1"
  }, "\u4F86\u96FB\u8A62\u554F\uFF1A", /*#__PURE__*/React.createElement("span", {
    className: "font-mono font-bold"
  }, "\uD83D\uDCDE 886-02-2351-1028")), /*#__PURE__*/React.createElement("p", {
    className: "flex items-center text-gray-700 mb-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-12 shrink-0"
  }, "\u5E33\u865F\uFF1A"), /*#__PURE__*/React.createElement("a", {
    href: "https://www.facebook.com/people/%E6%96%87%E5%8F%B2%E5%93%B2%E5%87%BA%E7%89%88%E7%A4%BE/61590146114229/?locale=zh_TW",
    target: "_blank",
    rel: "noopener noreferrer",
    className: "inline-flex items-center font-bold text-blue-600 hover:text-blue-800 hover:underline"
  }, "\uD83D\uDCD8 \u8A73\u60C5\u8ACB\u79C1\u8A0A\u81C9\u66F8\u5C08\u9801\u8A62\u554F \u2197")), /*#__PURE__*/React.createElement("p", {
    className: "flex items-center text-gray-700"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-12 shrink-0"
  }, "\u6236\u540D\uFF1A"), /*#__PURE__*/React.createElement("a", {
    href: "https://www.facebook.com/people/%E6%96%87%E5%8F%B2%E5%93%B2%E5%87%BA%E7%89%88%E7%A4%BE/61590146114229/?locale=zh_TW",
    target: "_blank",
    rel: "noopener noreferrer",
    className: "inline-flex items-center font-bold text-blue-600 hover:text-blue-800 hover:underline"
  }, "\uD83D\uDCD8 \u8A73\u60C5\u8ACB\u79C1\u8A0A\u81C9\u66F8\u5C08\u9801\u8A62\u554F \u2197"))), selectedPayment === '店取付現金' && /*#__PURE__*/React.createElement("div", {
    className: "bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-[11px] text-[var(--text-dark)] leading-relaxed"
  }, /*#__PURE__*/React.createElement("p", {
    className: "font-bold text-emerald-800"
  }, "\uD83C\uDFEA \u53D6\u8CA8\uFF1A\u53F0\u5317\u5E02\u7F85\u65AF\u798F\u8DEF\u4E00\u6BB572\u5DF74\u865F")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-gray-600 mb-1"
  }, ui.cartLabelMemo), /*#__PURE__*/React.createElement("textarea", {
    name: "memo",
    placeholder: ui.cartMemoPlaceholder,
    className: "w-full glass-input p-2 rounded-lg outline-none h-14 resize-none"
  })), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    disabled: isCheckingOut,
    className: `w-full bg-[var(--primary-color)] text-white py-3 rounded-xl font-bold mt-auto shadow transition flex justify-center items-center gap-1.5 text-sm ${isCheckingOut ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[var(--dark-color)] active:scale-95'}`
  }, isCheckingOut ? /*#__PURE__*/React.createElement(Icon, {
    name: "Clock",
    size: 16,
    className: "animate-spin"
  }) : /*#__PURE__*/React.createElement(Icon, {
    name: "CheckCircle",
    size: 16
  }), isCheckingOut ? ui.cartCheckingOutBtn : ui.cartBtnCheckout))))), iframeModal.isOpen && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 bg-black/60 backdrop-blur-md z-[150] flex justify-center items-center p-4 md:p-8",
    onClick: () => setIframeModal(prev => ({
      ...prev,
      isOpen: false
    }))
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-modal w-full max-w-5xl h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in font-sans",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-3.5 border-b border-[var(--border-color)] flex justify-between items-center glass-dark text-white"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-base font-bold font-serif tracking-wider"
  }, iframeModal.title), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setIframeModal(prev => ({
      ...prev,
      isOpen: false
    })),
    className: "bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "X",
    size: 14
  }), " \u95DC\u9589")), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 w-full bg-white relative overflow-y-auto"
  }, iframeModal.url && /*#__PURE__*/React.createElement("iframe", {
    src: iframeModal.url,
    className: "w-full h-full border-0 min-h-[550px]"
  })))), submittedDetail && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 bg-black/85 backdrop-blur-md z-[250] flex justify-center items-center p-4 md:p-8 overflow-y-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in border border-[var(--border-color)]",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-dark text-white p-4 flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-sans font-bold flex items-center gap-2 text-sm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "CheckCircle",
    size: 18,
    className: "text-emerald-400"
  }), submittedDetail.type === 'order' ? '交易處理成功・受理憑證' : '系統反映成功・受理明細'), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setSubmittedDetail(null),
    className: "p-1 rounded-full text-white/80 hover:text-white"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "X",
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    className: "p-6 receipt-container flex-1 text-xs space-y-3 font-sans"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center border-b pb-3 mb-3"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-black text-[var(--dark-color)] font-serif"
  }, "\u6587\u53F2\u54F2\u51FA\u7248\u793E\u6709\u9650\u516C\u53F8"), /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] font-mono text-gray-500 font-bold select-all"
  }, submittedDetail.data.id)), submittedDetail.type === 'order' ? /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-center text-emerald-800 font-bold"
  }, "\uD83D\uDCF8 \u8ACB\u622A\u5716\u4FDD\u5B58\u6B64\u8A02\u55AE\u55AE\u865F\uFF1A", submittedDetail.data.id), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-1 border-b pb-2"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-gray-400"
  }, "\u5BA2\u6236\uFF1A"), submittedDetail.data.customer), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-gray-400"
  }, "\u96FB\u8A71\uFF1A"), submittedDetail.data.phone), /*#__PURE__*/React.createElement("div", {
    className: "col-span-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-gray-400"
  }, "\u5730\u5740\uFF1A"), submittedDetail.data.address), /*#__PURE__*/React.createElement("div", {
    className: "col-span-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-gray-400"
  }, "\u4ED8\u6B3E\uFF1A"), /*#__PURE__*/React.createElement("strong", null, submittedDetail.data.payment))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-1 py-1"
  }, /*#__PURE__*/React.createElement("p", {
    className: "font-bold text-gray-700"
  }, "\u5716\u66F8\u660E\u7D30\uFF1A"), submittedDetail.data.items.map((it, idx) => /*#__PURE__*/React.createElement("div", {
    key: idx,
    className: "flex justify-between text-gray-600"
  }, /*#__PURE__*/React.createElement("span", {
    className: "line-clamp-1 flex-1 pr-2"
  }, it.title, " x", it.qty), /*#__PURE__*/React.createElement("span", {
    className: "font-bold"
  }, "NT$ ", it.price * it.qty)))), /*#__PURE__*/React.createElement("div", {
    className: "border-t border-dashed pt-2 flex justify-between items-baseline"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-sm"
  }, "\u4ED8\u6B3E\u7E3D\u984D"), /*#__PURE__*/React.createElement("span", {
    className: "text-xl font-black text-[var(--primary-color)]"
  }, "NT$ ", submittedDetail.data.total.toLocaleString()))) : /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-blue-50 border border-blue-200 rounded-lg p-2 text-center text-blue-800 font-bold"
  }, "\u5DF2\u6210\u529F\u767B\u8A18\u5BA2\u670D\u7DE8\u865F\uFF1A", submittedDetail.data.id), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-gray-400"
  }, "\u53CD\u6620\u4EBA\uFF1A"), submittedDetail.data.name), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-gray-400"
  }, "\u5167\u5BB9\uFF1A"), /*#__PURE__*/React.createElement("p", {
    className: "p-2 bg-gray-50 rounded mt-1 whitespace-pre-wrap"
  }, submittedDetail.data.message)))), /*#__PURE__*/React.createElement("div", {
    className: "receipt-edge-zigzag h-[10px] w-full bg-white relative -top-0.5"
  }), /*#__PURE__*/React.createElement("div", {
    className: "bg-gray-50 p-3 flex gap-2 justify-center"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => window.print(),
    className: "bg-white border px-4 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Printer",
    size: 14
  }), " \u5217\u5370\u6191\u8B49"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setSubmittedDetail(null),
    className: "bg-[var(--dark-color)] text-white px-5 py-1.5 rounded-lg font-bold text-xs"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Check",
    size: 14
  }), " \u95DC\u9589")))), isOrderQueryOpen && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex justify-center items-center p-4 md:p-8 overflow-y-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-modal w-full max-w-3xl max-h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-4 border-b border-[var(--border-color)] flex justify-between items-center bg-white/80"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-base md:text-lg font-black flex items-center gap-2 text-[var(--dark-color)] font-serif"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "FileText",
    size: 20,
    className: "text-[var(--primary-color)]"
  }), " \u6700\u8FD1\u8A02\u55AE\u67E5\u8A62"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      setIsOrderQueryOpen(false);
      setOrderQueryInput('');
      setQueryResults([]);
      setHasQueried(false);
    },
    className: "bg-white border px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "X",
    size: 14
  }), " \u95DC\u9589")), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 overflow-y-auto p-5 md:p-6 font-sans"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 mb-5 flex items-start gap-2"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Info",
    size: 16,
    className: "text-[var(--primary-color)] mt-0.5 shrink-0"
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "\u96B1\u79C1\u4FDD\u8B77\uFF1A"), "\u67E5\u8A62\u50C5\u5373\u6642\u6BD4\u5C0D\u60A8\u8F38\u5165\u7684", /*#__PURE__*/React.createElement("strong", null, "\u5BA2\u6236\u59D3\u540D\u3001\u624B\u6A5F\u865F\u78BC\u6216\u8A02\u55AE\u7DE8\u865F"), "\uFF0C\u7D55\u4E0D\u5411\u524D\u53F0\u6D29\u6F0F\u5B8C\u6574\u8A02\u55AE\u540D\u55AE\u3002")), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleOrderQuerySubmit,
    className: "flex gap-2.5 mb-6"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: orderQueryInput,
    onChange: e => setOrderQueryInput(e.target.value),
    placeholder: "\u8F38\u5165\u59D3\u540D\u3001\u624B\u6A5F\u865F\u78BC \u6216 ORD- \u55AE\u865F",
    required: true,
    className: "flex-1 glass-input p-2.5 rounded-xl text-xs font-bold outline-none"
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    disabled: isQueryingGAS,
    className: "bg-[var(--primary-color)] hover:bg-[var(--dark-color)] text-white px-5 py-2.5 rounded-xl font-bold transition flex items-center gap-1.5 text-xs shrink-0 active:scale-95 disabled:opacity-50"
  }, isQueryingGAS ? /*#__PURE__*/React.createElement(Icon, {
    name: "RefreshCw",
    size: 14,
    className: "animate-spin"
  }) : /*#__PURE__*/React.createElement(Icon, {
    name: "Search",
    size: 14
  }), isQueryingGAS ? '檢索中...' : '立即檢索')), /*#__PURE__*/React.createElement("div", {
    className: "min-h-[140px]"
  }, isQueryingGAS ? /*#__PURE__*/React.createElement("div", {
    className: "py-12 flex flex-col items-center justify-center gap-2 text-[var(--primary-color)]"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "RefreshCw",
    size: 28,
    className: "animate-spin"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-bold"
  }, "\u5373\u6642\u9023\u7DDA\u96F2\u7AEF\u8CC7\u6599\u5EAB\u4E2D...")) : hasQueried ? queryResults.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "py-10 text-center text-gray-500 text-xs font-bold"
  }, "\u627E\u4E0D\u5230\u8207\u300C", orderQueryInput, "\u300D\u76F8\u7B26\u7684\u8A02\u55AE\uFF0C\u8ACB\u78BA\u8A8D\u8F38\u5165\u7121\u8AA4\u3002") : /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, queryResults.map((ord, idx) => /*#__PURE__*/React.createElement("div", {
    key: idx,
    className: "glass-card p-4 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bg-[var(--dark-color)] text-white font-mono px-2 py-0.5 rounded text-[11px]"
  }, ord.id || ord['訂單編號']), /*#__PURE__*/React.createElement("span", {
    className: "bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold text-[11px]"
  }, ord.status || ord['狀態'] || '處理中')), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-600"
  }, "\u5BA2\u6236\uFF1A", /*#__PURE__*/React.createElement("strong", null, maskName(ord.customer || ord['客戶姓名'])), " \u30FB \u96FB\u8A71\uFF1A", /*#__PURE__*/React.createElement("strong", null, maskPhone(ord.phone || ord['電話']))), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-500 text-[11px]"
  }, "\u4E0B\u55AE\u6642\u9593\uFF1A", ord.date || ord['日期'])), /*#__PURE__*/React.createElement("div", {
    className: "text-right font-black text-base text-[var(--primary-color)]"
  }, "NT$ ", parseInt(ord.total || ord['總金額'] || 0).toLocaleString())))) : /*#__PURE__*/React.createElement("div", {
    className: "py-10 text-center text-gray-400 text-xs font-bold"
  }, "\u8ACB\u65BC\u4E0A\u65B9\u8F38\u5165\u641C\u5C0B\u689D\u4EF6\u9032\u884C\u7CBE\u78BA\u6AA2\u7D22\u3002"))))), selectedBookDetail && /*#__PURE__*/React.createElement("div", {
    className: `fixed inset-0 bg-black/65 backdrop-blur-md z-[220] flex justify-center items-center ${isBookDetailFullscreen ? 'p-0' : 'p-3 md:p-6'} overflow-hidden animate-in`,
    onClick: () => setSelectedBookDetail(null)
  }, /*#__PURE__*/React.createElement("div", {
    className: `glass-modal w-full ${isBookDetailFullscreen ? 'h-full max-w-none max-h-none rounded-none border-0' : 'max-w-3xl max-h-[90vh] rounded-3xl border border-white/80'} shadow-2xl flex flex-col overflow-hidden transition-all duration-300`,
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-3.5 md:p-4 border-b border-[var(--border-color)] flex justify-between items-center bg-white/95 backdrop-blur-md shrink-0 z-10"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-base md:text-lg font-serif font-black text-[var(--dark-color)] flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "BookOpen",
    size: 20,
    className: "text-[var(--primary-color)]"
  }), " 圖書詳細資訊"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setIsBookDetailFullscreen(!isBookDetailFullscreen),
    className: "px-3 py-1 rounded-full bg-[var(--bg-light)] hover:bg-[var(--primary-color)] hover:text-white text-[var(--dark-color)] text-xs font-bold transition flex items-center gap-1.5 border border-[var(--border-color)] shadow-sm",
    title: isBookDetailFullscreen ? "縮小視窗" : "全螢幕放大"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: isBookDetailFullscreen ? "Minimize" : "Maximize",
    size: 14
  }), /*#__PURE__*/React.createElement("span", null, isBookDetailFullscreen ? "縮小" : "全螢幕放大")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      setSelectedBookDetail(null);
      setIsBookDetailFullscreen(false);
    },
    className: "p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "X",
    size: 18
  })))), /*#__PURE__*/React.createElement("div", {
    className: `p-4 md:p-6 font-sans overflow-y-auto flex-1 space-y-4 ${isBookDetailFullscreen ? 'max-w-5xl mx-auto w-full' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row gap-5 items-start"
  }, /*#__PURE__*/React.createElement("div", {
    className: `w-full ${isBookDetailFullscreen ? 'sm:w-60 h-80' : 'sm:w-44 h-60'} shrink-0 bg-[var(--bg-light)] rounded-2xl overflow-hidden p-2.5 border flex justify-center items-center shadow-inner transition-all`
  }, /*#__PURE__*/React.createElement("img", {
    src: formatImageUrl(selectedBookDetail.cover, 1000),
    alt: selectedBookDetail.title,
    className: "h-full w-auto object-contain rounded-lg book-spine-shadow",
    onError: e => handleImgError(e, SVG_COVER_FALLBACK)
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 space-y-3 text-left w-full min-w-0"
  }, /*#__PURE__*/React.createElement("h3", {
    className: `${isBookDetailFullscreen ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'} font-black text-[var(--dark-color)] font-serif leading-snug`
  }, selectedBookDetail.title), /*#__PURE__*/React.createElement("div", {
    className: `grid grid-cols-2 gap-y-2 gap-x-4 ${isBookDetailFullscreen ? 'text-sm md:text-base' : 'text-xs'} text-[var(--text-dark)] border-y border-[var(--border-color)]/70 py-2.5`
  }, /*#__PURE__*/React.createElement("div", null, "作者：", /*#__PURE__*/React.createElement("strong", {
    className: "font-semibold"
  }, selectedBookDetail.author || '未標記')), /*#__PURE__*/React.createElement("div", null, "年份：", /*#__PURE__*/React.createElement("strong", {
    className: "font-semibold"
  }, selectedBookDetail.year || '未標記')), /*#__PURE__*/React.createElement("div", null, "分類：", /*#__PURE__*/React.createElement("strong", {
    className: "text-[var(--primary-color)] font-bold"
  }, selectedBookDetail.category || '未分類')), /*#__PURE__*/React.createElement("div", null, "書碼：", /*#__PURE__*/React.createElement("strong", {
    className: "font-mono font-bold"
  }, selectedBookDetail.id || '無')), /*#__PURE__*/React.createElement("div", {
    className: "col-span-2 pt-0.5"
  }, "定價：", /*#__PURE__*/React.createElement("strong", {
    className: `${isBookDetailFullscreen ? 'text-2xl' : 'text-lg'} font-black text-[var(--primary-color)] font-sans`
  }, "NT$ ", selectedBookDetail.price))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: `${isBookDetailFullscreen ? 'text-sm md:text-base' : 'text-xs'} font-bold text-[var(--dark-color)] mb-1 flex items-center gap-1`
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "FileText",
    size: 14,
    className: "text-[var(--primary-color)]"
  }), " 書籍簡介："), /*#__PURE__*/React.createElement("div", {
    className: `bg-white/90 border border-[var(--border-color)]/70 p-3 rounded-xl ${isBookDetailFullscreen ? 'text-sm md:text-base leading-relaxed max-h-56' : 'text-xs leading-relaxed max-h-36'} overflow-y-auto whitespace-pre-wrap text-stone-700 shadow-sm`
  }, getBookIntro(selectedBookDetail))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: `${isBookDetailFullscreen ? 'text-sm md:text-base' : 'text-xs'} font-bold text-purple-900 mb-1 flex items-center gap-1`
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Sparkles",
    size: 14,
    className: "text-purple-600"
  }), " 讀後心得與學術評析："), /*#__PURE__*/React.createElement("div", {
    className: `bg-purple-50/90 border border-purple-200 p-3 rounded-xl ${isBookDetailFullscreen ? 'text-sm md:text-base leading-relaxed max-h-56' : 'text-xs leading-relaxed max-h-36'} overflow-y-auto text-purple-950 italic shadow-sm`
  }, getBookReview(selectedBookDetail))), /*#__PURE__*/React.createElement("div", {
    className: "pt-1"
  }, /*#__PURE__*/React.createElement("h4", {
    className: `${isBookDetailFullscreen ? 'text-sm md:text-base' : 'text-xs'} font-bold text-amber-900 mb-1.5 flex items-center gap-1`
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "BookOpen",
    size: 14,
    className: "text-amber-700"
  }), " 權威文獻與關聯知識庫："), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2 text-xs"
  }, /*#__PURE__*/React.createElement("a", {
    href: `https://zh.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(selectedBookDetail.title)}`,
    target: "_blank",
    rel: "noreferrer",
    className: "px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-lg font-bold transition flex items-center gap-1 shadow-sm active:scale-95",
    title: "在維基百科查詢相關條目與專題背景"
  }, "🌐 維基百科 (條目)"), selectedBookDetail.author && selectedBookDetail.author !== '未標記' && /*#__PURE__*/React.createElement("a", {
    href: `https://zh.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(String(selectedBookDetail.author).replace(/著|編|校|註|輯/g, '').trim())}`,
    target: "_blank",
    rel: "noreferrer",
    className: "px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-lg font-bold transition flex items-center gap-1 shadow-sm active:scale-95",
    title: "在維基百科查詢作者生平與學術著作"
  }, `👤 作者維基 (${String(selectedBookDetail.author).replace(/著|編|校|註|輯/g, '').trim()})`), /*#__PURE__*/React.createElement("a", {
    href: `https://scholar.google.com.tw/scholar?q=${encodeURIComponent(selectedBookDetail.title + ' ' + (selectedBookDetail.author || ''))}`,
    target: "_blank",
    rel: "noreferrer",
    className: "px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg font-bold transition flex items-center gap-1 shadow-sm active:scale-95",
    title: "在 Google 學術搜尋相關論文與研究引用"
  }, "🎓 Google 學術搜尋"), /*#__PURE__*/React.createElement("a", {
    href: `https://aleweb.ncl.edu.tw/F?func=find-b&find_code=WRD&request=${encodeURIComponent(selectedBookDetail.title)}`,
    target: "_blank",
    rel: "noreferrer",
    className: "px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg font-bold transition flex items-center gap-1 shadow-sm active:scale-95",
    title: "在國家圖書館館藏目錄查詢館藏紀錄"
  }, "🏛️ 國家圖書館館藏"))))), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--border-color)]/60 text-xs text-stone-500"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-[var(--dark-color)] flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Share2",
    size: 14,
    className: "text-[var(--primary-color)]"
  }), " 分享此書："), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      const shareUrl = `${window.location.origin}${window.location.pathname}?book=${encodeURIComponent(selectedBookDetail.id || selectedBookDetail.title)}`;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareUrl).then(() => showMsg('✅ 已複製書籍專屬連結！可直接傳給朋友。')).catch(() => showMsg('書籍連結：' + shareUrl));
      } else {
        showMsg('書籍連結：' + shareUrl);
      }
    },
    className: "px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg font-bold transition flex items-center gap-1 shadow-sm active:scale-95",
    title: "複製專屬網址"
  }, "🔗 複製連結"), /*#__PURE__*/React.createElement("a", {
    href: `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(`${window.location.origin}${window.location.pathname}?book=${selectedBookDetail.id || selectedBookDetail.title}`)}`,
    target: "_blank",
    rel: "noreferrer",
    className: "px-2.5 py-1 bg-[#06C755] hover:bg-[#05b34c] text-white rounded-lg font-bold transition flex items-center gap-1 shadow-sm active:scale-95",
    title: "分享到 LINE"
  }, "💬 LINE"), /*#__PURE__*/React.createElement("a", {
    href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${window.location.origin}${window.location.pathname}?book=${selectedBookDetail.id || selectedBookDetail.title}`)}`,
    target: "_blank",
    rel: "noreferrer",
    className: "px-2.5 py-1 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-lg font-bold transition flex items-center gap-1 shadow-sm active:scale-95",
    title: "分享到 Facebook"
  }, "📘 FB")))), /*#__PURE__*/React.createElement("div", {
    className: "p-3.5 md:p-4 border-t border-[var(--border-color)]/70 bg-white/95 backdrop-blur-md shrink-0 flex gap-3 z-10"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      const b = selectedBookDetail;
      setSelectedBookDetail(null);
      openReviewModalForBook(b);
    },
    className: `flex-1 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white py-2.5 px-4 rounded-xl font-bold flex justify-center items-center gap-1.5 ${isBookDetailFullscreen ? 'text-sm md:text-base' : 'text-xs'} shadow active:scale-95 transition`
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "MessageSquare",
    size: 16
  }), " 讀後心得交流"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => addToCart(selectedBookDetail),
    disabled: selectedBookDetail.stock <= 0,
    className: `flex-1 bg-[var(--primary-color)] text-white py-2.5 px-4 rounded-xl font-bold flex justify-center items-center gap-1.5 ${isBookDetailFullscreen ? 'text-sm md:text-base' : 'text-xs'} shadow ${selectedBookDetail.stock <= 0 ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "ShoppingCart",
    size: 16
  }), " ", selectedBookDetail.stock <= 0 ? ui.msgOutOfStock : ui.btnAddToCart)))), isReviewModalOpen && reviewBook && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 bg-black/70 backdrop-blur-md z-[240] flex justify-center items-center p-4 md:p-8 overflow-y-auto animate-in",
    onClick: () => setIsReviewModalOpen(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-modal w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-white/80",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-4 border-b border-stone-200 flex justify-between items-center bg-stone-900 text-white"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-base font-serif font-black text-amber-100 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "MessageCircle",
    size: 18,
    className: "text-purple-300"
  }), " \u8B80\u5F8C\u5FC3\u5F97 \u2014 \u300A", reviewBook.title, "\u300B"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setIsReviewModalOpen(false),
    className: "p-1 rounded-full text-stone-400 hover:text-white"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "X",
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    className: "p-5 font-sans overflow-y-auto max-h-[75vh] space-y-4 text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 leading-relaxed"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-[var(--dark-color)] block mb-1"
  }, "\u7CBE\u9078\u5FC3\u5F97\uFF08\u6E90\u81EA\u8A66\u7B97\u8868\uFF09\uFF1A"), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-700"
  }, getBookReview(reviewBook) || "目前尚無填寫心得，歡迎於下方發表您的感言！")), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleReviewSubmit,
    className: "bg-white p-4 rounded-xl border space-y-3"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-gray-800 flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Send",
    size: 14,
    className: "text-purple-500"
  }), " \u767C\u8868\u8B80\u5F8C\u611F\u8A00\uFF1A"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-2.5"
  }, /*#__PURE__*/React.createElement("input", {
    name: "name",
    required: true,
    placeholder: "\u60A8\u7684\u7A31\u547C",
    className: "w-full glass-input p-2 rounded-lg outline-none"
  }), /*#__PURE__*/React.createElement("input", {
    name: "contact",
    placeholder: "\u806F\u7D61\u96FB\u8A71\u6216 Email (\u9078\u586B)",
    className: "w-full glass-input p-2 rounded-lg outline-none"
  })), /*#__PURE__*/React.createElement("textarea", {
    name: "content",
    required: true,
    rows: "3",
    placeholder: `請輸入您對《${reviewBook.title}》的研讀心得或提問...`,
    className: "w-full glass-input p-2.5 rounded-lg outline-none resize-none leading-relaxed"
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    disabled: isSubmittingReview,
    className: `w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-xl font-bold shadow transition flex justify-center items-center gap-1.5 text-xs ${isSubmittingReview ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`
  }, isSubmittingReview ? /*#__PURE__*/React.createElement(Icon, {
    name: "Clock",
    size: 14,
    className: "animate-spin"
  }) : /*#__PURE__*/React.createElement(Icon, {
    name: "Send",
    size: 14
  }), /*#__PURE__*/React.createElement("span", null, isSubmittingReview ? "傳送中..." : "送出心得反映")))))), isAiModalOpen && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 bg-black/75 backdrop-blur-lg z-[260] flex justify-center items-center p-4 md:p-8 overflow-y-auto animate-in",
    onClick: () => setIsAiModalOpen(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-modal w-full max-w-3xl max-h-[88vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-indigo-400/40 bg-slate-950 text-white",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-4 border-b border-indigo-500/30 flex justify-between items-center bg-indigo-950/50"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Brain",
    size: 22,
    className: "text-amber-300 animate-pulse"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "text-base font-black font-serif text-amber-100 flex items-center gap-2"
  }, "\u6587\u53F2\u54F2 AI \u570B\u5B78\u8207\u5B78\u8853\u5206\u6790\u5100", /*#__PURE__*/React.createElement("span", {
    className: "text-[9px] font-sans font-bold bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 px-2 py-0.5 rounded-full"
  }, "Gemini 3 Flash")))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setIsAiModalOpen(false),
    className: "p-1 rounded-full text-stone-400 hover:text-white"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "X",
    size: 18
  }))), /*#__PURE__*/React.createElement("div", {
    className: "p-5 font-sans overflow-y-auto flex-1 space-y-4 text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-slate-900 border border-slate-700 p-3.5 rounded-2xl space-y-2.5"
  }, /*#__PURE__*/React.createElement("select", {
    value: aiSelectedBookId,
    onChange: e => {
      const bId = e.target.value;
      setAiSelectedBookId(bId);
      const target = books.find(b => b.id && b.id.toString() === bId || b.title === bId);
      if (target) analyzeBookWithGemini(target, aiCustomQuestion);
    },
    className: "w-full bg-slate-950 border border-slate-700 rounded-xl p-2 font-bold text-amber-200 outline-none"
  }, books.map((b, idx) => /*#__PURE__*/React.createElement("option", {
    key: idx,
    value: b.id || b.title
  }, "[", b.category || '未分類', "] ", b.title, " (", b.author || '無作者', ")"))), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: aiCustomQuestion,
    onChange: e => setAiCustomQuestion(e.target.value),
    placeholder: "\u53EF\u8F38\u5165\u5C0D\u672C\u66F8\u7684\u7279\u5225\u63D0\u554F\uFF08\u4F8B\uFF1A\u672C\u66F8\u5728\u5B8B\u4EE3\u7406\u5B78\u4E4B\u5730\u4F4D\uFF1F\uFF09",
    className: "flex-1 bg-slate-950 border border-slate-700 rounded-xl p-2 text-slate-200 outline-none",
    onKeyDown: e => {
      if (e.key === 'Enter') {
        const target = books.find(b => b.id && b.id.toString() === aiSelectedBookId || b.title === aiSelectedBookId) || books[0];
        analyzeBookWithGemini(target, aiCustomQuestion);
      }
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    disabled: isAiAnalyzing,
    onClick: () => {
      const target = books.find(b => b.id && b.id.toString() === aiSelectedBookId || b.title === aiSelectedBookId) || books[0];
      analyzeBookWithGemini(target, aiCustomQuestion);
    },
    className: "bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl font-bold transition flex items-center gap-1 text-xs shrink-0 active:scale-95 disabled:opacity-50"
  }, isAiAnalyzing ? /*#__PURE__*/React.createElement(Icon, {
    name: "RefreshCw",
    size: 13,
    className: "animate-spin"
  }) : /*#__PURE__*/React.createElement(Icon, {
    name: "Sparkles",
    size: 13
  }), /*#__PURE__*/React.createElement("span", null, isAiAnalyzing ? "分析中..." : "重新分析")))), /*#__PURE__*/React.createElement("div", {
    className: "min-h-[200px] bg-slate-900 border border-indigo-500/20 rounded-2xl p-5 font-serif leading-relaxed text-slate-200 text-xs"
  }, isAiAnalyzing ? /*#__PURE__*/React.createElement("div", {
    className: "py-16 flex flex-col justify-center items-center gap-2 text-indigo-300 font-sans"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Cpu",
    size: 32,
    className: "animate-bounce text-amber-300"
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-bold"
  }, "Gemini 3 Flash \u6B63\u5728\u7CBE\u8B80\u5178\u7C4D\u4E26\u69CB\u5EFA\u5B78\u8853\u5C0E\u8B80...")) : aiAnalysisResult ? /*#__PURE__*/React.createElement("div", {
    className: "whitespace-pre-wrap space-y-3"
  }, aiAnalysisResult) : /*#__PURE__*/React.createElement("div", {
    className: "py-12 text-center text-slate-500 font-sans"
  }, "\u8ACB\u9078\u64C7\u66F8\u7C4D\u4E26\u9EDE\u64CA\u300C\u91CD\u65B0\u5206\u6790\u300D\u555F\u52D5 AI \u5B78\u8853\u89E3\u8B80\u3002"))))), notification && /*#__PURE__*/React.createElement("div", {
    className: "fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 glass-dark text-white px-5 py-3 rounded-2xl shadow-2xl animate-in font-bold text-xs md:text-sm z-[300] flex items-center gap-2 border-l-4 border-[var(--primary-color)] whitespace-nowrap"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "CheckCircle",
    size: 16,
    className: "text-emerald-400"
  }), " ", notification));
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render( /*#__PURE__*/React.createElement(App, null));
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
  const currentSrc = e.target.src || '';
  if (currentSrc.includes('.webp') && !e.target.dataset.triedJpg) {
    e.target.dataset.triedJpg = 'true';
    e.target.src = currentSrc.replace('.webp', '.jpg');
    return;
  }
  if (currentSrc.includes('.jpg') && !e.target.dataset.triedWebp) {
    e.target.dataset.triedWebp = 'true';
    e.target.src = currentSrc.replace('.jpg', '.webp');
    return;
  }
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
const cleanAuthorName = raw => {
  return String(raw || '')
    .replace(/^(著|編著|主編|校訂|譯注|輯|整理|編)\s*/, '')
    .replace(/\s*(著|編著|主編|校訂|譯注|輯|整理|編)$/, '')
    .replace(/著|編|校|註|輯/g, '')
    .trim();
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
const GAS_URL = "https://script.google.com/macros/s/AKfycbydej_cIu-CJgDe5ix7o6reteAIwj7irL3c6XQZaDRfO2pRF_NBngd7xhQc8D5UjgE0pw/exec";

// 🟢 【效能優化】：支援動態圖片尺寸與 WebP 極速高壓縮 (節省 70% 流量，手機載入快 3 倍)
const formatImageUrl = (url, width = 800) => {
  if (!url) return typeof SVG_FALLBACK !== 'undefined' ? SVG_FALLBACK : (typeof SVG_COVER_FALLBACK !== 'undefined' ? SVG_COVER_FALLBACK : '');
  let strUrl = String(url).trim();
  if (!strUrl) return typeof SVG_FALLBACK !== 'undefined' ? SVG_FALLBACK : (typeof SVG_COVER_FALLBACK !== 'undefined' ? SVG_COVER_FALLBACK : '');
  if (strUrl.startsWith('data:image')) return strUrl;

  // ⚡ 優先讀取極速 WebP 格式（若伺服器上該書只有 .jpg，handleImgError 會在 0.01 秒內自動切換回 .jpg）
  if (strUrl.startsWith('assets/covers/')) {
    if (strUrl.endsWith('.jpg') || strUrl.endsWith('.jpeg')) {
      strUrl = strUrl.replace(/\.(jpg|jpeg)$/i, '.webp');
    }
    if (strUrl.includes('carousel_') || strUrl.includes('promo_fb_banner') || strUrl.includes('1783336874823')) {
      return `${strUrl}?v=20261114_07`;
    }
    return strUrl;
  }
  if (strUrl.startsWith('assets/')) return strUrl;

  let driveId = null;
  if (strUrl.includes('drive.google.com') || strUrl.includes('googleusercontent.com')) {
    const match = strUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
                  strUrl.match(/id=([a-zA-Z0-9_-]+)/) ||
                  strUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
                  strUrl.match(/open\?id=([a-zA-Z0-9_-]+)/);
    if (match) driveId = match[1];
  } else if (/^[a-zA-Z0-9_-]{25,}$/.test(strUrl) && !strUrl.includes("/")) {
    driveId = strUrl;
  }

  if (driveId) {
    return `https://drive.google.com/thumbnail?id=${driveId}&sz=w${width}`;
  }
  return strUrl;
};

const getCarouselImgSrc = (car) => {
  if (!car) return typeof SVG_FALLBACK !== 'undefined' ? SVG_FALLBACK : (typeof SVG_COVER_FALLBACK !== 'undefined' ? SVG_COVER_FALLBACK : '');
  const img = car.image ? String(car.image).trim() : '';
  const local = car.localImage ? String(car.localImage).trim() : '';

  // 1. 若設定了外部網址或 Google Drive 雲端圖檔，優先使用最新網址
  if (img && (img.startsWith('http://') || img.startsWith('https://') || img.includes('drive.google.com') || (!img.includes('/') && img.length > 15 && !img.startsWith('data:')))) {
    return typeof formatImageUrl === 'function' ? formatImageUrl(img, 1200) : img;
  }

  // 2. 若有本地高畫質圖檔 (assets/covers/...)，優先使用高清實體檔案（防止被壓縮過小的 Base64 縮圖模糊化）
  if (local && !local.startsWith('data:image')) {
    return typeof formatImageUrl === 'function' ? formatImageUrl(local, 1200) : local;
  }
  if (img && !img.startsWith('data:image')) {
    return typeof formatImageUrl === 'function' ? formatImageUrl(img, 1200) : img;
  }

  // 3. 次選 Base64 格式
  if (img.startsWith('data:image')) return img;
  if (local.startsWith('data:image')) return local;

  return typeof SVG_FALLBACK !== 'undefined' ? SVG_FALLBACK : (typeof SVG_COVER_FALLBACK !== 'undefined' ? SVG_COVER_FALLBACK : '');
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

// 🌐 【全球鏡像節點配置・多線路互相引流與加速】
const MIRROR_LINES = [
  {
    id: 'cloudflare',
    name: 'Cloudflare 節點',
    host: 'theliberalartspress.pages.dev',
    url: 'https://theliberalartspress.pages.dev/',
    badge: '大陸直連優選',
    badgeColor: 'bg-emerald-600 text-white',
    desc: 'Anycast 全球 CDN・智慧路由抗阻斷・推薦大陸讀者首選',
    tag: '⚡ 推薦大陸訪問',
    isChinaRecommended: true
  },
  {
    id: 'vercel',
    name: 'Vercel 邊緣節點',
    host: 'theliberalartspress.vercel.app',
    url: 'https://theliberalartspress.vercel.app/',
    badge: '全球極速邊緣',
    badgeColor: 'bg-blue-600 text-white',
    desc: '全球邊緣網絡・港澳台及歐美高響應',
    tag: '🚀 全球高速'
  },
  {
    id: 'github',
    name: 'GitHub 官方主站',
    host: 'theliberalartspress.github.io',
    url: 'https://theliberalartspress.github.io/',
    badge: '官方主站',
    badgeColor: 'bg-stone-800 text-white',
    desc: '官方發行首選・源代碼同步發布站',
    tag: '🛡️ 官方主源'
  },
  {
    id: 'netlify',
    name: 'Netlify 高可用節點',
    host: 'theliberalartspress.netlify.app',
    url: 'https://theliberalartspress.netlify.app/',
    badge: '備用分流',
    badgeColor: 'bg-teal-700 text-white',
    desc: '全球高可用備用節點・全天候分流',
    tag: '🌐 備用線路'
  },
  {
    id: 'render',
    name: 'Render 雲端節點',
    host: 'theliberalartspress.onrender.com',
    url: 'https://theliberalartspress.onrender.com/',
    badge: '彈性備援',
    badgeColor: 'bg-purple-700 text-white',
    desc: '雲端備份節點・多雲容災備援',
    tag: '☁️ 備援線路'
  }
];

// 判斷是否為大陸時區或簡體環境
const checkIsChinaVisitor = () => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const lang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    const chinaTimezones = ['Asia/Shanghai', 'Asia/Chongqing', 'Asia/Harbin', 'Asia/Urumqi', 'Asia/Kashgar'];
    return chinaTimezones.includes(tz) || lang === 'zh-cn' || lang.startsWith('zh-cn');
  } catch (e) {
    return false;
  }
};

// 保留當前網址參數與路徑進行鏡像平滑跳轉
const switchMirror = (targetUrl) => {
  try {
    const currentSearch = window.location.search || '';
    const currentHash = window.location.hash || '';
    const target = new URL(targetUrl);
    target.search = currentSearch;
    target.hash = currentHash;
    window.location.href = target.toString();
  } catch (e) {
    window.location.href = targetUrl;
  }
};
const getBookIntro = book => {
  if (!book) return '';
  for (const key of Object.keys(book)) {
    const k = key.trim().toLowerCase();
    if (k.includes('intro') || k.includes('list') || k.includes('description') || k.includes('簡介') || k.includes('介紹') || k === 'n' || k === '13') {
      const val = String(book[key] || '').trim();
      if (val && !val.includes('暫無') && !val.includes('尚無') && val.length > 15) return val;
    }
  }
  const customIntro = String(book.intro || book['書籍介紹'] || '').trim();
  if (customIntro && !customIntro.includes('暫無') && !customIntro.includes('尚無') && customIntro.length > 15) return customIntro;

  const title = String(book.title || '').trim();
  const rawAuthor = String(book.author || '').trim();
  const author = rawAuthor.replace(/^(著|編著|主編|校訂|譯注|輯|整理)\s*/, '').replace(/\s*(著|編著|主編|校訂|譯注|輯|整理)$/, '');
  const authorName = (author && author !== '未標記' && author !== '不詳') ? `${author}先生` : '著者';

  if (title.includes('滿文原檔') || title.includes('滿文老檔') || title.includes('滿學') || title.includes('八旗')) {
    return `本書《${title}》為清史與滿學泰斗莊吉發教授對清代第一手滿文原始檔冊之權威解讀與精審譯注巨著。全書立足於珍稀之無圈點老滿文與加圈點滿文檔案，逐件對勘清代滿漢原始文獻及《清實錄》，聚焦於八旗制度演變、軍政決策、邊疆經略及滿漢文化整合。著者以深厚之滿語語法功底與歷史考據學養，詳加箋釋考訂，訂正諸多傳世史籍之訛誤，為研究清代早期歷史、滿語文獻學及清史檔案之頂尖權威著作。`;
  }
  if (title.includes('夢影拾零') || rawAuthor.includes('傅光明')) {
    return `本書《${title}》為現代文學史學者傅光明先生之專題隨筆與史料考辨精萃。作者長年浸淫於現代文壇檔案與作家口述史料，本書聚焦於二十世紀中國文壇關鍵作家（如老舍、冰心、徐志摩、沈從文等）之創作行跡、書信手稿與佚事考辨。從細微處還原現代文學史上諸多幽微而鮮活的片刻，將文人命運、作品意涵與時代風雲交織呈現，展現了「以細節還原歷史、以心靈對話經典」的獨特學術風貌。`;
  }
  if (title.includes('詩經') || title.includes('楚辭') || title.includes('唐詩') || title.includes('宋詞') || title.includes('杜甫') || title.includes('李白') || title.includes('蘇軾')) {
    return `本書《${title}》由${authorName}撰述，為古典詩詞與文體美學領域之精研專著。全書立足於歷代箋註與詩學批評傳統，從音律格調、意象結構、篇章章法及創作心態出發，對《${title}》的藝術造詣與思想境界進行全面剖析，論述兼具文獻考訂之扎實與審美闡發之敏銳。`;
  }
  if (title.includes('紅樓夢') || title.includes('水滸') || title.includes('三國') || title.includes('小說') || title.includes('戲曲')) {
    return `本書《${title}》由${authorName}深入探究中國古典小說與戲曲藝術之敘事結構、思想內涵及文體演變。著者從版本源流、人物塑造、情節母題及社會文化心態切入，系統考辨文本底本之流變與接受史，展現了深厚之文本解讀功力與宏闊之文學史視野。`;
  }
  if (title.includes('易經') || title.includes('周易') || title.includes('老子') || title.includes('莊子') || title.includes('論語') || title.includes('諸子') || title.includes('理學')) {
    return `本書《${title}》由${authorName}所著，為中國哲學思想史與古典義理體系之重要專著。全書緊扣原典章句與概念範疇，深入探討天道、心性、名教、知行及本體論之根本命題，條分縷析概念生成與思想演變之內在邏輯，揭示先哲體系之精神精髓與當代價值。`;
  }

  return `本書《${title}》由${authorName}撰著，立足於深厚之人文學術底蘊，針對該專題所涉之文獻史料、核心思想與時代文化背景展開系統性研討。全書本諸實事求是、考鏡源流之治學傳統，博採經史典籍與近代學術成果，論證條理縝密、分析精闢透徹，為研讀該領域專題不可多得之權威著作。`;
};

const getBookReview = book => {
  if (!book) return '';
  for (const key of Object.keys(book)) {
    const k = key.trim().toLowerCase();
    if (k.includes('心得') || k.includes('review') || k.includes('評析') || k === 'o' || k === '14') {
      const val = String(book[key] || '').trim();
      if (val && !val.includes('尚無') && val.length > 15) return val;
    }
  }
  const customReview = String(book['心得'] || book.review || '').trim();
  if (customReview && !customReview.includes('尚無') && customReview.length > 15) return customReview;

  const title = String(book.title || '').trim();
  const rawAuthor = String(book.author || '').trim();
  const author = rawAuthor.replace(/^(著|編著|主編|校訂|譯注|輯|整理)\s*/, '').replace(/\s*(著|編著|主編|校訂|譯注|輯|整理)$/, '');
  const authorName = (author && author !== '未標記' && author !== '不詳') ? `${author}先生` : '著者';

  if (title.includes('滿文原檔') || title.includes('滿文老檔') || title.includes('滿學')) {
    return `【清史名著導讀】莊吉發教授治滿文原檔，乃近代清史研究之重大里程碑。研讀本書，能直接透析清廷早期政令出台之原始面貌與滿洲貴族心態，許多漢文史料遮蔽或改竄之歷史真相於滿文原檔中昭然若揭，考證嚴謹、體例精審，實為明清史與滿學研究生及專家必讀之典範力作。`;
  }
  if (title.includes('夢影拾零') || rawAuthor.includes('傅光明')) {
    return `【學術札記】傅光明先生治現代文學史，最擅於在歷史檔案與作家日常記憶的縫隙中發掘微言大義。本書擺脫了宏大敘事的生硬感，以細膩生動之筆勾勒文人風骨與文字光影。讀之既能獲得豐富的第一手文壇掌故，又能深刻體會作家的創作心路與生命困境，對現代文學愛好者與文史研究者皆具極高之啟發性與典藏價值。`;
  }

  return `【學術評析】本書體例嚴謹、考證極為扎實，處處可見求真求實之學術風範。${authorName}對相關文獻源流與核心論題之剖析鉅細靡遺、論據確鑿，解決了許多長年考訂上的疑難，兼具學術深度與高度研讀價值。`;
};

const getCategoryBadgeClass = cat => {
  const c = String(cat || '').trim();
  if (c.includes('經') || c.includes('哲學') || c.includes('諸子') || c.includes('易') || c.includes('儒') || c.includes('佛') || c.includes('道教') || c.includes('思想')) {
    return 'siku-tag-jing'; // 經部／哲學：黛藍 (#2C3E50)
  }
  if (c.includes('史') || c.includes('滿') || c.includes('八旗') || c.includes('臺') || c.includes('台') || c.includes('檔案') || c.includes('方志') || c.includes('清代') || c.includes('歷代')) {
    return 'siku-tag-shi'; // 史部／清史滿學：赭石 (#8C5A2B)
  }
  if (c.includes('字') || c.includes('文字') || c.includes('聲韻') || c.includes('訓詁') || c.includes('目錄') || c.includes('版本') || c.includes('金石') || c.includes('藝術') || c.includes('印') || c.includes('小學')) {
    return 'siku-tag-zi'; // 子部／文獻目錄：竹青 (#3D5A45)
  }
  return 'siku-tag-default';
};

const getInkAnimationClass = cat => {
  const c = String(cat || '').trim();
  if (c.includes('經') || c.includes('哲學') || c.includes('諸子') || c.includes('易') || c.includes('儒') || c.includes('佛') || c.includes('道教') || c.includes('思想')) {
    return 'ink-enter-jing';
  }
  if (c.includes('史') || c.includes('滿') || c.includes('八旗') || c.includes('臺') || c.includes('台') || c.includes('檔案') || c.includes('方志') || c.includes('清代') || c.includes('歷代')) {
    return 'ink-enter-shi';
  }
  if (c.includes('字') || c.includes('文字') || c.includes('聲韻') || c.includes('訓詁') || c.includes('目錄') || c.includes('版本') || c.includes('金石') || c.includes('藝術') || c.includes('印') || c.includes('小學')) {
    return 'ink-enter-zi';
  }
  if (c.includes('文') || c.includes('詩') || c.includes('詞') || c.includes('現代') || c.includes('小說') || c.includes('散文') || c.includes('曲') || c.includes('戲曲') || c.includes('叢刊')) {
    return 'ink-enter-ji';
  }
  return 'ink-enter-default';
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

const parseDateToTimestamp = (dateStr, fallbackId = '') => {
  if (!dateStr) return 0;
  if (typeof dateStr === 'number') return dateStr;
  const str = String(dateStr).trim();
  const parsed = Date.parse(str);
  if (!isNaN(parsed)) return parsed;
  const m = str.match(/(\d{4})[/-](\d{1,2})[/-](\d{1,2})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
  if (m) {
    return new Date(parseInt(m[1], 10), parseInt(m[2], 10) - 1, parseInt(m[3], 10), parseInt(m[4] || 0, 10), parseInt(m[5] || 0, 10), parseInt(m[6] || 0, 10)).getTime();
  }
  const idMatch = String(fallbackId || str).match(/(\d{8,})/);
  if (idMatch) return parseInt(idMatch[1], 10);
  return 0;
};

const sortNewestFirst = (list, dateKey = 'date', idKey = 'orderId') => {
  if (!Array.isArray(list)) return [];
  return [...list].sort((a, b) => {
    const timeA = parseDateToTimestamp(a[dateKey], a[idKey] || a.id || a.orderId);
    const timeB = parseDateToTimestamp(b[dateKey], b[idKey] || b.id || b.orderId);
    if (timeB !== timeA) return timeB - timeA;
    return String(b[idKey] || b.orderId || b.id || '').localeCompare(String(a[idKey] || a.orderId || a.id || ''));
  });
};

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
  menuNewArrivals: '暢銷書',
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
  newArrivalsTitle: '暢銷書 - 推薦',
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
  const [carousels, setCarousels] = useState(() => {
    const raw = initData.carousels && initData.carousels.length > 0 ? initData.carousels : fallbackCarousels;
    const filtered = (raw || []).filter(c => c && c.status !== '草稿' && c.status !== 'draft');
    return filtered.length > 0 ? filtered : fallbackCarousels;
  });
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
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [visibleCount, setVisibleCount] = useState(8);
  const [iframeModal, setIframeModal] = useState({
    isOpen: false,
    url: '',
    title: ''
  });
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isPresidentOpen, setIsPresidentOpen] = useState(false);
  const [isContactPageOpen, setIsContactPageOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isRandomBooksOpen, setIsRandomBooksOpen] = useState(false);
  const randomBooksScrollRef = useRef(null);
  const [heroMouse, setHeroMouse] = useState({ x: 0, y: 0, nx: 0, ny: 0, active: false });
  const handleHeroMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const nx = ((x / rect.width) - 0.5) * 2;
    const ny = ((y / rect.height) - 0.5) * 2;
    setHeroMouse({ x, y, nx, ny, active: true });
  };
  const handleHeroMouseLeave = () => {
    setHeroMouse(prev => ({ ...prev, active: false, nx: 0, ny: 0 }));
  };
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
  const pendingUrlBookRef = useRef((() => {
    try {
      if (typeof window === 'undefined') return null;
      const params = new URLSearchParams(window.location.search);
      return params.get('book') || params.get('id') || null;
    } catch(e) {
      return null;
    }
  })());
  const pendingUrlAddRef = useRef((() => {
    try {
      if (typeof window === 'undefined') return false;
      const params = new URLSearchParams(window.location.search);
      return params.get('add') === '1';
    } catch(e) {
      return false;
    }
  })());
  const [isLargeFont, setIsLargeFont] = useState(() => {
    try {
      return typeof window !== 'undefined' && localStorage.getItem('lapen_font_large') === 'true';
    } catch(e) {
      return false;
    }
  });
  const toggleLargeFont = useCallback(() => {
    setIsLargeFont(prev => {
      const next = !prev;
      try {
        localStorage.setItem('lapen_font_large', String(next));
        document.documentElement.style.fontSize = next ? '18px' : '';
      } catch(e) {}
      return next;
    });
  }, []);
  useEffect(() => {
    try {
      document.documentElement.style.fontSize = isLargeFont ? '18px' : '';
    } catch(e) {}
  }, [isLargeFont]);

  const [recentBooks, setRecentBooks] = useState(() => {
    try {
      const saved = localStorage.getItem('lapen_recent_books');
      return saved ? JSON.parse(saved) : [];
    } catch(e) {
      return [];
    }
  });
  const [isRecentOpen, setIsRecentOpen] = useState(false);
  const [recentTab, setRecentTab] = useState('recent');
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('lapen_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch(e) {
      return [];
    }
  });
  const isWishlisted = id => wishlist.some(x => String(x.id) === String(id));
  const toggleWishlist = (book, ev) => {
    if (ev && ev.stopPropagation) ev.stopPropagation();
    if (!book || !book.id) return;
    const bid = String(book.id).trim();
    const exists = wishlist.some(x => String(x.id) === bid);
    let next;
    if (exists) {
      next = wishlist.filter(x => String(x.id) !== bid);
      showMsg(`已從「我的收藏」移除《${book.title}》`);
    } else {
      const coverSrc = book.localCover || book.cover || `assets/covers/${bid}.webp`;
      const item = {
        id: bid,
        title: book.title,
        author: book.author,
        category: book.category,
        price: book.price,
        cover: coverSrc,
        savedAt: Date.now()
      };
      next = [item, ...wishlist];
      showMsg(`❤️ 已加入「我的收藏／待購書單」：《${book.title}》`);
    }
    setWishlist(next);
    try { localStorage.setItem('lapen_wishlist', JSON.stringify(next)); } catch(e) {}
  };
  const renderWishlistHeartBtn = (book, topPx = 10, rightPx = 10) => /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": isWishlisted(book.id) ? "移除收藏" : "加入收藏",
    title: isWishlisted(book.id) ? "已收藏（點擊移除）" : "加入我的收藏／待購書單",
    onClick: ev => toggleWishlist(book, ev),
    className: "z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs shadow transition-all",
    style: Object.assign({ position: 'absolute', top: `${topPx}px`, right: `${rightPx}px` }, isWishlisted(book.id) ? { background: '#E11D48', color: '#FFFFFF', border: '1px solid #E11D48' } : { background: 'rgba(255,255,255,0.9)', color: '#57534E', border: '1px solid #E7E5E4' })
  }, isWishlisted(book.id) ? "♥" : "♡");
  useEffect(() => {
    if (!selectedBookDetail || !selectedBookDetail.id) return;
    setRecentBooks(prev => {
      const bid = String(selectedBookDetail.id).trim();
      const coverSrc = selectedBookDetail.localCover || selectedBookDetail.cover || `assets/covers/${bid}.webp`;
      const item = {
        id: bid,
        title: selectedBookDetail.title,
        author: selectedBookDetail.author,
        category: selectedBookDetail.category,
        price: selectedBookDetail.price,
        cover: coverSrc,
        viewedAt: Date.now()
      };
      const next = [item, ...prev.filter(x => String(x.id) !== bid)].slice(0, 8);
      try { localStorage.setItem('lapen_recent_books', JSON.stringify(next)); } catch(e) {}
      return next;
    });
  }, [selectedBookDetail]);

  const formatRecentTime = ts => {
    if (!ts) return '剛剛瀏覽';
    const d = new Date(ts);
    const now = new Date();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    if (d.toDateString() === now.toDateString()) return `今天 ${hh}:${mm}`;
    const yest = new Date(now);
    yest.setDate(now.getDate() - 1);
    if (d.toDateString() === yest.toDateString()) return `昨天 ${hh}:${mm}`;
    return `${d.getMonth() + 1}/${d.getDate()} ${hh}:${mm}`;
  };

  const openQuickSearch = useCallback(() => {
    setIsSearchModalOpen(true);
    setTimeout(() => {
      const inp = document.getElementById('lapen-search-title-input');
      if (inp) inp.focus();
    }, 80);
  }, []);

  useEffect(() => {
    const onKeyDown = e => {
      const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
      const isEditing = tag === 'input' || tag === 'textarea' || tag === 'select' || (e.target && e.target.isContentEditable);
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openQuickSearch();
      } else if (!isEditing && e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        openQuickSearch();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [openQuickSearch]);
  const carouselTouchStartRef = useRef(null);
  const [isBookDetailFullscreen, setIsBookDetailFullscreen] = useState(false);
  const [isRelatedBooksOpen, setIsRelatedBooksOpen] = useState(false);

  const relatedBooks = useMemo(() => {
    if (!selectedBookDetail || !books || books.length === 0) return [];
    const currentCat = selectedBookDetail.category;
    const currentId = selectedBookDetail.id;
    const matched = books.filter(b => b.id !== currentId && b.category === currentCat);
    if (matched.length >= 4) return matched.slice(0, 4);
    const others = books.filter(b => b.id !== currentId && b.category !== currentCat);
    return [...matched, ...others].slice(0, 4);
  }, [selectedBookDetail, books]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewBook, setReviewBook] = useState(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isMirrorModalOpen, setIsMirrorModalOpen] = useState(false);
  const [mirrorLatencies, setMirrorLatencies] = useState({});
  const [isTestingLatencies, setIsTestingLatencies] = useState(false);

  useEffect(() => {
    const onEsc = e => {
      if (e.key !== 'Escape') return;
      if (isReviewModalOpen) { setIsReviewModalOpen(false); return; }
      if (submittedDetail) { setSubmittedDetail(null); return; }
      if (selectedBookDetail) { setSelectedBookDetail(null); return; }
      if (isRandomBooksOpen) { setIsRandomBooksOpen(false); return; }
      if (isCartOpen) { setIsCartOpen(false); return; }
      if (isSearchModalOpen) { setIsSearchModalOpen(false); return; }
      if (isAboutOpen) { setIsAboutOpen(false); return; }
      if (isPresidentOpen) { setIsPresidentOpen(false); return; }
      if (isContactPageOpen) { setIsContactPageOpen(false); return; }
      if (isMirrorModalOpen) { setIsMirrorModalOpen(false); return; }
      if (iframeModal && iframeModal.isOpen) { setIframeModal(prev => ({ ...prev, isOpen: false })); return; }
      if (isRecentOpen) { setIsRecentOpen(false); return; }
      if (isContactOpen) { setIsContactOpen(false); return; }
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [isReviewModalOpen, submittedDetail, selectedBookDetail, isRandomBooksOpen, isCartOpen, isSearchModalOpen, isAboutOpen, isPresidentOpen, isContactPageOpen, isMirrorModalOpen, iframeModal, isRecentOpen, isContactOpen]);

  // 🏮 護眼模式狀態（夜讀暖黃燭光模式）
  const [isEyeCare, setIsEyeCare] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        return localStorage.getItem('lapen_eyecare_theme') === 'true';
      }
    } catch (e) {}
    return false;
  });

  const [showChinaBanner, setShowChinaBanner] = useState(() => {
    try {
      if (typeof window === 'undefined') return false;
      const dismissed = safeGetStorage('hide_china_mirror_banner') === 'true';
      if (dismissed) return false;
      if (window.location.hostname.includes('pages.dev')) return false;
      return checkIsChinaVisitor();
    } catch (e) {
      return false;
    }
  });

  const measureMirrorLatencies = useCallback(async () => {
    setIsTestingLatencies(true);
    const results = {};
    for (const mirror of MIRROR_LINES) {
      const startTime = Date.now();
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2800);
        await fetch(`${mirror.url}favicon.png?_t=${Date.now()}`, {
          method: 'HEAD',
          mode: 'no-cors',
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        results[mirror.id] = Date.now() - startTime;
      } catch (e) {
        results[mirror.id] = -1;
      }
    }
    setMirrorLatencies(results);
    setIsTestingLatencies(false);
  }, []);

  const openMirrorModal = useCallback(() => {
    setIsMirrorModalOpen(true);
    measureMirrorLatencies();
  }, [measureMirrorLatencies]);
  const sliderRef = useRef(null);
  const hasFetchedRef = useRef(false);
  const showMsg = useCallback(text => {
    setNotification(text);
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // 🏮 護眼燭光模式切換 (放在 showMsg 之後確保已初始化)
  const toggleEyeCare = useCallback(() => {
    setIsEyeCare(prev => {
      const next = !prev;
      try {
        localStorage.setItem('lapen_eyecare_theme', String(next));
        if (next) {
          document.documentElement.classList.add('theme-eyecare');
          showMsg('🏮 已開啟夜讀護眼模式（低藍光・暖黃燭光）');
        } else {
          document.documentElement.classList.remove('theme-eyecare');
          showMsg('☀️ 已恢復日間素雅模式');
        }
      } catch (e) {}
      return next;
    });
  }, [showMsg]);

  useEffect(() => {
    try {
      if (isEyeCare) {
        document.documentElement.classList.add('theme-eyecare');
      } else {
        document.documentElement.classList.remove('theme-eyecare');
      }
    } catch (e) {}
  }, [isEyeCare]);
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
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const targetQuery = urlParams.get('book') || urlParams.get('id') || pendingUrlBookRef.current;
      const catParam = urlParams.get('category');
      if (targetQuery) {
        const pool = (books && books.length > 0) ? books : [
          ...((staticData && staticData.books) || []),
          ...((initData && initData.initialBooks) || []),
          ...((initData && initData.choices) || [])
        ];
        const q = String(targetQuery).trim().toLowerCase();
        const qClean = q.replace(/[^0-9a-zA-Z\u4e00-\u9fa5]/g, '');
        const found = pool.find(b => {
          if (!b) return false;
          const bId = String(b.id || '').trim().toLowerCase();
          if (bId && (bId === q || bId.padStart(5, '0') === q.padStart(5, '0') || bId.replace(/^0+/, '') === q.replace(/^0+/, ''))) return true;
          if (b.isbn) {
            const bIsbn = String(b.isbn).replace(/[^0-9a-zA-Z]/g, '');
            const qIsbn = q.replace(/[^0-9a-zA-Z]/g, '');
            if (bIsbn && qIsbn && bIsbn === qIsbn) return true;
          }
          const bTitle = String(b.title || '').trim().toLowerCase();
          if (bTitle && (bTitle === q || (qClean && bTitle.replace(/[^0-9a-zA-Z\u4e00-\u9fa5]/g, '') === qClean))) return true;
          return false;
        });
        if (found) {
          setSelectedBookDetail(found);
          pendingUrlBookRef.current = null;
          if (pendingUrlAddRef.current) {
            pendingUrlAddRef.current = false;
            addToCart(found);
          }
        }
      }
      if (catParam) {
        setSelectedCategory(catParam);
        const searchEl = document.getElementById('search-section') || document.querySelector('.search-table-container');
        if (searchEl) searchEl.scrollIntoView({ behavior: 'smooth' });
      }
      const authorParam = urlParams.get('author');
      if (authorParam) {
        const ca = cleanAuthorName(authorParam);
        if (ca) {
          setSelectedAuthor(ca);
          setSelectedCategory('全部');
          const searchEl = document.getElementById('search-section') || document.querySelector('.search-table-container');
          if (searchEl) searchEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } catch(e) {
      console.warn("URL parse error:", e);
    }
  }, [books]);

  // 🏷️ 結構化數據 (Schema.org / JSON-LD) 與動態標題
  useEffect(() => {
    if (selectedBookDetail) {
      setIsRelatedBooksOpen(false);
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
      const currentBookUrl = `${window.location.origin}${window.location.pathname}?book=${encodeURIComponent(selectedBookDetail.id || selectedBookDetail.title)}`;
      const currentCatUrl = `${window.location.origin}${window.location.pathname}?category=${encodeURIComponent(selectedBookDetail.category || '')}`;
      
      const bookSchema = {
        "@type": "Book",
        "@id": `${currentBookUrl}#book`,
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
          "url": currentBookUrl
        },
        "image": selectedBookDetail.localCover ? `https://theliberalartspress.github.io/${selectedBookDetail.localCover}` : selectedBookDetail.cover,
        "description": getBookIntro(selectedBookDetail),
        "genre": selectedBookDetail.category || "學術文史",
        "isPartOf": {
          "@type": "BookSeries",
          "name": selectedBookDetail.category || "文史哲學術著作"
        },
        "bookFormat": selectedBookDetail.year && selectedBookDetail.year.includes("精") ? "https://schema.org/Hardcover" : "https://schema.org/Paperback",
        "inLanguage": "zh-Hant",
        "keywords": `${selectedBookDetail.title}, ${cleanAuthor}, ${selectedBookDetail.category}, 文史哲出版社, 國學研究, 古典文獻, 學術出版`,
        "sameAs": [
          `https://zh.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(selectedBookDetail.title)}`,
          `https://scholar.google.com.tw/scholar?q=${encodeURIComponent(selectedBookDetail.title + ' ' + cleanAuthor)}`,
          `https://aleweb.ncl.edu.tw/F?func=find-b&find_code=WRD&request=${encodeURIComponent(selectedBookDetail.title)}`
        ]
      };
      if (selectedBookDetail.isbn) bookSchema.isbn = selectedBookDetail.isbn;

      const breadcrumbSchema = {
        "@type": "BreadcrumbList",
        "@id": `${currentBookUrl}#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "文史哲首頁",
            "item": "https://theliberalartspress.github.io/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": selectedBookDetail.category || "學術典籍",
            "item": currentCatUrl
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": selectedBookDetail.title,
            "item": currentBookUrl
          }
        ]
      };

      const fullGraph = {
        "@context": "https://schema.org",
        "@graph": [bookSchema, breadcrumbSchema]
      };

      script.textContent = JSON.stringify(fullGraph);

      let canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        canonical.href = currentBookUrl;
      }

      // 🎓 Google Scholar 學術引用標籤 (Highwire Press 規範)
      const setCitationMeta = (name, content) => {
        let el = document.querySelector(`meta[name="${name}"]`);
        if (!el) {
          el = document.createElement('meta');
          el.setAttribute('name', name);
          document.head.appendChild(el);
        }
        el.setAttribute('content', content || '');
      };
      setCitationMeta('citation_title', selectedBookDetail.title);
      setCitationMeta('citation_author', cleanAuthor || '文史哲作者');
      setCitationMeta('citation_publisher', '文史哲出版社有限公司');
      setCitationMeta('citation_language', 'zh-TW');
      if (selectedBookDetail.isbn) setCitationMeta('citation_isbn', selectedBookDetail.isbn);
    } else {
      // 移除 Google Scholar 臨時標籤
      ['citation_title', 'citation_author', 'citation_publisher', 'citation_language', 'citation_isbn'].forEach(n => {
        const el = document.querySelector(`meta[name="${n}"]`);
        if (el) el.remove();
      });
      if (!pendingUrlBookRef.current) {
        try {
          const currentUrl = new URL(window.location.href);
          currentUrl.searchParams.delete('book');
          currentUrl.searchParams.delete('id');
          if (selectedAuthor) {
            currentUrl.searchParams.set('author', selectedAuthor);
            currentUrl.searchParams.delete('category');
          } else if (selectedCategory && selectedCategory !== '全部') {
            currentUrl.searchParams.set('category', selectedCategory);
            currentUrl.searchParams.delete('author');
          } else {
            currentUrl.searchParams.delete('category');
            currentUrl.searchParams.delete('author');
          }
          window.history.replaceState(null, '', currentUrl.pathname + (currentUrl.searchParams.toString() ? '?' + currentUrl.searchParams.toString() : ''));
        } catch(e) {}
      }
      const script = document.getElementById('schema-book-jsonld');
      if (script) script.remove();

      // 📚 分類與學者專屬落地頁 SEO (Landing SEO)
      let canonical = document.querySelector('link[rel="canonical"]');
      let catScript = document.getElementById('schema-category-jsonld');
      let metaDesc = document.querySelector('meta[name="description"]');

      if (selectedAuthor) {
        const authorTitle = `《${selectedAuthor}》學者全館出版專題・典藏著作 - 文史哲出版社官方網站`;
        document.title = authorTitle;
        const currentAuthorUrl = `https://theliberalartspress.github.io/?author=${encodeURIComponent(selectedAuthor)}`;
        if (canonical) {
          canonical.href = currentAuthorUrl;
        }
        if (metaDesc) {
          metaDesc.setAttribute('content', `文史哲出版社《${selectedAuthor}》學者出版專題，收錄相關學術專著、考據研究與代表文集，提供線上書目檢索與郵購服務。`);
        }
        if (!catScript) {
          catScript = document.createElement('script');
          catScript.id = 'schema-category-jsonld';
          catScript.type = 'application/ld+json';
          document.head.appendChild(catScript);
        }
        catScript.textContent = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": `${currentAuthorUrl}#author`,
          "name": `《${selectedAuthor}》學者出版專題目錄`,
          "description": `文史哲出版社半世紀嚴選《${selectedAuthor}》學者出版專題與典籍。`,
          "url": currentAuthorUrl,
          "isPartOf": {
            "@type": "WebSite",
            "name": "文史哲出版社官方網站",
            "url": "https://theliberalartspress.github.io/"
          },
          "publisher": {
            "@type": "Organization",
            "name": "文史哲出版社有限公司",
            "url": "https://theliberalartspress.github.io/"
          }
        });
      } else if (selectedCategory && selectedCategory !== '全部') {
        const catTitle = `《${selectedCategory}》專題學術典籍・推薦書目 - 文史哲出版社官方網站`;
        document.title = catTitle;
        const currentCatUrl = `https://theliberalartspress.github.io/?category=${encodeURIComponent(selectedCategory)}`;
        if (canonical) {
          canonical.href = currentCatUrl;
        }
        if (metaDesc) {
          metaDesc.setAttribute('content', `文史哲出版社《${selectedCategory}》專題學術圖書目錄，嚴選權威專著、古典文獻與考據論著，提供全書目線上查詢與專屬訂購。`);
        }
        if (!catScript) {
          catScript = document.createElement('script');
          catScript.id = 'schema-category-jsonld';
          catScript.type = 'application/ld+json';
          document.head.appendChild(catScript);
        }
        catScript.textContent = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": `${currentCatUrl}#category`,
          "name": `《${selectedCategory}》專題學術典籍目錄`,
          "description": `文史哲出版社半世紀嚴選《${selectedCategory}》領域學術論著與典籍。`,
          "url": currentCatUrl,
          "isPartOf": {
            "@type": "WebSite",
            "name": "文史哲出版社官方網站",
            "url": "https://theliberalartspress.github.io/"
          },
          "publisher": {
            "@type": "Organization",
            "name": "文史哲出版社有限公司",
            "url": "https://theliberalartspress.github.io/"
          }
        });
      } else {
        document.title = '文史哲出版社官方網站｜1971年創立・文學歷史哲學專業學術出版';
        if (canonical) {
          canonical.href = 'https://theliberalartspress.github.io/';
        }
        if (metaDesc) {
          metaDesc.setAttribute('content', '文史哲出版社有限公司創立於1971年，專注文學、歷史、哲學、藝術史、語言文字學、宗教及人文社會科學學術論著出版。全館典藏超過2,500種專業圖書，傳承文化，創新閱讀。');
        }
        if (catScript) catScript.remove();
      }
    }
  }, [selectedBookDetail, selectedCategory, selectedAuthor]);
  const syncWithGAS = useCallback(async (action, payloadData = null) => {
    try {
      const currentOrigin = window.location.origin;
      const safeOrigin = currentOrigin.includes("usercontent.goog") ? "https://candylovema.github.io" : currentOrigin;
      const payloadObj = {
        action,
        payload: payloadData,
        origin: safeOrigin
      };
      const response = await fetch(GAS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payloadObj),
        keepalive: true
      });
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
                if (dataToUse.carousels) {
                  const filtered = (dataToUse.carousels || []).filter(c => c && c.status !== '草稿' && c.status !== 'draft');
                  setCarousels(filtered.length > 0 ? filtered : fallbackCarousels);
                }
                if (dataToUse.settings) setSettings(prev => ({ ...prev, ...dataToUse.settings }));
                if (dataToUse.ui) setUi(prev => ({ ...prev, ...dataToUse.ui }));
                setIsBooksLoading(false);
                return true;
            }
            return false;
        };

        // 1. 若已經在記憶體中，立即套用初始資料，但持續監聽最新 data.js 更新廣播
        applyLoadedData();

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
        setQueryResults(sortNewestFirst(uniqueOrders, 'date', 'orderId'));
      } else if (localMatches.length > 0) {
        setQueryResults(sortNewestFirst(localMatches, 'date', 'orderId'));
      } else {
        setQueryResults([]);
        showMsg("未找到符合的訂單記錄");
      }
    } catch (error) {
      if (localMatches.length > 0) {
        setQueryResults(sortNewestFirst(localMatches, 'date', 'orderId'));
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
    if (selectedAuthor) {
      const ca = cleanAuthorName(selectedAuthor).toLowerCase();
      return books.filter(b => b.author && cleanAuthorName(b.author).toLowerCase().includes(ca));
    }
    const list = selectedCategory === '全部' ? books : books.filter(b => b.category === selectedCategory);
    const shuffled = [...list];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [books, selectedCategory, selectedAuthor]);
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
      return live ? { ...cb, ...live, round: cb.round || live.round || 1, cover: live.localCover || live.cover || cb.cover || cb.image } : { ...cb, round: cb.round || 1 };
    }).filter(Boolean);

    const pageSize = 8;
    const targetRoundNum = roundIdx + 1;
    const roundBooks = designatedBooks.filter(b => Number(b.round || 1) === targetRoundNum);

    if (roundBooks.length > 0) {
      if (roundBooks.length < pageSize && books.length > roundBooks.length) {
        const designatedIds = new Set(designatedBooks.map(b => String(b.id || b.title)));
        const fillers = books
          .filter(b => !designatedIds.has(String(b.id || b.title)))
          .sort(() => 0.5 - Math.random())
          .slice(0, pageSize - roundBooks.length);
        return [...roundBooks, ...fillers];
      }
      return roundBooks.slice(0, pageSize);
    }

    if (books.length > 0) {
      const shuffled = [...books].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, pageSize);
    }
    return [];
  };

  const openRandomBooksModal = (isNextRound = false) => {
    setIsMobileMenuOpen(false);
    const designatedRaw = (newArrivalsList && newArrivalsList.length > 0) ? newArrivalsList : (choiceBooks && choiceBooks.length > 0 ? choiceBooks : []);
    const configuredRounds = Array.from(new Set(designatedRaw.map(b => Number(b.round || 1)))).filter(r => r > 0);
    const maxConfiguredRound = configuredRounds.length > 0 ? Math.max(...configuredRounds) : 1;

    let nextRound = 0;
    if (isNextRound === true) {
      if (maxConfiguredRound > 1) {
        nextRound = (recommendationRound + 1) % maxConfiguredRound;
      } else {
        nextRound = recommendationRound + 1;
      }
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
    const name = sanitizeInput(e.target.name ? e.target.name.value : "");
    const contact = sanitizeInput(e.target.contact ? e.target.contact.value : (e.target.phone ? e.target.phone.value : (e.target.email ? e.target.email.value : "")));
    const content = sanitizeInput(e.target.content ? e.target.content.value : "");

    if (!name || name.trim().length < 1) return showMsg("請輸入您的稱呼（必填）");
    if (!contact || contact.trim().length < 2) return showMsg("請輸入聯絡電話或電子信箱（必填）");
    if (!content || content.trim().length < 2) return showMsg("請輸入讀後心得或提問（必填）");

    setIsSubmittingReview(true);
    setLastActionTime(Date.now());

    const isEmail = contact.includes("@");
    const phone = isEmail ? "" : contact;
    const email = isEmail ? contact : "";

    const bookTitle = reviewBook ? reviewBook.title : '未知書籍';
    const bookId = reviewBook && reviewBook.id ? reviewBook.id : '';

    const combinedQuery = `【互動項目】讀後心得交流\n【書籍名稱】《${bookTitle}》${bookId ? `（書碼：${bookId}）` : ''}\n【讀者稱呼】${name}\n【聯絡方式】${contact}\n─────────────────\n【讀後心得感言】\n${content}`;

    const submitId = `REV-${Date.now().toString().slice(-6)}`;
    const newLog = {
      id: submitId,
      msgId: submitId,
      platform: 'Web讀後心得交流',
      name: name,
      userName: name,
      user: name,
      phone: phone || contact,
      tel: phone || contact,
      email: email || contact,
      mail: email || contact,
      contact: contact,
      content: combinedQuery,
      message: combinedQuery,
      msg: combinedQuery,
      query: combinedQuery,
      bookTitle: bookTitle,
      bookId: bookId,
      reviewContent: content,
      status: '未處理',
      date: new Date().toLocaleString(),
      '留言編號': submitId,
      '稱呼': name,
      '姓名': name,
      '聯絡方式': contact,
      '電話': phone || contact,
      '電子信箱': email || (isEmail ? contact : ''),
      '反映內容': combinedQuery,
      '書籍名稱': bookTitle,
      '心得內容': content,
      '狀態': '未處理',
      '時間': new Date().toLocaleString()
    };

    // 💾 同步存入後台本機客服留言庫
    try {
      const existingCS = JSON.parse(localStorage.getItem('lapen_admin_cs') || '[]');
      localStorage.setItem('lapen_admin_cs', JSON.stringify([newLog, ...existingCS]));
    } catch (err) {}

    // 🚀 背景異步發送至 Google 雲端
    syncWithGAS('NEW_CS_MSG', newLog).catch(err => console.log("Review sync error:", err));

    e.target.reset();
    setIsReviewModalOpen(false);
    setIsSubmittingReview(false);
    showMsg("感謝您的寶貴心得，已成功送出與編輯部交流！");
  };
  const handleSearchSubmit = e => {
    e.preventDefault();
    setAppliedSearch(searchForm);
    setSearchVisibleCount(8);
  };
  const normalizeSearchText = useCallback(str => {
    if (!str) return '';
    const map = {
      '台':'臺','裡':'裏','為':'為','爲':'為','著':'著','着':'著',
      '书':'書','国':'國','学':'學','诗':'詩','词':'詞','经':'經','传':'傳','论':'論',
      '汉':'漢','语':'語','义':'義','礼':'禮','记':'記','说':'說','丛':'叢','图':'圖',
      '馆':'館','华':'華','东':'東','亚':'亞','欧':'歐','专':'專','题':'題','据':'據',
      '订':'訂','评':'評','注':'註','译':'譯','编':'編','选':'選','录':'錄','档':'檔',
      '满':'滿','庄':'莊','韩':'韓','龙':'龍','凤':'鳳','风':'風','云':'雲','飞':'飛',
      '电':'電','网':'網','车':'車','马':'馬','门':'門','开':'開','关':'關','问':'問',
      '间':'間','时':'時','现':'現','当':'當','历':'歷','长':'長','张':'張','陈':'陳',
      '黄':'黃','刘':'劉','赵':'趙','吴':'吳','郑':'鄭','罗':'羅','冯':'馮','叶':'葉',
      '许':'許','谢':'謝','钟':'鍾','苏':'蘇','卢':'盧','严':'嚴','杨':'楊','邓':'鄧',
      '萧':'蕭','蒋':'蔣','吕':'呂','孙':'孫','龚':'龔','纪':'紀','简':'簡','赖':'賴',
      '温':'溫','万':'萬','钱':'錢','汤':'湯','齐':'齊','范':'範','谭':'譚','陆':'陸',
      '顾':'顧','乔':'喬','庞':'龐','兰':'蘭','颜':'顏','鲁':'魯','韦':'韋','毕':'畢',
      '聂':'聶','边':'邊','宝':'寶','铁':'鐵','银':'銀','铜':'銅','镜':'鏡','响':'響',
      '韵':'韻','声':'聲','话':'話','读':'讀','写':'寫','画':'畫','艺':'藝','术':'術',
      '医':'醫','药':'藥','农':'農','军':'軍','战':'戰','际':'際','体':'體','统':'統',
      '构':'構','结':'結','组':'組','织':'織','机':'機','变':'變','迁':'遷','发':'發',
      '进':'進','兴':'興','荣':'榮','岛':'島','湾':'灣','县':'縣','镇':'鎮','乡':'鄉',
      '宫':'宮','后':'後','员':'員','证':'證','释':'釋','辑':'輯','汇':'彙','总':'總',
      '阴':'陰','阳':'陽','晋':'晉','旧':'舊','远':'遠','内':'內','广':'廣','细':'細',
      '观':'觀','视':'視','与':'與','实':'實','虚':'虛','无':'無','将':'將','会':'會',
      '应':'應','该':'該','须':'須','游':'遊','戏':'戲','赋':'賦','骚':'騷','乐':'樂',
      '颂':'頌','绝':'絕','联':'聯','对':'對','谜':'謎','谚':'諺','谣':'謠','杂':'雜',
      '剧':'劇','册':'冊','讨':'討','伦':'倫','禅':'禪','净':'淨','识':'識','养':'養',
      '数':'數','针':'針','脉':'脈','剂':'劑','济':'濟','类':'類','瑶':'瑤','礼':'禮',
      '历':'歷','宝':'寶','台湾':'臺灣','中国':'中國'
    };
    return String(str).toLowerCase().replace(/[\u4e00-\u9fa5]/g, ch => map[ch] || ch);
  }, []);

  const indexSearchBooks = useMemo(() => {
    const qCode = (appliedSearch.code || '').trim();
    const qTitle = normalizeSearchText(appliedSearch.title);
    const qAuthor = normalizeSearchText(appliedSearch.author);
    const qYear = (appliedSearch.year || '').trim();
    return books.filter(b => {
      const matchCode = !qCode || (b.id && b.id.toString().includes(qCode)) || (b.isbn && b.isbn.replace(/-/g, '').includes(qCode.replace(/-/g, '')));
      const matchTitle = !qTitle || (b.title && normalizeSearchText(b.title).includes(qTitle));
      const matchAuthor = !qAuthor || (b.author && normalizeSearchText(b.author).includes(qAuthor));
      const matchPage = !qYear || (b.year && b.year.toString().includes(qYear));
      const matchCat = !appliedSearch.category || appliedSearch.category === '全部' || b.category === appliedSearch.category;
      return matchCode && matchTitle && matchAuthor && matchPage && matchCat;
    });
  }, [books, appliedSearch, normalizeSearchText]);
  const visibleSearchBooks = useMemo(() => {
    return indexSearchBooks.slice(0, searchVisibleCount);
  }, [indexSearchBooks, searchVisibleCount]);
  const triggerCartFlyAnimation = e => {
    try {
      const cartBtn = document.querySelector('#main-cart-btn') || document.querySelector('.badge-seal-red') || document.querySelector('#nav-cart-btn');
      if (!cartBtn) return;
      let startX = window.innerWidth / 2;
      let startY = window.innerHeight / 2;
      if (e && e.clientX && e.clientY && e.clientX > 0) {
        startX = e.clientX;
        startY = e.clientY;
      } else if (e && e.currentTarget) {
        const rect = e.currentTarget.getBoundingClientRect();
        startX = rect.left + rect.width / 2;
        startY = rect.top + rect.height / 2;
      }
      const cartRect = cartBtn.getBoundingClientRect();
      const endX = cartRect.left + cartRect.width / 2;
      const endY = cartRect.top + cartRect.height / 2;

      const bead = document.createElement('div');
      bead.style.position = 'fixed';
      bead.style.left = `${startX}px`;
      bead.style.top = `${startY}px`;
      bead.style.width = '14px';
      bead.style.height = '14px';
      bead.style.borderRadius = '50%';
      bead.style.backgroundColor = '#B83B26';
      bead.style.boxShadow = '0 0 14px rgba(184, 59, 38, 0.9), inset 0 0 4px #FFF';
      bead.style.pointerEvents = 'none';
      bead.style.zIndex = '9999';
      bead.style.transform = 'translate(-50%, -50%)';
      document.body.appendChild(bead);

      const startTime = performance.now();
      const duration = 520;
      const animateFly = now => {
        const elapsed = now - startTime;
        const p = Math.min(elapsed / duration, 1);
        const easeP = p * (2 - p);
        const currentX = startX + (endX - startX) * easeP;
        const arc = -Math.sin(p * Math.PI) * 70;
        const currentY = startY + (endY - startY) * easeP + arc;
        const scale = 1 + Math.sin(p * Math.PI) * 0.45 - p * 0.35;
        bead.style.left = `${currentX}px`;
        bead.style.top = `${currentY}px`;
        bead.style.transform = `translate(-50%, -50%) scale(${scale})`;
        if (p < 1) {
          requestAnimationFrame(animateFly);
        } else {
          bead.remove();
          cartBtn.classList.remove('cart-bounce');
          void cartBtn.offsetWidth;
          cartBtn.classList.add('cart-bounce');
          setTimeout(() => cartBtn.classList.remove('cart-bounce'), 600);
        }
      };
      requestAnimationFrame(animateFly);
    } catch (err) {
      console.warn('Fly anim err:', err);
    }
  };

  const addToCart = (book, e = null) => {
    if (book.stock <= 0) return showMsg("抱歉，目前缺貨中！");
    if (e) triggerCartFlyAnimation(e);
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
    showMsg(`已加入書包: 《${book.title}》`);
    try {
      window.dispatchEvent(new CustomEvent('mobaoAddToCart', { detail: { title: book.title } }));
    } catch (_) {}
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
  const rootStyle = isEyeCare ? {
    '--primary-color': '#D6974B',
    '--dark-color': '#F5EBE1',
    '--bg-color': '#14110E',
    '--bg-light': '#1E1915',
    '--text-dark': '#E2D5C3',
    '--border-color': '#3E3228',
    '--accent-color': '#8C7862',
    '--footer-bg': '#0D0A08'
  } : {
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
  }, showChinaBanner && /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-r from-amber-900 via-amber-800 to-stone-900 text-white px-4 py-2 text-xs md:text-sm font-sans flex items-center justify-between shadow-md relative z-50 transition-all border-b border-amber-600/50"
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0"
  }, "⚡ 大陸訪問加速"), /*#__PURE__*/React.createElement("span", {
    className: "font-medium text-amber-100 text-xs sm:text-sm"
  }, "檢測到您位於大陸地區或簡體中文環境，建議切換至「大陸直連優選線路 (Cloudflare Pages)」以獲得極速與抗阻斷體驗！")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 shrink-0"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => switchMirror('https://theliberalartspress.pages.dev/'),
    className: "bg-amber-400 hover:bg-amber-300 text-stone-950 font-black px-3.5 py-1 rounded-full text-xs transition shadow-sm active:scale-95 flex items-center gap-1 cursor-pointer"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Zap",
    size: 13
  }), "立即切換"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      setShowChinaBanner(false);
      safeSetStorage('hide_china_mirror_banner', 'true');
    },
    className: "hover:bg-white/20 p-1 rounded-full transition text-white/80 hover:text-white cursor-pointer",
    title: "不再提示"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "X",
    size: 14
  }))))), /*#__PURE__*/React.createElement("nav", {
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
    loading: "lazy",
    decoding: "async",
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
    className: "hidden lg:flex items-center space-x-2 xl:space-x-3 whitespace-nowrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nav-segmented-group"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setIsAboutOpen(true),
    className: "nav-segmented-item"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Compass",
    size: 15,
    className: "text-[var(--primary-color)]"
  }), " ", ui.menuAbout), /*#__PURE__*/React.createElement("div", {
    className: "nav-segmented-divider"
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setIsPresidentOpen(true),
    className: "nav-segmented-item"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "User",
    size: 15,
    className: "text-[var(--primary-color)]"
  }), " ", ui.menuPresident), /*#__PURE__*/React.createElement("div", {
    className: "nav-segmented-divider"
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setIsContactPageOpen(true),
    className: "nav-segmented-item"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "MessageCircle",
    size: 15,
    className: "text-[var(--primary-color)]"
  }), " ", ui.menuContact), /*#__PURE__*/React.createElement("div", {
    className: "nav-segmented-divider"
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: openRandomBooksModal,
    className: "nav-segmented-item"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Zap",
    size: 15,
    className: "text-amber-600"
  }), " ", ui.menuNewArrivals), /*#__PURE__*/React.createElement("div", {
    className: "nav-segmented-divider"
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setIsSearchModalOpen(true),
    className: "nav-segmented-item"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Search",
    size: 15,
    className: "text-[var(--primary-color)]"
  }), " ", ui.menuSearch)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: openMirrorModal,
    className: "text-[var(--dark-color)] bg-stone-100 hover:bg-stone-200 border border-stone-300 transition-all flex items-center gap-1.5 px-3 py-2 rounded-full shadow-sm hover:shadow active:scale-95 font-sans font-bold text-xs xl:text-sm cursor-pointer",
    title: "切換全球鏡像站點 / 大陸直連加速"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse"
  }), /*#__PURE__*/React.createElement(Icon, {
    name: "Globe",
    size: 15,
    className: "text-[var(--primary-color)]"
  }), " 全球線路"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setIsOrderQueryOpen(true),
    className: "text-white bg-[var(--primary-color)] hover:bg-[var(--dark-color)] transition-all flex items-center gap-1.5 px-4 py-2 rounded-full shadow-sm hover:shadow active:scale-95 font-sans font-bold text-xs xl:text-sm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "FileText",
    size: 15
  }), " 訂單查詢")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2 xl:space-x-3 border-l pl-2 xl:pl-4 border-[var(--border-color)] shrink-0 overflow-visible"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    id: "main-cart-btn",
    onClick: () => setIsCartOpen(true),
    className: "relative bg-white/95 border border-[#DFD5C6] text-[var(--dark-color)] px-4 xl:px-5 py-2 rounded-full flex items-center gap-2 hover:bg-[var(--primary-color)] hover:text-white hover:border-[var(--primary-color)] transition-all shadow-sm font-sans font-bold group cursor-pointer overflow-visible"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "ShoppingCart",
    size: 17,
    className: "text-[var(--primary-color)] group-hover:scale-110 group-hover:text-white transition-transform"
  }), /*#__PURE__*/React.createElement("span", {
    className: "hidden sm:inline font-bold"
  }, ui.menuCart), cart.length > 0 && /*#__PURE__*/React.createElement("span", {
    className: "cart-floating-badge"
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
      setIsPresidentOpen(true);
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
      setIsContactPageOpen(true);
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
      openMirrorModal();
    },
    className: "text-left font-bold text-amber-950 bg-amber-50 hover:bg-amber-100 p-3 rounded-xl flex items-center justify-between transition border border-amber-200 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Globe",
    size: 18,
    className: "text-amber-800"
  }), " 全球鏡像・線路切換"), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] bg-emerald-700 text-white font-bold px-2 py-0.5 rounded-full"
  }, "大陸直連/測速")), /*#__PURE__*/React.createElement("button", {
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
    className: "text-center mb-8 py-6 md:py-10 animate-in relative hero-container select-none overflow-hidden rounded-3xl",
    onMouseMove: handleHeroMouseMove,
    onMouseLeave: handleHeroMouseLeave
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-spotlight",
    style: {
      '--mouse-x': `${heroMouse.x}px`,
      '--mouse-y': `${heroMouse.y}px`,
      opacity: heroMouse.active ? 1 : 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "max-w-4xl mx-auto px-4 relative z-10 hero-magnetic-wrap",
    style: {
      transform: heroMouse.active
        ? `perspective(1000px) rotateX(${-heroMouse.ny * 7}deg) rotateY(${heroMouse.nx * 9}deg) translateY(-2px)`
        : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "inline-block text-[11px] font-sans font-bold tracking-[0.3em] uppercase text-[var(--primary-color)] bg-[var(--primary-color)]/10 px-3.5 py-1 rounded-full mb-3 shadow-sm border border-[var(--primary-color)]/20 transition-transform duration-300",
    style: {
      transform: heroMouse.active ? `translateX(${heroMouse.nx * 6}px) translateY(${heroMouse.ny * 4}px)` : 'none'
    }
  }, "EST. 1971 \u30FB \u5C08\u696D\u4EBA\u6587\u5B78\u8853\u8AD6\u8457\u51FA\u7248"), /*#__PURE__*/React.createElement("h2", {
    className: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 text-[var(--dark-color)] leading-tight font-serif tracking-widest hero-title-shimmer drop-shadow-sm transition-transform duration-200",
    style: {
      backgroundPosition: heroMouse.active ? `${(heroMouse.nx + 1) * 50}% ${(heroMouse.ny + 1) * 50}%` : '50% 50%',
      transform: heroMouse.active ? `translateX(${heroMouse.nx * 10}px) translateY(${heroMouse.ny * 6}px)` : 'none'
    }
  }, ui.heroHeading1, " ", /*#__PURE__*/React.createElement("span", {
    className: "text-[var(--primary-color)]"
  }, ui.heroHeading2)), /*#__PURE__*/React.createElement("p", {
    className: "text-stone-700 max-w-3xl mx-auto leading-relaxed text-sm sm:text-base md:text-lg font-sans font-medium transition-transform duration-300",
    style: {
      transform: heroMouse.active ? `translateX(${heroMouse.nx * -5}px) translateY(${heroMouse.ny * -3}px)` : 'none'
    }
  }, "致力於出版高品質文學、歷史、哲學著作，讓深厚底蘊更貼近當代讀者；跨越時空的底蘊，化為當代心靈的迴響。"))), carousels.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "w-full max-w-6xl mx-auto mb-14"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative w-full h-[320px] md:h-[460px] rounded-3xl overflow-hidden shadow-2xl group border border-stone-300/80 bg-gradient-to-br from-[#2D231D] via-[#3B2F27] to-[#1E1714] flex items-center justify-center",
    onTouchStart: e => {
      if (e.touches && e.touches[0]) {
        carouselTouchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    },
    onTouchEnd: e => {
      if (!carouselTouchStartRef.current || !e.changedTouches || !e.changedTouches[0] || carousels.length <= 1) return;
      const dx = e.changedTouches[0].clientX - carouselTouchStartRef.current.x;
      const dy = e.changedTouches[0].clientY - carouselTouchStartRef.current.y;
      carouselTouchStartRef.current = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        setCarouselIndex(prev => dx < 0 ? (prev + 1) % carousels.length : (prev - 1 + carousels.length) % carousels.length);
      }
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 bg-gradient-to-r from-stone-800/40 via-stone-700/20 to-stone-800/40 animate-pulse pointer-events-none z-0 flex flex-col items-center justify-center text-amber-100/40 gap-2.5 select-none"
  }, /*#__PURE__*/React.createElement(ModernLogo, {
    className: "w-12 h-12 opacity-25 animate-pulse",
    color1: "#FAF8F5",
    color2: "var(--primary-color)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-xs tracking-widest font-serif opacity-40 text-stone-300"
  }, "文史哲出版社 ‧ 傳承文化 創新閱讀")), carousels.map((c, idx) => {
    const isFbSlide = c.title?.toLowerCase().includes('fb') || c.title?.toLowerCase().includes('facebook') || c.title?.includes('臉書') || c.title?.includes('粉絲') || c.description?.toLowerCase().includes('fb') || c.description?.toLowerCase().includes('facebook') || c.description?.includes('臉書') || c.description?.includes('粉絲') || c.image?.includes('61590146114229') || c.id === 'fb1' || idx === 0;
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
    const bannerImgSrc = getCarouselImgSrc(c);
    return /*#__PURE__*/React.createElement(SlideContainer, _extends({
      key: c.id || idx
    }, slideProps), /*#__PURE__*/React.createElement("img", {
      src: bannerImgSrc,
      alt: "",
      "aria-hidden": "true",
      loading: idx === 0 ? "eager" : "lazy",
      fetchPriority: idx === 0 ? "high" : "auto",
      decoding: "async",
      className: "absolute inset-0 w-full h-full object-cover blur-2xl scale-125 opacity-40 brightness-75 pointer-events-none"
    }), /*#__PURE__*/React.createElement("img", {
      src: bannerImgSrc,
      alt: c.title || "Banner",
      loading: idx === 0 ? "eager" : "lazy",
      fetchPriority: idx === 0 ? "high" : "auto",
      decoding: "async",
      className: "relative z-10 w-full h-full object-contain mx-auto transition-transform duration-700 group-hover/slide:scale-[1.01]",
      onError: e => handleImgError(e, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1200')
    }));
  }), carousels.length > 1 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "上一張輪播",
    onClick: () => setCarouselIndex(prev => (prev - 1 + carousels.length) % carousels.length),
    className: "absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-[var(--dark-color)] text-white p-2.5 rounded-full backdrop-blur-md transition-all opacity-70 md:opacity-0 md:group-hover:opacity-100 border border-white/20"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "ChevronLeft",
    size: 20
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "下一張輪播",
    onClick: () => setCarouselIndex(prev => (prev + 1) % carousels.length),
    className: "absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-[var(--dark-color)] text-white p-2.5 rounded-full backdrop-blur-md transition-all opacity-70 md:opacity-0 md:group-hover:opacity-100 border border-white/20"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "ChevronRight",
    size: 20
  })))), carousels[carouselIndex] && (carousels[carouselIndex].title || carousels[carouselIndex].description || carousels[carouselIndex].link || carousels[carouselIndex].url || carousels[carouselIndex].id === 'fb1' || carouselIndex === 0) && /*#__PURE__*/React.createElement("div", {
    className: "mt-3.5 glass-card rounded-2xl px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md border border-[var(--border-color)]/70 bg-white/90"
  }, /*#__PURE__*/React.createElement("div", {
    className: "min-w-0 flex-1 text-left"
  }, carousels[carouselIndex].title && /*#__PURE__*/React.createElement("h3", {
    className: "text-base md:text-lg font-black font-serif tracking-wider text-[var(--dark-color)] mb-0.5 line-clamp-1"
  }, carousels[carouselIndex].title), carousels[carouselIndex].description && /*#__PURE__*/React.createElement("p", {
    className: "text-xs md:text-sm text-[var(--text-dark)] line-clamp-1 font-sans font-medium"
  }, carousels[carouselIndex].description)), /*#__PURE__*/React.createElement("div", {
    className: "shrink-0 flex items-center gap-3"
  }, (() => {
    const cur = carousels[carouselIndex];
    if (!cur) return null;
    const isFb = cur.title?.toLowerCase().includes('fb') || cur.title?.toLowerCase().includes('facebook') || cur.title?.includes('臉書') || cur.title?.includes('粉絲') || cur.description?.toLowerCase().includes('fb') || cur.description?.toLowerCase().includes('facebook') || cur.description?.includes('臉書') || cur.description?.includes('粉絲') || cur.id === 'fb1' || cur.image?.includes('61590146114229') || carouselIndex === 0;
    const targetUrl = cur.link || cur.url || (isFb ? "https://www.facebook.com/people/%E6%96%87%E5%8F%B2%E5%93%B2%E5%87%BA%E7%89%88%E7%A4%BE/61590146114229/?locale=zh_TW" : null);
    if (!targetUrl) return null;
    const isFbLink = targetUrl.includes('facebook.com') || isFb;
    return /*#__PURE__*/React.createElement("a", {
      href: targetUrl,
      target: "_blank",
      rel: "noopener noreferrer",
      className: "inline-flex items-center gap-1.5 bg-[#1877F2] hover:bg-[#166fe5] text-white font-sans font-bold text-xs px-4 py-2 rounded-full shadow transition-all hover:scale-105"
    }, /*#__PURE__*/React.createElement("span", null, isFbLink ? "點擊前往官方臉書粉絲專頁 ↗" : "點擊前往查看 ↗"));
  })(), carousels.length > 1 && /*#__PURE__*/React.createElement("div", {
    className: "flex gap-1.5 ml-1"
  }, carousels.map((_, dotIdx) => /*#__PURE__*/React.createElement("button", {
    key: dotIdx,
    type: "button",
    "aria-label": `切換至第 ${dotIdx + 1} 張輪播`,
    onClick: () => setCarouselIndex(dotIdx),
    className: `w-2.5 h-2.5 rounded-full transition-all ${dotIdx === carouselIndex ? 'bg-[var(--primary-color)] w-6' : 'bg-stone-300 hover:bg-stone-400'}`
  })))))), /*#__PURE__*/React.createElement("section", {
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
    className: "min-w-[240px] w-[240px] snap-start shrink-0 glass-card book-tilt-card rounded-2xl overflow-hidden flex flex-col cursor-pointer group/card",
    onClick: () => setSelectedBookDetail(book)
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-52 relative overflow-hidden p-3.5 flex justify-center items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full relative group-hover/card:scale-105 transition-transform duration-500 rounded overflow-hidden shadow-md"
  }, /*#__PURE__*/React.createElement("img", {
    src: formatImageUrl(book.localCover || book.cover, 400),
    loading: "lazy",
    decoding: "async",
    className: "h-full w-auto object-contain rounded",
    alt: book.title,
    onError: e => handleImgError(e, SVG_COVER_FALLBACK)
  })), /*#__PURE__*/React.createElement("div", {
    className: `absolute top-2.5 left-2.5 ${getCategoryBadgeClass(book.category)} text-xs px-2.5 py-1 rounded-md font-sans font-bold shadow z-10`
  }, book.category), renderWishlistHeartBtn(book, 10, 10), book.stock <= 0 && /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 bg-[var(--dark-color)]/80 backdrop-blur-[2px] flex items-center justify-center text-white font-black tracking-[0.2em] text-sm"
  }, ui.msgOutOfStock)), /*#__PURE__*/React.createElement("div", {
    className: "p-4 flex flex-col flex-1"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-base mb-1 text-[var(--dark-color)] line-clamp-1 group-hover/card:text-[var(--primary-color)] transition-colors font-serif",
    title: book.title
  }, book.title), /*#__PURE__*/React.createElement("p", {
    className: "text-[#B83B26] font-black text-base font-sans mt-auto mb-2.5"
  }, "NT$ ", book.price), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: e => {
      e.stopPropagation();
      addToCart(book, e);
    },
    className: "w-full bg-[var(--bg-light)] shimmer-btn border border-[var(--border-color)] text-[var(--text-dark)] py-1.5 rounded-xl font-bold hover:bg-[var(--primary-color)] hover:border-[var(--primary-color)] hover:text-white transition-all text-xs flex justify-center items-center gap-1.5 shadow-sm active:scale-95"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "ShoppingCart",
    size: 13
  }), " \u52A0\u5165\u66F8\u5305"))))))), dynamicCategories.length > 1 && /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2.5 mb-8 justify-center font-sans border-t border-[var(--border-color)]/60 pt-6"
  }, visibleCategories.map(cat => /*#__PURE__*/React.createElement("button", {
    type: "button",
    key: cat,
    onClick: () => {
      setSelectedAuthor(null);
      setSelectedCategory(cat);
      setVisibleCount(8);
      try {
        const u = new URL(window.location.href);
        u.searchParams.delete('author');
        if (cat === '全部') {
          u.searchParams.delete('category');
        } else {
          u.searchParams.set('category', cat);
        }
        window.history.replaceState(null, '', u.pathname + (u.searchParams.toString() ? '?' + u.searchParams.toString() : ''));
      } catch (e) {}
    },
    className: `px-5 py-2 rounded-full text-sm font-bold transition-all border ${!selectedAuthor && selectedCategory === cat ? `${getCategoryBadgeClass(cat)} shadow-md scale-105` : 'bg-[var(--bg-light)] border-[var(--border-color)] text-[var(--text-dark)] hover:border-[var(--primary-color)] hover:text-[var(--primary-color)] hover:bg-[var(--bg-color)]'}`
  }, cat)), dynamicCategories.length > 5 && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setIsAllCategoriesExpanded(!isAllCategoriesExpanded),
    className: "px-5 py-2 rounded-full text-sm font-bold transition-all border border-[var(--primary-color)] text-[var(--primary-color)] bg-[var(--bg-light)] hover:bg-[var(--primary-color)] hover:text-white flex items-center gap-1 active:scale-95 cursor-pointer"
  }, isAllCategoriesExpanded ? "收合類別" : "更多類別", /*#__PURE__*/React.createElement(Icon, {
    name: isAllCategoriesExpanded ? "ChevronUp" : "ChevronDown",
    size: 14
  }))), selectedAuthor && /*#__PURE__*/React.createElement("div", {
    className: "mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-sky-50 via-blue-50/40 to-sky-50 border border-sky-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-stone-700 animate-in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 rounded-xl bg-sky-600/10 text-sky-700 flex items-center justify-center font-serif text-xl shrink-0"
  }, "👤"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 flex-wrap"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-base sm:text-lg font-serif font-black text-stone-900"
  }, `《${selectedAuthor}》學者出版專題`), /*#__PURE__*/React.createElement("span", {
    className: "text-xs px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-900 font-bold"
  }, `全館典藏 ${filteredBooks.length} 冊`)), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-stone-500 font-sans mt-0.5"
  }, `文史哲出版社半世紀嚴選・典藏學者《${selectedAuthor}》之學術專著、考據研究與代表文集`))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 shrink-0 self-end sm:self-center"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      setSelectedAuthor(null);
      try {
        const u = new URL(window.location.href);
        u.searchParams.delete('author');
        window.history.replaceState(null, '', u.pathname + (u.searchParams.toString() ? '?' + u.searchParams.toString() : ''));
      } catch (e) {}
    },
    className: "px-3 py-1.5 rounded-xl text-xs font-bold text-stone-600 bg-white hover:bg-stone-100 border border-stone-200 transition shadow-sm flex items-center gap-1 active:scale-95"
  }, "✕ 返回全部書籍"))), !selectedAuthor && selectedCategory !== '全部' && /*#__PURE__*/React.createElement("div", {
    className: "mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-stone-50 via-amber-50/40 to-stone-50 border border-stone-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-stone-700 animate-in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 rounded-xl bg-[var(--primary-color)]/10 text-[var(--primary-color)] flex items-center justify-center font-serif text-xl shrink-0"
  }, "📖"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 flex-wrap"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-base sm:text-lg font-serif font-black text-stone-900"
  }, `《${selectedCategory}》學術典籍專題`), /*#__PURE__*/React.createElement("span", {
    className: "text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold"
  }, `典藏 ${filteredBooks.length} 冊`)), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-stone-500 font-sans mt-0.5"
  }, `文史哲出版社半世紀嚴選《${selectedCategory}》領域學術論著、校釋考據與專題典籍`))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 shrink-0 self-end sm:self-center"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      setSelectedCategory('全部');
      try {
        const u = new URL(window.location.href);
        u.searchParams.delete('category');
        window.history.replaceState(null, '', u.pathname + (u.searchParams.toString() ? '?' + u.searchParams.toString() : ''));
      } catch (e) {}
    },
    className: "px-3 py-1.5 rounded-xl text-xs font-bold text-stone-600 bg-white hover:bg-stone-100 border border-stone-200 transition shadow-sm flex items-center gap-1 active:scale-95"
  }, "✕ 返回全部書籍"))), /*#__PURE__*/React.createElement("div", {
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
  }))) : visibleBooks.map((book, bookIdx) => /*#__PURE__*/React.createElement("div", {
    key: book.id,
    style: { animationDelay: `${(bookIdx % 8) * 45}ms` },
    className: `group glass-card book-tilt-card rounded-2xl overflow-hidden flex flex-col cursor-pointer ${getInkAnimationClass(book.category)}`,
    onClick: () => setSelectedBookDetail(book)
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-64 relative overflow-hidden p-4 flex justify-center items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full relative group-hover:scale-105 transition-transform duration-500 rounded overflow-hidden shadow-md"
  }, /*#__PURE__*/React.createElement("img", {
    src: formatImageUrl(book.localCover || book.cover, 400),
    loading: "lazy",
    decoding: "async",
    className: "h-full w-auto object-contain rounded",
    alt: book.title,
    onError: e => handleImgError(e, SVG_COVER_FALLBACK)
  })), /*#__PURE__*/React.createElement("div", {
    className: `absolute top-3 left-3 ${getCategoryBadgeClass(book.category)} text-xs px-2.5 py-1 rounded-md font-sans font-bold shadow z-10`
  }, book.category), renderWishlistHeartBtn(book, 12, 12), book.stock <= 0 && /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 bg-[var(--dark-color)]/75 backdrop-blur-[2px] flex items-center justify-center text-white font-black tracking-[0.3em] text-xl"
  }, ui.msgOutOfStock)), /*#__PURE__*/React.createElement("div", {
    className: "p-5 flex flex-col flex-1"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-lg mb-1.5 text-[var(--dark-color)] line-clamp-2 font-serif leading-snug group-hover:text-[var(--primary-color)] transition-colors",
    title: book.title
  }, book.title), book.author && book.author !== '未標記' && /*#__PURE__*/React.createElement("p", {
    onClick: e => {
      e.stopPropagation();
      const ca = cleanAuthorName(book.author);
      if (ca) {
        setSelectedAuthor(ca);
        setSelectedCategory('全部');
        try {
          const u = new URL(window.location.href);
          u.searchParams.delete('category');
          u.searchParams.set('author', ca);
          window.history.replaceState(null, '', u.pathname + '?' + u.searchParams.toString());
        } catch (err) {}
        const el = document.getElementById('search-section') || document.querySelector('.search-table-container');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    title: `點擊查看《${cleanAuthorName(book.author)}》全館專著`,
    className: "text-xs text-stone-500 font-sans mb-3 flex items-center gap-1 hover:text-[var(--primary-color)] transition-colors w-max cursor-pointer font-medium"
  }, "✍️ ", book.author), /*#__PURE__*/React.createElement("p", {
    className: "text-[#B83B26] font-black mb-4 text-xl font-sans mt-auto"
  }, "NT$ ", book.price), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: e => {
      e.stopPropagation();
      addToCart(book, e);
    },
    className: "w-full bg-[var(--bg-light)] shimmer-btn border border-[var(--border-color)] text-[var(--text-dark)] py-2.5 rounded-xl font-bold hover:bg-[var(--primary-color)] hover:border-[var(--primary-color)] hover:text-white transition-all flex items-center justify-center gap-2 font-sans shadow-sm active:scale-95 text-sm"
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
    className: "bg-[var(--bg-light)] border border-[var(--border-color)] text-[var(--text-dark)] hover:border-[var(--primary-color)] hover:text-[var(--primary-color)] px-7 py-2.5 rounded-full font-bold hover:bg-[var(--bg-color)] transition-all shadow-sm flex items-center gap-2 text-sm active:scale-95 cursor-pointer"
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
    loading: "lazy",
    decoding: "async",
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
    className: "text-[9px] font-bold tracking-[0.2em] text-[#E8DCCE] uppercase"
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
  }, /*#__PURE__*/React.createElement("li", {
    key: "mirror-line-item"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: openMirrorModal,
    className: "w-full text-left hover:text-white hover:translate-x-1 transition-all flex items-center justify-between bg-amber-950/70 hover:bg-amber-900/90 border border-amber-500/70 hover:border-amber-400 p-2.5 rounded-xl shadow-sm text-amber-200 group cursor-pointer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-2 h-2 rounded-full bg-emerald-400 shrink-0 group-hover:scale-125 transition-transform animate-pulse"
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-serif tracking-wide text-xs sm:text-sm font-bold text-amber-100"
  }, "🌐 全球鏡像線路 (大陸直連)")), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] bg-amber-600/90 text-white px-2 py-0.5 rounded font-sans font-bold"
  }, "測速切換"))), [
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
    className: "mt-10 pt-6 border-t border-white/10"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Globe",
    size: 16,
    className: "text-amber-500"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-sm font-bold text-stone-200 font-serif"
  }, "文史哲官方多節點全球鏡像（互相引流 ‧ 大陸與海外加速）"), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] text-stone-400 hidden md:inline"
  }, "如遇特定地區網路卡頓或防火牆阻斷，可直接點擊切換")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: openMirrorModal,
    className: "text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-bold underline underline-offset-4 self-start sm:self-auto cursor-pointer"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Zap",
    size: 13
  }), " 展開全線路即時測速")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 text-xs"
  }, MIRROR_LINES.map(m => {
    const isCurrent = typeof window !== 'undefined' && window.location.hostname.includes(m.host);
    return /*#__PURE__*/React.createElement("a", {
      key: m.id,
      href: m.url,
      className: `p-2.5 rounded-xl border transition-all flex flex-col justify-between ${isCurrent ? 'bg-amber-900/50 border-amber-500 text-white shadow-md' : 'bg-black/30 hover:bg-black/60 border-white/10 text-stone-300 hover:text-white'}`
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between mb-1"
    }, /*#__PURE__*/React.createElement("span", {
      className: "font-bold text-xs"
    }, m.name), isCurrent ? /*#__PURE__*/React.createElement("span", {
      className: "text-[9px] bg-emerald-500 text-black font-black px-1.5 py-0.2 rounded"
    }, "當前") : /*#__PURE__*/React.createElement("span", {
      className: `text-[9px] px-1.5 py-0.2 rounded font-medium ${m.id === 'cloudflare' ? 'bg-emerald-800 text-emerald-100' : 'bg-white/10 text-stone-300'}`
    }, m.badge)), /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] text-stone-400 truncate"
    }, m.desc.split('・')[0]));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-stone-400 font-bold"
  }, /*#__PURE__*/React.createElement("p", null, "\xA9 ", new Date().getFullYear(), " ", ui.frontendName || settings.systemName, " ", ui.systemSubName || settings.systemSubName, "."), /*#__PURE__*/React.createElement("p", {
    className: "mt-2 md:mt-0 flex items-center gap-2 select-none"
  }, /*#__PURE__*/React.createElement(ModernLogo, {
    className: "w-3.5 h-3.5 opacity-40",
    color1: "#FFF",
    color2: "#FFF"
  }), /*#__PURE__*/React.createElement("span", null, ui.footerCopyright))))), /*#__PURE__*/React.createElement("div", {
    className: "fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3"
  }, isContactOpen && /*#__PURE__*/React.createElement("div", {
    className: "glass-modal shadow-2xl rounded-2xl border border-[var(--border-color)] overflow-hidden animate-in",
    style: { position: 'absolute', right: '60px', bottom: '0px', zIndex: 55, width: 'min(320px, calc(100vw - 96px))', maxWidth: 'calc(100vw - 96px)' }
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
    className: "flex flex-col gap-2.5 items-end",
    style: { position: 'relative' }
  }, isRecentOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: '58px',
      bottom: '54px',
      width: 'min(300px, calc(100vw - 96px))',
      maxWidth: 'calc(100vw - 96px)',
      maxHeight: 'min(460px, calc(100vh - 110px))',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: '24px',
      background: 'linear-gradient(180deg, #FBF8F3 0%, #F3ECE2 100%)',
      border: '1.5px solid #DECDB8',
      boxShadow: '0 22px 55px rgba(20, 14, 10, 0.34)',
      overflow: 'hidden',
      zIndex: 60,
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 16px 10px',
      borderBottom: '1px solid #E8DCCE',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: { fontSize: '17px', fontWeight: 800, color: '#2B1F16', display: 'flex', alignItems: 'center', gap: '6px' }
  }, recentTab === 'wishlist' ? "❤️ 我的收藏書單" : "📖 最近閱讀"), /*#__PURE__*/React.createElement("div", {
    style: { fontSize: '11.5px', color: '#7D6D5E', marginTop: '2px' }
  }, recentTab === 'wishlist' ? "待購典籍隨時一鍵加入書包 ✨" : "繼續探索更多精彩典籍 ✨")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "關閉最近閱讀與收藏",
    onClick: () => setIsRecentOpen(false),
    style: {
      width: '26px',
      height: '26px',
      borderRadius: '9999px',
      border: '1px solid #DFD2C2',
      background: '#FFF',
      color: '#6E5D4F',
      fontSize: '13px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, "✕")), /*#__PURE__*/React.createElement("div", {
    style: { display: 'flex', gap: '6px', background: '#EDE3D6', padding: '3px', borderRadius: '9999px' }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setRecentTab('recent'),
    style: {
      flex: 1,
      padding: '5px 8px',
      borderRadius: '9999px',
      border: 'none',
      fontSize: '11.5px',
      fontWeight: 700,
      cursor: 'pointer',
      background: recentTab === 'recent' ? '#8C5A2B' : 'transparent',
      color: recentTab === 'recent' ? '#FFF' : '#5C4A3B'
    }
  }, `📖 最近閱讀 (${recentBooks.length})`), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setRecentTab('wishlist'),
    style: {
      flex: 1,
      padding: '5px 8px',
      borderRadius: '9999px',
      border: 'none',
      fontSize: '11.5px',
      fontWeight: 700,
      cursor: 'pointer',
      background: recentTab === 'wishlist' ? '#B83B26' : 'transparent',
      color: recentTab === 'wishlist' ? '#FFF' : '#5C4A3B'
    }
  }, `♥ 我的收藏 (${wishlist.length})`))), /*#__PURE__*/React.createElement("div", {
    style: { padding: '10px 12px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }
  }, recentTab === 'recent' ? (recentBooks.length === 0 ? /*#__PURE__*/React.createElement("p", {
    style: { fontSize: '12.5px', color: '#7D6D5E', padding: '24px 8px', textAlign: 'center' }
  }, "尚未瀏覽書籍，點擊任一書目即可自動記錄。") : recentBooks.map((rb, idx) => {
    const coverUrl = rb.cover || `assets/covers/${rb.id}.webp`;
    const saved = isWishlisted(rb.id);
    return /*#__PURE__*/React.createElement("div", {
      key: rb.id,
      onClick: () => {
        const full = books.find(x => String(x.id) === String(rb.id)) || rb;
        setSelectedBookDetail(full);
        setIsRecentOpen(false);
      },
      style: {
        width: '100%',
        textAlign: 'left',
        padding: '10px',
        borderRadius: '16px',
        background: idx === 0 ? '#EEF3FC' : '#FFFFFF',
        border: idx === 0 ? '1.5px solid #C8D7F4' : '1px solid #EAE0D4',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: coverUrl,
      alt: rb.title,
      onError: e => {
        e.target.onerror = null;
        e.target.src = `assets/covers/${rb.id}.jpg`;
      },
      style: {
        width: '44px',
        height: '60px',
        borderRadius: '8px',
        objectFit: 'cover',
        flexShrink: 0,
        border: '1px solid #DFD3C3',
        background: '#F4EFEA'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: { flex: 1, minWidth: 0 }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '13px',
        fontWeight: 700,
        color: '#231B15',
        lineHeight: 1.35,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical'
      }
    }, rb.title), /*#__PURE__*/React.createElement("div", {
      style: { fontSize: '11px', color: '#6E5D4F', marginTop: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }
    }, `${rb.author || '文史哲'} · NT$ ${rb.price || 0}`), /*#__PURE__*/React.createElement("div", {
      style: { fontSize: '10.5px', color: '#8C7B6B', marginTop: '2px' }
    }, `🕒 ${formatRecentTime(rb.viewedAt)}`)), /*#__PURE__*/React.createElement("button", {
      type: "button",
      title: saved ? "移除收藏" : "加入收藏",
      onClick: ev => {
        const full = books.find(x => String(x.id) === String(rb.id)) || rb;
        toggleWishlist(full, ev);
      },
      style: {
        width: '26px',
        height: '26px',
        borderRadius: '9999px',
        border: saved ? '1px solid #E11D48' : '1px solid #D5C8B8',
        background: saved ? '#FFE4E6' : '#FFF',
        color: saved ? '#E11D48' : '#7D6D5E',
        fontSize: '12px',
        flexShrink: 0,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, saved ? "♥" : "♡"));
  })) : (wishlist.length === 0 ? /*#__PURE__*/React.createElement("p", {
    style: { fontSize: '12.5px', color: '#7D6D5E', padding: '24px 8px', textAlign: 'center', lineHeight: 1.6 }
  }, "尚無收藏書目。\n點擊書卡或書籍詳情的「♡ 收藏」即可加入待購書單！") : wishlist.map(wb => {
    const coverUrl = wb.cover || `assets/covers/${wb.id}.webp`;
    return /*#__PURE__*/React.createElement("div", {
      key: wb.id,
      onClick: () => {
        const full = books.find(x => String(x.id) === String(wb.id)) || wb;
        setSelectedBookDetail(full);
        setIsRecentOpen(false);
      },
      style: {
        width: '100%',
        textAlign: 'left',
        padding: '10px',
        borderRadius: '16px',
        background: '#FFFFFF',
        border: '1px solid #EAE0D4',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: coverUrl,
      alt: wb.title,
      onError: e => {
        e.target.onerror = null;
        e.target.src = `assets/covers/${wb.id}.jpg`;
      },
      style: {
        width: '44px',
        height: '60px',
        borderRadius: '8px',
        objectFit: 'cover',
        flexShrink: 0,
        border: '1px solid #DFD3C3',
        background: '#F4EFEA'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: { flex: 1, minWidth: 0 }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '13px',
        fontWeight: 700,
        color: '#231B15',
        lineHeight: 1.35,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical'
      }
    }, wb.title), /*#__PURE__*/React.createElement("div", {
      style: { fontSize: '11px', color: '#6E5D4F', marginTop: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }
    }, `${wb.author || '文史哲'} · NT$ ${wb.price || 0}`)), /*#__PURE__*/React.createElement("div", {
      style: { display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      title: "加入書包",
      onClick: ev => {
        ev.stopPropagation();
        const full = books.find(x => String(x.id) === String(wb.id)) || wb;
        addToCart(full, ev);
      },
      style: {
        padding: '3px 7px',
        borderRadius: '8px',
        border: 'none',
        background: '#8C5A2B',
        color: '#FFF',
        fontSize: '10.5px',
        fontWeight: 700,
        cursor: 'pointer'
      }
    }, "+書包"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      title: "移除收藏",
      onClick: ev => toggleWishlist(wb, ev),
      style: {
        padding: '2px 7px',
        borderRadius: '8px',
        border: '1px solid #DFD2C2',
        background: '#FFF',
        color: '#8B261E',
        fontSize: '10.5px',
        fontWeight: 700,
        cursor: 'pointer'
      }
    }, "移除")));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 16px',
      borderTop: '1px solid #E8DCCE',
      background: '#EFE7DC',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '12px',
      color: '#5C4A3B'
    }
  }, recentTab === 'recent' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: { fontWeight: 600 }
  }, `📊 最近瀏覽 ${recentBooks.length} 本`), recentBooks.length > 0 && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      setRecentBooks([]);
      try { localStorage.removeItem('lapen_recent_books'); } catch(e) {}
    },
    style: { background: 'none', border: 'none', color: '#8B261E', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer' }
  }, "清除紀錄")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: { fontWeight: 600 }
  }, `❤️ 共收藏 ${wishlist.length} 本`), wishlist.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: { display: 'flex', gap: '10px', alignItems: 'center' }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: ev => {
      wishlist.forEach(wb => {
        const full = books.find(x => String(x.id) === String(wb.id)) || wb;
        addToCart(full, ev);
      });
      showMsg(`已將 ${wishlist.length} 本收藏書籍全部加入書包！`);
    },
    style: { background: '#8C5A2B', border: 'none', color: '#FFF', padding: '3px 9px', borderRadius: '9999px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }
  }, "全加書包"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      setWishlist([]);
      try { localStorage.removeItem('lapen_wishlist'); } catch(e) {}
    },
    style: { background: 'none', border: 'none', color: '#8B261E', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer' }
  }, "清空"))))), /*#__PURE__*/React.createElement(MobaoCatMascot, null), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "快捷搜書 (Ctrl+K 或 /)",
    onClick: openQuickSearch,
    title: "🔍 快捷搜書（快捷鍵：Ctrl+K 或 /）",
    style: { width: '40px', height: '40px', borderRadius: '9999px', background: 'rgba(255,255,255,0.95)', color: '#3D3127', border: '1.5px solid #D8C7B4', boxShadow: '0 4px 12px rgba(0,0,0,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Search",
    size: 17
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "最近閱讀",
    onClick: () => { setIsRecentOpen(v => !v); setIsContactOpen(false); },
    title: `📖 最近閱讀 (${recentBooks.length})`,
    style: {
      position: 'relative',
      width: '40px',
      height: '40px',
      borderRadius: '9999px',
      background: isRecentOpen ? '#8C5A2B' : 'rgba(255,255,255,0.95)',
      color: isRecentOpen ? '#FFFFFF' : '#3D3127',
      border: isRecentOpen ? '2px solid #FFF' : '1.5px solid #D8C7B4',
      boxShadow: '0 4px 12px rgba(0,0,0,0.14)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "BookOpen",
    size: 17
  }), recentBooks.length > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: '-3px',
      right: '-3px',
      width: '17px',
      height: '17px',
      borderRadius: '9999px',
      background: '#B83B26',
      color: '#FFFFFF',
      fontSize: '10px',
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1.5px solid #FFFFFF'
    }
  }, recentBooks.length)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": isLargeFont ? "切換標準字體" : "放大網頁字體",
    onClick: toggleLargeFont,
    title: isLargeFont ? "Aa 目前為放大字體（點擊恢復標準）" : "Aa 放大閱讀字體（適合長輩與學者）",
    style: {
      width: '40px',
      height: '40px',
      borderRadius: '9999px',
      background: isLargeFont ? '#D6974B' : 'rgba(255,255,255,0.95)',
      color: isLargeFont ? '#14110E' : '#3D3127',
      border: isLargeFont ? '2px solid #F5C27A' : '1.5px solid #D8C7B4',
      boxShadow: '0 4px 12px rgba(0,0,0,0.14)',
      fontSize: '13px',
      fontWeight: 900,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer'
    }
  }, isLargeFont ? "A+" : "Aa"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": isEyeCare ? "關閉護眼模式" : "開啟護眼模式",
    onClick: toggleEyeCare,
    title: isEyeCare ? "☀️ 目前為夜讀護眼模式（點擊恢復日間素雅）" : "🌙 開啟夜讀護眼模式（低藍光・暖黃燭光）",
    className: `w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all border self-end hover:scale-110 active:scale-95 text-base cursor-pointer ${isEyeCare ? 'bg-[#D6974B] text-[#14110E] border-[#F5C27A] shadow-[0_0_15px_rgba(214,151,75,0.5)] ring-2 ring-[#D6974B]/50' : 'bg-white/90 text-stone-700 hover:bg-stone-100 border-[var(--border-color)]'}`
  }, isEyeCare ? "🏮" : "🌙"), showBackToTop && /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "回到頁面頂端",
    onClick: () => window.scrollTo({
      top: 0,
      behavior: 'smooth'
    }),
    style: {
      width: '40px',
      height: '40px',
      borderRadius: '9999px',
      background: '#D6974B',
      color: '#1C140D',
      border: '2px solid #8C5A2B',
      boxShadow: '0 6px 16px rgba(140, 90, 43, 0.42)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer'
    },
    title: "回到頁面頂端"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "ChevronUp",
    size: 16
  }), /*#__PURE__*/React.createElement("span", {
    style: { fontSize: '9px', fontWeight: 900, lineHeight: 1, marginTop: '-2px' }
  }, "TOP")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": isContactOpen ? "關閉客服留言" : "開啟客服留言",
    onClick: () => { setIsContactOpen(!isContactOpen); setIsRecentOpen(false); },
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
    className: "font-bold text-lg text-[var(--dark-color)] mb-4 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Clock",
    size: 18,
    className: "text-[var(--primary-color)]"
  }), " 半世紀出版大事記"), /*#__PURE__*/React.createElement("div", {
    style: { display: 'flex', flexDirection: 'column', gap: '12px' }
  }, [
    { year: '1971', title: '創立文史哲出版社', desc: '8 月 1 日由彭正雄先生白手起家創立，首推《明版善本影印》，專注大學院校研究論著與文史典籍。' },
    { year: '1979', title: '張仁青《應用文》長銷奠基', desc: '廣受各級院校採為教材，以穩健收益持續資助學術專著、現代詩集與博碩士論文出版。' },
    { year: '1992', title: '改組為文史哲出版社有限公司', desc: '3 月 11 日正式改組，陸續推出《文史哲學集成》、《台灣近百年研究叢刊》等重量級大型叢書。' },
    { year: '2,500+', title: '累積出版逾二千五百種典籍', desc: '扶持海內外學者並承印三、四百種博碩士論文，現仍有約 2,100 種珍貴書目可供讀者選購。' },
    { year: '數位時代', title: '數位官網與行動書庫上線', desc: '建置全館極速檢索、護眼閱讀模式與 PWA 行動書庫，讓深厚學術底蘊跨越時空、貼近當代讀者。' }
  ].map((m, idx, arr) => /*#__PURE__*/React.createElement("div", {
    key: idx,
    style: { display: 'flex', alignItems: 'stretch', gap: '12px' }
  }, /*#__PURE__*/React.createElement("div", {
    style: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '16px', flexShrink: 0, paddingTop: '18px' }
  }, /*#__PURE__*/React.createElement("span", {
    style: { width: '12px', height: '12px', borderRadius: '9999px', background: 'var(--primary-color)', border: '2px solid #FFFFFF', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', flexShrink: 0 }
  }), idx < arr.length - 1 && /*#__PURE__*/React.createElement("span", {
    style: { width: '2px', flex: 1, background: 'var(--primary-color)', opacity: 0.35, marginTop: '4px' }
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 bg-[var(--bg-light)]/90 border border-[var(--border-color)] rounded-2xl p-4 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center gap-2 mb-1"
  }, /*#__PURE__*/React.createElement("span", {
    style: { background: 'var(--primary-color)', color: '#FFFFFF', padding: '2px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: 900, letterSpacing: '0.04em' }
  }, m.year), /*#__PURE__*/React.createElement("strong", {
    className: "text-sm md:text-base text-[var(--dark-color)]"
  }, m.title)), /*#__PURE__*/React.createElement("p", {
    className: "text-xs md:text-sm opacity-85 leading-relaxed"
  }, m.desc)))))), /*#__PURE__*/React.createElement("div", {
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
    className: "relative bg-[var(--bg-light)] hover:bg-[var(--bg-color)] border border-[var(--border-color)] text-[var(--dark-color)] px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold transition shadow-sm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "ShoppingCart",
    size: 15
  }), /*#__PURE__*/React.createElement("span", null, ui.menuCart), cart.length > 0 && /*#__PURE__*/React.createElement("span", {
    className: "badge-seal-red text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
  }, cart.length)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setIsSearchModalOpen(false),
    className: "bg-[var(--bg-light)] border border-[var(--border-color)] hover:bg-[var(--bg-color)] px-3.5 py-1.5 rounded-full text-xs font-bold text-[var(--text-dark)] hover:text-[var(--primary-color)] transition flex items-center gap-1.5 shadow-sm"
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
    id: "lapen-search-title-input",
    type: "text",
    placeholder: "支援繁簡體與異體字搜尋...",
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
    src: formatImageUrl(book.localCover || book.cover, 200),
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
  }, (() => {
    const designatedForHeader = (newArrivalsList && newArrivalsList.length > 0) ? newArrivalsList : (choiceBooks && choiceBooks.length > 0 ? choiceBooks : []);
    const configuredRoundsList = Array.from(new Set(designatedForHeader.map(b => Number(b.round || 1)))).filter(r => r > 0);
    const maxRounds = configuredRoundsList.length > 0 ? Math.max(...configuredRoundsList) : 1;
    if (newArrivalsList && newArrivalsList.length > 0) {
      return recommendationRound < maxRounds ? `第 ${recommendationRound + 1} 輪推薦 (共 ${maxRounds} 輪)` : `全館精選隨機推薦 (第 ${recommendationRound + 1} 輪)`;
    }
    return `全館精選推薦 (第 ${recommendationRound + 1} 輪)`;
  })())), /*#__PURE__*/React.createElement("button", {
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
    className: "h-48 relative overflow-hidden p-3 flex justify-center items-center"
  }, /*#__PURE__*/React.createElement("img", {
    src: formatImageUrl(book.localCover || book.cover, 400),
    loading: "lazy",
    decoding: "async",
    className: "h-full w-auto object-contain rounded",
    alt: book.title,
    onError: e => handleImgError(e, SVG_COVER_FALLBACK)
  }), /*#__PURE__*/React.createElement("div", {
    className: `absolute top-2 left-2 ${getCategoryBadgeClass(book.category)} text-[10px] px-2 py-0.5 rounded font-bold shadow-md z-10`
  }, book.category), renderWishlistHeartBtn(book, 8, 8)), /*#__PURE__*/React.createElement("div", {
    className: "p-3.5 flex flex-col flex-1"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-sm mb-1 line-clamp-2",
    title: book.title
  }, book.title), /*#__PURE__*/React.createElement("p", {
    className: "text-[var(--primary-color)] font-black text-base font-sans mt-auto mb-2"
  }, "NT$ ", book.price), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: e => {
      e.stopPropagation();
      addToCart(book, e);
    },
    className: "w-full bg-[var(--bg-light)] shimmer-btn border border-[var(--border-color)] text-[var(--text-dark)] py-1.5 rounded-lg font-bold hover:bg-[var(--primary-color)] hover:text-white transition text-xs flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
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
  }), " ", ui.newArrivalsBtnRefresh, (() => {
    const designatedForBtn = (newArrivalsList && newArrivalsList.length > 0) ? newArrivalsList : (choiceBooks && choiceBooks.length > 0 ? choiceBooks : []);
    const configuredRoundsList = Array.from(new Set(designatedForBtn.map(b => Number(b.round || 1)))).filter(r => r > 0);
    const maxRounds = configuredRoundsList.length > 0 ? Math.max(...configuredRoundsList) : 1;
    const nextRoundDisplay = (maxRounds > 1) ? (((recommendationRound + 1) % maxRounds) + 1) : (recommendationRound + 2);
    return ` (換看第 ${nextRoundDisplay} 輪)`;
  })()))))), isCartOpen && /*#__PURE__*/React.createElement("div", {
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
    src: formatImageUrl(i.localCover || i.cover, 200),
    alt: i.title,
    loading: "lazy",
    decoding: "async",
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
  })))), isPresidentOpen && /*#__PURE__*/React.createElement(PresidentModal, {
    onClose: () => setIsPresidentOpen(false),
    ui: ui
  }), isContactPageOpen && /*#__PURE__*/React.createElement(ContactModal, {
    onClose: () => setIsContactPageOpen(false),
    ui: ui,
    onCopy: (label, val) => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(val);
        }
      } catch (_) {}
      showMsg(`已複製${label}：${val}`);
    },
    onOpenCS: () => {
      setIsContactPageOpen(false);
      setIsContactOpen(true);
    }
  }), submittedDetail && /*#__PURE__*/React.createElement("div", {
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
    className: `glass-modal modal-book-flip w-full ${isBookDetailFullscreen ? 'h-full max-w-none max-h-none rounded-none border-0' : 'max-w-3xl max-h-[90vh] rounded-3xl border border-white/80'} shadow-2xl flex flex-col overflow-hidden transition-all duration-300`,
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-3.5 md:p-4 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-light)]/95 backdrop-blur-md shrink-0 z-10"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-base md:text-lg font-serif font-black text-[var(--dark-color)] flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "BookOpen",
    size: 20,
    className: "text-[var(--primary-color)]"
  }), " 圖書詳細資訊"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 flex-wrap"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: ev => toggleWishlist(selectedBookDetail, ev),
    className: "px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 shadow-sm active:scale-95 border text-xs",
    style: isWishlisted(selectedBookDetail.id) ? { background: '#E11D48', color: '#FFFFFF', borderColor: '#E11D48' } : { background: '#FFF1F2', color: '#BE123C', borderColor: '#FECDD3' },
    title: isWishlisted(selectedBookDetail.id) ? "已收藏（點擊移除）" : "加入我的收藏／待購書單"
  }, isWishlisted(selectedBookDetail.id) ? "♥ 已收藏" : "♡ 收藏"), /*#__PURE__*/React.createElement("button", {
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
    className: "p-1 rounded-full text-[var(--accent-color)] hover:text-[var(--primary-color)] hover:bg-[var(--bg-light)] transition"
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
    src: formatImageUrl(selectedBookDetail.localCover || selectedBookDetail.cover, 1000),
    alt: selectedBookDetail.title,
    loading: "lazy",
    decoding: "async",
    className: "h-full w-auto object-contain rounded-lg shadow-xl",
    onError: e => handleImgError(e, SVG_COVER_FALLBACK)
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 space-y-3 text-left w-full min-w-0"
  }, /*#__PURE__*/React.createElement("h3", {
    className: `${isBookDetailFullscreen ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'} font-black text-[var(--dark-color)] font-serif leading-snug`
  }, selectedBookDetail.title), /*#__PURE__*/React.createElement("div", {
    className: `grid grid-cols-2 gap-y-2 gap-x-4 ${isBookDetailFullscreen ? 'text-sm md:text-base' : 'text-xs'} text-[var(--text-dark)] border-y border-[var(--border-color)]/70 py-2.5`
  }, /*#__PURE__*/React.createElement("div", null, "作者：", (() => {
    const ca = cleanAuthorName(selectedBookDetail.author);
    const authorBooksCount = (ca && ca !== '未標記' && ca !== '不詳') ? books.filter(b => cleanAuthorName(b.author).toLowerCase().includes(ca.toLowerCase())).length : 0;
    if (!ca || ca === '未標記' || ca === '不詳') {
      return /*#__PURE__*/React.createElement("strong", {
        className: "font-semibold"
      }, selectedBookDetail.author || '未標記');
    }
    return /*#__PURE__*/React.createElement("span", {
      onClick: () => {
        setSelectedAuthor(ca);
        setSelectedCategory('全部');
        setSelectedBookDetail(null);
        setIsBookDetailFullscreen(false);
        try {
          const u = new URL(window.location.href);
          u.searchParams.delete('book');
          u.searchParams.delete('id');
          u.searchParams.delete('category');
          u.searchParams.set('author', ca);
          window.history.replaceState(null, '', u.pathname + '?' + u.searchParams.toString());
        } catch (e) {}
        setTimeout(() => {
          const el = document.getElementById('search-section') || document.querySelector('.search-table-container');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      },
      title: `點擊查看《${ca}》在文史哲出版的所有著作`,
      className: "px-2 py-0.5 rounded text-[11px] font-bold bg-sky-50 text-sky-800 border border-sky-200 shadow-sm inline-flex items-center gap-1 cursor-pointer hover:bg-sky-100 hover:scale-105 transition-all"
    }, "👤 ", selectedBookDetail.author, authorBooksCount > 1 ? ` (全館${authorBooksCount}冊 ↗)` : ' ↗');
  })()), /*#__PURE__*/React.createElement("div", null, "年份：", /*#__PURE__*/React.createElement("strong", {
    className: "font-semibold"
  }, selectedBookDetail.year || '未標記')), /*#__PURE__*/React.createElement("div", null, "分類：", /*#__PURE__*/React.createElement("span", {
    onClick: () => {
      const cat = selectedBookDetail.category;
      if (cat && cat !== '未分類') {
        setSelectedCategory(cat);
        setSelectedBookDetail(null);
        setIsBookDetailFullscreen(false);
        try {
          const u = new URL(window.location.href);
          u.searchParams.delete('book');
          u.searchParams.delete('id');
          u.searchParams.set('category', cat);
          window.history.replaceState(null, '', u.pathname + '?' + u.searchParams.toString());
        } catch (e) {}
        setTimeout(() => {
          const el = document.getElementById('search-section') || document.querySelector('.search-table-container');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      }
    },
    title: `點擊查看《${selectedBookDetail.category}》專題全部書籍`,
    className: `${getCategoryBadgeClass(selectedBookDetail.category)} px-2 py-0.5 rounded text-[11px] font-bold shadow-sm inline-block cursor-pointer hover:opacity-80 hover:scale-105 transition-all`
  }, selectedBookDetail.category || '未分類')), /*#__PURE__*/React.createElement("div", null, "書碼：", /*#__PURE__*/React.createElement("strong", {
    className: "font-mono font-bold"
  }, selectedBookDetail.id || '無')), /*#__PURE__*/React.createElement("div", {
    className: "pt-0.5 flex items-baseline gap-1"
  }, "定價：", /*#__PURE__*/React.createElement("strong", {
    className: `${isBookDetailFullscreen ? 'text-2xl' : 'text-lg'} font-black text-[#B83B26] font-sans`
  }, "NT$ ", selectedBookDetail.price)), /*#__PURE__*/React.createElement("div", {
    className: "pt-0.5 flex items-baseline gap-1"
  }, "ISBN：", /*#__PURE__*/React.createElement("strong", {
    className: "font-mono font-bold select-all break-all"
  }, selectedBookDetail.isbn || '無'))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: `${isBookDetailFullscreen ? 'text-sm md:text-base' : 'text-xs'} font-bold text-[var(--dark-color)] mb-1 flex items-center gap-1`
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "FileText",
    size: 14,
    className: "text-[var(--primary-color)]"
  }), " 書籍簡介："), /*#__PURE__*/React.createElement("div", {
    className: `bg-[var(--bg-color)] border border-[var(--border-color)]/70 p-3.5 rounded-xl ${isBookDetailFullscreen ? 'text-sm md:text-base leading-relaxed max-h-56' : 'text-xs leading-relaxed max-h-36'} overflow-y-auto whitespace-pre-wrap text-[var(--text-dark)] shadow-sm`
  }, getBookIntro(selectedBookDetail))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: `${isBookDetailFullscreen ? 'text-sm md:text-base' : 'text-xs'} font-bold text-[var(--dark-color)] mb-1 flex items-center gap-1`
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Sparkles",
    size: 14,
    className: "text-[var(--primary-color)]"
  }), " 讀後心得與學術評析："), /*#__PURE__*/React.createElement("div", {
    className: `bg-[var(--bg-color)] border border-[var(--border-color)]/70 p-3.5 rounded-xl ${isBookDetailFullscreen ? 'text-sm md:text-base leading-relaxed max-h-56' : 'text-xs leading-relaxed max-h-36'} overflow-y-auto text-[var(--text-dark)] italic shadow-sm`
  }, getBookReview(selectedBookDetail))), /*#__PURE__*/React.createElement("div", {
    className: "pt-1"
  }, /*#__PURE__*/React.createElement("h4", {
    className: `${isBookDetailFullscreen ? 'text-sm md:text-base' : 'text-xs'} font-bold text-[var(--dark-color)] mb-1.5 flex items-center gap-1`
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "BookOpen",
    size: 14,
    className: "text-[var(--primary-color)]"
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
  }, `👤 作者維基 (${String(selectedBookDetail.author).replace(/著|編|校|註|輯/g, '').trim()})`), selectedBookDetail.author && selectedBookDetail.author !== '未標記' && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      const ca = cleanAuthorName(selectedBookDetail.author);
      if (ca) {
        setSelectedAuthor(ca);
        setSelectedCategory('全部');
        setSelectedBookDetail(null);
        setIsBookDetailFullscreen(false);
        try {
          const u = new URL(window.location.href);
          u.searchParams.delete('book');
          u.searchParams.delete('id');
          u.searchParams.delete('category');
          u.searchParams.set('author', ca);
          window.history.replaceState(null, '', u.pathname + '?' + u.searchParams.toString());
        } catch (e) {}
        setTimeout(() => {
          const el = document.getElementById('search-section') || document.querySelector('.search-table-container');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      }
    },
    className: "px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg font-bold transition flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer",
    title: "在文史哲官網查看該學者出版之全部著作"
  }, "📚 本館收錄該學者著作 (", books.filter(b => cleanAuthorName(b.author).toLowerCase().includes(cleanAuthorName(selectedBookDetail.author).toLowerCase())).length, "本)"), /*#__PURE__*/React.createElement("a", {
    href: `https://scholar.google.com.tw/scholar?q=${encodeURIComponent(selectedBookDetail.title + ' ' + (selectedBookDetail.author || ''))}`,
    target: "_blank",
    rel: "noreferrer",
    className: "px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg font-bold transition flex items-center gap-1 shadow-sm active:scale-95",
    title: "在 Google 學術搜尋相關論文與研究引用"
  }, "🎓 Google 學術搜尋"), /*#__PURE__*/React.createElement("a", {
    href: `https://www.google.com.tw/search?q=${encodeURIComponent('國家圖書館 ' + selectedBookDetail.title + ' ' + (selectedBookDetail.author || ''))}`,
    target: "_blank",
    rel: "noreferrer",
    className: "px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg font-bold transition flex items-center gap-1 shadow-sm active:scale-95",
    title: "在國家圖書館與書目系統查詢館藏紀錄"
  }, "🏛️ 國家圖書館館藏"), /*#__PURE__*/React.createElement("a", {
    href: `https://www.google.com.tw/search?tbm=bks&q=${encodeURIComponent(selectedBookDetail.title + ' ' + (selectedBookDetail.author || ''))}`,
    target: "_blank",
    rel: "noreferrer",
    className: "px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-lg font-bold transition flex items-center gap-1 shadow-sm active:scale-95",
    title: "在 Google 圖書查詢書籍預覽與出版資訊"
  }, "📚 Google 圖書"))))), /*#__PURE__*/React.createElement("div", {
    className: "border-t border-[var(--border-color)]/60 pt-2 text-xs"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setIsRelatedBooksOpen(!isRelatedBooksOpen),
    className: "w-full py-1.5 px-3 rounded-xl bg-amber-50/70 hover:bg-amber-100/90 text-amber-900 border border-amber-200/80 font-bold transition flex items-center justify-between shadow-sm active:scale-[0.99]",
    title: "展開同分類其他書籍推薦"
  }, /*#__PURE__*/React.createElement("span", {
    className: "flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "BookOpen",
    size: 14,
    className: "text-[var(--primary-color)]"
  }), `📚 查看同分類《${selectedBookDetail.category || '學術典籍'}》其他精選典籍 (${relatedBooks.length}本)`), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] font-sans text-amber-800 font-bold"
  }, isRelatedBooksOpen ? "收起 ▴" : "展開 ▾")), isRelatedBooksOpen && /*#__PURE__*/React.createElement("div", {
    className: "mt-2.5 grid grid-cols-2 sm:grid-cols-4 gap-2.5 animate-in"
  }, relatedBooks.map(rb => /*#__PURE__*/React.createElement("a", {
    key: rb.id,
    href: `?book=${encodeURIComponent(rb.id)}`,
    onClick: e => {
      e.preventDefault();
      setSelectedBookDetail(rb);
      setIsRelatedBooksOpen(false);
    },
    className: "p-2 rounded-xl bg-white border border-stone-200 hover:border-[var(--primary-color)] hover:shadow-md transition flex flex-col justify-between text-left group"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full h-24 bg-stone-100 rounded-lg overflow-hidden mb-1.5 flex items-center justify-center p-1 border border-stone-100"
  }, /*#__PURE__*/React.createElement("img", {
    src: formatImageUrl(rb.localCover || rb.cover, 200),
    alt: rb.title,
    className: "w-full h-full object-contain group-hover:scale-105 transition"
  })), /*#__PURE__*/React.createElement("div", {
    className: "font-serif font-bold text-xs text-stone-800 line-clamp-2 leading-tight group-hover:text-[var(--primary-color)] transition",
    title: rb.title
  }, rb.title), /*#__PURE__*/React.createElement("div", {
    className: "mt-1 flex items-baseline justify-between text-[11px]"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-stone-400 font-mono"
  }, rb.id), /*#__PURE__*/React.createElement("span", {
    className: "text-[var(--primary-color)] font-bold"
  }, `NT$ ${rb.price || 0}`)))))), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--border-color)]/60 text-xs text-stone-500"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-[var(--dark-color)] flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Share2",
    size: 14,
    className: "text-[var(--primary-color)]"
  }), " 分享此書："), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 flex-wrap"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: ev => toggleWishlist(selectedBookDetail, ev),
    className: "px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 shadow-sm active:scale-95 border text-xs",
    style: isWishlisted(selectedBookDetail.id) ? { background: '#E11D48', color: '#FFFFFF', borderColor: '#E11D48' } : { background: '#FFF1F2', color: '#BE123C', borderColor: '#FECDD3' },
    title: isWishlisted(selectedBookDetail.id) ? "已收藏（點擊移除）" : "加入我的收藏／待購書單"
  }, isWishlisted(selectedBookDetail.id) ? "♥ 已收藏" : "♡ 收藏"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      const cleanAuthor = String(selectedBookDetail.author || '').replace(/著|編|校|註|輯/g, '').trim();
      const currentBookUrl = `${window.location.origin}${window.location.pathname}?book=${encodeURIComponent(selectedBookDetail.id || selectedBookDetail.title)}`;
      const cite = `${cleanAuthor}（2026）。《${selectedBookDetail.title}》。台北：文史哲出版社。${selectedBookDetail.isbn ? `ISBN: ${selectedBookDetail.isbn}。` : ''}取自 ${currentBookUrl}`;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(cite).then(() => showMsg('✅ 已複製學術論文引用格式（APA）！可直接貼入論文。')).catch(() => showMsg(cite));
      } else {
        showMsg(cite);
      }
    },
    className: "px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg font-bold transition flex items-center gap-1 shadow-sm active:scale-95",
    title: "一鍵複製 APA 學術論文引用格式"
  }, "🎓 論文引用"), /*#__PURE__*/React.createElement("button", {
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
    className: "p-3.5 md:p-4 border-t border-[var(--border-color)]/70 bg-[var(--bg-light)]/95 backdrop-blur-md shrink-0 flex gap-3 z-10"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      const b = selectedBookDetail;
      setSelectedBookDetail(null);
      openReviewModalForBook(b);
    },
    className: `flex-1 bg-[var(--bg-color)] hover:bg-[var(--bg-light)] border-2 border-[var(--primary-color)] text-[var(--primary-color)] py-2.5 px-4 rounded-xl font-bold flex justify-center items-center gap-1.5 ${isBookDetailFullscreen ? 'text-sm md:text-base' : 'text-xs'} shadow-sm active:scale-95 transition`
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "MessageSquare",
    size: 16
  }), " 讀後心得交流"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: e => addToCart(selectedBookDetail, e),
    disabled: selectedBookDetail.stock <= 0,
    className: `flex-1 bg-[var(--primary-color)] hover:bg-[var(--dark-color)] shimmer-btn text-white py-2.5 px-4 rounded-xl font-bold flex justify-center items-center gap-1.5 ${isBookDetailFullscreen ? 'text-sm md:text-base' : 'text-xs'} shadow ${selectedBookDetail.stock <= 0 ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`
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
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-gray-800 flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Send",
    size: 14,
    className: "text-purple-500"
  }), " \u767C\u8868\u8B80\u5F8C\u611F\u8A00\uFF1A"), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-medium"
  }, "※ 必填")), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2.5"
  }, /*#__PURE__*/React.createElement("input", {
    name: "name",
    required: true,
    placeholder: "您的稱呼（必填）",
    className: "w-full glass-input p-2 rounded-lg outline-none text-xs"
  }), /*#__PURE__*/React.createElement("input", {
    name: "contact",
    required: true,
    placeholder: "聯絡電話或電子信箱 Email（必填）",
    className: "w-full glass-input p-2 rounded-lg outline-none text-xs"
  })), /*#__PURE__*/React.createElement("textarea", {
    name: "content",
    required: true,
    rows: "3",
    placeholder: `請輸入您對《${reviewBook.title}》的研讀心得或提問...（必填）`,
    className: "w-full glass-input p-2.5 rounded-lg outline-none resize-none leading-relaxed text-xs"
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
  }), /*#__PURE__*/React.createElement("span", null, isSubmittingReview ? "傳送中..." : "送出心得反映")))))), isMirrorModalOpen && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 bg-black/60 backdrop-blur-sm z-[250] flex justify-center items-center p-3 sm:p-5 overflow-y-auto animate-in",
    onClick: () => setIsMirrorModalOpen(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-modal w-full max-w-2xl rounded-3xl border border-white/80 shadow-2xl overflow-hidden font-sans my-auto",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-4 sm:p-5 border-b border-stone-200 bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-9 h-9 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Globe",
    size: 20
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-base sm:text-lg font-bold font-serif flex items-center gap-2"
  }, "全球節點鏡像 ‧ 線路切換與引流", /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] bg-emerald-500 text-black font-black px-2 py-0.5 rounded-full"
  }, "五大雲端節點")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-stone-300 mt-0.5"
  }, "文史哲出版社全球多雲 CDN 網絡・推薦大陸讀者首選 Cloudflare 節點"))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setIsMirrorModalOpen(false),
    className: "p-1.5 rounded-full hover:bg-white/20 text-stone-300 hover:text-white transition cursor-pointer"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "X",
    size: 18
  }))), /*#__PURE__*/React.createElement("div", {
    className: "p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between bg-amber-50/90 border border-amber-200 p-3 rounded-2xl text-xs text-amber-900 gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 min-w-0"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Info",
    size: 16,
    className: "text-amber-700 shrink-0"
  }), /*#__PURE__*/React.createElement("span", {
    className: "truncate sm:whitespace-normal"
  }, "若您身在中國大陸或海外特定地區遇連線卡頓，可隨時點擊下方「立即切換」選用最佳節點。")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: measureMirrorLatencies,
    disabled: isTestingLatencies,
    className: `shrink-0 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition text-xs shadow-sm cursor-pointer ${isTestingLatencies ? 'opacity-60 cursor-not-allowed' : 'active:scale-95'}`
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "RefreshCw",
    size: 13,
    className: isTestingLatencies ? "animate-spin" : ""
  }), isTestingLatencies ? "測速中..." : "重新測速")), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, MIRROR_LINES.map(m => {
    const isCurrent = typeof window !== 'undefined' && window.location.hostname.includes(m.host);
    const latency = mirrorLatencies[m.id];
    let latencyBadge = null;
    if (isTestingLatencies && latency === undefined) {
      latencyBadge = /*#__PURE__*/React.createElement("span", {
        className: "text-[11px] text-stone-400 font-mono flex items-center gap-1"
      }, /*#__PURE__*/React.createElement("span", {
        className: "w-1.5 h-1.5 rounded-full bg-stone-400 animate-ping"
      }), "測速中...");
    } else if (latency !== undefined) {
      if (latency === -1) {
        latencyBadge = /*#__PURE__*/React.createElement("span", {
          className: "text-[11px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md font-mono"
        }, "連線逾時 / 阻斷");
      } else if (latency < 120) {
        latencyBadge = /*#__PURE__*/React.createElement("span", {
          className: "text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-mono flex items-center gap-1"
        }, /*#__PURE__*/React.createElement("span", {
          className: "w-1.5 h-1.5 rounded-full bg-emerald-500"
        }), `極速 ${latency}ms`);
      } else if (latency < 350) {
        latencyBadge = /*#__PURE__*/React.createElement("span", {
          className: "text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md font-mono flex items-center gap-1"
        }, /*#__PURE__*/React.createElement("span", {
          className: "w-1.5 h-1.5 rounded-full bg-amber-500"
        }), `順暢 ${latency}ms`);
      } else {
        latencyBadge = /*#__PURE__*/React.createElement("span", {
          className: "text-[11px] font-bold text-stone-600 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-md font-mono"
        }, `稍慢 ${latency}ms`);
      }
    }

    return /*#__PURE__*/React.createElement("div", {
      key: m.id,
      className: `p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isCurrent ? 'bg-amber-50/70 border-amber-400 ring-2 ring-amber-400/30' : 'bg-white/80 hover:bg-white border-stone-200 hover:border-stone-300 shadow-sm'}`
    }, /*#__PURE__*/React.createElement("div", {
      className: "space-y-1 min-w-0 flex-1"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap items-center gap-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: "font-bold text-sm sm:text-base text-stone-900 font-serif"
    }, m.name), /*#__PURE__*/React.createElement("span", {
      className: `text-[10px] font-bold px-2 py-0.5 rounded-full ${m.badgeColor}`
    }, m.badge), latencyBadge), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-stone-600"
    }, m.desc), /*#__PURE__*/React.createElement("div", {
      className: "text-[11px] font-mono text-stone-400 truncate"
    }, m.url)), /*#__PURE__*/React.createElement("div", {
      className: "shrink-0 flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100"
    }, isCurrent ? /*#__PURE__*/React.createElement("span", {
      className: "bg-emerald-100 text-emerald-800 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 border border-emerald-300"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "Check",
      size: 14
    }), "當前使用中") : /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => switchMirror(m.url),
      className: "bg-[var(--primary-color)] hover:bg-[var(--dark-color)] text-white font-bold px-4 py-1.5 rounded-xl text-xs transition shadow-sm hover:shadow flex items-center gap-1.5 active:scale-95 cursor-pointer"
    }, "立即切換", /*#__PURE__*/React.createElement(Icon, {
      name: "ChevronRight",
      size: 14
    }))));
  })), /*#__PURE__*/React.createElement("div", {
    className: "bg-stone-50 border border-stone-200/80 p-3 sm:p-4 rounded-2xl text-xs text-stone-600 space-y-1.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-bold text-stone-800 flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Sparkles",
    size: 14,
    className: "text-amber-600"
  }), " 大陸同胞與海外訪問小指南："), /*#__PURE__*/React.createElement("ul", {
    className: "list-disc list-inside space-y-1 text-stone-500 pl-1"
  }, /*#__PURE__*/React.createElement("li", null, "中國大陸地區（未翻牆）：強烈推薦使用【Cloudflare 節點】，具備 Anycast 智慧多路由與高抗阻斷能力。"), /*#__PURE__*/React.createElement("li", null, "港澳台與歐美讀者：推薦使用【Vercel 節點】或【GitHub 官方站】，享全球邊緣快取極速響應。"), /*#__PURE__*/React.createElement("li", null, "推廣或分享給大陸朋友：可直接複製 ", /*#__PURE__*/React.createElement("code", {
    className: "bg-stone-200 px-1.5 py-0.5 rounded text-[11px] font-mono text-stone-800 select-all"
  }, "https://theliberalartspress.pages.dev/"), "，避免因 GitHub 被封鎖導致無法開啟。")))))), notification && /*#__PURE__*/React.createElement("div", {
    className: "fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 glass-dark text-white px-5 py-3 rounded-2xl shadow-2xl animate-in font-bold text-xs md:text-sm z-[300] flex items-center gap-2 border-l-4 border-[var(--primary-color)] whitespace-nowrap"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "CheckCircle",
    size: 16,
    className: "text-emerald-400"
  }), " ", notification), /*#__PURE__*/React.createElement(InkRippleEffect, null));
}

// --- 🌊 點擊水墨漣漪效果 (Ink Ripple on Click - 0% CPU開銷，純點擊觸發) ---
function InkRippleEffect() {
  React.useEffect(() => {
    const onClick = (e) => {
      try {
        const ripple = document.createElement('div');
        ripple.className = 'ink-ripple';
        const size = Math.floor(Math.random() * 14) + 42;
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX}px`;
        ripple.style.top = `${e.clientY}px`;
        document.body.appendChild(ripple);
        setTimeout(() => {
          if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
        }, 650);
      } catch (_) {}
    };
    window.addEventListener('click', onClick, { passive: true });
    return () => window.removeEventListener('click', onClick);
  }, []);
  return null;
}

// --- 📜 關於社長（社長剪影｜保持「品牌故事」同款風格與完整原文）---
function PresidentModal({ onClose, ui }) {
  const e = React.createElement;
  return e('div', {
    className: 'fixed inset-0 bg-black/60 backdrop-blur-md z-[150] flex justify-center items-center p-4 md:p-8',
    onClick: onClose
  }, e('div', {
    className: 'glass-modal w-full max-w-3xl max-h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in border border-white/80',
    onClick: ev => ev.stopPropagation()
  },
    // Header (same as 品牌故事)
    e('div', { className: 'glass-dark p-4 flex justify-between items-center border-b-2 border-[var(--primary-color)]' },
      e('h2', { className: 'text-lg font-serif font-black text-white flex items-center gap-2.5 tracking-wider' },
        e(Icon, { name: 'User', size: 20, className: 'text-[var(--primary-color)]' }),
        ' ', ui.menuPresident || '關於社長'
      ),
      e('button', {
        type: 'button',
        onClick: onClose,
        className: 'bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full text-xs font-bold text-white transition flex items-center gap-1.5'
      }, e(Icon, { name: 'X', size: 14 }), ' ', ui.aboutCloseBtn || '關閉')
    ),

    // Body (same typography & spacing as 品牌故事)
    e('div', { className: 'flex-1 overflow-y-auto p-6 md:p-10 font-sans' },
      e('div', { className: 'mb-6 text-center border-b pb-5 border-[var(--border-color)] space-y-2' },
        e('div', { className: 'text-xs font-bold tracking-[0.2em] text-[var(--primary-color)]' }, '社長剪影 ‧ 文史哲出版社有限公司'),
        e('h1', { className: 'text-2xl md:text-3xl font-serif font-black text-[var(--dark-color)] tracking-[0.06em]' }, '台灣出版界的奇人俠士'),
        e('p', { className: 'text-sm font-bold text-[var(--text-dark)] opacity-85' }, '──記不平凡的台灣人彭正雄　◆ 無名氏〔卜乃夫〕撰 ◆　《青年日報》')
      ),

      e('div', { className: 'space-y-5 text-[var(--text-dark)] leading-relaxed text-justify text-sm md:text-base' },
        // Photo floated / paired cleanly in classic editorial style
        e('div', { className: 'md:float-right md:ml-6 mb-4 md:w-64 bg-[var(--bg-light)] p-2.5 rounded-2xl border border-[var(--border-color)] shadow-sm' },
          e('img', {
            src: 'assets/president_photo.webp',
            alt: '彭正雄社長伉儷合影',
            className: 'w-full h-auto rounded-xl object-cover',
            onError: ev => { ev.currentTarget.onerror = null; ev.currentTarget.src = 'assets/president_photo.jpg'; }
          }),
          e('p', { className: 'text-[11px] text-center opacity-75 mt-2 font-medium' }, '彭正雄社長伉儷留影')
        ),

        e('p', { className: 'drop-cap' },
          '照說，只有政界、軍界、大企業界，才會出現奇人、俠士。出版界只是企業界的一種文化點綴，一件小擺設，那談得上有什麼奇人、俠士，像王永慶、張忠謀雖不能稱俠士，卻稱得上企業界的奇人。台灣出版業那裡會冒出王永慶這號人物！'
        ),
        e('p', null,
          '中國出版業倒真出過奇人，他就是王雲五。他經營的商務印書館，是廿世紀中國文化重要保母之一。王公幾乎未進過學校，全靠自學，卻能通讀大英百科全書。後來他入閣任財政部長、行政院副院長。中文大學校長金耀基說他應是內閣總理之才，但王雲五這棵文化巨樹，只能生長在一千一百多萬平方公裡的大陸，四萬多平方公裡的台灣，出不了這種巨樹。'
        ),
        e('p', null,
          '此文論奇人、俠士，不想涉及偉人或大名人，易言之，不欲指量的奇、俠，而是專指質的奇俠。比如說，你前後喝過一桶大海水了，算嘗過「海」味，但你只喝過一小酒杯大海水，也算得上嘗過海味了，這是以質類比。'
        ),
        e('div', { className: 'bg-[var(--bg-light)] p-5 rounded-2xl border-l-4 border-[var(--primary-color)] text-xs md:text-sm clear-both' },
          '出版業也是商業，是做生意。俗話說：「賠錢的生意沒人做。」在出版家，則是賠錢的書不出版。彭正雄所以可稱奇人，因為有時他竟敢反叛上述出版商的清規戒律，賠錢的書他也肯出版，只要是好書。'
        ),

        e('h3', { className: 'font-bold text-lg text-[var(--dark-color)] pt-2 flex items-center gap-2' },
          e(Icon, { name: 'BookOpen', size: 18, className: 'text-[var(--primary-color)]' }),
          ' 俠情出版實錄'
        ),
        e('p', null,
          '隨便舉個例子。幾年前紀弦從美國來台，帶了一本雜文集《千金之旅》，有廿幾萬字，想出版，儘管他是鼎鼎大名，卻無出版社肯接受此書。因為它無甚特色，也算不上好書，肯定銷不好。此書找到彭正雄，後者一口答應，使他喜不自勝。彭明知此書是賠錢書，但念及紀弦是當年台灣現代詩點火者，文學史少不了他，坊間卻無一本專書提供他的史料。未來史家及研究者必感困難。他印此書，多少可解決一點困難。像他這種為文化、文學研究者設想的出版家，台灣恐無第二人，可謂既奇又俠。'
        ),
        e('p', null,
          '再正式舉幾例。前些年，某出版社想請人編台灣現代詩名家的評論專集，首先印了李瑞騰編的「詩魔的蛻變」，是許多評論名詩人洛夫的論文彙編。但書上市後銷路不佳，出版商立刻打退堂鼓，預約好編寫的另外幾本名家評論彙編，決定不再出版。大概彭正雄在出版界也有些「奇」名，他們便找彭，彭又是滿口答應，前後印了蕭蕭編的「詩儒的創造」（評亞弦），「詩癡的刻痕」（評張默），「人文風景鎸刻者」（評葉維廉）這三種書，每種全有數十萬字，出版費自是不貲。雖三位詩人買了一些書，出版社還是賠了點錢，雖然所賠有限。但更大的耗費卻是人力。印此三書，所耗一定人工，形同義工，無分文報酬。彭的看法是，這三位詩人全是現代詩名家，作品流傳青史，未來海峽兩岸現代詩讀者、教授，研究學者，必視此三書為瑰寶，因為這以前尚無人出版過這些書。他能出這種好書，自感喜悅。'
        ),
        e('p', null,
          '他對現代的詩盡力最多的是印了羅門廿餘本書，多為詩集，還有研討會上評論他的一些論文，甚至他的特殊作品「燈屋」也出版。他說，羅門是他近四十年老友，他重視這份友誼，更看重羅門被選為台灣十大名詩人之一。在友誼加學術的天秤上，金錢的力量應是較輕的。說穿了，這是他對台灣新詩界的俠情流露。'
        ),
        e('p', null,
          '關於賠錢出好書，例子還有不少，限於篇幅，我不再提了。早在廿九年前，各大學的博士、碩士寫好研究論文，即使自費，許多出版社也不願替他們印。彭正雄知道後，總說：「拿來，文史哲願替你出。」這時學校只肯付四千元論文助印費，彭正雄並不計較，寧願再賠些錢，予以出版，學生取走一定的書，其餘舊文史哲。直至目前為止，這廿九年中，彭正雄印了三、四百種博士、碩士論文，即使他們有些人已開始出名，經濟較寬，付費較多，他仍給予一些照顧。像龔鵬程、黃永武這些知名學者，早年博士論文悉由文史哲印。龔鵬程寫「四十自述」時，還提到此事，對彭表示謝意。'
        ),
        e('p', null,
          '除了博士、碩士論文外，台灣有些學者願意自費印著作或全集，包括一些非知名學者的文人，全找彭正雄幫忙，因為總善予照顧，定費較低廉，印刷也較精美，校對更較認真，像名教授方祖燊，雖在文史哲出版過十種書以上，但他的「方祖榮全燊」，仍願自費請文史哲出版，因為他們全敬重彭的敬業，無一般商人俗氣，最難得是，他有俠氣。大約他的俠氣、奇氣已名播四方，許多學者、名人全想請他出書。他似乎已變成有求必應的彌勒佛了。'
        ),

        e('h3', { className: 'font-bold text-lg text-[var(--dark-color)] pt-2 flex items-center gap-2' },
          e(Icon, { name: 'Compass', size: 18, className: 'text-[var(--primary-color)]' }),
          ' 奇人五問：憑什麼堅持願意賠錢出好書？'
        ),
        e('p', null, '人們可能覺得這是一個平常人，他既不是財主沈萬山，憑什麼能堅持願意賠錢出好書，我試提出下列幾點來解釋。'),

        e('div', { className: 'glass-dark text-stone-200 p-5 md:p-6 rounded-2xl space-y-4 text-xs md:text-sm leading-relaxed' },
          e('p', null,
            e('span', { className: 'text-[var(--primary-color)] font-bold' }, '（一）'),
            '常和他接觸的友人，一定會覺得，他真是個奇人。三、四年前，他居然徹底學拿破崙，每天只睡五小時，有時還不到一小時。這二、三年（今年也已六十三歲了），經我們不斷苦勸，健康第一，他才開始睡六小時。那許多年，每日他工作十六小時，一個人生龍活虎抵得上兩人，這樣業務自然做得又深又透，也省了一些成本。'
          ),
          e('p', null,
            e('span', { className: 'text-[var(--primary-color)] font-bold' }, '（二）'),
            '卅年來，他共印了一五〇〇種書，倉庫現存的尚有一二〇〇種，每年印四十種左右，每月三種半。近十年來，每年約出書七十種左右。據我所知，大陸有些相當大的出版社，每年只出一百種書，人員卻有百人之多。（註）在台灣每年如印四十種書，人手也得七、八位，但文史哲卻只有三名幹員，彭與妻子、女兒。這樣少的人，印這麼多的書，在中國恐怕要入「金氏紀錄」了，如果中國有「金氏紀錄」。'
          ),
          e('p', null,
            e('span', { className: 'text-[var(--primary-color)] font-bold' }, '（三）'),
            '像文史哲這樣大的出版社，一般總有社長、總編輯、美工、會計、校對、發行、送貨、雜工，但這許多職務，彭一個人包下，他幾乎變成魔術化身的人物。我每見他騎著摩托車，把一大包又一大包新書送往書店，不僅佩服他經營的智慧，更欣賞他的含辛茹苦的大禹精神。正因為他能身兼數職，自然又省下一些開銷。我們這些朋友見他太辛苦，都勸他多用一個人。他說，多用一個人，每月總要支付二、三萬元，一年下來，要幾十萬，有這筆錢，我又可多出一些書了。'
          ),
          e('p', null,
            e('span', { className: 'text-[var(--primary-color)] font-bold' }, '（四）'),
            '上面這段話，倒揭穿了他的靈魂秘密。為什麼他這樣愛印書、印好書？十幾年前，某大報報導他的事蹟，標題「癡心一片，執著一人。」他對書確是一片癡心，他告訴我：「每次出一本新書，捧在手裡，我真是歡喜。」也難怪，人類所以能從野獸進步為文明人、文化人，全靠書嘛，古人貼這樣小標語：「敬惜字紙！」也是這個意思。印書既是彭的幸福，也是他活潑生命力的泉源，這一門專業，他當然做得很出色了。只要想想，印書如此之多的大出版社，辦公室卻小得可憐，只有卅坪左右，又是在一個小巷子裡。他這種苦幹精神，真如孔子讚顏回，說他「居陋巷，人不堪其憂，回也不改其樂。」'
          ),
          e('p', null,
            e('span', { className: 'text-[var(--primary-color)] font-bold' }, '（五）'),
            '努力節約成本只是「節流」，還得「開源」才能賺點錢。一九七九年出版的張仁青撰「應用文」，一直暢銷到今天。此書一年的利潤就可以助彭一年印十本左右的書，有的書被學校選為教材，也銷得不錯。同樣重要的是：他出的那些文史哲古籍學術專著，由於具有一定價值，早獲得口碑，在國內外也爭取到不少固定的客戶，因而獲得一些利潤。不過，談到這些古籍，此事就須從頭說起。'
          )
        ),

        e('h3', { className: 'font-bold text-lg text-[var(--dark-color)] pt-2 flex items-center gap-2' },
          e(Icon, { name: 'Globe', size: 18, className: 'text-[var(--primary-color)]' }),
          ' 白手起家與名師薰陶'
        ),
        e('p', null,
          '彭原是新竹市人，週歲就遷居台北。他的學歷並不高，畢業於高級商校，相當於高中水平。可是，他在著名的學生書局工作近十年，卻學得一身本事，更重要的是，因為他為人極誠懇，器度寬宏，又喜助人為樂，便在各方面建立很好的人脈關係。當初他開業辦「文史哲出版社」，由於故宮博物院領導及友好教授支持，再加影印、印刷兩方面的友人協助，他赤手空拳，白手起家，便出版了一套「明版善本影印」的書，不只贏得國內、美國、日本學術界的重視，此後繼印的古籍學術專作，也吸引他們漸成為固定客戶。'
        ),
        e('p', null,
          '到現在為止，他出版的學術專著，最重要的是「文史哲學集成」多種，其次是「文史哲學術叢刊」、「台灣近百年研究叢刊」、「南洋研究史料叢刊」、「藝術叢刊」等多種。像「南洋研究史料叢刊」這種專著，其他出版社絕不會印，但他認為，南洋華僑有數百萬，他們當中總有些人要閱讀，甚至研究此書。又如他目前不斷印「中日外交論集」，日本及各國國際外交學者也要看此書。早年他陸續影印殷商篆刻等史料，中國及日本許多篆刻家（包括藝術家）也視為珍寶。有一回，我在他社裡見到古本明代「李卓吾文集」，他笑說：「這些明代影印本早賣光了，剩下這一兩本也保不住了。」可見真有價值的書，總不愁沒人讀的。'
        ),
        e('p', null,
          '彭從事文史哲出版並不容易，首先他自己要懂得古籍。為此，前後他師事過台大教授吳相湘，又多次請教毛子水、鄭騫、高明大師及嚴靈峰、戴君仁、夏德儀、昌彼得、林尹等教授，這些學者全願指導，他這才能馳騁古籍，通版本學及其他基礎學問。在名師傳授、薰陶下，他自己也學識豐富，業有專長了。他主辦過「文史哲雜誌」，也寫過論文「台灣地區古籍整理及其貢獻」等數篇。他不只是出版家，也是學者。當然，最大的貢獻是他創辦台灣最重要的文史哲古籍出版機構，而且以花甲之年，仍為文化、出版理想奉獻心力。'
        ),
        e('div', { className: 'bg-[var(--bg-light)] p-5 rounded-2xl border-l-4 border-[var(--primary-color)] text-xs md:text-sm space-y-2' },
          e('p', null, '今年八月一日是文史哲成立卅週年，我們一些文友特舉辦小小餐會，慶祝彭正雄先生的事業成功，並對他的道德、智慧、堅強的意志表示敬意。'),
          e('p', null, '大家希望我寫一篇蕪文，介紹正雄先生事跡，匆匆草成，尚乞方家指正。'),
          e('p', { className: 'text-xs opacity-75 pt-1' }, '（註）這些出版社編輯雖多，但大半是掛名，不一定做實際工作。')
        )
      ),

      e('div', { className: 'mt-8 text-center' },
        e('button', {
          type: 'button',
          onClick: onClose,
          className: 'bg-[var(--primary-color)] hover:bg-[var(--dark-color)] text-white px-7 py-2.5 rounded-full font-bold shadow transition-colors text-sm'
        }, ui.aboutCloseBtn || '關閉')
      )
    )
  ));
}

// --- 📍 聯繫我們（聯絡本社｜保持「品牌故事」同款風格與原有文字）---
function ContactModal({ onClose, ui, onCopy, onOpenCS }) {
  const e = React.createElement;
  const address = ui.footerAddress || '10074 台北市羅斯福路一段七十二巷四號';
  const phone = ui.footerPhone || '886-2-2351-1028';
  const fax = ui.footerFax || 'Fax: 886-2-2396-5656';
  const email = ui.footerEmail || 'lapentw@gmail.com';
  const hours = ui.footerHours || '營業時間：週一到週五 AM9:00~PM6:00';
  const transfer = ui.footerTransfer || '郵政劃撥：05128812號 彭正雄帳戶';
  const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('台北市中正區羅斯福路一段72巷4號 文史哲出版社');

  return e('div', {
    className: 'fixed inset-0 bg-black/60 backdrop-blur-md z-[150] flex justify-center items-center p-4 md:p-8',
    onClick: onClose
  }, e('div', {
    className: 'glass-modal w-full max-w-3xl max-h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in border border-white/80',
    onClick: ev => ev.stopPropagation()
  },
    // Header (same as 品牌故事)
    e('div', { className: 'glass-dark p-4 flex justify-between items-center border-b-2 border-[var(--primary-color)]' },
      e('h2', { className: 'text-lg font-serif font-black text-white flex items-center gap-2.5 tracking-wider' },
        e(Icon, { name: 'MessageCircle', size: 20, className: 'text-[var(--primary-color)]' }),
        ' ', ui.menuContact || '聯繫我們'
      ),
      e('button', {
        type: 'button',
        onClick: onClose,
        className: 'bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full text-xs font-bold text-white transition flex items-center gap-1.5'
      }, e(Icon, { name: 'X', size: 14 }), ' ', ui.aboutCloseBtn || '關閉')
    ),

    // Body (same typography & spacing as 品牌故事)
    e('div', { className: 'flex-1 overflow-y-auto p-6 md:p-10 font-sans' },
      e('div', { className: 'mb-6 text-center border-b pb-4 border-[var(--border-color)] space-y-1' },
        e('div', { className: 'text-xs font-bold tracking-[0.2em] text-[var(--primary-color)]' }, '聯絡本社'),
        e('h1', { className: 'text-2xl md:text-3xl font-sans font-black text-[var(--dark-color)] tracking-[0.08em]' }, ui.frontendName || '✨文史哲出版社')
      ),

      e('div', { className: 'space-y-6 text-[var(--text-dark)] leading-relaxed text-justify text-sm md:text-base' },
        // 基本聯絡資訊
        e('div', { className: 'bg-[var(--bg-light)] p-5 rounded-2xl border-l-4 border-[var(--primary-color)] space-y-2.5 text-xs md:text-sm' },
          e('div', { className: 'flex flex-wrap items-center gap-x-3 gap-y-1' },
            e('strong', { className: 'text-[var(--dark-color)]' }, '本公司電子信箱：'),
            e('a', { href: `mailto:${email}`, className: 'text-[var(--primary-color)] font-bold hover:underline' }, email),
            e('button', {
              type: 'button',
              onClick: () => onCopy('電子信箱', email),
              className: 'text-[11px] px-2 py-0.5 rounded-full border border-[var(--border-color)] hover:border-[var(--primary-color)] transition'
            }, '複製')
          ),
          e('div', { className: 'flex flex-wrap items-center gap-x-3 gap-y-1' },
            e('strong', { className: 'text-[var(--dark-color)]' }, '地址：'),
            e('span', null, address),
            e('a', {
              href: mapsUrl,
              target: '_blank',
              rel: 'noopener noreferrer',
              className: 'text-[11px] font-bold text-[var(--primary-color)] hover:underline'
            }, 'Google 地圖 ↗')
          ),
          e('div', { className: 'flex flex-wrap items-center gap-x-6 gap-y-1', style: { gap: '8px 24px' } },
            e('span', null, e('strong', { className: 'text-[var(--dark-color)]' }, '電話：'),
              e('a', { href: 'tel:+886223511028', className: 'hover:text-[var(--primary-color)] font-bold' }, phone)
            ),
            e('span', null, e('strong', { className: 'text-[var(--dark-color)]' }, '傳真：'), fax.replace(/^Fax:\s*/i, ''))
          ),
          e('div', { className: 'flex flex-wrap items-center gap-x-3 gap-y-1' },
            e('span', null, e('strong', { className: 'text-[var(--dark-color)]' }, '營業時間：'), hours.replace(/^營業時間：\s*/, ''))
          )
        ),

        // 交通位置與地圖
        e('div', null,
          e('h3', { className: 'font-bold text-lg text-[var(--dark-color)] mb-3 flex items-center gap-2' },
            e(Icon, { name: 'MapPin', size: 18, className: 'text-[var(--primary-color)]' }),
            ' 交通位置與地圖指引'
          ),
          e('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4 items-center' },
            e('div', { className: 'rounded-2xl overflow-hidden border border-[var(--border-color)] bg-[#f4efe4] p-2 shadow-inner' },
              e('svg', { viewBox: '0 0 420 260', className: 'w-full h-auto', role: 'img', 'aria-label': '文史哲出版社位置簡圖' },
                e('rect', { x: 0, y: 0, width: 420, height: 260, fill: '#f3ede0', rx: 8 }),
                e('rect', { x: 26, y: 8, width: 28, height: 244, fill: '#c8d6b9' }),
                e('rect', { x: 96, y: 8, width: 24, height: 244, fill: '#c8d6b9' }),
                e('rect', { x: 168, y: 8, width: 22, height: 175, fill: '#e8b667' }),
                e('rect', { x: 356, y: 8, width: 26, height: 244, fill: '#c8d6b9' }),
                e('rect', { x: 8, y: 172, width: 404, height: 28, fill: '#9fbe93' }),
                e('text', { x: 40, y: 78, fill: '#3a352b', fontSize: 12, fontWeight: 'bold', textAnchor: 'middle', style: { writingMode: 'tb' } }, '和平西路'),
                e('text', { x: 40, y: 222, fill: '#3a352b', fontSize: 12, fontWeight: 'bold', textAnchor: 'middle', style: { writingMode: 'tb' } }, '和平東路'),
                e('text', { x: 108, y: 78, fill: '#3a352b', fontSize: 12, fontWeight: 'bold', textAnchor: 'middle', style: { writingMode: 'tb' } }, '福州街'),
                e('text', { x: 108, y: 222, fill: '#3a352b', fontSize: 12, fontWeight: 'bold', textAnchor: 'middle', style: { writingMode: 'tb' } }, '潮州街'),
                e('text', { x: 369, y: 78, fill: '#3a352b', fontSize: 12, fontWeight: 'bold', textAnchor: 'middle', style: { writingMode: 'tb' } }, '寧波西街'),
                e('text', { x: 369, y: 222, fill: '#3a352b', fontSize: 12, fontWeight: 'bold', textAnchor: 'middle', style: { writingMode: 'tb' } }, '寧波東街'),
                e('text', { x: 240, y: 190, fill: '#22331f', fontSize: 13, fontWeight: 'bold', textAnchor: 'middle', letterSpacing: 4 }, '羅斯福路一段'),
                e('text', { x: 179, y: 126, fill: '#5b3c11', fontSize: 11, fontWeight: 'bold', textAnchor: 'middle' }, '72巷'),
                e('rect', { x: 204, y: 48, width: 112, height: 64, rx: 10, fill: '#fff3a8', stroke: '#b83b2b', strokeWidth: 2.5 }),
                e('text', { x: 260, y: 77, fill: '#b83b2b', fontSize: 18, fontWeight: '900', textAnchor: 'middle' }, '本社'),
                e('text', { x: 260, y: 98, fill: '#4a3f35', fontSize: 11, fontWeight: 'bold', textAnchor: 'middle' }, '72巷4號'),
                e('line', { x1: 190, y1: 80, x2: 204, y2: 80, stroke: '#b83b2b', strokeWidth: 2, strokeDasharray: '3 2' }),
                e('rect', { x: 204, y: 214, width: 138, height: 28, rx: 14, fill: '#2563eb' }),
                e('text', { x: 273, y: 232, fill: '#ffffff', fontSize: 11, fontWeight: 'bold', textAnchor: 'middle' }, '捷運中正紀念堂站 2號出口')
              )
            ),
            e('div', { className: 'space-y-2.5 text-xs md:text-sm leading-relaxed' },
              e('p', null, e('strong', { className: 'text-[var(--dark-color)]' }, '站名：'), '南門市場'),
              e('p', null, e('strong', { className: 'text-[var(--dark-color)]' }, '公車如下：'), '0東、15、18、208、236、251、252、644、648、660 等線。'),
              e('p', null, e('strong', { className: 'text-[var(--dark-color)]' }, '捷運：'), '捷運中正紀念堂站 2 號南門市場出口，往前走約三分鐘。'),
              e('div', { className: 'pt-1' },
                e('a', {
                  href: mapsUrl,
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  className: 'inline-flex items-center gap-1.5 text-xs font-bold text-[var(--primary-color)] hover:underline'
                }, e(Icon, { name: 'MapPin', size: 14 }), ' 開啟 Google 地圖導航 ↗')
              )
            )
          )
        ),

        // 函購辦法 (same glass-dark card style as 品牌故事的代表作家與學術著作)
        e('div', { className: 'pt-4 border-t border-[var(--border-color)]/60' },
          e('h3', { className: 'font-bold text-lg text-[var(--dark-color)] mb-3 flex items-center gap-2' },
            e(Icon, { name: 'FileText', size: 18, className: 'text-[var(--primary-color)]' }),
            ' 函購辦法'
          ),
          e('div', { className: 'glass-dark text-stone-200 p-5 rounded-2xl space-y-3 text-xs md:text-sm leading-relaxed' },
            e('ul', { className: 'list-disc list-inside space-y-2' },
              e('li', null, '本目錄定價為新臺幣售價。'),
              e('li', null, '本目錄所列價格，如有變動，概以變動後之書價為準。'),
              e('li', null, '讀者郵購圖書，務請正楷書寫收件人姓名、地址、郵遞區號及電腦書號、書名、作者、冊數以免誤寄。'),
              e('li', null, '圖書寄出後，除缺頁或印裝不良者外，恕不退換。'),
              e('li', null, '國內下單未滿3000元需加運費(運費視商品重量另計)。'),
              e('li', null, '海外讀者函購，照書價另加郵費，依當時銀行掛牌匯率開寄美金或港幣支票，掛號郵寄本社。')
            ),
            e('div', { className: 'pt-2 border-t border-white/10 text-stone-300 text-xs flex flex-wrap justify-between gap-2' },
              e('span', null, address),
              e('span', null, 'TEL：886-2-2351-1028 ・ 886-2-2394-1775')
            )
          )
        )
      ),

      e('div', { className: 'mt-8 flex flex-wrap justify-center gap-3' },
        e('button', {
          type: 'button',
          onClick: onOpenCS,
          className: 'bg-[var(--primary-color)] hover:bg-[var(--dark-color)] text-white px-7 py-2.5 rounded-full font-bold shadow transition-colors text-sm flex items-center gap-2'
        }, e(Icon, { name: 'MessageCircle', size: 16 }), ' 線上客服與建議'),
        e('button', {
          type: 'button',
          onClick: onClose,
          className: 'border border-[var(--border-color)] hover:border-[var(--primary-color)] px-7 py-2.5 rounded-full font-bold transition-colors text-sm'
        }, ui.aboutCloseBtn || '關閉')
      )
    )
  ));
}

// --- 🐱 文房小書僮「墨寶喵」（Mobao Cat Mascot）---
const MOBAO_QUOTES = [
  "讀書百遍，其義自見。墨寶在旁為您磨墨添香～🐾",
  "先生/女士若尋特定典籍，點擊上方『書籍檢索』或依學者分類尋覓甚便！📜",
  "文史哲半世紀嚴選，冊冊皆名家心血結晶。🐱",
  "夜讀倦了麼？右下角點擊紅燈籠切換『護眼燭光模式』暖心溫潤喔！🏮",
  "博學之，審問之，慎思之，明辨之，篤行之。✨",
  "書中自有黃金屋，每本好書都是一次跨越時空的相遇。📖",
  "墨寶喵在此守護文史哲二千餘冊典籍，請先生/女士隨意翻閱～🐾",
  "發憤忘食，樂以忘憂，不知老之將至云爾。墨寶伴您共讀！🌸"
];

function MobaoCatMascot() {
  const [isSleeping, setIsSleeping] = React.useState(false);
  const [dialogue, setDialogue] = React.useState(null);
  const [isJumping, setIsJumping] = React.useState(false);
  const [isMinimized, setIsMinimized] = React.useState(() => {
    try {
      return localStorage.getItem('lapen_mobao_minimized') === 'true';
    } catch (_) {
      return false;
    }
  });

  const sleepTimerRef = React.useRef(null);
  const dialogueTimerRef = React.useRef(null);

  const resetSleepTimer = React.useCallback(() => {
    setIsSleeping(false);
    if (sleepTimerRef.current) clearTimeout(sleepTimerRef.current);
    sleepTimerRef.current = setTimeout(() => {
      setIsSleeping(true);
    }, 9000);
  }, []);

  React.useEffect(() => {
    const handleActivity = () => resetSleepTimer();
    window.addEventListener('mousemove', handleActivity, { passive: true });
    window.addEventListener('scroll', handleActivity, { passive: true });
    window.addEventListener('keydown', handleActivity, { passive: true });
    window.addEventListener('touchstart', handleActivity, { passive: true });
    window.addEventListener('click', handleActivity, { passive: true });
    resetSleepTimer();

    const handleAddToCartEvent = (e) => {
      const title = e.detail && e.detail.title ? e.detail.title : '典籍';
      setIsSleeping(false);
      setIsJumping(true);
      if (dialogueTimerRef.current) clearTimeout(dialogueTimerRef.current);
      setDialogue(`已為先生/女士收入《${title}》！🎒✨`);
      setTimeout(() => setIsJumping(false), 900);
      dialogueTimerRef.current = setTimeout(() => setDialogue(null), 3800);
      resetSleepTimer();
    };
    window.addEventListener('mobaoAddToCart', handleAddToCartEvent);

    return () => {
      if (sleepTimerRef.current) clearTimeout(sleepTimerRef.current);
      if (dialogueTimerRef.current) clearTimeout(dialogueTimerRef.current);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('mobaoAddToCart', handleAddToCartEvent);
    };
  }, [resetSleepTimer]);

  const handleMascotClick = (e) => {
    e.stopPropagation();
    setIsSleeping(false);
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 600);
    resetSleepTimer();

    const quote = MOBAO_QUOTES[Math.floor(Math.random() * MOBAO_QUOTES.length)];
    setDialogue(quote);
    if (dialogueTimerRef.current) clearTimeout(dialogueTimerRef.current);
    dialogueTimerRef.current = setTimeout(() => {
      setDialogue(null);
    }, 4500);
  };

  const toggleMinimize = (e) => {
    e.stopPropagation();
    setIsMinimized(prev => {
      const next = !prev;
      try {
        localStorage.setItem('lapen_mobao_minimized', next ? 'true' : 'false');
      } catch (_) {}
      return next;
    });
  };

  if (isMinimized) {
    return /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: toggleMinimize,
      title: "召喚書僮墨寶喵",
      className: "mobao-cat-btn text-base",
      style: { backdropFilter: 'blur(8px)' }
    }, "🐾");
  }

  return /*#__PURE__*/React.createElement("div", {
    className: "mobao-mascot-container group"
  }, 
    dialogue && /*#__PURE__*/React.createElement("div", {
      className: "mobao-dialogue-bubble font-serif"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-start justify-between gap-1 mb-1"
    }, /*#__PURE__*/React.createElement("span", {
      className: "font-bold text-xs text-[#8C5A2B] dark:text-amber-400 flex items-center gap-1"
    }, "🐾 文房書僮・墨寶"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: (e) => { e.stopPropagation(); setDialogue(null); },
      className: "text-stone-400 hover:text-stone-600 text-xs px-1 cursor-pointer"
    }, "✕")), /*#__PURE__*/React.createElement("p", {
      className: "text-xs font-medium"
    }, dialogue)),

    isSleeping && /*#__PURE__*/React.createElement("div", {
      className: "mobao-sleep-z -top-3 left-2 text-xs font-serif"
    }, "z"),
    isSleeping && /*#__PURE__*/React.createElement("div", {
      className: "mobao-sleep-z -top-6 left-5 text-sm font-serif",
      style: { animationDelay: '0.8s' }
    }, "Z"),

    /* 一鍵收起小按鈕 */
    /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: toggleMinimize,
      title: "將墨寶暫時收起為足印",
      className: "absolute -top-1 -right-1 w-4 h-4 rounded-full bg-stone-200/90 dark:bg-stone-700/90 hover:bg-stone-300 text-stone-600 dark:text-stone-300 text-[9px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition z-50 cursor-pointer shadow-sm"
    }, "✕"),

    /* 墨寶喵主體（與夜間模式UI一致之 40px x 40px 圓形圖標） */
    /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: handleMascotClick,
      title: isSleeping ? "墨寶打瞌睡中～點擊喚醒" : "點擊與文房書僮墨寶交流",
      "aria-label": "文房書僮墨寶喵",
      className: `mobao-cat-btn ${isJumping ? 'mobao-jumping' : ''}`
    }, /*#__PURE__*/React.createElement("img", {
      src: "mobao_avatar.png?v=20261113_03",
      alt: "文房書僮墨寶喵",
      className: `w-full h-full object-cover select-none pointer-events-none ${isSleeping ? 'opacity-80 scale-95' : 'scale-100'} transition-all duration-300`,
      draggable: false
    }))
  );
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render( /*#__PURE__*/React.createElement(App, null));
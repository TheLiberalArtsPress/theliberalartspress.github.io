const fs = require('fs');

global.window = { dispatchEvent: () => {} };
global.CustomEvent = class {};
require('./data.js');

const books = window.STATIC_DATA.books || [];
console.log('Total books for catalog.html:', books.length);

// 按分類整理書籍
const categories = {};
for (const b of books) {
    const cat = b.category || '學術典籍';
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(b);
}

const catKeys = Object.keys(categories);
console.log('Categories count:', catKeys.length);

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

let html = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>文史哲出版社 全館圖書總目錄（2,633冊學術典籍目錄與單書專頁索引）</title>
  <meta name="description" content="文史哲出版社創立於1971年，專注文學、歷史、哲學、藝術史、語言文字學、滿學清史研究等專業出版。此為全館2,633冊學術圖書完整總目錄、書碼、ISBN與官方定價檢索索引。">
  <meta name="keywords" content="文史哲出版社, 文史哲圖書目錄, 文史哲图书目录, 台湾文史哲出版社, 臺灣文史哲出版社, 文史哲出版社官網, 文史哲出版社官网, 文史哲學集成, 文史哲学集成, 文史哲學術叢刊, 文史哲学术丛刊, 滿文原檔, 满文原档, 莊吉發, 庄吉发, 昌彼得, 胡自逢, 廖忠俊, 二十五史人物志, 中國歷史, 中国历史, 中國文學, 中国文学, 中國哲學, 中国哲学, 國學研究, 国学研究">
  <link rel="canonical" href="https://theliberalartspress.github.io/catalog.html">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
  <style>
    :root { --primary: #8B261E; --gold: #8C5A2B; --bg: #FAF7F2; --surface: #FFFFFF; --text: #2D241E; --sub: #66584C; --border: #E8DCCE; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans TC", sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; padding-bottom: 60px; }
    header { background: var(--surface); border-bottom: 2px solid var(--gold); padding: 24px 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.04); }
    .header-inner { max-width: 1200px; margin: auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
    h1 { font-size: 24px; color: var(--primary); font-weight: 700; }
    .sub-title { font-size: 13px; color: var(--sub); margin-top: 4px; }
    .back-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; background: var(--primary); color: #FFF; text-decoration: none; border-radius: 9999px; font-size: 13px; font-weight: 600; }
    .back-btn:hover { opacity: 0.9; }
    .container { max-width: 1200px; margin: 24px auto; padding: 0 20px; }
    .search-box { margin-bottom: 20px; display: flex; gap: 10px; }
    .search-input { flex: 1; padding: 12px 16px; border: 1px solid var(--border); border-radius: 8px; font-size: 14px; background: #FFF; outline: none; }
    .search-input:focus { border-color: var(--gold); }
    .nav-cats { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 16px 20px; margin-bottom: 24px; display: flex; flex-wrap: wrap; gap: 10px; }
    .cat-pill { font-size: 13px; color: var(--gold); text-decoration: none; padding: 4px 10px; border-radius: 6px; background: rgba(140,90,43,0.08); font-weight: 500; }
    .cat-pill:hover { background: var(--gold); color: #FFF; }
    .category-section { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 24px; margin-bottom: 28px; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
    .category-title { font-size: 18px; color: var(--primary); border-left: 4px solid var(--gold); padding-left: 10px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: baseline; }
    .book-count { font-size: 12px; color: var(--sub); font-weight: normal; }
    .book-table { width: 100%; border-collapse: collapse; font-size: 13px; }
    .book-table th { background: #F5EFEB; color: var(--text); padding: 10px; text-align: left; font-weight: 600; border-bottom: 1px solid var(--border); }
    .book-table td { padding: 10px; border-bottom: 1px solid #F0E8DE; vertical-align: top; }
    .book-table tr:hover td { background: #FDFBF7; }
    .book-link { color: #8C5A2B; font-weight: 600; text-decoration: none; }
    .book-link:hover { color: var(--primary); text-decoration: underline; }
    .code-badge { font-family: monospace; font-size: 12px; color: #555; background: #EFE8DC; padding: 2px 6px; border-radius: 4px; }
    .price { color: var(--primary); font-weight: 700; }
    footer { max-width: 1200px; margin: auto; text-align: center; font-size: 12px; color: var(--sub); padding: 24px 20px; border-top: 1px solid var(--border); }
  </style>
</head>
<body>

<header>
  <div class="header-inner">
    <div>
      <h1>文史哲出版社 全館圖書總目錄</h1>
      <div class="sub-title">創立於1971年・典藏 2,633 冊學術經典 ｜ 供讀者檢索與搜尋引擎索引導航</div>
    </div>
    <a href="index.html" class="back-btn">📖 返回官方旗艦網站</a>
  </div>
</header>

<main class="container">
  <div class="search-box">
    <input type="text" id="filterInput" class="search-input" placeholder="🔍 快速篩選書名、作者、書碼或 ISBN..." oninput="filterBooks()">
  </div>

  <nav class="nav-cats">
`;

for (let i = 0; i < catKeys.length; i++) {
    const cat = catKeys[i];
    html += `    <a href="#cat-${i}" class="cat-pill">${escapeHtml(cat)} (${categories[cat].length})</a>\n`;
}

html += `  </nav>\n\n`;

for (let i = 0; i < catKeys.length; i++) {
    const cat = catKeys[i];
    const catBooks = categories[cat];
    html += `  <section class="category-section" id="cat-${i}">
    <h2 class="category-title"><span>${escapeHtml(cat)}</span><span class="book-count">共 ${catBooks.length} 冊</span></h2>
    <div style="overflow-x: auto;">
      <table class="book-table">
        <thead>
          <tr>
            <th style="width: 80px;">書碼</th>
            <th>書名（點擊直達官方單書頁面）</th>
            <th style="width: 140px;">著者</th>
            <th style="width: 150px;">ISBN</th>
            <th style="width: 90px;">定價</th>
          </tr>
        </thead>
        <tbody>
`;
    for (const b of catBooks) {
        const bookUrl = `index.html?book=${encodeURIComponent(b.id || b.title)}`;
        const isbnText = b.isbn ? escapeHtml(b.isbn) : '-';
        const priceText = b.price ? `NT$ ${b.price}` : '-';
        html += `          <tr class="book-row">
            <td><span class="code-badge">${escapeHtml(b.id || '')}</span></td>
            <td><a href="${bookUrl}" class="book-link" target="_blank">${escapeHtml(b.title || '')}</a></td>
            <td>${escapeHtml(b.author || '')}</td>
            <td style="font-family: monospace; font-size: 12px;">${isbnText}</td>
            <td><span class="price">${priceText}</span></td>
          </tr>\n`;
    }
    html += `        </tbody>
      </table>
    </div>
  </section>\n\n`;
}

html += `</main>

<footer>
  <p>文史哲出版社有限公司 ｜ 地址：100040 台北市中正區羅斯福路一段72巷4號 ｜ 電話：(02) 2351-1028 ｜ 傳真：(02) 2396-5656</p>
  <p style="margin-top: 6px;">© 1971-${new Date().getFullYear()} The Liberal Arts Press Co., Ltd. 版權所有</p>
</footer>

<script>
const S2T_MAP = {
  '满':'滿','庄':'莊','发':'發','蒋':'蔣','历':'歷','国':'國','学':'學','术':'術',
  '丛':'叢','选':'選','读':'讀','译':'譯','纪':'紀','传':'傳','图':'圖','书':'書',
  '华':'華','艺':'藝','简':'簡','谱':'譜','论':'論','经':'經','传':'傳','释':'釋',
  '诗':'詩','词':'詞','注':'註','录':'錄','考':'考','订':'訂','辑':'輯','异':'異'
};
function filterBooks() {
  let query = document.getElementById('filterInput').value.toLowerCase().trim();
  let queryTrad = query.split('').map(c => S2T_MAP[c] || c).join('');
  const rows = document.querySelectorAll('.book-row');
  rows.forEach(r => {
    const text = r.textContent.toLowerCase();
    r.style.display = (text.includes(query) || text.includes(queryTrad)) ? '' : 'none';
  });
}
</script>

</body>
</html>`;

fs.writeFileSync('catalog.html', html, 'utf8');
console.log('Successfully generated catalog.html with 2,633 books!');

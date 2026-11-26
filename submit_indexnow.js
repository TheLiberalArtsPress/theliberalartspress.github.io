const https = require('https');

const KEY = 'ab0fd8c7a3dc4ba79d4bb7ddfc9db51d';
const HOST = 'theliberalartspress.github.io';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

// 讀取書籍
global.window = { dispatchEvent: () => {} };
global.CustomEvent = class {};
require('./data.js');

const books = window.STATIC_DATA.books || [];
console.log('Total books available:', books.length);

// 組裝 URL 列表 (首頁 + 總目錄 + 分類/作者索引 + 全館靜態書頁)
const urlList = [
    `https://${HOST}/`,
    `https://${HOST}/catalog.html`,
    `https://${HOST}/categories/index.html`,
    `https://${HOST}/authors/index.html`
];

for (const b of books) {
    if (b.id) {
        const safeId = String(b.id).trim().replace(/[\\/:*?"<>|]/g, '_');
        urlList.push(`https://${HOST}/books/${encodeURIComponent(safeId)}.html`);
    }
}

console.log(`Submitting ${urlList.length} URLs to IndexNow...`);

const payload = JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urlList
});

const req = https.request({
    hostname: 'api.indexnow.org',
    port: 443,
    path: '/indexnow',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(payload)
    }
}, (res) => {
    console.log(`IndexNow Response Status: ${res.statusCode} ${res.statusMessage}`);
    res.on('data', (d) => process.stdout.write(d));
    res.on('end', () => console.log('\nSubmission completed!'));
});

req.on('error', (e) => {
    console.error('Error submitting to IndexNow:', e);
});

req.write(payload);
req.end();

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

// 組裝 URL 列表 (首頁 + catalog + 重點書籍與各書目)
const urlList = [
    `https://${HOST}/`,
    `https://${HOST}/catalog.html`,
    `https://${HOST}/?category=%E6%96%87%E5%8F%B2%E5%93%B2%E5%AD%B8%E9%9B%86%E6%88%90`,
    `https://${HOST}/?category=%E6%96%87%E5%8F%B2%E5%93%B2%E5%AD%B8%E8%A1%93%E5%8F%A2%E5%88%8A`
];

for (const b of books.slice(0, 100)) { // 優先推送前 100 筆精華典籍
    if (b.id) {
        urlList.push(`https://${HOST}/?book=${encodeURIComponent(b.id)}`);
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

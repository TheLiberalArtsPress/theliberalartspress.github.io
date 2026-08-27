const fs = require('fs');

global.window = { dispatchEvent: () => {} };
global.CustomEvent = class {};
require('./data.js');

const books = window.STATIC_DATA.books || [];
console.log('Total books for sitemap:', books.length);

function escapeXml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

const today = new Date().toISOString().split('T')[0];

let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';

// 1. Home Page
xml += '  <url>\n';
xml += '    <loc>https://theliberalartspress.github.io/</loc>\n';
xml += '    <lastmod>' + today + '</lastmod>\n';
xml += '    <changefreq>daily</changefreq>\n';
xml += '    <priority>1.0</priority>\n';
xml += '  </url>\n';

// 2. Categories
const categories = [...new Set(books.map(b => b.category).filter(Boolean))];
for (const cat of categories) {
    xml += '  <url>\n';
    xml += '    <loc>https://theliberalartspress.github.io/?category=' + encodeURIComponent(cat) + '</loc>\n';
    xml += '    <lastmod>' + today + '</lastmod>\n';
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.9</priority>\n';
    xml += '  </url>\n';
}

// 3. All 2,631 Books
for (const b of books) {
    if (!b.id) continue;
    xml += '  <url>\n';
    xml += '    <loc>https://theliberalartspress.github.io/?book=' + encodeURIComponent(b.id) + '</loc>\n';
    xml += '    <lastmod>' + today + '</lastmod>\n';
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.8</priority>\n';
    if (b.localCover || b.cover) {
        const imgUrl = b.localCover ? 'https://theliberalartspress.github.io/' + b.localCover : b.cover;
        if (imgUrl && imgUrl.startsWith('http')) {
            xml += '    <image:image>\n';
            xml += '      <image:loc>' + escapeXml(imgUrl) + '</image:loc>\n';
            xml += '      <image:title>' + escapeXml(b.title || '') + '</image:title>\n';
            xml += '    </image:image>\n';
        }
    }
    xml += '  </url>\n';
}

xml += '</urlset>\n';

fs.writeFileSync('sitemap.xml', xml, 'utf8');
console.log('Successfully generated sitemap.xml with', books.length + categories.length + 1, 'URLs!');

const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://theliberalartspress.github.io/sitemap.xml
`;
fs.writeFileSync('robots.txt', robotsTxt, 'utf8');
console.log('Successfully generated robots.txt!');

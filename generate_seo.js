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

function cleanImageUrl(rawUrl, localCover) {
    if (localCover) {
        return 'https://theliberalartspress.github.io/' + localCover;
    }
    if (!rawUrl || typeof rawUrl !== 'string') return null;
    const trimmed = rawUrl.trim();
    if (!trimmed.startsWith('http')) return null;

    // Convert Google Drive view/share links to direct image thumbnails for Google Images compliance
    const driveMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (driveMatch && driveMatch[1]) {
        return 'https://lh3.googleusercontent.com/d/' + driveMatch[1];
    }
    const driveIdMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (trimmed.includes('drive.google.com') && driveIdMatch && driveIdMatch[1]) {
        return 'https://lh3.googleusercontent.com/d/' + driveIdMatch[1];
    }
    return trimmed;
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

// 1.1 Catalog Page (全館 2,633 冊總目錄靜態地圖)
xml += '  <url>\n';
xml += '    <loc>https://theliberalartspress.github.io/catalog.html</loc>\n';
xml += '    <lastmod>' + today + '</lastmod>\n';
xml += '    <changefreq>weekly</changefreq>\n';
xml += '    <priority>0.95</priority>\n';
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

// 3. All Books
for (const b of books) {
    if (!b.id) continue;
    xml += '  <url>\n';
    xml += '    <loc>https://theliberalartspress.github.io/?book=' + encodeURIComponent(b.id) + '</loc>\n';
    xml += '    <lastmod>' + today + '</lastmod>\n';
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.8</priority>\n';
    
    const validImg = cleanImageUrl(b.cover, b.localCover);
    if (validImg) {
        xml += '    <image:image>\n';
        xml += '      <image:loc>' + escapeXml(validImg) + '</image:loc>\n';
        xml += '      <image:title>' + escapeXml(b.title || '') + '</image:title>\n';
        xml += '    </image:image>\n';
    }
    xml += '  </url>\n';
}

xml += '</urlset>\n';

// Write all three aliases so GSC and bots never get 404 regardless of which URL was submitted
fs.writeFileSync('sitemap.xml', xml, 'utf8');
fs.writeFileSync('sitemap-books.xml', xml, 'utf8');
fs.writeFileSync('sitemap-All.xml', xml, 'utf8');
console.log('Successfully generated sitemap.xml, sitemap-books.xml, and sitemap-All.xml with', books.length + categories.length + 1, 'URLs!');

const robotsTxt = `User-agent: *
Allow: /

User-agent: Baiduspider
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

Sitemap: https://theliberalartspress.github.io/sitemap.xml
Sitemap: https://theliberalartspress.github.io/sitemap-books.xml
Sitemap: https://theliberalartspress.github.io/sitemap-All.xml
`;
fs.writeFileSync('robots.txt', robotsTxt, 'utf8');
console.log('Successfully generated robots.txt with Baiduspider, Googlebot, and Bingbot permissions!');

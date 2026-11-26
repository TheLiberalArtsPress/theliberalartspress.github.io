#!/usr/bin/env python3
"""Regenerate static SEO pages (books/, categories/, authors/, catalog.html) and split sitemaps from data.js."""

import hashlib
import html
import json
import os
import re
from datetime import date
from urllib.parse import quote

BASE_URL = "https://theliberalartspress.github.io"
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_JS_PATH = os.path.join(ROOT_DIR, "data.js")


def load_books():
    with open(DATA_JS_PATH, "r", encoding="utf-8") as f:
        raw = f.read().strip()
    prefix = "window.STATIC_DATA"
    idx = raw.find("=")
    if idx == -1 or not raw.startswith(prefix):
        raise ValueError("Unexpected data.js format")
    json_str = raw[idx + 1 :].lstrip()
    data, _ = json.JSONDecoder().raw_decode(json_str)
    return data.get("books", [])


def sha1_8(text: str) -> str:
    return hashlib.sha1(text.encode("utf-8")).hexdigest()[:8]


def clean_author_name(author: str) -> str:
    if not author:
        return "文史哲編輯部"
    s = re.sub(r"[\s\u3000]+", "", str(author))
    s = re.sub(r"(等著|編著|主編|譯注|校注|注譯|編譯|編|著|譯)$", "", s)
    return s or str(author).strip()


def cover_rel_path(book: dict) -> str:
    bid = str(book.get("id", "")).strip()
    local = str(book.get("localCover", "")).strip()
    if local:
        return local.lstrip("/")
    return f"assets/covers/{bid}.webp"


def cover_abs_url(book: dict) -> str:
    rel = cover_rel_path(book)
    if rel.startswith("http"):
        return rel
    return f"{BASE_URL}/{rel}"


def esc(val) -> str:
    return html.escape("" if val is None else str(val), quote=True)


def safe_filename(bid: str) -> str:
    return re.sub(r'[\\/:*?"<>|]', "_", str(bid).strip())


def write_text(rel_path: str, content: str):
    full = os.path.join(ROOT_DIR, rel_path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8", newline="\n") as f:
        f.write(content)


def build_book_page(book: dict, cat_slug: str, author_slug: str, author_clean: str, author_count: int, related: list) -> str:
    bid = str(book.get("id", "")).strip()
    title = str(book.get("title", "")).strip()
    author_raw = str(book.get("author", "")).strip() or "文史哲編輯部"
    year = str(book.get("year", "")).strip()
    price = book.get("price", 0)
    try:
        price_num = int(float(price))
    except (TypeError, ValueError):
        price_num = 0
    isbn = str(book.get("isbn", "")).strip()
    cat = str(book.get("category", "")).strip() or "學術典籍"
    intro = str(book.get("intro", "")).strip()
    review = str(book.get("心得", "")).strip()
    stock = str(book.get("stock", "")).strip()
    in_stock = stock != "0" and stock != "已售罄"

    rel_cov = cover_rel_path(book)
    abs_cov = cover_abs_url(book)
    page_url = f"{BASE_URL}/books/{quote(safe_filename(bid))}.html"
    fallback_jpg = f"../assets/covers/{safe_filename(bid)}.jpg"
    img_src = rel_cov if rel_cov.startswith("http") else f"../{rel_cov}"

    desc_raw = f"《{title}》（{author_raw}）｜文史哲出版社・{cat}"
    if isbn:
        desc_raw += f"｜ISBN: {isbn}"
    desc_raw += f"｜定價 NT$ {price_num}。"
    if intro:
        desc_raw += intro[:120]

    ld_graph = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Book",
                "@id": f"{page_url}#book",
                "name": title,
                "url": page_url,
                "author": {"@type": "Person", "name": author_clean},
                "publisher": {
                    "@type": "Organization",
                    "name": "文史哲出版社有限公司",
                    "url": f"{BASE_URL}/",
                },
                "inLanguage": "zh-Hant",
                "bookFormat": "https://schema.org/Paperback",
                "image": abs_cov,
                "description": intro or desc_raw,
                "genre": cat,
                "offers": {
                    "@type": "Offer",
                    "price": str(price_num),
                    "priceCurrency": "TWD",
                    "availability": "https://schema.org/InStock" if in_stock else "https://schema.org/OutOfStock",
                    "url": f"{BASE_URL}/?book={quote(bid)}",
                },
                **({"isbn": isbn} if isbn else {}),
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {"@type": "ListItem", "position": 1, "name": "文史哲首頁", "item": f"{BASE_URL}/"},
                    {"@type": "ListItem", "position": 2, "name": "全館圖書總目錄", "item": f"{BASE_URL}/catalog.html"},
                    {"@type": "ListItem", "position": 3, "name": title, "item": page_url},
                ],
            },
        ],
    }

    rel_cards = "".join(
        f'<a href="{quote(safe_filename(str(rb.get("id", ""))))}.html" class="rel-card">'
        f'<div class="rel-title">{esc(rb.get("title", ""))}</div>'
        f'<div class="rel-meta">{esc(rb.get("author", ""))} · NT$ {esc(rb.get("price", 0))}</div></a>'
        for rb in related
    )
    related_html = (
        f'<details class="related-box"><summary><span>📖 查看同分類〈{esc(cat)}〉其他精選典籍 ({len(related)}本)</span>'
        f'<span class="exp-txt">展開 ▾</span></summary><div class="rel-grid">{rel_cards}</div></details>'
        if related
        else ""
    )

    review_html = (
        f'<div class="inset-box review-box"><div class="box-title">✦ 讀後心得與學術評析：</div><p>{esc(review)}</p></div>'
        if review
        else ""
    )

    cite_text = f"{author_clean}。《{title}》。台北：文史哲出版社，{year}。".replace("'", "\\'")
    q_title = quote(title)
    q_author = quote(author_clean)
    q_page = quote(page_url, safe=":")

    return f"""<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>《{esc(title)}》- {esc(author_raw)}｜文史哲出版社</title>
<meta name="description" content="{esc(desc_raw)}">
<meta name="keywords" content="{esc(title)}, {esc(author_clean)}, {esc(isbn)}, {esc(cat)}, 文史哲出版社">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<link rel="icon" type="image/png" href="../mobao_avatar.png">
<link rel="canonical" href="{esc(page_url)}">
<meta property="og:type" content="book">
<meta property="og:title" content="《{esc(title)}》- {esc(author_raw)}｜文史哲出版社">
<meta property="og:description" content="{esc(intro[:200] if intro else desc_raw)}">
<meta property="og:url" content="{esc(page_url)}">
<meta property="og:image" content="{esc(abs_cov)}">
<meta property="og:site_name" content="文史哲出版社">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="《{esc(title)}》｜文史哲出版社">
<meta name="twitter:description" content="{esc(intro[:160] if intro else desc_raw)}">
<meta name="twitter:image" content="{esc(abs_cov)}">
<meta name="citation_title" content="{esc(title)}">
<meta name="citation_author" content="{esc(author_clean)}">
<meta name="citation_publisher" content="文史哲出版社有限公司">
<meta name="citation_language" content="zh-TW">
{f'<meta name="citation_isbn" content="{esc(isbn)}">' if isbn else ''}
<script type="application/ld+json">{json.dumps(ld_graph, ensure_ascii=False)}</script>
<style>
*{{box-sizing:border-box;margin:0;padding:0}}
body{{min-height:100vh;background:radial-gradient(circle at top,#2a2119 0%,#120e0b 75%);color:#efe7dc;font-family:-apple-system,BlinkMacSystemFont,"Noto Sans TC","Microsoft JhengHei",sans-serif;line-height:1.65;padding:24px 16px}}
.wrap{{max-width:860px;margin:0 auto}}
.modal{{background:#1c1713;border:1px solid #352b22;border-radius:16px;box-shadow:0 24px 60px rgba(0,0,0,.65);overflow:hidden}}
.modal-head{{display:flex;justify-content:space-between;align-items:center;padding:14px 22px;border-bottom:1px solid #2e251e;background:#201a15}}
.head-title{{display:flex;align-items:center;gap:8px;color:#e09f4c;font-weight:700;font-size:15px}}
.head-actions{{display:flex;align-items:center;gap:14px;font-size:13px}}
.head-actions a{{color:#b9ab9b;text-decoration:none}}
.head-actions a:hover{{color:#f5efe6}}
.modal-body{{padding:24px;display:flex;gap:24px}}
.cover-col{{flex:0 0 230px}}
.cover-frame{{background:#14100d;border:1px solid #352b22;border-radius:12px;padding:12px;text-align:center}}
.cover-frame img{{width:100%;max-width:206px;border-radius:6px;display:block;margin:0 auto;box-shadow:0 8px 20px rgba(0,0,0,.45)}}
.info-col{{flex:1;min-width:0}}
h1{{font-family:"Noto Serif TC","PMingLiU",Georgia,serif;font-size:24px;color:#f7f1e8;line-height:1.35;margin-bottom:14px}}
.meta-grid{{display:grid;grid-template-columns:1fr 1fr;gap:10px 18px;padding-bottom:14px;margin-bottom:14px;border-bottom:1px solid #2e251e;font-size:13.5px}}
.meta-row{{display:flex;align-items:center;gap:6px;flex-wrap:wrap;color:#b7aa9b}}
.meta-val{{color:#efe7dc}}
.pill-author{{display:inline-flex;align-items:center;gap:4px;background:#202b3c;color:#93c5fd;border:1px solid #2e405b;padding:2px 10px;border-radius:999px;font-size:12px;text-decoration:none}}
.pill-author:hover{{background:#28364c}}
.pill-cat{{display:inline-block;background:#203044;color:#cbd5e1;border:1px solid #334a66;padding:2px 10px;border-radius:999px;font-size:12px;text-decoration:none}}
.pill-cat:hover{{border-color:#e09f4c;color:#fff}}
.price{{color:#e04f3e;font-size:20px;font-weight:700}}
.mono{{font-family:ui-monospace,SFMono-Regular,Consolas,monospace;color:#dcd2c6}}
.inset-box{{background:#14100d;border:1px solid #2d241d;border-radius:10px;padding:13px 15px;margin-bottom:12px}}
.box-title{{font-size:12.5px;color:#b9ab9b;margin-bottom:6px;font-weight:600}}
.inset-box p{{font-size:13.5px;color:#dcd2c6;white-space:pre-line;line-height:1.75}}
.review-box .box-title{{color:#e09f4c}}
.review-box p{{font-family:"Noto Serif TC",Georgia,serif;font-style:italic;color:#cfc3b4}}
.kb-box{{background:#14100d;border:1px solid #2d241d;border-radius:10px;padding:12px 15px}}
.kb-links{{display:flex;flex-wrap:wrap;gap:7px;margin-top:8px}}
.kb-btn{{display:inline-flex;align-items:center;gap:4px;background:#f1f5f9;color:#1e293b;padding:4px 10px;border-radius:999px;font-size:12px;font-weight:600;text-decoration:none}}
.kb-btn.dark{{background:#241d18;color:#e5dacb;border:1px solid #3d3127}}
.kb-btn:hover{{opacity:.9}}
.related-box{{margin:0 24px 14px;background:#14100d;border:1px solid #2d241d;border-radius:10px;padding:10px 14px}}
.related-box summary{{display:flex;justify-content:space-between;align-items:center;cursor:pointer;font-size:13px;color:#e09f4c;font-weight:600;list-style:none}}
.related-box summary::-webkit-details-marker{{display:none}}
.exp-txt{{font-size:12px;color:#b7aa9b}}
.rel-grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(175px,1fr));gap:10px;margin-top:12px}}
.rel-card{{display:block;background:#1c1713;border:1px solid #352b22;border-radius:8px;padding:10px;text-decoration:none}}
.rel-card:hover{{border-color:#e09f4c}}
.rel-title{{font-size:13px;font-weight:600;color:#f5efe6;margin-bottom:4px}}
.rel-meta{{font-size:11.5px;color:#a89b8c}}
.share-bar{{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;padding:12px 24px;border-top:1px solid #2e251e;font-size:12.5px;color:#a89b8c}}
.share-btns{{display:flex;gap:8px;flex-wrap:wrap}}
.s-btn{{display:inline-flex;align-items:center;gap:4px;padding:5px 11px;border-radius:999px;font-size:12px;font-weight:600;text-decoration:none;border:1px solid #3a2f26;background:#241d18;color:#e5dacb;cursor:pointer}}
.s-btn.line{{background:#06c755;border-color:#06c755;color:#fff}}
.s-btn.fb{{background:#1877f2;border-color:#1877f2;color:#fff}}
.cta-bar{{display:grid;grid-template-columns:1fr 1fr;gap:14px;padding:14px 24px 20px;border-top:1px solid #2e251e;background:#181310}}
.cta-sec{{display:flex;align-items:center;justify-content:center;gap:6px;padding:12px;border-radius:10px;border:1px solid #3e3228;background:#211a15;color:#e5dacb;text-decoration:none;font-size:14px;font-weight:600}}
.cta-sec:hover{{border-color:#e09f4c;color:#f6c987}}
.cta-pri{{display:flex;align-items:center;justify-content:center;gap:8px;padding:12px;border-radius:10px;background:#e09f4c;color:#1c140d;text-decoration:none;font-size:15px;font-weight:700}}
.cta-pri:hover{{background:#eab065}}
.site-foot{{text-align:center;margin-top:18px;font-size:12px;color:#8e8072}}
.site-foot a{{color:#c7a477;text-decoration:none}}
@media(max-width:700px){{
  .modal-body{{flex-direction:column;padding:18px}}
  .cover-col{{flex:none}}
  .meta-grid{{grid-template-columns:1fr}}
  .cta-bar{{grid-template-columns:1fr}}
  .related-box{{margin:0 18px 14px}}
}}
</style>
</head>
<body>
<div class="wrap">
  <article class="modal">
    <div class="modal-head">
      <div class="head-title">📖 圖書詳細資訊</div>
      <div class="head-actions">
        <a href="../catalog.html">📚 全館總目錄</a>
        <a href="../index.html">✕ 返回首頁</a>
      </div>
    </div>
    <div class="modal-body">
      <div class="cover-col">
        <div class="cover-frame">
          <img src="{esc(img_src)}" alt="{esc(title)}" onerror="this.onerror=null;this.src='{esc(fallback_jpg)}';">
        </div>
      </div>
      <div class="info-col">
        <h1>{esc(title)}</h1>
        <div class="meta-grid">
          <div class="meta-row"><span>作者：</span><a class="pill-author" href="../authors/{author_slug}.html">👤 {esc(author_raw)} (全館{author_count}冊 ↗)</a></div>
          <div class="meta-row"><span>年份：</span><span class="meta-val">{esc(year)}</span></div>
          <div class="meta-row"><span>分類：</span><a class="pill-cat" href="../categories/{cat_slug}.html">{esc(cat)}</a></div>
          <div class="meta-row"><span>書碼：</span><span class="mono">{esc(bid)}</span></div>
          <div class="meta-row"><span>定價：</span><span class="price">NT$ {price_num}</span></div>
          <div class="meta-row"><span>ISBN：</span><span class="mono">{esc(isbn or '—')}</span></div>
        </div>
        <div class="inset-box">
          <div class="box-title">📖 書籍簡介：</div>
          <p>{esc(intro or desc_raw)}</p>
        </div>
        {review_html}
        <div class="kb-box">
          <div class="box-title">🏛 權威文獻與關聯知識庫：</div>
          <div class="kb-links">
            <a class="kb-btn" target="_blank" rel="noopener" href="https://zh.wikipedia.org/w/index.php?search={q_title}">🌐 維基百科（條目）</a>
            <a class="kb-btn" target="_blank" rel="noopener" href="https://zh.wikipedia.org/w/index.php?search={q_author}">👤 作者維基（{esc(author_clean)}）</a>
            <a class="kb-btn dark" href="../authors/{author_slug}.html">📚 本館收錄該學者著作 ({author_count}本)</a>
            <a class="kb-btn" target="_blank" rel="noopener" href="https://scholar.google.com/scholar?q={q_title}">🎓 Google 學術搜尋</a>
            <a class="kb-btn dark" target="_blank" rel="noopener" href="https://aleweb.ncl.edu.tw/F/?func=find-b&amp;find_code=WRD&amp;request={q_title}">🏛 國家圖書館館藏</a>
            <a class="kb-btn" target="_blank" rel="noopener" href="https://www.google.com/search?tbm=bks&amp;q={q_title}">📖 Google 圖書</a>
          </div>
        </div>
      </div>
    </div>
    {related_html}
    <div class="share-bar">
      <span>🔗 分享此書：</span>
      <div class="share-btns">
        <button type="button" class="s-btn" id="wishBtn" onclick="toggleWish(this)">♡ 收藏</button>
        <button type="button" class="s-btn" onclick="copyText('{cite_text}',this)">🎓 論文引用</button>
        <button type="button" class="s-btn" onclick="copyText('{esc(page_url)}',this)">🔗 複製連結</button>
        <a class="s-btn line" target="_blank" rel="noopener" href="https://social-plugins.line.me/lineit/share?url={q_page}">💬 LINE</a>
        <a class="s-btn fb" target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u={q_page}">📘 FB</a>
      </div>
    </div>
    <div class="cta-bar">
      <a href="../index.html?book={quote(bid)}" class="cta-sec">💬 讀後心得交流</a>
      <a href="../index.html?book={quote(bid)}&amp;add=1" class="cta-pri">🛒 一鍵加入書包</a>
    </div>
  </article>
  <footer class="site-foot">
    文史哲出版社有限公司 ｜ 創立於1971年 ｜ <a href="../index.html">官方首頁</a> ｜ <a href="../catalog.html">全館圖書總目錄</a> ｜ lapentw@gmail.com
  </footer>
</div>
<script>
function copyText(t,btn){{if(navigator.clipboard){{navigator.clipboard.writeText(t).then(function(){{var o=btn.textContent;btn.textContent='✓ 已複製';setTimeout(function(){{btn.textContent=o;}},1500);}});}}}}
function getBookMeta(){{
  var ld={{}};
  try{{var s=document.querySelector('script[type="application/ld+json"]');if(s){{var d=JSON.parse(s.textContent);ld=(d['@graph']&&d['@graph'][0])||d;}}}}catch(e){{}}
  var idMatch=location.pathname.match(/\\/([^\\/]+)\\.html$/);
  var bid=(idMatch?idMatch[1]:'');
  var title=ld.name||(document.querySelector('h1')&&document.querySelector('h1').textContent.trim())||'';
  var author=(ld.author&&ld.author.name)||'';
  var cat=ld.genre||'';
  var price=Number((ld.offers&&ld.offers.price)||0);
  var img=document.querySelector('.cover-frame img');
  var cover=img?img.getAttribute('src').replace(/^\\.\\.\\//,''):('assets/covers/'+bid+'.webp');
  return {{id:bid,title:title,author:author,category:cat,price:price,cover:cover,savedAt:Date.now()}};
}}
function updateWishBtn(){{
  var btn=document.getElementById('wishBtn');
  if(!btn)return;
  var meta=getBookMeta();
  var list=[];
  try{{list=JSON.parse(localStorage.getItem('lapen_wishlist')||'[]');}}catch(e){{}}
  var saved=list.some(function(x){{return String(x.id)===String(meta.id);}});
  btn.textContent=saved?'♥ 已收藏':'♡ 收藏';
  btn.style.background=saved?'#E11D48':'';
  btn.style.color=saved?'#FFFFFF':'';
  btn.style.borderColor=saved?'#E11D48':'';
}}
function toggleWish(btn){{
  var meta=getBookMeta();
  if(!meta.id)return;
  var list=[];
  try{{list=JSON.parse(localStorage.getItem('lapen_wishlist')||'[]');}}catch(e){{}}
  var idx=list.findIndex(function(x){{return String(x.id)===String(meta.id);}});
  if(idx>=0){{list.splice(idx,1);}}else{{list.unshift(meta);}}
  try{{localStorage.setItem('lapen_wishlist',JSON.stringify(list));}}catch(e){{}}
  updateWishBtn();
}}
document.addEventListener('DOMContentLoaded',updateWishBtn);
</script>
</body>
</html>"""


def build_collection_page(kind: str, name: str, slug: str, items: list) -> str:
    is_cat = kind == "category"
    folder = "categories" if is_cat else "authors"
    page_url = f"{BASE_URL}/{folder}/{slug}.html"
    sample_titles = "、".join(str(b.get("title", "")) for b in items[:4])
    count = len(items)
    if is_cat:
        title = f"〈{name}〉書系全集（共 {count} 冊）｜文史哲出版社"
        desc = f"文史哲出版社〈{name}〉書系共收錄 {count} 冊學術典籍，包含《{sample_titles}》等專業著作。"
        h1 = f"〈{name}〉"
        sub = f"本系列共收錄 <strong style=\"color:#e09f4c\">{count}</strong> 冊專業學術典籍"
        cta_href = f"../index.html?category={quote(name)}"
        cta_txt = "🔍 在主站開啟此書系篩選"
        parent_name = "全館書系總覽"
        brand = "📚 文史哲出版社｜書系典藏"
    else:
        title = f"{name} 著作全集（共 {count} 冊）｜文史哲出版社"
        desc = f"文史哲出版社〈{name}〉學者著作專頁，全館共收錄 {count} 冊學術典籍，包含《{sample_titles}》等。"
        h1 = name
        sub = f"本館共收錄 <strong style=\"color:#e09f4c\">{count}</strong> 冊著作"
        cta_href = f"../index.html?author={quote(name)}"
        cta_txt = "🔍 在主站搜尋此作者"
        parent_name = "學者作者名錄"
        brand = "👤 文史哲出版社｜學者專頁"

    cards = []
    for b in items:
        bid = str(b.get("id", "")).strip()
        sf = quote(safe_filename(bid))
        rel_cov = cover_rel_path(b)
        img_src = rel_cov if rel_cov.startswith("http") else f"../{rel_cov}"
        fb = f"../assets/covers/{safe_filename(bid)}.jpg"
        cards.append(
            f'<a class="b-card" href="../books/{sf}.html">'
            f'<div class="b-thumb"><img loading="lazy" src="{esc(img_src)}" alt="{esc(b.get("title", ""))}" onerror="this.onerror=null;this.src=\'{esc(fb)}\';"></div>'
            f'<div class="b-title">{esc(b.get("title", ""))}</div>'
            f'<div class="b-meta">{esc(b.get("author", ""))} · {esc(b.get("year", ""))}</div>'
            f'<div class="b-price">NT$ {esc(b.get("price", 0))}</div></a>'
        )

    ld = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CollectionPage" if is_cat else "ProfilePage",
                "@id": f"{page_url}#{'collection' if is_cat else 'profile'}",
                "name": f"{name}｜文史哲出版社",
                "url": page_url,
                "description": desc,
                **({"numberOfItems": count} if is_cat else {"mainEntity": {"@type": "Person", "name": name}}),
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {"@type": "ListItem", "position": 1, "name": "文史哲首頁", "item": f"{BASE_URL}/"},
                    {"@type": "ListItem", "position": 2, "name": parent_name, "item": f"{BASE_URL}/{folder}/index.html"},
                    {"@type": "ListItem", "position": 3, "name": name, "item": page_url},
                ],
            },
        ],
    }

    return f"""<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="icon" type="image/png" href="../mobao_avatar.png">
<link rel="canonical" href="{esc(page_url)}">
<meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(desc)}">
<meta property="og:url" content="{esc(page_url)}">
<meta property="og:image" content="{BASE_URL}/og-image.jpg">
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
<style>
*{{box-sizing:border-box;margin:0;padding:0}}
body{{min-height:100vh;background:radial-gradient(circle at top,#2a2119 0%,#120e0b 75%);color:#efe7dc;font-family:-apple-system,BlinkMacSystemFont,"Noto Sans TC","Microsoft JhengHei",sans-serif;line-height:1.6;padding:20px 16px}}
.wrap{{max-width:1080px;margin:0 auto}}
.topbar{{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;padding:14px 20px;background:#1c1713;border:1px solid #352b22;border-radius:14px;margin-bottom:18px}}
.brand{{color:#e09f4c;font-weight:700;text-decoration:none;font-size:15px}}
.nav a{{color:#b9ab9b;text-decoration:none;font-size:13px;margin-left:14px}}
.nav a:hover{{color:#f5efe6}}
.hero{{background:#1c1713;border:1px solid #352b22;border-radius:16px;padding:24px;margin-bottom:20px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px}}
.hero h1{{font-family:"Noto Serif TC",Georgia,serif;font-size:26px;color:#f7f1e8;margin-bottom:6px}}
.hero p{{font-size:13.5px;color:#b7aa9b}}
.cta{{display:inline-block;background:#e09f4c;color:#1c140d;padding:10px 18px;border-radius:10px;text-decoration:none;font-weight:700;font-size:13.5px}}
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(175px,1fr));gap:14px}}
.b-card{{display:flex;flex-direction:column;background:#1c1713;border:1px solid #352b22;border-radius:12px;padding:12px;text-decoration:none;color:inherit}}
.b-card:hover{{border-color:#e09f4c}}
.b-thumb{{aspect-ratio:3/4;background:#14100d;border-radius:8px;overflow:hidden;display:flex;align-items:center;justify-content:center;margin-bottom:10px}}
.b-thumb img{{width:100%;height:100%;object-fit:contain}}
.b-title{{font-size:14px;font-weight:600;color:#f5efe6;margin-bottom:4px;line-height:1.4}}
.b-meta{{font-size:12px;color:#a89b8c;margin-bottom:6px}}
.b-price{{margin-top:auto;font-size:14px;font-weight:700;color:#e04f3e}}
footer{{text-align:center;margin-top:26px;font-size:12px;color:#8e8072}}
footer a{{color:#c7a477;text-decoration:none}}
</style>
</head>
<body>
<div class="wrap">
  <header class="topbar">
    <a class="brand" href="../index.html">{brand}</a>
    <nav class="nav">
      <a href="index.html">{parent_name}</a>
      <a href="../catalog.html">全館總目錄</a>
      <a href="../index.html">返回首頁</a>
    </nav>
  </header>
  <section class="hero">
    <div>
      <h1>{esc(h1)}</h1>
      <p>{sub}</p>
    </div>
    <a class="cta" href="{cta_href}">{cta_txt}</a>
  </section>
  <main class="grid">{''.join(cards)}</main>
  <footer>文史哲出版社有限公司 ｜ <a href="../index.html">官方首頁</a> ｜ <a href="../catalog.html">全館圖書總目錄</a></footer>
</div>
</body>
</html>"""


def build_index_page(kind: str, groups: list, total_books: int) -> str:
    is_cat = kind == "category"
    folder = "categories" if is_cat else "authors"
    heading = f"📚 全館書系分類總覽（{len(groups)} 系列）" if is_cat else f"👤 學者作者名錄（{len(groups)} 位）"
    title = f"全館書系分類總覽（共 {len(groups)} 系列）｜文史哲出版社" if is_cat else f"學者作者名錄（共 {len(groups)} 位）｜文史哲出版社"
    placeholder = "🔍 搜尋書系分類名稱…" if is_cat else "🔍 搜尋作者姓名…"
    cards = "".join(
        f'<a class="c-card" href="{slug}.html"><div class="c-name">{esc(name)}</div><div class="c-cnt">{len(items)} 冊</div></a>'
        for name, slug, items in groups
    )
    return f"""<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{esc(title)}</title>
<meta name="description" content="文史哲出版社全館 {total_books} 冊學術典籍索引。">
<meta name="robots" content="index, follow">
<link rel="icon" type="image/png" href="../mobao_avatar.png">
<link rel="canonical" href="{BASE_URL}/{folder}/index.html">
<style>
*{{box-sizing:border-box;margin:0;padding:0}}
body{{min-height:100vh;background:radial-gradient(circle at top,#2a2119 0%,#120e0b 75%);color:#efe7dc;font-family:-apple-system,BlinkMacSystemFont,"Noto Sans TC","Microsoft JhengHei",sans-serif;padding:24px 16px}}
.wrap{{max-width:980px;margin:0 auto}}
.head{{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:20px;padding:16px 20px;background:#1c1713;border:1px solid #352b22;border-radius:14px}}
h1{{font-family:"Noto Serif TC",Georgia,serif;font-size:22px;color:#f7f1e8}}
.links a{{color:#e09f4c;text-decoration:none;font-size:13.5px;margin-left:14px}}
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px}}
.c-card{{display:flex;justify-content:space-between;align-items:center;background:#1c1713;border:1px solid #352b22;border-radius:10px;padding:14px 16px;text-decoration:none;color:#efe7dc}}
.c-card:hover{{border-color:#e09f4c;color:#f6c987}}
.c-name{{font-weight:600;font-size:14px}}
.c-cnt{{font-size:12px;color:#e09f4c;background:#2a2119;padding:2px 8px;border-radius:999px;white-space:nowrap}}
.idx-bar{{display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between;background:#1c1713;border:1px solid #352b22;border-radius:12px;padding:10px 14px;margin-bottom:16px}}
.idx-input{{flex:1;min-width:220px;max-width:420px;background:#14100d;color:#efe7dc;border:1px solid #3d3127;border-radius:8px;padding:8px 12px;font-size:13.5px;outline:none}}
.idx-input:focus{{border-color:#e09f4c}}
.idx-cnt{{font-size:12.5px;color:#b7aa9b}}
</style>
</head>
<body>
<div class="wrap">
  <header class="head">
    <h1>{esc(heading)}</h1>
    <div class="links"><a href="../catalog.html">全館書目總表</a><a href="../index.html">返回首頁</a></div>
  </header>
  <div class="idx-bar"><input type="search" id="idxSearch" class="idx-input" placeholder="{esc(placeholder)}"><span id="idxCount" class="idx-cnt"></span></div>
  <main class="grid">{cards}</main>
</div>
<script>
(function(){{
  var inp=document.getElementById('idxSearch'),cnt=document.getElementById('idxCount');
  var cards=Array.prototype.slice.call(document.querySelectorAll('main.grid .c-card'));
  function norm(s){{return (s||'').toLowerCase().replace(/[\\s\\u3000]+/g,'').replace(/台/g,'臺');}}
  function run(){{
    var q=norm(inp?inp.value:''),shown=0;
    cards.forEach(function(c){{
      var n=c.querySelector('.c-name');
      var ok=!q||norm(n?n.textContent:c.textContent).indexOf(q)!==-1;
      c.style.display=ok?'':'none';
      if(ok)shown++;
    }});
    if(cnt)cnt.textContent='顯示 '+shown+' / '+cards.length+' 筆';
  }}
  if(inp)inp.addEventListener('input',run);
  run();
}})();
</script>
</body>
</html>"""


def build_catalog_html(cat_groups: list, total_books: int) -> str:
    pills = "".join(
        f'<a class="cat-pill" href="#cat-{slug}">{esc(name)} ({len(items)})</a>'
        for name, slug, items in cat_groups
    )
    sections = []
    for name, slug, items in cat_groups:
        rows = []
        for b in items:
            bid = str(b.get("id", "")).strip()
            sf = quote(safe_filename(bid))
            rows.append(
                f'<tr><td><span class="code-badge">{esc(bid)}</span></td>'
                f'<td><a class="book-link" href="books/{sf}.html">{esc(b.get("title", ""))}</a></td>'
                f'<td>{esc(b.get("author", ""))}</td>'
                f'<td>{esc(b.get("year", ""))}</td>'
                f'<td class="price">NT$ {esc(b.get("price", 0))}</td>'
                f'<td>{esc(b.get("isbn", "") or "—")}</td></tr>'
            )
        sections.append(
            f'<section class="category-section" id="cat-{slug}">'
            f'<h2 class="category-title"><span>{esc(name)}</span><span class="book-count">共 {len(items)} 冊</span></h2>'
            f'<table class="book-table"><thead><tr><th>書碼</th><th>書名</th><th>作者</th><th>出版年</th><th>定價</th><th>ISBN</th></tr></thead>'
            f'<tbody>{"".join(rows)}</tbody></table></section>'
        )

    return f"""<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>文史哲出版社 全館圖書總目錄（{total_books}冊學術典籍目錄與單書專頁索引）</title>
  <meta name="description" content="文史哲出版社創立於1971年，全館{total_books}冊學術圖書完整總目錄、書碼、ISBN與官方定價檢索索引。">
  <link rel="canonical" href="{BASE_URL}/catalog.html">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
  <style>
    :root {{ --primary: #8B261E; --gold: #8C5A2B; --bg: #FAF7F2; --surface: #FFFFFF; --text: #2D241E; --sub: #66584C; --border: #E8DCCE; }}
    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans TC", sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; padding-bottom: 60px; }}
    header {{ background: var(--surface); border-bottom: 2px solid var(--gold); padding: 24px 20px; }}
    .header-inner {{ max-width: 1200px; margin: auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }}
    h1 {{ font-size: 24px; color: var(--primary); font-weight: 700; }}
    .sub-title {{ font-size: 13px; color: var(--sub); margin-top: 4px; }}
    .back-btn {{ display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; background: var(--primary); color: #FFF; text-decoration: none; border-radius: 9999px; font-size: 13px; font-weight: 600; }}
    .container {{ max-width: 1200px; margin: 24px auto; padding: 0 20px; }}
    .search-box {{ margin-bottom: 20px; display: flex; gap: 10px; }}
    .search-input {{ flex: 1; padding: 12px 16px; border: 1px solid var(--border); border-radius: 8px; font-size: 14px; background: #FFF; outline: none; }}
    .nav-cats {{ background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 16px 20px; margin-bottom: 24px; display: flex; flex-wrap: wrap; gap: 10px; }}
    .cat-pill {{ font-size: 13px; color: var(--gold); text-decoration: none; padding: 4px 10px; border-radius: 6px; background: rgba(140,90,43,0.08); font-weight: 500; }}
    .category-section {{ background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 24px; margin-bottom: 28px; overflow-x: auto; }}
    .category-title {{ font-size: 18px; color: var(--primary); border-left: 4px solid var(--gold); padding-left: 10px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: baseline; }}
    .book-count {{ font-size: 12px; color: var(--sub); font-weight: normal; }}
    .book-table {{ width: 100%; border-collapse: collapse; font-size: 13px; }}
    .book-table th {{ background: #F5EFEB; padding: 10px; text-align: left; border-bottom: 1px solid var(--border); }}
    .book-table td {{ padding: 10px; border-bottom: 1px solid #F0E8DE; vertical-align: top; }}
    .book-link {{ color: #8C5A2B; font-weight: 600; text-decoration: none; }}
    .book-link:hover {{ color: var(--primary); text-decoration: underline; }}
    .code-badge {{ font-family: monospace; font-size: 12px; color: #555; background: #EFE8DC; padding: 2px 6px; border-radius: 4px; }}
    .price {{ color: var(--primary); font-weight: 700; white-space: nowrap; }}
    footer {{ max-width: 1200px; margin: auto; text-align: center; font-size: 12px; color: var(--sub); padding: 24px 20px; border-top: 1px solid var(--border); }}
  </style>
</head>
<body>
<header>
  <div class="header-inner">
    <div>
      <h1>文史哲出版社 全館圖書總目錄</h1>
      <div class="sub-title">創立於1971年・典藏 {total_books} 冊學術經典 ｜ 供讀者檢索與搜尋引擎索引導航</div>
    </div>
    <a href="index.html" class="back-btn">📖 返回官方旗艦網站</a>
  </div>
</header>
<div class="container">
  <div class="search-box">
    <input type="search" id="catSearch" class="search-input" placeholder="🔍 快速篩選書碼、書名、作者或 ISBN…">
  </div>
  <nav class="nav-cats">{pills}</nav>
  {''.join(sections)}
</div>
<footer>文史哲出版社有限公司 ｜ <a href="index.html">官方首頁</a> ｜ <a href="categories/index.html">書系總覽</a> ｜ <a href="authors/index.html">作者名錄</a></footer>
<script>
(function(){{
  var inp=document.getElementById('catSearch');
  if(!inp)return;
  inp.addEventListener('input',function(){{
    var q=inp.value.trim().toLowerCase();
    document.querySelectorAll('.category-section').forEach(function(sec){{
      var shown=0;
      sec.querySelectorAll('tbody tr').forEach(function(tr){{
        var ok=!q||tr.textContent.toLowerCase().indexOf(q)!==-1;
        tr.style.display=ok?'':'none';
        if(ok)shown++;
      }});
      sec.style.display=shown>0?'':'none';
    }});
  }});
}})();
</script>
</body>
</html>"""


def write_urlset(filename: str, entries: list):
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
        '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    ]
    lines.extend(entries)
    lines.append("</urlset>")
    write_text(filename, "\n".join(lines) + "\n")


def main():
    books = load_books()
    today = date.today().isoformat()

    cats = {}
    authors = {}
    for b in books:
        bid = str(b.get("id", "")).strip()
        if not bid:
            continue
        cat = str(b.get("category", "")).strip() or "學術典籍"
        cats.setdefault(cat, []).append(b)
        aclean = clean_author_name(b.get("author", ""))
        authors.setdefault(aclean, []).append(b)

    cat_groups = sorted(
        [(name, f"c-{sha1_8(name)}", items) for name, items in cats.items()],
        key=lambda x: len(x[2]),
        reverse=True,
    )
    author_groups = sorted(
        [(name, f"a-{sha1_8(name)}", items) for name, items in authors.items()],
        key=lambda x: len(x[2]),
        reverse=True,
    )

    cat_slug_map = {name: slug for name, slug, _ in cat_groups}
    author_slug_map = {name: slug for name, slug, _ in author_groups}

    for b in books:
        bid = str(b.get("id", "")).strip()
        if not bid:
            continue
        cat = str(b.get("category", "")).strip() or "學術典籍"
        aclean = clean_author_name(b.get("author", ""))
        same_cat = [x for x in cats[cat] if str(x.get("id", "")).strip() != bid][:4]
        html_doc = build_book_page(
            b,
            cat_slug_map[cat],
            author_slug_map[aclean],
            aclean,
            len(authors[aclean]),
            same_cat,
        )
        write_text(f"books/{safe_filename(bid)}.html", html_doc)

    write_text("categories/index.html", build_index_page("category", cat_groups, len(books)))
    for name, slug, items in cat_groups:
        write_text(f"categories/{slug}.html", build_collection_page("category", name, slug, items))

    write_text("authors/index.html", build_index_page("author", author_groups, len(books)))
    for name, slug, items in author_groups:
        write_text(f"authors/{slug}.html", build_collection_page("author", name, slug, items))

    write_text("catalog.html", build_catalog_html(cat_groups, len(books)))

    core_entries = [
        f"  <url><loc>{BASE_URL}/</loc><lastmod>{today}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>",
        f"  <url><loc>{BASE_URL}/catalog.html</loc><lastmod>{today}</lastmod><changefreq>weekly</changefreq><priority>0.95</priority></url>",
        f"  <url><loc>{BASE_URL}/categories/index.html</loc><lastmod>{today}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>",
        f"  <url><loc>{BASE_URL}/authors/index.html</loc><lastmod>{today}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>",
    ]
    for _, slug, _ in cat_groups:
        core_entries.append(
            f"  <url><loc>{BASE_URL}/categories/{slug}.html</loc><lastmod>{today}</lastmod><changefreq>weekly</changefreq><priority>0.85</priority></url>"
        )
    for _, slug, _ in author_groups:
        core_entries.append(
            f"  <url><loc>{BASE_URL}/authors/{slug}.html</loc><lastmod>{today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>"
        )

    book_entries = []
    for b in books:
        bid = str(b.get("id", "")).strip()
        if not bid:
            continue
        sf = quote(safe_filename(bid))
        img = cover_abs_url(b)
        title = esc(b.get("title", ""))
        book_entries.append(
            f"  <url><loc>{BASE_URL}/books/{sf}.html</loc><lastmod>{today}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority>"
            f"<image:image><image:loc>{esc(img)}</image:loc><image:title>{title}</image:title></image:image></url>"
        )

    write_urlset("sitemap-core.xml", core_entries)
    sub_sitemaps = ["sitemap-core.xml"]
    chunk_size = 900
    for idx, start in enumerate(range(0, len(book_entries), chunk_size), start=1):
        fname = f"sitemap-books-{idx}.xml"
        write_urlset(fname, book_entries[start : start + chunk_size])
        sub_sitemaps.append(fname)

    idx_lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for sm in sub_sitemaps:
        idx_lines.append(f"  <sitemap><loc>{BASE_URL}/{sm}</loc><lastmod>{today}</lastmod></sitemap>")
    idx_lines.append("</sitemapindex>")
    write_text("sitemap.xml", "\n".join(idx_lines) + "\n")

    print(f"Generated {len(books)} books, {len(cat_groups)} categories, {len(author_groups)} authors, and {len(sub_sitemaps)} sitemaps.")


if __name__ == "__main__":
    main()

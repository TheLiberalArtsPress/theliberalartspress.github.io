#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
文史哲出版社網站資料同步工具
執行此腳本可隨時向後端 API 同步最新書籍、輪播圖、精選推薦與網站設定，並自動更新 data.js 與本地封面圖檔。
"""

import sys
import os
import json
import urllib.request
import concurrent.futures

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

GAS_URL = "https://script.google.com/macros/s/AKfycbzfD3v4jWMQVOMIPeoqnZ24XEHoCMFz1h4Tapw4sjPlTAtBa4Ow8TTTNaK8ktssR9F9dg/exec"
ACTIONS = ['FETCH_SETTINGS', 'FETCH_UI', 'FETCH_CAROUSELS', 'FETCH_CHOICES', 'FETCH_BOOKS']

def fetch_gas_data():
    results = {}
    for act in ACTIONS:
        print(f"正在同步 {act}...", flush=True)
        payload = {"action": act, "payload": None, "origin": "https://theliberalartspress.github.io"}
        req = urllib.request.Request(
            GAS_URL,
            data=json.dumps(payload).encode('utf-8'),
            headers={'Content-Type': 'text/plain;charset=utf-8', 'User-Agent': 'Mozilla/5.0'}
        )
        try:
            resp = urllib.request.urlopen(req, timeout=30)
            parsed = json.loads(resp.read().decode('utf-8'))
            if parsed.get('status') == 'success':
                results[act] = parsed.get('data')
                print(f"  -> {act} 同步成功", flush=True)
            else:
                print(f"  -> {act} 失敗: {parsed.get('msg')}", flush=True)
        except Exception as e:
            print(f"  -> {act} 連線錯誤: {e}", flush=True)
    return results

def download_image(item):
    key, url = item
    out_path = f"assets/covers/{key}.jpg"
    if os.path.exists(out_path) and os.path.getsize(out_path) > 100:
        return key, True
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        res = urllib.request.urlopen(req, timeout=10)
        img_bytes = res.read()
        if len(img_bytes) > 200:
            with open(out_path, 'wb') as f:
                f.write(img_bytes)
            return key, True
    except Exception:
        pass
    return key, False

def main():
    os.makedirs('assets/covers', exist_ok=True)
    data = fetch_gas_data()
    if 'FETCH_BOOKS' not in data:
        print("同步失敗，請檢查網路連線")
        return

    books = data.get('FETCH_BOOKS', [])
    choices = data.get('FETCH_CHOICES', [])
    carousels = data.get('FETCH_CAROUSELS', [])
    settings = data.get('FETCH_SETTINGS', {})
    ui = data.get('FETCH_UI', {})

    print(f"共取得 {len(books)} 本書籍、{len(choices)} 本推薦、{len(carousels)} 張輪播圖。")

    # 下載 Google Drive 封面圖
    drive_urls = {}
    for b in books:
        cover = b.get('cover') or b.get('image') or ''
        if 'drive.google.com' in cover:
            drive_urls[b['id']] = cover
    for c in choices:
        cover = c.get('cover') or c.get('image') or ''
        if 'drive.google.com' in cover:
            drive_urls[f"choice_{c['id']}"] = cover
    for idx, car in enumerate(carousels):
        img = car.get('image', '')
        if img and 'drive.google.com' in img:
            drive_urls[f"carousel_{idx}"] = img

    print(f"正在平行下載 {len(drive_urls)} 張封面圖檔...")
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        list(executor.map(download_image, drive_urls.items()))

    local_covers = set(os.listdir('assets/covers'))
    for b in books:
        if f"{b.get('id')}.jpg" in local_covers:
            b['localCover'] = f"assets/covers/{b.get('id')}.jpg"

    static_data = {
        "settings": settings,
        "ui": ui,
        "carousels": carousels,
        "choices": choices,
        "books": books
    }

    with open('data.js', 'w', encoding='utf-8') as f:
        f.write("window.STATIC_DATA = " + json.dumps(static_data, ensure_ascii=False) + ";")

    with open('all_gas_data.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"同步完成！已生成 data.js ({os.path.getsize('data.js')} bytes)")

if __name__ == '__main__':
    main()

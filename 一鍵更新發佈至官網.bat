@echo off
chcp 65001 >nul
title 文史哲出版社 - 一鍵同步發佈至官網

echo ========================================================
echo   📖 文史哲出版社官方網站 - 一鍵自動發佈工具
echo ========================================================
echo.
echo 正在檢查資料庫變更並打包發佈至 GitHub...
echo.

git add -A
git commit -m "update: 管理員更新書籍資料庫 (%date% %time%)"
git push origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================================
    echo   🎉 發佈成功！官方網站已同步更新！
    echo   🌐 官網網址：https://maplestorycandy.github.io/theliberalartspress/
    echo ========================================================
) else (
    echo.
    echo ========================================================
    echo   ⚠️ 發佈時發生問題，請檢查網路連線後重試。
    echo ========================================================
)

echo.
pause

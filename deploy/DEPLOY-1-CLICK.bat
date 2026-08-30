@echo off
chcp 65001 >nul
title Deploy - Kesh Dashboard -> WSL Ubuntu
cd /d "%~dp0\.."
echo.
echo ================================================
echo   KESH DASHBOARD - DEPLOY 1-CLICK (WINDOWS -> WSL)
echo ================================================
echo.
echo [1/3] Setup do servidor WSL (Nginx + config)...
echo [2/3] Build React + copiar arquivos...
echo [3/3] Abrir site no navegador
echo.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0deploy-lokal.ps1"
echo.
if %ERRORLEVEL% EQU 0 (
  echo.
  echo ✅ Deploy OK! Acesse: http://localhost
) else (
  echo ❌ Falhou (veja acima o erro). Pressione Enter para fechar...
  pause >nul
)

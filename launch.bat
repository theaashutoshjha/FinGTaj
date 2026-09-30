@echo off
title FingTaj Pro - Modern Production Web Application
echo ========================================================
echo   Launching FingTaj Pro (Vite + React 19 + TypeScript)
echo ========================================================
cd /d "%~dp0"
start http://localhost:5173/
npm run dev

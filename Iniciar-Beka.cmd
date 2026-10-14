@echo off
chcp 65001 >nul
cd /d "%~dp0"
set "BEKA_NODE=node"
if exist "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" set "BEKA_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
echo.
echo Béka Coquetelaria - protótipo local
echo Abra http://127.0.0.1:5173 no navegador.
echo Mantenha esta janela aberta. Para encerrar, pressione Ctrl+C.
echo.
"%BEKA_NODE%" node_modules\vite\bin\vite.js --host 127.0.0.1
pause

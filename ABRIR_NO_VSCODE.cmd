@echo off
cd /d "%~dp0"
call code --new-window "%~dp0." --goto "%~dp0editar.html:1"
if errorlevel 1 (
  echo Nao foi possivel abrir o VS Code. Abra a pasta manualmente pelo menu Arquivo.
  pause
)

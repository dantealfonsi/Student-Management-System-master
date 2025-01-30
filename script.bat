@echo off

:: Verificar si XAMPP está corriendo
tasklist /FI "IMAGENAME eq httpd.exe" | find /I "httpd.exe" >nul
if %ERRORLEVEL% equ 0 (
    echo XAMPP ya está corriendo.
) else (
    echo Iniciando XAMPP...
    start "" "C:\xampp\xampp-control.exe"
    timeout /t 10 /nobreak >nul
)

:: Navegar al directorio del proyecto Angular
cd C:\angular\Student-Management-System-master

:: Iniciar el servidor Angular
start "" "cmd /c ng serve"

:: Esperar unos segundos para asegurarnos de que el servidor se ha iniciado
timeout /t 10 /nobreak >nul

:: Abrir el navegador en la URL del servidor
start chrome "http://localhost:4200/"

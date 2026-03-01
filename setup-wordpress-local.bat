@echo off
echo ========================================
echo   Pericia Trabalhista Pro Setup
echo   WordPress Local Installation
echo ========================================
echo.

:: Verificar se XAMPP está instalado
if exist "C:\xampp" (
    echo [✓] XAMPP encontrado em C:\xampp
    set XAMPP_PATH=C:\xampp
    goto :check_wordpress
) else (
    echo [✗] XAMPP nao encontrado
    echo.
    echo Por favor, instale XAMPP primeiro:
    echo https://www.apachefriends.org/download.html
    pause
    exit /b 1
)

:check_wordpress
:: Verificar se WordPress existe
if exist "%XAMPP_PATH%\htdocs\wordpress" (
    echo [✓] WordPress encontrado
    goto :install_plugin
) else (
    echo [!] WordPress nao encontrado
    echo.
    echo Deseja baixar e instalar WordPress agora? (S/N)
    set /p choice=
    if /i "%choice%"=="S" goto :download_wordpress
    if /i "%choice%"=="s" goto :download_wordpress
    echo Instale WordPress manualmente e execute este script novamente
    pause
    exit /b 1
)

:download_wordpress
echo.
echo [📥] Baixando WordPress...
powershell -Command "Invoke-WebRequest -Uri 'https://wordpress.org/latest.zip' -OutFile 'wordpress.zip'"

echo [📦] Extraindo WordPress...
powershell -Command "Expand-Archive -Path 'wordpress.zip' -DestinationPath '%XAMPP_PATH%\htdocs\' -Force"

echo [🗂️] Renomeando pasta...
if exist "%XAMPP_PATH%\htdocs\wordpress" rmdir /s /q "%XAMPP_PATH%\htdocs\wordpress"
rename "%XAMPP_PATH%\htdocs\wordpress" "wordpress"

echo [🗑️] Limpando arquivos temporários...
del wordpress.zip

echo [✓] WordPress instalado com sucesso!
echo.

:install_plugin
:: Instalar plugin
echo [🔌] Instalando plugin Pericia Trabalhista Pro...

:: Criar pasta do plugin
if not exist "%XAMPP_PATH%\htdocs\wordpress\wp-content\plugins\pericia-trabalhista-pro" (
    mkdir "%XAMPP_PATH%\htdocs\wordpress\wp-content\plugins\pericia-trabalhista-pro"
)

:: Copiar arquivos do plugin
echo [📋] Copiando arquivos do plugin...
xcopy /E /I /Y "wordpress-plugin\*" "%XAMPP_PATH%\htdocs\wordpress\wp-content\plugins\pericia-trabalhista-pro\"

echo [✓] Plugin instalado!
echo.

:create_database
:: Criar database
echo [🗄️] Configurando database...
echo.
echo Abrindo phpMyAdmin para criar database manualmente...
echo.
echo Instrucoes:
echo 1. Acesse: http://localhost/phpmyadmin
echo 2. Clique em "New database"
echo 3. Nome: pericia_trabalhista
echo 4. Collation: utf8mb4_unicode_ci
echo 5. Clique em "Create"
echo.
start http://localhost/phpmyadmin

echo.
echo [🌐] Configuracao finalizada!
echo.
echo URLs importantes:
echo WordPress Admin: http://localhost/wordpress/wp-admin
echo Plugin Admin:   http://localhost/wordpress/wp-admin/admin.php?page=pericia-trabalhista-pro
echo API Endpoints:  http://localhost/wordpress/wp-json/pericia-trabalhista-pro/v1/
echo.
echo Proximos passos:
echo 1. Crie o database 'pericia_trabalhista'
echo 2. Acesse http://localhost/wordpress/wp-admin
echo 3. Faca a instalacao inicial do WordPress
echo 4. Ative o plugin 'Pericia Trabalhista Pro'
echo 5. Configure o plugin no menu admin
echo.
pause

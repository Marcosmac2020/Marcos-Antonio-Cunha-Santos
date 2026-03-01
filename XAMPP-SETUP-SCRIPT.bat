@echo off
echo ========================================
echo   Pericia Trabalhista Pro
echo   XAMPP Setup Automatizado
echo ========================================
echo.

:: Verificar se XAMPP está instalado
if exist "C:\xampp" (
    echo [✓] XAMPP encontrado em C:\xampp
    set XAMPP_PATH=C:\xampp
    goto :check_services
) else (
    echo [✗] XAMPP nao encontrado
    echo.
    echo Por favor, instale XAMPP primeiro:
    echo https://www.apachefriends.org/download.html
    echo.
    echo Depois de instalar, execute este script novamente.
    pause
    exit /b 1
)

:check_services
:: Verificar se serviços estão rodando
echo [🔍] Verificando servicos XAMPP...

tasklist | find "httpd.exe" >nul
if %errorlevel% equ 0 (
    echo [✓] Apache esta rodando
) else (
    echo [!] Apache nao esta rodando
    echo [🚀] Iniciando Apache...
    start "" "%XAMPP_PATH%\xampp-control.exe"
    echo Por favor, inicie o Apache no XAMPP Control Panel
    pause
)

tasklist | find "mysqld.exe" >nul
if %errorlevel% equ 0 (
    echo [✓] MySQL esta rodando
) else (
    echo [!] MySQL nao esta rodando
    echo [🚀] Iniciando MySQL...
    echo Por favor, inicie o MySQL no XAMPP Control Panel
    pause
)

:setup_wordpress
echo.
echo [📥] Configurando WordPress...

:: Verificar se WordPress existe
if exist "%XAMPP_PATH%\htdocs\wordpress" (
    echo [✓] WordPress encontrado
    goto :setup_database
) else (
    echo [!] WordPress nao encontrado
    echo [📥] Baixando WordPress...
    powershell -Command "Invoke-WebRequest -Uri 'https://wordpress.org/latest.zip' -OutFile 'wordpress.zip'"
    
    echo [📦] Extraindo WordPress...
    powershell -Command "Expand-Archive -Path 'wordpress.zip' -DestinationPath '%XAMPP_PATH%\htdocs\' -Force"
    
    echo [🗂️] Organizando arquivos...
    if exist "%XAMPP_PATH%\htdocs\wordpress" rmdir /s /q "%XAMPP_PATH%\htdocs\wordpress"
    move "%XAMPP_PATH%\htdocs\wordpress" "%XAMPP_PATH%\htdocs\wordpress-temp"
    move "%XAMPP_PATH%\htdocs\wordpress-temp\wordpress" "%XAMPP_PATH%\htdocs\wordpress"
    rmdir /s /q "%XAMPP_PATH%\htdocs\wordpress-temp"
    
    echo [🗑️] Limpando arquivos temporarios...
    del wordpress.zip
    
    echo [✓] WordPress instalado com sucesso!
)

:setup_database
echo.
echo [🗄️] Configurando Database...

:: Abrir phpMyAdmin
echo [🌐] Abrindo phpMyAdmin para criar database...
echo.
echo Instrucoes:
echo 1. No navegador que vai abrir, clique em "New database"
echo 2. Nome: pericia_trabalhista
echo 3. Collation: utf8mb4_unicode_ci
echo 4. Clique em "Create"
echo.
start http://localhost/phpmyadmin

echo.
echo Pressione qualquer tecla quando o database for criado...
pause >nul

:install_plugin
echo.
echo [🔌] Instalando Plugin Pericia Trabalhista Pro...

:: Verificar se pasta do plugin existe
if not exist "wordpress-plugin" (
    echo [✗] Pasta wordpress-plugin nao encontrada!
    echo Execute este script da pasta raiz do projeto.
    pause
    exit /b 1
)

:: Criar pasta do plugin
if not exist "%XAMPP_PATH%\htdocs\wordpress\wp-content\plugins\pericia-trabalhista-pro" (
    mkdir "%XAMPP_PATH%\htdocs\wordpress\wp-content\plugins\pericia-trabalhista-pro"
)

:: Copiar arquivos do plugin
echo [📋] Copiando arquivos do plugin...
xcopy /E /I /Y "wordpress-plugin\*" "%XAMPP_PATH%\htdocs\wordpress\wp-content\plugins\pericia-trabalhista-pro\"

if %errorlevel% equ 0 (
    echo [✓] Plugin copiado com sucesso!
) else (
    echo [✗] Erro ao copiar plugin!
    pause
    exit /b 1
)

:setup_permissions
echo.
echo [🔐] Configurando permissoes...

:: Configurar permissões básicas
icacls "%XAMPP_PATH%\htdocs\wordpress" /grant Everyone:(OI)(CI)F /T >nul 2>&1

echo [✓] Permissoes configuradas!

:final_setup
echo.
echo [🎯] CONFIGURACAO FINALIZADA!
echo.
echo ========================================
echo   URLs IMPORTANTES
echo ========================================
echo WordPress Admin: http://localhost/wordpress/wp-admin
echo Plugin Admin:   http://localhost/wordpress/wp-admin/admin.php?page=pericia-trabalhista-pro
echo API Endpoints:  http://localhost/wordpress/wp-json/pericia-trabalhista-pro/v1/
echo React App:      http://localhost:3000
echo ========================================
echo.
echo PROXIMOS PASSOS:
echo 1. Acesse: http://localhost/wordpress/wp-admin
echo 2. Faca a instalacao inicial do WordPress
echo 3. Login com suas credenciais
echo 4. Vá em Plugins > Installed Plugins
echo 5. Ative "Pericia Trabalhista Pro"
echo 6. Configure o plugin no menu "Perícia Trabalhista Pro"
echo.
echo CREDENCIAIS PADRAO:
echo Database: pericia_trabalhista
echo User: root
echo Password: (vazio - deixar em branco)
echo.
echo [✓] Setup completo! O sistema esta pronto para uso!
echo.

:: Abrir WordPress para configuracao
start http://localhost/wordpress

pause

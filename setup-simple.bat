@echo off
echo ========================================
echo   Pericia Trabalhista Pro
echo   Setup Manual Simplificado
echo ========================================
echo.

echo [1] Verificando XAMPP...
if exist "C:\xampp" (
    echo [OK] XAMPP encontrado
) else (
    echo [ERRO] XAMPP nao encontrado
    echo Baixe em: https://www.apachefriends.org/download.html
    pause
    exit /b 1
)

echo.
echo [2] Verificando servicos...
tasklist | find "httpd.exe" >nul
if %errorlevel% equ 0 (
    echo [OK] Apache rodando
) else (
    echo [ATENCAO] Apache nao rodando - inicie via XAMPP Control Panel
)

tasklist | find "mysqld.exe" >nul
if %errorlevel% equ 0 (
    echo [OK] MySQL rodando
) else (
    echo [ATENCAO] MySQL nao rodando - inicie via XAMPP Control Panel
)

echo.
echo [3] Configurando WordPress...
if exist "C:\xampp\htdocs\wordpress" (
    echo [OK] WordPress encontrado
) else (
    echo [INFO] WordPress nao encontrado - baixe manualmente
    echo URL: https://wordpress.org/latest.zip
    echo Extraia para: C:\xampp\htdocs\wordpress\
    pause
)

echo.
echo [4] Configurando plugin...
if exist "wordpress-plugin" (
    echo [OK] Pasta plugin encontrada
    
    if not exist "C:\xampp\htdocs\wordpress\wp-content\plugins\pericia-trabalhista-pro" (
        mkdir "C:\xampp\htdocs\wordpress\wp-content\plugins\pericia-trabalhista-pro"
    )
    
    echo Copiando arquivos...
    xcopy /E /I /Y "wordpress-plugin\*" "C:\xampp\htdocs\wordpress\wp-content\plugins\pericia-trabalhista-pro\"
    
    if %errorlevel% equ 0 (
        echo [OK] Plugin copiado com sucesso
    ) else (
        echo [ERRO] Erro ao copiar plugin
    )
) else (
    echo [ERRO] Pasta wordpress-plugin nao encontrada
)

echo.
echo [5] Abrindo configuracoes...
echo.
echo INSTRUCOES FINAIS:
echo 1. Acesse: http://localhost/phpmyadmin
echo 2. Crie database: pericia_trabalhista
echo 3. Acesse: http://localhost/wordpress
echo 4. Faca instalacao inicial
echo 5. Ative plugin "Pericia Trabalhista Pro"
echo.

start http://localhost/phpmyadmin
start http://localhost/wordpress

echo.
echo [CONCLUIDO] Setup finalizado!
echo.
echo URLs:
echo WordPress Admin: http://localhost/wordpress/wp-admin
echo Plugin Admin: http://localhost/wordpress/wp-admin/admin.php?page=pericia-trabalhista-pro
echo React App: http://localhost:3000
echo.
pause

@echo off
echo ========================================
echo   Pericia Trabalhista Pro Setup
echo   WordPress Manual Installation
echo ========================================
echo.

echo [!] Docker nao esta funcionando corretamente
echo [!] Usando metodo manual de instalacao
echo.

:: Opcoes de instalacao
echo Escolha o metodo de instalacao:
echo 1. XAMPP (Recomendado)
echo 2. Laragon (Portatil)
echo 3. Local (Simples)
echo 4. Apenas instrucoes
echo.
set /p choice="Digite sua opcao (1-4): "

if "%choice%"=="1" goto :xampp_setup
if "%choice%"=="2" goto :laragon_setup
if "%choice%"=="3" goto :local_setup
if "%choice%"=="4" goto :instructions
goto :invalid_choice

:xampp_setup
echo.
echo [📥] Configurando XAMPP...
echo.
echo PASSOS PARA XAMPP:
echo 1. Se XAMPP nao estiver instalado, baixe de:
echo    https://www.apachefriends.org/download.html
echo.
echo 2. Instale XAMPP em C:\xampp
echo.
echo 3. Abra XAMPP Control Panel
echo 4. Inicie Apache e MySQL
echo.
echo 5. Baixe WordPress: https://wordpress.org/latest.zip
echo.
echo 6. Extraia para C:\xampp\htdocs\wordpress\
echo.
echo 7. Acesse: http://localhost/phpmyadmin
echo 8. Crie database: pericia_trabalhista
echo.
echo 9. Acesse: http://localhost/wordpress
echo 10. Faca instalacao inicial
echo.
echo 11. Copie plugin para: C:\xampp\htdocs\wordpress\wp-content\plugins\pericia-trabalhista-pro\
echo.
pause
goto :copy_plugin

:laragon_setup
echo.
echo [🐲] Configurando Laragon...
echo.
echo PASSOS PARA LARAGON:
echo 1. Baixe Laragon: https://laragon.org/download/
echo 2. Instale e inicie Laragon
echo 3. Menu > Quick app > WordPress
echo 4. Configure automaticamente
echo 5. Copie plugin para pasta plugins do WordPress
echo.
pause
goto :copy_plugin

:local_setup
echo.
echo [🏠] Configurando Local...
echo.
echo PASSOS PARA LOCAL:
echo 1. Baixe Local: https://localwp.com/
echo 2. Instale e abra Local
echo 3. Add New Site > WordPress
echo 4. Configure automaticamente
echo 5. Abra site com "Open site folder"
echo 6. Copie plugin para pasta plugins
echo.
pause
goto :copy_plugin

:copy_plugin
echo.
echo [📋] Copiando arquivos do plugin...
echo.

:: Verificar se pasta wordpress-plugin existe
if not exist "wordpress-plugin" (
    echo [ERRO] Pasta wordpress-plugin nao encontrada!
    echo Execute este script da pasta raiz do projeto.
    pause
    exit /b 1
)

:: Criar destino
set /p dest_path="Digite o caminho completo para pasta plugins do WordPress: "
if "%dest_path%"=="" set dest_path=C:\xampp\htdocs\wordpress\wp-content\plugins\pericia-trabalhista-pro

:: Criar pasta se nao existir
if not exist "%dest_path%" (
    echo [📁] Criando pasta: %dest_path%
    mkdir "%dest_path%"
)

:: Copiar arquivos
echo [📋] Copiando arquivos...
xcopy /E /I /Y "wordpress-plugin\*" "%dest_path%\"

if %errorlevel% equ 0 (
    echo [✓] Plugin copiado com sucesso!
) else (
    echo [✗] Erro ao copiar plugin!
    pause
    exit /b 1
)

goto :next_steps

:instructions
echo.
echo [📖] Instrucoes Manuais:
echo.
echo 1. Instale um ambiente WordPress local:
echo    - XAMPP: https://www.apachefriends.org/download.html
echo    - Laragon: https://laragon.org/download/
echo    - Local: https://localwp.com/
echo.
echo 2. Configure WordPress (crie database)
echo.
echo 3. Copie pasta wordpress-plugin para:
echo    [PASTA_WORDPRESS]\wp-content\plugins\pericia-trabalhista-pro\
echo.
echo 4. Acesse wp-admin e ative o plugin
echo.
pause
goto :end

:next_steps
echo.
echo [🎯] PROXIMOS PASSOS:
echo.
echo 1. Inicie seu servidor WordPress local
echo 2. Acesse: http://localhost/wordpress/wp-admin
echo 3. Faca login e configure WordPress inicialmente
echo 4. Vá em Plugins > Installed Plugins
echo 5. Ative "Pericia Trabalhista Pro"
echo 6. Configure em Perícia Trabalhista Pro > Configurações
echo.
echo URLs importantes:
echo - WordPress Admin: http://localhost/wordpress/wp-admin
echo - Plugin Admin: http://localhost/wordpress/wp-admin/admin.php?page=pericia-trabalhista-pro
echo - API Endpoints: http://localhost/wordpress/wp-json/pericia-trabalhista-pro/v1/
echo.
echo [✓] Setup concluido! O plugin esta pronto para uso.
echo.

:end
echo ========================================
echo   Pericia Trabalhista Pro
echo   Setup Completo
echo ========================================
pause

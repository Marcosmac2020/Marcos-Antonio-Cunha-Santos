# Perícia Trabalhista Pro - XAMPP Setup Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Pericia Trabalhista Pro" -ForegroundColor Yellow
Write-Host "  XAMPP Setup Automatizado" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se XAMPP está instalado
$xamppPath = "C:\xampp"
if (Test-Path $xamppPath) {
    Write-Host "[✓] XAMPP encontrado em $xamppPath" -ForegroundColor Green
} else {
    Write-Host "[✗] XAMPP não encontrado" -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor, instale XAMPP primeiro:" -ForegroundColor Yellow
    Write-Host "https://www.apachefriends.org/download.html" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Depois de instalar, execute este script novamente." -ForegroundColor Yellow
    Read-Host "Pressione Enter para sair"
    exit 1
}

# Verificar se serviços estão rodando
Write-Host "[🔍] Verificando serviços XAMPP..." -ForegroundColor Blue

$apacheRunning = Get-Process -Name "httpd" -ErrorAction SilentlyContinue
if ($apacheRunning) {
    Write-Host "[✓] Apache está rodando" -ForegroundColor Green
} else {
    Write-Host "[!] Apache não está rodando" -ForegroundColor Yellow
    Write-Host "[🚀] Iniciando Apache..." -ForegroundColor Blue
    Start-Process "$xamppPath\xampp-control.exe"
    Write-Host "Por favor, inicie o Apache no XAMPP Control Panel" -ForegroundColor Yellow
    Read-Host "Pressione Enter quando Apache estiver rodando"
}

$mysqlRunning = Get-Process -Name "mysqld" -ErrorAction SilentlyContinue
if ($mysqlRunning) {
    Write-Host "[✓] MySQL está rodando" -ForegroundColor Green
} else {
    Write-Host "[!] MySQL não está rodando" -ForegroundColor Yellow
    Write-Host "[🚀] Iniciando MySQL..." -ForegroundColor Blue
    Write-Host "Por favor, inicie o MySQL no XAMPP Control Panel" -ForegroundColor Yellow
    Read-Host "Pressione Enter quando MySQL estiver rodando"
}

# Configurar WordPress
Write-Host ""
Write-Host "[📥] Configurando WordPress..." -ForegroundColor Blue

$wordpressPath = "$xamppPath\htdocs\wordpress"
if (Test-Path $wordpressPath) {
    Write-Host "[✓] WordPress encontrado" -ForegroundColor Green
} else {
    Write-Host "[!] WordPress não encontrado" -ForegroundColor Yellow
    Write-Host "[📥] Baixando WordPress..." -ForegroundColor Blue
    
    try {
        Invoke-WebRequest -Uri "https://wordpress.org/latest.zip" -OutFile "wordpress.zip"
        Write-Host "[✓] WordPress baixado" -ForegroundColor Green
        
        Write-Host "[📦] Extraindo WordPress..." -ForegroundColor Blue
        Expand-Archive -Path "wordpress.zip" -DestinationPath "$xamppPath\htdocs\" -Force
        
        Write-Host "[🗂️] Organizando arquivos..." -ForegroundColor Blue
        if (Test-Path "$xamppPath\htdocs\wordpress") {
            Remove-Item "$xamppPath\htdocs\wordpress" -Recurse -Force
        }
        Move-Item "$xamppPath\htdocs\wordpress\wordpress" "$xamppPath\htdocs\wordpress"
        if (Test-Path "$xamppPath\htdocs\wordpress-temp") {
            Remove-Item "$xamppPath\htdocs\wordpress-temp" -Recurse -Force
        }
        
        Write-Host "[🗑️] Limpando arquivos temporários..." -ForegroundColor Blue
        Remove-Item "wordpress.zip" -Force
        
        Write-Host "[✓] WordPress instalado com sucesso!" -ForegroundColor Green
    }
    catch {
        Write-Host "[✗] Erro ao baixar WordPress: $($_.Exception.Message)" -ForegroundColor Red
        Read-Host "Pressione Enter para continuar"
    }
}

# Configurar Database
Write-Host ""
Write-Host "[🗄️] Configurando Database..." -ForegroundColor Blue

Write-Host "[🌐] Abrindo phpMyAdmin para criar database..." -ForegroundColor Blue
Write-Host ""
Write-Host "Instruções:" -ForegroundColor Yellow
Write-Host "1. No navegador que vai abrir, clique em 'New database'" -ForegroundColor White
Write-Host "2. Nome: pericia_trabalhista" -ForegroundColor White
Write-Host "3. Collation: utf8mb4_unicode_ci" -ForegroundColor White
Write-Host "4. Clique em 'Create'" -ForegroundColor White
Write-Host ""

Start-Process "http://localhost/phpmyadmin"

Write-Host "Pressione qualquer tecla quando o database for criado..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Instalar Plugin
Write-Host ""
Write-Host "[🔌] Instalando Plugin Perícia Trabalhista Pro..." -ForegroundColor Blue

$pluginPath = ".\wordpress-plugin"
if (-not (Test-Path $pluginPath)) {
    Write-Host "[✗] Pasta wordpress-plugin não encontrada!" -ForegroundColor Red
    Write-Host "Execute este script da pasta raiz do projeto." -ForegroundColor Yellow
    Read-Host "Pressione Enter para sair"
    exit 1
}

$targetPluginPath = "$xamppPath\htdocs\wordpress\wp-content\plugins\pericia-trabalhista-pro"
if (-not (Test-Path $targetPluginPath)) {
    New-Item -ItemType Directory -Path $targetPluginPath -Force
}

Write-Host "[📋] Copiando arquivos do plugin..." -ForegroundColor Blue
try {
    Copy-Item -Path "$pluginPath\*" -Destination $targetPluginPath -Recurse -Force
    Write-Host "[✓] Plugin copiado com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "[✗] Erro ao copiar plugin: $($_.Exception.Message)" -ForegroundColor Red
    Read-Host "Pressione Enter para continuar"
}

# Configurar permissões
Write-Host ""
Write-Host "[🔐] Configurando permissões..." -ForegroundColor Blue

try {
    $acl = Get-Acl $wordpressPath
    $accessRule = New-Object System.Security.AccessControl.FileSystemAccessRule("Everyone","FullControl","ContainerInherit,ObjectInherit","None","Allow")
    $acl.SetAccessRule($accessRule)
    Set-Acl $wordpressPath $acl
    Write-Host "[✓] Permissões configuradas!" -ForegroundColor Green
} catch {
    Write-Host "[!] Erro ao configurar permissões (pode ignorar)" -ForegroundColor Yellow
}

# Setup Final
Write-Host ""
Write-Host "[🎯] CONFIGURAÇÃO FINALIZADA!" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  URLs IMPORTANTES" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "WordPress Admin: http://localhost/wordpress/wp-admin" -ForegroundColor White
Write-Host "Plugin Admin:   http://localhost/wordpress/wp-admin/admin.php?page=pericia-trabalhista-pro" -ForegroundColor White
Write-Host "API Endpoints:  http://localhost/wordpress/wp-json/pericia-trabalhista-pro/v1/" -ForegroundColor White
Write-Host "React App:      http://localhost:3000" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "PRÓXIMOS PASSOS:" -ForegroundColor Yellow
Write-Host "1. Acesse: http://localhost/wordpress/wp-admin" -ForegroundColor White
Write-Host "2. Faça a instalação inicial do WordPress" -ForegroundColor White
Write-Host "3. Login com suas credenciais" -ForegroundColor White
Write-Host "4. Vá em Plugins > Installed Plugins" -ForegroundColor White
Write-Host "5. Ative 'Perícia Trabalhista Pro'" -ForegroundColor White
Write-Host "6. Configure o plugin no menu 'Perícia Trabalhista Pro'" -ForegroundColor White
Write-Host ""
Write-Host "CREDENCIAIS PADRÃO:" -ForegroundColor Yellow
Write-Host "Database: pericia_trabalhista" -ForegroundColor White
Write-Host "User: root" -ForegroundColor White
Write-Host "Password: (vazio - deixar em branco)" -ForegroundColor White
Write-Host ""
Write-Host "[✓] Setup completo! O sistema esta pronto para uso!" -ForegroundColor Green
Write-Host ""

# Abrir WordPress para configuração
Start-Process "http://localhost/wordpress"

Write-Host "Pressione Enter para sair..." -ForegroundColor Yellow
Read-Host

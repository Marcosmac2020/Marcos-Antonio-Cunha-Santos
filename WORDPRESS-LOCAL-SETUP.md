# 🌐 WordPress Local Setup Guide

## 🎯 Situação Atual

Nenhum ambiente WordPress local detectado no sistema. Vamos configurar um ambiente completo para testar o plugin.

---

## 🚀 Opções de Instalação WordPress Local

### Opção 1: XAMPP (Recomendado)
```bash
# 1. Baixar XAMPP
https://www.apachefriends.org/download.html

# 2. Instalar XAMPP
# - Clique no instalador
# - Marque Apache e MySQL
# - Instale em C:\xampp

# 3. Iniciar Serviços
# - Abra XAMPP Control Panel
# - Start Apache
# - Start MySQL

# 4. Baixar WordPress
https://wordpress.org/download/

# 5. Criar Database
# - Acesse: http://localhost/phpmyadmin
# - Criar database: pericia_trabalhista
# - User: root (sem senha)
```

### Opção 2: Laragon (Portátil)
```bash
# 1. Baixar Laragon
https://laragon.org/download/

# 2. Instalar Laragon
# - Download e execute
# - Inicia Apache + MySQL automaticamente

# 3. WordPress via Laragon
# - Menu > Quick app > WordPress
# - Configura automática
```

### Opção 3: Local (Simples)
```bash
# 1. Instalar Local
https://localwp.com/

# 2. Criar Site
# - Add New Site
# - WordPress automático
# - SSL automático
```

---

## 🔧 Instalação do Plugin WordPress

### Passo 1: Configurar WordPress
```bash
# Após instalar WordPress local:
# 1. Acessar: http://localhost/wordpress
# 2. Fazer instalação inicial
# 3. Configurar:
#    - Site Title: Perícia Trabalhista Pro
#    - Admin User: admin
#    - Password: sua_senha
#    - Email: seu@email.com
```

### Passo 2: Instalar Plugin
```bash
# Método A: Upload via WordPress
# 1. Login: http://localhost/wordpress/wp-admin
# 2. Plugins > Add New > Upload Plugin
# 3. Selecionar: pericia-trabalhista-pro-wordpress-plugin.zip
# 4. Install Now > Activate

# Método B: Manual
# 1. Descompactar plugin em:
#    C:\xampp\htdocs\wordpress\wp-content\plugins\pericia-trabalhista-pro\
# 2. Ativar via painel
```

### Passo 3: Configurar Plugin
```bash
# 1. Acessar configurações
# URL: http://localhost/wordpress/wp-admin/admin.php?page=pericia-trabalhista-pro

# 2. Configurar:
# - API Endpoint: http://localhost:3000/api
# - Chave API: sua_chave_gemini
# - Webhooks: habilitar
```

---

## 🧪 Testes do Plugin WordPress

### 1. Verificar Instalação
```bash
# Verificar se plugin aparece:
# - wp-admin > Plugins > Installed Plugins
# - Status: "Perícia Trabalhista Pro - Active"
```

### 2. Testar Custom Post Types
```bash
# Verificar novos menus:
# - Processos Periciais
# - Laudos Periciais
# - Dashboard Perícia Pro
```

### 3. Testar API REST
```bash
# Testar endpoints:
curl http://localhost/wordpress/wp-json/pericia-trabalhista-pro/v1/processos
curl http://localhost/wordpress/wp-json/pericia-trabalhista-pro/v1/laudos

# Resposta esperada:
{"data": [...], "status": "success"}
```

### 4. Testar Shortcodes
```bash
# Criar página teste:
# 1. Pages > Add New
# 2. Título: "Teste Plugin"
# 3. Conteúdo: [pericia_trabalhista_form type="processo"]
# 4. Publicar e visualizar
```

---

## 🔗 Integração React ↔ WordPress

### 1. Configurar CORS no WordPress
```php
// Adicionar ao functions.php do plugin
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        header('Access-Control-Allow-Origin: http://localhost:3000');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        return $value;
    });
});
```

### 2. Configurar React para WordPress
```typescript
// src/config/api.ts
export const API_BASE = 'http://localhost/wordpress/wp-json/pericia-trabalhista-pro/v1';
export const WP_BASE = 'http://localhost/wordpress';
```

### 3. Autenticação
```typescript
// Implementar nonce verification
const getNonce = async () => {
  const response = await fetch(`${WP_BASE}/wp-admin/admin-ajax.php`, {
    method: 'POST',
    body: new URLSearchParams({
      action: 'get_nonce'
    })
  });
  return response.json();
};
```

---

## 🚨 Solução de Problemas

### Plugin Não Aparece
```bash
# Verificar:
# 1. Permissões das pastas
# 2. Nome da pasta (sem espaços)
# 3. Arquivo principal existe
# 4. Logs de erros WordPress
```

### API Não Funciona
```bash
# Debug WordPress:
# wp-config.php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);

# Verificar:
# 1. Mod rewrite Apache
# 2. Permissões .htaccess
# 3. CORS headers
```

### Conexão React-WP
```bash
# Testar conectividade:
# 1. Ping: http://localhost:3000
# 2. Ping: http://localhost/wordpress
# 3. CORS headers no browser
```

---

## 📱 Acesso Rápido

### URLs Importantes
```bash
# WordPress Admin:
http://localhost/wordpress/wp-admin

# Plugin Admin:
http://localhost/wordpress/wp-admin/admin.php?page=pericia-trabalhista-pro

# API Endpoints:
http://localhost/wordpress/wp-json/pericia-trabalhista-pro/v1/

# React App:
http://localhost:3000
```

### Credenciais Padrão
```bash
# WordPress:
User: admin
Password: (definido na instalação)

# Database:
Host: localhost
User: root
Password: (vazio XAMPP)
Database: pericia_trabalhista
```

---

## 🎯 Checklist Final

### WordPress Local ✅
- [ ] XAMPP/Laragon instalado
- [ ] Apache e MySQL rodando
- [ ] WordPress instalado
- [ ] Plugin ativado

### Plugin ✅
- [ ] Arquivos descompactados corretamente
- [ ] Plugin aparece na lista
- [ ] Menu admin criado
- [ ] API endpoints funcionando

### Integração ✅
- [ ] React conectado ao WordPress
- [ ] CORS configurado
- [ ] Autenticação funcionando
- [ ] Dados sincronizando

---

## 🚀 Próximos Passos

1. **Instalar ambiente WordPress local**
2. **Ativar e configurar plugin**
3. **Testar integração completa**
4. **Validar todos os endpoints**
5. **Testar formulários e shortcodes**

**Após setup completo, teremos ambiente full-stack funcionando! 🎉**

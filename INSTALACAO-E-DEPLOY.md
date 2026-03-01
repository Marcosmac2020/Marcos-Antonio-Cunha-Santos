# 📦 Perícia Trabalhista Pro - Guia de Instalação e Deploy

## 🎯 Pacotes Gerados

### 1. Sistema Completo (React + WordPress)
- **Arquivo**: `pericia-trabalhista-pro-v1.0.0.zip`
- **Tamanho**: ~123 KB
- **Conteúdo**: Sistema React completo + Plugin WordPress

### 2. Plugin WordPress Apenas
- **Arquivo**: `pericia-trabalhista-pro-wordpress-plugin.zip`
- **Tamanho**: ~11 KB
- **Conteúdo**: Apenas o plugin WordPress para instalação

---

## 🚀 Instalação do Sistema React

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Servidor web (Apache/Nginx)

### Passos

1. **Descompactar o arquivo principal**
   ```bash
   unzip pericia-trabalhista-pro-v1.0.0.zip
   cd pericia-trabalhista-pro
   ```

2. **Instalar dependências**
   ```bash
   npm install
   ```

3. **Configurar variáveis de ambiente**
   ```bash
   cp .env.example .env
   # Editar .env com sua GEMINI_API_KEY
   ```

4. **Iniciar desenvolvimento**
   ```bash
   npm run dev
   ```

5. **Build para produção**
   ```bash
   npm run build
   ```

6. **Deploy**
   - Copiar pasta `dist/` para seu servidor
   - Configurar servidor para servir arquivos estáticos

---

## 🔧 Instalação do Plugin WordPress

### Método 1: Upload Direto

1. **Acessar painel WordPress**
   - Login como administrador
   - Ir para **Plugins > Adicionar Novo**

2. **Fazer upload**
   - Clicar em **Fazer Upload do Plugin**
   - Selecionar `pericia-trabalhista-pro-wordpress-plugin.zip`
   - Instalar e Ativar

### Método 2: Instalação Manual

1. **Descompactar o plugin**
   ```bash
   unzip pericia-trabalhista-pro-wordpress-plugin.zip
   ```

2. **Mover para pasta WordPress**
   ```bash
   # Mover pasta para wp-content/plugins/
   mv wordpress-plugin/ /path/to/wordpress/wp-content/plugins/pericia-trabalhista-pro/
   ```

3. **Ativar no painel**
   - Ir para **Plugins > Plugins Instalados**
   - Ativar **Perícia Trabalhista Pro**

---

## ⚙️ Configuração do Plugin

### 1. Configurações Iniciais
- Ir em **Perícia Pro > Configurações**
- Configurar URL da API (se necessário)
- Definir chave de API
- Configurar webhooks

### 2. Permissões e Roles
- **Perito**: Acesso completo a processos e laudos
- **Assistente Pericial**: Acesso somente leitura

### 3. Shortcodes
```php
// Formulário de processo
[pericia_trabalhista_form type="processo"]

// Dashboard
[pericia_trabalhista_dashboard user_role="perito"]
```

---

## 🔗 Integração React ↔ WordPress

### 1. Configurar API no React
```typescript
// src/config/api.ts
export const API_BASE = 'https://seu-site.com/wp-json/pericia-trabalhista-pro/v1';
```

### 2. Autenticação
- Usar nonce do WordPress para segurança
- Implementar JWT se necessário

### 3. Webhooks
- Configurar endpoints para receber dados do WordPress
- Implementar sincronização automática

---

## 🌐 Deploy em Produção

### 1. Servidor React (Vercel/Netlify/Heroku)

**Vercel:**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Netlify:**
```bash
# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

### 2. Servidor WordPress

**Requisitos do Servidor:**
- PHP 7.4+
- MySQL 5.6+
- WordPress 5.8+

**Configurações:**
```php
// wp-config.php
define('WP_MEMORY_LIMIT', '256M');
define('WP_MAX_MEMORY_LIMIT', '512M');
```

---

## 🔍 Verificação de Instalação

### Sistema React
- [ ] Acessar `http://localhost:3000`
- [ ] Verificar todas as páginas funcionam
- [ ] Testar navegação responsiva
- [ ] Validar formulários e API

### Plugin WordPress
- [ ] Plugin aparece na lista
- [ ] Menu "Perícia Pro" disponível
- [ ] Custom Post Types criados
- [ ] API endpoints funcionando
- [ ] Shortcodes renderizando

---

## 🚨 Solução de Problemas

### React Issues
```bash
# Limpar cache
npm run clean

# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

### WordPress Issues
```php
// Habilitar debug
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
```

### Permissões
```bash
# Corrigir permissões
chmod 755 wp-content/plugins/pericia-trabalhista-pro
chmod 644 wp-content/plugins/pericia-trabalhista-pro/*.php
```

---

## 📊 Performance

### Otimizações React
- ✅ Code splitting implementado
- ✅ Lazy loading de imagens
- ✅ Memoização de componentes
- ✅ Bundle otimizado

### Otimizações WordPress
- ✅ Cache de consultas
- ✅ Scripts otimizados
- ✅ CSS minificado
- ✅ API REST eficiente

---

## 🔐 Segurança

### React
- ✅ Validação de inputs
- ✅ Sanitização de dados
- ✅ Proteção XSS
- ✅ Environment variables

### WordPress
- ✅ Nonces implementados
- ✅ Capacidades verificadas
- ✅ SQL injection protegido
- ✅ CSRF protection

---

## 📞 Suporte

### Documentação
- [README-REFACTORING.md](./README-REFACTORING.md)
- [README-SUDOKU-REFACTORING.md](./README-SUDOKU-REFACTORING.md)
- [wordpress-plugin/README.md](./wordpress-plugin/README.md)

### Contato
- Email: suporte@pericia-trabalhista-pro.com
- Docs: https://docs.pericia-trabalhista-pro.com

---

## 🎉 Pronto!

Após seguir estes passos, você terá:
- ✅ Sistema React funcionando
- ✅ Plugin WordPress ativo
- ✅ Integração completa
- ✅ Sudoku Georota integrado
- ✅ Sistema responsivo e otimizado

**Parabéns! 🚀**

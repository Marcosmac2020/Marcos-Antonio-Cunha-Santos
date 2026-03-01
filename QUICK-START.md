# 🚀 Quick Start - Perícia Trabalhista Pro

## 🎯 Setup Rápido (3 Opções)

---

### 🥇 Opção 1: XAMPP (Recomendado)

**1. Instalar XAMPP**
```
https://www.apachefriends.org/download.html
```

**2. Iniciar Serviços**
- Abrir XAMPP Control Panel
- Start Apache ✅
- Start MySQL ✅

**3. Configurar WordPress**
```bash
# Baixar WordPress
https://wordpress.org/latest.zip

# Extrair para: C:\xampp\htdocs\wordpress\

# Criar Database
# Acessar: http://localhost/phpmyadmin
# Database: pericia_trabalhista
```

**4. Instalar Plugin**
```bash
# Copiar pasta:
wordpress-plugin\* → C:\xampp\htdocs\wordpress\wp-content\plugins\pericia-trabalhista-pro\

# Acessar:
http://localhost/wordpress/wp-admin

# Ativar plugin: Perícia Trabalhista Pro
```

---

### 🥈 Opção 2: Docker (Automático)

**1. Verificar Docker**
```bash
docker --version
docker-compose --version
```

**2. Iniciar Containers**
```bash
docker-compose up -d
```

**3. Acessar WordPress**
- Frontend: http://localhost:8080
- Admin: http://localhost:8080/wp-admin
- Plugin: Já instalado!

---

### 🥉 Opção 3: Laragon (Portátil)

**1. Baixar Laragon**
```
https://laragon.org/download/
```

**2. WordPress Automático**
- Menu > Quick app > WordPress
- Configuração automática

**3. Instalar Plugin**
```bash
# Copiar para pasta plugins do WordPress
wordpress-plugin\* → [pasta-laragon]\wp-content\plugins\pericia-trabalhista-pro\
```

---

## 🎮 Sistema React (Já Funcionando)

**Iniciar React:**
```bash
npm run dev
# Acessar: http://localhost:3000
```

**Build Produção:**
```bash
npm run build
npm run preview
# Acessar: http://localhost:4173
```

---

## 📱 URLs Importantes

### WordPress (XAMPP)
- Admin: http://localhost/wordpress/wp-admin
- Plugin: http://localhost/wordpress/wp-admin/admin.php?page=pericia-trabalhista-pro
- API: http://localhost/wordpress/wp-json/pericia-trabalhista-pro/v1/

### WordPress (Docker)
- Admin: http://localhost:8080/wp-admin
- Plugin: http://localhost:8080/wp-admin/admin.php?page=pericia-trabalhista-pro
- API: http://localhost:8080/wp-json/pericia-trabalhista-pro/v1/

### React
- Dev: http://localhost:3000
- Preview: http://localhost:4173

---

## 🔧 Configuração Rápida

### 1. WordPress Setup
```bash
# Database
Nome: pericia_trabalhista
User: root (XAMPP) / pericia (Docker)
Password: (vazio XAMPP) / pericia123 (Docker)
```

### 2. Plugin Activation
```bash
# 1. Login WordPress Admin
# 2. Plugins > Installed Plugins
# 3. "Perícia Trabalhista Pro" > Activate
# 4. Configurar em Perícia Trabalhista Pro menu
```

### 3. React Integration
```typescript
// src/config/api.ts
export const API_BASE = 'http://localhost:8080/wp-json/pericia-trabalhista-pro/v1';
```

---

## 🧪 Testes Rápidos

### WordPress Plugin
```bash
# Testar API
curl http://localhost:8080/wp-json/pericia-trabalhista-pro/v1/processos

# Verificar menu
# Deve aparecer: Perícia Trabalhista Pro
```

### React App
```bash
# Testar componentes
npm test

# Verificar Sudoku
http://localhost:3000/jogos
```

---

## 🎯 Checklist Final

### ✅ WordPress Local
- [ ] XAMPP/Docker funcionando
- [ ] WordPress instalado
- [ ] Plugin ativo
- [ ] API respondendo

### ✅ React App
- [ ] npm install feito
- [ ] Servidor rodando
- [ ] Sudoku funcionando
- [ ] Testes passando

### ✅ Integração
- [ ] React conectado ao WordPress
- [ ] CORS configurado
- [ ] Dados sincronizando

---

## 🚀 Pronto para Uso!

**Após setup completo você terá:**
- ✅ Sistema React completo
- ✅ Plugin WordPress funcional
- ✅ Sudoku Georota integrado
- ✅ API REST funcionando
- ✅ Ambiente full-stack local

**Escolha sua opção e vamos começar! 🎉**

# 🐳 WordPress + Plugin - Docker Setup

## 🎯 Setup Automático com Docker

A forma mais rápida e confiável de testar o plugin WordPress localmente!

---

## 🚀 Pré-requisitos

### Docker Desktop
```bash
# 1. Baixar Docker Desktop
https://www.docker.com/products/docker-desktop/

# 2. Instalar e reiniciar
# 3. Verificar instalação
docker --version
docker-compose --version
```

---

## ⚡ Setup Rápido (1 Comando)

### 1. Iniciar Ambiente Completo
```bash
# Na pasta do projeto:
docker-compose up -d

# Resultado:
# - WordPress: http://localhost:8080
# - phpMyAdmin: http://localhost:8081
# - MySQL: localhost:3306
```

### 2. Aguardar Inicialização
```bash
# Verificar logs:
docker-compose logs -f wordpress

# Aguardar mensagem: "WordPress ready"
```

### 3. Configurar WordPress
```bash
# Acessar: http://localhost:8080
# 1. Idioma: Português
# 2. Título: Perícia Trabalhista Pro
# 3. Usuário: admin
# 4. Senha: admin123
# 5. Email: admin@pericia.local
```

---

## 🔧 Serviços Configurados

### WordPress (Porta 8080)
- **URL**: http://localhost:8080
- **Admin**: http://localhost:8080/wp-admin
- **Plugin**: Já montado no container
- **Database**: Automática

### MySQL (Porta 3306)
- **Host**: localhost:3306
- **Database**: pericia_trabalhista
- **User**: pericia
- **Password**: pericia123

### phpMyAdmin (Porta 8081)
- **URL**: http://localhost:8081
- **Server**: db
- **User**: pericia
- **Password**: pericia123

---

## 📁 Estrutura de Arquivos

```
perícia-trabalhista-pro/
├── docker-compose.yml          # Configuração Docker
├── wordpress-plugin/          # Plugin (montado no container)
├── wordpress-data/           # Dados WordPress (criado automaticamente)
└── mysql-data/              # Dados MySQL (criado automaticamente)
```

---

## 🔄 Comandos Úteis

### Gerenciar Containers
```bash
# Iniciar todos os serviços
docker-compose up -d

# Verificar status
docker-compose ps

# Ver logs
docker-compose logs -f wordpress
docker-compose logs -f db

# Parar serviços
docker-compose down

# Reiniciar serviços
docker-compose restart

# Remover tudo (incluindo dados)
docker-compose down -v
```

### Acessar Containers
```bash
# Entrar no container WordPress
docker-compose exec wordpress bash

# Entrar no container MySQL
docker-compose exec db mysql -u pericia -p pericia_trabalhista

# Backup database
docker-compose exec db mysqldump -u pericia -p pericia_trabalhista > backup.sql
```

---

## 🔌 Plugin já Montado

### Vantagens do Setup Docker
- ✅ **Plugin já instalado** no container
- ✅ **Hot reload** de arquivos do plugin
- ✅ **Isolamento** do ambiente
- ✅ **Reproduzível** em qualquer máquina
- ✅ **Zero configuração** manual

### Desenvolvimento do Plugin
```bash
# Editar arquivos em:
./wordpress-plugin/pericia-trabalhista-pro.php

# Mudanças aparecem automaticamente em:
http://localhost:8080/wp-admin/admin.php?page=pericia-trabalhista-pro

# Para ativar plugin (primeira vez):
# 1. Acessar: http://localhost:8080/wp-admin
# 2. Plugins > Perícia Trabalhista Pro > Ativar
```

---

## 🧪 Testes do Plugin

### 1. Verificar Instalação
```bash
# Acessar admin WordPress:
http://localhost:8080/wp-admin
# User: admin
# Password: admin123

# Verificar plugin:
Plugins > Installed Plugins > Perícia Trabalhista Pro (Active)
```

### 2. Testar Menu Admin
```bash
# Menu deve aparecer:
Perícia Trabalhista Pro
├── Dashboard
├── Processos
├── Laudos
└── Configurações
```

### 3. Testar API REST
```bash
# Testar endpoints:
curl http://localhost:8080/wp-json/pericia-trabalhista-pro/v1/processos
curl http://localhost:8080/wp-json/pericia-trabalhista-pro/v1/laudos

# Resposta esperada:
{"data": [], "status": "success"}
```

### 4. Testar Shortcodes
```bash
# Criar página teste:
# 1. Pages > Add New
# 2. Conteúdo: [pericia_trabalhista_form type="processo"]
# 3. Publicar
# 4. Visualizar: http://localhost:8080/pagina-teste
```

---

## 🔗 Integração React ↔ WordPress Docker

### 1. Configurar React
```typescript
// src/config/api.ts
export const API_BASE = 'http://localhost:8080/wp-json/pericia-trabalhista-pro/v1';
export const WP_BASE = 'http://localhost:8080';
```

### 2. CORS no WordPress
```php
// O plugin já tem CORS configurado
// Mas se necessário, adicionar ao functions.php:
header('Access-Control-Allow-Origin: http://localhost:3000');
```

### 3. Testar Conexão
```bash
# Iniciar React:
npm run dev

# Testar API do React:
curl http://localhost:3000/api/test
```

---

## 🚨 Solução de Problemas

### Container não inicia
```bash
# Verificar portas:
netstat -ano | findstr ":8080"
netstat -ano | findstr ":3306"

# Liberar portas ou mudar no docker-compose.yml
```

### Plugin não aparece
```bash
# Verificar permissões:
docker-compose exec wordpress ls -la /var/www/html/wp-content/plugins/

# Reiniciar container:
docker-compose restart wordpress
```

### Database connection error
```bash
# Verificar logs MySQL:
docker-compose logs db

# Testar conexão:
docker-compose exec db mysql -u pericia -p pericia_trabalhista
```

---

## 📱 Acesso Rápido

### URLs Importantes
```bash
# WordPress Frontend:  http://localhost:8080
# WordPress Admin:     http://localhost:8080/wp-admin
# Plugin Admin:       http://localhost:8080/wp-admin/admin.php?page=pericia-trabalhista-pro
# phpMyAdmin:         http://localhost:8081
# API Endpoints:      http://localhost:8080/wp-json/pericia-trabalhista-pro/v1/
# React App:         http://localhost:3000
```

### Credenciais Padrão
```bash
# WordPress Admin:
User: admin
Password: admin123

# MySQL:
Host: localhost:3306
Database: pericia_trabalhista
User: pericia
Password: pericia123

# phpMyAdmin:
Server: db
User: pericia
Password: pericia123
```

---

## 🎯 Checklist Final

### Docker Setup ✅
- [ ] Docker Desktop instalado
- [ ] docker-compose up -d executado
- [ ] WordPress acessível em localhost:8080
- [ ] Plugin ativo no painel

### Plugin ✅
- [ ] Menu admin visível
- [ ] API endpoints respondendo
- [ ] Custom post types criados
- [ ] Shortcodes funcionando

### Integração ✅
- [ ] React conectado ao WordPress Docker
- [ ] CORS configurado
- [ ] Dados sincronizando
- [ ] Testes E2E funcionando

---

## 🚀 Benefícios do Setup Docker

- ✅ **Zero dependências** no sistema host
- ✅ **Ambiente limpo** e isolado
- ✅ **Reproduzível** em qualquer máquina
- ✅ **Plugin já montado** para desenvolvimento
- ✅ **Hot reload** automático
- ✅ **Fácil reset** com docker-compose down

**Com Docker, você terá ambiente WordPress + Plugin funcionando em menos de 5 minutos! 🚀**

# 🐙 GitHub Pages Setup - Perícia Trabalhista Pro

## 📋 Pré-requisitos

### ✅ **Já Concluído:**
- ✅ Git inicializado
- ✅ Build otimizado gerado
- ✅ Commit inicial feito
- ✅ Configuração Vite para GitHub Pages

---

## 🚀 Próximos Passos

### **1. Criar Repositório GitHub**
```
👉 Acesse: https://github.com/new
👉 Repository name: pericia-trabalhista-pro
👉 Description: Sistema completo para gestão de laudos periciais trabalhistas
👉 Public: ✅
👉 Add README: ✅
👉 Create repository
```

### **2. Conectar Local ao Remote**
```bash
# Após criar o repositório:
git remote add origin https://github.com/SEU_USERNAME/pericia-trabalhista-pro.git
git branch -M main
git push -u origin main
```

### **3. Configurar GitHub Pages**
```
👉 No repositório GitHub:
Settings > Pages > Source

👉 Configure:
Source: Deploy from a branch
Branch: main
Folder: /root

👉 Save
```

---

## 🌐 URLs Finais

### **Após Deploy:**
```
🌐 GitHub Pages: https://SEU_USERNAME.github.io/pericia-trabalhista-pro/
🎮 Sudoku: https://SEU_USERNAME.github.io/pericia-trabalhista-pro/jogos
📊 Dashboard: https://SEU_USERNAME.github.io/pericia-trabalhista-pro/dashboard
```

### **WordPress Backend:**
```
🌐 Site: https://marcosantoniocunha.com.br
⚙️ Admin: https://marcosantoniocunha.com.br/wp-admin
🔌 Plugin: https://marcosantoniocunha.com.br/wp-admin/admin.php?page=pericia-trabalhista-pro
🔗 API: https://marcosantoniocunha.com.br/wp-json/pericia-trabalhista-pro/v1/
```

---

## 🔧 Configurações Importantes

### **Vite Config:**
```typescript
base: '/pericia-trabalhista-pro/',
```

### **API URLs:**
```typescript
API_BASE: 'https://marcosantoniocunha.com.br/wp-json/pericia-trabalhista-pro/v1'
WP_BASE: 'https://marcosantoniocunha.com.br'
```

### **Build Optimization:**
```typescript
manualChunks: {
  vendor: ['react', 'react-dom'],
  router: ['react-router-dom'],
  charts: ['recharts'],
  ui: ['lucide-react', 'clsx', 'tailwind-merge']
}
```

---

## 📱 Estrutura do Projeto

### **Frontend (React):**
- Dashboard interativo
- Sistema de laudos
- Sudoku Georota
- Visual ouro velho
- Performance otimizada

### **Backend (WordPress):**
- Plugin completo
- API REST
- Custom Post Types
- Dashboard admin

---

## 🎯 Deploy Automatizado

### **GitHub Actions (Opcional):**
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Setup Node
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    - name: Build
      run: npm ci && npm run build
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

---

## 🎉 Sistema Completo!

**Após seguir estes passos, você terá:**

✅ **Frontend no GitHub Pages**  
✅ **Backend no WordPress**  
✅ **API integrada**  
✅ **Deploy automático**  
✅ **URL profissional**  

---

## 🚀 Vamos Começar!

**Crie o repositório GitHub agora mesmo!** 🎯

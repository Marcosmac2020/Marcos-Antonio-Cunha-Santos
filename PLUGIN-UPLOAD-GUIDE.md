# 📦 Plugin Upload Guide - Perícia Trabalhista Pro

## 🎯 ARQUIVO DISPONÍVEL

### ✅ **Plugin ZIP Gerado:**
```
pericia-trabalhista-pro-wordpress-plugin-updated.zip
Tamanho: ~11 KB
Status: Pronto para upload
```

---

## 🚀 PASSOS PARA UPLOAD

### **1. Acessar WordPress Admin**
```
👉 URL: https://marcosantoniocunha.com.br/wp-admin
👉 Login com suas credenciais
```

### **2. Fazer Upload do Plugin**
```
👉 Menu lateral: Plugins
👉 Add New (canto superior)
👉 Upload Plugin (aba superior)
👉 Choose File
👉 Selecionar: pericia-trabalhista-pro-wordpress-plugin-updated.zip
👉 Install Now
```

### **3. Ativar Plugin**
```
👉 Após upload, clique: Activate Plugin
👉 Plugin aparecerá como: "Perícia Trabalhista Pro"
```

---

## 🔧 O QUE O PLUGIN FAZ

### **Funcionalidades:**
✅ Custom Post Types (Processos, Laudos)  
✅ API REST Endpoints  
✅ Dashboard Administrativo  
✅ Roles e Permissões  
✅ Shortcodes  
✅ Templates PHP  

### **Menu Criado:**
```
Perícia Trabalhista Pro
├── Dashboard
├── Processos
├── Laudos  
├── Configurações
```

---

## 📱 ENDPOINTS API (Após Upload)

### **API REST:**
```
https://marcosantoniocunha.com.br/wp-json/pericia-trabalhista-pro/v1/processos
https://marcosantoniocunha.com.br/wp-json/pericia-trabalhista-pro/v1/laudos
https://marcosantoniocunha.com.br/wp-json/pericia-trabalhista-pro/v1/config
```

### **Teste API:**
```bash
curl https://marcosantoniocunha.com.br/wp-json/pericia-trabalhista-pro/v1/processos
```

---

## 🎮 CONFIGURAÇÃO REACT

### **Atualizar API Base:**
```typescript
// src/config/api.ts
export const API_BASE = 'https://marcosantoniocunha.com.br/wp-json/pericia-trabalhista-pro/v1';
export const WP_BASE = 'https://marcosantoniocunha.com.br';
```

### **Deploy React:**
```bash
npm run build
# Deploy para Vercel/Netlify
```

---

## 🚨 SOLUÇÃO DE PROBLEMAS

### **Erro de Upload:**
- Verificar tamanho máximo do arquivo (geralmente 50MB)
- Verificar permissões da pasta wp-content/uploads
- Tentar upload via FTP se necessário

### **Plugin Não Aparece:**
- Verificar se arquivo está correto
- Verificar logs de erros do WordPress
- Tentar upload manual via FTP

### **API Não Funciona:**
- Verificar se plugin está ativo
- Verificar permalinks (Settings > Permalinks > Save)
- Verificar CORS headers

---

## 🎯 CHECKLIST FINAL

### ✅ Antes do Upload:
- [ ] Plugin ZIP pronto
- [ ] WordPress acessível
- [ ] Backup do site feito

### ✅ Após Upload:
- [ ] Plugin ativado
- [ ] Menu aparece no admin
- [ ] API endpoints respondendo
- [ ] React configurado

---

## 🎉 RESULTADO ESPERADO

Após upload e ativação, você terá:

✅ **Sistema WordPress completo**  
✅ **Plugin Perícia Trabalhista Pro** ativo  
✅ **API REST funcionando**  
✅ **Dashboard administrativo**  
✅ **Integração com React**  
✅ **Sudoku Georota disponível**  

---

## 🚀 PRONTO PARA USO!

**Faça upload do plugin agora mesmo!** 🎯

**Arquivo:** `pericia-trabalhista-pro-wordpress-plugin-updated.zip`

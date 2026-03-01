# Perícia Trabalhista Pro - WordPress Plugin

Plugin WordPress completo para gestão de laudos periciais trabalhistas com integração ao sistema web.

## Funcionalidades

### 🎯 Principais Recursos
- **Gestão de Processos**: Crie, edite e gerencie processos periciais
- **Laudos Periciais**: Geração e gerenciamento de laudos (Formulário 8)
- **Dashboard Administrativo**: Interface completa com estatísticas e gráficos
- **API REST**: Integração completa com sistema externo
- **Shortcodes**: Formulários e dashboards para uso em páginas
- **Roles Personalizadas**: Perito e Assistente Pericial
- **Interface Responsiva**: Funciona em todos os dispositivos

### 📋 Custom Post Types
- **Processos Periciais** (`ptp_process`)
- **Laudos Periciais** (`ptp_laudo`)

### 🔐 Roles e Permissões
- **Perito** (`ptp_perito`): Acesso completo a processos e laudos
- **Assistente Pericial** (`ptp_assistente`): Acesso somente leitura

## Instalação

1. Faça o download do plugin
2. Extraia o arquivo na pasta `/wp-content/plugins/`
3. Ative o plugin através do menu "Plugins" no WordPress
4. Configure as opções em "Perícia Pro > Configurações"

## Configuração

### API Integration
Configure a URL da API e chave de acesso em:
```
WordPress Admin > Perícia Pro > Configurações
```

### Shortcodes Disponíveis

#### Formulário de Processo
```php
[pericia_trabalhista_form type="processo"]
```

#### Dashboard
```php
[pericia_trabalhista_dashboard user_role="perito" show_stats="true"]
```

## API Endpoints

### Processos
- `GET /wp-json/pericia-trabalhista-pro/v1/processos` - Listar processos
- `POST /wp-json/pericia-trabalhista-pro/v1/processos` - Criar processo
- `GET /wp-json/pericia-trabalhista-pro/v1/processos/{id}` - Obter processo
- `PUT /wp-json/pericia-trabalhista-pro/v1/processos/{id}` - Atualizar processo
- `DELETE /wp-json/pericia-trabalhista-pro/v1/processos/{id}` - Deletar processo

### Laudos
- `GET /wp-json/pericia-trabalhista-pro/v1/laudos` - Listar laudos
- `POST /wp-json/pericia-trabalhista-pro/v1/laudos` - Criar laudo

## Estrutura de Arquivos

```
wordpress-plugin/
├── pericia-trabalhista-pro.php     # Plugin principal
├── assets/
│   ├── css/
│   │   ├── admin.css              # Estilos admin
│   │   └── frontend.css           # Estilos frontend
│   └── js/
│       ├── admin.js               # JavaScript admin
│       └── frontend.js            # JavaScript frontend
├── admin/
│   └── templates/
│       ├── dashboard.php          # Template dashboard
│       └── settings.php           # Template configurações
├── public/
│   └── templates/
│       ├── form.php               # Template formulário
│       └── dashboard.php          # Template dashboard público
└── languages/                     # Arquivos de tradução
```

## Desenvolvimento

### Hooks Disponíveis

#### Actions
- `ptp_form:saved` - Após salvar formulário
- `ptp:item:deleted` - Após deletar item

#### Filters
- `ptp_process_data` - Filtrar dados do processo
- `ptp_laudo_data` - Filtrar dados do laudo

### Estilos CSS

O plugin utiliza classes CSS prefixadas com `ptp-` para evitar conflitos:

```css
.ptp-admin-wrapper      /* Container principal admin */
.ptp-dashboard-header    /* Header do dashboard */
.ptp-stats-grid         /* Grid de estatísticas */
.ptp-stat-card          /* Cartão de estatística */
.ptp-form-wrapper       /* Container de formulário */
.ptp-button             /* Botões padrão */
```

### JavaScript

O plugin disponibiliza objetos globais:

```javascript
// Admin
ptp_admin.ajax_url      // URL AJAX admin
ptp_admin.nonce         // Nonce de segurança
ptp_admin.api_base      // Base URL da API

// Frontend  
ptp_ajax.ajax_url       // URL AJAX frontend
ptp_ajax.nonce          // Nonce de segurança
ptp_ajax.api_base       // Base URL da API
```

## Requisitos

- WordPress 5.8+
- PHP 7.4+
- MySQL 5.6+

## Changelog

### 1.0.0
- Lançamento inicial
- Gestão de processos e laudos
- API REST completa
- Dashboard administrativo
- Shortcodes para frontend

## Suporte

Para suporte técnico:
- Email: suporte@pericia-trabalhista-pro.com
- Documentação: https://docs.pericia-trabalhista-pro.com

## Licença

Este plugin está licenciado sob GPL v2 ou posterior.

## Contribuição

Contribuições são bem-vindas! Por favor:
1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

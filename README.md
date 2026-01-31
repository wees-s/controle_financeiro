# 💰 Controle Financeiro Comercial

Sistema simples e local para controle financeiro de comércio, desenvolvido com tecnologias web para acesso via navegador.

## 🚀 Funcionalidades

### 📋 Contas à Pagar
- Cadastro de contas com empresa, valor, data de vencimento
- Especificações (código de barras, PIX, etc.)
- Status de pagamento (Pago/À Pagar)
- Filtros por status e mês
- Alertas visuais para contas vencidas

### 💵 Entradas Financeiras
- Registro de vendas diárias
- Tipos de entrada: Voucher, Débito, Crédito, Pix, Dinheiro
- Filtros por tipo e período
- Histórico completo de transações

### 📊 Dashboard
- Resumo financeiro em tempo real
- Saldo atual (lucro/prejuízo)
- Gráficos de evolução financeira
- Distribuição de entradas por tipo
- Médias diárias e estatísticas

### 📈 Relatórios
- Relatórios mensais detalhados
- Exportação de dados (CSV/JSON)
- Funcionalidade de impressão
- Análise por período

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3 + TailwindCSS** - Design responsivo e moderno
- **JavaScript (Vanilla)** - Lógica e interatividade
- **Chart.js** - Visualização de dados
- **LocalStorage** - Armazenamento local de dados
- **Node.js + Express** - Servidor local (opcional)

## 📦 Instalação e Uso

### Opção 1: Acesso Direto (Recomendado)
1. Clone ou baixe este repositório
2. Abra o arquivo `index.html` diretamente no navegador
3. Pronto! Sistema funcionando offline

### Opção 2: Servidor Local
1. Certifique-se de ter Node.js instalado
2. Instale dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor:
   ```bash
   npm start
   ```
4. Acesse via navegador:
   - Local: `http://localhost:3000`
   - Rede: `http://SEU_IP:3000`

### Opção 3: Servidor Simples
```bash
npx http-server . -p 3000 -o
```

## 🌐 Acesso na Rede Local

Para acessar de outros dispositivos na mesma rede:

1. Descubra seu IP local:
   - **Windows**: `ipconfig` (procure por "IPv4 Address")
   - **Linux/Mac**: `ifconfig` ou `ip addr`

2. Acesse via navegador: `http://SEU_IP:3000`

## 📱 Responsividade

- ✅ Desktop
- ✅ Tablet
- ✅ Smartphone
- ✅ Navegadores modernos

## 💾 Armazenamento de Dados

- **LocalStorage**: Dados salvos no navegador
- **Offline**: Funciona sem internet
- **Exportação**: Backup em CSV/JSON
- **Importação**: Restauração de dados

## 🔧 Configuração

Não requer configuração adicional. Sistema pronto para uso imediato.

## 📝 Estrutura de Arquivos

```
controle_financeiro/
├── index.html              # Página principal
├── css/
│   └── style.css          # Estilos personalizados
├── js/
│   ├── app.js             # Aplicação principal
│   ├── storage.js         # Gerenciamento de dados
│   ├── contas.js          # Módulo de contas
│   ├── entradas.js        # Módulo de entradas
│   └── dashboard.js       # Dashboard e gráficos
├── server.js              # Servidor Node.js
├── package.json           # Dependências
└── README.md              # Documentação
```

## 🎯 Atalhos de Teclado

- `Ctrl + 1`: Dashboard
- `Ctrl + 2`: Contas à Pagar
- `Ctrl + 3`: Entradas
- `Ctrl + 4`: Relatórios

## 🔒 Segurança

- Dados armazenados localmente
- Sem envio de informações para servidores externos
- Acesso limitado à rede local (quando usando servidor)

## 🚀 Deploy

Para hospedar online (opcional):

1. **Vercel/Netlify**: Upload dos arquivos
2. **GitHub Pages**: Repositório público
3. **Servidor próprio**: Upload via FTP

## 📞 Suporte

Sistema desenvolvido para uso local e simplificado. Para dúvidas ou sugestões, consulte a documentação ou entre em contato.

---

**Versão**: 1.0.0  
**Desenvolvimento**: Local e Offline  
**Requisitos**: Navegador web moderno
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

### Relatórios
- Relatórios mensais detalhados
- Exportação de dados (CSV/JSON)
- Funcionalidade de impressão
- Análise por período

### Calculadora
- Acesso via rota `/calcular` no servidor Flask
- Abre a calculadora `Calcdesossa.py` (Tkinter)

## Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3 + TailwindCSS** - Design responsivo e moderno
- **JavaScript (Vanilla)** - Lógica e interatividade
- **Chart.js** - Visualização de dados
- **LocalStorage** - Armazenamento local de dados
- **Python + Flask** - Servidor local do projeto (recomendado)

## Instalação e Uso

### Opção 1: Servidor Flask (Recomendado)

Esta interface é servida pelo `app.py` (na raiz do repositório), que:

- publica esta pasta (`static/`) para o navegador
- disponibiliza a rota `/calcular` que abre a calculadora `Calcdesossa.py` (Tkinter)

Passos:

1. Instale o Flask:
   ```bash
   pip install flask
   ```
2. Rode o servidor na raiz do projeto:
   ```bash
   python app.py
   ```
3. Acesse:
   - `http://127.0.0.1:5000`

Para abrir a calculadora pela interface:

1. Vá no menu **Calculadora**
2. Clique em **Abrir calculadora**

### Opção 2: Acesso Direto (Offline)

1. Clone ou baixe este repositório
2. Abra o arquivo `index.html` diretamente no navegador
3. Pronto! Sistema funcionando offline

## Responsividade

- Desktop
- Tablet
- Smartphone
- Navegadores modernos

## Armazenamento de Dados

- **LocalStorage**: Dados salvos no navegador
- **Offline**: Funciona sem internet
- **Exportação**: Backup em CSV/JSON
- **Importação**: Restauração de dados

## Configuração

Não requer configuração adicional. Sistema pronto para uso imediato.

## Estrutura de Arquivos

```
controle_financeiro/
├── app.py              # Servidor Flask
├── Calcdesossa.py      # Calculadora Tkinter
├── static/
│   ├── index.html      # Página principal
│   ├── css/
│   │   └── style.css  # Estilos personalizados
│   ├── js/
│   │   ├── app.js     # Aplicação principal
│   │   ├── storage.js # Gerenciamento de dados
│   │   ├── contas.js  # Módulo de contas
│   │   ├── entradas.js # Módulo de entradas
│   │   └── dashboard.js # Dashboard e gráficos
│   └── README.md      # Documentação
└── README.md          # Documentação do projeto (raiz)
```

## Atalhos de Teclado

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
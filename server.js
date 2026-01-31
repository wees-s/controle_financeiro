// Servidor Node.js simples para acesso local via IP

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para servir arquivos estáticos
app.use(express.static(__dirname));
app.use(express.json());

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoints para futuras funcionalidades
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Obter configurações do servidor
app.get('/api/config', (req, res) => {
    res.json({
        appName: 'Controle Financeiro Comercial',
        version: '1.0.0',
        environment: 'development',
        features: {
            localstorage: true,
            export: true,
            reports: true
        }
    });
});

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo deu errado!' });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║    🚀 Servidor iniciado com sucesso!                        ║
║                                                              ║
║    Acesso local: http://localhost:${PORT}                      ║
║    Acesso na rede: http://SEU_IP_LOCAL:${PORT}              ║
║                                                              ║
║    Para descobrir seu IP local:                             ║
║    Windows: ipconfig                                        ║
║    Linux/Mac: ifconfig ou ip addr                           ║
║                                                              ║
║    Pressione Ctrl+C para parar o servidor                   ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
    `);
});

// Exportar para uso em testes
module.exports = app;

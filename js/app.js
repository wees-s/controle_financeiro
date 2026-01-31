// Aplicação principal - controle de navegação e funcionalidades globais

class FinanceiroApp {
    constructor() {
        this.secaoAtual = 'dashboard';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.definirDataPadrao();
        this.mostrarSecao('dashboard');
        this.carregarConfiguracoes();
    }

    setupEventListeners() {
        // Listener para mudança de seção
        document.addEventListener('DOMContentLoaded', () => {
            this.atualizarNavegacao();
        });

        // Listener para teclas de atalho
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Listener para beforeunload (alertar sobre dados não salvos)
        window.addEventListener('beforeunload', (e) => {
            // Não necessário pois usamos localStorage que salva automaticamente
        });
    }

    definirDataPadrao() {
        // Definir data atual como padrão para campos de data
        const dataAtual = new Date().toISOString().split('T')[0];
        
        const dataVencimento = document.getElementById('dataVencimento');
        if (dataVencimento && !dataVencimento.value) {
            dataVencimento.value = dataAtual;
        }

        const dataEntrada = document.getElementById('dataEntrada');
        if (dataEntrada && !dataEntrada.value) {
            dataEntrada.value = dataAtual;
        }

        // Definir mês atual para filtros
        const mesAtual = new Date().toISOString().slice(0, 7);
        
        const filtroMes = document.getElementById('filtroMes');
        if (filtroMes && !filtroMes.value) {
            filtroMes.value = mesAtual;
        }

        const filtroMesEntradas = document.getElementById('filtroMesEntradas');
        if (filtroMesEntradas && !filtroMesEntradas.value) {
            filtroMesEntradas.value = mesAtual;
        }

        const relatorioMes = document.getElementById('relatorioMes');
        if (relatorioMes && !relatorioMes.value) {
            relatorioMes.value = mesAtual;
        }
    }

    mostrarSecao(secaoId) {
        // Esconder todas as seções
        const secoes = document.querySelectorAll('.content-section');
        secoes.forEach(secao => {
            secao.classList.add('hidden');
        });

        // Mostrar seção selecionada
        const secaoSelecionada = document.getElementById(secaoId);
        if (secaoSelecionada) {
            secaoSelecionada.classList.remove('hidden');
        }

        // Atualizar navegação
        this.atualizarNavegacaoAtiva(secaoId);
        
        // Atualizar dados da seção
        this.atualizarDadosSecao(secaoId);
        
        this.secaoAtual = secaoId;
    }

    atualizarNavegacaoAtiva(secaoId) {
        const botoes = document.querySelectorAll('.nav-btn');
        botoes.forEach(botao => {
            botao.classList.remove('active', 'text-blue-600', 'bg-blue-50', 'border-blue-600');
            botao.classList.add('text-gray-700', 'border-transparent');
        });

        const botaoAtivo = document.querySelector(`button[onclick="showSection('${secaoId}')"]`);
        if (botaoAtivo) {
            botaoAtivo.classList.add('active', 'text-blue-600', 'bg-blue-50', 'border-blue-600');
            botaoAtivo.classList.remove('text-gray-700', 'border-transparent');
        }
    }

    atualizarDadosSecao(secaoId) {
        switch(secaoId) {
            case 'dashboard':
                if (typeof dashboard !== 'undefined') {
                    dashboard.atualizarDados();
                }
                break;
            case 'contas':
                if (typeof contasManager !== 'undefined') {
                    contasManager.renderizarContas();
                }
                break;
            case 'entradas':
                if (typeof entradasManager !== 'undefined') {
                    entradasManager.renderizarEntradas();
                }
                break;
            case 'relatorios':
                // Carregar dados para relatórios se necessário
                break;
        }
    }

    atualizarNavegacao() {
        this.atualizarNavegacaoAtiva(this.secaoAtual);
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + S para salvar (não necessário com localStorage)
        // Ctrl/Cmd + 1-4 para navegar entre seções
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case '1':
                    e.preventDefault();
                    this.mostrarSecao('dashboard');
                    break;
                case '2':
                    e.preventDefault();
                    this.mostrarSecao('contas');
                    break;
                case '3':
                    e.preventDefault();
                    this.mostrarSecao('entradas');
                    break;
                case '4':
                    e.preventDefault();
                    this.mostrarSecao('relatorios');
                    break;
            }
        }
    }

    carregarConfiguracoes() {
        // Carregar configurações salvas se existirem
        const config = localStorage.getItem('configuracoes');
        if (config) {
            try {
                const configuracoes = JSON.parse(config);
                // Aplicar configurações se necessário
            } catch (error) {
                console.error('Erro ao carregar configurações:', error);
            }
        }
    }

    mostrarNotificacao(mensagem, tipo = 'info', duracao = 3000) {
        const notificacao = document.createElement('div');
        notificacao.className = `notification ${tipo}`;
        notificacao.textContent = mensagem;
        
        document.body.appendChild(notificacao);
        
        setTimeout(() => {
            if (notificacao.parentNode) {
                notificacao.parentNode.removeChild(notificacao);
            }
        }, duracao);
    }

    // Funções utilitárias
    formatarMoeda(valor) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    }

    formatarData(dataString) {
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR');
    }

    validarCPF(cpf) {
        // Implementação básica de validação de CPF se necessário
        return cpf.length === 11;
    }

    validarCNPJ(cnpj) {
        // Implementação básica de validação de CNPJ se necessário
        return cnpj.length === 14;
    }
}

// Funções globais para chamadas inline
function showSection(secaoId) {
    if (window.app) {
        window.app.mostrarSecao(secaoId);
    }
}

function gerarRelatorioMensal() {
    const mesAno = document.getElementById('relatorioMes').value;
    if (!mesAno) {
        window.app.mostrarNotificacao('Selecione um mês para gerar o relatório', 'error');
        return;
    }

    const relatorio = dashboard.gerarRelatorioMensal(mesAno);
    const resultadoDiv = document.getElementById('relatorioResultado');
    
    resultadoDiv.innerHTML = `
        <div class="space-y-4">
            <h4 class="font-semibold text-lg">Relatório de ${new Date(mesAno + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</h4>
            
            <div class="grid grid-cols-2 gap-4">
                <div class="bg-gray-50 p-4 rounded">
                    <p class="text-sm text-gray-600">Total Entradas</p>
                    <p class="text-xl font-bold text-green-600">${window.app.formatarMoeda(relatorio.entradas.valorTotal)}</p>
                    <p class="text-sm text-gray-500">${relatorio.entradas.quantidade} transações</p>
                </div>
                
                <div class="bg-gray-50 p-4 rounded">
                    <p class="text-sm text-gray-600">Total Contas</p>
                    <p class="text-xl font-bold text-red-600">${window.app.formatarMoeda(relatorio.contas.valorTotal)}</p>
                    <p class="text-sm text-gray-500">${relatorio.contas.aPagar} à pagar</p>
                </div>
            </div>
            
            <div class="bg-gray-50 p-4 rounded">
                <p class="text-sm text-gray-600">Saldo do Período</p>
                <p class="text-2xl font-bold ${relatorio.saldo >= 0 ? 'text-green-600' : 'text-red-600'}">
                    ${window.app.formatarMoeda(relatorio.saldo)}
                </p>
            </div>
            
            <div class="bg-gray-50 p-4 rounded">
                <h5 class="font-semibold mb-2">Entradas por Tipo</h5>
                ${Object.entries(relatorio.entradas.porTipo).map(([tipo, dados]) => `
                    <div class="flex justify-between py-1">
                        <span>${tipo}</span>
                        <span>${window.app.formatarMoeda(dados.valor)} (${dados.quantidade})</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    resultadoDiv.classList.remove('hidden');
}

function exportarDados(formato) {
    let dados, filename, mimeType;
    
    if (formato === 'csv') {
        dados = dashboard.exportarParaCSV();
        filename = `controle_financeiro_${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = 'text/csv';
    } else if (formato === 'json') {
        dados = dashboard.exportarParaJSON();
        filename = `controle_financeiro_${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json';
    }
    
    const blob = new Blob([dados], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    window.app.mostrarNotificacao(`Dados exportados em formato ${formato.toUpperCase()} com sucesso!`, 'success');
}

function imprimirRelatorio() {
    window.print();
    window.app.mostrarNotificacao('Janela de impressão aberta', 'info');
}

// Inicializar aplicação
window.app = new FinanceiroApp();

// Disponibilizar globalmente para chamadas inline
window.showSection = showSection;
window.gerarRelatorioMensal = gerarRelatorioMensal;
window.exportarDados = exportarDados;
window.imprimirRelatorio = imprimirRelatorio;

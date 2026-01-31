// Dashboard e gráficos

class DashboardManager {
    constructor() {
        this.graficos = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.atualizarDados();
        this.iniciarGraficos();
    }

    setupEventListeners() {
        // Atualizar dados quando a seção dashboard for mostrada
        document.addEventListener('DOMContentLoaded', () => {
            this.definirMesPadrao();
            this.atualizarDados();
        });

        // Listener para mudança de mês
        const dashboardMes = document.getElementById('dashboardMes');
        if (dashboardMes) {
            dashboardMes.addEventListener('change', () => {
                this.atualizarDados();
            });
        }
    }

    definirMesPadrao() {
        const dashboardMes = document.getElementById('dashboardMes');
        if (dashboardMes && !dashboardMes.value) {
            const mesAtual = new Date().toISOString().slice(0, 7);
            dashboardMes.value = mesAtual;
        }
    }

    atualizarDados() {
        this.atualizarResumoFinanceiro();
        this.atualizarGraficos();
    }

    atualizarResumoFinanceiro() {
        const mesSelecionado = document.getElementById('dashboardMes')?.value;
        if (!mesSelecionado) return;

        const [ano, mes] = mesSelecionado.split('-');
        
        // Obter dados filtrados pelo mês selecionado
        const contasMes = contasManager.contas.filter(c => {
            const dataVenc = new Date(c.dataVencimento);
            return dataVenc.getFullYear() === parseInt(ano) && 
                   (dataVenc.getMonth() + 1) === parseInt(mes);
        });

        const entradasMes = entradasManager.entradas.filter(e => {
            const dataEntrada = new Date(e.dataEntrada);
            return dataEntrada.getFullYear() === parseInt(ano) && 
                   (dataEntrada.getMonth() + 1) === parseInt(mes);
        });

        // Calcular totais
        const totalEntradas = entradasMes.reduce((sum, e) => sum + parseFloat(e.valorCalculado), 0);
        const totalContasPagas = contasMes.filter(c => c.status === 'pago').reduce((sum, c) => sum + parseFloat(c.valor), 0);
        const totalContasAPagar = contasMes.filter(c => c.status === 'à pagar').reduce((sum, c) => sum + parseFloat(c.valor), 0);
        
        // Saldo do mês (entradas - contas pagas)
        const saldoMes = totalEntradas - totalContasPagas;

        // Atualizar elementos
        const saldoElement = document.getElementById('saldoAtual');
        if (saldoElement) {
            saldoElement.textContent = `R$ ${saldoMes.toFixed(2)}`;
            saldoElement.className = saldoMes >= 0 ? 'text-3xl font-bold text-green-600' : 'text-3xl font-bold text-red-600';
        }

        // Total entradas do mês
        const totalEntradasElement = document.getElementById('totalEntradas');
        if (totalEntradasElement) {
            totalEntradasElement.textContent = `R$ ${totalEntradas.toFixed(2)}`;
        }

        const qtdEntradasElement = document.getElementById('qtdEntradas');
        if (qtdEntradasElement) {
            qtdEntradasElement.textContent = `${entradasMes.length} entradas`;
        }

        // Contas pagas do mês
        const contasPagasElement = document.getElementById('contasPagas');
        if (contasPagasElement) {
            contasPagasElement.textContent = `R$ ${totalContasPagas.toFixed(2)}`;
        }

        const qtdContasPagasElement = document.getElementById('qtdContasPagas');
        if (qtdContasPagasElement) {
            const contasPagas = contasMes.filter(c => c.status === 'pago');
            qtdContasPagasElement.textContent = `${contasPagas.length} contas pagas`;
        }

        // Total contas à pagar
        const totalContasElement = document.getElementById('totalContas');
        if (totalContasElement) {
            totalContasElement.textContent = `R$ ${totalContasAPagar.toFixed(2)}`;
        }

        // Contas vencidas
        const dataAtual = new Date();
        const contasVencidas = contasMes.filter(c => {
            if (c.status === 'pago') return false;
            const dataVenc = new Date(c.dataVencimento);
            return dataVenc < dataAtual;
        });

        const contasVencidasElement = document.getElementById('contasVencidas');
        if (contasVencidasElement) {
            contasVencidasElement.textContent = `${contasVencidas.length} contas vencidas`;
        }
    }

    iniciarGraficos() {
        this.criarGraficoEvolucao();
        this.criarGraficoDistribuicao();
    }

    criarGraficoEvolucao() {
        const ctx = document.getElementById('evolucaoChart');
        if (!ctx) return;

        const entradasDados = entradasManager.obterDadosGraficos();
        const contasResumo = contasManager.obterResumo();

        // Preparar dados para o gráfico
        const meses = Object.keys(entradasDados.porMes).sort();
        const valoresEntradas = meses.map(mes => entradasDados.porMes[mes] || 0);
        
        // Calcular contas por mês (simplificado)
        const valoresContas = meses.map(mes => {
            // Para simplificar, vamos usar uma média ou estimativa
            return contasResumo.valorMes / 3; // Estimativa mensal
        });

        if (this.graficos.evolucao) {
            this.graficos.evolucao.destroy();
        }

        this.graficos.evolucao = new Chart(ctx, {
            type: 'line',
            data: {
                labels: meses.map(mes => {
                    const [ano, mesNum] = mes.split('-');
                    return `${mesNum}/${ano}`;
                }),
                datasets: [{
                    label: 'Entradas',
                    data: valoresEntradas,
                    borderColor: 'rgb(34, 197, 94)',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Contas à Pagar',
                    data: valoresContas,
                    borderColor: 'rgb(239, 68, 68)',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': R$ ' + context.parsed.y.toFixed(2);
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + value.toFixed(0);
                            }
                        }
                    }
                }
            }
        });
    }

    criarGraficoDistribuicao() {
        const ctx = document.getElementById('distribuicaoChart');
        if (!ctx) return;

        const entradasDados = entradasManager.obterDadosGraficos();

        if (this.graficos.distribuicao) {
            this.graficos.distribuicao.destroy();
        }

        const tipos = Object.keys(entradasDados.porTipo);
        const valores = Object.values(entradasDados.porTipo);

        this.graficos.distribuicao = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: tipos,
                datasets: [{
                    data: valores,
                    backgroundColor: [
                        'rgba(147, 51, 234, 0.8)',   // Voucher - Purple
                        'rgba(59, 130, 246, 0.8)',   // Débito - Blue
                        'rgba(34, 197, 94, 0.8)',    // Crédito - Green
                        'rgba(251, 146, 60, 0.8)',   // Pix - Orange
                        'rgba(250, 204, 21, 0.8)'    // Dinheiro - Yellow
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return context.label + ': R$ ' + context.parsed.toFixed(2) + ' (' + percentage + '%)';
                            }
                        }
                    }
                }
            }
        });
    }

    atualizarGraficos() {
        if (this.graficos.evolucao) {
            this.criarGraficoEvolucao();
        }
        if (this.graficos.distribuicao) {
            this.criarGraficoDistribuicao();
        }
    }

    // Gerar relatório mensal
    gerarRelatorioMensal(mesAno) {
        const [ano, mes] = mesAno.split('-');
        
        const contas = contasManager.contas.filter(c => {
            const dataVenc = new Date(c.dataVencimento);
            return dataVenc.getFullYear() === parseInt(ano) && 
                   (dataVenc.getMonth() + 1) === parseInt(mes);
        });

        const entradas = entradasManager.entradas.filter(e => {
            const dataEntrada = new Date(e.dataEntrada);
            return dataEntrada.getFullYear() === parseInt(ano) && 
                   (dataEntrada.getMonth() + 1) === parseInt(mes);
        });

        const totalContas = contas.reduce((sum, c) => sum + parseFloat(c.valor), 0);
        const totalEntradas = entradas.reduce((sum, e) => sum + parseFloat(e.valor), 0);
        const saldo = totalEntradas - totalContas;

        return {
            periodo: mesAno,
            contas: {
                quantidade: contas.length,
                valorTotal: totalContas,
                pagas: contas.filter(c => c.status === 'pago').length,
                aPagar: contas.filter(c => c.status === 'à pagar').length
            },
            entradas: {
                quantidade: entradas.length,
                valorTotal: totalEntradas,
                porTipo: this.agruparEntradasPorTipo(entradas)
            },
            saldo: saldo,
            detalhes: {
                contas: contas,
                entradas: entradas
            }
        };
    }

    agruparEntradasPorTipo(entradas) {
        const agrupado = {};
        entradas.forEach(entrada => {
            if (!agrupado[entrada.tipoEntrada]) {
                agrupado[entrada.tipoEntrada] = {
                    quantidade: 0,
                    valor: 0
                };
            }
            agrupado[entrada.tipoEntrada].quantidade++;
            agrupado[entrada.tipoEntrada].valor += parseFloat(entrada.valor);
        });
        return agrupado;
    }

    // Exportar dados
    exportarParaCSV() {
        const dados = storage.exportarDados();
        
        let csv = 'Tipo,Data,Valor,Descrição,Status\n';
        
        // Adicionar contas
        dados.contas.forEach(conta => {
            csv += `Conta,"${conta.dataVencimento}",${conta.valor},"${conta.empresa} - ${conta.especificacao || ''}","${conta.status}"\n`;
        });
        
        // Adicionar entradas
        dados.entradas.forEach(entrada => {
            csv += `Entrada,"${entrada.dataEntrada}",${entrada.valor},"${entrada.tipoEntrada}","-\n`;
        });
        
        return csv;
    }

    exportarParaJSON() {
        const dados = storage.exportarDados();
        return JSON.stringify(dados, null, 2);
    }
}

// Instância global
const dashboard = new DashboardManager();

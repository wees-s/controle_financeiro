// Sistema de armazenamento local usando LocalStorage

class StorageManager {
    constructor() {
        this.keys = {
            contas: 'contas_pagar',
            entradas: 'entradas_financeiras',
            config: 'configuracoes'
        };
    }

    // Salvar contas
    salvarContas(contas) {
        try {
            localStorage.setItem(this.keys.contas, JSON.stringify(contas));
            return true;
        } catch (error) {
            console.error('Erro ao salvar contas:', error);
            return false;
        }
    }

    // Carregar contas
    carregarContas() {
        try {
            const contas = localStorage.getItem(this.keys.contas);
            return contas ? JSON.parse(contas) : [];
        } catch (error) {
            console.error('Erro ao carregar contas:', error);
            return [];
        }
    }

    // Salvar entradas
    salvarEntradas(entradas) {
        try {
            localStorage.setItem(this.keys.entradas, JSON.stringify(entradas));
            return true;
        } catch (error) {
            console.error('Erro ao salvar entradas:', error);
            return false;
        }
    }

    // Carregar entradas
    carregarEntradas() {
        try {
            const entradas = localStorage.getItem(this.keys.entradas);
            return entradas ? JSON.parse(entradas) : [];
        } catch (error) {
            console.error('Erro ao carregar entradas:', error);
            return [];
        }
    }

    // Adicionar uma conta
    adicionarConta(conta) {
        const contas = this.carregarContas();
        conta.id = this.gerarId();
        conta.dataCriacao = new Date().toISOString();
        contas.push(conta);
        this.salvarContas(contas);
        return conta;
    }

    // Adicionar uma entrada
    adicionarEntrada(entrada) {
        const entradas = this.carregarEntradas();
        entrada.id = this.gerarId();
        entrada.dataCriacao = new Date().toISOString();
        entradas.push(entrada);
        this.salvarEntradas(entradas);
        return entrada;
    }

    // Atualizar conta
    atualizarConta(id, dadosAtualizados) {
        const contas = this.carregarContas();
        const index = contas.findIndex(conta => conta.id === id);
        if (index !== -1) {
            contas[index] = { ...contas[index], ...dadosAtualizados };
            this.salvarContas(contas);
            return contas[index];
        }
        return null;
    }

    // Atualizar entrada
    atualizarEntrada(id, dadosAtualizados) {
        const entradas = this.carregarEntradas();
        const index = entradas.findIndex(entrada => entrada.id === id);
        if (index !== -1) {
            entradas[index] = { ...entradas[index], ...dadosAtualizados };
            this.salvarEntradas(entradas);
            return entradas[index];
        }
        return null;
    }

    // Excluir conta
    excluirConta(id) {
        const contas = this.carregarContas();
        const contasFiltradas = contas.filter(conta => conta.id !== id);
        this.salvarContas(contasFiltradas);
        return contas.length !== contasFiltradas.length;
    }

    // Excluir entrada
    excluirEntrada(id) {
        const entradas = this.carregarEntradas();
        const entradasFiltradas = entradas.filter(entrada => entrada.id !== id);
        this.salvarEntradas(entradasFiltradas);
        return entradas.length !== entradasFiltradas.length;
    }

    // Gerar ID único
    gerarId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Limpar todos os dados
    limparDados() {
        try {
            localStorage.removeItem(this.keys.contas);
            localStorage.removeItem(this.keys.entradas);
            localStorage.removeItem(this.keys.config);
            return true;
        } catch (error) {
            console.error('Erro ao limpar dados:', error);
            return false;
        }
    }

    // Exportar dados
    exportarDados() {
        return {
            contas: this.carregarContas(),
            entradas: this.carregarEntradas(),
            dataExportacao: new Date().toISOString()
        };
    }

    // Importar dados
    importarDados(dados) {
        try {
            if (dados.contas) {
                this.salvarContas(dados.contas);
            }
            if (dados.entradas) {
                this.salvarEntradas(dados.entradas);
            }
            return true;
        } catch (error) {
            console.error('Erro ao importar dados:', error);
            return false;
        }
    }

    // Obter estatísticas
    obterEstatisticas() {
        const contas = this.carregarContas();
        const entradas = this.carregarEntradas();
        
        const dataAtual = new Date();
        const mesAtual = dataAtual.getMonth();
        const anoAtual = dataAtual.getFullYear();

        // Contas à pagar
        const contasAPagar = contas.filter(c => c.status === 'à pagar');
        const contasPagas = contas.filter(c => c.status === 'pago');
        const contasVencidas = contas.filter(c => {
            if (c.status === 'pago') return false;
            const dataVenc = new Date(c.dataVencimento);
            return dataVenc < dataAtual;
        });

        const totalContasAPagar = contasAPagar.reduce((sum, c) => sum + parseFloat(c.valor), 0);
        const totalContasPagas = contasPagas.reduce((sum, c) => sum + parseFloat(c.valor), 0);

        // Entradas do mês
        const entradasMes = entradas.filter(e => {
            const dataEntrada = new Date(e.dataEntrada);
            return dataEntrada.getMonth() === mesAtual && dataEntrada.getFullYear() === anoAtual;
        });

        const totalEntradasMes = entradasMes.reduce((sum, e) => sum + parseFloat(e.valor), 0);

        // Agrupar entradas por tipo
        const entradasPorTipo = {};
        entradasMes.forEach(entrada => {
            if (!entradasPorTipo[entrada.tipoEntrada]) {
                entradasPorTipo[entrada.tipoEntrada] = 0;
            }
            entradasPorTipo[entrada.tipoEntrada] += parseFloat(entrada.valor);
        });

        return {
            contas: {
                total: contas.length,
                aPagar: contasAPagar.length,
                pagas: contasPagas.length,
                vencidas: contasVencidas.length,
                valorAPagar: totalContasAPagar,
                valorPago: totalContasPagas
            },
            entradas: {
                totalMes: entradasMes.length,
                valorMes: totalEntradasMes,
                mediaDiaria: entradasMes.length > 0 ? totalEntradasMes / 30 : 0,
                porTipo: entradasPorTipo
            },
            saldo: totalEntradasMes - totalContasAPagar
        };
    }
}

// Instância global do storage
const storage = new StorageManager();

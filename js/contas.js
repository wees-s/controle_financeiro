// Gerenciamento de contas à pagar

class ContasManager {
    constructor() {
        this.contas = [];
        this.init();
    }

    init() {
        this.carregarContas();
        this.setupEventListeners();
        this.renderizarContas();
    }

    setupEventListeners() {
        // Formulário de contas
        const form = document.getElementById('contaForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.adicionarConta();
            });
        }

        // Filtros
        const filtroStatus = document.getElementById('filtroStatus');
        const filtroMes = document.getElementById('filtroMes');
        
        if (filtroStatus) {
            filtroStatus.addEventListener('change', () => this.renderizarContas());
        }
        
        if (filtroMes) {
            filtroMes.addEventListener('change', () => this.renderizarContas());
        }
    }

    carregarContas() {
        this.contas = storage.carregarContas();
    }

    adicionarConta() {
        const empresa = document.getElementById('empresa').value.trim();
        const valor = parseFloat(document.getElementById('valor').value);
        const dataVencimento = document.getElementById('dataVencimento').value;
        const especificacao = document.getElementById('especificacao').value.trim();
        const status = document.getElementById('status').value;

        if (!empresa || !valor || !dataVencimento) {
            this.mostrarNotificacao('Preencha todos os campos obrigatórios!', 'error');
            return;
        }

        const conta = {
            empresa,
            valor,
            dataVencimento,
            especificacao,
            status
        };

        const novaConta = storage.adicionarConta(conta);
        this.contas.push(novaConta);
        
        this.limparFormulario();
        this.renderizarContas();
        this.mostrarNotificacao('Conta adicionada com sucesso!', 'success');
        
        // Atualizar dashboard
        if (typeof dashboard !== 'undefined') {
            dashboard.atualizarDados();
        }
    }

    editarConta(id) {
        const conta = this.contas.find(c => c.id === id);
        if (!conta) return;

        // Preencher formulário com dados da conta
        document.getElementById('empresa').value = conta.empresa;
        document.getElementById('valor').value = conta.valor;
        document.getElementById('dataVencimento').value = conta.dataVencimento;
        document.getElementById('especificacao').value = conta.especificacao || '';
        document.getElementById('status').value = conta.status;

        // Remover conta atual para edição
        this.excluirConta(id, false);
        
        // Scroll para o formulário
        document.getElementById('contaForm').scrollIntoView({ behavior: 'smooth' });
    }

    excluirConta(id, mostrarConfirmacao = true) {
        if (mostrarConfirmacao && !confirm('Tem certeza que deseja excluir esta conta?')) {
            return;
        }

        if (storage.excluirConta(id)) {
            this.contas = this.contas.filter(c => c.id !== id);
            this.renderizarContas();
            this.mostrarNotificacao('Conta excluída com sucesso!', 'success');
            
            // Atualizar dashboard
            if (typeof dashboard !== 'undefined') {
                dashboard.atualizarDados();
            }
        }
    }

    toggleStatus(id) {
        const conta = this.contas.find(c => c.id === id);
        if (!conta) return;

        const novoStatus = conta.status === 'pago' ? 'à pagar' : 'pago';
        const dadosAtualizados = { status: novoStatus };
        
        if (storage.atualizarConta(id, dadosAtualizados)) {
            conta.status = novoStatus;
            this.renderizarContas();
            this.mostrarNotificacao(`Status atualizado para ${novoStatus}!`, 'success');
            
            // Atualizar dashboard
            if (typeof dashboard !== 'undefined') {
                dashboard.atualizarDados();
            }
        }
    }

    renderizarContas() {
        const tbody = document.getElementById('contasTableBody');
        if (!tbody) return;

        const filtroStatus = document.getElementById('filtroStatus')?.value || 'todos';
        const filtroMes = document.getElementById('filtroMes')?.value;

        let contasFiltradas = this.contas;

        // Aplicar filtros
        if (filtroStatus !== 'todos') {
            contasFiltradas = contasFiltradas.filter(c => c.status === filtroStatus);
        }

        if (filtroMes) {
            const [ano, mes] = filtroMes.split('-');
            contasFiltradas = contasFiltradas.filter(c => {
                const dataVenc = new Date(c.dataVencimento);
                return dataVenc.getFullYear() === parseInt(ano) && 
                       (dataVenc.getMonth() + 1) === parseInt(mes);
            });
        }

        // Ordenar por data de vencimento
        contasFiltradas.sort((a, b) => new Date(a.dataVencimento) - new Date(b.dataVencimento));

        tbody.innerHTML = '';

        if (contasFiltradas.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-8 text-gray-500">
                        Nenhuma conta encontrada
                    </td>
                </tr>
            `;
            return;
        }

        contasFiltradas.forEach(conta => {
            const tr = document.createElement('tr');
            const dataVenc = new Date(conta.dataVencimento);
            const dataAtual = new Date();
            const vencida = dataVenc < dataAtual && conta.status !== 'pago';
            
            let statusClass = 'status-a-pagar';
            let statusText = 'À Pagar';
            
            if (conta.status === 'pago') {
                statusClass = 'status-pago';
                statusText = 'Pago';
            } else if (vencida) {
                statusClass = 'status-vencido';
                statusText = 'Vencido';
            }

            tr.innerHTML = `
                <td class="px-4 py-3 font-medium">${this.escapeHtml(conta.empresa)}</td>
                <td class="px-4 py-3">R$ ${parseFloat(conta.valor).toFixed(2)}</td>
                <td class="px-4 py-3">${this.formatarData(conta.dataVencimento)}</td>
                <td class="px-4 py-3">
                    <span class="text-sm text-gray-600">${this.escapeHtml(conta.especificacao || '-')}</span>
                </td>
                <td class="px-4 py-3">
                    <span class="${statusClass}">${statusText}</span>
                </td>
                <td class="px-4 py-3">
                    <div class="flex gap-2">
                        <button onclick="contasManager.toggleStatus('${conta.id}')" 
                                class="text-blue-600 hover:text-blue-800 text-sm"
                                title="Alterar status">
                            ✓
                        </button>
                        <button onclick="contasManager.editarConta('${conta.id}')" 
                                class="text-green-600 hover:text-green-800 text-sm"
                                title="Editar">
                            ✏️
                        </button>
                        <button onclick="contasManager.excluirConta('${conta.id}')" 
                                class="text-red-600 hover:text-red-800 text-sm"
                                title="Excluir">
                            🗑️
                        </button>
                    </div>
                </td>
            `;
            
            tbody.appendChild(tr);
        });
    }

    limparFormulario() {
        const form = document.getElementById('contaForm');
        if (form) {
            form.reset();
            // Definir data atual como padrão
            document.getElementById('dataVencimento').value = new Date().toISOString().split('T')[0];
        }
    }

    formatarData(dataString) {
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    mostrarNotificacao(mensagem, tipo = 'success') {
        // Criar elemento de notificação
        const notificacao = document.createElement('div');
        notificacao.className = `notification ${tipo}`;
        notificacao.textContent = mensagem;
        
        document.body.appendChild(notificacao);
        
        // Remover após 3 segundos
        setTimeout(() => {
            if (notificacao.parentNode) {
                notificacao.parentNode.removeChild(notificacao);
            }
        }, 3000);
    }

    // Obter resumo para dashboard
    obterResumo() {
        const dataAtual = new Date();
        const mesAtual = dataAtual.getMonth();
        const anoAtual = dataAtual.getFullYear();

        const contasAPagar = this.contas.filter(c => c.status === 'à pagar');
        const contasPagas = this.contas.filter(c => c.status === 'pago');
        const contasVencidas = this.contas.filter(c => {
            if (c.status === 'pago') return false;
            const dataVenc = new Date(c.dataVencimento);
            return dataVenc < dataAtual;
        });

        const contasMes = this.contas.filter(c => {
            const dataVenc = new Date(c.dataVencimento);
            return dataVenc.getMonth() === mesAtual && dataVenc.getFullYear() === anoAtual;
        });

        return {
            total: this.contas.length,
            aPagar: contasAPagar.length,
            pagas: contasPagas.length,
            vencidas: contasVencidas.length,
            valorAPagar: contasAPagar.reduce((sum, c) => sum + parseFloat(c.valor), 0),
            valorPago: contasPagas.reduce((sum, c) => sum + parseFloat(c.valor), 0),
            valorMes: contasMes.reduce((sum, c) => sum + parseFloat(c.valor), 0)
        };
    }
}

// Instância global
const contasManager = new ContasManager();

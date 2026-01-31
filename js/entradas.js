// Gerenciamento de entradas financeiras

class EntradasManager {
    constructor() {
        this.entradas = [];
        this.init();
    }

    init() {
        this.carregarEntradas();
        this.setupEventListeners();
        this.renderizarEntradas();
    }

    setupEventListeners() {
        // Formulário de entradas
        const form = document.getElementById('entradaForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.adicionarEntrada();
            });
        }

        // Filtros
        const filtroTipo = document.getElementById('filtroTipo');
        const filtroMes = document.getElementById('filtroMesEntradas');
        
        if (filtroTipo) {
            filtroTipo.addEventListener('change', () => this.renderizarEntradas());
        }
        
        if (filtroMes) {
            filtroMes.addEventListener('change', () => this.renderizarEntradas());
        }
    }

    carregarEntradas() {
        this.entradas = storage.carregarEntradas();
    }

    adicionarEntrada() {
        const dataEntrada = document.getElementById('dataEntrada').value;
        const valor = parseFloat(document.getElementById('valorEntrada').value);
        const tipoEntrada = document.getElementById('tipoEntrada').value;

        if (!dataEntrada || !valor || !tipoEntrada) {
            this.mostrarNotificacao('Preencha todos os campos!', 'error');
            return;
        }

        const entrada = {
            dataEntrada,
            valor,
            tipoEntrada
        };

        const novaEntrada = storage.adicionarEntrada(entrada);
        this.entradas.push(novaEntrada);
        
        this.limparFormulario();
        this.renderizarEntradas();
        this.mostrarNotificacao('Entrada registrada com sucesso!', 'success');
        
        // Atualizar dashboard
        if (typeof dashboard !== 'undefined') {
            dashboard.atualizarDados();
        }
    }

    editarEntrada(id) {
        const entrada = this.entradas.find(e => e.id === id);
        if (!entrada) return;

        // Preencher formulário com dados da entrada
        document.getElementById('dataEntrada').value = entrada.dataEntrada;
        document.getElementById('valorEntrada').value = entrada.valor;
        document.getElementById('tipoEntrada').value = entrada.tipoEntrada;

        // Remover entrada atual para edição
        this.excluirEntrada(id, false);
        
        // Scroll para o formulário
        document.getElementById('entradaForm').scrollIntoView({ behavior: 'smooth' });
    }

    excluirEntrada(id, mostrarConfirmacao = true) {
        if (mostrarConfirmacao && !confirm('Tem certeza que deseja excluir esta entrada?')) {
            return;
        }

        if (storage.excluirEntrada(id)) {
            this.entradas = this.entradas.filter(e => e.id !== id);
            this.renderizarEntradas();
            this.mostrarNotificacao('Entrada excluída com sucesso!', 'success');
            
            // Atualizar dashboard
            if (typeof dashboard !== 'undefined') {
                dashboard.atualizarDados();
            }
        }
    }

    renderizarEntradas() {
        const tbody = document.getElementById('entradasTableBody');
        if (!tbody) return;

        const filtroTipo = document.getElementById('filtroTipo')?.value || 'todos';
        const filtroMes = document.getElementById('filtroMesEntradas')?.value;

        let entradasFiltradas = this.entradas;

        // Aplicar filtros
        if (filtroTipo !== 'todos') {
            entradasFiltradas = entradasFiltradas.filter(e => e.tipoEntrada === filtroTipo);
        }

        if (filtroMes) {
            const [ano, mes] = filtroMes.split('-');
            entradasFiltradas = entradasFiltradas.filter(e => {
                const dataEntrada = new Date(e.dataEntrada);
                return dataEntrada.getFullYear() === parseInt(ano) && 
                       (dataEntrada.getMonth() + 1) === parseInt(mes);
            });
        }

        // Ordenar por data (mais recentes primeiro)
        entradasFiltradas.sort((a, b) => new Date(b.dataEntrada) - new Date(a.dataEntrada));

        tbody.innerHTML = '';

        if (entradasFiltradas.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center py-8 text-gray-500">
                        Nenhuma entrada encontrada
                    </td>
                </tr>
            `;
            return;
        }

        entradasFiltradas.forEach(entrada => {
            const tr = document.createElement('tr');
            
            // Definir cor baseada no tipo de entrada
            const tipoCores = {
                'Voucher': 'bg-purple-100 text-purple-800',
                'Débito': 'bg-blue-100 text-blue-800',
                'Crédito': 'bg-green-100 text-green-800',
                'Pix': 'bg-orange-100 text-orange-800',
                'Dinheiro': 'bg-yellow-100 text-yellow-800'
            };

            const corTipo = tipoCores[entrada.tipoEntrada] || 'bg-gray-100 text-gray-800';

            tr.innerHTML = `
                <td class="px-4 py-3">${this.formatarData(entrada.dataEntrada)}</td>
                <td class="px-4 py-3 font-semibold text-green-600">R$ ${parseFloat(entrada.valor).toFixed(2)}</td>
                <td class="px-4 py-3">
                    <span class="px-2 py-1 rounded-full text-xs font-medium ${corTipo}">
                        ${entrada.tipoEntrada}
                    </span>
                </td>
                <td class="px-4 py-3">
                    <div class="flex gap-2">
                        <button onclick="entradasManager.editarEntrada('${entrada.id}')" 
                                class="text-green-600 hover:text-green-800 text-sm"
                                title="Editar">
                            ✏️
                        </button>
                        <button onclick="entradasManager.excluirEntrada('${entrada.id}')" 
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
        const form = document.getElementById('entradaForm');
        if (form) {
            form.reset();
            // Definir data atual como padrão
            document.getElementById('dataEntrada').value = new Date().toISOString().split('T')[0];
        }
    }

    formatarData(dataString) {
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR');
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

        const entradasMes = this.entradas.filter(e => {
            const dataEntrada = new Date(e.dataEntrada);
            return dataEntrada.getMonth() === mesAtual && dataEntrada.getFullYear() === anoAtual;
        });

        // Agrupar por tipo
        const entradasPorTipo = {};
        this.entradas.forEach(entrada => {
            if (!entradasPorTipo[entrada.tipoEntrada]) {
                entradasPorTipo[entrada.tipoEntrada] = {
                    quantidade: 0,
                    valor: 0
                };
            }
            entradasPorTipo[entrada.tipoEntrada].quantidade++;
            entradasPorTipo[entrada.tipoEntrada].valor += parseFloat(entrada.valor);
        });

        // Agrupar por dia (últimos 7 dias)
        const ultimos7Dias = [];
        for (let i = 6; i >= 0; i--) {
            const data = new Date();
            data.setDate(data.getDate() - i);
            data.setHours(0, 0, 0, 0);
            
            const dataStr = data.toISOString().split('T')[0];
            const entradasDia = this.entradas.filter(e => e.dataEntrada === dataStr);
            const valorDia = entradasDia.reduce((sum, e) => sum + parseFloat(e.valor), 0);
            
            ultimos7Dias.push({
                data: dataStr,
                valor: valorDia,
                quantidade: entradasDia.length
            });
        }

        return {
            total: this.entradas.length,
            totalMes: entradasMes.length,
            valorMes: entradasMes.reduce((sum, e) => sum + parseFloat(e.valor), 0),
            valorTotal: this.entradas.reduce((sum, e) => sum + parseFloat(e.valor), 0),
            mediaDiaria: entradasMes.length > 0 ? entradasMes.reduce((sum, e) => sum + parseFloat(e.valor), 0) / 30 : 0,
            porTipo: entradasPorTipo,
            ultimos7Dias: ultimos7Dias
        };
    }

    // Obter dados para gráficos
    obterDadosGraficos() {
        const dadosPorMes = {};
        const dadosPorTipo = {};

        // Agrupar por mês
        this.entradas.forEach(entrada => {
            const data = new Date(entrada.dataEntrada);
            const mesAno = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
            
            if (!dadosPorMes[mesAno]) {
                dadosPorMes[mesAno] = 0;
            }
            dadosPorMes[mesAno] += parseFloat(entrada.valor);

            // Agrupar por tipo
            if (!dadosPorTipo[entrada.tipoEntrada]) {
                dadosPorTipo[entrada.tipoEntrada] = 0;
            }
            dadosPorTipo[entrada.tipoEntrada] += parseFloat(entrada.valor);
        });

        return {
            porMes: dadosPorMes,
            porTipo: dadosPorTipo
        };
    }
}

// Instância global
const entradasManager = new EntradasManager();

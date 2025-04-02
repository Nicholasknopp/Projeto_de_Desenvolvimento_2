// Gerenciador centralizado de dados do estoque
class EstoqueManager {
    constructor() {
        this.medicamentos = [];
        this.observers = [];
        this.lastUpdate = null;
        this.isLoading = false;
        this.error = null;
    }

    // Carregar dados do servidor
    async carregarDados() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.error = null;
        this.notificarObservadores();

        try {
            const response = await fetch('http://localhost:3000/api/medicamentos');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.medicamentos = await response.json();
            this.lastUpdate = new Date();
            this.error = null;
        } catch (error) {
            this.error = error.message;
            console.error('Erro ao carregar dados:', error);
            throw error;
        } finally {
            this.isLoading = false;
            this.notificarObservadores();
        }
    }

    // Adicionar observador para atualizações
    adicionarObservador(callback) {
        this.observers.push(callback);
    }

    // Notificar todos os observadores
    notificarObservadores() {
        const estado = {
            medicamentos: this.medicamentos,
            isLoading: this.isLoading,
            error: this.error,
            lastUpdate: this.lastUpdate
        };
        this.observers.forEach(callback => callback(estado));
    }

    // Atualizar dados do medicamento
    async atualizarMedicamento(id, dados) {
        if (this.isLoading) throw new Error('Operação em andamento');
        
        this.isLoading = true;
        this.error = null;
        this.notificarObservadores();

        try {
            const response = await fetch(`http://localhost:3000/api/medicamentos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            });

            if (!response.ok) {
                throw new Error(`Erro ao atualizar medicamento: ${response.statusText}`);
            }

            await this.carregarDados();
        } catch (error) {
            this.error = error.message;
            console.error('Erro na atualização:', error);
            throw error;
        } finally {
            this.isLoading = false;
            this.notificarObservadores();
        }
    }

    // Determinar status do medicamento
    determinarStatus(quantidade, minimo) {
        if (quantidade <= minimo / 2) return 'Crítico';
        if (quantidade <= minimo) return 'Estoque baixo';
        return 'Em estoque';
    }

    // Obter medicamentos com filtros
    getMedicamentosFiltrados(filtros = {}) {
        return this.medicamentos.filter(med => {
            let atendeFiltros = true;
            if (filtros.status) atendeFiltros &= med.status === filtros.status;
            if (filtros.nome) atendeFiltros &= med.nome.toLowerCase().includes(filtros.nome.toLowerCase());
            return atendeFiltros;
        });
    }
}

// Instância global do gerenciador
const estoqueManager = new EstoqueManager();

// Exportar a instância
window.estoqueManager = estoqueManager;
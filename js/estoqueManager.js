// Gerenciador centralizado de dados do estoque
class EstoqueManager {
    constructor() {
        this.medicamentos = this.carregarCache() || [];
        this.observers = [];
        this.lastUpdate = null;
        this.isLoading = false;
        this.error = null;
        this.retryCount = 0;
        this.maxRetries = 3;
        this.retryDelay = 1000;
        this.cacheKey = 'estoqueCache';
        this.cacheDuration = 1000 * 60 * 30; // 30 minutos
    }

    // Carregar dados do servidor
    async carregarDados() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.error = null;
        this.notificarObservadores();

        // Verificar cache válido
        const cacheValido = this.verificarCacheValido();
        if (cacheValido) {
            this.medicamentos = this.carregarCache();
            this.isLoading = false;
            this.notificarObservadores();
            return;
        }

        while (this.retryCount < this.maxRetries) {
            try {
                const response = await fetch('http://localhost:3000/api/medicamentos');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                this.medicamentos = data.map(med => ({
                    ...med,
                    status: this.determinarStatus(med.estoque, med.estoqueMinimo)
                }));
                this.lastUpdate = new Date();
                this.error = null;
                this.retryCount = 0;
                this.salvarCache(this.medicamentos);
                break;
            } catch (error) {
                this.retryCount++;
                console.warn(`Tentativa ${this.retryCount} de ${this.maxRetries} falhou:`, error);
                
                if (this.retryCount === this.maxRetries) {
                    const dadosCache = this.carregarCache();
                    if (dadosCache && dadosCache.length > 0) {
                        console.log('Usando dados do cache após falha na conexão');
                        this.medicamentos = dadosCache;
                        this.error = 'Usando dados offline (podem estar desatualizados)';
                    } else {
                        this.error = `Erro ao carregar dados após ${this.maxRetries} tentativas: ${error.message}`;
                        console.error(this.error);
                        throw new Error(this.error);
                    }
                }
                await new Promise(resolve => setTimeout(resolve, this.retryDelay * this.retryCount));
            }
        }
        this.isLoading = false;
        this.notificarObservadores();
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
        
        this.validarDadosMedicamento(dados);
        
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

            const medicamentoAtualizado = await response.json();
            const index = this.medicamentos.findIndex(m => m.id === id);
            if (index !== -1) {
                this.medicamentos[index] = {
                    ...medicamentoAtualizado,
                    status: this.determinarStatus(medicamentoAtualizado.estoque, medicamentoAtualizado.estoqueMinimo)
                };
                this.notificarObservadores();
            }
        } catch (error) {
            this.error = error.message;
            console.error('Erro na atualização:', error);
            throw error;
        } finally {
            this.isLoading = false;
            this.notificarObservadores();
        }
    }

    validarDadosMedicamento(dados) {
        if (!dados.nome || typeof dados.nome !== 'string' || dados.nome.trim().length === 0) {
            throw new Error('Nome do medicamento é obrigatório');
        }
        if (!dados.fabricante || typeof dados.fabricante !== 'string' || dados.fabricante.trim().length === 0) {
            throw new Error('Fabricante é obrigatório');
        }
        if (!dados.validade || isNaN(new Date(dados.validade).getTime())) {
            throw new Error('Data de validade inválida');
        }
        if (typeof dados.estoque !== 'number' || dados.estoque < 0) {
            throw new Error('Quantidade em estoque deve ser um número positivo');
        }
        if (typeof dados.estoqueMinimo !== 'number' || dados.estoqueMinimo < 0) {
            throw new Error('Estoque mínimo deve ser um número positivo');
        }
    }

    // Funções de cache
    carregarCache() {
        try {
            const cache = localStorage.getItem(this.cacheKey);
            if (!cache) return null;
            const { dados, timestamp } = JSON.parse(cache);
            return dados;
        } catch (error) {
            console.error('Erro ao carregar cache:', error);
            return null;
        }
    }

    salvarCache(dados) {
        try {
            const cacheData = {
                dados: dados,
                timestamp: new Date().getTime()
            };
            localStorage.setItem(this.cacheKey, JSON.stringify(cacheData));
        } catch (error) {
            console.error('Erro ao salvar cache:', error);
        }
    }

    verificarCacheValido() {
        try {
            const cache = localStorage.getItem(this.cacheKey);
            if (!cache) return false;
            const { timestamp } = JSON.parse(cache);
            const agora = new Date().getTime();
            return (agora - timestamp) < this.cacheDuration;
        } catch (error) {
            console.error('Erro ao verificar cache:', error);
            return false;
        }
    }

    // Determinar status do medicamento
    determinarStatus(quantidade, minimo) {
        if (!quantidade || !minimo) return 'Indisponível';
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
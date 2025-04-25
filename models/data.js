// Armazenamento em memória para os dados
const data = {
    usuarios: [],
    medicamentos: [],
    movimentacoes: [],
    notificacoes: []
};

// Funções auxiliares para gerar IDs únicos
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Funções para manipulação de usuários
const usuarioModel = {
    create: (userData) => {
        const usuario = { ...userData, id: generateId() };
        data.usuarios.push(usuario);
        return usuario;
    },
    findByEmail: (email) => {
        return data.usuarios.find(u => u.email === email);
    },
    update: (id, userData) => {
        const index = data.usuarios.findIndex(u => u.id === id);
        if (index >= 0) {
            data.usuarios[index] = { ...data.usuarios[index], ...userData };
            return data.usuarios[index];
        }
        return null;
    }
};

// Funções para manipulação de medicamentos
const medicamentoModel = {
    create: (medData) => {
        const medicamento = { ...medData, id: generateId() };
        data.medicamentos.push(medicamento);
        return medicamento;
    },
    findAll: () => {
        return [...data.medicamentos];
    },
    findById: (id) => {
        return data.medicamentos.find(m => m.id === id);
    },
    update: (id, medData) => {
        const index = data.medicamentos.findIndex(m => m.id === id);
        if (index >= 0) {
            data.medicamentos[index] = { ...data.medicamentos[index], ...medData };
            return data.medicamentos[index];
        }
        return null;
    },
    delete: (id) => {
        const index = data.medicamentos.findIndex(m => m.id === id);
        if (index >= 0) {
            data.medicamentos.splice(index, 1);
            return true;
        }
        return false;
    }
};

// Funções para manipulação de movimentações
const movimentacaoModel = {
    create: (movData) => {
        const movimentacao = { ...movData, id: generateId(), data: new Date() };
        data.movimentacoes.push(movimentacao);
        return movimentacao;
    },
    findAll: () => {
        return [...data.movimentacoes];
    },
    findByMedicamento: (medicamentoId) => {
        return data.movimentacoes.filter(m => m.medicamentoId === medicamentoId);
    }
};

// Funções para manipulação de notificações
const notificacaoModel = {
    create: (notifData) => {
        const notificacao = { ...notifData, id: generateId(), data: new Date() };
        data.notificacoes.push(notificacao);
        return notificacao;
    },
    findAll: () => {
        return [...data.notificacoes];
    },
    update: (id, notifData) => {
        const index = data.notificacoes.findIndex(n => n.id === id);
        if (index >= 0) {
            data.notificacoes[index] = { ...data.notificacoes[index], ...notifData };
            return data.notificacoes[index];
        }
        return null;
    },
    delete: (id) => {
        const index = data.notificacoes.findIndex(n => n.id === id);
        if (index >= 0) {
            data.notificacoes.splice(index, 1);
            return true;
        }
        return false;
    }
};

module.exports = {
    usuarioModel,
    medicamentoModel,
    movimentacaoModel,
    notificacaoModel
};
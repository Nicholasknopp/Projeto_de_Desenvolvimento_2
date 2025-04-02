// Função para formatar a data para o formato do MySQL
function formatarData(data) {
    return data.split('-').join('-');
}

// Função para determinar o status do medicamento baseado na quantidade
function determinarStatus(quantidade) {
    if (quantidade > 100) return 'Em estoque';
    if (quantidade > 30) return 'Estoque baixo';
    return 'Crítico';
}

// Função para cadastrar medicamento
async function cadastrarMedicamento(event) {
    event.preventDefault();

    const formData = {
        nome: document.getElementById('nome').value,
        quantidade: parseInt(document.getElementById('quantidade').value),
        validade: new Date(document.getElementById('validade').value).toISOString(),
        lote: document.getElementById('lote').value,
        fabricante: document.getElementById('fabricante').value,
        concentracao: document.getElementById('concentracao').value,
        formaFarmaceutica: document.getElementById('formaFarmaceutica').value,
        posologia: document.getElementById('posologia').value,
        viaAdministracao: document.getElementById('viaAdministracao').value,
        intervalo: document.getElementById('intervalo').value,
        duracaoTratamento: document.getElementById('duracaoTratamento').value,
        contraindicacoes: document.getElementById('contraindicacoes').value,
        efeitosColaterais: document.getElementById('efeitosColaterais').value,
        descricao: document.getElementById('descricao').value
    };

    try {
        const response = await fetch('http://localhost:3000/api/medicamentos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Erro ao cadastrar medicamento');
        }

        const data = await response.json();
        alert('Medicamento cadastrado com sucesso!');
        
        // Atualizar todas as tabelas
        atualizarTabelas();
        
        // Limpar formulário
        document.getElementById('medicamentoForm').reset();

    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao cadastrar medicamento: ' + error.message);
    }
}

// Função para atualizar todas as tabelas
async function atualizarTabelas() {
    try {
        const response = await fetch('http://localhost:3000/api/medicamentos');
        const medicamentos = await response.json();

        // Atualizar tabela de medicamentos
        const medicamentosTable = document.getElementById('medicamentosTableBody');
        if (medicamentosTable) {
            atualizarTabelaMedicamentos(medicamentos);
        }

        // Atualizar tabela de estoque
        const estoqueTable = document.getElementById('stockTableBody');
        if (estoqueTable) {
            atualizarTabelaEstoque(medicamentos);
        }

        // Atualizar tabela de relatórios
        const relatoriosTable = document.getElementById('relatorioTableBody');
        if (relatoriosTable) {
            atualizarTabelaRelatorios(medicamentos);
        }

    } catch (error) {
        console.error('Erro ao atualizar tabelas:', error);
    }
}

// Funções específicas para atualizar cada tabela
function atualizarTabelaMedicamentos(medicamentos) {
    const tbody = document.getElementById('medicamentosTableBody');
    if (!tbody) return;

    tbody.innerHTML = medicamentos.map(med => `
        <tr>
            <td>${med.nome}</td>
            <td>${med.quantidade}</td>
            <td>${med.validade}</td>
            <td>${med.status}</td>
            <td>
                <button onclick="editarMedicamento(${med.id})">Editar</button>
                <button onclick="excluirMedicamento(${med.id})">Excluir</button>
            </td>
        </tr>
    `).join('');
}

function atualizarTabelaEstoque(medicamentos) {
    const tbody = document.getElementById('stockTableBody');
    if (!tbody) return;

    tbody.innerHTML = medicamentos.map(med => `
        <tr>
            <td>${med.nome}</td>
            <td>${med.quantidade}</td>
            <td>${med.status}</td>
            <td>${med.lote}</td>
            <td>${med.validade}</td>
            <td>
                <button onclick="registrarMovimentacao(${med.id})">Movimentar</button>
            </td>
        </tr>
    `).join('');
}

function atualizarTabelaRelatorios(medicamentos) {
    const tbody = document.getElementById('relatorioTableBody');
    if (!tbody) return;

    tbody.innerHTML = medicamentos.map(med => `
        <tr>
            <td class="editable" onclick="editarCampo(this, 'nome', ${med.id})">${med.nome}</td>
            <td class="editable" onclick="editarCampo(this, 'quantidade', ${med.id})">${med.quantidade}</td>
            <td>${med.status}</td>
            <td>${med.validade}</td>
            <td>${med.fabricante}</td>
        </tr>
    `).join('');
}

// Adicionar event listener ao formulário
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('medicamentoForm');
    if (form) {
        form.addEventListener('submit', cadastrarMedicamento);
    }
});
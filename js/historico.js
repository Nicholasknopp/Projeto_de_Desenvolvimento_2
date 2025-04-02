// Função para carregar os medicamentos no select de filtro
async function carregarMedicamentos() {
    try {
        const response = await fetch('http://localhost:3000/api/medicamentos');
        const medicamentos = await response.json();
        const select = document.getElementById('medicamento');

        medicamentos.forEach(med => {
            const option = document.createElement('option');
            option.value = med.id;
            option.textContent = med.nome;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar medicamentos:', error);
    }
}

// Função para formatar data
function formatarData(data) {
    return new Date(data).toLocaleString('pt-BR');
}

// Função para filtrar o histórico
async function filtrarHistorico() {
    const dataInicio = document.getElementById('dataInicio').value;
    const dataFim = document.getElementById('dataFim').value;
    const medicamentoId = document.getElementById('medicamento').value;

    try {
        let url = 'http://localhost:3000/api/movimentacoes';
        const params = new URLSearchParams();

        if (dataInicio) params.append('dataInicio', dataInicio);
        if (dataFim) params.append('dataFim', dataFim);
        if (medicamentoId) params.append('medicamentoId', medicamentoId);

        if (params.toString()) {
            url += '?' + params.toString();
        }

        const response = await fetch(url);
        const movimentacoes = await response.json();

        atualizarTabela(movimentacoes);
        atualizarGrafico(movimentacoes);
    } catch (error) {
        console.error('Erro ao filtrar histórico:', error);
    }
}

// Função para atualizar a tabela de histórico
function atualizarTabela(movimentacoes) {
    const tbody = document.getElementById('historicoTableBody');
    tbody.innerHTML = '';

    movimentacoes.forEach(mov => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${formatarData(mov.data)}</td>
            <td>${mov.medicamento.nome}</td>
            <td>${mov.quantidade}</td>
            <td>${mov.tipo}</td>
            <td>${mov.responsavel}</td>
            <td>${mov.observacao || '-'}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Função para atualizar o gráfico de consumo
function atualizarGrafico(movimentacoes) {
    const ctx = document.getElementById('graficoConsumo').getContext('2d');
    const dados = processarDadosGrafico(movimentacoes);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dados.labels,
            datasets: [{
                label: 'Consumo de Medicamentos',
                data: dados.valores,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Função para processar dados do gráfico
function processarDadosGrafico(movimentacoes) {
    const dadosPorData = {};

    movimentacoes.forEach(mov => {
        const data = mov.data.split('T')[0];
        if (!dadosPorData[data]) {
            dadosPorData[data] = 0;
        }
        dadosPorData[data] += mov.tipo === 'saida' ? mov.quantidade : 0;
    });

    const labels = Object.keys(dadosPorData).sort();
    const valores = labels.map(data => dadosPorData[data]);

    return { labels, valores };
}

// Carregar medicamentos ao iniciar a página
document.addEventListener('DOMContentLoaded', () => {
    carregarMedicamentos();
    filtrarHistorico();
});
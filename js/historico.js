let paginaAtual = 1;
const itensPorPagina = 10;
let historicoCompleto = [];
let graficoMovimentacoes = null;

async function carregarHistoricoDetalhado() {
    try {
        // Simular carregamento de dados do backend
        historicoCompleto = await simularDadosHistorico();
        atualizarTabelaHistorico();
        atualizarPaginacao();
        carregarMedicamentosNoFiltro();
    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        alert('Erro ao carregar histórico detalhado');
    }
}

function simularDadosHistorico() {
    // Função temporária para simular dados
    return new Promise(resolve => {
        const formasFarmaceuticas = ['Comprimido', 'Cápsula', 'Xarope', 'Pomada', 'Injetável'];
        const categorias = ['Antibiótico', 'Anti-inflamatório', 'Analgésico', 'Antialérgico', 'Antiviral'];
        const dados = [];

        for (let i = 0; i < 50; i++) {
            const dataValidade = new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000);
            dados.push({
                medicamento: `Medicamento ${i + 1}`,
                quantidade: Math.floor(Math.random() * 100) + 1,
                dataValidade: dataValidade,
                fabricante: `Fabricante ${Math.floor(Math.random() * 10) + 1}`,
                concentracao: `${Math.floor(Math.random() * 500) + 100}mg`,
                formaFarmaceutica: formasFarmaceuticas[Math.floor(Math.random() * formasFarmaceuticas.length)],
                categoria: categorias[Math.floor(Math.random() * categorias.length)]
            });
        }

        resolve(dados.sort((a, b) => b.data - a.data));
    });
}

function carregarMedicamentosNoFiltro() {
    const selectMedicamento = document.getElementById('filtroMedicamento');
    const medicamentosUnicos = [...new Set(historicoCompleto.map(h => h.medicamento))];
    
    selectMedicamento.innerHTML = '<option value="">Todos os Medicamentos</option>' +
        medicamentosUnicos.map(med => `<option value="${med}">${med}</option>`).join('');
}

function filtrarHistorico() {
    const dataInicio = document.getElementById('dataInicio').value;
    const dataFim = document.getElementById('dataFim').value;
    const tipoMovimentacao = document.getElementById('filtroTipoMovimentacao').value;
    const medicamento = document.getElementById('filtroMedicamento').value;

    let resultadosFiltrados = [...historicoCompleto];
    atualizarGraficoMovimentacoes(resultadosFiltrados);

    if (dataInicio) {
        resultadosFiltrados = resultadosFiltrados.filter(h => 
            h.data >= new Date(dataInicio));
    }

    if (dataFim) {
        resultadosFiltrados = resultadosFiltrados.filter(h => 
            h.data <= new Date(dataFim + 'T23:59:59'));
    }

    if (tipoMovimentacao) {
        resultadosFiltrados = resultadosFiltrados.filter(h => 
            h.tipo.toLowerCase() === tipoMovimentacao.toLowerCase());
    }

    if (medicamento) {
        resultadosFiltrados = resultadosFiltrados.filter(h => 
            h.medicamento === medicamento);
    }

    historicoCompleto = resultadosFiltrados;
    paginaAtual = 1;
    atualizarTabelaHistorico();
    atualizarPaginacao();
}

function atualizarTabelaHistorico() {
    const tbody = document.getElementById('historicoTableBody');
    if (!tbody) return;

    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    const dadosPagina = historicoCompleto.slice(inicio, fim);

    tbody.innerHTML = dadosPagina.map(med => {
        return `
            <tr>
                <td>${med.medicamento}</td>
                <td>${med.quantidade}</td>
                <td>${formatarData(med.dataValidade)}</td>
                <td>${med.fabricante}</td>
                <td>${med.concentracao}</td>
                <td>${med.formaFarmaceutica}</td>
                <td>${med.categoria}</td>
            </tr>
        `;
    }).join('');
}

function atualizarPaginacao() {
    const totalPaginas = Math.ceil(historicoCompleto.length / itensPorPagina);
    document.getElementById('paginaAtual').textContent = `Página ${paginaAtual} de ${totalPaginas}`;
    
    document.getElementById('btnAnterior').disabled = paginaAtual === 1;
    document.getElementById('btnProximo').disabled = paginaAtual === totalPaginas;
}

function mudarPagina(direcao) {
    const totalPaginas = Math.ceil(historicoCompleto.length / itensPorPagina);
    const novaPagina = paginaAtual + direcao;

    if (novaPagina >= 1 && novaPagina <= totalPaginas) {
        paginaAtual = novaPagina;
        atualizarTabelaHistorico();
        atualizarPaginacao();
    }
}

function formatarData(data) {
    return new Date(data).toLocaleDateString('pt-BR');
}

function atualizarGraficoMovimentacoes(dados) {
    const ctx = document.getElementById('graficoMovimentacoes').getContext('2d');
    
    if (graficoMovimentacoes) {
        graficoMovimentacoes.destroy();
    }

    const dadosPorTipo = {
        Entrada: 0,
        Saída: 0,
        Ajuste: 0,
        Perda: 0
    };

    dados.forEach(mov => {
        dadosPorTipo[mov.tipo]++;
    });

    graficoMovimentacoes = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(dadosPorTipo),
            datasets: [{
                label: 'Quantidade de Movimentações por Tipo',
                data: Object.values(dadosPorTipo),
                backgroundColor: [
                    '#28a745',
                    '#dc3545',
                    '#ffc107',
                    '#6c757d'
                ]
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// Inicializar a página
document.addEventListener('DOMContentLoaded', () => {
    carregarHistoricoDetalhado();

    // Adicionar eventos aos botões
    document.getElementById('btnFiltrarHistorico').addEventListener('click', filtrarHistorico);
    document.getElementById('btnAnterior').addEventListener('click', () => mudarPagina(-1));
    document.getElementById('btnProximo').addEventListener('click', () => mudarPagina(1));
});
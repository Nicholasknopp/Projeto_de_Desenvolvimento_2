document.addEventListener('DOMContentLoaded', function() {
    // Configuração inicial dos gráficos
    inicializarGraficos();
    
    // Carregar dados iniciais
    carregarDados();
    carregarHistoricoDetalhado();

    // Adicionar evento ao formulário de filtros
    document.getElementById('filtrosForm').addEventListener('submit', function(e) {
        e.preventDefault();
        atualizarRelatorios();
    });

    // Adicionar eventos aos botões de exportação
    document.querySelectorAll('.btn-exportar').forEach(btn => {
        btn.addEventListener('click', exportarRelatorio);
    });

    // Adicionar eventos para o histórico detalhado
    document.getElementById('btnFiltrarHistorico').addEventListener('click', filtrarHistorico);
    document.getElementById('btnAnterior').addEventListener('click', () => mudarPagina(-1));
    document.getElementById('btnProximo').addEventListener('click', () => mudarPagina(1));
});

function limparDadosVisualizacao() {
    document.getElementById('tabelaValidade').innerHTML = '';
    document.getElementById('tabelaMovimentacoes').innerHTML = '';
    document.getElementById('tabelaHistoricoDetalhado').innerHTML = '';
    // Limpar gráficos recriando-os vazios
    inicializarGraficos();
}



function inicializarGraficos() {
    // Gráfico de Consumo por Categoria
    const ctxConsumo = document.getElementById('graficoConsumo');
    if (!ctxConsumo) {
        console.error('Elemento do gráfico de consumo não encontrado');
        return;
    }
    const contextoConsumo = ctxConsumo.getContext('2d');
    new Chart(contextoConsumo, {
        type: 'bar',
        data: {
            labels: ['Analgésico', 'Antibiótico', 'Anti-inflamatório', 'Outros'],
            datasets: [{
                label: 'Consumo Mensal',
                data: [65, 45, 35, 25],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 206, 86, 0.6)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Gráfico de Status do Estoque
    const ctxEstoque = document.getElementById('graficoEstoque').getContext('2d');
    new Chart(ctxEstoque, {
        type: 'doughnut',
        data: {
            labels: ['Normal', 'Baixo', 'Crítico'],
            datasets: [{
                data: [70, 20, 10],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(255, 99, 132, 0.6)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

async function carregarDados() {
    try {
        if (!window.estoqueManager) {
            throw new Error('Gerenciador de estoque não inicializado');
        }

        await estoqueManager.carregarDados();
        const medicamentos = estoqueManager.medicamentos;
        
        if (!Array.isArray(medicamentos) || medicamentos.length === 0) {
            throw new Error('Nenhum medicamento encontrado');
        }

        atualizarTabelaValidade(medicamentos);
        atualizarGraficoConsumo(medicamentos);
        atualizarGraficoEstoque(medicamentos);
        atualizarTabelaMovimentacoes(medicamentos);

        // Atualizar última atualização
        const ultimaAtualizacao = document.getElementById('ultimaAtualizacao');
        if (ultimaAtualizacao) {
            ultimaAtualizacao.textContent = `Última atualização: ${formatarData(new Date())}`;
        }
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        alert(`Erro ao carregar dados: ${error.message}`);
        
        // Limpar gráficos e tabelas em caso de erro
        limparDadosVisualizacao();
    }
}



function atualizarTabelaValidade(medicamentos) {
    const tabelaValidade = document.getElementById('tabelaValidade');
    if (!tabelaValidade) {
        console.error('Elemento tabelaValidade não encontrado');
        return;
    }

    if (!Array.isArray(medicamentos) || medicamentos.length === 0) {
        tabelaValidade.innerHTML = '<tr><td colspan="4">Nenhum medicamento encontrado</td></tr>';
        return;
    }

    const hoje = new Date();
    const medicamentosValidos = medicamentos.filter(item => item && item.validade && item.nome);
    
    if (medicamentosValidos.length === 0) {
        tabelaValidade.innerHTML = '<tr><td colspan="4">Dados de medicamentos inválidos</td></tr>';
        return;
    }

    const medicamentosOrdenados = medicamentosValidos.sort((a, b) => {
        const dataA = new Date(a.validade);
        const dataB = new Date(b.validade);
        return dataA - dataB;
    });

    tabelaValidade.innerHTML = medicamentosOrdenados.map(item => {
        try {
            const dataValidade = new Date(item.validade);
            if (isNaN(dataValidade.getTime())) {
                console.error('Data de validade inválida para:', item);
                return '';
            }

            const diasParaVencer = Math.ceil((dataValidade - hoje) / (1000 * 60 * 60 * 24));
            const status = diasParaVencer <= 30 ? 'critico' : diasParaVencer <= 90 ? 'baixo' : 'normal';

            return `
                <tr>
                    <td>${item.nome || 'Nome não disponível'}</td>
                    <td>${item.lote || 'Lote não disponível'}</td>
                    <td>${formatarData(dataValidade)}</td>
                    <td><span class="status-${status}">${diasParaVencer} dias</span></td>
                </tr>
            `;
        } catch (error) {
            console.error('Erro ao processar medicamento:', error);
            return '';
        }
    }).filter(row => row).join('');

    if (!tabelaValidade.innerHTML.trim()) {
        tabelaValidade.innerHTML = '<tr><td colspan="4">Erro ao processar dados dos medicamentos</td></tr>';
    }
}

function atualizarGraficoConsumo(medicamentos) {
    const ctxConsumo = document.getElementById('graficoConsumo');
    if (!ctxConsumo) return;

    const categorias = {};
    medicamentos.forEach(med => {
        if (!categorias[med.categoria]) {
            categorias[med.categoria] = 0;
        }
        categorias[med.categoria] += med.quantidade;
    });

    new Chart(ctxConsumo.getContext('2d'), {
        type: 'bar',
        data: {
            labels: Object.keys(categorias),
            datasets: [{
                label: 'Quantidade em Estoque',
                data: Object.values(categorias),
                backgroundColor: [
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 206, 86, 0.6)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function atualizarGraficoEstoque(medicamentos) {
    const ctxEstoque = document.getElementById('graficoEstoque');
    if (!ctxEstoque) return;

    const statusCount = {
        'Normal': 0,
        'Baixo': 0,
        'Crítico': 0
    };

    medicamentos.forEach(med => {
        const status = estoqueManager.determinarStatus(med.quantidade, med.quantidadeMinima);
        statusCount[status]++;
    });

    new Chart(ctxEstoque.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: Object.keys(statusCount),
            datasets: [{
                data: Object.values(statusCount),
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(255, 99, 132, 0.6)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

let paginaAtual = 1;
const itensPorPagina = 10;
let historicoCompleto = [];

async function carregarHistoricoDetalhado() {
    try {
        const response = await fetch('http://localhost:3000/api/movimentacoes');
        if (!response.ok) {
            throw new Error('Falha ao carregar dados da API');
        }
        historicoCompleto = await response.json();
    } catch (error) {
        console.warn('Fallback para dados simulados:', error);
        historicoCompleto = await simularDadosHistorico();
    }
    
    atualizarTabelaHistorico();
    atualizarPaginacao();
    carregarMedicamentosNoFiltro();
}

function simularDadosHistorico() {
    // Função temporária para simular dados
    return new Promise(resolve => {
        const tipos = ['Entrada', 'Saída', 'Ajuste', 'Perda'];
        const dados = [];

        for (let i = 0; i < 50; i++) {
            const data = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
            dados.push({
                data: data,
                hora: data.toLocaleTimeString('pt-BR'),
                medicamento: `Medicamento ${i + 1}`,
                lote: `L${Math.floor(Math.random() * 1000)}`,
                tipo: tipos[Math.floor(Math.random() * tipos.length)],
                quantidade: Math.floor(Math.random() * 100) + 1,
                estoqueFinal: Math.floor(Math.random() * 1000),
                observacao: `Observação da movimentação ${i + 1}`
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
    const tabela = document.getElementById('tabelaHistoricoDetalhado');
    if (!tabela) return;

    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    const dadosPagina = historicoCompleto.slice(inicio, fim);

    tabela.innerHTML = dadosPagina.map(mov => `
        <tr>
            <td>${formatarData(mov.data)}</td>
            <td>${mov.hora}</td>
            <td>${mov.medicamento}</td>
            <td>${mov.lote}</td>
            <td>${mov.tipo}</td>
            <td>${mov.quantidade}</td>
            <td>${mov.estoqueFinal}</td>
            <td>${mov.observacao}</td>
        </tr>
    `).join('');
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
async function atualizarRelatorios() {
    const periodo = document.getElementById('periodo').value;
    const tipoRelatorio = document.getElementById('tipo').value;

    try {
        await estoqueManager.carregarDados();
        const medicamentos = estoqueManager.medicamentos;

        switch(tipoRelatorio) {
            case 'movimentacao':
                atualizarTabelaMovimentacoes(medicamentos);
                break;
            case 'consumo':
                atualizarGraficoConsumo(medicamentos);
                break;
            case 'validade':
                atualizarTabelaValidade(medicamentos);
                break;
        }
    } catch (error) {
        console.error('Erro ao atualizar relatórios:', error);
        alert('Erro ao atualizar relatórios. Por favor, tente novamente.');
    }
}

function exportarRelatorio(e) {
    const tipoRelatorio = e.target.closest('.relatorio-card')
        .querySelector('.relatorio-title').textContent;
    
    // Aqui você implementaria a lógica para exportar o relatório
    console.log('Exportando relatório:', tipoRelatorio);
    alert(`Exportando ${tipoRelatorio} em PDF...`);
}
// Referência ao gerenciador de estoque
const estoqueManager = window.estoqueManager;
let medicamentos = [];

// Carregar dados iniciais
async function carregarDados() {
    try {
        await estoqueManager.carregarDados();
        medicamentos = estoqueManager.medicamentos;
        renderizarTabela();
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        alert('Erro ao carregar dados do estoque');
    }
}

// Observar mudanças no estoque
estoqueManager.adicionarObservador((estado) => {
    medicamentos = estado.medicamentos;
    renderizarTabela();
});

// Configurações de paginação
const itensPorPagina = 10;
let paginaAtual = 1;

// Estado da ordenação
let ordenacaoAtual = { campo: 'nome', ordem: 'asc' };

// Elementos do DOM
const tabelaCorpo = document.getElementById('listaMedicamentos');
const paginacaoContainer = document.getElementById('paginacao');
const inputBusca = document.getElementById('busca');
const selectCategoria = document.getElementById('filtroCategoria');
const selectEstoque = document.getElementById('filtroEstoque');

// Função para filtrar medicamentos
function filtrarMedicamentos() {
    const termoBusca = inputBusca.value.toLowerCase();
    const categoriaFiltro = selectCategoria.value;
    const estoqueFiltro = selectEstoque.value;

    return medicamentos.filter(med => {
        const passaBusca = med.nome.toLowerCase().includes(termoBusca);
         const passaCategoria = !categoriaFiltro || med.categoria === categoriaFiltro;
        const passaEstoque = !estoqueFiltro || getStatusEstoque(med) === estoqueFiltro;
        return passaBusca && passaCategoria && passaEstoque;
    });
}

// Função para ordenar medicamentos
function ordenarMedicamentos(medicamentosFiltrados) {
    return medicamentosFiltrados.sort((a, b) => {
        let valorA = a[ordenacaoAtual.campo];
        let valorB = b[ordenacaoAtual.campo];

        if (ordenacaoAtual.campo === 'validade') {
            valorA = new Date(valorA);
            valorB = new Date(valorB);
        }

        if (valorA < valorB) return ordenacaoAtual.ordem === 'asc' ? -1 : 1;
        if (valorA > valorB) return ordenacaoAtual.ordem === 'asc' ? 1 : -1;
        return 0;
    });
}

// Função para determinar o status do estoque
function getStatusEstoque(medicamento) {
    if (!medicamento || typeof medicamento.estoque !== 'number' || typeof medicamento.estoqueMinimo !== 'number' || medicamento.estoqueMinimo < 0) {
        return 'indisponivel';
    }
    if (medicamento.estoque <= 0) {
        return 'indisponivel';
    }
    if (medicamento.estoque <= medicamento.estoqueMinimo * 0.5) {
        return 'critico';
    }
    if (medicamento.estoque <= medicamento.estoqueMinimo) {
        return 'baixo';
    }
    return 'normal';
}

// Função para formatar a data
function formatarData(data) {
    return new Date(data).toLocaleDateString('pt-BR');
}

// Função para renderizar a tabela
function renderizarTabela() {
    if (!tabelaCorpo) {
        console.error('Elemento da tabela não encontrado');
        return;
    }

    try {
        if (!Array.isArray(medicamentos)) {
            throw new Error('Lista de medicamentos inválida');
        }

        const medicamentosFiltrados = filtrarMedicamentos();
        const medicamentosOrdenados = ordenarMedicamentos(medicamentosFiltrados);

        // Cálculo da paginação
        const inicio = (paginaAtual - 1) * itensPorPagina;
        const fim = inicio + itensPorPagina;
        const medicamentosPaginados = medicamentosOrdenados.slice(inicio, fim);

        // Limpa a tabela
        tabelaCorpo.innerHTML = '';

        if (medicamentosPaginados.length === 0) {
            tabelaCorpo.innerHTML = '<tr><td colspan="8" class="text-center">Nenhum medicamento encontrado</td></tr>';
            return;
        }

    // Renderiza os medicamentos
    medicamentosPaginados.forEach(med => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${med.nome}</td>
            <td>${med.estoque} unidades</td>
            <td>${formatarData(med.validade)}</td>
            <td>${med.fabricante}</td>
            <td>${med.concentracao}</td>
            <td>${med.formaFarmaceutica}</td>
            <td>${med.categoria}</td>
            <td class="acoes">
                <button class="btn-acao btn-editar" onclick="editarMedicamento(${med.id})" title="Editar medicamento">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-acao btn-excluir" onclick="excluirMedicamento(${med.id})" title="Excluir medicamento">
                    <i class="fas fa-trash"></i>
                </button>
                <button class="btn-acao btn-atualizar" onclick="atualizarEstoque(${med.id})" title="Atualizar estoque">
                    <i class="fas fa-sync-alt"></i>
                </button>
            </td>
        `;
        tabelaCorpo.appendChild(tr);
    });

    renderizarPaginacao(medicamentosOrdenados.length);
}

// Função para renderizar a paginação
function renderizarPaginacao(total) {
    if (!paginacaoContainer) {
        console.error('Elemento de paginação não encontrado');
        return;
    }
    const totalPaginas = Math.max(1, Math.ceil(total / itensPorPagina));
    paginacaoContainer.innerHTML = '';

    // Botão anterior
    if (totalPaginas > 1) {
        const btnAnterior = document.createElement('button');
        btnAnterior.className = 'btn-pagina';
        btnAnterior.innerHTML = '<i class="fas fa-chevron-left"></i>';
        btnAnterior.disabled = paginaAtual === 1;
        btnAnterior.onclick = () => mudarPagina(paginaAtual - 1);
        paginacaoContainer.appendChild(btnAnterior);
    }

    // Botões de página
    for (let i = 1; i <= totalPaginas; i++) {
        const btn = document.createElement('button');
        btn.className = `btn-pagina ${i === paginaAtual ? 'ativo' : ''}`;
        btn.textContent = i;
        btn.onclick = () => mudarPagina(i);
        paginacaoContainer.appendChild(btn);
    }

    // Botão próximo
    if (totalPaginas > 1) {
        const btnProximo = document.createElement('button');
        btnProximo.className = 'btn-pagina';
        btnProximo.innerHTML = '<i class="fas fa-chevron-right"></i>';
        btnProximo.disabled = paginaAtual === totalPaginas;
        btnProximo.onclick = () => mudarPagina(paginaAtual + 1);
        paginacaoContainer.appendChild(btnProximo);
    }
}

// Função para mudar de página
function mudarPagina(pagina) {
    paginaAtual = pagina;
    renderizarTabela();
}

// Função para editar medicamento
function editarMedicamento(id) {
    // Implementar redirecionamento para página de edição
    window.location.href = `../cadastro.html?id=${id}`;
}

// Função para excluir medicamento
async function excluirMedicamento(id) {
    if (confirm('Tem certeza que deseja excluir este medicamento?')) {
        try {
            await estoqueManager.atualizarMedicamento(id, { deleted: true });
            await carregarDados();
        } catch (error) {
            console.error('Erro ao excluir medicamento:', error);
            alert('Erro ao excluir medicamento');
        }
    }
}

// Função para atualizar estoque
async function atualizarEstoque(id) {
    try {
        const medicamento = medicamentos.find(m => m.id === id);
        if (!medicamento) {
            throw new Error('Medicamento não encontrado');
        }

        const novoEstoque = prompt(`Digite a nova quantidade em estoque para ${medicamento.nome}:`);
        if (novoEstoque === null) return;

        const quantidade = parseInt(novoEstoque);
        if (isNaN(quantidade)) {
            alert('Por favor, digite um número válido.');
            return;
        }
        if (quantidade < 0) {
            alert('A quantidade não pode ser negativa.');
            return;
        }

        await estoqueManager.atualizarMedicamento(id, { estoque: quantidade });
        await carregarDados();
        alert(`Estoque de ${medicamento.nome} atualizado com sucesso!`);
    } catch (error) {
        console.error('Erro ao atualizar estoque:', error);
        alert(error.message || 'Erro ao atualizar estoque do medicamento');
    }
}

// Event listeners
document.querySelectorAll('th[data-ordem]').forEach(th => {
    th.addEventListener('click', () => {
        const campo = th.dataset.ordem;
        if (ordenacaoAtual.campo === campo) {
            ordenacaoAtual.ordem = ordenacaoAtual.ordem === 'asc' ? 'desc' : 'asc';
        } else {
            ordenacaoAtual.campo = campo;
            ordenacaoAtual.ordem = 'asc';
        }
        renderizarTabela();
    });
});

inputBusca.addEventListener('input', () => {
    paginaAtual = 1;
    renderizarTabela();
});

selectCategoria.addEventListener('change', () => {
    paginaAtual = 1;
    renderizarTabela();
});

selectEstoque.addEventListener('change', () => {
    paginaAtual = 1;
    renderizarTabela();
});

// Inicialização
let atualizacaoAutomatica;

async function inicializarAplicacao() {
    try {
        await carregarDados();
        // Configurar atualização automática
        atualizacaoAutomatica = setInterval(async () => {
            try {
                await carregarDados();
            } catch (error) {
                console.error('Erro na atualização automática:', error);
            }
        }, 5 * 60 * 1000);
    } catch (error) {
        console.error('Erro na inicialização:', error);
    }
}

// Iniciar aplicação
inicializarAplicacao();
// Seleção de elementos do DOM
const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');
const actionButtons = document.querySelectorAll('.action-button');
const navLinks = document.querySelectorAll('.nav-link');

// Estado inicial da aplicação
let medicamentos = [
    { id: 1, nome: 'Dipirona', quantidade: 100, validade: '2024-12-31' },
    { id: 2, nome: 'Paracetamol', quantidade: 150, validade: '2024-10-15' },
    { id: 3, nome: 'Ibuprofeno', quantidade: 80, validade: '2024-11-20' }
];

// Função para buscar medicamentos
function buscarMedicamentos(termo) {
    const resultados = medicamentos.filter(med =>
        med.nome.toLowerCase().includes(termo.toLowerCase())
    );
    exibirResultados(resultados);
}

// Função para exibir resultados da busca
function exibirResultados(resultados) {
    const heroSection = document.querySelector('.hero-section');
    let resultadosDiv = document.querySelector('.resultados-busca');
    
    if (!resultadosDiv) {
        resultadosDiv = document.createElement('div');
        resultadosDiv.className = 'resultados-busca';
        heroSection.appendChild(resultadosDiv);
    }

    resultadosDiv.innerHTML = resultados.length > 0
        ? `
            <h3>Resultados da Busca:</h3>
            <ul>
                ${resultados.map(med => `
                    <li>
                        ${med.nome} - Quantidade: ${med.quantidade} - Validade: ${med.validade}
                    </li>
                `).join('')}
            </ul>
        `
        : '<p>Nenhum medicamento encontrado.</p>';
}

// Event Listeners
searchButton.addEventListener('click', () => {
    buscarMedicamentos(searchInput.value);
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        buscarMedicamentos(searchInput.value);
    }
});

// Navegação
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

// Botões de ação
actionButtons.forEach(button => {
    button.addEventListener('click', () => {
        const action = button.parentElement.querySelector('h3').textContent;
        alert(`Funcionalidade "${action}" em desenvolvimento.`);
    });
});
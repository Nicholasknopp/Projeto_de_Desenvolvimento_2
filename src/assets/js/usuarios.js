// Variáveis globais
let usuarioModal;
let usuarioAtual = null;

// Inicialização quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa o modal do Bootstrap
    usuarioModal = new bootstrap.Modal(document.getElementById('usuarioModal'));

    // Adiciona listeners aos formulários
    document.getElementById('formLogin').addEventListener('submit', fazerLogin);
    document.getElementById('formUsuario').addEventListener('submit', (e) => e.preventDefault());

    // Verifica se já está logado
    const token = localStorage.getItem('token');
    if (token) {
        mostrarDashboard();
        carregarUsuarios();
    }
});

// Função para fazer login
async function fazerLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
        const response = await fetch('/src/api/auth.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('usuario', JSON.stringify(data.usuario));
            mostrarDashboard();
            carregarUsuarios();
        } else {
            alert('Email ou senha inválidos');
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        alert('Erro ao fazer login');
    }
}

// Função para carregar lista de usuários
async function carregarUsuarios() {
    try {
        const response = await fetch('/src/api/usuarios.php', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar usuários');
        }

        const usuarios = await response.json();
        const tbody = document.getElementById('listaUsuarios');
        tbody.innerHTML = '';

        usuarios.forEach(usuario => {
            tbody.innerHTML += `
                <tr>
                    <td>${usuario.nome}</td>
                    <td>${usuario.email}</td>
                    <td>${usuario.cargo === 'admin' ? 'Administrador' : 'Usuário'}</td>
                    <td>${usuario.ativo ? 'Ativo' : 'Inativo'}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="editarUsuario(${usuario.id})">Editar</button>
                        <button class="btn btn-sm btn-danger" onclick="excluirUsuario(${usuario.id})">Excluir</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        alert('Erro ao carregar lista de usuários');
    }
}

// Função para mostrar formulário de usuário
function mostrarFormUsuario() {
    usuarioAtual = null;
    document.getElementById('formUsuario').reset();
    document.getElementById('usuarioId').value = '';
    usuarioModal.show();
}

// Função para editar usuário
async function editarUsuario(id) {
    try {
        const response = await fetch(`/src/api/usuarios.php?id=${id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar dados do usuário');
        }

        usuarioAtual = await response.json();

        document.getElementById('usuarioId').value = usuarioAtual.id;
        document.getElementById('nome').value = usuarioAtual.nome;
        document.getElementById('emailUsuario').value = usuarioAtual.email;
        document.getElementById('cargo').value = usuarioAtual.cargo;
        document.getElementById('ativo').value = usuarioAtual.ativo ? '1' : '0';

        usuarioModal.show();
    } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        alert('Erro ao carregar dados do usuário');
    }
}

// Função para salvar usuário
async function salvarUsuario() {
    const id = document.getElementById('usuarioId').value;
    const usuario = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('emailUsuario').value,
        senha: document.getElementById('senhaUsuario').value,
        cargo: document.getElementById('cargo').value,
        ativo: document.getElementById('ativo').value === '1'
    };

    if (id) {
        usuario.id = id;
    }

    try {
        const response = await fetch('/src/api/usuarios.php', {
            method: id ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(usuario)
        });

        if (!response.ok) {
            throw new Error('Erro ao salvar usuário');
        }

        usuarioModal.hide();
        carregarUsuarios();
    } catch (error) {
        console.error('Erro ao salvar usuário:', error);
        alert('Erro ao salvar usuário');
    }
}

// Função para excluir usuário
async function excluirUsuario(id) {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) {
        return;
    }

    try {
        const response = await fetch(`/src/api/usuarios.php?id=${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao excluir usuário');
        }

        carregarUsuarios();
    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        alert('Erro ao excluir usuário');
    }
}

// Função para mostrar dashboard
function mostrarDashboard() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
}

// Função para fazer logout
function fazerLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('dashboard').style.display = 'none';
}
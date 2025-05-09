-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS gestao_medicamentos;
USE gestao_medicamentos;

-- Criar tabela de categorias
CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    ativo BOOLEAN DEFAULT true,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_categoria_nome (nome)
);

-- Criar tabela de fabricantes
CREATE TABLE IF NOT EXISTS fabricantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cnpj VARCHAR(14) UNIQUE,
    telefone VARCHAR(20),
    email VARCHAR(255),
    endereco TEXT,
    ativo BOOLEAN DEFAULT true,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_fabricante_nome (nome),
    INDEX idx_fabricante_cnpj (cnpj)
);

-- Criar tabela de fornecedores
CREATE TABLE IF NOT EXISTS fornecedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cnpj VARCHAR(14) UNIQUE,
    telefone VARCHAR(20),
    email VARCHAR(255),
    endereco TEXT,
    ativo BOOLEAN DEFAULT true,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_fornecedor_nome (nome),
    INDEX idx_fornecedor_cnpj (cnpj)
);

-- Criar tabela de medicamentos
CREATE TABLE IF NOT EXISTS medicamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    fabricante_id INT,
    forma_farmaceutica VARCHAR(100) NOT NULL,
    concentracao VARCHAR(50) NOT NULL,
    categoria_id INT,
    quantidade_estoque INT NOT NULL DEFAULT 0,
    estoque_minimo INT NOT NULL DEFAULT 0,
    estoque_maximo INT,
    preco_unitario DECIMAL(10,2),
    codigo_barras VARCHAR(50) UNIQUE,
    principio_ativo VARCHAR(255),
    controlado BOOLEAN DEFAULT false,
    receita_obrigatoria BOOLEAN DEFAULT false,
    ativo BOOLEAN DEFAULT true,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id),
    FOREIGN KEY (fabricante_id) REFERENCES fabricantes(id),
    INDEX idx_medicamento_nome (nome),
    INDEX idx_medicamento_codigo (codigo_barras)
);

-- Criar tabela de lotes
CREATE TABLE IF NOT EXISTS lotes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    medicamento_id INT NOT NULL,
    numero_lote VARCHAR(50) NOT NULL,
    quantidade INT NOT NULL,
    data_fabricacao DATE NOT NULL,
    data_validade DATE NOT NULL,
    preco_compra DECIMAL(10,2),
    fornecedor_id INT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (medicamento_id) REFERENCES medicamentos(id),
    FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id),
    INDEX idx_lote_numero (numero_lote),
    INDEX idx_lote_validade (data_validade)
);

-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    cargo VARCHAR(50) NOT NULL,
    telefone VARCHAR(20),
    cpf VARCHAR(11) UNIQUE,
    ativo BOOLEAN DEFAULT true,
    ultimo_acesso TIMESTAMP,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_usuario_email (email),
    INDEX idx_usuario_cpf (cpf)
);

-- Criar tabela de movimentações de estoque
CREATE TABLE IF NOT EXISTS movimentacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    medicamento_id INT NOT NULL,
    lote_id INT NOT NULL,
    usuario_id INT NOT NULL,
    fornecedor_id INT,
    tipo_movimentacao ENUM('entrada', 'saida', 'ajuste', 'perda') NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10,2),
    valor_total DECIMAL(10,2),
    numero_nota_fiscal VARCHAR(50),
    observacao TEXT,
    data_movimentacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (medicamento_id) REFERENCES medicamentos(id),
    FOREIGN KEY (lote_id) REFERENCES lotes(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id),
    INDEX idx_movimentacao_data (data_movimentacao),
    INDEX idx_movimentacao_tipo (tipo_movimentacao)
);

-- Criar tabela de notificações
CREATE TABLE IF NOT EXISTS notificacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL,
    mensagem TEXT NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_leitura TIMESTAMP,
    usuario_id INT,
    medicamento_id INT,
    lote_id INT,
    status ENUM('pendente', 'lida', 'arquivada') DEFAULT 'pendente',
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (medicamento_id) REFERENCES medicamentos(id),
    FOREIGN KEY (lote_id) REFERENCES lotes(id),
    INDEX idx_notificacao_status (status),
    INDEX idx_notificacao_data (data_criacao)
);

-- Inserir categorias básicas
INSERT INTO categorias (nome, descricao) VALUES
('Analgésicos', 'Medicamentos para alívio da dor'),
('Antibióticos', 'Medicamentos para combater infecções bacterianas'),
('Anti-inflamatórios', 'Medicamentos para reduzir inflamações'),
('Antialérgicos', 'Medicamentos para tratamento de alergias'),
('Antitérmicos', 'Medicamentos para redução da febre'),
('Antivirais', 'Medicamentos para combater infecções virais'),
('Antidepressivos', 'Medicamentos para tratamento da depressão'),
('Anti-hipertensivos', 'Medicamentos para controle da pressão arterial');

-- Inserir usuário administrador padrão (senha: admin123)
INSERT INTO usuarios (nome, email, senha, cargo, cpf) VALUES
('Administrador', 'admin@sistema.com', '$2y$10$8tDjcKM.PH5PBsw0WnD1E.QG8CpZcr7nqZ1QxT5Kz5JWZyF.p0Tqe', 'administrador', '00000000000');
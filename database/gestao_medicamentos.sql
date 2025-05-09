-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS gestao_medicamentos;
USE gestao_medicamentos;

-- Tabela de usuários
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    tipo_usuario ENUM('admin', 'farmaceutico', 'atendente') NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de categorias de medicamentos
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    descricao TEXT
);

-- Tabela de fornecedores
CREATE TABLE fornecedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cnpj VARCHAR(14) NOT NULL UNIQUE,
    endereco VARCHAR(200),
    telefone VARCHAR(20),
    email VARCHAR(100),
    contato_nome VARCHAR(100)
);

-- Tabela de medicamentos
CREATE TABLE medicamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    categoria_id INT,
    principio_ativo VARCHAR(100),
    dosagem VARCHAR(50),
    forma_farmaceutica VARCHAR(50),
    estoque_minimo INT NOT NULL DEFAULT 0,
    estoque_atual INT NOT NULL DEFAULT 0,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

-- Tabela de lotes
CREATE TABLE lotes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    medicamento_id INT NOT NULL,
    fornecedor_id INT NOT NULL,
    numero_lote VARCHAR(50) NOT NULL,
    data_fabricacao DATE NOT NULL,
    data_validade DATE NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (medicamento_id) REFERENCES medicamentos(id),
    FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id)
);

-- Tabela de movimentações de estoque
CREATE TABLE movimentacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    medicamento_id INT NOT NULL,
    lote_id INT NOT NULL,
    usuario_id INT NOT NULL,
    tipo_movimentacao ENUM('entrada', 'saida') NOT NULL,
    quantidade INT NOT NULL,
    data_movimentacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    observacao TEXT,
    FOREIGN KEY (medicamento_id) REFERENCES medicamentos(id),
    FOREIGN KEY (lote_id) REFERENCES lotes(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabela de prescrições
CREATE TABLE prescricoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    paciente_nome VARCHAR(100) NOT NULL,
    paciente_cpf VARCHAR(11),
    medico_nome VARCHAR(100) NOT NULL,
    medico_crm VARCHAR(20) NOT NULL,
    data_prescricao DATE NOT NULL,
    data_dispensacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id INT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabela de itens da prescrição
CREATE TABLE itens_prescricao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    prescricao_id INT NOT NULL,
    medicamento_id INT NOT NULL,
    lote_id INT NOT NULL,
    quantidade INT NOT NULL,
    posologia TEXT,
    FOREIGN KEY (prescricao_id) REFERENCES prescricoes(id),
    FOREIGN KEY (medicamento_id) REFERENCES medicamentos(id),
    FOREIGN KEY (lote_id) REFERENCES lotes(id)
);
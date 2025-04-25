-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS gestao_medicamentos;
USE gestao_medicamentos;

-- Tabela de usuários
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    cargo VARCHAR(50) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de categorias de medicamentos
CREATE TABLE categorias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL UNIQUE,
    descricao TEXT
);

-- Tabela de medicamentos
CREATE TABLE medicamentos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    fabricante VARCHAR(100) NOT NULL,
    forma_farmaceutica VARCHAR(50) NOT NULL,
    concentracao VARCHAR(50) NOT NULL,
    categoria_id INT,
    quantidade_estoque INT NOT NULL DEFAULT 0,
    estoque_minimo INT NOT NULL DEFAULT 0,
    data_validade DATE NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id),
    INDEX idx_nome (nome),
    INDEX idx_validade (data_validade)
);

-- Tabela de movimentações de estoque
CREATE TABLE movimentacoes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    medicamento_id INT NOT NULL,
    usuario_id INT NOT NULL,
    tipo_movimento ENUM('entrada', 'saida', 'ajuste') NOT NULL,
    quantidade INT NOT NULL,
    data_movimento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    observacao TEXT,
    FOREIGN KEY (medicamento_id) REFERENCES medicamentos(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    INDEX idx_medicamento (medicamento_id),
    INDEX idx_data (data_movimento)
);

-- Tabela de notificações
CREATE TABLE notificacoes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    medicamento_id INT NOT NULL,
    tipo_notificacao ENUM('validade', 'estoque_baixo', 'lembrete') NOT NULL,
    mensagem TEXT NOT NULL,
    data_notificacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lida BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (medicamento_id) REFERENCES medicamentos(id),
    INDEX idx_nao_lidas (lida)
);

-- Tabela de lembretes de medicação
CREATE TABLE lembretes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    medicamento_id INT NOT NULL,
    horario TIME NOT NULL,
    intervalo INT NOT NULL, -- intervalo em horas
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (medicamento_id) REFERENCES medicamentos(id),
    INDEX idx_horario (horario)
);

-- Índices adicionais para otimização de consultas frequentes
CREATE INDEX idx_estoque_baixo ON medicamentos(quantidade_estoque) WHERE quantidade_estoque <= estoque_minimo;
CREATE INDEX idx_validade_proxima ON medicamentos(data_validade) WHERE data_validade <= DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY);
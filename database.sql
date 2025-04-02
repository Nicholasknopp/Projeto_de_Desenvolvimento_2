CREATE DATABASE IF NOT EXISTS gestao_medicamentos;

USE gestao_medicamentos;

CREATE TABLE IF NOT EXISTS medicamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    quantidade INT NOT NULL DEFAULT 0,
    unidade VARCHAR(50) NOT NULL,
    status ENUM('Em estoque', 'Estoque baixo', 'Crítico') NOT NULL,
    validade DATE NOT NULL,
    lote VARCHAR(100) NOT NULL,
    fabricante VARCHAR(255) NOT NULL,
    concentracao VARCHAR(100) NOT NULL,
    formaFarmaceutica VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS movimentacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    medicamentoId INT NOT NULL,
    tipo ENUM('entrada', 'saida') NOT NULL,
    quantidade INT NOT NULL,
    data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responsavel VARCHAR(255) NOT NULL,
    observacao TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (medicamentoId) REFERENCES medicamentos(id)
);

-- Criar índices para melhor performance
CREATE INDEX idx_medicamento_nome ON medicamentos(nome);
CREATE INDEX idx_movimentacao_data ON movimentacoes(data);
CREATE INDEX idx_movimentacao_medicamento ON movimentacoes(medicamentoId);

-- Inserir dados de exemplo
INSERT INTO medicamentos (nome, quantidade, unidade, status, validade, lote, fabricante) VALUES
('Dipirona', 150, 'comprimidos', 'Em estoque', '2024-12-01', 'ABC123', 'Medley'),
('Paracetamol', 30, 'comprimidos', 'Estoque baixo', '2024-10-15', 'XYZ789', 'EMS'),
('Amoxicilina', 5, 'cápsulas', 'Crítico', '2024-08-20', 'DEF456', 'Neo Química');
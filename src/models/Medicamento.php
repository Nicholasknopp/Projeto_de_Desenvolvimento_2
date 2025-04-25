<?php
require_once __DIR__ . '/../Database.php';

class Medicamento {
    private $conn;
    private $table_name = "medicamentos";

    public $id;
    public $nome;
    public $fabricante;
    public $forma_farmaceutica;
    public $concentracao;
    public $categoria_id;
    public $quantidade_estoque;
    public $estoque_minimo;
    public $data_validade;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function criar() {
        $query = "INSERT INTO " . $this->table_name . "
                (nome, fabricante, forma_farmaceutica, concentracao, categoria_id,
                quantidade_estoque, estoque_minimo, data_validade)
                VALUES (:nome, :fabricante, :forma_farmaceutica, :concentracao,
                :categoria_id, :quantidade_estoque, :estoque_minimo, :data_validade)";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":nome", $this->nome);
        $stmt->bindParam(":fabricante", $this->fabricante);
        $stmt->bindParam(":forma_farmaceutica", $this->forma_farmaceutica);
        $stmt->bindParam(":concentracao", $this->concentracao);
        $stmt->bindParam(":categoria_id", $this->categoria_id);
        $stmt->bindParam(":quantidade_estoque", $this->quantidade_estoque);
        $stmt->bindParam(":estoque_minimo", $this->estoque_minimo);
        $stmt->bindParam(":data_validade", $this->data_validade);

        return $stmt->execute();
    }

    public function listar() {
        $query = "SELECT m.*, c.nome as categoria_nome
                FROM " . $this->table_name . " m
                LEFT JOIN categorias c ON m.categoria_id = c.id
                ORDER BY m.nome";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    public function buscarPorId($id) {
        $query = "SELECT m.*, c.nome as categoria_nome
                FROM " . $this->table_name . " m
                LEFT JOIN categorias c ON m.categoria_id = c.id
                WHERE m.id = ?";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $id);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function atualizar() {
        $query = "UPDATE " . $this->table_name . "
                SET nome = :nome,
                    fabricante = :fabricante,
                    forma_farmaceutica = :forma_farmaceutica,
                    concentracao = :concentracao,
                    categoria_id = :categoria_id,
                    quantidade_estoque = :quantidade_estoque,
                    estoque_minimo = :estoque_minimo,
                    data_validade = :data_validade
                WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":nome", $this->nome);
        $stmt->bindParam(":fabricante", $this->fabricante);
        $stmt->bindParam(":forma_farmaceutica", $this->forma_farmaceutica);
        $stmt->bindParam(":concentracao", $this->concentracao);
        $stmt->bindParam(":categoria_id", $this->categoria_id);
        $stmt->bindParam(":quantidade_estoque", $this->quantidade_estoque);
        $stmt->bindParam(":estoque_minimo", $this->estoque_minimo);
        $stmt->bindParam(":data_validade", $this->data_validade);

        return $stmt->execute();
    }

    public function deletar($id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $id);
        return $stmt->execute();
    }
}
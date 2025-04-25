<?php
require_once __DIR__ . '/../Database.php';

class Usuario {
    private $conn;
    private $table_name = "usuarios";

    public $id;
    public $nome;
    public $email;
    public $senha;
    public $cargo;
    public $ativo;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function criar() {
        $query = "INSERT INTO " . $this->table_name . "
                (nome, email, senha, cargo, ativo)
                VALUES (:nome, :email, :senha, :cargo, :ativo)";

        $stmt = $this->conn->prepare($query);

        $this->senha = password_hash($this->senha, PASSWORD_DEFAULT);

        $stmt->bindParam(":nome", $this->nome);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":senha", $this->senha);
        $stmt->bindParam(":cargo", $this->cargo);
        $stmt->bindParam(":ativo", $this->ativo);

        return $stmt->execute();
    }

    public function autenticar($email, $senha) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE email = ? AND ativo = true";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $email);
        $stmt->execute();

        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

        if($usuario && password_verify($senha, $usuario['senha'])) {
            return $usuario;
        }
        return false;
    }

    public function listar() {
        $query = "SELECT id, nome, email, cargo, ativo FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    public function buscarPorId($id) {
        $query = "SELECT id, nome, email, cargo, ativo FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $id);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function atualizar() {
        $query = "UPDATE " . $this->table_name . "
                SET nome = :nome,
                    email = :email,
                    cargo = :cargo,
                    ativo = :ativo";

        if(!empty($this->senha)) {
            $query .= ", senha = :senha";
            $this->senha = password_hash($this->senha, PASSWORD_DEFAULT);
        }

        $query .= " WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":nome", $this->nome);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":cargo", $this->cargo);
        $stmt->bindParam(":ativo", $this->ativo);
        $stmt->bindParam(":id", $this->id);

        if(!empty($this->senha)) {
            $stmt->bindParam(":senha", $this->senha);
        }

        return $stmt->execute();
    }

    public function deletar($id) {
        $query = "UPDATE " . $this->table_name . " SET ativo = false WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $id);
        return $stmt->execute();
    }
}
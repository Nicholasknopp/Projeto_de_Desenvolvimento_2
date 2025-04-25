<?php
require_once '../config/database.php';

class Medicamento {
    private $conn;
    private $table = 'medicamentos';

    // Propriedades
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

    // Criar novo medicamento
    public function criar() {
        $query = "INSERT INTO " . $this->table . "
                (nome, fabricante, forma_farmaceutica, concentracao, categoria_id, 
                quantidade_estoque, estoque_minimo, data_validade)
                VALUES (:nome, :fabricante, :forma_farmaceutica, :concentracao, 
                :categoria_id, :quantidade_estoque, :estoque_minimo, :data_validade)";

        $stmt = $this->conn->prepare($query);

        // Limpar e vincular dados
        $this->nome = htmlspecialchars(strip_tags($this->nome));
        $this->fabricante = htmlspecialchars(strip_tags($this->fabricante));
        $this->forma_farmaceutica = htmlspecialchars(strip_tags($this->forma_farmaceutica));
        $this->concentracao = htmlspecialchars(strip_tags($this->concentracao));

        $stmt->bindParam(':nome', $this->nome);
        $stmt->bindParam(':fabricante', $this->fabricante);
        $stmt->bindParam(':forma_farmaceutica', $this->forma_farmaceutica);
        $stmt->bindParam(':concentracao', $this->concentracao);
        $stmt->bindParam(':categoria_id', $this->categoria_id);
        $stmt->bindParam(':quantidade_estoque', $this->quantidade_estoque);
        $stmt->bindParam(':estoque_minimo', $this->estoque_minimo);
        $stmt->bindParam(':data_validade', $this->data_validade);

        return $stmt->execute();
    }

    // Ler todos os medicamentos
    public function ler() {
        $query = "SELECT m.*, c.nome as categoria_nome 
                FROM " . $this->table . " m
                LEFT JOIN categorias c ON m.categoria_id = c.id
                ORDER BY m.nome";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    // Ler um medicamento
    public function lerUm() {
        $query = "SELECT m.*, c.nome as categoria_nome 
                FROM " . $this->table . " m
                LEFT JOIN categorias c ON m.categoria_id = c.id
                WHERE m.id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $this->id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if($row) {
            $this->nome = $row['nome'];
            $this->fabricante = $row['fabricante'];
            $this->forma_farmaceutica = $row['forma_farmaceutica'];
            $this->concentracao = $row['concentracao'];
            $this->categoria_id = $row['categoria_id'];
            $this->quantidade_estoque = $row['quantidade_estoque'];
            $this->estoque_minimo = $row['estoque_minimo'];
            $this->data_validade = $row['data_validade'];
            return true;
        }
        return false;
    }

    // Atualizar medicamento
    public function atualizar() {
        $query = "UPDATE " . $this->table . "
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

        // Limpar e vincular dados
        $this->nome = htmlspecialchars(strip_tags($this->nome));
        $this->fabricante = htmlspecialchars(strip_tags($this->fabricante));
        $this->forma_farmaceutica = htmlspecialchars(strip_tags($this->forma_farmaceutica));
        $this->concentracao = htmlspecialchars(strip_tags($this->concentracao));

        $stmt->bindParam(':nome', $this->nome);
        $stmt->bindParam(':fabricante', $this->fabricante);
        $stmt->bindParam(':forma_farmaceutica', $this->forma_farmaceutica);
        $stmt->bindParam(':concentracao', $this->concentracao);
        $stmt->bindParam(':categoria_id', $this->categoria_id);
        $stmt->bindParam(':quantidade_estoque', $this->quantidade_estoque);
        $stmt->bindParam(':estoque_minimo', $this->estoque_minimo);
        $stmt->bindParam(':data_validade', $this->data_validade);
        $stmt->bindParam(':id', $this->id);

        return $stmt->execute();
    }

    // Excluir medicamento
    public function excluir() {
        $query = "DELETE FROM " . $this->table . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $this->id);
        return $stmt->execute();
    }

    // Buscar medicamentos
    public function buscar($termo) {
        $query = "SELECT m.*, c.nome as categoria_nome 
                FROM " . $this->table . " m
                LEFT JOIN categorias c ON m.categoria_id = c.id
                WHERE m.nome LIKE :termo
                OR m.fabricante LIKE :termo
                ORDER BY m.nome";

        $termo = "%{$termo}%";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':termo', $termo);
        $stmt->execute();

        return $stmt;
    }
}
?>
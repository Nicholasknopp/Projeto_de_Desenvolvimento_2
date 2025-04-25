<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

require_once '../models/Medicamento.php';

$medicamento = new Medicamento();

// Determinar o método HTTP
$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if(isset($_GET['id'])) {
            // Buscar um medicamento específico
            $medicamento->id = $_GET['id'];
            if($medicamento->lerUm()) {
                echo json_encode(array(
                    'id' => $medicamento->id,
                    'nome' => $medicamento->nome,
                    'fabricante' => $medicamento->fabricante,
                    'forma_farmaceutica' => $medicamento->forma_farmaceutica,
                    'concentracao' => $medicamento->concentracao,
                    'categoria_id' => $medicamento->categoria_id,
                    'quantidade_estoque' => $medicamento->quantidade_estoque,
                    'estoque_minimo' => $medicamento->estoque_minimo,
                    'data_validade' => $medicamento->data_validade
                ));
            } else {
                http_response_code(404);
                echo json_encode(array('mensagem' => 'Medicamento não encontrado'));
            }
        } else {
            // Listar todos os medicamentos
            $stmt = $medicamento->ler();
            $num = $stmt->rowCount();

            if($num > 0) {
                $medicamentos_arr = array();

                while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    extract($row);
                    $item = array(
                        'id' => $id,
                        'nome' => $nome,
                        'fabricante' => $fabricante,
                        'forma_farmaceutica' => $forma_farmaceutica,
                        'concentracao' => $concentracao,
                        'categoria_id' => $categoria_id,
                        'categoria_nome' => $categoria_nome,
                        'quantidade_estoque' => $quantidade_estoque,
                        'estoque_minimo' => $estoque_minimo,
                        'data_validade' => $data_validade
                    );
                    array_push($medicamentos_arr, $item);
                }

                echo json_encode($medicamentos_arr);
            } else {
                echo json_encode(array());
            }
        }
        break;

    case 'POST':
        // Criar novo medicamento
        $data = json_decode(file_get_contents('php://input'));

        if(
            !empty($data->nome) &&
            !empty($data->fabricante) &&
            !empty($data->forma_farmaceutica) &&
            !empty($data->concentracao) &&
            !empty($data->categoria_id) &&
            isset($data->quantidade_estoque) &&
            isset($data->estoque_minimo) &&
            !empty($data->data_validade)
        ) {
            $medicamento->nome = $data->nome;
            $medicamento->fabricante = $data->fabricante;
            $medicamento->forma_farmaceutica = $data->forma_farmaceutica;
            $medicamento->concentracao = $data->concentracao;
            $medicamento->categoria_id = $data->categoria_id;
            $medicamento->quantidade_estoque = $data->quantidade_estoque;
            $medicamento->estoque_minimo = $data->estoque_minimo;
            $medicamento->data_validade = $data->data_validade;

            if($medicamento->criar()) {
                http_response_code(201);
                echo json_encode(array('mensagem' => 'Medicamento criado com sucesso'));
            } else {
                http_response_code(503);
                echo json_encode(array('mensagem' => 'Não foi possível criar o medicamento'));
            }
        } else {
            http_response_code(400);
            echo json_encode(array('mensagem' => 'Dados incompletos'));
        }
        break;

    case 'PUT':
        // Atualizar medicamento
        $data = json_decode(file_get_contents('php://input'));

        if(isset($data->id)) {
            $medicamento->id = $data->id;
            $medicamento->nome = $data->nome;
            $medicamento->fabricante = $data->fabricante;
            $medicamento->forma_farmaceutica = $data->forma_farmaceutica;
            $medicamento->concentracao = $data->concentracao;
            $medicamento->categoria_id = $data->categoria_id;
            $medicamento->quantidade_estoque = $data->quantidade_estoque;
            $medicamento->estoque_minimo = $data->estoque_minimo;
            $medicamento->data_validade = $data->data_validade;

            if($medicamento->atualizar()) {
                http_response_code(200);
                echo json_encode(array('mensagem' => 'Medicamento atualizado com sucesso'));
            } else {
                http_response_code(503);
                echo json_encode(array('mensagem' => 'Não foi possível atualizar o medicamento'));
            }
        } else {
            http_response_code(400);
            echo json_encode(array('mensagem' => 'ID do medicamento não fornecido'));
        }
        break;

    case 'DELETE':
        // Excluir medicamento
        if(isset($_GET['id'])) {
            $medicamento->id = $_GET['id'];

            if($medicamento->excluir()) {
                http_response_code(200);
                echo json_encode(array('mensagem' => 'Medicamento excluído com sucesso'));
            } else {
                http_response_code(503);
                echo json_encode(array('mensagem' => 'Não foi possível excluir o medicamento'));
            }
        } else {
            http_response_code(400);
            echo json_encode(array('mensagem' => 'ID do medicamento não fornecido'));
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(array('mensagem' => 'Método não permitido'));
        break;
}
?>
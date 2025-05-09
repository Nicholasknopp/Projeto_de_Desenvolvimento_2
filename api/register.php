<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/../src/models/Usuario.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!empty($data['nome']) && !empty($data['email']) && !empty($data['senha']) && !empty($data['cargo'])) {
        $usuario = new Usuario();
        $usuario->nome = $data['nome'];
        $usuario->email = $data['email'];
        $usuario->senha = $data['senha'];
        $usuario->cargo = $data['cargo'];
        $usuario->ativo = true;

        try {
            if ($usuario->criar()) {
                http_response_code(201);
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Usuário criado com sucesso'
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Erro ao criar usuário'
                ]);
            }
        } catch (PDOException $e) {
            if ($e->getCode() == 23000) { // Código de erro para violação de chave única
                http_response_code(400);
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Email já cadastrado'
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Erro interno do servidor'
                ]);
            }
        }
    } else {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Todos os campos são obrigatórios'
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Método não permitido'
    ]);
}
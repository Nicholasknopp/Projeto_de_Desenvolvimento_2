<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/../src/models/Usuario.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!empty($data['email']) && !empty($data['senha'])) {
        $usuario = new Usuario();
        $resultado = $usuario->autenticar($data['email'], $data['senha']);

        if ($resultado) {
            // Remove a senha antes de enviar os dados do usuário
            unset($resultado['senha']);
            
            // Gera um token simples (em produção, usar JWT)
            $token = bin2hex(random_bytes(32));
            
            http_response_code(200);
            echo json_encode([
                'status' => 'success',
                'message' => 'Login realizado com sucesso',
                'token' => $token,
                'usuario' => $resultado
            ]);
        } else {
            http_response_code(401);
            echo json_encode([
                'status' => 'error',
                'message' => 'Email ou senha inválidos'
            ]);
        }
    } else {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Email e senha são obrigatórios'
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Método não permitido'
    ]);
}
const jwt = require('jsonwebtoken');
const { usuarioModel } = require('../models/data');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            throw new Error('Token não fornecido');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const usuario = await usuarioModel.findById(decoded.id);

        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }

        if (!usuario.ativo) {
            throw new Error('Usuário inativo');
        }

        req.token = token;
        req.usuario = usuario;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Por favor, faça login.' });
    }
};

module.exports = auth;
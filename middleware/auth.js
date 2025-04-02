const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            throw new Error('Token não fornecido');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const usuario = await prisma.usuario.findUnique({
            where: { id: decoded.id }
        });

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
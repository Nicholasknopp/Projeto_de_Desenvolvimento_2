const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cargo: {
        type: DataTypes.ENUM('admin', 'farmaceutico', 'atendente'),
        allowNull: false,
        defaultValue: 'atendente'
    },
    ativo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    ultimoLogin: {
        type: DataTypes.DATE
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    hooks: {
        beforeCreate: async (usuario) => {
            if (usuario.senha) {
                usuario.senha = await bcrypt.hash(usuario.senha, 8);
            }
        },
        beforeUpdate: async (usuario) => {
            if (usuario.changed('senha')) {
                usuario.senha = await bcrypt.hash(usuario.senha, 8);
            }
        }
    }
});

Usuario.prototype.verificarSenha = function(senha) {
    return bcrypt.compare(senha, this.senha);
};

module.exports = Usuario;
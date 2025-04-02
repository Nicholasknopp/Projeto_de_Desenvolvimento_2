const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Medicamento = require('./Medicamento');

const Movimentacao = sequelize.define('Movimentacao', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    medicamentoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'medicamentos',
            key: 'id'
        }
    },
    tipo: {
        type: DataTypes.ENUM('entrada', 'saida'),
        allowNull: false
    },
    quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    data: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    responsavel: {
        type: DataTypes.STRING,
        allowNull: false
    },
    observacao: {
        type: DataTypes.TEXT
    }
});

Movimentacao.belongsTo(Medicamento);
Medicamento.hasMany(Movimentacao);

module.exports = Movimentacao;
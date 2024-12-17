const { DataTypes } = require('sequelize');
const sequelize = require('../configDataBase'); // Importă conexiunea Sequelize

const Form = sequelize.define('Form', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    data: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    noInvoice: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    info: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ust: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    noViolin: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    noViola: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    noCello: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    noKontrabass: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'forms',
    timestamps: false,
});

module.exports = Form;

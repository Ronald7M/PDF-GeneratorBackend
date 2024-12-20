const { DataTypes } = require('sequelize');
const sequelize = require('../configDataBase'); 

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
}, {
    tableName: 'forms',
    timestamps: false,
});

module.exports = Form;

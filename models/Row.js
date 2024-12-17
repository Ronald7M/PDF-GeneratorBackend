const { DataTypes } = require('sequelize');
const sequelize = require('../configDataBase'); // Importă conexiunea Sequelize

const Row = sequelize.define('Row', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    item: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'rows',
    timestamps: false,
});

module.exports = Row;

const { DataTypes } = require('sequelize');
const sequelize = require('../configDataBase'); // importă conexiunea la baza de date

const Table = sequelize.define('Invoices', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING, // Sau DataTypes.TEXT, în funcție de lungimea numelui
    allowNull: false,
  },
  pdf: {
    type: DataTypes.BLOB('long'), // BLOB pentru a stoca fișierul PDF
    allowNull: false,
  },
  date:{
    type: DataTypes.STRING,
  }
}, {
  tableName: 'invoices', // Numele tabelei în baza de date
  timestamps: false, // Dacă vrei să adaugi timestampuri (createdAt, updatedAt)
});

module.exports = Table;
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('mydatabase',  process.env.DB_USER,  process.env.DB_PASS, {
    host: 'localhost',
    port: '3307',
    dialect: 'mysql',
});


sequelize.authenticate()
    .then(() => console.log('Conexiune la baza de date reușită!'))
    .catch(err => console.error('Eroare la conectare:', err));

module.exports = sequelize;
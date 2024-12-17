const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('mydatabase', 'myuser', 'mypassword', {
    host: 'localhost',
    port: '4000',
    dialect: 'mysql',
});


sequelize.authenticate()
    .then(() => console.log('Conexiune la baza de date reușită!'))
    .catch(err => console.error('Eroare la conectare:', err));

module.exports = sequelize;
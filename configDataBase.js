const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('mydatabase',  process.env.DB_USER,  process.env.DB_PASS, {
    host: '172.17.0.1',
    port: '3306',
    dialect: 'mysql',
});

console.log(process.env.DB_USER)
console.log(process.env.DB_PASS)
console.log("da")



sequelize.authenticate()
    .then(() => console.log('Conexiune la baza de date reușită!'))
    .catch(err => console.error('Eroare la conectare:', err));

module.exports = sequelize;
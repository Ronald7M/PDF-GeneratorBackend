const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('mydatabase',  process.env.DB_USER,  process.env.DB_PASS, {
    host: 'chacha-db',
    port: '3306',
    dialect: 'mysql',
});

// const sequelize = new Sequelize('mydatabase',  'chahca',  'barbershop', {
//     host: 'ronsky.ro',
//     port: '3307',
//     dialect: 'mysql',
// });

console.log("da")



sequelize.authenticate()
    .then(() => console.log('Conexiune la baza de date reușită!'))
    .catch(err => console.error('Eroare la conectare:', err));

module.exports = sequelize;

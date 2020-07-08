const { Sequelize } = require('sequelize');

const { DATABASE_URL } = process.env;

const sequelize = new Sequelize(DATABASE_URL, { logging: true });

sequelize
  .authenticate()
  .then(() => {
    console.log('Success!');
  })
  .catch((err) => {
    console.error('Failure', err);
  });

sequelize.sync();

module.exports = sequelize;

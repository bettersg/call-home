const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('sqlite::memory');

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

const { Sequelize } = require('sequelize');

const { DATABASE_URL } = process.env;

let sequelize;
if (DATABASE_URL && DATABASE_URL.startsWith('postgres')) {
  sequelize = new Sequelize(DATABASE_URL);
} else {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: '/tmp/ring-a-senior.sqlite',
  });
}

// const sequelize = new Sequelize('sqlite::memory');

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

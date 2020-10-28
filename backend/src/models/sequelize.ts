import { Sequelize } from 'sequelize-typescript';

import { logger } from '../config';

const { DATABASE_URL } = process.env;

function testy() {
  logger.error('I am from testy');
  throw new Error('test');
}

if (!DATABASE_URL) {
  logger.error('DATABASE_URL was not found');
  throw new Error('DATABASE_URL was not found');
}

const sequelize = new Sequelize(DATABASE_URL, {
  logging: logger.info.bind(logger),
});

sequelize
  .authenticate()
  .then(() => {
    logger.info('Success!');
  })
  .catch((err) => {
    logger.error('Failure', err);
  });

sequelize.sync();

testy();

export default sequelize;

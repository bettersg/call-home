import { Sequelize } from 'sequelize-typescript';
import pino from 'pino';

const logger = pino();

const { DATABASE_URL } = process.env;

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

export default sequelize;

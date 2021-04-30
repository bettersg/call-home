import { Sequelize } from 'sequelize-typescript';

import { logger } from '../config';

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  logger.error('DATABASE_URL was not found');
  throw new Error('DATABASE_URL was not found');
}

const sequelizeOptions = DATABASE_URL.includes('postgres')
  ? ({
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    } as any)
  : {};

const sequelize = new Sequelize(DATABASE_URL, {
  // Disable logging because we exceed our quota too often
  logging: false, // logger.info.bind(logger),
  ...sequelizeOptions,
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

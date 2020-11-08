import pino from 'pino';

const { NODE_ENV } = process.env;
const isDev = NODE_ENV !== 'production';
const config = isDev
  ? {
      prettyPrint: {
        levelFirst: true,
      },
    }
  : undefined;

const httpConfig = {
  autoLogging: false,
  ...config,
};
const logger = pino(config);

export { httpConfig };
export default logger;

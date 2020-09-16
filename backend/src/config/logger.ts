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
  ...config,
  ...(isDev
    ? {
        autoLogging: false,
      }
    : {}),
};
const logger = pino(config);

export { httpConfig };
export default logger;

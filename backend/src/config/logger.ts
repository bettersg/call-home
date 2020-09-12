import pino from 'pino';

const { NODE_ENV } = process.env;
const isProd = NODE_ENV !== 'development';
const config = isProd
  ? undefined
  : {
      prettyPrint: {
        levelFirst: true,
      },
    };
const httpConfig = {
  ...config,
  ...(isProd
    ? {}
    : {
        autoLogging: false,
      }),
};
const logger = pino(config);

export { httpConfig };
export default logger;

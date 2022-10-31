import pino from 'pino';
import PinoHttp from 'pino-http';

const { NODE_ENV } = process.env;
const isDev = NODE_ENV !== 'production';
const config = isDev
  ? {
      prettyPrint: {
        levelFirst: true,
      },
    }
  : undefined;

const httpConfig: PinoHttp.Options = {
  autoLogging: false,
  serializers: {
    req(req: Request) {
      const smallerReq: any = {
        ...req,
      };
      delete smallerReq.headers;
      delete smallerReq.remoteAddress;
      delete smallerReq.remotePort;
      return smallerReq;
    },
  },
  ...config,
};
const logger = pino(config);

export { httpConfig };
export default logger;

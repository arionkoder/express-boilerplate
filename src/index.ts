import express, { Response as ExResponse, Request as ExRequest, NextFunction } from 'express';
import * as bodyParser from 'body-parser';
import { RegisterRoutes } from '../build/routes';
import { ValidateError } from 'tsoa';
import { AppDataSource } from './data-source';
import * as dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

AppDataSource.initialize().then(async () => {
  // create express app
  dotenv.config();
  const app = express();
  const PORT = process.env.NODE_DOCKER_PORT || 8080;
  app.use(helmet());
  // Use body parser to read sent json payloads
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
  app.use(bodyParser.json());

  /*
    const defaultCspOptions = helmet.contentSecurityPolicy.getDefaultDirectives();
    delete defaultCspOptions["upgrade-insecure-requests"]
    
    app.use(helmet({
      contentSecurityPolicy: {
        useDefaults: false,
        directives: { ...defaultCspOptions },
      }}
    ));
    */

  app.disable('x-powered-by');
  app.use(cors());
  app.use(express.static('public'));
  app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
      swaggerOptions: {
        url: '/swagger.json',
      },
    })
  );

  app.use(express.json());
  RegisterRoutes(app);
  app.use(function notFoundHandler(_req, res: ExResponse) {
    res.status(404).send({
      message: 'Not Found',
    });
  });
  app.use(function errorHandler(err: unknown, req: ExRequest, res: ExResponse, next: NextFunction): ExResponse | void {
    if (err instanceof ValidateError) {
      console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
      return res.status(422).json({
        message: 'Validation Failed',
        details: err?.fields,
      });
    }
    if (err instanceof Error) {
      return res.status(500).json({
        message: 'Internal Server Error',
      });
    }

    next();
  });
  app.listen(PORT);
});

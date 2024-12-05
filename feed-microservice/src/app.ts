import express, { Application } from 'express';
import bodyParser from 'body-parser';
import admin from 'firebase-admin';
import { serve, setup } from 'swagger-ui-express';
import config from './config/env';
import { connectToDB } from './infrastructure/database/database';
import { JwtHelperImplementation } from './infrastructure/jwt/jwtHelper';
import { AuthMiddlewareImplementation } from './infrastructure/middlewares/auth.middleware';
import { MongoPostRepository } from './infrastructure/repositories/MongoPostRepository';
import postRoutes from './web/routes/postRoutes';
import swaggerDocument from './docs/swagger/swagger.json';

const app: Application = express();

admin.initializeApp({
  credential: admin.credential.cert(config.firebaseConfig),
  storageBucket: 'gs://plat-centro-neurosensorial.appspot.com',
});
export const bucket = admin.storage().bucket();

export const postRepository = MongoPostRepository.getInstance();
export const jwtHelper = JwtHelperImplementation.getInstance();
export const authMiddleware = AuthMiddlewareImplementation.getInstance();

const startServer = async () => {
  try {
    await connectToDB();

    /* Middlewares */
    app.use(express.json());
    app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

    // Swagger endpoint
    app.use('/posts/swagger', serve, setup(swaggerDocument));

    app.use(postRoutes);

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
    process.exit(1);
  }
};

startServer();
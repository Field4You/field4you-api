// Load environment variables
import express, { Application } from 'express';
import bodyParser from 'body-parser';
import authRoutes from './web/routes/authRoutes';
import { MongoUserRepository } from './infrastructure/repositories/MongoUserRepository';
import { JwtHelperImplementation } from './infrastructure/jwt/jwtHelper';
import { MailerImplementation } from './infrastructure/mailer/mailer';
import { AuthMiddlewareImplementation } from './infrastructure/middlewares/auth.middleware';

const app: Application = express();
export const userRepository = MongoUserRepository.getInstance();
export const jwtHelper = JwtHelperImplementation.getInstance();
export const mailer = MailerImplementation.getInstance();
export const authMiddleware = AuthMiddlewareImplementation.getInstance();

/* Middlewares */
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(authRoutes);

export default app;

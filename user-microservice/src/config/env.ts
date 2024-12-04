import dotenv from 'dotenv';

dotenv.config();

// Configure database properties
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  throw new Error(
    'The environment variable MONGODB_URI is required but is not defined.'
  );
}

// Configure properties related to auth-microservice
const authGatewayServiceUri = process.env.AUTH_GATEWAY_SERVICE_URL;
if (!authGatewayServiceUri) {
  throw new Error(
    'The environment variables AUTH_GATEWAY_SERVICE_URL is required but is not defined.'
  );
}

export default {
  mongoUri,
  port: process.env.PORT || 3002,
  jwtSecret: process.env.JWT_SECRET || 'secret',
  authGatewayServiceUri,
};

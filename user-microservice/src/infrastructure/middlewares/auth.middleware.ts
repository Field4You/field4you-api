import { jwtHelper } from '../../app';
import { AuthMiddleware } from '../../domain/interfaces/AuthMiddleware';

export class AuthMiddlewareImplementation implements AuthMiddleware {
  private static instance: AuthMiddlewareImplementation;

  private constructor() {}

  public static getInstance(): AuthMiddlewareImplementation {
    if (!AuthMiddlewareImplementation.instance) {
      AuthMiddlewareImplementation.instance =
        new AuthMiddlewareImplementation();
    }

    return AuthMiddlewareImplementation.instance;
  }

  async authenticate(
    authServiceUserId: string,
    userEmail: string,
    token: string
  ): Promise<boolean> {
    const decodedPayload = await jwtHelper.decodeBearerToken(token);
    if (!decodedPayload) {
      return false;
    }

    const { userId, userType, email, iat, exp } = decodedPayload;
    const tokenExpired = await this.validateTokenExpirationDate(exp);
    if (!tokenExpired) {
      return false;
    }

    if (!(userType === 'admin')) {
      if (!(email === userEmail) || !(userId === authServiceUserId)) {
        return false;
      }
    }

    return true;
  }

  async validateTokenExpirationDate(expiration: number): Promise<boolean> {
    if (expiration < Date.now()) {
      return false;
    }

    return true;
  }
}

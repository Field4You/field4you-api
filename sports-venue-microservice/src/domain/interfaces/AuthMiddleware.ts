export interface AuthMiddleware {
    authenticate(
      authServiceUserId: string,
      email: string,
      token: string
    ): Promise<boolean>;
  }
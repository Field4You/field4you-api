import { User } from '../entities/User';

export interface IUserRepository {
  create(user: User): Promise<User>;
  getById(id: string): Promise<User | undefined>;
}

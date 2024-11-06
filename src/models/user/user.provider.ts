import { Constants } from 'src/config';
import { User } from './user.model';

export const userProviders = [
  {
    provide: Constants.Database.DatabaseRepositories.UserRepository,
    useValue: User,
  },
];

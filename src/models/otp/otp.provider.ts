import { Constants } from 'src/config';
import { OTP } from './otp.model';

export const otpProviders = [
  {
    provide: Constants.Database.DatabaseRepositories.OTPRepository,
    useValue: OTP,
  },
];

import { Constants } from 'src/config';

const characters = Constants.OTP.OTPCharacters;
const OTPLength = Constants.OTP.OTPLength;

export const normalizeString = (str: string | undefined | null) => {
  if (str) return str.trim().toLowerCase();
  return null;
};

export const generateRandomString = (length: number = OTPLength) => {
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
};

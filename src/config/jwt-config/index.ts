import * as jwt from 'jsonwebtoken';

export const JWT_SECRET = 'random-secret-key';

export const JWT_OPTIONS: jwt.SignOptions = {
  expiresIn: '12h',
};
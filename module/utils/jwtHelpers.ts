import jwt, { Secret, SignOptions } from 'jsonwebtoken';

export const createToken = (
  payload: Record<string, unknown>,
  secret: Secret,
  expireTime: string
) => {
  return jwt.sign(payload, secret, {
    expiresIn: expireTime as SignOptions['expiresIn'],
  });
};

export const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret);
};

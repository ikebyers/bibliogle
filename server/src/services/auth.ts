import jwt from 'jsonwebtoken';
import { Request } from 'express';
import { JwtPayload } from '../types/types';


// Apollo Server context to validate tokens
export const authenticateToken = ({ req }: { req: Request }): JwtPayload | null => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.split(' ')[1]; // Extract token from the `Authorization` header

  if (!token) return null; // Return null if no token is provided

  try {
    const secret = process.env.JWT_SECRET_KEY || 'default-secret-key';
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return decoded; // Return the decoded token payload
  } catch (error) {
    console.error('Invalid token:', error);
    return null; // Return null if token verification fails
  }
};

export const signToken = (username: string, email: string, id: string) => {
  const payload = { username, email, id };
  const secretKey = process.env.JWT_SECRET_KEY || '';

  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

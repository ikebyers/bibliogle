import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();

interface JwtPayload {
  _id: string;
  username: string;
  email: string;
}

// Apollo Server context to validate tokens
export const authMiddleware = ({ req }: { req: any }) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  const secretKey = process.env.JWT_SECRET_KEY || '';

  try {
    // Verify the token and return decoded user payload
    const user = jwt.verify(token, secretKey) as JwtPayload;
    return user; // Attach the user payload to the Apollo Server context
  } catch (err) {
    console.error('Invalid token:', err);
    return null; 
  }
};

export const signToken = (username: string, email: string, _id: string) => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || '';

  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

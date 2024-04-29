import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { GetServerSideProps } from 'next';
import { IncomingMessage } from 'http';

interface SignOption {
  expiresIn?: string | number;
}

const DEFAULT_SIGN_OPTION: SignOption = {
  expiresIn: "30d",
};

export const verifyToken = (token: string) => {
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  } catch (e) {
    return null;
  }
}


export const signInToken = (payload: JwtPayload, options: SignOption = DEFAULT_SIGN_OPTION) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, options);
}
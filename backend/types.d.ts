import express from 'express';

declare global {
  namespace Express {
    interface Request {
      user: any | undefined;  // Use a specific type here if you know the structure of `user`
    }
  }
}

import { NextFunction, Request, Response } from 'express';

export const createToken = async (req: Request, res: Response, next: NextFunction) => {
  res.json({ data: 'Not yet implemented' });
  next();
};

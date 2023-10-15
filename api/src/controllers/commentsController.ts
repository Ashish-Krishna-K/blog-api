import { NextFunction, Request, Response } from 'express';

export const getAllComments = async (req: Request, res: Response, next: NextFunction) => {
  res.json({ data: 'Not yet implemented' });
  next();
};

export const createComment = async (req: Request, res: Response, next: NextFunction) => {
  res.json({ data: 'Not yet implemented' });
  next();
};

export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
  res.json({ data: 'Not yet implemented' });
  next();
};
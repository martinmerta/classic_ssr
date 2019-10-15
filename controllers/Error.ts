import express, { Request, Response, NextFunction } from 'express';
export const Error = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).render('404', { pageTitle: 'Home Site' });
};
export const get500 = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(500).render('500', { pageTitle: 'Error' });
};

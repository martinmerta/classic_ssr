import { NextFunction, Response, Request } from 'express';

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.isLogged) {
    return res.redirect('/login');
  }
  next();
};

import express, { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';

export const getHomePage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const toDoPermission = req.session.isLogged;
  try {
    res.render('home', { pageTitle: 'Home Site', isLog: toDoPermission });
  } catch (err) {
    console.log(err);
  }
};

export const getCreateAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.render('create', {
      pageTitle: 'Create Profile Site',
      errorMessage: false
    });
  } catch (err) {
    console.log(err);
  }
};

export const postCreateAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const name = req.body.username;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      return res.status(422).render('create', {
        pageTitle: 'Create Profile Site',
        errorMessage: errors.array()
      });
    }
    if (password !== confirmPassword) {
      return res.status(422).render('create', {
        pageTitle: 'Create Profile Site',
        errorMessage: errors.array()
      });
    }
    const hashPassword = await bcrypt.hash(password, 12);
    const user = new User(name, hashPassword);
    await user.save();
    return res.redirect('/logIn');
  } catch (err) {
    console.log(err);
    next(new Error(err));
  }
};

export const getLogIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.render('login', { pageTitle: 'login Site', errorMessage: false });
  } catch (err) {
    console.log(err);
  }
};

export const postLogIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.render('login', { pageTitle: 'login Site', errorMessage: false });
  } catch (err) {
    next(new Error(err));
  }
};

export const postLogged = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      return res.status(422).render('login', {
        pageTitle: 'Login Site',
        errorMessage: errors.array()[0].msg
      });
    }
    const user = await User.fetch().findOne({ username });
    if (!user) {
      return res.redirect('/');
    }
    const doMatch = await bcrypt.compare(password, user.password);
    if (doMatch) {
      req.session.isLogged = true;
      req.session.username = username;
      return req.session.save(err => {
        console.log(err);
        res.redirect('/');
      });
    }
    return res.redirect('/login');
  } catch (err) {
    next(new Error(err));
  }
};
export const getPassChange = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    return res.render('passChange', {
      pageTitle: 'Change Password',
      errorMessage: false
    });
  } catch (err) {
    next(new Error(err));
  }
};
export const postPassChange = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password, newPassword, repeatPassword } = req.body;
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      return res.status(422).render('passChange', {
        pageTitle: 'Password Change Site',
        errorMessage: errors.array()
      });
    }
    const user = await User.fetch().findOne({ username });
    if (!user) {
      return res.redirect('/');
    }
    const doMatch = await bcrypt.compare(password, user.password);
    if (!doMatch) {
      return res.redirect('/passChange');
    }
    if (newPassword === repeatPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      return User.resetPassword(username, hashedPassword);
    } else {
      return res.redirect('/passChange');
    }
  } catch (err) {
    next(new Error(err));
  }
};

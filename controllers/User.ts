import express, { Request, Response, NextFunction } from 'express';
import { Task } from '../models/Task';
import { User } from '../models/User';
export const getUpdateTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.session.isLogged) {
      const { username } = req.session;
      const index = parseInt(req.query.task);
      await Task.deleteTask(username, index);
      return res.redirect('/todo');
    } else {
      return res.redirect('/login');
    }
  } catch (err) {
    next(new Error(err));
  }
};
export const getToDo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.session.isLogged) {
      const { username } = req.session;
      const tasks = await Task.getTasks(username);
      res.render('todo', { pageTitle: 'To do tasks Site', tasks });
    } else {
      res.redirect('login');
    }
  } catch (err) {
    next(new Error(err));
  }
};
export const getLogout = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.session.destroy(() => {
      return res.redirect('/');
    });
  } catch (err) {
    next(new Error(err));
  }
};
export const postSaveTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { task } = req.body;
  const { username } = req.session;
  try {
    if (req.session.isLogged) {
      const user = await User.fetch().findOne({ username });
      if (user.tasks) {
        await Task.saveTask(username, [...user.tasks, task]);
      } else {
        await Task.saveTask(username, [task]);
      }
      return res.redirect('/todo');
    } else {
      return res.redirect('/todo');
    }
  } catch (err) {
    next(new Error(err));
  }
};

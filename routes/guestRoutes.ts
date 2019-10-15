import express from 'express';
import { check } from 'express-validator';
import {
  getCreateAccount,
  getLogIn,
  postLogIn,
  postLogged,
  postCreateAccount,
  getLogout,
  getPassChange,
  postPassChange
} from '../controllers';
const router = express.Router();
router.get('/create', getCreateAccount);
router.post(
  '/create',
  [
    check(['username', 'password'])
      .isLength({ min: 3 })
      .trim()
      .isString()
      .withMessage('Incorrect username or password, Please try again'),
    check('password')
      .isLength({ min: 3 })
      .trim()
      .isString()
      .custom((value, { req }) => {
        if (value !== req.body.confirmPassword) {
          throw new Error(
            'Password must be equal to repeat password and must contain at least 3 characters'
          );
        } else return true;
      })
  ],
  postCreateAccount
);
router.get('/login', getLogIn);
router.post('/login', postLogIn);
router.post(
  '/logged',
  [
    check(['username', 'password'])
      .isLength({ min: 3 })
      .trim()
      .isString()
      .withMessage('Invalid email or password')
  ],
  postLogged
);
router.get('/passChange', getPassChange);
router.post(
  '/passChange',
  [
    check(['username', 'password'])
      .isLength({ min: 3 })
      .trim()
      .isString()
      .withMessage('User name and password must contain at least 3 characters'),
    check('newPassword')
      .isLength({ min: 3 })
      .isString()
      .withMessage('New password must contains at least 3 characters')
      .custom((value, { req }) => {
        if (value !== req.body.repeatPassword) {
          throw new Error('New password must be equal to repeat password');
        }
        return true;
      })
  ],
  postPassChange
);
router.get('/logout', getLogout);
export { router };

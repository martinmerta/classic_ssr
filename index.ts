import express, {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler
} from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import session from 'express-session';
const MongoDBStore = require('connect-mongodb-session')(session);
import csrf from 'csurf';
import { router as guestRoutes } from './routes/guestRoutes';
import { router as authRoutes } from './routes/authRoutes';
import { isAuth } from './middleware/is-auth';
import { Error, get500 } from './controllers';
import { mongoClient } from './util/db';
const app = express();
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
const store = new MongoDBStore({
  uri:
    'mongodb+srv://<username>:<password>@<databasename>-fqsbx.mongodb.net/todo',
  collection: 'sessions'
});
const csrfProtection = csrf();
app.use(
  session({
    secret: 'olamakotaakotmaale',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(csrfProtection, (req: Request, res: Response, next: NextFunction) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(guestRoutes);
app.use(isAuth, authRoutes);
app.use(Error);
app.use(get500);
mongoClient((): void => {
  app.listen(3000);
});

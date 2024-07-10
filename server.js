import express from 'express';

const app = express();
import dotenv from 'dotenv';
dotenv.config();
import 'express-async-errors';
import morgan from 'morgan';

import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
// hello
// db and authenticateUser
import connectDB from './db/connect.js';

// routers
import authRouter from './routes/authRoutes.js';
import schoolRouter from './routes/schoolRoutes.js';
import locationRouter from './routes/locationRoutes.js';
import studentResponseRouter from './routes/studentResponseRoutes.js';
import formRouter from './routes/formRoutes.js';
import exportRouter from './routes/exportRoutes.js';
import userRouter from './routes/userRoutes.js';


// middleware
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';
import authenticateUser from './middleware/auth.js';

import i18next from 'i18next';
import middleware from 'i18next-http-middleware';
import * as fs from "fs";

i18next.init({
  preload: ['en', 'fr', 'es', 'zh'],
})


if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

const __dirname = dirname(fileURLToPath(import.meta.url));

// only when ready to deploy
app.use(express.static(path.resolve(__dirname, './client/build')));

app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(cookieParser());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/schools', authenticateUser, schoolRouter);
app.use('/api/v1/locations', locationRouter);
app.use('/api/v1/studentResponses', authenticateUser, studentResponseRouter);
app.use('/api/v1/form', authenticateUser, formRouter);
app.use('/api/v1/export', authenticateUser, exportRouter);
app.use('/api/v1/user', authenticateUser, userRouter);

app.use(
  middleware.handle(i18next, {
    removeLngFromUrl: false // removes the language from the url when language detected in path
  })
)

// missing keys make sure the body is parsed (i.e. with [body-parser](https://github.com/expressjs/body-parser#bodyparserjsonoptions))
app.post('/locales/add/:lng/:ns', (req, res) => {
  try {
    const filePath = `./client/public/locales/${req.params.lng}/${req.params.ns}.json`;

    const data = fs.readFileSync(filePath);
    const jsonData = JSON.parse(data);
    fs.writeFileSync(filePath, JSON.stringify({...jsonData, ...req.body}));

    res.send('ok');
  } catch (error) {
  }
});

app.get('/locales/resources.json', middleware.getResourcesHandler(i18next))

// serve translations:
app.use('/locales', express.static('locales'))

// or instead of static
app.get('/locales/:lng/:ns', middleware.getResourcesHandler(i18next))

app.get('/locales/:lng/:ns', middleware.getResourcesHandler(i18next, {
  maxAge: 60 * 60 * 24 * 30, // adds appropriate cache header if cache option is passed or NODE_ENV === 'production', defaults to 30 days
  cache: true // defaults to false
}))

// only when ready to deploy
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 4000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();

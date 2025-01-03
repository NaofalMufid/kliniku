import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rid from 'connect-rid';
import compression from 'compression';
import errorHandler from 'errorhandler';
import responseTime from 'response-time';
import routeApi from './src/routes/index.js';

const app = express();

app.use(rid());
app.use(cors('*'));
app.use(helmet());
app.use(compression());
app.use(responseTime());
app.use(errorHandler());
app.use(express.json());
app.use(morgan('combined'));
app.use(express.urlencoded({ extended: true }));
app.use("/api", routeApi);

export default app;
import express from 'express';
import { registerControllers } from './server';
import { Logger } from './lib/logging/logger';
import {logRequest} from "./MiddleWare";
import {
  AuthController,
  CustomerController,
  HelloController,
  HoodieController
} from './controllers';
import {OrderController} from "./controllers/OrderController";
import {AuthMiddleware} from "./MiddleWare/AuthMiddleware";
const port = 8888;
const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', `*`);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(logRequest);

app.use(AuthMiddleware);


registerControllers(app, [
  HelloController,
  HoodieController,
  OrderController,
  CustomerController,
  AuthController
]);
app.listen(port, () => {
  Logger.info(`Server is running on http://localhost:${port}`);
});

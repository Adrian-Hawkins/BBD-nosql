import express from 'express';
import { registerControllers } from './server';
import { Logger } from './lib/logging/logger';
import {logRequest} from "./MiddleWare";
import {
  HelloController
} from './controllers';
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

app.use((req, res, next) => {
    req.headers.something = "s;gjdg";
    next()
});

app.get('/', (req, res) => {
    res.status(200).send({
        message: 'Hello, World!'
    });
})

registerControllers(app, [
  HelloController
]);
app.listen(port, () => {
  Logger.info(`Server is running on http://localhost:${port}`);
});

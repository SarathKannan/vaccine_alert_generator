import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import {errorHandler as queryErrorHandler} from 'querymen'


export default (routes) => {
  const app = express();

  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(routes);
  app.use(queryErrorHandler())

  return app;
};

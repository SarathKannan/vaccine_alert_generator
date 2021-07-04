import http from "http";

import mongoose from "./services/mongoose";
import express from "./services/express";
import { host, port } from "./config";

import api from "./api";
import { logger, timer } from "./services/@others";

const app = express(api);
const server = http.createServer(app);
const mongo = mongoose;
const sheduler = timer()

setImmediate(() => {
  server.listen(port, host, () => {
    logger([`express server listening on http://${host}:${port}`]);
  });
});
export default app;

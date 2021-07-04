import { logger } from "../@others";

export const success = (res, status) => (entity) => {
  if (entity) {
    res.status(status || 200).json(entity);
  }
  return entity;
};

export const notFound = (res) => (entity) => {
  if (entity) {
    return entity;
  }
  res.status(404).json({ status: 404 }).end();
  return null;
};

export const errors = (res) => (entity) => {
  logger([{entity}, {res}])
  res.status(400).json({ status: 400, error : true }).end();
  return null;
};

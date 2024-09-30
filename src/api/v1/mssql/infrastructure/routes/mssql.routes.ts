import { Router } from "express";

export const routesMssql = Router();

routesMssql.post("/", (_, res) => {
  res.send("routesMssql");
});

// Routes API/v1
import { Router } from "express";
import { Mssql } from "@api/v1.routes";

const routes = Router();
routes.get("/", (_, res) => {
  res
    .status(200)
    .send(`Welcome to MDocs API in version ${process.env.npm_package_version}`);
});

routes.use("/mssql", Mssql);

routes.use((_, res) => {
  res.status(404).send({
    error: "Not Found",
    message: "The requested resource was not found on this server.",
  });
});

export default routes;

import { Router } from "express";
import { mssqlController } from "@api/mssql/infrastructure/services/mssql.services";

export const routesMssql = Router();

routesMssql.get("/", mssqlController.createDictionaryCtrl);

import { MssqlController } from "@api/mssql/infrastructure/controllers/mssql.controller";
import { MssqlUseCase } from "@api/mssql/application/mssql.usecase";
import { MssqlRepository } from "@api/mssql/infrastructure/repositories/mssql.repository";

export const mssqlRepository = new MssqlRepository();
export const mssqlUseCase = new MssqlUseCase(mssqlRepository);
export const mssqlController = new MssqlController(mssqlUseCase);

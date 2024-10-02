import { Request, Response } from "express";
import { MssqlUseCase } from "@api/mssql/application/mssql.usecase";
import { verifyToken, SecretKey, SecretKeyMsSql } from "@app/utils/jwt";
import {
  EHttpStatusCode,
  EHttpStatusMessage,
} from "@app/utils/constants/Enums";
import { IMssqlBodyData } from "@app/utils/constants/Interfaces";

export class MssqlController {
  constructor(private readonly useCase: MssqlUseCase) {}

  public createDictionaryCtrl = async (
    { method, headers }: Request,
    res: Response
  ): Promise<any> => {
    try {
      const { authorization } = headers;
      const data = authorization?.split(" ")[1];

      if (!data) {
        return res.status(EHttpStatusCode.UNAUTHORIZED).json({
          message: EHttpStatusMessage.UNAUTHORIZED,
          code: EHttpStatusCode.UNAUTHORIZED,
          method,
        });
      }

      const dataDb: IMssqlBodyData = verifyToken(
        data,
        String(SecretKey),
        String(SecretKeyMsSql)
      );

      if (!dataDb.valid) {
        return res.status(EHttpStatusCode.UNAUTHORIZED).json({
          message: EHttpStatusMessage.UNAUTHORIZED,
          code: EHttpStatusCode.UNAUTHORIZED,
          method,
        });
      }

      const result = await this.useCase.createDictionary(dataDb);

      if (!result) {
        return res.status(EHttpStatusCode.BAD_REQUEST).json({
          result,
          message: EHttpStatusMessage.BAD_REQUEST,
          code: EHttpStatusCode.BAD_REQUEST,
          method,
          log: {
            idUser: dataDb.decoded.idUser,
            aud: dataDb.decoded.aud,
          },
        });
      }

      return res.status(EHttpStatusCode.CREATED).json({
        result,
        message: EHttpStatusMessage.CREATED,
        code: EHttpStatusCode.CREATED,
        method,
        log: {
          idUser: dataDb.decoded.idUser,
          aud: dataDb.decoded.aud,
        },
      });
    } catch (error: any) {
      return res.status(EHttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: EHttpStatusMessage.INTERNAL_SERVER_ERROR,
        error: error.stack,
      });
    }
  };
}

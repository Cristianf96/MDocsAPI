import { IMssqlBodyData } from "@app/utils/constants/Interfaces";

export interface IMssqlRepository {
  createDictionary(data: IMssqlBodyData): Promise<any>;
}

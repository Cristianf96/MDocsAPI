import { MssqlRepository } from "@api/mssql/infrastructure/repositories/mssql.repository";
import { IMssqlBodyData } from "@app/utils/constants/Interfaces";

export class MssqlUseCase {
  constructor(private readonly repository: MssqlRepository) {}

  async createDictionary(data: IMssqlBodyData): Promise<any> {
    try {
      const result = await this.repository.createDictionary(data);
      return result;
    } catch (error) {
      throw new Error("Internal server error");
    }
  }
}

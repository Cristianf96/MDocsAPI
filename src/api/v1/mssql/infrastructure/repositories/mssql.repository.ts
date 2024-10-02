import { IMssqlRepository } from "@api/mssql/domain/mssql.entity";
import { IMssqlBodyData } from "@app/utils/constants/Interfaces";
import { Sequelize, QueryTypes } from "sequelize";

export class MssqlRepository implements IMssqlRepository {
  async createDictionary(data: IMssqlBodyData): Promise<any> {
    try {
      let result: any = [];
      const sequelize = new Sequelize(
        data.decoded.data.connection.database,
        data.decoded.data.connection.user,
        data.decoded.data.connection.password,
        {
          host: data.decoded.data.connection.host,
          dialect: "mssql",
          dialectOptions: {
            options: {
              encrypt: true,
            },
          },
          define: {
            schema: "public",
            timestamps: false,
          },
          logging: false,
        }
      );

      sequelize
        .authenticate()
        .then(() => {
          console.log("Connection has been established successfully.");
        })
        .catch((err) => {
          console.error("Unable to connect to the database:", err);
        });

      const getTables: { table_name: string; table_description: string }[] =
        await sequelize.query(
          `
          SELECT 
            t.name AS table_name, 
            p.value AS table_description
          FROM 
            sys.tables AS t
          LEFT JOIN 
            sys.extended_properties AS p ON t.object_id = p.major_id AND p.name = 'MS_Description'
          WHERE 
            p.class = 1 AND -- Class 1 indicates table
            p.minor_id = 0; -- Minor_id = 0 for the table description
        `,
          { type: QueryTypes.SELECT }
        );

      const getColumns: {
        table_name: string;
        column_name: string;
        column_description: string;
      }[] = await sequelize.query(
        `
            SELECT 
                t.name AS table_name,
                c.name AS column_name,
                p.value AS column_description
            FROM 
                sys.tables AS t
            INNER JOIN 
                sys.columns AS c ON t.object_id = c.object_id
            LEFT JOIN 
                sys.extended_properties AS p ON t.object_id = p.major_id AND c.column_id = p.minor_id
            WHERE 
                p.class = 1 AND -- Class 1 indicates table
                p.minor_id > 0; -- Minor_id > 0 for the column description
            `,
        { type: QueryTypes.SELECT }
      );

      for (const element of getTables) {
        const nameTable = element.table_name;
        const descriptionTable = element.table_description;
        const [descriptionEs, descriptionEn] = descriptionTable.split("\r\n");
        const columns = getColumns.filter(
          (column) => column.table_name === nameTable
        );
        const columnsWithDescriptions = columns.map((column) => {
          const [descriptionEs, descriptionEn] =
            column.column_description.split("\r\n");
          return {
            column_name: column.column_name,
            descriptionsColumn: {
              es: descriptionEs,
              en: descriptionEn,
            },
          };
        });
        result.push({
          nameTable,
          descriptionsTable: {
            es: descriptionEs,
            en: descriptionEn,
          },
          columns: columnsWithDescriptions,
        });
      }

      result.sort((a: { nameTable: string }, b: { nameTable: any }) =>
        a.nameTable.localeCompare(b.nameTable)
      );

      if (result.length === 0) {
        return {
          error:
            "No tables were found in the database and/or they do not have a description",
        };
      }

      return result;
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  }
}

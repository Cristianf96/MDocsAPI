export const CCorsAudApiArray: string[] = [
  process.env.DBGECRISIS_CORS_AUD_API ?? "",
  process.env.CLOUD4LAC_CORS_AUD_API ?? "",
];

export const CQueryGetTablesMSSQL: string = `
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
        `;

export const CQueryGetColumnsMSSQL: string = `
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
            `;

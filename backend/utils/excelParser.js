import xlsx from 'xlsx';
import fs from 'fs';

/**
 * @desc    Parses the uploaded Joker Excel file
 * @param   {string} filePath - The temporary path of the uploaded file
 * @returns {Promise<Array>} A promise that resolves to an array of row objects
 */
export const parseJokerExcel = (filePath) => {
  return new Promise((resolve, reject) => {
    try {
      // 1. Read the file from the path
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // 2. Define the schema for the Excel file
      // This ensures your data is clean.
      const schema = [
        { header: 'TeamName', prop: 'teamName', type: String, required: true },
        { header: 'BoysJokerSport', prop: 'boysJokerSport', type: String },
        { header: 'GirlsJokerSport', prop: 'girlsJokerSport', type: String }
      ];

      // 3. Convert sheet to JSON based on our schema
      const rows = xlsx.utils.sheet_to_json(sheet, {
        header: schema.map(s => s.header) // Use headers from schema
      });

      // 4. Skip the header row (which is now the first object) and validate
      const jsonData = rows.slice(1).map((row) => {
        const validatedRow = {};
        for (const col of schema) {
          if (col.required && !row[col.header]) {
            throw new Error(`Missing required column: ${col.header}`);
          }
          validatedRow[col.prop] = row[col.header];
        }
        return validatedRow;
      });

      // 5. Delete the temporary file from the /uploads folder
      fs.unlinkSync(filePath);

      // 6. Return the clean JSON data
      resolve(jsonData);

    } catch (error) {
      // 7. Delete the file on error too
      fs.unlinkSync(filePath);
      reject(error);
    }
  });
};

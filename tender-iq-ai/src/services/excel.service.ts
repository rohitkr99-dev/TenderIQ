import * as XLSX from 'xlsx';

export class ExcelService {
  static async extractData(filePath: string): Promise<any[]> {
    try {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      return data;
    } catch (error) {
      console.error('Error parsing Excel:', error);
      throw new Error('Failed to extract data from Excel');
    }
  }

  static async extractDataFromBuffer(buffer: Buffer): Promise<any[]> {
    try {
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      return data;
    } catch (error) {
      console.error('Error parsing Excel buffer:', error);
      throw new Error('Failed to extract data from Excel buffer');
    }
  }
}

import { PDFParse } from 'pdf-parse';
import fs from 'fs';

export class PDFService {
  static async extractText(filePath: string): Promise<string> {
    const dataBuffer = fs.readFileSync(filePath);
    return this.extractTextFromBuffer(dataBuffer);
  }

  static async extractTextFromBuffer(buffer: Buffer): Promise<string> {
    try {
      const parser = new PDFParse({ data: buffer });
      const textResult = await parser.getText();
      return textResult.text;
    } catch (error) {
      console.error('Error parsing PDF buffer:', error);
      throw new Error('Failed to extract text from PDF buffer');
    }
  }
}

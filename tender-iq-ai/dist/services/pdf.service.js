"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDFService = void 0;
const pdf_parse_1 = require("pdf-parse");
const fs_1 = __importDefault(require("fs"));
class PDFService {
    static extractText(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataBuffer = fs_1.default.readFileSync(filePath);
            return this.extractTextFromBuffer(dataBuffer);
        });
    }
    static extractTextFromBuffer(buffer) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const parser = new pdf_parse_1.PDFParse({ data: buffer });
                const textResult = yield parser.getText();
                return textResult.text;
            }
            catch (error) {
                console.error('Error parsing PDF buffer:', error);
                throw new Error('Failed to extract text from PDF buffer');
            }
        });
    }
}
exports.PDFService = PDFService;

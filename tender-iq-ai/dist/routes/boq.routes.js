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
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const excel_service_1 = require("../services/excel.service");
const ai_service_1 = require("../services/ai.service");
const pdf_service_1 = require("../services/pdf.service");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
router.post('/analyze', upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        let data = [];
        if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || req.file.mimetype === 'application/vnd.ms-excel') {
            data = yield excel_service_1.ExcelService.extractDataFromBuffer(req.file.buffer);
        }
        else if (req.file.mimetype === 'application/pdf') {
            const text = yield pdf_service_1.PDFService.extractTextFromBuffer(req.file.buffer);
            data = yield ai_service_1.AIService.extractBOQFromText(text);
        }
        else {
            return res.status(400).json({ error: 'Unsupported file type' });
        }
        const analysis = yield ai_service_1.AIService.analyzeBOQ(data);
        res.json({
            extractedData: data,
            analysis: analysis
        });
    }
    catch (error) {
        console.error('BOQ Analysis Route Error:', error);
        res.status(500).json({ error: error.message });
    }
}));
exports.default = router;

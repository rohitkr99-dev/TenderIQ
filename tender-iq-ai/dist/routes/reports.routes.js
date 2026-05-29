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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ai_service_1 = require("../services/ai.service");
const router = (0, express_1.Router)();
router.post('/proposal', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type, tenderData, boqData } = req.body;
        const result = yield ai_service_1.AIService.generateProposalDraft(type, tenderData, boqData);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
router.post('/risk-analysis', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tenderData } = req.body;
        const result = yield ai_service_1.AIService.generateRiskAnalysis(tenderData);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
exports.default = router;

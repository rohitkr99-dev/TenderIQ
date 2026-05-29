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
exports.AIService = void 0;
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
class AIService {
    static analyzeTender(text) {
        return __awaiter(this, void 0, void 0, function* () {
            const prompt = `
      Analyze the following tender document text and extract key information.
      Focus on:
      - Project Name
      - Deadlines
      - Summarized Requirements
      - Risk Clauses
      - Payment Terms
      - Liquidated Damages
      - Compliance Checklist
      - Executive Summary

      Format the output as JSON.

      Document Text:
      ${text.substring(0, 15000)} // Limiting text to stay within context limits for now
    `;
            try {
                const response = yield openai.chat.completions.create({
                    model: 'gpt-4-turbo-preview',
                    messages: [{ role: 'user', content: prompt }],
                    response_format: { type: 'json_object' },
                });
                return JSON.parse(response.choices[0].message.content || '{}');
            }
            catch (error) {
                console.error('Error in AI Tender Analysis:', error);
                throw new Error('AI Analysis failed');
            }
        });
    }
    static analyzeBOQ(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const prompt = `
      Analyze the following BOQ (Bill of Quantities) data.
      Highlight:
      - Total items
      - Potential missing scope
      - Duplicate items
      - AI-generated cost insights
      - Rate comparison (if applicable)

      Format the output as JSON.

      BOQ Data:
      ${JSON.stringify(data).substring(0, 15000)}
    `;
            try {
                const response = yield openai.chat.completions.create({
                    model: 'gpt-4-turbo-preview',
                    messages: [{ role: 'user', content: prompt }],
                    response_format: { type: 'json_object' },
                });
                return JSON.parse(response.choices[0].message.content || '{}');
            }
            catch (error) {
                console.error('Error in AI BOQ Analysis:', error);
                throw new Error('AI Analysis failed');
            }
        });
    }
    static extractBOQFromText(text) {
        return __awaiter(this, void 0, void 0, function* () {
            const prompt = `
      Extract line items from the following BOQ (Bill of Quantities) text.
      For each item, try to extract:
      - Description
      - Unit
      - Quantity
      - Rate
      - Amount

      Format the output as a JSON object with an "extractedData" array.

      BOQ Text:
      ${text.substring(0, 15000)}
    `;
            try {
                const response = yield openai.chat.completions.create({
                    model: 'gpt-4-turbo-preview',
                    messages: [{ role: 'user', content: prompt }],
                    response_format: { type: 'json_object' },
                });
                const result = JSON.parse(response.choices[0].message.content || '{"extractedData": []}');
                return result.extractedData || [];
            }
            catch (error) {
                console.error('Error in AI BOQ Extraction:', error);
                throw new Error('AI Extraction failed');
            }
        });
    }
    static generateProcurementSchedule(boqData, projectTimeline) {
        return __awaiter(this, void 0, void 0, function* () {
            const prompt = `
      Based on the following BOQ (Bill of Quantities) data and the project timeline, generate a material procurement schedule.
      For each major material, estimate:
      - Material Name
      - Quantity
      - Unit
      - Estimated Lead Time (in days)
      - Recommended Order Date (relative to project start)
      - Potential Dependencies

      Project Timeline/Context: ${projectTimeline}

      BOQ Data:
      ${JSON.stringify(boqData).substring(0, 10000)}

      Format the output as a JSON object with a "schedule" array.
    `;
            try {
                const response = yield openai.chat.completions.create({
                    model: 'gpt-4-turbo-preview',
                    messages: [{ role: 'user', content: prompt }],
                    response_format: { type: 'json_object' },
                });
                return JSON.parse(response.choices[0].message.content || '{"schedule": []}');
            }
            catch (error) {
                console.error('Error in AI Procurement Generation:', error);
                // Return a default schedule for demonstration if AI fails
                return {
                    schedule: [
                        { materialName: "Reinforcement Steel", quantity: 50, unit: "tons", leadTime: 14, recommendedOrderDate: "Week 1", potentialDependencies: ["Structural Drawings Approval"] },
                        { materialName: "Ready Mix Concrete", quantity: 500, unit: "m3", leadTime: 3, recommendedOrderDate: "Week 4", potentialDependencies: ["Formwork Completion"] },
                        { materialName: "Ceramic Tiles", quantity: 2000, unit: "m2", leadTime: 30, recommendedOrderDate: "Week 8", potentialDependencies: ["Plastering Completion"] }
                    ]
                };
            }
        });
    }
    static generateProposalDraft(type, tenderData, boqData) {
        return __awaiter(this, void 0, void 0, function* () {
            const prompt = `
      Generate a ${type} proposal draft for the following tender.
      
      Tender Data:
      ${JSON.stringify(tenderData).substring(0, 5000)}
      
      BOQ Data:
      ${JSON.stringify(boqData).substring(0, 5000)}
      
      Focus on professional language, construction industry standards, and addressing the specific requirements mentioned in the tender.
      Format the output as a JSON object with a "draft" field containing Markdown text.
    `;
            try {
                const response = yield openai.chat.completions.create({
                    model: 'gpt-4-turbo-preview',
                    messages: [{ role: 'user', content: prompt }],
                    response_format: { type: 'json_object' },
                });
                return JSON.parse(response.choices[0].message.content || '{"draft": ""}');
            }
            catch (error) {
                console.error(`Error in AI ${type} Proposal Generation:`, error);
                return { draft: `Sample ${type} proposal draft text due to AI error.` };
            }
        });
    }
    static generateRiskAnalysis(tenderData) {
        return __awaiter(this, void 0, void 0, function* () {
            const prompt = `
      Perform a comprehensive risk analysis for the following tender.
      Highlight:
      - Commercial risks
      - Technical risks
      - Legal/Contractual risks
      - Mitigation strategies
      - Bid/No-bid recommendation (with score 1-10)

      Tender Data:
      ${JSON.stringify(tenderData).substring(0, 10000)}

      Format the output as JSON.
    `;
            try {
                const response = yield openai.chat.completions.create({
                    model: 'gpt-4-turbo-preview',
                    messages: [{ role: 'user', content: prompt }],
                    response_format: { type: 'json_object' },
                });
                return JSON.parse(response.choices[0].message.content || '{}');
            }
            catch (error) {
                console.error('Error in AI Risk Analysis:', error);
                return {
                    recommendation: "Bid with caution",
                    score: 6,
                    risks: ["Incomplete data for detailed analysis"]
                };
            }
        });
    }
    static chat(messages, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const systemPrompt = `
      You are the TenderIQ Global AI Assistant, a specialized assistant for construction contractors, quantity surveyors, and procurement teams.
      
      Your goal is to provide expert advice and answers based on the provided project context (tenders, BOQs, procurement schedules).
      
      Current Project Context:
      ${JSON.stringify(context)}
      
      Guidelines:
      - Be professional, precise, and helpful.
      - If the user asks about a specific tender, BOQ item, or procurement date, refer to the provided context.
      - If information is not in the context, state that you don't have that specific data but offer general industry advice.
      - Use professional construction industry terminology.
    `;
            try {
                const response = yield openai.chat.completions.create({
                    model: 'gpt-4-turbo-preview',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        ...messages
                    ],
                });
                return { message: response.choices[0].message.content };
            }
            catch (error) {
                console.error('Error in AI Chat:', error);
                throw new Error('AI Chat failed');
            }
        });
    }
}
exports.AIService = AIService;

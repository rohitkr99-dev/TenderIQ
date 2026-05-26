"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const tender_routes_1 = __importDefault(require("./routes/tender.routes"));
const boq_routes_1 = __importDefault(require("./routes/boq.routes"));
const procurement_routes_1 = __importDefault(require("./routes/procurement.routes"));
const reports_routes_1 = __importDefault(require("./routes/reports.routes"));
const chat_routes_1 = __importDefault(require("./routes/chat.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 3001;
app.use(express_1.default.json());
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
app.use('/api/tender', tender_routes_1.default);
app.use('/api/boq', boq_routes_1.default);
app.use('/api/procurement', procurement_routes_1.default);
app.use('/api/reports', reports_routes_1.default);
app.use('/api/chat', chat_routes_1.default);
app.listen(port, '0.0.0.0', () => {
    console.log(`AI Service listening on http://0.0.0.0:${port}`);
});

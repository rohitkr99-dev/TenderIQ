# TenderIQ AI Service

This service handles document processing and AI-driven analysis for the TenderIQ platform.

## Features
- **PDF Parsing**: Extracts text from PDF tender documents.
- **Excel Parsing**: Extracts data from Excel BOQ files.
- **AI Analysis**: Uses OpenAI (GPT-4) to analyze tender documents and BOQs.
- **REST API**: Provides endpoints for document analysis.

## Project Structure
- `src/services/pdf.service.ts`: PDF text extraction.
- `src/services/excel.service.ts`: Excel data extraction.
- `src/services/ai.service.ts`: OpenAI integration for analysis.
- `src/routes/`: Express routes for API endpoints.
- `src/index.ts`: Entry point for the service.

## API Endpoints
- `POST /api/tender/analyze`: Upload a PDF tender for analysis.
- `POST /api/boq/analyze`: Upload an Excel BOQ for analysis.
- `GET /health`: Health check.

## Setup
1. Copy `.env.example` to `.env` and add your `OPENAI_API_KEY`.
2. Run `npm install`.
3. Run `npm start` to start the service in development mode.
4. Run `npm run build` to compile TypeScript to JavaScript.

## Port
The service runs on port `3001` by default.

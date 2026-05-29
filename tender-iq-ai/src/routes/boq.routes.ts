import { Router } from 'express';
import multer from 'multer';
import { ExcelService } from '../services/excel.service';
import { AIService } from '../services/ai.service';
import { PDFService } from '../services/pdf.service';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/analyze', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let data: any[] = [];
    if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || req.file.mimetype === 'application/vnd.ms-excel') {
      data = await ExcelService.extractDataFromBuffer(req.file.buffer);
    } else if (req.file.mimetype === 'application/pdf') {
      const text = await PDFService.extractTextFromBuffer(req.file.buffer);
      data = await AIService.extractBOQFromText(text);
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    const analysis = await AIService.analyzeBOQ(data);
    res.json({
      extractedData: data,
      analysis: analysis
    });
  } catch (error: any) {
    console.error('BOQ Analysis Route Error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

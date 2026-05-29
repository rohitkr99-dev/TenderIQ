import { Router } from 'express';
import multer from 'multer';
import { PDFService } from '../services/pdf.service';
import { AIService } from '../services/ai.service';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/analyze', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let text = '';
    if (req.file.mimetype === 'application/pdf') {
      text = await PDFService.extractTextFromBuffer(req.file.buffer);
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    const analysis = await AIService.analyzeTender(text);
    res.json(analysis);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

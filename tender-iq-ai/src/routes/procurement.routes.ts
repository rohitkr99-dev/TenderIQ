import { Router } from 'express';
import { AIService } from '../services/ai.service';

const router = Router();

router.post('/generate', async (req, res) => {
  try {
    const { boqData, projectTimeline } = req.body;

    if (!boqData || !Array.isArray(boqData)) {
      return res.status(400).json({ error: 'Invalid BOQ data' });
    }

    const schedule = await AIService.generateProcurementSchedule(boqData, projectTimeline || 'Standard construction project');
    res.json(schedule);
  } catch (error: any) {
    console.error('Procurement Generation Route Error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

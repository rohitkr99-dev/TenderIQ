import { Router } from 'express';
import { AIService } from '../services/ai.service';

const router = Router();

router.post('/proposal', async (req, res) => {
  try {
    const { type, tenderData, boqData } = req.body;
    const result = await AIService.generateProposalDraft(type, tenderData, boqData);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/risk-analysis', async (req, res) => {
  try {
    const { tenderData } = req.body;
    const result = await AIService.generateRiskAnalysis(tenderData);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

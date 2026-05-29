import { Router } from 'express';
import { AIService } from '../services/ai.service';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { messages, context } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages' });
    }

    const result = await AIService.chat(messages, context || {});
    res.json(result);
  } catch (error: any) {
    console.error('Chat Route Error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

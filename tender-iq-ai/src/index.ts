import express from 'express';
import dotenv from 'dotenv';
import tenderRoutes from './routes/tender.routes';
import boqRoutes from './routes/boq.routes';
import procurementRoutes from './routes/procurement.routes';
import reportRoutes from './routes/reports.routes';
import chatRoutes from './routes/chat.routes';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3001;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/tender', tenderRoutes);
app.use('/api/boq', boqRoutes);
app.use('/api/procurement', procurementRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/chat', chatRoutes);

app.listen(port, '0.0.0.0', () => {
  console.log(`AI Service listening on http://0.0.0.0:${port}`);
});

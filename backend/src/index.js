require('dotenv').config();
const express = require('express');
const cors = require('cors');

const campaignRoutes = require('./routes/campaigns');
const metricRoutes = require('./routes/metrics');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/campaigns', campaignRoutes);
app.use('/api/metrics', metricRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

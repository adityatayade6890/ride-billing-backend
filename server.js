const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

const rideRoutes = require('./routes/rides');
app.use('/api/rides', rideRoutes);

app.get('/', (_, res) => res.send('✅ Ride Billing API Ready'));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

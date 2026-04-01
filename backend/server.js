const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()
const PORT = process.env.PORT;
const app = express()
const startTime = Date.now();

console.log(process.env.MONGO_URI);

app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB successfully connected')).catch(err => console.error('MongoDB connection error: \n', err));
app.use('/api/auth', require('./routes/auth'));




app.get('/health', async (req, res) => {
  try {

    const dbState = mongoose.connection.readyState;
    let dbStatus = "disconnected";
    if (dbState === 1) dbStatus = "connected";
    else if (dbState === 2) dbStatus = "connecting";
    const uptimeMs = Date.now() - startTime;
    const uptimeSec = Math.floor(uptimeMs / 1000);
    
    res.status(200).json({
      status: "ok",
      database: dbStatus,
      uptime: `${uptimeSec} seconds`,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message
    });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
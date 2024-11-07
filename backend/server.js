const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./database'); 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const foodRoutes = require('./routes/foodRoutes');

// Määrittele reitit
app.use('/api', foodRoutes);

// Perusreitti
app.get('/', (req, res) => {
    res.send('Backend is running');
});

// Yhteyden testireitti
app.get('/test-db', async (req, res) => {
  try {

    const result = await pool.query('SELECT NOW()');
    console.log('Database connected:', result.rows); 
    res.json({
      message: 'Connected to database successfully!',
      time: result.rows[0] 
    });
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(500).json({ message: 'Failed to connect to database', error: err.message });
  }
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
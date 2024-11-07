const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./database'); // Tuo PostgreSQL-yhteys, oletetaan, että pool.js on oikeassa paikassa

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
    // Tehdään yksinkertainen SELECT-kysely
    const result = await pool.query('SELECT NOW()');
    console.log('Database connected:', result.rows);  // Log the result to console for debugging
    res.json({
      message: 'Connected to database successfully!',
      time: result.rows[0] // Tässä `NOW()` palauttaa PostgreSQL:n aikaleiman
    });
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(500).json({ message: 'Failed to connect to database', error: err.message });
  }
});

// Esimerkki reitti, joka hakee dataa "meals" taulusta
app.get('/meals', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM meals'); // Oletetaan, että sinulla on "meals" taulu
    res.json(result.rows);  // Lähetetään takaisin haettu data
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).json({ message: 'Failed to fetch meals', error: err.message });
  }
});

// Käynnistä palvelin
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
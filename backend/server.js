// backend/server.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Create the Express app
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Root test route
app.get('/', (req, res) => {
  res.send('Musician’s Dashboard Backend is running.');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

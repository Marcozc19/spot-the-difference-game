require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');

const apiKey = process.env.API_KEY;
const secKey = process.env.SEC_KEY
// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/set1', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'set1.html'));
});
app.get('/api-key', (req, res) => {
  res.json({ apiKey, secKey });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const axios = require("axios");

const apiKey = process.env.API_KEY;
const secKey = process.env.SEC_KEY;
// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/set1", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "set1.html"));
});
app.get("/end", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "end.html"));
});
app.get("/api-key", (req, res) => {
  res.json({ apiKey, secKey });
});

app.get("/api/querypic", async (req, res) => {
  const set = req.query.set; // Set name should be passed as a query parameter
  try {
    const response = await axios.get(
      `https://api.echo3D.com/query?key=${apiKey}&secKey=${secKey}&filters=sdf,${set},pic`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data from echo3D API:", error);
    res.status(500).json({ error: "Failed to fetch data from echo3D API" });
  }
});

app.get("/api/queryasset", async (req, res) => {
  const set = req.query.set; // Set name should be passed as a query parameter
  try {
    const response = await axios.get(
      `https://api.echo3D.com/query?key=${apiKey}&secKey=${secKey}&filters=sdf,${set},asset`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data from echo3D API:", error);
    res.status(500).json({ error: "Failed to fetch data from echo3D API" });
  }
});

// New route to fetch data from the external API
app.get("/api/entrydata", async (req, res) => {
  const entryId = req.query.entry; // Entry ID should be passed as a query parameter
  if (!entryId) {
    return res.status(400).json({ error: "Entry ID is required" });
  }

  try {
    const response = await axios.get(
      `https://api.echo3D.com/query?key=${apiKey}&secKey=${secKey}&entry=${entryId}`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data from echo3D API:", error);
    res.status(500).json({ error: "Failed to fetch data from echo3D API" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve static files from the public directory
app.use(express.static('public'));

// GET endpoint to read the underwriting model data
app.get('/api/underwriting-models', async (req, res) => {
  try {
    const data = await fs.readFile(path.join(__dirname, 'public', 'data', 'UnderwritingModel.json'), 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).json({ error: 'Failed to read data' });
  }
});

// PUT endpoint to update the underwriting model data
app.put('/api/underwriting-models', async (req, res) => {
  try {
    const updatedData = req.body;
    await fs.writeFile(
      path.join(__dirname, 'public', 'data', 'UnderwritingModel.json'),
      JSON.stringify(updatedData, null, 2),
      'utf8'
    );
    res.json({ message: 'Data updated successfully' });
  } catch (error) {
    console.error('Error writing file:', error);
    res.status(500).json({ error: 'Failed to update data' });
  }
});

// GET endpoint to read the questions data
app.get('/api/questions', async (req, res) => {
  try {
    const data = await fs.readFile(path.join(__dirname, 'public', 'data', 'QuestionsLibrary.json'), 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).json({ error: 'Failed to read data' });
  }
});

// PUT endpoint to update the questions data
app.put('/api/questions', async (req, res) => {
  try {
    const updatedData = req.body;
    await fs.writeFile(
      path.join(__dirname, 'public', 'data', 'QuestionsLibrary.json'),
      JSON.stringify(updatedData, null, 2),
      'utf8'
    );
    res.json({ message: 'Data updated successfully' });
  } catch (error) {
    console.error('Error writing file:', error);
    res.status(500).json({ error: 'Failed to update data' });
  }
});

// Function to start server with port fallback
const startServer = (port) => {
  try {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} is busy, trying ${port + 1}...`);
        startServer(port + 1);
      } else {
        console.error('Server error:', err);
      }
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
};

// Start server with initial port
startServer(PORT); 
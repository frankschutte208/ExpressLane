const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3006;

// Enable CORS for all routes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, 'build')));

// Helper function to read JSON file
const readJsonFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    throw error;
  }
};

// Helper function to write JSON file
const writeJsonFile = async (filePath, data) => {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    throw error;
  }
};

// API endpoint to get questions
app.get('/api/questions', async (req, res) => {
  try {
    console.log('Received request for questions');
    const data = await fs.readFile(path.join(__dirname, 'public', 'data', 'QuestionsLibrary.json'), 'utf8');
    console.log('Questions data loaded successfully');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading questions:', error);
    res.status(500).json({ error: 'Failed to load questions' });
  }
});

// API endpoint to update questions
app.put('/api/questions', async (req, res) => {
  try {
    const data = JSON.stringify(req.body, null, 2);
    await fs.writeFile(path.join(__dirname, 'public', 'data', 'QuestionsLibrary.json'), data);
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving questions:', error);
    res.status(500).json({ error: 'Failed to save questions' });
  }
});

// GET endpoint for underwriting models
app.get('/api/underwriting-models', async (req, res) => {
  try {
    const data = await readJsonFile(path.join(__dirname, 'public/data/UnderwritingModel.json'));
    res.json(data);
  } catch (error) {
    console.error('Error in GET /api/underwriting-models:', error);
    res.status(500).json({ error: 'Failed to read underwriting models data' });
  }
});

// PUT endpoint for underwriting models
app.put('/api/underwriting-models', async (req, res) => {
  try {
    await writeJsonFile(path.join(__dirname, 'public/data/UnderwritingModel.json'), req.body);
    res.json({ message: 'Underwriting models updated successfully' });
  } catch (error) {
    console.error('Error in PUT /api/underwriting-models:', error);
    res.status(500).json({ error: 'Failed to update underwriting models data' });
  }
});

// Handle all other routes by serving the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API Base URL: ${process.env.REACT_APP_API_BASE_URL || 'Not set'}`);
}); 
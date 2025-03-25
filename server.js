const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3006;

app.use(cors());
app.use(express.json());

// Serve static files from the public directory
app.use(express.static('public'));

// Serve static files from the React build directory
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

// GET endpoint for questions
app.get('/api/questions', async (req, res) => {
  try {
    const data = await readJsonFile(path.join(__dirname, 'public/data/QuestionsLibrary.json'));
    res.json(data);
  } catch (error) {
    console.error('Error in GET /api/questions:', error);
    res.status(500).json({ error: 'Failed to read questions data' });
  }
});

// PUT endpoint for questions
app.put('/api/questions', async (req, res) => {
  try {
    await writeJsonFile(path.join(__dirname, 'public/data/QuestionsLibrary.json'), req.body);
    res.json({ message: 'Questions updated successfully' });
  } catch (error) {
    console.error('Error in PUT /api/questions:', error);
    res.status(500).json({ error: 'Failed to update questions data' });
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

// Add this before app.listen
// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 
const fs = require('fs');

// Read the CSV file
const csvData = fs.readFileSync('Grok Questions 2.csv', 'utf8');
const lines = csvData.split('\n').filter(line => line.trim()); // Remove empty lines
const headers = lines[0].split(',').map(h => h.trim());

const jsonData = lines.slice(1)
  .map(line => {
    // Split by comma but preserve commas within quotes
    const values = line.split(',').map(v => v.trim());
    const obj = {};
    
    // Only process if we have an ID
    const id = parseInt(values[0]);
    if (isNaN(id)) return null;

    obj.Id = id;
    obj.category = values[1] || '';
    obj.Question_Number = parseFloat(values[2]) || id;
    obj.Question_Text = values[3]?.replace(/\r/g, '') || '';
    obj.Answer_Format = values[4] || '';
    
    // Clean up Answer_Values
    if (values[5]) {
      obj.Answer_Values = values[5]
        .replace(/\r/g, '')  // Remove carriage returns
        .split(';')
        .map(v => v.trim())
        .filter(v => v);
    } else {
      obj.Answer_Values = [];
    }
    
    return obj;
  })
  .filter(row => row !== null); // Remove invalid rows

// Write the JSON file
fs.writeFileSync('public/data/QuestionsLibrary.json', JSON.stringify(jsonData, null, 2)); 
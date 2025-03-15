# Express Lane Underwriting

A web application for managing and simulating underwriting questions and rules.

## Features

- Table management for underwriting questions and rules
- Dynamic question presentation based on coverage amount
- Rule-based follow-up questions
- Modern, responsive UI with Material-UI components
- Search and filter functionality for tables

## Project Structure

```
/
├── src/
│   ├── components/
│   │   ├── TablesView.tsx      # Table management component
│   │   └── SimulatorView.tsx   # Question simulation component
│   ├── styles/
│   │   └── theme.ts            # Theme configuration
│   └── App.tsx                 # Main application component
├── data/
│   ├── QuestionsLibrary.json   # Questions database
│   └── UnderwritingModel.json  # Rules and models
└── package.json                # Project dependencies
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

## Data Structure

### Questions Library
Contains all possible underwriting questions with their types and validation rules.

Example:
```json
{
  "id": "Q1",
  "text": "What is your current age?",
  "type": "number",
  "validation": {
    "min": 18,
    "max": 99
  }
}
```

### Underwriting Model
Defines rules for which questions to ask based on coverage amount and previous answers.

Example:
```json
{
  "id": "R1",
  "coverageRange": {
    "min": 0,
    "max": 100000
  },
  "questions": ["Q1", "Q2"],
  "rules": [
    {
      "questionId": "Q2",
      "answer": "Yes",
      "followUpQuestions": ["Q3"]
    }
  ]
}
```

## Technologies Used

- React with TypeScript
- Material-UI for components
- JSON for data storage
- React Router for navigation 
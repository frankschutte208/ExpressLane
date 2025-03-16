import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  FormControlLabel,
  Radio,
  RadioGroup,
  Paper,
  Collapse,
  Select,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';

interface Question {
  Id: number;
  category: string;
  Question_Number: number;
  Question_Text: string;
  Answer_Format: string;
  Answer_Values: string[];
}

interface UnderwritingModelRow {
  Id: number;
  Tenant: string;
  Product: string;
  Minimum_Age: number;
  Maximum_Age: number;
  Minimum_Sum_Assured: number;
  Maximum_Sum_Assured: number;
  Questions_Included: number[];
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const QuestionContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: theme.spacing(2),
  '& .question-text': {
    flex: 1,
    marginRight: theme.spacing(2),
  },
  '& .answer-input': {
    minWidth: 200,
  },
  '& .radio-group': {
    marginTop: theme.spacing(1),
  },
}));

const SimulatorView: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch('/data/QuestionsLibrary.json');
        const data: Question[] = await response.json();
        setQuestions(data);
        
        // Extract unique categories with proper typing
        const uniqueCategories = Array.from(
          new Set(data.map(q => q.category))
        ) as string[];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error loading questions:', error);
      }
    };

    loadQuestions();
  }, []);

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const renderAnswerInput = (question: Question) => {
    switch (question.Answer_Format) {
      case 'Yes/No':
        return (
          <RadioGroup
            row
            value={answers[question.Id] || ''}
            onChange={(e) => handleAnswerChange(question.Id, e.target.value)}
            className="answer-input"
          >
            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="No" control={<Radio />} label="No" />
          </RadioGroup>
        );
      
      case 'Multiple Choice':
        return (
          <FormControl component="fieldset" className="answer-input">
            <RadioGroup
              value={answers[question.Id] || ''}
              onChange={(e) => handleAnswerChange(question.Id, e.target.value)}
              className="radio-group"
            >
              {question.Answer_Values.map((option) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );
      
      case 'Integer':
        return (
          <TextField
            type="number"
            value={answers[question.Id] || ''}
            onChange={(e) => handleAnswerChange(question.Id, e.target.value)}
            className="answer-input"
          />
        );
      
      case 'Open Ended':
        return (
          <TextField
            multiline
            rows={2}
            value={answers[question.Id] || ''}
            onChange={(e) => handleAnswerChange(question.Id, e.target.value)}
            className="answer-input"
          />
        );
      
      default:
        return null;
    }
  };

  const isMainQuestion = (questionNumber: number) => {
    return Number.isInteger(questionNumber);
  };

  const getSubQuestions = (mainQuestionNumber: number) => {
    return questions.filter(q => {
      const baseNumber = Math.floor(q.Question_Number);
      return baseNumber === mainQuestionNumber && !isMainQuestion(q.Question_Number);
    });
  };

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Health Questionnaire
      </Typography>

      {categories.map(category => (
        <StyledPaper key={category}>
          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
            {category}
          </Typography>

          {questions
            .filter(q => q.category === category && isMainQuestion(q.Question_Number))
            .sort((a, b) => a.Question_Number - b.Question_Number)
            .map(question => (
              <Box key={question.Id}>
                <QuestionContainer>
                  <Typography className="question-text">
                    {question.Question_Number}. {question.Question_Text}
                  </Typography>
                  {renderAnswerInput(question)}
                </QuestionContainer>

                <Collapse in={answers[question.Id] === 'Yes'}>
                  <Box sx={{ pl: 4 }}>
                    {getSubQuestions(question.Question_Number).map(subQuestion => (
                      <QuestionContainer key={subQuestion.Id}>
                        <Typography className="question-text">
                          {subQuestion.Question_Number}. {subQuestion.Question_Text}
                        </Typography>
                        {renderAnswerInput(subQuestion)}
                      </QuestionContainer>
                    ))}
                  </Box>
                </Collapse>
              </Box>
            ))}
        </StyledPaper>
      ))}
    </Box>
  );
};

export default SimulatorView; 
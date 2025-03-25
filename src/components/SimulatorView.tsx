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
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Divider,
  Button
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
  EMLoading: number;
  Decision: string;
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

const ModelCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  backgroundColor: '#f8f9fa',
  '& .MuiCardContent-root': {
    padding: theme.spacing(2),
  },
  '& .model-detail': {
    fontSize: '0.875rem',
    color: '#666',
    marginBottom: theme.spacing(0.5),
    marginLeft: theme.spacing(2)
  },
}));

const QuestionContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: theme.spacing(1),
  flexDirection: 'column',
  '& .question-text': {
    flex: 1,
    marginRight: theme.spacing(2),
    fontSize: '14px',
    width: '100%',
  },
  '& .answer-input': {
    minWidth: 200,
    '& .MuiFormControlLabel-label': {
      fontSize: '14px',
    }
  },
  '&.main-question': {
    flexDirection: 'row',
    '& .question-text': {
      width: '60%',
    }
  }
}));

const SimulatorView: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [underwritingModels, setUnderwritingModels] = useState<UnderwritingModelRow[]>([]);
  const [selectedModel, setSelectedModel] = useState<UnderwritingModelRow | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load questions
        const questionsResponse = await fetch('/data/QuestionsLibrary.json');
        const questionsData: Question[] = await questionsResponse.json();
        setQuestions(questionsData);
        
        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(questionsData.map(q => q.category))
        ) as string[];
        setCategories(uniqueCategories);

        // Load underwriting models
        const modelsResponse = await fetch('/data/UnderwritingModel.json');
        const modelsData: UnderwritingModelRow[] = await modelsResponse.json();
        setUnderwritingModels(modelsData);
        
        // Set model ID 2 as default
        const defaultModel = modelsData.find(m => m.Id === 2);
        if (defaultModel) {
          setSelectedModel(defaultModel);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleModelChange = (event: any) => {
    const selectedId = event.target.value;
    const model = underwritingModels.find(m => m.Id === selectedId);
    setSelectedModel(model || null);
    // Reset answers when model changes
    setAnswers({});
  };

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
          <RadioGroup
            value={answers[question.Id] || ''}
            onChange={(e) => handleAnswerChange(question.Id, e.target.value)}
            className="answer-input"
          >
            {question.Answer_Values.map((option) => (
              <FormControlLabel
                key={option}
                value={option}
                control={<Radio size="small" sx={{ padding: '2px' }} />}
                label={option}
                sx={{
                  margin: 0,
                  height: '22px'
                }}
              />
            ))}
          </RadioGroup>
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
            rows={1}
            value={answers[question.Id] || ''}
            onChange={(e) => handleAnswerChange(question.Id, e.target.value)}
            className="answer-input"
            size="small"
            sx={{
              width: '95%',
              '& .MuiInputBase-root': {
                fontSize: '14px',
                padding: 0,
                height: '24px'
              },
              '& .MuiInputBase-input': {
                padding: '2px 8px',
                height: '20px !important',
                overflowY: 'hidden'
              }
            }}
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

  const getFilteredQuestions = (category: string) => {
    return questions
      .filter(q => {
        // First filter by category
        const categoryMatch = q.category === category;
        
        // Then filter by Questions_Included if a model is selected
        const modelMatch = selectedModel 
          ? selectedModel.Questions_Included.includes(q.Question_Number)
          : true;
        
        return categoryMatch && modelMatch;
      })
      .filter(q => isMainQuestion(q.Question_Number))
      .sort((a, b) => a.Question_Number - b.Question_Number);
  };

  // Calculate underwriting EMLoadings by category
  const calculateUnderwritingEMLoadings = (questions: Question[], answers: Record<number, string>) => {
    const emLoadingsByCategory: Record<string, number> = {};
    let totalEMLoading = 0;

    questions.forEach((question) => {
      const answer = answers[question.Id];
      if (answer === 'Yes' || (answer && question.Answer_Format !== 'Yes/No')) {
        const category = question.category;
        emLoadingsByCategory[category] = (emLoadingsByCategory[category] || 0) + question.EMLoading;
        totalEMLoading += question.EMLoading;
      }
    });

    return { emLoadingsByCategory, totalEMLoading };
  };

  // Get decisions for questions answered "Yes" that have a non-empty Decision field
  const getDecisions = () => {
    const decisions: Array<{ questionText: string; decision: string }> = [];
    
    Object.entries(answers).forEach(([questionIdStr, answer]) => {
      const questionId = parseInt(questionIdStr);
      const question = questions.find(q => q.Id === questionId);
      
      if (question && 
          answer === 'Yes' && 
          question.Decision && 
          question.Decision.trim() !== '') {
        decisions.push({
          questionText: question.Question_Text,
          decision: question.Decision
        });
      }
    });
    
    return decisions;
  };

  // Add reset handler
  const handleReset = () => {
    setAnswers({});
  };

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">
              Health Questionnaire
            </Typography>
            <Button 
              variant="text" 
              color="primary" 
              onClick={handleReset}
            >
              Reset Questionnaire
            </Button>
          </Box>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Select Underwriting Model</InputLabel>
            <Select
              value={selectedModel?.Id || ''}
              onChange={handleModelChange}
              label="Select Underwriting Model"
            >
              {underwritingModels.map((model) => (
                <MenuItem key={model.Id} value={model.Id}>
                  {`${model.Id} - ${model.Tenant} - ${model.Product}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {categories.map(category => {
            const filteredQuestions = getFilteredQuestions(category);
            if (filteredQuestions.length === 0) return null;
            
            return (
              <StyledPaper key={category}>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                  {category}
                </Typography>

                {filteredQuestions.map(question => (
                  <Box key={question.Id}>
                    <QuestionContainer className="main-question">
                      <Typography className="question-text">
                        {question.Question_Number}. {question.Question_Text}
                      </Typography>
                      {renderAnswerInput(question)}
                    </QuestionContainer>

                    <Collapse in={answers[question.Id] === 'Yes'}>
                      <Box sx={{ 
                        pl: '12%', 
                        mt: 1, 
                        mb: 3,
                        backgroundColor: '#f5f5f5',
                        borderRadius: 1,
                        py: 1
                      }}>
                        {getSubQuestions(question.Question_Number).map(subQuestion => (
                          <QuestionContainer key={subQuestion.Id} sx={{ mb: 0.5 }}>
                            <Typography className="question-text">
                              {subQuestion.Question_Number}. {subQuestion.Question_Text}
                            </Typography>
                            <Box sx={{ pl: '45%' }}>
                              {renderAnswerInput(subQuestion)}
                            </Box>
                          </QuestionContainer>
                        ))}
                      </Box>
                    </Collapse>
                  </Box>
                ))}
              </StyledPaper>
            );
          })}
        </Grid>

        <Grid item xs={12} md={4}>
          {selectedModel && (
            <ModelCard>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Model Details
              </Typography>
              <Typography className="model-detail">
                <strong>ID:</strong> {selectedModel.Id}
              </Typography>
              <Typography className="model-detail">
                <strong>Tenant:</strong> {selectedModel.Tenant}
              </Typography>
              <Typography className="model-detail">
                <strong>Product:</strong> {selectedModel.Product}
              </Typography>
              <Typography className="model-detail">
                <strong>Age Range:</strong> {selectedModel.Minimum_Age} - {selectedModel.Maximum_Age} years
              </Typography>
              <Typography className="model-detail">
                <strong>Sum Assured Range:</strong> {selectedModel.Minimum_Sum_Assured.toLocaleString()} - {selectedModel.Maximum_Sum_Assured.toLocaleString()}
              </Typography>
              <Typography className="model-detail" sx={{ mt: 2 }}>
                <strong>Questions Included:</strong> {selectedModel.Questions_Included.join(', ')}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" sx={{ mb: 1 }}>
                Underwriting EMLoading
              </Typography>
              
              {(() => {
                const { emLoadingsByCategory, totalEMLoading } = calculateUnderwritingEMLoadings(questions, answers);
                return (
                  <>
                    {Object.entries(emLoadingsByCategory)
                      .filter(([category, loading]) => loading > 0)
                      .map(([category, loading]) => (
                        <Typography key={category} className="model-detail">
                          <strong>{category}:</strong> {loading}
                        </Typography>
                      ))}
                    
                    {totalEMLoading > 0 ? (
                      <Typography className="model-detail" sx={{ 
                        mt: 1, 
                        fontWeight: 'bold',
                        color: totalEMLoading > 10 ? 'error.main' : 'inherit'
                      }}>
                        <strong>Total EMLoading:</strong> {totalEMLoading}
                      </Typography>
                    ) : (
                      <Typography className="model-detail" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                        No EMLoadings accumulated yet
                      </Typography>
                    )}
                  </>
                );
              })()}
              
              {/* Add Decisions Section */}
              {(() => {
                const decisions = getDecisions();
                if (decisions.length > 0) {
                  return (
                    <>
                      <Divider sx={{ my: 2 }} />
                      
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        Underwriting Decisions
                      </Typography>
                      
                      {decisions.map((item, index) => (
                        <Box key={index} sx={{ mb: 1.5 }}>
                          <Typography className="model-detail" sx={{ fontSize: '0.8rem' }}>
                            {item.questionText}
                          </Typography>
                          <Typography className="model-detail" sx={{ 
                            color: 'primary.main', 
                            fontWeight: 'bold',
                            ml: 3
                          }}>
                            {item.decision}
                          </Typography>
                        </Box>
                      ))}
                    </>
                  );
                }
                return null;
              })()}
            </ModelCard>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default SimulatorView; 
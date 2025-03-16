import React, { useState, useEffect } from 'react';
import { 
  Box,
  TextField,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)({
  padding: '20px',
  backgroundColor: '#FFFFFF',
});

const ControlsContainer = styled(Box)({
  display: 'flex',
  gap: '20px',
  alignItems: 'center',
  marginBottom: '20px',
});

interface QuestionRow {
  Id: number;
  category: string;
  Question_Number: number;
  Question_Text: string;
  Answer_Format: string;
  Answer_Values: string[];
}

const API_BASE_URL = 'http://localhost:3001/api';

const QuestionsView: React.FC = () => {
  const [rows, setRows] = useState<QuestionRow[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const columns = [
    { field: 'Id', headerName: 'ID', width: 70, editable: false },
    { field: 'category', headerName: 'Category', width: 130, editable: true },
    { 
      field: 'Question_Number', 
      headerName: 'Question #', 
      width: 90, 
      editable: true,
      type: 'number'
    },
    { 
      field: 'Question_Text', 
      headerName: 'Question Text', 
      width: 600, 
      editable: true
    },
    { 
      field: 'Answer_Format', 
      headerName: 'Answer Format', 
      width: 120, 
      editable: true
    },
    { 
      field: 'Answer_Values', 
      headerName: 'Answer Values', 
      width: 400, 
      editable: true,
      valueGetter: (params: any) => {
        const values = params.row.Answer_Values;
        return Array.isArray(values) ? values.join(', ') : '';
      },
      valueSetter: (params: any) => {
        const value = params.value;
        const values = value.split(',').map((v: string) => v.trim()).filter((v: string) => v !== '');
        return { ...params.row, Answer_Values: values };
      }
    }
  ];

  const handleProcessRowUpdate = async (
    newRow: QuestionRow,
    oldRow: QuestionRow
  ): Promise<QuestionRow> => {
    try {
      // Get current data
      const response = await fetch(`${API_BASE_URL}/questions`);
      const data = await response.json();
      
      // Update the specific row
      const updatedData = data.map((row: QuestionRow) => 
        row.Id === newRow.Id ? newRow : row
      );

      // Save back to file through API
      const saveResponse = await fetch(`${API_BASE_URL}/questions`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData)
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to save changes');
      }

      // Update the local state
      setRows(updatedData);
      setSaveError(null);
      return newRow;
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to save changes');
      throw error;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/questions`);
        if (!response.ok) {
          throw new Error(`Failed to load data: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Data is not an array');
        }
        setRows(data);
      } catch (error) {
        console.error('Error loading data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load data');
        setRows([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredRows = searchTerm
    ? rows.filter(row => 
        Object.values(row).some(value => 
          value !== null && 
          value !== undefined && 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : rows;

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Questions Library Management
      </Typography>

      <StyledPaper>
        <ControlsContainer>
          <TextField
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 300 }}
          />
        </ControlsContainer>

        <Box sx={{ height: 600, width: '100%', position: 'relative' }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Error: {error}
            </Alert>
          )}
          
          {loading ? (
            <Box sx={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)'
            }}>
              <CircularProgress />
              <Typography sx={{ mt: 2 }}>Loading...</Typography>
            </Box>
          ) : (
            <DataGrid
              rows={filteredRows}
              columns={columns}
              getRowId={(row: QuestionRow) => row.Id}
              initialState={{
                pagination: { paginationModel: { pageSize: 100 } },
              }}
              pageSizeOptions={[25, 50, 100]}
              disableRowSelectionOnClick
              getRowHeight={() => 35}
              editMode="row"
              processRowUpdate={handleProcessRowUpdate}
              onProcessRowUpdateError={(error) => {
                console.error('Error saving changes:', error);
              }}
              getRowClassName={(params) => {
                const questionNumber = params.row.Question_Number;
                return Number.isInteger(questionNumber) ? 'highlighted-row' : '';
              }}
              sx={{
                '& .MuiDataGrid-cell': {
                  padding: '0 8px',
                  whiteSpace: 'normal',
                  lineHeight: '20px',
                  fontSize: '13px'
                },
                '& .MuiDataGrid-columnHeader': {
                  padding: '0 8px',
                  fontSize: '13px'
                },
                '& .MuiDataGrid-row': {
                  backgroundColor: '#ffffff'
                },
                '& .MuiDataGrid-columnSeparator': {
                  visibility: 'visible'
                },
                '& .highlighted-row': {
                  backgroundColor: '#e3f2fd'
                }
              }}
            />
          )}
        </Box>
      </StyledPaper>

      <Snackbar
        open={saveError !== null}
        autoHideDuration={6000}
        onClose={() => setSaveError(null)}
        message={saveError}
      />
    </Box>
  );
};

export default QuestionsView; 
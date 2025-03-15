import React, { useState, useEffect } from 'react';
import { 
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Paper,
  Typography,
  CircularProgress,
  Alert
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

const TablesView: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<string>('QuestionsLibrary');
  const [rows, setRows] = useState<QuestionRow[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const columns = [
    { 
      field: 'Id', 
      headerName: 'ID', 
      width: 70,
      resizable: true
    },
    { 
      field: 'category', 
      headerName: 'Category', 
      width: 130,
      resizable: true
    },
    { 
      field: 'Question_Number', 
      headerName: 'Question #', 
      width: 90,
      resizable: true
    },
    { 
      field: 'Question_Text', 
      headerName: 'Question Text', 
      width: 600,
      resizable: true
    },
    { 
      field: 'Answer_Format', 
      headerName: 'Answer Format', 
      width: 120,
      resizable: true
    },
    { 
      field: 'Answer_Values', 
      headerName: 'Answer Values', 
      width: 400,
      resizable: true,
      valueGetter: (params: any) => {
        const values = params.row.Answer_Values;
        return Array.isArray(values) ? values.join(', ') : '';
      }
    }
  ];

  useEffect(() => {
    const loadData = async () => {
      if (!selectedTable) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/data/${selectedTable}.json`);
        
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
  }, [selectedTable]);

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
        Data Tables Management
      </Typography>

      <StyledPaper>
        <ControlsContainer>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Select Table</InputLabel>
            <Select
              value={selectedTable}
              label="Select Table"
              onChange={(e) => setSelectedTable(e.target.value)}
            >
              <MenuItem value="QuestionsLibrary">Questions Library</MenuItem>
              <MenuItem value="UnderwritingModel">Underwriting Model</MenuItem>
            </Select>
          </FormControl>
          
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
    </Box>
  );
};

export default TablesView; 
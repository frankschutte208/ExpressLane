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
import { DataGrid, GridRowModel } from '@mui/x-data-grid';
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

interface UnderwritingModelRow {
  Id: number;
  Tenant: string;
  Currency: string;
  Product: string;
  Minimum_Age: number;
  Maximum_Age: number;
  Minimum_Sum_Assured: number;
  Maximum_Sum_Assured: number;
  Questions_Included: number[];
}

const API_BASE_URL = 'http://localhost:3001/api';

const UnderwritingModelsView: React.FC = () => {
  const [rows, setRows] = useState<UnderwritingModelRow[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const columns = [
    { field: 'Id', headerName: 'ID', width: 70, editable: false },
    { field: 'Tenant', headerName: 'Tenant', width: 180, editable: true },
    { field: 'Currency', headerName: 'Currency', width: 100, editable: true },
    { field: 'Product', headerName: 'Product', width: 250, editable: true },
    { 
      field: 'Minimum_Age', 
      headerName: 'Min Age', 
      width: 100, 
      type: 'number',
      editable: true
    },
    { 
      field: 'Maximum_Age', 
      headerName: 'Max Age', 
      width: 100, 
      type: 'number',
      editable: true
    },
    { 
      field: 'Minimum_Sum_Assured', 
      headerName: 'Min Sum Assured', 
      width: 150, 
      type: 'number',
      editable: true,
      valueFormatter: (params: any) => {
        return params.value.toLocaleString();
      }
    },
    { 
      field: 'Maximum_Sum_Assured', 
      headerName: 'Max Sum Assured', 
      width: 150, 
      type: 'number',
      editable: true,
      valueFormatter: (params: any) => {
        return params.value.toLocaleString();
      }
    },
    { 
      field: 'Questions_Included', 
      headerName: 'Questions Included', 
      width: 400,
      editable: true,
      valueGetter: (params: any) => params.row.Questions_Included.join(', '),
      valueSetter: (params: any) => {
        const value = params.value;
        const questions = value.split(',').map((num: string) => parseInt(num.trim())).filter((num: number) => !isNaN(num));
        return { ...params.row, Questions_Included: questions };
      }
    }
  ];

  const handleProcessRowUpdate = async (
    newRow: UnderwritingModelRow,
    oldRow: UnderwritingModelRow
  ): Promise<UnderwritingModelRow> => {
    try {
      // Get current data
      const response = await fetch(`${API_BASE_URL}/underwriting-models`);
      const data = await response.json();
      
      // Update the specific row
      const updatedData = data.map((row: UnderwritingModelRow) => 
        row.Id === newRow.Id ? newRow : row
      );

      // Save back to file through API
      const saveResponse = await fetch(`${API_BASE_URL}/underwriting-models`, {
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
        const response = await fetch(`${API_BASE_URL}/underwriting-models`);
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
        Define the Underwriting Models here.
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
              getRowId={(row: UnderwritingModelRow) => row.Id}
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

export default UnderwritingModelsView; 
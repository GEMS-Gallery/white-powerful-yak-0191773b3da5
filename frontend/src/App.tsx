import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, Button, CircularProgress } from '@mui/material';
import DataTable from 'react-data-table-component';
import { useForm, Controller } from 'react-hook-form';
import { backend } from 'declarations/backend';

interface TaxPayer {
  tid: bigint;
  firstName: string;
  lastName: string;
  address: string;
}

const App: React.FC = () => {
  const [taxPayers, setTaxPayers] = useState<TaxPayer[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTid, setSearchTid] = useState('');
  const { control, handleSubmit, reset } = useForm<TaxPayer>();

  const fetchTaxPayers = async () => {
    setLoading(true);
    try {
      const result = await backend.getTaxPayers();
      setTaxPayers(result);
    } catch (error) {
      console.error('Error fetching tax payers:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTaxPayers();
  }, []);

  const onSubmit = async (data: TaxPayer) => {
    setLoading(true);
    try {
      const result = await backend.addTaxPayer(
        BigInt(data.tid),
        data.firstName,
        data.lastName,
        data.address
      );
      if ('ok' in result) {
        fetchTaxPayers();
        reset();
      } else {
        console.error('Error adding tax payer:', result.err);
      }
    } catch (error) {
      console.error('Error adding tax payer:', error);
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    if (searchTid) {
      setLoading(true);
      try {
        const result = await backend.searchTaxPayer(BigInt(searchTid));
        if (result) {
          setTaxPayers([result]);
        } else {
          setTaxPayers([]);
        }
      } catch (error) {
        console.error('Error searching tax payer:', error);
      }
      setLoading(false);
    } else {
      fetchTaxPayers();
    }
  };

  const columns = [
    {
      name: 'TID',
      selector: (row: TaxPayer) => Number(row.tid),
      sortable: true,
    },
    {
      name: 'First Name',
      selector: (row: TaxPayer) => row.firstName,
      sortable: true,
    },
    {
      name: 'Last Name',
      selector: (row: TaxPayer) => row.lastName,
      sortable: true,
    },
    {
      name: 'Address',
      selector: (row: TaxPayer) => row.address,
      sortable: true,
    },
  ];

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        TaxPayer Management System
      </Typography>
      <Box display="flex" justifyContent="space-between" mb={4}>
        <Box width="45%">
          <Typography variant="h6" gutterBottom>
            Add New TaxPayer
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="tid"
              control={control}
              defaultValue=""
              rules={{ required: 'TID is required' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="TID"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
            <Controller
              name="firstName"
              control={control}
              defaultValue=""
              rules={{ required: 'First Name is required' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="First Name"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
            <Controller
              name="lastName"
              control={control}
              defaultValue=""
              rules={{ required: 'Last Name is required' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Last Name"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
            <Controller
              name="address"
              control={control}
              defaultValue=""
              rules={{ required: 'Address is required' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Address"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Add TaxPayer'}
            </Button>
          </form>
        </Box>
        <Box width="45%">
          <Typography variant="h6" gutterBottom>
            Search TaxPayer
          </Typography>
          <TextField
            label="Search by TID"
            fullWidth
            margin="normal"
            value={searchTid}
            onChange={(e) => setSearchTid(e.target.value)}
          />
          <Button onClick={handleSearch} variant="contained" color="secondary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Search'}
          </Button>
        </Box>
      </Box>
      <Typography variant="h6" gutterBottom>
        TaxPayer Records
      </Typography>
      <DataTable
        columns={columns}
        data={taxPayers}
        pagination
        progressPending={loading}
        progressComponent={<CircularProgress />}
      />
    </Container>
  );
};

export default App;

import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TablePagination,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { dokterAPI } from '../../services/api';
import DokterForm from '../../components/DokterForm/DokterForm';

const DokterList = () => {
  const [dokters, setDokters] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDokter, setSelectedDokter] = useState(null);
  const [orderBy, setOrderBy] = useState('dokNama');
  const [orderDirection, setOrderDirection] = useState('asc');

  const fetchDokters = React.useCallback(async () => {
    try {
      const response = await dokterAPI.list(page, rowsPerPage, orderBy, orderDirection);
      setDokters(response.data);
      setTotalRows(response.totalItems);
    } catch (error) {
      console.error('Error fetching dokters:', error);
    }
  }, [page, rowsPerPage, orderBy, orderDirection]);

  useEffect(() => {
    fetchDokters();
  }, [fetchDokters]);

  const handleAdd = async (data) => {
    try {
      await dokterAPI.add(data);
      setOpenDialog(false);
      fetchDokters();
    } catch (error) {
      console.error('Error adding dokter:', error);
    }
  };

  const handleEdit = async (data) => {
    try {
      await dokterAPI.edit(selectedDokter.dokId, data);
      setOpenDialog(false);
      setSelectedDokter(null);
      fetchDokters();
    } catch (error) {
      console.error('Error editing dokter:', error);
    }
  };

  const handleDelete = async (dokId) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await dokterAPI.delete(dokId);
        fetchDokters();
      } catch (error) {
        console.error('Error deleting dokter:', error);
      }
    }
  };

  const handleSort = (field) => {
    const isAsc = orderBy === field && orderDirection === 'asc';
    setOrderDirection(isAsc ? 'desc' : 'asc');
    setOrderBy(field);
  };

  return (
    <Box>
      <Button
        variant="contained"
        onClick={() => setOpenDialog(true)}
        sx={{ mb: 2 }}
      >
        Add New Doctor
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell 
                onClick={() => handleSort('dokNama')}
                sx={{ cursor: 'pointer' }}
              >
                Nama
                {orderBy === 'dokNama' && (
                  orderDirection === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />
                )}
              </TableCell>
              <TableCell 
                onClick={() => handleSort('dokAlamat')}
                sx={{ cursor: 'pointer' }}
              >
                Alamat
                {orderBy === 'dokAlamat' && (
                  orderDirection === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />
                )}
              </TableCell>
              <TableCell>
                Jam Praktek
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dokters.map((dokter) => (
              <TableRow key={dokter.dokId}>
                <TableCell>{dokter.dokNama}</TableCell>
                <TableCell>{dokter.dokAlamat}</TableCell>
                <TableCell>{dokter.dokJamPraktek}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      setSelectedDokter(dokter);
                      setOpenDialog(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(dokter.dokId)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={totalRows}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>

      <Dialog open={openDialog} onClose={() => {
        setOpenDialog(false);
        setSelectedDokter(null);
      }}>
        <DialogTitle>
          {selectedDokter ? 'Edit Doctor' : 'Add New Doctor'}
        </DialogTitle>
        <DialogContent>
          <DokterForm
            initialData={selectedDokter ? {
              nama: selectedDokter.dokNama,
              alamat: selectedDokter.dokAlamat,
              jam_praktek: selectedDokter.dokJamPraktek
            } : null}
            onSubmit={selectedDokter ? handleEdit : handleAdd}
            buttonText={selectedDokter ? 'Update' : 'Add'}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default DokterList; 
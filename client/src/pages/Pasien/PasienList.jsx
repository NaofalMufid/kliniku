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
  TablePagination,
  Typography,
  TextField,
  Grid
} from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { pasienAPI } from '../../services/api';

const PasienList = () => {
  const [pasiens, setPasiens] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [orderBy, setOrderBy] = useState('rawatNama');
  const [orderDirection, setOrderDirection] = useState('ASC');
  const [tglAwal, setTglAwal] = useState(null);
  const [tglAkhir, setTglAkhir] = useState(null);
  const [gender, setGender] = useState('');

  const fetchPasiens = React.useCallback(async () => {
    try {
      const response = await pasienAPI.list(page, rowsPerPage, orderBy, orderDirection, tglAwal, tglAkhir, gender);
      setPasiens(response.data);
      setTotalRows(response.totalItems);
    } catch (error) {
      console.error('Error fetching pasiens:', error);
    }
  }, [page, rowsPerPage, orderBy, orderDirection, tglAwal, tglAkhir, gender]);

  useEffect(() => {
    fetchPasiens();
  }, [fetchPasiens]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (field) => {
    const isAsc = orderBy === field && orderDirection === 'ASC';
    setOrderDirection(isAsc ? 'DESC' : 'ASC');
    setOrderBy(field);
  };

  const formatDate = (date) => {
    return dayjs(date).format('DD/MM/YYYY');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Daftar Pasien
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Tanggal Awal"
              value={tglAwal}
              onChange={setTglAwal}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} md={3}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Tanggal Akhir"
              value={tglAkhir}
              onChange={setTglAkhir}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            select
            fullWidth
            label="Gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            SelectProps={{ native: true }}
          >
            <option value="">Semua</option>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </TextField>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell onClick={() => handleSort('rawatRm')} sx={{ cursor: 'pointer' }}>
                No. RM
                {orderBy === 'rawatRm' && (
                  orderDirection === 'ASC' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />
                )}
              </TableCell>
              <TableCell onClick={() => handleSort('rawatNama')} sx={{ cursor: 'pointer' }}>
                Nama
                {orderBy === 'rawatNama' && (
                  orderDirection === 'ASC' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />
                )}
              </TableCell>
              <TableCell>Alamat</TableCell>
              <TableCell>Tanggal Lahir</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Tanggal Periksa</TableCell>
              <TableCell>Dokter</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pasiens.map((pasien) => (
              <TableRow key={pasien.rawatPasId}>
                <TableCell>{pasien.rawatRm}</TableCell>
                <TableCell>{pasien.rawatNama}</TableCell>
                <TableCell>{pasien.rawatAlamat}</TableCell>
                <TableCell>{formatDate(pasien.rawatLahir)}</TableCell>
                <TableCell>{pasien.rawatGender === 1 ? 'Laki-laki' : 'Perempuan'}</TableCell>
                <TableCell>{formatDate(pasien.rawatTglPeriksa)}</TableCell>
                <TableCell>{pasien.dokNama}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalRows}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
};

export default PasienList; 
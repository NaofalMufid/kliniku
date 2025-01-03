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
import { pemeriksaanAPI } from '../../services/api';

const PemeriksaanList = () => {
  const [pemeriksaans, setPemeriksaans] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [orderBy, setOrderBy] = useState('rawatNama');
  const [orderDirection, setOrderDirection] = useState('ASC');
  const [namaPasien, setNamaPasien] = useState('');
  const [tglAwal, setTglAwal] = useState(null);
  const [tglAkhir, setTglAkhir] = useState(null);

  const fetchPemeriksaans = React.useCallback(async () => {
    try {
      const response = await pemeriksaanAPI.list(
        page,
        rowsPerPage,
        orderBy,
        orderDirection,
        namaPasien,
        tglAwal ? dayjs(tglAwal).format('YYYY-MM-DD') : null,
        tglAkhir ? dayjs(tglAkhir).format('YYYY-MM-DD') : null
      );
      setPemeriksaans(response.data);
      setTotalRows(response.totalItems);
    } catch (error) {
      console.error('Error fetching pemeriksaans:', error);
    }
  }, [page, rowsPerPage, orderBy, orderDirection, namaPasien, tglAwal, tglAkhir]);

  useEffect(() => {
    fetchPemeriksaans();
  }, [fetchPemeriksaans]);

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
        Daftar Pemeriksaan
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Nama Pasien"
            value={namaPasien}
            onChange={(e) => setNamaPasien(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Tanggal Awal"
              value={tglAwal}
              onChange={setTglAwal}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} md={4}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Tanggal Akhir"
              value={tglAkhir}
              onChange={setTglAkhir}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell onClick={() => handleSort('nama_pasien')} sx={{ cursor: 'pointer' }}>
                Nama Pasien
                {orderBy === 'nama_pasien' && (
                  orderDirection === 'ASC' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />
                )}
              </TableCell>
              <TableCell>Tanggal Periksa</TableCell>
              <TableCell>Dokter</TableCell>
              <TableCell>Pemeriksaan</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pemeriksaans.map((pemeriksaan, index) => (
              <TableRow key={`${pemeriksaan.id}-${index}`}>
                <TableCell>{pemeriksaan.nama_pasien}</TableCell>
                <TableCell>{formatDate(pemeriksaan.tgl_periksa)}</TableCell>
                <TableCell>{pemeriksaan.nama_dokter}</TableCell>
                <TableCell>{pemeriksaan.nama_pemeriksaan}</TableCell>
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

export default PemeriksaanList; 
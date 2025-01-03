import React from 'react';
import PropTypes from 'prop-types';
import { Box, TextField, Button } from '@mui/material';

const DokterForm = ({ initialData = {}, onSubmit, buttonText = 'Submit' }) => {
  const [formData, setFormData] = React.useState({
    nama: (initialData?.nama) || '',
    alamat: (initialData?.alamat) || '',
    jam_praktek: (initialData?.jam_praktek) || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        required
        name="nama"
        label="Nama Dokter"
        value={formData.nama}
        onChange={handleChange}
      />
      <TextField
        required
        name="alamat"
        label="Alamat"
        value={formData.alamat}
        onChange={handleChange}
      />
      <TextField
        required
        name="jam_praktek"
        label="Jam Praktek"
        value={formData.jam_praktek}
        onChange={handleChange}
      />
      <Button type="submit" variant="contained">{buttonText}</Button>
    </Box>
  );
};

DokterForm.propTypes = {
  initialData: PropTypes.shape({
    nama: PropTypes.string,
    alamat: PropTypes.string,
    jam_praktek: PropTypes.string
  }),
  onSubmit: PropTypes.func.isRequired,
  buttonText: PropTypes.string
};

export default DokterForm; 
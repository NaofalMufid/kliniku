import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Welcome = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Hello Kliniku
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Please select a menu item from the sidebar to get started.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Welcome; 
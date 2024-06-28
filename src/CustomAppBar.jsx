import React from 'react';
import { AppBar, Toolbar, Typography, Fab } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const CustomAppBar = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          App Title
        </Typography>
        <Fab color="secondary" aria-label="add" onClick={() => navigate('/form')} style={{ position: 'fixed', bottom: 16, right: 16 }}>
          <AddIcon />
        </Fab>
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;

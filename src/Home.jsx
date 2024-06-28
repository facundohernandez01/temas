import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, FormControlLabel, Switch } from '@mui/material';
import { Visibility, Delete, Send } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs'; // Importar dayjs

const Home = () => {
    const navigate = useNavigate();
    const [records, setRecords] = useState([]);
    const [showCompleted, setShowCompleted] = useState(false);
  
    useEffect(() => {
      const q = query(collection(db, 'statusnotif'), showCompleted ? where('FechaFin', '!=', null) : where('FechaFin', '==', null));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setRecords(data);
      });
      return () => unsubscribe();
    }, [showCompleted]);
  
    const handleDelete = async (id) => {
      await deleteDoc(doc(db, 'statusnotif', id));
    };
  
    const handleSendWhatsApp = (record) => {
      const message = `*${record.temasrelevantes}*\n${record.incidente}\n${record.cuerpo}\n${dayjs(record.FechaInicio.toDate()).format('DD/MM/YYYY HH:mm')}\n${record.FechaFin ? dayjs(record.FechaFin.toDate()).format('DD/MM/YYYY HH:mm') : ''}`;
      const url = `https://wa.me/3400498587?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    };
    
  
  
    return (
      <Container>
        <FormControlLabel
          control={<Switch checked={showCompleted} onChange={() => setShowCompleted(!showCompleted)} />}
          label="Mostrar finalizados"
        />
        <Grid container spacing={2}>
          {records.map((record) => (
            <Grid item xs={12} key={record.id}>
              <Paper style={{ padding: '1rem' }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={4}>{dayjs(record.FechaInicio.toDate()).format('DD/MM/YYYY')}<br></br>
                    {record.incidente}</Grid>                
                  <Grid item xs={4}>{record.cuerpo}</Grid>
                  <Grid item xs={3}>
                    <IconButton onClick={() => navigate(`/form/${record.id}`)}><VisibilityIcon /></IconButton>
                    <IconButton onClick={() => handleDelete(record.id)}><DeleteIcon /></IconButton>
                    <IconButton onClick={() => handleSendWhatsApp(record)}><SendIcon /></IconButton>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  };

export default Home;

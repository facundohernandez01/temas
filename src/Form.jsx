import React, { useState, useEffect } from 'react';
import { TextField, Container, Grid, Paper, Button, IconButton } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { collection, addDoc, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { Add as AddIcon, Delete as DeleteIcon, WhatsApp, Visibility as VisibilityIcon, Send as SendIcon, ContentCopy as ContentCopyIcon, Close as CloseIcon } from '@mui/icons-material'; // Importa CloseIcon

const Form = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        FechaInicio: dayjs(),
        FechaFin: null,
        incidente: '',
        cuerpo: '',
        temasrelevantes: 'Temas relevantes',
    });

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                const docRef = doc(db, 'statusnotif', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setFormData({
                        ...data,
                        FechaInicio: data.FechaInicio ? dayjs(data.FechaInicio.toDate()) : dayjs(),
                        FechaFin: data.FechaFin ? dayjs(data.FechaFin.toDate()) : null,
                    });
                }
            };
            fetchData();
        }
    }, [id]);

    const handleChange = (field) => (event) => {
        setFormData({ ...formData, [field]: event.target.value });
    };

    const handleDateChange = (field) => (newValue) => {
        setFormData({ ...formData, [field]: newValue });
    };

    const handleSubmit = async () => {
        const FechaCarga = new Date();
        const dataToSave = {
            ...formData,
            FechaCarga,
            FechaInicio: formData.FechaInicio.toDate(),
            FechaFin: formData.FechaFin ? formData.FechaFin.toDate() : null,
        };

        if (id) {
            await updateDoc(doc(db, 'statusnotif', id), dataToSave);
        } else {
            await addDoc(collection(db, 'statusnotif'), dataToSave);
        }
        navigate('/');
    };

    const handleCancel = () => {
        navigate('/');
    };

    const handleSendWApp = () => {
        const message = `*${formData.temasrelevantes}*\n*${formData.incidente}*\n${formData.cuerpo}\nInicio: ${dayjs(formData.FechaInicio.toDate()).format('DD/MM/YYYY HH:mm')}\nFin: ${formData.FechaFin ? dayjs(formData.FechaFin.toDate()).format('DD/MM/YYYY HH:mm') : ''}`;
        const url = `https://wa.me/3400498587&text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const handleCopyMessage = () => {
        const message = `*${formData.temasrelevantes}*\n*${formData.incidente}*\n${formData.cuerpo}\nInicio: ${dayjs(formData.FechaInicio.toDate()).format('DD/MM/YYYY HH:mm')}\nFin: ${formData.FechaFin ? dayjs(formData.FechaFin.toDate()).format('DD/MM/YYYY HH:mm') : ''}`;
        navigator.clipboard.writeText(message).then(() => {
            console.log(message);
        }).catch(err => {
            console.error('Error al copiar el mensaje: ', err);
        });
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Container component={Paper} style={{ padding: '2rem', position: 'relative', backgroundColor: '#fff' }}>
                <IconButton 
                    color="primary" 
                    onClick={handleCancel}
                    style={{ position: 'absolute', top: '10px', right: '10px' }}
                >
                    <CloseIcon />
                </IconButton>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <DateTimePicker
                            label="Fecha Inicio"
                            value={formData.FechaInicio}
                            onChange={handleDateChange('FechaInicio')}
                            renderInput={(props) => <TextField {...props} fullWidth />}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <DateTimePicker
                            label="Fecha Fin"
                            value={formData.FechaFin}
                            onChange={handleDateChange('FechaFin')}
                            renderInput={(props) => <TextField {...props} fullWidth />}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Incidente"
                            value={formData.incidente}
                            onChange={handleChange('incidente')}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Cuerpo"
                            value={formData.cuerpo}
                            onChange={handleChange('cuerpo')}
                            multiline
                            rows={4}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Temas Relevantes"
                            value={formData.temasrelevantes}
                            onChange={handleChange('temasrelevantes')}
                            fullWidth
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2} justifyContent="flex-end" style={{ marginTop: '1rem' }}>
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                            Guardar
                        </Button>
                    </Grid>
                    <Grid item>
                        <IconButton color="primary" onClick={handleCopyMessage}>
                            <ContentCopyIcon /> {/* Ícono de copiar contenido */}
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <IconButton color="primary" onClick={handleSendWApp}>
                            <WhatsApp /> {/* Ícono de WhatsApp */}
                        </IconButton>
                    </Grid>
                </Grid>
            </Container>
        </LocalizationProvider>
    );
};

export default Form;

import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Fab,
  Container,
  Grid,
  Paper,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  IconButton,
  Popper,
  Box,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  WhatsApp,
  Visibility as VisibilityIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import dayjs from "dayjs";
import Form from "./Form";



const Home = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, "statusnotif"),
      showCompleted
        ? where("FechaFin", "!=", null)
        : where("FechaFin", "==", null)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecords(data);
    });
    return () => unsubscribe();
  }, [showCompleted]);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "statusnotif", id));
  };

  const handleMouseEnter = (event, record) => {
    setAnchorEl(event.currentTarget);
    setOpen(record.id);
  };

  const handleMouseLeave = () => {
    setOpen(false);
  };

  const handleSendWhatsApp = (record) => {
    const message = `*${record.temasrelevantes}*\n*${record.incidente}*\n${record.cuerpo}\nInicio: ${dayjs(record.FechaInicio.toDate()).format("DD/MM/YYYY HH:mm")}\nFin: ${record.FechaFin ? dayjs(record.FechaFin.toDate()).format("DD/MM/YYYY HH:mm") : ""}`;
    const phone = '543400498587';  // Asegúrate de que el número esté correctamente formateado
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };
  
  const filteredRecords = records.filter(record =>
    record.cuerpo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <FormControlLabel
        control={
          <Switch
            checked={showCompleted}
            onChange={() => setShowCompleted(!showCompleted)}
          />
        }
        label="Mostrar finalizados"
      />
      <TextField
        label="Buscar"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Grid container spacing={2}>
        {filteredRecords.map((record) => (
          <Grid item xs={12} key={record.id}>
            <Paper style={{ padding: "1rem" }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={9}
                    onMouseEnter={(event) => handleMouseEnter(event, record)}
                    onMouseLeave={handleMouseLeave}
                    aria-describedby={`popper-${record.id}`}
                    onClick={() => navigate(`/form/${record.id}`)}
                  >
                  {dayjs(record.FechaInicio.toDate()).format("DD/MM/YYYY")}
                  <br></br>
                  {record.incidente}
                  <br></br>
                    {record.cuerpo.length > 20
                      ? `${record.cuerpo.slice(0, 20)}...`
                      : record.cuerpo}
    
                </Grid>
                <Popper
                    open={open === record.id}
                    anchorEl={anchorEl}
                    id={`popper-${record.id}`}
                  >
                    {({ TransitionProps }) => (
                          <Box sx={{ backgroundColor: '#000', color: '#fff', p: 2 }}>{record.cuerpo}</Box>
                    )}
                  </Popper>
                <Grid item xs={3}>
                  <IconButton onClick={() => navigate(`/form/${record.id}`)}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(record.id)}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton onClick={() => handleSendWhatsApp(record)}>
                  <WhatsApp />
                  </IconButton>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

const CustomAppBar = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Temas Relevantes
        </Typography>
        <Fab
          color="secondary"
          aria-label="add"
          onClick={() => navigate("/form")}
          style={{ position: "fixed", bottom: 16, right: 16 }}
        >
          <AddIcon />
        </Fab>
      </Toolbar>
    </AppBar>
  );
};

const App = () => {
  return (
    <Router>
      <CustomAppBar />
      <Container style={{ marginTop: "64px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/form" element={<Form />} />
          <Route path="/form/:id" element={<Form />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;

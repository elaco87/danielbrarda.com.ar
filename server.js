const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname)));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/img', express.static(path.join(__dirname, 'img')));

// Rutas de API
app.get('/api/properties', (req, res) => {
    const dataPath = path.join(__dirname, 'data', 'properties.json');

    if (fs.existsSync(dataPath)) {
        try {
            const properties = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
            res.json(properties);
        } catch (error) {
            console.error('Error leyendo properties.json:', error);
            res.status(500).json({ connection: false, message: 'Error al leer datos de propiedades' });
        }
    } else {
        res.status(404).json({ connection: false, message: 'Archivo de datos no encontrado' });
    }
});

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

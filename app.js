// app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
console.log('Iniciando el servidor...');


// Conectar a la base de datos MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Configurar Multer para la carga de archivos
const storage = multer.diskStorage({
  destination: 'uploads/', // carpeta donde se guardan las fotos
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Crear un esquema para las fotos
const photoSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  uploadedAt: { type: Date, default: Date.now },
});
const Photo = mongoose.model('Photo', photoSchema);

// Rutas
app.use(express.static('public'));

// Ruta para cargar una foto
app.post('/upload', upload.single('photo'), async (req, res) => {
  const newPhoto = new Photo({
    filename: req.file.filename,
    originalname: req.file.originalname,
  });
  await newPhoto.save();
  res.status(200).json({ message: 'Foto subida exitosamente' });
});

// Ruta para obtener la lista de fotos
app.get('/photos', async (req, res) => {
  const photos = await Photo.find();
  res.status(200).json(photos);
});

// Ruta para descargar una foto
app.get('/download/:filename', (req, res) => {
  const filepath = path.join(__dirname, 'uploads', req.params.filename);
  res.download(filepath);
});

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
app.use('/uploads', express.static('uploads'));  // Hacer que la carpeta 'uploads' sea pública

// Ruta para mostrar la galería de fotos con un botón de descarga visible
app.get('/gallery', async (req, res) => {
    try {
      const photos = await Photo.find(); // Obtén todas las fotos desde la base de datos
  
      // Genera un HTML básico para mostrar las fotos con estilos adicionales
      let html = `
        <html>
          <head>
            <title>Galería de Fotos</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; }
              h1 { color: #333; }
              .gallery { display: flex; flex-wrap: wrap; justify-content: center; }
              .photo { margin: 15px; text-align: center; }
              img { max-width: 200px; height: auto; display: block; margin-bottom: 10px; }
              .download-btn {
                padding: 8px 12px;
                background-color: #007bff;
                color: white;
                text-decoration: none;
                border-radius: 5px;
              }
              .download-btn:hover {
                background-color: #0056b3;
              }
            </style>
          </head>
          <body>
            <h1>Galería de Fotos</h1>
            <div class="gallery">
      `;
  
      // Añadir cada foto con un botón de descarga
      photos.forEach(photo => {
        html += `
          <div class="photo">
            <img src="/uploads/${photo.filename}" alt="${photo.originalname}" />
            <p>${photo.originalname}</p>
            <a href="/download/${photo.filename}" class="download-btn">Descargar</a>
          </div>
        `;
      });
  
      html += `
            </div>
          </body>
        </html>
      `;
  
      res.send(html);
    } catch (err) {
      res.status(500).send('Error al cargar la galería');
    }
  });
  


  // Al final de tu archivo app.js
if (require.main === module) {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  }
  
  module.exports = app;
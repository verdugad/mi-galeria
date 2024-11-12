// Manejar la subida de fotos
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('photo', e.target.photo.files[0]);
  
    await fetch('/upload', {
      method: 'POST',
      body: formData,
    });
  
    loadPhotos();
  });
  
  // Cargar la galería de fotos
  async function loadPhotos() {
    const response = await fetch('/photos');
    const photos = await response.json();
  
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';
    photos.forEach(photo => {
      const img = document.createElement('img');
      img.src = `/uploads/${photo.filename}`;
      img.alt = photo.originalname;
  
      const link = document.createElement('a');
      link.href = `/download/${photo.filename}`;
      link.textContent = 'Descargar';
  
      const container = document.createElement('div');
      container.appendChild(img);
      container.appendChild(link);
  
      gallery.appendChild(container);
    });
  }
  
  // Cargar las fotos al inicio
  loadPhotos();
  
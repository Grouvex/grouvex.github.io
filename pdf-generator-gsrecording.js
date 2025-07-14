// Usaremos jsPDF para generar el PDF en el cliente
function generateContractPDF(artist) {
  // Mostrar spinner de carga
  const spinner = document.createElement('div');
  spinner.className = 'pdf-loading-spinner';
  spinner.innerHTML = `
    <div class="spinner"></div>
    <p>Generando PDF...</p>
  `;
  document.body.appendChild(spinner);

  // Crear contenido HTML para el PDF
  const content = `
    <h1>Contrato de Artista</h1>
    <h2>Grouvex Studios Recording</h2>
    
    <div class="contract-section">
      <h3>Información del Artista</h3>
      <p><strong>Nombre:</strong> ${artist.nombreArtista}</p>
      <p><strong>ID:</strong> ${artist.id}</p>
      <p><strong>Email:</strong> ${artist.email}</p>
      <p><strong>Teléfono:</strong> ${artist.telefono}</p>
    </div>
    
    <!-- Más secciones del contrato -->
  `;

  // Usar html2pdf.js para generar el PDF
  const element = document.createElement('div');
  element.innerHTML = content;
  document.body.appendChild(element);

  const opt = {
    margin: 10,
    filename: `Contrato_Grouvex_${artist.id}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  // Generar PDF
  html2pdf().set(opt).from(element).save().then(() => {
    document.body.removeChild(element);
    document.body.removeChild(spinner);
  });
}

// Nota: Necesitarás incluir las librerías jsPDF y html2pdf en tu proyecto

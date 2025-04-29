// Crea el preloader dinámicamente
const preloader = document.createElement('div');
preloader.id = 'global-preloader';
preloader.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  transition: opacity 0.5s ease-out;
`;

// Crea el spinner
const spinner = document.createElement('div');
spinner.style.cssText = `
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
`;

// Añade el spinner al preloader
preloader.appendChild(spinner);

// Añade los estilos de animación dinámicamente
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

// Añade el preloader al cuerpo del documento
document.body.appendChild(preloader);

// Configuración del timeout (8 segundos)
const loadTimeout = setTimeout(() => {
  preloader.style.opacity = '0';
  setTimeout(() => {
    preloader.style.display = 'none';
  }, 500);
}, 8000);

// Oculta el preloader cuando todo esté cargado
window.addEventListener('load', () => {
  clearTimeout(loadTimeout);
  preloader.style.opacity = '0';
  setTimeout(() => {
    preloader.style.display = 'none';
  }, 500);
});

// Opcional: Manejo de errores para asegurar que el preloader siempre desaparezca
window.addEventListener('error', () => {
  clearTimeout(loadTimeout);
  preloader.style.opacity = '0';
  setTimeout(() => {
    preloader.style.display = 'none';
  }, 500);
}, true);

// Función para mostrar modal de error
export function mostrarErrorGuardado(options = {}) {
  const {
    title = '¡Error al guardar!',
    message = 'Ha ocurrido un error inesperado al guardar la dieta. Por favor, inténtalo de nuevo.',
    errorDetails = null,
    primaryButtonText = 'Intentar de nuevo',

    showDetails = true
  } = options;
  
  return new Promise((resolve) => {
    // Inyectar estilos
    inyectarEstilosError();
    
    // Evitar duplicados
    if (document.getElementById('error-overlay')) {
      document.getElementById('error-overlay').remove();
    }
    
    // Crear overlay de error
    const overlay = document.createElement('div');
    overlay.id = 'error-overlay';
    overlay.innerHTML = `
      <div class="error-container" id="error-container">
        <div class="error-header">
          <div class="error-icon">
            <i class="bi bi-exclamation-triangle"></i>
          </div>
          <h3>${title}</h3>
          <p class="error-message">${message}</p>
        </div>
        
        ${errorDetails && showDetails ? `
        <div class="error-details">
          <div class="error-details-toggle" id="error-details-toggle">
            <span>Ver detalles del error</span>
            <i class="bi bi-chevron-down"></i>
          </div>
          <div class="error-details-content" id="error-details-content" style="display: none;">
            <pre>${errorDetails}</pre>
          </div>
        </div>
        ` : ''}
        
        <div class="error-footer">
          <button class="error-btn error-btn-primary" id="error-retry">
            <i class="bi bi-arrow-clockwise"></i> ${primaryButtonText}
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Activar animación
    overlay.offsetHeight;
    overlay.classList.add('active');
    
    // Event listeners

    const btnRetry = document.getElementById('error-retry');
    const detailsToggle = document.getElementById('error-details-toggle');
    const detailsContent = document.getElementById('error-details-content');
    
    const cerrarModal = (resultado) => {
    overlay.classList.remove('active');
    setTimeout(() => {
        overlay.remove();
        resolve(resultado);
    }, 300);
    };

    btnRetry.addEventListener('click', () => cerrarModal({ retry: true, close: false }));
    
    // Toggle de detalles del error
   if (detailsToggle && detailsContent) {
  detailsToggle.addEventListener('click', () => {
    const isVisible = detailsContent.style.display !== 'none';
    const icon = detailsToggle.querySelector('i');
    
    if (isVisible) {
      detailsContent.style.display = 'none';
      icon.className = 'bi bi-chevron-down';
      detailsToggle.querySelector('span').textContent = 'Ver detalles del error';
    } else {
      detailsContent.style.display = 'block';
      icon.className = 'bi bi-chevron-up';
      detailsToggle.querySelector('span').textContent = 'Ocultar detalles';
    }
  });
}
    
    // Cerrar con ESC
    const handleEsc = (e) => {
    if (e.key === 'Escape') {
        cerrarModal({ retry: false, close: true });
        document.removeEventListener('keydown', handleEsc);
    }
    };
    document.addEventListener('keydown', handleEsc);
    // Cerrar al hacer click fuera
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        cerrarModal({ retry: false, close: true });
      }
    });
  });
}

function inyectarEstilosError() {
  if (document.getElementById('error-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'error-styles';
  style.textContent = `
    #error-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(6px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    #error-overlay.active {
      opacity: 1;
    }
    
    .error-container {
      background: white;
      border-radius: 20px;
      padding: 40px;
      max-width: 500px;
      width: 90%;
      box-shadow: 0 25px 80px rgba(0, 0, 0, 0.4);
      animation: shakeIn 0.6s ease;
      border-top: 5px solid #dc3545;
    }
    
    @keyframes shakeIn {
      0% {
        transform: translateY(40px) scale(0.9);
        opacity: 0;
      }
      60% {
        transform: translateY(-10px) scale(1.02);
        opacity: 1;
      }
      80% {
        transform: translateY(5px) scale(0.98);
      }
      100% {
        transform: translateY(0) scale(1);
      }
    }
    
    .error-header {
      text-align: center;
      margin-bottom: 24px;
    }
    
    .error-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 20px;
      background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 25px rgba(220, 53, 69, 0.4);
      animation: errorPulse 2s infinite;
    }
    
    @keyframes errorPulse {
      0%, 100% {
        box-shadow: 0 8px 25px rgba(220, 53, 69, 0.4);
      }
      50% {
        box-shadow: 0 8px 35px rgba(220, 53, 69, 0.6);
      }
    }
    
    .error-icon i {
      font-size: 40px;
      color: white;
      animation: wobble 2s infinite;
    }
    
    @keyframes wobble {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(-5deg); }
      75% { transform: rotate(5deg); }
    }
    
    .error-header h3 {
      margin: 0 0 16px 0;
      color: #dc3545;
      font-size: 24px;
      font-weight: 700;
    }
    
    .error-message {
      color: #6c757d;
      font-size: 16px;
      margin: 0;
      line-height: 1.6;
    }
    
    /* === DETALLES DEL ERROR === */
    .error-details {
      margin: 24px 0;
      border: 1px solid #e9ecef;
      border-radius: 12px;
      overflow: hidden;
    }
    
    .error-details-toggle {
      padding: 16px;
      background: #f8f9fa;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: between;
      transition: all 0.2s ease;
      border-bottom: 1px solid #e9ecef;
    }
    
    .error-details-toggle:hover {
      background: #e9ecef;
    }
    
    .error-details-toggle span {
      flex: 1;
      font-weight: 500;
      color: #495057;
      font-size: 14px;
    }
    
    .error-details-toggle i {
      color: #6c757d;
      transition: transform 0.2s ease;
    }
    
    .error-details-content {
      padding: 16px;
      background: #f8f9fa;
      max-height: 200px;
      overflow-y: auto;
    }
    
    .error-details-content pre {
      margin: 0;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      color: #dc3545;
      background: white;
      padding: 12px;
      border-radius: 8px;
      border-left: 4px solid #dc3545;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    
    /* === BOTONES === */
    .error-footer {
      display: flex;
      gap: 16px;
      margin-top: 32px;
    }
    
    .error-btn {
      flex: 1;
      padding: 14px 24px;
      border: none;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    
    .error-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }
    
    .error-btn:active {
      transform: translateY(0);
    }
    
    .error-btn-secondary {
      background: #6c757d;
      color: white;
    }
    
    .error-btn-secondary:hover {
      background: #5a6268;
      box-shadow: 0 8px 25px rgba(108, 117, 125, 0.3);
    }
    
    .error-btn-primary {
      background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(220, 53, 69, 0.4);
    }
    
    .error-btn-primary:hover {
      box-shadow: 0 8px 25px rgba(220, 53, 69, 0.5);
    }
    
    /* === SCROLLBAR PERSONALIZADA === */
    .error-details-content::-webkit-scrollbar {
      width: 8px;
    }
    
    .error-details-content::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }
    
    .error-details-content::-webkit-scrollbar-thumb {
      background: #ccc;
      border-radius: 4px;
    }
    
    .error-details-content::-webkit-scrollbar-thumb:hover {
      background: #999;
    }
  `;
  
  document.head.appendChild(style);
}


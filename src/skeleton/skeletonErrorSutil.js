// skeletonErrorSutil.js
// Skeleton de error sutil y discreto

// ========================================
// 🎨 ESTILOS DEL SKELETON ERROR SUTIL
// ========================================

function inyectarEstilos() {
  if (document.getElementById('skeleton-error-sutil-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'skeleton-error-sutil-styles';
  style.textContent = `
    #skeleton-error-sutil-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(2px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    #skeleton-error-sutil-overlay.active {
      opacity: 1;
    }
    
    .skeleton-error-sutil-container {
      background: white;
      border-radius: 12px;
      padding: 24px 32px;
      max-width: 400px;
      width: 90%;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      text-align: center;
      animation: slideDown 0.3s ease;
      border-top: 4px solid #ef4444;
    }
    
    @keyframes slideDown {
      from {
        transform: translateY(-20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    
    .skeleton-error-sutil-icon {
      width: 48px;
      height: 48px;
      margin: 0 auto 16px;
      background: #fee2e2;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .skeleton-error-sutil-icon i {
      font-size: 24px;
      color: #ef4444;
    }
    
    .skeleton-error-sutil-icon::before {
      content: "✕";
      font-size: 28px;
      color: #ef4444;
      font-weight: 600;
    }
    
    .skeleton-error-sutil-title {
      margin: 0 0 8px 0;
      color: #1a1a1a;
      font-size: 18px;
      font-weight: 600;
    }
    
    .skeleton-error-sutil-message {
      color: #666;
      font-size: 14px;
      margin: 0 0 20px 0;
      line-height: 1.5;
    }
    
    .skeleton-error-sutil-button {
      background: #ef4444;
      color: white;
      border: none;
      padding: 10px 24px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s ease;
    }
    
    .skeleton-error-sutil-button:hover {
      background: #dc2626;
    }
    
    .skeleton-error-sutil-button:active {
      transform: scale(0.98);
    }
  `;
  
  document.head.appendChild(style);
}

// ========================================
// 🎭 FUNCIONES PÚBLICAS
// ========================================

/**
 * Muestra el skeleton de error sutil
 * @param {Object} options - Opciones de configuración
 * @param {string} options.title - Título del error (default: "Error")
 * @param {string} options.message - Mensaje del error (default: "Ha ocurrido un error")
 * @param {string} options.buttonText - Texto del botón (default: "Aceptar")
 */
export function mostrarErrorSutil(options = {}) {
  const {
    title = 'Error',
    message = 'Ha ocurrido un error',
    buttonText = 'Aceptar'
  } = options;
  
  // Inyectar estilos si no existen
  inyectarEstilos();
  
  // Evitar duplicados
  if (document.getElementById('skeleton-error-sutil-overlay')) {
    return;
  }
  
  // Crear overlay
  const overlay = document.createElement('div');
  overlay.id = 'skeleton-error-sutil-overlay';
  overlay.innerHTML = `
    <div class="skeleton-error-sutil-container">
      <div class="skeleton-error-sutil-icon"></div>
      <h3 class="skeleton-error-sutil-title">${title}</h3>
      <p class="skeleton-error-sutil-message">${message}</p>
      <button class="skeleton-error-sutil-button">${buttonText}</button>
    </div>
  `;
  
  document.body.appendChild(overlay);
  
  // Forzar reflow para activar animación
  overlay.offsetHeight;
  overlay.classList.add('active');
  
  // Añadir evento al botón
  const button = overlay.querySelector('.skeleton-error-sutil-button');
  button.addEventListener('click', () => {
    ocultarErrorSutil();
  });
  
  // También cerrar al hacer click fuera
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      ocultarErrorSutil();
    }
  });
}

/**
 * Oculta el skeleton de error sutil
 */
export function ocultarErrorSutil() {
  const overlay = document.getElementById('skeleton-error-sutil-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    setTimeout(() => overlay.remove(), 300);
  }
}

// ========================================
// 🎨 VARIANTES PREDEFINIDAS
// ========================================

/**
 * Error de autenticación
 */
export function mostrarErrorAuth() {
  mostrarErrorSutil({
    title: 'Error de autenticación',
    message: 'Email o contraseña incorrectos. Por favor, verifica tus credenciales e inténtalo de nuevo.',
    buttonText: 'Reintentar'
  });
}

/**
 * Error de conexión
 */
export function mostrarErrorConexion() {
  mostrarErrorSutil({
    title: 'Error de conexión',
    message: 'No se pudo conectar con el servidor. Verifica tu conexión a internet e inténtalo de nuevo.',
    buttonText: 'Reintentar'
  });
}

/**
 * Error genérico
 */
export function mostrarErrorGenerico(mensaje = 'Ha ocurrido un error inesperado') {
  mostrarErrorSutil({
    title: 'Error',
    message: mensaje,
    buttonText: 'Aceptar'
  });
}
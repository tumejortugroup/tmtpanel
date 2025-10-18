// skeletonSpinner.js
// Skeleton loader con spinner dorado giratorio

// ========================================
// 🎨 ESTILOS DEL SKELETON SPINNER
// ========================================

function inyectarEstilos() {
  if (document.getElementById('skeleton-spinner-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'skeleton-spinner-styles';
  style.textContent = `
    #skeleton-spinner-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    #skeleton-spinner-overlay.active {
      opacity: 1;
    }
    
    .skeleton-spinner-container {
      background: white;
      border-radius: 16px;
      padding: 40px;
      max-width: 400px;
      width: 90%;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      text-align: center;
      animation: slideUp 0.4s ease;
    }
    
    @keyframes slideUp {
      from {
        transform: translateY(30px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    
    .skeleton-spinner {
      width: 60px;
      height: 60px;
      margin: 0 auto 24px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #D4AF37;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .skeleton-spinner-title {
      margin: 0 0 8px 0;
      color: #1a1a1a;
      font-size: 20px;
      font-weight: 600;
    }
    
    .skeleton-spinner-subtitle {
      color: #666;
      font-size: 14px;
      margin: 0;
      line-height: 1.5;
    }
    
    .skeleton-spinner-dots::after {
      content: '';
      animation: dots 1.5s steps(4, end) infinite;
    }
    
    @keyframes dots {
      0%, 20% { content: ''; }
      40% { content: '.'; }
      60% { content: '..'; }
      80%, 100% { content: '...'; }
    }
  `;
  
  document.head.appendChild(style);
}

// ========================================
// 🎭 FUNCIONES PÚBLICAS
// ========================================

/**
 * Muestra el skeleton spinner
 * @param {Object} options - Opciones de configuración
 * @param {string} options.title - Título (default: "Procesando")
 * @param {string} options.subtitle - Subtítulo (default: "Por favor espere...")
 */
export function mostrarSkeletonSpinner(options = {}) {
  const {
    title = 'Procesando',
    subtitle = 'Por favor espere...'
  } = options;
  
  // Inyectar estilos si no existen
  inyectarEstilos();
  
  // Evitar duplicados
  if (document.getElementById('skeleton-spinner-overlay')) {
    return;
  }
  
  // Crear overlay
  const overlay = document.createElement('div');
  overlay.id = 'skeleton-spinner-overlay';
  overlay.innerHTML = `
    <div class="skeleton-spinner-container">
      <div class="skeleton-spinner"></div>
      <h3 class="skeleton-spinner-title">${title}</h3>
      <p class="skeleton-spinner-subtitle skeleton-spinner-dots">${subtitle}</p>
    </div>
  `;
  
  document.body.appendChild(overlay);
  
  // Forzar reflow para activar animación
  overlay.offsetHeight;
  overlay.classList.add('active');
}

/**
 * Oculta el skeleton spinner
 */
export function ocultarSkeletonSpinner() {
  const overlay = document.getElementById('skeleton-spinner-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    setTimeout(() => overlay.remove(), 300);
  }
}

/**
 * Wrapper para ejecutar una función asíncrona con skeleton spinner
 * @param {Function} asyncFn - Función asíncrona a ejecutar
 * @param {Object} options - Opciones para el skeleton
 * @returns {Promise} Resultado de la función asíncrona
 */
export async function conSkeletonSpinner(asyncFn, options = {}) {
  mostrarSkeletonSpinner(options);
  try {
    const resultado = await asyncFn();
    ocultarSkeletonSpinner();
    return resultado;
  } catch (error) {
    ocultarSkeletonSpinner();
    throw error;
  }
}

// ========================================
// 🎨 VARIANTES PREDEFINIDAS
// ========================================

/**
 * Skeleton para guardar
 */
export function mostrarSkeletonGuardando() {
  mostrarSkeletonSpinner({
    title: 'Guardando',
    subtitle: 'Guardando los cambios...'
  });
}

/**
 * Skeleton para cargar
 */
export function mostrarSkeletonCargando() {
  mostrarSkeletonSpinner({
    title: 'Cargando',
    subtitle: 'Obteniendo información...'
  });
}

/**
 * Skeleton para eliminar
 */
export function mostrarSkeletonEliminando() {
  mostrarSkeletonSpinner({
    title: 'Eliminando',
    subtitle: 'Eliminando registro...'
  });
}

/**
 * Skeleton para actualizar
 */
export function mostrarSkeletonActualizando() {
  mostrarSkeletonSpinner({
    title: 'Actualizando',
    subtitle: 'Actualizando datos...'
  });
}
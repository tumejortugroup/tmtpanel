export function mostrarConfirmacionGuardado(options = {}) {
  const {
    title = 'Realizar cambios',
    message = '¿Estás seguro de realizar los cambios?',
    confirmText = 'Guardar',
    cancelText = 'Cancelar'
  } = options;
  
  return new Promise((resolve) => {
    // Inyectar estilos
    inyectarEstilosGuardado();
    
    // Evitar duplicados
    if (document.getElementById('save-overlay')) {
      document.getElementById('save-overlay').remove();
    }
    
    // Crear overlay de confirmación
    const overlay = document.createElement('div');
    overlay.id = 'save-overlay';
    overlay.innerHTML = `
      <div class="save-container" id="save-container">
        <!-- PANTALLA DE CONFIRMACIÓN -->
        <div class="confirm-screen" id="confirm-screen">
          <div class="confirm-header">
            <div class="confirm-icon">
              <i class="bi bi-question-circle"></i>
            </div>
            <h3>${title}</h3>
            <p class="confirm-message">${message}</p>
          </div>
          
          <div class="confirm-footer">
            <button class="save-btn save-btn-cancel" id="save-cancel">
              <i class="bi bi-x-lg"></i> ${cancelText}
            </button>
            <button class="save-btn save-btn-primary" id="save-confirm">
              <i class="bi bi-check-lg"></i> ${confirmText}
            </button>
          </div>
        </div>

        <!-- PANTALLA DE PROGRESO -->
        <div class="progress-screen" id="progress-screen" style="display: none;">
          <div class="progress-header">
            <div class="progress-icon">
              <div class="spinner"></div>
            </div>
            <h3>Realizando cambios ..</h3>
            <p class="progress-message">Por favor espera mientras se realizan los cambios</p>
          </div>
          
          <div class="progress-bar-container">
            <div class="progress-bar" id="progress-bar">
              <div class="progress-fill" id="progress-fill"></div>
            </div>
            <div class="progress-text" id="progress-text">0%</div>
          </div>
        </div>

        <!-- PANTALLA DE ÉXITO -->
        <div class="success-screen" id="success-screen" style="display: none;">
          <div class="success-header">
            <div class="success-icon">
              <i class="bi bi-check-circle"></i>
            </div>
            <h3>¡Cambio realizado!</h3>
            <p class="success-message">Los cambios se han guardado correctamente</p>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Activar animación
    overlay.offsetHeight;
    overlay.classList.add('active');
    
    // Event listeners para confirmación
    const btnCancel = document.getElementById('save-cancel');
    const btnConfirm = document.getElementById('save-confirm');
    
    const cerrarModal = (resultado) => {
      overlay.classList.remove('active');
      setTimeout(() => {
        overlay.remove();
        resolve(resultado);
      }, 300);
    };
    
    btnCancel.addEventListener('click', () => cerrarModal(false));
    btnConfirm.addEventListener('click', () => {
      // Cambiar a pantalla de progreso
      document.getElementById('confirm-screen').style.display = 'none';
      document.getElementById('progress-screen').style.display = 'block';
      
      resolve({
        confirmed: true,
        progressController: {
          updateProgress: (percentage) => {
            const fill = document.getElementById('progress-fill');
            const text = document.getElementById('progress-text');
            if (fill && text) {
              fill.style.width = `${percentage}%`;
              text.textContent = `${percentage}%`;
            }
          },
          complete: () => {
            // Mostrar pantalla de éxito
            document.getElementById('progress-screen').style.display = 'none';
            document.getElementById('success-screen').style.display = 'block';
            
            // Auto-cerrar después de 2 segundos
            setTimeout(() => {
              cerrarModal(true);
            }, 2000);
          },
          close: () => cerrarModal(true)
        }
      });
    });
    
    // Cerrar con ESC (solo en confirmación)
    const handleEsc = (e) => {
      if (e.key === 'Escape' && document.getElementById('confirm-screen').style.display !== 'none') {
        cerrarModal(false);
        document.removeEventListener('keydown', handleEsc);
      }
    };
    document.addEventListener('keydown', handleEsc);
    
    // Cerrar al hacer click fuera (solo en confirmación)
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay && document.getElementById('confirm-screen').style.display !== 'none') {
        cerrarModal(false);
      }
    });
  });
}

function inyectarEstilosGuardado() {
  if (document.getElementById('save-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'save-styles';
  style.textContent = `
    #save-overlay {
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
    
    #save-overlay.active {
      opacity: 1;
    }
    
    .save-container {
      background: white;
      border-radius: 20px;
      padding: 40px;
      max-width: 480px;
      width: 90%;
      box-shadow: 0 25px 80px rgba(0, 0, 0, 0.4);
      animation: slideUp 0.4s ease;
    }
    
    @keyframes slideUp {
      from {
        transform: translateY(40px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    
    /* === CONFIRMACIÓN === */
    .confirm-header {
      text-align: center;
      margin-bottom: 32px;
    }
    
    .confirm-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 20px;
      background: linear-gradient(135deg, #acea66ff 0%, #78da40ff 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 25px rgba(63, 236, 40, 0.3);
    }
    
    .confirm-icon i {
      font-size: 40px;
      color: white;
    }
    
    .confirm-header h3 {
      margin: 0 0 16px 0;
      color: #1a1a1a;
      font-size: 24px;
      font-weight: 600;
    }
    
    .confirm-message {
      color: #666;
      font-size: 16px;
      margin: 0;
      line-height: 1.5;
    }
    
    .confirm-footer {
      display: flex;
      gap: 16px;
      margin-top: 32px;
    }
    
    .save-btn {
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
    
    .save-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }
    
    .save-btn:active {
      transform: translateY(0);
    }
    
    .save-btn-cancel {
      background: #f1f3f5;
      color: #495057;
    }
    
    .save-btn-cancel:hover {
      background: #e9ecef;
    }
    
    .save-btn-primary {
      background: linear-gradient(135deg, #92721b 0%, #d2a528 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }
    
    .save-btn-primary:hover {
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
    }
    
    /* === PROGRESO === */
    .progress-header {
      text-align: center;
      margin-bottom: 32px;
    }
    
    .progress-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 20px;
      background: linear-gradient(135deg, #92721b 0%, #d2a528 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    }
    
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid rgba(255, 255, 255, 0.3);
      border-top: 4px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .progress-header h3 {
      margin: 0 0 16px 0;
      color: #1a1a1a;
      font-size: 24px;
      font-weight: 600;
    }
    
    .progress-message {
      color: #666;
      font-size: 16px;
      margin: 0;
      line-height: 1.5;
    }
    
    .progress-bar-container {
      margin-top: 32px;
    }
    
    .progress-bar {
      width: 100%;
      height: 12px;
      background: #f1f3f5;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 16px;
    }
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(135deg,  #92721b 0%, #d2a528 100%);
      border-radius: 8px;
      transition: width 0.3s ease;
      width: 0%;
    }
    
    .progress-text {
      text-align: center;
      font-size: 18px;
      font-weight: 600;
      color: #667eea;
    }
    
    /* === ÉXITO === */
    .success-header {
      text-align: center;
    }
    
    .success-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 20px;
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 25px rgba(40, 167, 69, 0.4);
      animation: successPulse 0.6s ease;
    }
    
    @keyframes successPulse {
      0% {
        transform: scale(0.8);
        opacity: 0;
      }
      50% {
        transform: scale(1.1);
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }
    
    .success-icon i {
      font-size: 40px;
      color: white;
    }
    
    .success-header h3 {
      margin: 0 0 16px 0;
      color: #1a1a1a;
      font-size: 24px;
      font-weight: 600;
    }
    
    .success-message {
      color: #666;
      font-size: 16px;
      margin: 0;
      line-height: 1.5;
    }
  `;
  
  document.head.appendChild(style);
}
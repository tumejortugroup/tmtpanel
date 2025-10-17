import { crearComidas } from './crearComida.js';
import { asociarComidasADieta } from './comidaDieta.js';

import { mostrarErrorGuardado } from "/src/skeleton/skeletonError.js";// Ajusta la ruta

export async function guardarDietaCompleta() {
  try {
    const response = await crearComidas();

    if (!response?.success || !Array.isArray(response.data)) {
      // Mostrar skeleton de error específico
      const result = await mostrarErrorGuardado({
        title: 'Error al crear comidas',
        message: 'No se pudieron crear las comidas en el servidor. Verifique su conexión e inténtelo de nuevo.',
        errorDetails: `Respuesta del servidor: ${JSON.stringify(response)}`,
        primaryButtonText: 'Reintentar',
        secondaryButtonText: 'Cancelar'
      });
      
      if (result.retry) {
        // Reintentar la función completa
        return await guardarDietaCompleta();
      } else {
        // Usuario canceló
        throw new Error('Proceso cancelado por el usuario');
      }
    }

    const idsComidas = response.data
      .map(c => c?.id_comida)
      .filter(id => !!id)
      .map(id => ({ id_comida: id })); 

    if (!idsComidas.length) {
      // Mostrar skeleton de error para datos inválidos
      const result = await mostrarErrorGuardado({
        title: 'Datos de comidas inválidos',
        message: 'Los datos de las comidas creadas no son válidos. Por favor, revise la información ingresada en las tablas.',
        errorDetails: `Datos recibidos: ${JSON.stringify(response.data)}\nIDs extraídos: ${JSON.stringify(idsComidas)}`,
        primaryButtonText: 'Revisar y reintentar',
        secondaryButtonText: 'Cancelar'
      });
      
      if (result.retry) {
        // El usuario debe revisar los datos, pero podemos reintentar
        return await guardarDietaCompleta();
      } else {
        throw new Error('Proceso cancelado - datos inválidos');
      }
    }

    await asociarComidasADieta(idsComidas);
    
    // Si llegamos aquí, todo salió bien
    return { success: true };
    
  } catch (error) {
    console.error("Error en guardarDietaCompleta:", error);
    
    // Si el error no fue manejado arriba (ej: error en asociarComidasADieta)
    if (!error.message.includes('Proceso cancelado')) {
      const result = await mostrarErrorGuardado({
        title: 'Error inesperado',
        message: 'Ha ocurrido un error inesperado durante el guardado de la dieta.',
        errorDetails: `Error: ${error.message}\n\nStack trace:\n${error.stack}`,
        primaryButtonText: 'Reintentar',
        secondaryButtonText: 'Cancelar'
      });
      
      if (result.retry) {
        return await guardarDietaCompleta();
      }
    }
    
    // Re-lanzar el error para que lo sepa el nivel superior
    throw error;
  }
}
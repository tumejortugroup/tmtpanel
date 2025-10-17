import {
  obtenerAlimentosDisponibles,
  filtrarAlimentosPorCategoria,
  generarOpcionesAlimentos,
  obtenerMaxEquivalentes,
  generarTablaComida,
  capitalizar
} from './helpers.js';

export async function renderDieta({ data, comidas, isPlantillaMode = false, idDietaDestino, idDietaPlantilla }) {
  try {
    console.log('Iniciando renderizado de dieta...');
    console.log('Modo plantilla:', isPlantillaMode);
    console.log('ID destino:', idDietaDestino);
    console.log('ID plantilla:', idDietaPlantilla);
    
    // Rellenar nombre y descripción (siempre de la dieta destino)
    const nombreInput = document.getElementById("nombre-dieta");
    const descripcionTextarea = document.getElementById("descripcion-dieta");

    if (data && data.length > 0) {
      if (nombreInput) {
        nombreInput.value = data[0].nombre_dieta || "";
      }
      if (descripcionTextarea) {
        descripcionTextarea.value = data[0].descripcion || "";
      }
    }

    // Obtener alimentos disponibles
    let alimentos = obtenerAlimentosDisponibles();
   
    if (alimentos.length === 0) {
      console.warn('No hay alimentos. Cargando...');
      const { renderSelectAlimentos } = await import('/src/dietas/modules/wizard/ui/renderAlimentos.js');
      await renderSelectAlimentos("select-alimentos");
      alimentos = obtenerAlimentosDisponibles();
    }

    const numEquivalentes = obtenerMaxEquivalentes(comidas);
    console.log(`Maximo de equivalentes: ${numEquivalentes}`);
    
    const contenedor = document.getElementById("tabla-container");
    
    if (!contenedor) {
      console.error('No se encontro "tabla-container"');
      return;
    }

    // Buscar tabla de suplementación existente
    const tablaSuplementacion = contenedor.querySelector('#Suplementacion');

    // Limpiar solo las tablas dinámicas (NO la de suplementación)
    const tablasDinamicas = contenedor.querySelectorAll('.table-dieta');
    tablasDinamicas.forEach(tabla => tabla.remove());

    // Variable temporal para guardar la nota de suplementación
    let notaSupplementacion = '';

    // Generar tablas usando los datos de comidas (que pueden ser de la plantilla)
    Object.values(comidas).forEach(comida => {
      const tipoComidaCapitalizado = capitalizar(comida.tipo_comida);
      
      // Si es suplementación, GUARDAR la nota para después
      if (tipoComidaCapitalizado === 'Suplementacion') {
        console.log('Detectada suplementacion...');
        console.log('Nota recibida:', comida.notas);
        notaSupplementacion = comida.notas || '';
        console.log('Nota guardada:', notaSupplementacion);
        return;
      }
      
      // Para el resto de comidas, crear tabla normal
      const tablaHTML = generarTablaComida(comida, numEquivalentes, alimentos);
      
      // Insertar ANTES de suplementación
      if (tablaSuplementacion) {
        tablaSuplementacion.insertAdjacentHTML('beforebegin', tablaHTML);
      } else {
        contenedor.insertAdjacentHTML('beforeend', tablaHTML);
      }
      
      console.log(`Tabla creada: ${tipoComidaCapitalizado}${isPlantillaMode ? ' (desde plantilla)' : ''}`);
    });

    // Rellenar suplementación
    console.log('Intentando rellenar suplementacion...');
    console.log('tablaSuplementacion existe:', !!tablaSuplementacion);
    console.log('notaSupplementacion:', `"${notaSupplementacion}"`);
    console.log('notaSupplementacion.trim():', `"${notaSupplementacion.trim()}"`);
    console.log('Nota NO vacia?:', notaSupplementacion.trim() !== '');
    
    if (tablaSuplementacion) {
      const textarea = tablaSuplementacion.querySelector('textarea');
      console.log('Textarea encontrado:', !!textarea);
      
      if (textarea) {
        textarea.value = notaSupplementacion;
        console.log('Suplementacion cargada:', notaSupplementacion);
      } else {
        console.error('No se encontro el textarea dentro de la tabla');
      }
    } else {
      console.error('No se encontro la tabla de suplementacion');
    }

    // Listener para cambios de categoría
    contenedor.addEventListener('change', (e) => {
      if (e.target.name === 'select-categoria') {
        const fila = e.target.closest('tr');
        const selectAlimentos = fila.querySelector('select[name="select-alimentos"]');
        const nuevaCategoria = e.target.value;
        const alimentosCategoria = filtrarAlimentosPorCategoria(alimentos, nuevaCategoria);
        selectAlimentos.innerHTML = generarOpcionesAlimentos(alimentosCategoria);
      }
    });

    // Agregar recálculo de equivalencias
    await agregarCalculoEquivalencias(contenedor);

    console.log('Renderizado completado');

  } catch (error) {
    console.error('Error en renderDieta:', error);
  }
}

// Función para agregar cálculo automático de equivalencias
async function agregarCalculoEquivalencias(contenedor) {
  const { getEquivalencia } = await import('/src/dietas/modules/wizard/fetch/getEquivalencias.js');
  
  const filas = contenedor.querySelectorAll(".table-dieta tbody tr:not(:last-child)"); 
  
  filas.forEach(fila => {
    const selectMacro = fila.querySelector("td select[name='select-categoria']");
    const inputCantidad = fila.querySelector(".input-cantidad");
    if (!selectMacro || !inputCantidad) return;

    const selects = fila.querySelectorAll("select[name='select-alimentos']");
    if (selects.length < 2) return;

    const selectPrincipal = selects[0];
    const equivalentes = [];

    for (let i = 1; i < selects.length; i++) {
      const td = selects[i].closest("td").nextElementSibling;
      if (td) {
        equivalentes.push({ select: selects[i], td });
      }
    }

    async function calcular() {
      const idPrincipal = selectPrincipal.value;
      const cantidad = parseFloat(inputCantidad.value);
      const categoria = selectMacro.value?.toLowerCase();

      if (!idPrincipal || isNaN(cantidad) || !categoria) {
        equivalentes.forEach(eq => {
          if (eq.td.tagName === 'TD') {
            eq.td.textContent = "";
          }
        });
        return;
      }

      equivalentes.forEach(eq => {
        if (eq.td.tagName === 'TD') {
          eq.td.textContent = "";
        }
      });

      for (const { select, td } of equivalentes) {
        if (!select.value || !td) continue;
        
        try {
          const eqVal = await getEquivalencia(idPrincipal, select.value, categoria, cantidad);
          if (td.tagName === 'TD') {
            td.textContent = eqVal !== null ? `${Math.ceil(eqVal)}` : "-";
          }
        } catch (error) {
          console.error('Error calculando equivalencia:', error);
          if (td.tagName === 'TD') {
            td.textContent = "-";
          }
        }
      }
    }

    [selectMacro, selectPrincipal, inputCantidad].forEach(el => {
      if (el) {
        el.addEventListener("change", calcular);
      }
    });
    
    if (inputCantidad) {
      inputCantidad.addEventListener("input", calcular);
    }

    equivalentes.forEach(({ select }) => {
      if (select) {
        select.addEventListener("change", calcular);
      }
    });
  });
}
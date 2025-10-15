import {
  obtenerAlimentosDisponibles,
  filtrarAlimentosPorCategoria,
  generarOpcionesAlimentos,
  obtenerMaxEquivalentes,
  generarTablaComida
} from './helpers.js';

export async function renderDieta({ data, comidas }) {
  try {
    // Rellenar nombre y descripción
    const nombreInput = document.getElementById("nombre-dieta");
    const descripcionTextarea = document.getElementById("descripcion-dieta");

    if (data && data.length > 0) {
      if (nombreInput) nombreInput.value = data[0].nombre_dieta || "";
      if (descripcionTextarea) descripcionTextarea.value = data[0].descripcion || "";
    }

    // Obtener alimentos disponibles
    let alimentos = obtenerAlimentosDisponibles();
   
    
    if (alimentos.length === 0) {
      console.warn('No hay alimentos. Intentando cargar...');
      const { renderSelectAlimentos } = await import('/src/dietas/modules/wizard/ui/renderAlimentos.js');
      await renderSelectAlimentos("select-alimentos");
      alimentos = obtenerAlimentosDisponibles();

    }

    const numEquivalentes = obtenerMaxEquivalentes(comidas);
    
    const contenedor = document.getElementById("tabla-container");
    
    if (!contenedor) {
      console.error('Error: El elemento "tabla-container" no existe');
      return;
    }

    // Generar tablas
    contenedor.innerHTML = '';
    Object.values(comidas).forEach(comida => {
      const tablaHTML = generarTablaComida(comida, numEquivalentes, alimentos);
      contenedor.insertAdjacentHTML('beforeend', tablaHTML);
    });

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

    // NUEVA FUNCIONALIDAD: Agregar recálculo de equivalencias
    await agregarCalculoEquivalencias(contenedor);



  } catch (error) {
    console.error('Error en renderDieta:', error);
  }
}

// 🔧 Nueva función para agregar cálculo automático de equivalencias
async function agregarCalculoEquivalencias(contenedor) {
  // Importar las funciones necesarias
  const { getEquivalencia } = await import('/src/dietas/modules/wizard/fetch/getEquivalencias.js');
  

  const filas = contenedor.querySelectorAll(".table tbody tr:not(:last-child)"); 
  
  filas.forEach(fila => {
    const selectMacro = fila.querySelector("td select[name='select-categoria']");
    const inputCantidad = fila.querySelector(".input-cantidad");
    if (!selectMacro || !inputCantidad) return;


    const selects = fila.querySelectorAll("select[name='select-alimentos']");
    if (selects.length < 2) return;

    const selectPrincipal = selects[0];
    const equivalentes = [];

    // Recopilar pares de (select, td) para equivalencias
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
        // Limpiar equivalencias si no hay datos válidos
        equivalentes.forEach(eq => {
          if (eq.td.tagName === 'TD') {
            eq.td.textContent = "";
          }
        });
        return;
      }

      // Limpiar todas las celdas de cantidad
      equivalentes.forEach(eq => {
        if (eq.td.tagName === 'TD') {
          eq.td.textContent = "";
        }
      });

      // Calcular equivalencias para cada select que tenga valor
      for (const { select, td } of equivalentes) {
        if (!select.value || !td) continue;
        
        try {
          const eqVal = await getEquivalencia(idPrincipal, select.value, categoria, cantidad);
          if (td.tagName === 'TD') {
            // ⬇️ CAMBIO: Redondear hacia arriba sin decimales
            if (eqVal !== null) {
              const valorRedondeado = Math.ceil(eqVal);
              td.textContent = `${valorRedondeado}`;
            } else {
              td.textContent = "-";
            }
          }
        } catch (error) {
          console.error('Error calculando equivalencia:', error);
          if (td.tagName === 'TD') {
            td.textContent = "-";
          }
        }
      }
    }

    // Agregar eventos a todos los elementos relevantes
    [selectMacro, selectPrincipal, inputCantidad].forEach(el => {
      if (el) {
        el.addEventListener("change", calcular);
      }
    });
    
    // Agregar evento input para cantidad
    if (inputCantidad) {
      inputCantidad.addEventListener("input", calcular);
    }

    // Agregar eventos a selects de equivalencias
    equivalentes.forEach(({ select }) => {
      if (select) {
        select.addEventListener("change", calcular);
      }
    });
  });
}
import {
  obtenerAlimentosDisponibles,
  filtrarAlimentosPorCategoria,
  generarOpcionesAlimentos,
  obtenerMaxEquivalentes,
  generarTablaComida
} from './helpers.js';

export async function renderPlantilla({ data, comidas }) {
  try {
    // Rellenar nombre (las plantillas solo tienen nombre, no descripción)
    const nombreInput = document.getElementById("nombre-dieta");

    if (data && data.length > 0) {
      if (nombreInput) nombreInput.value = data[0].nombre_plantilla || "";
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

    // Agregar recálculo de equivalencias
    await agregarCalculoEquivalencias(contenedor);

  } catch (error) {
    console.error('Error en renderPlantilla:', error);
  }
}

// Función para agregar cálculo automático de equivalencias
async function agregarCalculoEquivalencias(contenedor) {
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
            td.textContent = eqVal !== null ? `${eqVal}` : "-";
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
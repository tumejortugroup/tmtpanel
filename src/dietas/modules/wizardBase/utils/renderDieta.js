import {
  obtenerAlimentosDisponibles,
  filtrarAlimentosPorCategoria,
  generarOpcionesAlimentos,
  obtenerMaxEquivalentes,
  generarTablaComida,
  capitalizar
} from './helpers.js';

export async function renderDieta({ data, comidas }) {
  try {
    console.log("🎨 Renderizando dieta UPDATE...");

    const contenedor = document.getElementById("tabla-container");
    if (!contenedor) return;

    // ------------------------------
    //  ALIMENTOS DEL SISTEMA
    // ------------------------------
    let alimentos = obtenerAlimentosDisponibles();

    // 🛠️ FIX IMPORTANTE: cargar alimentos si aún no hay cache
    if (alimentos.length === 0) {
      console.warn("⚠ No hay alimentos en memoria → cargando desde backend...");

      const { getAlimentos } = await import("/src/dietas/modules/wizardBase/fetch/getAlimentos.js");
      window.__alimentosCache = await getAlimentos();

      alimentos = window.__alimentosCache;
      console.log("📦 Alimentos cargados:", alimentos.length);
    }

    // Calcular equivalentes
    const numEquivalentes = obtenerMaxEquivalentes(comidas);

    // Tabla de suplementación fija
    const tablaSuplementacion = contenedor.querySelector("#Suplementacion");

    // Limpiar tablas anteriores
    contenedor.querySelectorAll(".table-dieta").forEach(t => t.remove());

    let notaSupplementacion = "";

    // ------------------------------
    //  CREAR TABLAS
    // ------------------------------
    for (const comida of Object.values(comidas)) {

      const tipo = capitalizar(comida.tipo_comida);

      if (tipo === "Suplementacion") {
        notaSupplementacion = comida.notas || "";
        continue;
      }

      const html = generarTablaComida(comida, numEquivalentes, alimentos);

      if (tablaSuplementacion) {
        tablaSuplementacion.insertAdjacentHTML("beforebegin", html);
      } else {
        contenedor.insertAdjacentHTML("beforeend", html);
      }

      const tabla = contenedor.querySelector(".table-dieta:last-of-type");

      if (tabla) {
        const { renderSelectAlimentos } = await import("/src/dietas/modules/wizardBase/ui/renderAlimentos.js");

        tabla.querySelectorAll("tbody tr").forEach(fila => {
          const catSel = fila.querySelector("select[name='select-categoria']");
          const alSel = fila.querySelector("select[name='select-alimentos']");

          if (!catSel || !alSel) return;

          const alimentoActual = comida.alimentos.find(
            a => capitalizar(a.categoria) === catSel.value.trim()
          );

          renderSelectAlimentos(alSel, catSel.value.trim(), alimentoActual);
        });
      }
    }

    // ------------------------------
    //  SUPLEMENTACIÓN
    // ------------------------------
    if (tablaSuplementacion) {
      const textarea = tablaSuplementacion.querySelector("textarea");
      if (textarea) textarea.value = notaSupplementacion;
    }

    // ------------------------------
    //  CAMBIO DINÁMICO DE CATEGORÍA
    // ------------------------------
    contenedor.addEventListener("change", e => {
      if (e.target.name === "select-categoria") {
        const fila = e.target.closest("tr");
        const selectAlimentos = fila.querySelector("select[name='select-alimentos']");

        const cat = e.target.value;
        const filtered = filtrarAlimentosPorCategoria(alimentos, cat);

        selectAlimentos.innerHTML = generarOpcionesAlimentos(filtered);
      }
    });

    console.log("✅ Renderizado completado correctamente");

  } catch (err) {
    console.error("❌ Error en renderDieta:", err);
  }
}

// 🔧 Función para agregar cálculo automático de equivalencias
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
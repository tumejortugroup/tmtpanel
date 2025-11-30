import { renderSelectAlimentos } from '/src/dietas/modules/wizard/ui/renderAlimentos.js';

function obtenerAlimentosDisponibles() {
  return window.__alimentosCache || [];
}

function generarOpcionesAlimentosPlaceholder() {
  return `<option value="">Alimentos</option>`;
}

export function crearTablaVacia() {
  console.log("🏗️ Creando tabla vacía...");

  const button = event.target;
  const btnsDiv = button.closest(".comida-btns");
  if (!btnsDiv) return;

  const contenedorGlobal = document.getElementById("tabla-container");
  if (!contenedorGlobal) {
    console.error("❌ No se encontró tabla-container");
    return;
  }

  const tablas = contenedorGlobal.querySelectorAll("table:not(#Suplementacion)");
  let numEquivalentes = 1;

  if (tablas.length > 0) {
    const primeraFila = tablas[0].querySelector("thead tr:last-child");
    if (primeraFila) {
      const ths = primeraFila.querySelectorAll("th");
      numEquivalentes = Math.floor((ths.length - 3) / 2);
    }
  }

  console.log(`📊 Creando tabla con ${numEquivalentes} equivalentes`);

  const columnasEquivalentes = Array(numEquivalentes).fill(0).map((_, index) => `
    <th>Alimento ${index + 1}</th>
    <th>gr</th>
  `).join('');

  const categorias = ['Proteina', 'Carbohidrato', 'Grasa', 'Fruta', 'Verdura', 'Otros'];

  const filasVacias = categorias.map(cat => `
    <tr>
      <td class="header-dieta px-1 py-0">
        <select class="form-select form-select-sm" name="select-categoria">
          <option value="Proteina" ${cat === 'Proteina' ? 'selected' : ''}>Proteina</option>
          <option value="Grasa" ${cat === 'Grasa' ? 'selected' : ''}>Grasa</option>
          <option value="Carbohidrato" ${cat === 'Carbohidrato' ? 'selected' : ''}>Carbohidrato</option>
          <option value="Fruta" ${cat === 'Fruta' ? 'selected' : ''}>Fruta</option>
          <option value="Verdura" ${cat === 'Verdura' ? 'selected' : ''}>Verdura</option>
          <option value="Otros" ${cat === 'Otros' ? 'selected' : ''}>Otros</option>
        </select>
      </td>
      
      <td class="px-1 py-0">
        <select name="select-alimentos" class="form-select form-select-sm">
          ${generarOpcionesAlimentosPlaceholder()}
        </select>
      </td>

      <td class="px-1 py-0">
        <input class="form-control form-control-sm input-cantidad" type="text" value="">
      </td>

      ${Array(numEquivalentes).fill(0).map(() => `
        <td class="px-1 py-0">
          <select name="select-alimentos" class="form-select form-select-sm">
            ${generarOpcionesAlimentosPlaceholder()}
          </select>
        </td>
        <td class="px-1 py-0"></td>
      `).join('')}
    </tr>
  `).join('');

  const tablaHTML = `
    <table class="table table-striped mb-0 fs-7 table-dieta" role="grid">
      <thead>
        <tr>
          <th colspan="${3 + (numEquivalentes * 2)}">
            <div class="d-flex justify-content-start gap-2 w-25">
              <select class="form-select form-select-sm" name="tipo-comida">
                <option value="Desayuno">Desayuno</option>
                <option value="Almuerzo">Almuerzo</option>
                <option value="Comida">Comida</option>
                <option value="Merienda">Merienda</option>
                <option value="Pre-entreno">Pre-entreno</option>
                <option value="Post-entreno">Post-entreno</option>
                <option value="Cena">Cena</option>
                <option value="Pre-cama">Pre-cama</option>
                <option value="Suplementacion">Suplementacion</option>
              </select>
              <input type="time" class="form-control form-control-sm" value="08:00">
            </div>
          </th>
        </tr>
        <tr>
          <th>MACRO</th>
          <th>Alimento</th>
          <th>gr</th>
          ${columnasEquivalentes}
        </tr>
      </thead>

      <tbody>
        ${filasVacias}

        <tr>
          <td class="header-dieta px-1 py-0">Observaciones</td>
          <td colspan="${2 + (numEquivalentes * 2)}">
            <textarea class="form-control form-control-sm text-dieta"></textarea>
          </td>
        </tr>
      </tbody>
    </table>
  `;

  const temp = document.createElement('div');
  temp.innerHTML = tablaHTML;
  const nuevaTabla = temp.firstElementChild;

  // Insertar tabla
  const tablaSuplementacion = contenedorGlobal.querySelector("#Suplementacion");
  const botonesGlobales = contenedorGlobal.querySelector(".comida-btns");

  if (tablaSuplementacion) {
    contenedorGlobal.insertBefore(nuevaTabla, tablaSuplementacion);
  } else if (botonesGlobales) {
    contenedorGlobal.insertBefore(nuevaTabla, botonesGlobales);
  } else {
    contenedorGlobal.appendChild(nuevaTabla);
  }

  // ✔ FILTRAR SELECTS RECIÉN CREADOS SEGÚN SU CATEGORÍA
  console.log("🔵 Aplicando filtros a selects de nueva tabla...");

  const filas = nuevaTabla.querySelectorAll("tbody tr:not(:last-child)");

  filas.forEach(fila => {
    const selectCategoria = fila.querySelector("select[name='select-categoria']");
    const categoria = selectCategoria?.value?.trim() || null;

    console.log("   ➤ Fila detectada categoría:", categoria);

    const selectsAlimento = fila.querySelectorAll("select[name='select-alimentos']");

    selectsAlimento.forEach(select => {
      // limpiar
      select.innerHTML = '<option value="">Alimentos</option>';
      // rellenar filtrado
      renderSelectAlimentos(select, categoria);
    });

    // listener por si cambia la categoría
    selectCategoria.addEventListener("change", e => {
      const nuevaCat = e.target.value.trim();
      console.log("   🔄 Cambio categoría →", nuevaCat);

      selectsAlimento.forEach(select => {
        select.innerHTML = '<option value="">Alimentos</option>';
        renderSelectAlimentos(select, nuevaCat);
      });
    });
  });

  // Recalcular equivalencias
  agregarCalculoEquivalenciasATabla(nuevaTabla);

  setTimeout(async () => {
    const { configurarListenersParaNuevaTabla } = await import('/src/dietas/modules/update/ui/sumaMacros.js');
    configurarListenersParaNuevaTabla();
  }, 200);

  console.log("✅ Tabla creada correctamente");
}

// ----------------------------
//  CÁLCULO DE EQUIVALENCIAS
// ----------------------------
async function agregarCalculoEquivalenciasATabla(tabla) {
  const { getEquivalencia } = await import('/src/dietas/modules/wizard/fetch/getEquivalencias.js');

  const filas = tabla.querySelectorAll("tbody tr:not(:last-child)");

  filas.forEach(fila => {
    const selectMacro = fila.querySelector("td select[name='select-categoria']");
    const inputCantidad = fila.querySelector(".input-cantidad");
    const selects = fila.querySelectorAll("select[name='select-alimentos']");

    if (!selectMacro || !inputCantidad || selects.length < 1) return;

    const selectPrincipal = selects[0];
    const equivalentes = [];

    for (let i = 1; i < selects.length; i++) {
      const td = selects[i].closest("td").nextElementSibling;
      if (td) equivalentes.push({ select: selects[i], td });
    }

    async function calcular() {
      const idPrincipal = selectPrincipal.value;
      const cantidad = parseFloat(inputCantidad.value);
      const categoria = selectMacro.value?.toLowerCase();

      if (!idPrincipal || isNaN(cantidad) || !categoria) {
        equivalentes.forEach(eq => eq.td.textContent = "");
        return;
      }

      for (const { select, td } of equivalentes) {
        if (!select.value) {
          td.textContent = "";
          continue;
        }

        try {
          const eqVal = await getEquivalencia(idPrincipal, select.value, categoria, cantidad);
          td.textContent = eqVal !== null ? `${Math.ceil(eqVal)}` : "-";
        } catch {
          td.textContent = "-";
        }
      }
    }

    [selectMacro, selectPrincipal, inputCantidad].forEach(el => {
      el?.addEventListener("change", calcular);
    });
    inputCantidad?.addEventListener("input", calcular);

    equivalentes.forEach(({ select }) => {
      select?.addEventListener("change", calcular);
    });
  });
}

export function eliminarUltimaTabla() {
  const button = event.target;
  const btnsDiv = button.closest(".comida-btns");
  if (!btnsDiv) return;

  const contenedorGlobal = document.getElementById("tabla-container");
  if (!contenedorGlobal) return;

  const tablas = contenedorGlobal.querySelectorAll("table");
  const tablasNormales = Array.from(tablas).filter(tabla => tabla.id !== "Suplementacion");

  if (tablasNormales.length <= 1) {
    console.warn("⚠️ No se puede eliminar porque solo queda una tabla de comida.");
    return;
  }

  tablasNormales[tablasNormales.length - 1].remove();

  setTimeout(async () => {
    const { configurarListenersParaNuevaTabla } = await import('/src/dietas/modules/update/ui/sumaMacros.js');
    configurarListenersParaNuevaTabla();
  }, 100);
}

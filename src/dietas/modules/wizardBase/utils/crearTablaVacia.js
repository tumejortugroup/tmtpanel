function generarOpcionesAlimentos(alimentos, alimentoSeleccionado = null) {
  let opciones = '<option value="">Alimentos</option>';
  
  if (!alimentos || alimentos.length === 0) {
    return opciones;
  }
  
  alimentos.forEach(alimento => {
    const id = alimento.id_alimento;
    const nombre = alimento.nombre;
    const selected = alimentoSeleccionado && 
      (id == alimentoSeleccionado.id_alimento) ? 'selected' : '';
    
    opciones += `<option value="${id}" ${selected}>${nombre}</option>`;
  });
  
  return opciones;
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
  
  const alimentos = window.__alimentosCache || [];
  
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

  const opcionesAlimentos = generarOpcionesAlimentos(alimentos);
  
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
        <select name="select-alimentos" class="form-select form-select-sm" data-categoria="${cat}">
          ${opcionesAlimentos}
        </select>
      </td>
      <td class="px-1 py-0">
        <input class="form-control form-control-sm input-cantidad" type="text" value="">
      </td>
      ${Array(numEquivalentes).fill(0).map(() => `
        <td class="px-1 py-0">
          <select name="select-alimentos" class="form-select form-select-sm">
            ${opcionesAlimentos}
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
              <input type="time" class="form-control form-control-sm" name="cantidad-alimentos" value="08:00">
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

  const tablaSuplementacion = contenedorGlobal.querySelector("#Suplementacion");
  const botonesGlobales = contenedorGlobal.querySelector(".comida-btns");
  
  if (tablaSuplementacion) {
    contenedorGlobal.insertBefore(nuevaTabla, tablaSuplementacion);
    console.log("✅ Tabla insertada ANTES de suplementación");
  } else if (botonesGlobales) {
    contenedorGlobal.insertBefore(nuevaTabla, botonesGlobales);
    console.log("✅ Tabla insertada ANTES de botones");
  } else {
    contenedorGlobal.appendChild(nuevaTabla);
    console.log("✅ Tabla añadida al final");
  }

  agregarCalculoEquivalenciasATabla(nuevaTabla);

  setTimeout(async () => {
    const { configurarListenersParaNuevaTabla } = await import('/src/dietas/modules/update/ui/sumaMacros.js');
    configurarListenersParaNuevaTabla();
  }, 200);
}

async function agregarCalculoEquivalenciasATabla(tabla) {
  const { getEquivalencia } = await import('/src/dietas/modules/wizard/fetch/getEquivalencias.js');
  
  const filas = tabla.querySelectorAll("tbody tr:not(:last-child)");
  
  filas.forEach(fila => {
    const selectMacro = fila.querySelector("td select[name='select-categoria']");
    const inputCantidad = fila.querySelector(".input-cantidad");
    if (!selectMacro || !inputCantidad) return;

    const selects = fila.querySelectorAll("select[name='select-alimentos']");
    if (selects.length < 1) return;

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

  console.log(`🗑️ Eliminando tabla. Había ${tablasNormales.length} tablas`);
  tablasNormales[tablasNormales.length - 1].remove();
  
  const tablasRestantes = contenedorGlobal.querySelectorAll("table");
  console.log(`📊 Tablas restantes: ${tablasRestantes.length}`);
  
  setTimeout(async () => {
    const { configurarListenersParaNuevaTabla } = await import('/src/dietas/modules/update/ui/sumaMacros.js');
    configurarListenersParaNuevaTabla();
  }, 100);
}
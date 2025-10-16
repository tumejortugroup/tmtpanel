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

  // CAMBIO: Usar contenedor global desde el inicio
  const contenedorGlobal = document.getElementById("tabla-container");
  if (!contenedorGlobal) {
    console.error("❌ No se encontró tabla-container global");
    return;
  }

  // DIAGNÓSTICO: Verificar estado antes de insertar en contenedor global
  const tablasAntes = contenedorGlobal.querySelectorAll("table");
  console.log("📊 Tablas ANTES de insertar en contenedor global:", tablasAntes.length);
  tablasAntes.forEach((tabla, index) => {
    console.log(`Tabla existente ${index}: ${tabla.className}`);
  });
  
  // Obtener alimentos disponibles
  const alimentos = window.__alimentosCache || [];
  
  // Obtener el número de equivalentes de las tablas existentes
  const tablas = contenedorGlobal.querySelectorAll("table:not(#Suplementacion)");
  let numEquivalentes = 1; // Default mínimo
  
  if (tablas.length > 0) {
    const primeraFila = tablas[0].querySelector("thead tr:last-child");
    if (primeraFila) {
      const ths = primeraFila.querySelectorAll("th");
      numEquivalentes = Math.floor((ths.length - 3) / 2);
    }
  }

  console.log(`📊 Creando tabla con ${numEquivalentes} equivalentes`);

  // Generar opciones de alimentos
  const opcionesAlimentos = generarOpcionesAlimentos(alimentos);
  
  // Generar columnas dinámicas
  const columnasEquivalentes = Array(numEquivalentes).fill(0).map((_, index) => `
    <th>Alimento ${index + 1}</th>
    <th>gr</th>
  `).join('');

  // Categorías
  const categorias = ['Proteina', 'Carbohidrato', 'Grasa', 'Fruta', 'Verdura', 'Otros'];
  
  // Generar filas vacías
  const filasVacias = categorias.map(cat => `
    <tr>
      <td class="header-dieta px-1 py-0">
        <select class="form-select form-select-sm" name="select-categoria">
          <option ${cat === 'Proteina' ? 'selected' : ''}>Proteina</option>
          <option ${cat === 'Grasa' ? 'selected' : ''}>Grasa</option>
          <option ${cat === 'Carbohidrato' ? 'selected' : ''}>Carbohidrato</option>
          <option ${cat === 'Fruta' ? 'selected' : ''}>Fruta</option>
          <option ${cat === 'Verdura' ? 'selected' : ''}>Verdura</option>
          <option ${cat === 'Otros' ? 'selected' : ''}>Otros</option>
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

  // Crear tabla HTML completa
  const tablaHTML = `
    <table class="table table-striped mb-0 fs-7 table-dieta" role="grid">
      <thead>
        <tr>
          <th colspan="${3 + (numEquivalentes * 2)}">
            <div class="d-flex justify-content-start gap-2 w-25">
              <select class="form-select form-select-sm" name="tipo-comida">
                <option>Desayuno</option>
                <option>Almuerzo</option>
                <option>Comida</option>
                <option>Merienda</option>
                <option>Pre-entreno</option>
                <option>Post-entreno</option>
                <option>Cena</option>
                <option>Pre-cama</option>
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

  // Crear elemento temporal
  const temp = document.createElement('div');
  temp.innerHTML = tablaHTML;
  const nuevaTabla = temp.firstElementChild;

  console.log("🔨 Nueva tabla creada:", nuevaTabla.className);

  // CAMBIO: Insertar en el contenedor global
  console.log("🎯 Insertando en contenedor global");

  // Buscar dónde insertar dentro del contenedor global
  const tablaSuplementacion = contenedorGlobal.querySelector("#Suplementacion");
  const botonesGlobales = contenedorGlobal.querySelector(".comida-btns");
  
  if (tablaSuplementacion) {
    contenedorGlobal.insertBefore(nuevaTabla, tablaSuplementacion);
    console.log("✅ Tabla insertada ANTES de suplementación en contenedor global");
  } else if (botonesGlobales) {
    contenedorGlobal.insertBefore(nuevaTabla, botonesGlobales);
    console.log("✅ Tabla insertada ANTES de botones en contenedor global");
  } else {
    contenedorGlobal.appendChild(nuevaTabla);
    console.log("✅ Tabla añadida al final del contenedor global");
  }

  // DIAGNÓSTICO: Verificar estado después de insertar
  const tablasDespues = contenedorGlobal.querySelectorAll("table");
  console.log("📊 Tablas DESPUÉS de insertar en contenedor global:", tablasDespues.length);
  tablasDespues.forEach((tabla, index) => {
    console.log(`Tabla ${index}: ${tabla.className}`);
  });

  console.log("✅ Tabla insertada en el DOM");

  // Agregar funcionalidad de cálculo de equivalencias
  agregarCalculoEquivalenciasATabla(nuevaTabla);

  // Configurar listeners para suma de macros con delay
  setTimeout(async () => {
    console.log("🔄 Configurando listeners después de crear tabla...");
    
    const tablasFinales = contenedorGlobal.querySelectorAll("table");
    const tablasConClase = contenedorGlobal.querySelectorAll(".table-dieta");
    
    console.log("🔍 Verificación post-creación:");
    console.log(`Total tablas: ${tablasFinales.length}`);
    console.log(`Tablas con .table-dieta: ${tablasConClase.length}`);
    
    tablasFinales.forEach((tabla, index) => {
      console.log(`Tabla ${index} en contenedor: ${tabla.className}`);
    });
    
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
  
  // Verificar después de eliminar
  const tablasRestantes = contenedorGlobal.querySelectorAll("table");
  console.log(`📊 Tablas restantes: ${tablasRestantes.length}`);
  
  // Recalcular después de eliminar
  setTimeout(async () => {
    const { configurarListenersParaNuevaTabla } = await import('/src/dietas/modules/update/ui/sumaMacros.js');
    configurarListenersParaNuevaTabla();
  }, 100);
}
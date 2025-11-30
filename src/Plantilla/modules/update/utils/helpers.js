// ============================================================
//  helpers.js — VERSIÓN COMPLETA Y CORREGIDA (UPDATE)
// ============================================================

// ------------------------------------------------------------
// 🔧 Capitalizar
// ------------------------------------------------------------
export function capitalizar(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// ------------------------------------------------------------
// 🔧 Obtener alimentos desde el caché de renderAlimentos.js
// ------------------------------------------------------------
export function obtenerAlimentosDisponibles() {
  return window.__alimentosCache || [];
}

// ------------------------------------------------------------
// 🔧 Filtrar alimentos por categoría
// ------------------------------------------------------------
export function filtrarAlimentosPorCategoria(alimentos, categoria) {
  if (!categoria || !alimentos) return alimentos || [];

  const categoriaLower = categoria.toLowerCase();

  return alimentos.filter(a =>
    a.categoria?.toLowerCase() === categoriaLower
  );
}

// ------------------------------------------------------------
// 🔧 Generar opciones <option> de un <select>
//  ⭐ Acepta ID, objeto completo o equivalente
// ------------------------------------------------------------
export function generarOpcionesAlimentos(alimentos, alimentoSeleccionado = null) {
  let opciones = '<option value="">Alimentos</option>';

  if (!alimentos || alimentos.length === 0) return opciones;

  // Detectar ID correcto
  let idSeleccionado = null;

  if (typeof alimentoSeleccionado === "number") {
    idSeleccionado = alimentoSeleccionado;
  }
  else if (alimentoSeleccionado && typeof alimentoSeleccionado === "object") {

    if (alimentoSeleccionado.id_alimento) {
      idSeleccionado = alimentoSeleccionado.id_alimento;
    }
    else if (alimentoSeleccionado.id_alimento_equivalente) {
      idSeleccionado = alimentoSeleccionado.id_alimento_equivalente;
    }
  }

  alimentos.forEach(a => {
    const selected = (a.id_alimento == idSeleccionado) ? "selected" : "";
    opciones += `<option value="${a.id_alimento}" ${selected}>${a.nombre}</option>`;
  });

  return opciones;
}

// ------------------------------------------------------------
// 🔧 Obtener número máximo de equivalentes
// ------------------------------------------------------------
export function obtenerMaxEquivalentes(comidas) {
  let max = 0;

  Object.values(comidas).forEach(comida => {
    if (capitalizar(comida.tipo_comida) === "Suplementacion") return;

    comida.alimentos.forEach(al => {
      let count = 0;

      // Base
      if (al.id_alimento_equivalente) count++;

      // Equivalentes adicionales (1,3,4,5,6,7,8,9)
      [1, 3, 4, 5, 6, 7, 8, 9].forEach(i => {
        if (al[`id_alimento_equivalente${i}`]) count++;
      });

      if (count > max) max = count;
    });
  });

  console.log(`📊 MÁXIMO DE EQUIVALENTES: ${max}`);
  return max;
}

// ------------------------------------------------------------
// 🔧 Generar columnas del thead según equivalentes
// ------------------------------------------------------------
export function generarColumnasTabla(numEquivalentes) {
  return `
    <tr>
      <th>MACRO</th>
      <th>Alimento</th>
      <th>gr</th>
      ${Array(numEquivalentes)
        .fill(0)
        .map((_, index) => `
          <th>Alimento ${index + 1}</th>
          <th>gr</th>
        `)
        .join('')}
    </tr>
  `;
}

// ------------------------------------------------------------
// 🔧 Generar celdas de equivalentes para UNA FILA
// ------------------------------------------------------------
export function generarCeldasEquivalentes(alimento, numEquivalentes, todosLosAlimentos) {
  let html = "";

  const indices = [0, 1, 3, 4, 5, 6, 7, 8, 9];

  for (let i = 0; i < numEquivalentes; i++) {
    const idx = indices[i];

    const idKey = idx === 0 ? "id_alimento_equivalente" : `id_alimento_equivalente${idx}`;
    const nombreKey = idx === 0 ? "nombre_alimento_equivalente" : `nombre_alimento_equivalente${idx}`;
    const cantidadKey = idx === 0 ? "cantidad_equivalente" : `cantidad_equivalente${idx}`;

    let seleccionado = null;

    if (alimento && alimento[idKey]) {
      seleccionado = {
        id_alimento: alimento[idKey],
        nombre: alimento[nombreKey]
      };
    }

    html += `
      <td class="px-1 py-0">
        <select name="select-alimentos" class="form-select form-select-sm">
          ${generarOpcionesAlimentos(todosLosAlimentos, seleccionado)}
        </select>
      </td>
      <td class="px-1 py-0">
        ${alimento && alimento[cantidadKey] ? alimento[cantidadKey] : ""}
      </td>
    `;
  }

  return html;
}

// ------------------------------------------------------------
// 🔧 Generar UNA FILA COMPLETA de alimento
// ------------------------------------------------------------
export function generarFilaAlimento(alimento, categoria, numEquivalentes, todosLosAlimentos) {
  return `
    <tr>
      <td class="header-dieta px-1 py-0">
        <select class="form-select form-select-sm" name="select-categoria">
          <option value="Proteina" ${categoria === 'Proteina' ? 'selected' : ''}>Proteina</option>
          <option value="Grasa" ${categoria === 'Grasa' ? 'selected' : ''}>Grasa</option>
          <option value="Carbohidrato" ${categoria === 'Carbohidrato' ? 'selected' : ''}>Carbohidrato</option>
          <option value="Fruta" ${categoria === 'Fruta' ? 'selected' : ''}>Fruta</option>
          <option value="Verdura" ${categoria === 'Verdura' ? 'selected' : ''}>Verdura</option>
          <option value="Otros" ${categoria === 'Otros' ? 'selected' : ''}>Otros</option>
        </select>
      </td>

      <!-- SELECT PRINCIPAL -->
      <td class="px-1 py-0">
        <select name="select-alimentos" class="form-select form-select-sm">
          ${generarOpcionesAlimentos(todosLosAlimentos, alimento?.id_alimento)}
        </select>
      </td>

      <!-- CANTIDAD -->
      <td class="px-1 py-0">
        <input class="form-control form-control-sm input-cantidad" type="text" value="${alimento?.cantidad || ''}">
      </td>

      <!-- EQUIVALENTES -->
      ${generarCeldasEquivalentes(alimento, numEquivalentes, todosLosAlimentos)}
    </tr>
  `;
}

// ------------------------------------------------------------
// 🔧 Generar TABLA COMPLETA para una comida
// ------------------------------------------------------------
export function generarTablaComida(comida, numEquivalentes, todosLosAlimentos) {
  const categorias = ["Proteina", "Carbohidrato", "Grasa", "Fruta", "Verdura", "Otros"];

  const tipoComida = capitalizar(comida.tipo_comida);

  return `
    <table class="table table-striped mb-0 fs-7 table-dieta" role="grid">
      <thead>
        <tr>
          <th colspan="${3 + numEquivalentes * 2}">
            <div class="d-flex justify-content-start gap-2 w-25">
              <select class="form-select form-select-sm" name="tipo-comida">
                <option value="Desayuno" ${tipoComida === "Desayuno" ? "selected" : ""}>Desayuno</option>
                <option value="Almuerzo" ${tipoComida === "Almuerzo" ? "selected" : ""}>Almuerzo</option>
                <option value="Comida" ${tipoComida === "Comida" ? "selected" : ""}>Comida</option>
                <option value="Merienda" ${tipoComida === "Merienda" ? "selected" : ""}>Merienda</option>
                <option value="Pre-entreno" ${tipoComida === "Pre-entreno" ? "selected" : ""}>Pre-entreno</option>
                <option value="Post-entreno" ${tipoComida === "Post-entreno" ? "selected" : ""}>Post-entreno</option>
                <option value="Cena" ${tipoComida === "Cena" ? "selected" : ""}>Cena</option>
                <option value="Pre-cama" ${tipoComida === "Pre-cama" ? "selected" : ""}>Pre-cama</option>
                <option value="Suplementacion" ${tipoComida === "Suplementacion" ? "selected" : ""}>Suplementacion</option>
              </select>
              <input type="time" class="form-control form-control-sm" value="${comida.hora || "08:00"}">
            </div>
          </th>
        </tr>

        ${generarColumnasTabla(numEquivalentes)}
      </thead>

      <tbody>
        ${categorias
          .map(cat => {
            const alimento = comida.alimentos.find(a => capitalizar(a.categoria) === cat);
            return generarFilaAlimento(alimento, cat, numEquivalentes, todosLosAlimentos);
          })
          .join("")}

        <tr>
          <td class="header-dieta px-1 py-0">Observaciones</td>
          <td colspan="${2 + numEquivalentes * 2}">
            <textarea class="form-control form-control-sm text-dieta">${comida.notas || ""}</textarea>
          </td>
        </tr>
      </tbody>
    </table>
  `;
}

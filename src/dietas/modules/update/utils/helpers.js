// 🔧 Función auxiliar para capitalizar
export function capitalizar(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// 🔧 Obtener alimentos desde el cache (cargados por renderSelectAlimentos.js)
export function obtenerAlimentosDisponibles() {
  return window.__alimentosCache || [];
}

// 🔧 Filtrar alimentos por categoría
export function filtrarAlimentosPorCategoria(alimentos, categoria) {
  if (!alimentos || alimentos.length === 0) return [];
  
  return alimentos.filter(alimento => {
    const categoriaAlimento = alimento.categoria || '';
    return capitalizar(categoriaAlimento) === categoria;
  });
}

// 🔧 Generar opciones para select de alimentos
export function generarOpcionesAlimentos(alimentos, alimentoSeleccionado = null) {
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

// 🔧 Obtener el número máximo de equivalentes en toda la dieta
export function obtenerMaxEquivalentes(comidas) {
  let max = 0;
  
  Object.values(comidas).forEach((comida) => {
    // ✅ Saltar suplementación (no tiene alimentos)
    if (capitalizar(comida.tipo_comida) === 'Suplementacion') {
      return;
    }
    
    comida.alimentos.forEach((alimento) => {
      let count = 0;
      
      // Revisar equivalente base
      if (alimento.id_alimento_equivalente && alimento.id_alimento_equivalente !== null) {
        count++;
      }
      
      // Revisar equivalentes 1, 3, 4, 5, 6, 7, 8, 9 (saltando el 2)
      const indices = [1, 3, 4, 5, 6, 7, 8, 9];
      indices.forEach(i => {
        const key = `id_alimento_equivalente${i}`;
        if (alimento[key] && alimento[key] !== null) {
          count++;
        }
      });
      
      if (count > max) {
        max = count;
      }
    });
  });
  
  console.log(`📊 MÁXIMO DE EQUIVALENTES: ${max}`);
  return max;
}

// 🔧 Generar columnas dinámicamente
export function generarColumnasTabla(numEquivalentes) {
  const thead = `
    <tr>
      <th>MACRO</th>
      <th>Alimento</th>
      <th>gr</th>
      ${Array(numEquivalentes).fill(0).map((_, index) => `
        <th>Alimento ${index + 1}</th>
        <th>gr</th>
      `).join('')}
    </tr>
  `;
  return thead;
}

// 🔧 Generar celdas de equivalentes para una fila
export function generarCeldasEquivalentes(alimento, numEquivalentes, todosLosAlimentos) {
  let html = '';
  
  // Mapeo exacto: [0, 1, 3, 4, 5, 6, 7, 8, 9]
  const indicesEquivalentes = [0, 1, 3, 4, 5, 6, 7, 8, 9];
  
  for (let i = 0; i < numEquivalentes; i++) {
    const indiceReal = indicesEquivalentes[i];
    
    const idKey = indiceReal === 0 ? 'id_alimento_equivalente' : `id_alimento_equivalente${indiceReal}`;
    const nombreKey = indiceReal === 0 ? 'nombre_alimento_equivalente' : `nombre_alimento_equivalente${indiceReal}`;
    const cantidadKey = indiceReal === 0 ? 'cantidad_equivalente' : `cantidad_equivalente${indiceReal}`;
    
    let alimentoEquivalente = null;
    if (alimento && alimento[idKey] && alimento[idKey] !== null) {
      alimentoEquivalente = { 
        id_alimento: alimento[idKey], 
        nombre_alimento: alimento[nombreKey] 
      };
    }
    
    html += `
      <td class="px-1 py-0">
        <select name="select-alimentos" class="form-select form-select-sm">
          ${generarOpcionesAlimentos(todosLosAlimentos, alimentoEquivalente)}
        </select>
      </td>
      <td class="px-1 py-0">${alimento && alimento[cantidadKey] ? alimento[cantidadKey] : ''}</td>
    `;
  }
  
  return html;
}

// 🔧 Generar fila completa
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
      <td class="px-1 py-0">
        <select name="select-alimentos" class="form-select form-select-sm" data-categoria="${categoria}">
          ${generarOpcionesAlimentos(todosLosAlimentos, alimento)}
        </select>
      </td>
      <td class="px-1 py-0">
        <input class="form-control form-control-sm input-cantidad" type="text" value="${alimento?.cantidad || ''}">
      </td>
      ${generarCeldasEquivalentes(alimento, numEquivalentes, todosLosAlimentos)}
    </tr>
  `;
}

// 🔧 Generar tabla completa para una comida
export function generarTablaComida(comida, numEquivalentes, todosLosAlimentos) {
  const categorias = ['Proteina', 'Carbohidrato', 'Grasa', 'Fruta', 'Verdura', 'Otros'];
  
  // ✅ CAPITALIZAR el tipo_comida que viene del backend
  const tipoComidaCapitalizado = capitalizar(comida.tipo_comida);
  
  console.log('🍽️ Generando tabla:', {
    original: comida.tipo_comida,
    capitalizado: tipoComidaCapitalizado,
    hora: comida.hora
  });
  
  return `
    <table class="table table-striped mb-0 fs-7 table-dieta" role="grid">
      <thead>
        <tr>
          <th colspan="${3 + (numEquivalentes * 2)}">
            <div class="d-flex justify-content-start gap-2 w-25">
              <select class="form-select form-select-sm" name="tipo-comida">
                <option value="Desayuno" ${tipoComidaCapitalizado === 'Desayuno' ? 'selected' : ''}>Desayuno</option>
                <option value="Almuerzo" ${tipoComidaCapitalizado === 'Almuerzo' ? 'selected' : ''}>Almuerzo</option>
                <option value="Comida" ${tipoComidaCapitalizado === 'Comida' ? 'selected' : ''}>Comida</option>
                <option value="Merienda" ${tipoComidaCapitalizado === 'Merienda' ? 'selected' : ''}>Merienda</option>
                <option value="Pre-entreno" ${tipoComidaCapitalizado === 'Pre-entreno' ? 'selected' : ''}>Pre-entreno</option>
                <option value="Post-entreno" ${tipoComidaCapitalizado === 'Post-entreno' ? 'selected' : ''}>Post-entreno</option>
                <option value="Cena" ${tipoComidaCapitalizado === 'Cena' ? 'selected' : ''}>Cena</option>
                <option value="Pre-cama" ${tipoComidaCapitalizado === 'Pre-cama' ? 'selected' : ''}>Pre-cama</option>
                <option value="Suplementacion" ${tipoComidaCapitalizado === 'Suplementacion' ? 'selected' : ''}>Suplementacion</option>
              </select>
              <input type="time" class="form-control form-control-sm" name="cantidad-alimentos" value="${comida.hora || '08:00'}">
            </div>
          </th>
        </tr>
        ${generarColumnasTabla(numEquivalentes)}
      </thead>
      <tbody>
        ${categorias.map(cat => {
          const alimento = comida.alimentos.find(a => capitalizar(a.categoria) === cat);
          return generarFilaAlimento(alimento, cat, numEquivalentes, todosLosAlimentos);
        }).join('')}
        <tr>
          <td class="header-dieta px-1 py-0">Observaciones</td>
          <td colspan="${2 + (numEquivalentes * 2)}">
            <textarea class="form-control form-control-sm text-dieta">${comida.notas || ''}</textarea>
          </td>
        </tr>
      </tbody>
    </table>
  `;
}
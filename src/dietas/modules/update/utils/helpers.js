// 🔧 Función auxiliar para capitalizar
export function capitalizar(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// 🔧 Obtener alimentos desde el cache (cargados por renderSelectAlimentos.js)
export function obtenerAlimentosDisponibles() {
  // Los alimentos están en window.__alimentosCache según renderSelectAlimentos.js
  return window.__alimentosCache || [];
}

// 🔧 Filtrar alimentos por categoría
export function filtrarAlimentosPorCategoria(alimentos, categoria) {
  if (!alimentos || alimentos.length === 0) return [];
  
  return alimentos.filter(alimento => {
    // Según renderSelectAlimentos.js, los alimentos tienen la propiedad 'categoria'
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
    // Según renderSelectAlimentos.js: id_alimento y nombre
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
  
  console.log('=== DEBUGGING OBTENER MAX EQUIVALENTES ===');
  
  Object.values(comidas).forEach((comida, comidaIndex) => {
    console.log(`Comida ${comidaIndex}: ${comida.tipo_comida}`);
    
    comida.alimentos.forEach((alimento, alimentoIndex) => {
      let count = 0;
      const equivalentesEncontrados = [];
      
      // Revisar equivalente base
      if (alimento.id_alimento_equivalente && alimento.id_alimento_equivalente !== null) {
        count++;
        equivalentesEncontrados.push('base');
      }
      
      // Revisar equivalentes 1, 3, 4, 5, 6, 7, 8, 9 (saltando el 2)
      const indices = [1, 3, 4, 5, 6, 7, 8, 9];
      indices.forEach(i => {
        const key = `id_alimento_equivalente${i}`;
        if (alimento[key] && alimento[key] !== null) {
          count++;
          equivalentesEncontrados.push(`${i}`);
        }
      });
      
      console.log(`  Alimento ${alimentoIndex} (${alimento.nombre_alimento}): ${count} equivalentes [${equivalentesEncontrados.join(', ')}]`);
      console.log(`    Debug IDs: eq4=${alimento.id_alimento_equivalente4}, eq5=${alimento.id_alimento_equivalente5}, eq6=${alimento.id_alimento_equivalente6}`);
      
      if (count > max) {
        max = count;
        console.log(`    NUEVO MÁXIMO: ${max}`);
      }
    });
  });
  
  console.log(`MÁXIMO FINAL: ${max}`);
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
  
  // Mapeo exacto según agruparPorComida: [0, 1, 3, 4, 5, 6, 7, 8, 9]
  const indicesEquivalentes = [0, 1, 3, 4, 5, 6, 7, 8, 9];
  
  for (let i = 0; i < numEquivalentes; i++) {
    const indiceReal = indicesEquivalentes[i];
    
    // Generar las claves correctas
    const idKey = indiceReal === 0 ? 'id_alimento_equivalente' : `id_alimento_equivalente${indiceReal}`;
    const nombreKey = indiceReal === 0 ? 'nombre_alimento_equivalente' : `nombre_alimento_equivalente${indiceReal}`;
    const cantidadKey = indiceReal === 0 ? 'cantidad_equivalente' : `cantidad_equivalente${indiceReal}`;
    
    // Crear objeto del alimento equivalente si existe
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
          <option ${categoria === 'Proteina' ? 'selected' : ''}>Proteina</option>
          <option ${categoria === 'Grasa' ? 'selected' : ''}>Grasa</option>
          <option ${categoria === 'Carbohidrato' ? 'selected' : ''}>Carbohidrato</option>
          <option ${categoria === 'Fruta' ? 'selected' : ''}>Fruta</option>
          <option ${categoria === 'Verdura' ? 'selected' : ''}>Verdura</option>
          <option ${categoria === 'Otros' ? 'selected' : ''}>Otros</option>
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
  
  return `
    <table class="table table-striped mb-0 fs-7 table-dieta" role="grid">
      <thead>
        <tr>
          <th colspan="${3 + (numEquivalentes * 2)}">
            <div class="d-flex justify-content-start gap-2 w-25">
              <select class="form-select form-select-sm" name="tipo-comida">
                <option ${comida.tipo_comida === 'Desayuno' ? 'selected' : ''}>Desayuno</option>
                <option ${comida.tipo_comida === 'Almuerzo' ? 'selected' : ''}>Almuerzo</option>
                <option ${comida.tipo_comida === 'Comida' ? 'selected' : ''}>Comida</option>
                <option ${comida.tipo_comida === 'Merienda' ? 'selected' : ''}>Merienda</option>
                <option ${comida.tipo_comida === 'Pre-entreno' ? 'selected' : ''}>Pre-entreno</option>
                <option ${comida.tipo_comida === 'Post-entreno' ? 'selected' : ''}>Post-entreno</option>
                <option ${comida.tipo_comida === 'Cena' ? 'selected' : ''}>Cena</option>
                <option ${comida.tipo_comida === 'Pre-cama' ? 'selected' : ''}>Pre-cama</option>
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

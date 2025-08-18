import { agruparPorTipoComida } from './agruparComida.js';

export function renderInformeDieta(data) {
  if (!Array.isArray(data) || !data.length) return;

  const container = document.getElementById("informe-dieta");
  container.classList.add("a4-informe");
  container.innerHTML = "";

  // 1. Datos generales
  const gen = data[0];
  const headerHTML = `
    <div class="informe-header">
      <div>
        <p><strong>Nombre:</strong> ${gen.nombre_usuario} ${gen.apellido_usuario}</p>
        <p><strong>Día:</strong> ${gen.fecha_creacion.split(' ')[0]}</p>
        <p><strong>Tipo:</strong> —</p>
        <p><strong>Kcal:</strong> ${gen.calorias_dieta}</p>
      </div>
      <div>
        <p><strong>Inicio:</strong> ${gen.fecha_creacion.split(' ')[0]}</p>
        <p><strong>Validez:</strong> Mensual</p>
        <p><strong>Revisión:</strong> —</p>
        <p><strong>Responsable:</strong> ${gen.nombre_preparador || '—'} ${gen.apellido_preparador || ''}</p>
      </div>
    </div>
  `;
  container.insertAdjacentHTML("beforeend", headerHTML);

  // 2. Agrupar por tipo de comida
  const comidasAgrupadas = agruparPorTipoComida(data);

  // 3. Renderizar comidas
  for (const tipo in comidasAgrupadas) {
    const items = comidasAgrupadas[tipo];

    const bloque = document.createElement("div");
    bloque.classList.add("bloque-comida");

    let tablaHTML = `
      <h3>${tipo.toUpperCase()}</h3>
      <table class="tabla-comida">
        <thead>
          <tr>
            <th>Alimento</th>
            <th>Cantidad</th>
            <th>Notas</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => `
            <tr>
              <td>${item.nombre_alimento || '—'}</td>
              <td>${item.cantidad} g</td>
              <td>${item.notas || '—'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    bloque.innerHTML = tablaHTML;
    container.appendChild(bloque);
  }

  // 4. Suplementación (opcional, fija o si viene del backend)
  const suplementosHTML = `
    <div class="suplementacion">
      <p>SUPLEMENTACIÓN</p>
      <p>Multivitamínico</p>
      <p>Proteína WHEY</p>
      <p>Creatina</p>
    </div>
  `;
  container.insertAdjacentHTML("beforeend", suplementosHTML);
}

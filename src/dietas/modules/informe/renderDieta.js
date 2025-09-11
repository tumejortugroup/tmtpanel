import { agruparPorTipoComida } from './agruparComida.js';

/**
 * renderInformeDieta()
 * --------------------
 * Renderiza un informe visual en formato A4 para una dieta completa.
 *
 * Flujo:
 * 1. Valida la entrada: espera un array con la información de la dieta.
 * 2. Pinta un encabezado con los datos generales del usuario y de la dieta.
 * 3. Agrupa los items por tipo de comida usando `agruparPorTipoComida`.
 * 4. Ordena las comidas por hora para mostrar el plan de forma cronológica.
 * 5. Por cada comida:
 *    - Renderiza un bloque con título, macros totales y tabla de alimentos.
 *    - Incluye alimentos equivalentes y notas si existen.
 * 6. Añade notas generales al final del informe (estilo recomendaciones).
 *
 * Consideraciones:
 * - Usa `container.innerHTML = ""` para limpiar antes de renderizar.
 * - Asume que `data[0]` contiene la información general de la dieta.
 * - El DOM se genera dinámicamente con HTML + estilos inline.
 * - Está pensado para imprimir/exportar, de ahí la clase `a4-informe`.
 *
 * @param {Array<Object>} data - Datos de la dieta y comidas.
 */

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
        <p><strong>Kcal:</strong> ${gen.calorias_dieta}</p>
        <p><strong>Proteinas:</strong> ${gen.proteinas_dieta}g</p>
        <p><strong>Carbohidratos:</strong> ${gen.carbohidratos_dieta}g</p>
        <p><strong>Grasas:</strong> ${gen.grasas_dieta}g</p>
      </div>
      <div>
        <p><strong>Inicio:</strong> ${gen.fecha_creacion.split(' ')[0]}</p>
        <p><strong>Validez:</strong> Mensual</p>
        <p><strong>Revisión:</strong> —</p>
        <p><strong>Responsable:</strong> ${gen.nombre_preparador || ''} ${gen.apellido_preparador || ''} ${gen.nombre_propietario || ''} ${gen.apellido_propietario || ''}</p>
      </div>
    </div>
  `;
  container.insertAdjacentHTML("beforeend", headerHTML);


const comidasAgrupadas = agruparPorTipoComida(data);

// 🔹 Pasar a array y ordenar por hora
const comidasOrdenadas = Object.entries(comidasAgrupadas).sort(([tipoA, itemsA], [tipoB, itemsB]) => {
  const horaA = itemsA[0]?.hora ? itemsA[0].hora : null;
  const horaB = itemsB[0]?.hora ? itemsB[0].hora : null;

  if (!horaA && !horaB) return 0;   // Ninguna tiene hora → se quedan igual
  if (!horaA) return 1;            // A no tiene hora → va después
  if (!horaB) return -1;           // B no tiene hora → va después

  return horaA.localeCompare(horaB); // Ordenar por hora ascendente
});

// 3. Renderizar comidas ya ordenadas
for (const [tipo, items] of comidasOrdenadas) {
  const bloque = document.createElement("div");
  bloque.classList.add("bloque-comida");

  const hora = items[0]?.hora ? items[0].hora.slice(0, 5) : "—";
  const caloriasTotales = items[0]?.calorias_totales_comida || 0;
  const proteinasTotales = items[0]?.proteinas_totales_comida || 0;
  const grasasTotales = items[0]?.grasas_totales_comida || 0;
  const carbosTotales = items[0]?.carbohidratos_totales_comida || 0;

  let tablaHTML = `
    <div class='encabezado-comida'>
      <h3>${tipo.toUpperCase()} <small>(${hora})</small></h3>
      <p style="margin: 4px 0; font-size: 13px; color: #555;">
        ${caloriasTotales} kcal | 
        ${proteinasTotales} g proteínas | 
        ${grasasTotales} g grasas | 
        ${carbosTotales} g carbohidratos
      </p>
    </div>
    
    <table class="tabla-comida">
      <thead>
        <tr>
          <th>Alimento</th>
        </tr>
      </thead>
      <tbody>
        ${items.map(item => {
          let alimentos = [`${item.nombre_alimento || '—'} (${item.cantidad ? item.cantidad + ' g' : '—'})`];

          if (item.nombre_alimento_equivalente && item.cantidad_equivalente) {
            alimentos.push(`${item.nombre_alimento_equivalente} (${item.cantidad_equivalente} g)`);
          }
          if (item.nombre_alimento_equivalente1 && item.cantidad_equivalente1) {
            alimentos.push(`${item.nombre_alimento_equivalente1} (${item.cantidad_equivalente1} g)`);
          }
          if (item.nombre_alimento_equivalente3 && item.cantidad_equivalente3) {
            alimentos.push(`${item.nombre_alimento_equivalente3} (${item.cantidad_equivalente3} g)`);
          }

          return `
            <tr>
              <td>${alimentos.join(" / ")}</td>
            </tr>
          `;
        }).join('')}
      </tbody>
      </table>

      ${(() => {
          const notasUnicas = [...new Set(items.filter(i => i.notas).map(i => i.notas))];
          return notasUnicas.length > 0
            ? `
              <div class="notas-comida" style="font-size: 11px; color: #666; font-style: italic; margin-top: 4px; padding-left: 10px;">
                ${notasUnicas.map(n => `📝 ${n}`).join("<br>")}
              </div>
            `
            : "";
        })()}

        `;

        bloque.innerHTML = tablaHTML;
        container.appendChild(bloque);
      }


    
    const notasHTML = `
      <div class="informe-notas" style="margin-top: 20px; font-size: 11px; line-height: 1.4;">
        <p style="color: green; font-weight: bold; margin: 2px 0;">
          1.- Beber 2-3 litros de agua. 2 batidos máximo al día. Hacer 10.000 pasos diarios
        </p>
        <p style="color: blue; font-weight: bold; margin: 2px 0;">
          2.- Todo al horno, vapor, plancha, hervido o microondas.
        </p>
        <p style="color: red; font-weight: bold; margin: 2px 0;">
          3.- Todos los alimentos han de ser pesados en crudo antes de cocinarlos.
        </p>
        <p style="color: brown; font-weight: bold; margin: 2px 0;">
          4.- Tienes 20 gr de Aceite para todas las comidas del día, no superar 160° al cocinar.
        </p>
      </div>
    `;
    container.insertAdjacentHTML("beforeend", notasHTML);

}

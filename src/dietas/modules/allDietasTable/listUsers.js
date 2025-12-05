import { asignarEventoSelectDieta } from "./dietaSeleccionada.js";

/**
 * Obtiene y renderiza los usuarios de un centro junto con sus dietas.
 */
export async function listUser() {
  const token = localStorage.getItem("token");
  const centro_id = localStorage.getItem("centro_id");

  if (!token || !centro_id) {
    console.warn("⚠️ Faltan datos: token o centro_id no encontrados en localStorage.");
    return;
  }

  const endpoint = `https://my.tumejortugroup.com/api/v1/usuarios/centro?id=${centro_id}`;

  try {
    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`❌ Error HTTP: ${response.status}`);
    }

    const usuarios = await response.json();
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";

    for (const usuario of usuarios) {
      // Obtener dietas
      const resDietas = await fetch(
        `https://my.tumejortugroup.com/api/v1/dietas/usuario/${usuario.id_usuario}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const dietasData = await resDietas.json();
      const dietas = Array.isArray(dietasData.data) ? dietasData.data : [];

      // 📌 Select de dietas
      let selectHTML = "";
      if (dietas.length === 0) {
        selectHTML = '<span class="text-muted">Sin dietas</span>';
      } else {
        const ultimaDieta = dietas[dietas.length - 1];

        selectHTML = `
          <select class="form-select form-select-sm" name="select-dieta">
            ${dietas
              .map(
                d => `
                <option value="${d.id_dieta}" ${
                  d.id_dieta === ultimaDieta.id_dieta ? "selected" : ""
                }>
                  ${d.nombre}
                </option>`
              )
              .join("")}
          </select>
        `;
      }

      const rowHTML = `
        <tr data-id-usuario="${usuario.id_usuario}">
          <td>${usuario.numero_usuario.substring(0, 3)}</td>
          <td>${usuario.estado}</td>
          <td>${usuario.nombre}</td>
          <td>${usuario.apellidos}</td>

          <td class="nombre-dato">—</td>
          <td class="fecha-dato">—</td>
          <td>${selectHTML}</td>
          <td>

         <div class="flex align-items-center list-user-action justify-content-center">
         <div class="menu-acciones">
            <button class="btn-acciones">⋮</button>

            <div class="acciones-lista oculto">
              <button class="accion-item btn-ver-control">Ver Control</button>
              <button class="accion-item btn-ver-dieta">Ver Dieta</button>
              <button class="accion-item btn-editar-dieta">Editar Dieta</button>
              <button class="accion-item btn-eliminar">Eliminar Dieta</button>
            </div>
          </div>

        </div>


          
    
          </td>
        </tr>
      `;

      tbody.insertAdjacentHTML("beforeend", rowHTML);

      const lastRow = tbody.lastElementChild;

      if (dietas.length > 0) {
        // asignar eventos al select
        asignarEventoSelectDieta(lastRow, token);

        // ⚡ forzar selección y evento change en la última dieta
        const select = lastRow.querySelector('select[name="select-dieta"]');
        if (select) {
          const ultimaDieta = dietas[dietas.length - 1];
          select.value = ultimaDieta.id_dieta;
          select.dispatchEvent(new Event("change"));
        }
      }
    }
  } catch (error) {
    console.error("❌ Error al cargar usuarios o dietas:", error);
  }
}

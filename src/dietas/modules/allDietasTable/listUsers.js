import { asignarEventoSelectDieta } from "./dietaSeleccionada.js"; // asegúrate de que la extensión es correcta

export async function listUser() {
  const token = localStorage.getItem("token");
  const centro_id = localStorage.getItem("centro_id");

  if (!token || !centro_id) {
    console.warn("⚠️ Faltan datos: token o centro_id no encontrados en localStorage.");
    return;
  }

  const endpoint = `http://localhost:9000/api/v1/usuarios/centro?id=${centro_id}`;

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
      const resDietas = await fetch(`http://localhost:9000/api/v1/dietas/usuario/${usuario.id_usuario}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const dietasData = await resDietas.json();
      const dietas = Array.isArray(dietasData.data) ? dietasData.data : [];

      // Select con dietas
      const selectHTML = dietas.length > 0
        ? `<select class="form-select form-select-sm" name="select-dieta">
            ${dietas.map(d => `
              <option value="${d.id_dieta}">${d.nombre}</option>
            `).join('')}
          </select>`
        : '<span class="text-muted">Sin dietas</span>';

      // Fila HTML
      const rowHTML = `
        <tr data-id-usuario="${usuario.id_usuario}">
          <td>${usuario.nombre}</td>
          <td>${usuario.apellidos}</td>
          <td class="nombre-dato">—</td>
          <td class="fecha-dato">—</td>
          <td>${selectHTML}</td>
          <td>
            <div class="flex align-items-center list-user-action">
              <a class="btn btn-sm btn-icon" data-bs-toggle="tooltip" title="Editar" href="/dashboard/user/user-update.html?id=${usuario.id_usuario}">
                <span class="btn-inner">✏️</span>
              </a>
             <a class="btn btn-sm btn-icon btn-eliminar-dieta" data-nombre="${usuario.nombre}" title="Eliminar" href="#">
              <span class="btn-inner">🗑️</span>
            </a>
            </div>
          </td>
        </tr>
      `;

      // Insertar la fila en el tbody
      tbody.insertAdjacentHTML("beforeend", rowHTML);

      // 🆕 Seleccionar la última fila insertada
      const lastRow = tbody.lastElementChild;

      // Llamar a la función para manejar el evento de selección
      asignarEventoSelectDieta(lastRow, token);
    }

    console.log("✅ Usuarios y dietas cargados correctamente.");
  } catch (error) {
    console.error("❌ Error al cargar usuarios o dietas:", error);
  }
}

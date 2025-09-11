import { asignarEventoSelectDieta } from "./dietaSeleccionada.js";


/**
 * Obtiene y renderiza los usuarios de un centro junto con sus dietas.
 *
 * Flujo:
 * 1. Recupera `token` y `centro_id` del localStorage.
 * 2. Consulta la API de usuarios del centro.
 * 3. Por cada usuario, obtiene sus dietas y construye dinámicamente
 *    la fila correspondiente en la tabla.
 * 4. Si el usuario tiene dietas, genera un <select> con opciones
 *    y asigna el evento mediante `asignarEventoSelectDieta`.
 *
 * Consideraciones:
 * - Si faltan credenciales en localStorage, la función se interrumpe con un warning.
 * - Maneja errores HTTP y de red con try/catch, loggeando el detalle en consola.
 * - El DOM de la tabla se limpia en cada ejecución para evitar duplicados.
 *
 * Dependencias:
 * - `asignarEventoSelectDieta`: gestiona los eventos sobre el <select> de dietas.
 * - Endpoints:
 *    - `GET /usuarios/centro?id={centro_id}`
 *    - `GET /dietas/usuario/{id_usuario}`
 */

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
      const resDietas = await fetch(
        `http://localhost:9000/api/v1/dietas/usuario/${usuario.id_usuario}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const dietasData = await resDietas.json();
      const dietas = Array.isArray(dietasData.data) ? dietasData.data : [];

      // 📌 siempre mostrar un select si hay dietas
      let selectHTML = "";
      if (dietas.length === 0) {
        selectHTML = '<span class="text-muted">Sin dietas</span>';
      } else {
        selectHTML = `
          <select class="form-select form-select-sm" name="select-dieta">
            <option value="" selected disabled>-- Selecciona dieta --</option>
            ${dietas.map(d => `<option value="${d.id_dieta}">${d.nombre}</option>`).join("")}
          </select>
        `;
      }

      const rowHTML = `
        <tr data-id-usuario="${usuario.id_usuario}">
          <td>${usuario.nombre}</td>
          <td>${usuario.apellidos}</td>
          <td class="nombre-dato">—</td>
          <td class="fecha-dato">—</td>
          <td>${selectHTML}</td>
          <td>
            <div class="flex align-items-center list-user-action">
              <a class="btn btn-sm btn-icon btn-editar-dieta" 
                data-bs-toggle="tooltip" 
                title="Editar" href="#">
                <span class="btn-inner">✏️</span>
              </a>

              <a class="btn btn-sm btn-icon btn-eliminar-dieta" 
                data-nombre="${usuario.nombre}" 
                title="Eliminar" href="#">
                <span class="btn-inner">🗑️</span>
              </a>

              <a class="btn btn-sm btn-icon btn-ver-dieta" 
                title="Ver Dieta" href="#">
                <span class="btn-inner">👁️</span>
              </a>
            </div>
          </td>
        </tr>
      `;


      tbody.insertAdjacentHTML("beforeend", rowHTML);

      const lastRow = tbody.lastElementChild;

      if (dietas.length > 0) {
        asignarEventoSelectDieta(lastRow, token);
      }
    }

    console.log("✅ Usuarios y dietas cargados correctamente.");
  } catch (error) {
    console.error("❌ Error al cargar usuarios o dietas:", error);
  }
}

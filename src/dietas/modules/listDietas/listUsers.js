import { fetchDetalleDato } from './fetchDato.js';
import { crearDieta } from './postDieta.js';

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
      

      // Obtener controles
      const resControles = await fetch(`http://localhost:9000/api/v1/datos/usuario/${usuario.id_usuario}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const controlesData = await resControles.json();
      const controles = Array.isArray(controlesData.data) ? controlesData.data : [];


      // Último control
      const resLast = await fetch(`http://localhost:9000/api/v1/datos/last/${usuario.id_usuario}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const lastData = await resLast.json();
      const ultimoControl = lastData?.data?.nombre || '—';
      const ultimoControlId = lastData?.data?.id_dato || null;
   
      // Select con controles
      const selectHTML = controles.length > 0
        ? `<select class="form-select form-select-sm" name="select-control">
            ${controles.map(ctrl => `
              <option value="${ctrl.id_dato}">${ctrl.nombre}</option>
            `).join('')}
          </select>`
        : '<span class="text-muted">Sin controles</span>';

      // Fila HTML
      const rowHTML = `
        <tr>
          <td>${usuario.nombre}</td>
          <td>${usuario.apellidos}</td>
          <td data-id-dato="${ultimoControlId}">${ultimoControl}</td>
          <td>${selectHTML}</td>
          <td>
            <div class="flex align-items-center list-user-action">
              <a class="btn btn-sm btn-icon" href="#" title="Crear dieta">
                <img src="/assets/images/dashboard/iconos/dieta.webp" alt="" width="30" height="15" class="img-fluid" style="cursor:pointer;">
              </a>
            </div>
          </td>
        </tr>
      `;

      tbody.insertAdjacentHTML("beforeend", rowHTML);

      const lastRow = tbody.lastElementChild;
      asignarEventoCrearDieta(lastRow, usuario);
    }

    console.log("✅ Usuarios, último control y lista de controles cargados.");
  } catch (error) {
    console.error("❌ Error al cargar usuarios o controles:", error);
  }
}


function asignarEventoCrearDieta(rowElement, usuario) {
  const imgCrearDieta = rowElement.querySelector("a[title='Crear dieta'] img");
  const selectControl = rowElement.querySelector("select[name='select-control']");
  const tdUltimoControl = rowElement.querySelector("td[data-id-dato]");

  imgCrearDieta.addEventListener("click", async function (e) {
    e.preventDefault();

    const selectedIdDato = selectControl?.value;
    const fallbackIdDato = tdUltimoControl.getAttribute("data-id-dato");
    const id_dato_final = selectedIdDato || fallbackIdDato;

    console.log(`🖱️ Clic en dieta de usuario ${usuario.id_usuario}`);
    console.log(`✅ id_dato usado: ${id_dato_final}`);

    if (!id_dato_final) {
      alert("❌ No se pudo determinar el control para crear la dieta.");
      return;
    }

    // ✅ Usar la función centralizada
    crearDieta(usuario.id_usuario, id_dato_final);
  });
}
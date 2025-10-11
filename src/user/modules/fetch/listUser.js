import { formatearFecha } from "/src/user/modules/utils/formatearFecha.js";

// Función para obtener la última dieta de un usuario
async function obtenerUltimaDieta(id_usuario) {
    const token = localStorage.getItem("token");
    const endpoint = `https://my.tumejortugroup.com/api/v1/dietas/last/${id_usuario}`;

    console.log(`🔍 Obteniendo última dieta para usuario ${id_usuario}`);

    try {
        const response = await fetch(endpoint, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            console.warn(`⚠️ Response no OK para usuario ${id_usuario}: ${response.status}`);
            return null;
        }

        const data = await response.json();
        console.log(`✅ Data para usuario ${id_usuario}:`, data);
        
        if (data && data.success && data.data) {
            console.log(`✅ Dieta encontrada:`, data.data);
            return data.data;
        } else {
            console.warn(`⚠️ No se encontró dieta para usuario ${id_usuario}`);
            return null;
        }
        
    } catch (error) {
        console.error(`❌ Error al obtener dieta para usuario ${id_usuario}:`, error);
        return null;
    }
}

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
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`❌ Error HTTP: ${response.status} - ${response.statusText}`);
        }

        const usuarios = await response.json();

        const tbody = document.querySelector("tbody");
        if (!tbody) {
            console.warn("⚠️ No se encontró el <tbody> en el DOM.");
            return;
        }

        tbody.innerHTML = "";

        console.log(`👥 Obteniendo dietas para ${usuarios.length} usuarios...`);

        // Obtener las últimas dietas de todos los usuarios en paralelo
        const dietasPromises = usuarios.map(usuario => obtenerUltimaDieta(usuario.id_usuario));
        const dietas = await Promise.all(dietasPromises);

        console.log(`✅ Dietas obtenidas:`, dietas);

       usuarios.forEach((usuario, index) => {
    const dietaData = dietas[index];
    
    // Si dietaData es un número, convertirlo a objeto
    const dietaInfo = typeof dietaData === 'number' 
        ? { id_dieta: dietaData, id_control: null }
        : dietaData;
    
    const dietaUrl = dietaInfo && dietaInfo.id_dieta
        ? `/dashboard/dietas/wizard.html?id_dieta=${dietaInfo.id_dieta}&id_dato=${dietaInfo.id_dato}`
        : `/dashboard/controles/control.html?id=${usuario.id_usuario}`;


    // ... resto del código
            const rowHTML = `
                <tr>
<<<<<<< HEAD
        <td class="text-truncate">${usuario.numero_usuario.substring(0, 3)}</td>
        <td class="text-truncate" style="cursor:pointer;">
          <span class="badge ${usuario.estado?.toLowerCase() === 'activo' ? 'bg-success' : 'bg-secondary'} badge-estado" data-nombre="${usuario.nombre}">
            ${usuario.estado}
          </span>
        </td>
        <td class="text-truncate">${usuario.nombre}</td>
        <td class="text-truncate">${usuario.apellidos}</td>
        <td class="text-truncate">${usuario.telefono}</td>
        <td class="text-truncate">${usuario.correo}</td>
        <td class="text-truncate">${formatearFecha(usuario.fecha_creacion)}</td>
        <td>
          <div class="flex align-items-center list-user-action justify-content-center">
            <div class="dropdown">
              <button class="btn btn-sm btn-icon" type="button" id="dropdownMenuButton${usuario.id_usuario}" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-three-dots-vertical"></i>
              </button>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton${usuario.id_usuario}">
                <li><a class="dropdown-item" href="/dashboard/controles/control.html?id=${usuario.id_usuario}">Control</a></li>
                <li><a class="dropdown-item" href="/dashboard/user/user-update.html?id=${usuario.id_usuario}">Dieta</a></li>
                <li><a class="dropdown-item" href="/dashboard/user/user-update.html?id=${usuario.id_usuario}">Editar</a></li>
                <li><a class="dropdown-item btn-eliminar" href="#" data-nombre="${usuario.nombre}" data-id="${usuario.id_usuario}">Eliminar</a></li>
              </ul>
            </div>
          </div>
        </td>
      </tr>
=======
                    <td class="text-truncate">${usuario.numero_usuario.substring(0, 3)}</td>
                    <td class="text-truncate">
                        <span class="badge ${usuario.estado?.toLowerCase() === 'activo' ? 'bg-success' : 'bg-secondary'} badge-estado" data-nombre="${usuario.nombre}">
                            ${usuario.estado}
                        </span>
                    </td>
                    <td class="text-truncate">${usuario.nombre}</td>
                    <td class="text-truncate">${usuario.apellidos}</td>
                    <td class="text-truncate">${usuario.telefono}</td>
                    <td class="text-truncate">${usuario.correo}</td>
                    <td class="text-truncate">${formatearFecha(usuario.fecha_creacion)}</td>
                    <td>
                        <div class="flex align-items-center list-user-action justify-content-center">
                            <div class="dropdown">
                                <button class="btn btn-sm btn-icon" type="button" id="dropdownMenuButton${usuario.id_usuario}" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="bi bi-three-dots-vertical"></i>
                                </button>
                                  <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton${usuario.id_usuario}">
                                      <li><button class="dropdown-item" onclick="window.location.href='/dashboard/controles/control.html?id=${usuario.id_usuario}'">Control</button></li>
                                      <li><button class="dropdown-item" onclick="window.location.href='${dietaUrl}'">Dieta</button></li>
                                      <li><button class="dropdown-item" onclick="window.location.href='/dashboard/user/user-update.html?id=${usuario.id_usuario}'">Editar</button></li>
                                      <li><button class="dropdown-item btn-eliminar" data-nombre="${usuario.nombre}" data-id="${usuario.id_usuario}">Eliminar</button></li>
                                  </ul>
                            </div>
                        </div>
                    </td>
                </tr>
>>>>>>> f576049a7c9afbda4d7e03b6ae1eacdc4fc320bb
            `;
            tbody.insertAdjacentHTML("beforeend", rowHTML);
        });

        console.log(`✅ Tabla de usuarios renderizada con ${usuarios.length} filas`);

    } catch (error) {
        console.error("❌ Error al cargar los usuarios:", error.message);
    }
}
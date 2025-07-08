export async function cargarUsuario(id) {
    const token = localStorage.getItem('token');

    if (!token) {
        console.error("Token no disponible. El usuario no está autenticado.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:9000/api/v1/usuarios/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const usuario = await response.json();

        setTimeout(() => {
            const mapeo = {
                UnameU: usuario.username,
                fnameU: usuario.nombre,
                lnameU: usuario.apellidos,
                mobnoU: usuario.telefono,
                emailU: usuario.correo,
                dir: usuario.direccion,
                cit: usuario.ciudad,
                passwordU: usuario.password,
                rolU: usuario.rol,
                estadoU: usuario.estado
            };

            for (const id in mapeo) {
                const el = document.getElementById(id);
                if (el) {
                    el.value = mapeo[id] || '';
                } else {
                    console.warn(`Elemento con id "${id}" no encontrado.`);
                }
            }
        }, 200);
    } catch (error) {
        console.error('Error al cargar el usuario:', error.message);
    }
}

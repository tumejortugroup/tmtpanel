export async function cargarUsuario(id) {
    const token = localStorage.getItem('token');

    if (!token) {
        console.error("Token no disponible. El usuario no está autenticado.");
        return;
    }

    try {
        const response = await fetch(`https://my.tumejortugroup.com/api/v1/usuarios/${id}`, {
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
                cname: usuario.numero_usuario,
                fname: usuario.nombre,
                lname: usuario.apellidos,
                mobno: usuario.telefono,
                email: usuario.correo,
                birthday: usuario.fecha_de_nacimiento,
                role: usuario.rol,
                estado: usuario.estado,
                add1: usuario.direccion,
                city: usuario.ciudad
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
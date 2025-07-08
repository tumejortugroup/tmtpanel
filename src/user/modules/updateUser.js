export async function actualizarUsuario(id) {
    const token = localStorage.getItem('token');

    if (!token) {
        console.error("Token no disponible. El usuario no está autenticado.");
        return;
    }

    const data = {
        username: document.getElementById('UnameU')?.value.trim(),
        nombre: document.getElementById('fnameU')?.value.trim(),
        apellidos: document.getElementById('lnameU')?.value.trim(),
        telefono: document.getElementById('mobnoU')?.value.trim(),
        correo: document.getElementById('emailU')?.value.trim(),
        direccion: document.getElementById('dir')?.value.trim(),
        ciudad: document.getElementById('cit')?.value.trim(),
        password: document.getElementById('passwordU')?.value.trim(),

        rol: document.getElementById('rolU')?.value || 'Cliente',
        estado: document.getElementById('estadoU')?.value || 'activo'
        // id_centro ya no se envía
    };

    try {
        const response = await fetch(`http://localhost:9000/api/v1/usuarios/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        console.log("✅ Usuario actualizado:", result);
        alert("Usuario actualizado con éxito.");
    } catch (error) {
        console.error("❌ Error al actualizar:", error.message);
        alert("Error al actualizar el usuario.");
    }
}

export async function actualizarUsuario(id) {
    const token = localStorage.getItem('token');

    if (!token) {
        console.error("Token no disponible. El usuario no está autenticado.");
        return;
    }

    const data = {
        nombre: document.getElementById('fname')?.value.trim(),
        apellidos: document.getElementById('lname')?.value.trim(),
        telefono: document.getElementById('mobno')?.value.trim(),
        correo: document.getElementById('email')?.value.trim(),
        direccion: document.getElementById('add1')?.value.trim(),
        ciudad: document.getElementById('city')?.value.trim(),
        fecha_nacimiento: document.getElementById('birthday')?.value,
        rol: document.getElementById('role')?.value || 'Cliente',
        estado: document.getElementById('estado')?.value || 'activo'
    };

    // Validar campos obligatorios
    if (!data.nombre || !data.apellidos || !data.telefono || !data.correo) {
        alert('Por favor, completa todos los campos obligatorios (marcados con *).');
        return;
    }

    console.log('📤 Datos a enviar:', data);

    try {
        const response = await fetch(`https://my.tumejortugroup.com/api/v1/usuarios/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || `Error ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        console.log("✅ Usuario actualizado:", result);
        alert("Usuario actualizado con éxito.");
        
        // Opcional: Redirigir a la lista de usuarios
        // window.location.href = '/dashboard/user/user-list.html';
        
    } catch (error) {
        console.error("❌ Error al actualizar:", error.message);
        alert(`Error al actualizar el usuario: ${error.message}`);
    }
}
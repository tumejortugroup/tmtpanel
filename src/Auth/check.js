document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded disparado');
    checkSession();
});

async function checkSession() {
    console.log('Función checkSession ejecutada');

    // Obtener el token de localStorage
    let token;
    try {
        token = localStorage.getItem('token');
    } catch (error) {
        console.error('Error al acceder a localStorage:', error);
        token = null;
    }

    // Verificar si el token existe y no está vacío
    if (!token || token.trim() === '') {
        console.log('Token inválido o no encontrado');
        window.location.href = '/dashboard/auth/sign-in.html';
        return;
    }

    console.log('Token obtenido:', token);

    // Validar el formato del token (opcional)
    if (!/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/.test(token)) {
        console.log('Token con formato inválido');
        window.location.href = '/dashboard/auth/sign-in.html';
        return;
    }

    try {
        // Realizar la solicitud al servidor para verificar la sesión
        const response = await fetch('http://localhost:9000/api/v1/auth/check', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            console.error('Respuesta del servidor no válida:', response.status);
            window.location.href = '/dashboard/auth/sign-in.html';
            return;
        }

        const data = await response.json();

        // Manejar la respuesta del servidor
        if (data.message === 'OK') {
            console.log('Sesión válida');
            // Continuar normalmente (no redirigir)
        } else if (data.message === 'NO') {
            console.log('Token inválido según el servidor');
            window.location.href = '/dashboard/auth/sign-in.html';
        } else {
            console.error('Respuesta inesperada del servidor:', data);
            window.location.href = '/dashboard/auth/sign-in.html';
        }
    } catch (error) {
        // Manejar errores de red o CORS
        console.error('Error al verificar la sesión:', error);
        window.location.href = '/dashboard/auth/sign-in.html';
    }
}

function parseJwt(token) {
    try {
        const base64Payload = token.split('.')[1];
        const payload = atob(base64Payload);
        return JSON.parse(payload);
    } catch (e) {
        console.error("Error al decodificar el token:", e);
        return null;
    }
}

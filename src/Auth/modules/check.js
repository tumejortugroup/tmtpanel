import { mostrarContenidoPorRol } from './ocultar.js';

export async function checkSession() {
    console.log('Función checkSession ejecutada');

    let token;
    try {
        token = localStorage.getItem('token');
    } catch (error) {
        console.error('Error al acceder a localStorage:', error);
        token = null;
    }

    if (!token || token.trim() === '') {
        console.log('Token inválido o no encontrado');
        window.location.href = '/dashboard/auth/sign-in.html';
        return;
    }

    console.log('Token obtenido:', token);

    if (!/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/.test(token)) {
        console.log('Token con formato inválido');
        window.location.href = '/dashboard/auth/sign-in.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:9000/api/v1/auth/check', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            console.error('Respuesta del servidor no válida:', response.status);
            window.location.href = '/dashboard/auth/sign-in.html';
            return;
        }

        const data = await response.json();

        if (data.message === 'OK') {
            console.log('Sesión válida');
            mostrarContenidoPorRol(token);
            return token // 👈 Aquí se llama la función de visibilidad
        } else {
            console.log('Token inválido según el servidor');
            window.location.href = '/dashboard/auth/sign-in.html';
        }

    } catch (error) {
        console.error('Error al verificar la sesión:', error);
        window.location.href = '/dashboard/auth/sign-in.html';
    }
}

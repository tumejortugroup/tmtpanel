import { mostrarContenidoPorRol } from './ocultar.js';

export async function checkSession() {

    let token;
    try {
        token = localStorage.getItem('token');
    } catch (error) {
        console.error('Error al acceder a localStorage:', error);
        token = null;
    }

    if (!token || token.trim() === '') {

        window.location.href = '/dashboard/auth/sign-in.html';
        return;
    }



    if (!/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/.test(token)) {
        window.location.href = '/dashboard/auth/sign-in.html';
        return;
    }

    try {
        const response = await fetch('https://my.tumejortugroup.com/api/v1/auth/check', {
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
   
            mostrarContenidoPorRol(token);
            return token // 👈 Aquí se llama la función de visibilidad
        } else {
            window.location.href = '/dashboard/auth/sign-in.html';
        }

    } catch (error) {
        console.error('Error al verificar la sesión:', error);
        window.location.href = '/dashboard/auth/sign-in.html';
    }
}

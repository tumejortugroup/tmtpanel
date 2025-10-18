import { mostrarSkeletonSpinner, ocultarSkeletonSpinner } from '/src/skeleton/skeletonSpinner.js';
import { mostrarErrorAuth, mostrarErrorGenerico } from '/src/skeleton/skeletonErrorSutil.js';

export function initAuth() {
    const loginForm = document.getElementById('login-form');

    if (!loginForm) return;

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const correo = document.getElementById('correo')?.value.trim();
        const password = document.getElementById('password')?.value;

        if (!correo || !password) {
            mostrarErrorGenerico('Por favor, completa todos los campos.');
            return;
        }

        // MOSTRAR SPINNER AL INICIAR LOGIN
        mostrarSkeletonSpinner({
            title: 'Iniciando sesión',
            subtitle: 'Verificando credenciales...'
        });

        try {
            const response = await fetch('https://my.tumejortugroup.com/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ correo, password })
            });

            if (!response.ok) {
                throw new Error('Error en la autenticación');
            }

            const data = await response.json();

            if (data?.token) {
                localStorage.setItem('token', data.token);
                
                // ESPERAR 1 SEGUNDO ANTES DE REDIRIGIR
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                ocultarSkeletonSpinner();
                window.location.href = '/dashboard/index.html';
            } else {
                ocultarSkeletonSpinner();
                mostrarErrorAuth();
            }

        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            ocultarSkeletonSpinner();
            
            // Esperar un momento antes de mostrar el error
            setTimeout(() => {
                mostrarErrorAuth();
            }, 300);
        }
    });
}
export function initAuth() {
    const loginForm = document.getElementById('login-form');

    if (!loginForm) return;

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const correo = document.getElementById('correo')?.value.trim();
        const password = document.getElementById('password')?.value;

        if (!correo || !password) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        try {

            const response = await fetch('https://my.tumejortugroup.com/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ correo, password})
            });

            if (!response.ok) {
                throw new Error('Error en la autenticación');
            }

            const data = await response.json();

            if (data?.token) {
                localStorage.setItem('token', data.token);
                window.location.href = '/dashboard/index.html';
            } else {
                alert(data.message || 'Credenciales inválidas');
            }

        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            alert('Email o contraseña incorrecto/s');/*AQUI*/
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (!loginForm) return;

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = document.getElementById('username')?.value.trim();
        const password = document.getElementById('password')?.value;

        if (!username || !password) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        try {
            const response = await fetch('http://localhost:9000/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
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
            alert('No se pudo conectar al servidor. Intenta más tarde.');
        }
    });
});

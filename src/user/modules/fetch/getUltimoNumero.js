export async function cargarUltimoNumeroUsuario() {
    try {
        const token = localStorage.getItem('token');
        const payload = JSON.parse(atob(token.split('.')[1]));
        const centroId = payload.centro_id;

        if (!centroId) {
            console.warn('No hay centro_id en el token');
            return;
        }

        const response = await fetch(`https://my.tumejortugroup.com/api/v1/usuarios/centro/numero?id_centro=${centroId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener el último número');
        }

        const result = await response.json();
        const ultimoNumero = result.numero_mas_alto || '000-00';
        const prefijo = ultimoNumero.substring(0, 3);
       
        const numeroActual = parseInt(prefijo) || 0;
        const siguienteNumero = numeroActual + 1;
        
        // Formatear con ceros a la izquierda (ej: 001, 045, 123)
        const nuevoNumero = siguienteNumero.toString().padStart(3, '0');

        // Actualizar el input
        const input = document.getElementById('cname');
        if (input) {
            input.value = nuevoNumero;
            input.setAttribute('data-bs-original-title', `Último número: ${prefijo}`);
            
            // Reinicializar tooltip si estás usando Bootstrap
            const tooltip = bootstrap.Tooltip.getInstance(input);
            if (tooltip) {
                tooltip.dispose();
            }
            new bootstrap.Tooltip(input);
        }

    } catch (error) {
        console.error('❌ Error al cargar último número de usuario:', error);
    }
}
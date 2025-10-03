
export async function getInformeDato(idUsuario, idDato) {
    try {
        const token = localStorage.getItem('token');
        
        const response = await fetch(`https://my.tumejortugroup.com/api/v1/datos/usuario/${idUsuario}/dato/${idDato}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener el informe del dato');
        }

        return data;
    } catch (error) {
        console.error('Error en getInformeDato:', error);
        throw error;
    }
}
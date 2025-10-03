export async function getInformeDatoHistorico(idUsuario) {
    try {
        const token = localStorage.getItem('token');
        
        const response = await fetch(`https://my.tumejortugroup.com/api/v1/datos/historico/${idUsuario}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener el historial de datos');
        }

        return data;
    } catch (error) {
        console.error('Error en getInformeDatoHistorico:', error);
        throw error;
    }
}
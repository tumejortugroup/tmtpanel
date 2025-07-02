export function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('Error al parsear JWT:', e);
        return null;
    }
}

export function getUserInfoFromToken(token) {
    const payload = parseJwt(token);
    if (!payload || !payload.nombre || !payload.rol) {
        console.error('Token inválido o sin información de usuario');
        return null;
    }
   

    return {
        nombre:  payload.nombre || '',
        rol: payload.rol || '',
        centro_id: payload.centro_id || null        
    };
}

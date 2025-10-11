export async function getEquivalencia(idPrincipal, idEquivalente, categoria, cantidadBase) {
    try {
        const url = `https://my.tumejortugroup.com/api/v1/equivalencias/calcular?id_alimento=${idPrincipal}&id_equivalente=${idEquivalente}&cantidad=${cantidadBase}&categoria=${categoria}`;
        

        const response = await fetch(url);

        if (!response.ok) {
            console.error("❌ Respuesta HTTP no OK:", response.status);
            throw new Error("Error al obtener equivalencia");
        }

        const data = await response.json();
      

        if (data.success && data.data?.equivalencia?.cantidad_equivalente !== undefined) {
            
            return data.data.equivalencia.cantidad_equivalente;
        } else {
            console.warn("⚠️ No se recibió una equivalencia válida:", data);
            return null;
        }
    } catch (error) {
        console.error("❌ Error al calcular equivalencia:", error);
        return null;
    }
}



export async function getEquivalencia2(idPrincipal, idEquivalente, categoria, cantidadBase) {
    try {
        const url = `https://my.tumejortugroup.com/api/v1/equivalencias/calcular?id_alimento=${idPrincipal}&id_equivalente=${idEquivalente}&cantidad=${cantidadBase}&categoria=${categoria}`;
     

        const response = await fetch(url);
        if (!response.ok) throw new Error("Error al obtener equivalencia 2");

        const data = await response.json();


        if (data.success && data.data?.equivalencia?.cantidad_equivalente !== undefined) {
            return data.data.equivalencia.cantidad_equivalente;
        } else {
            console.warn("⚠️ No se recibió una equivalencia válida (2)");
            return null;
        }
    } catch (error) {
        console.error("❌ Error al calcular equivalencia (2):", error);
        return null;
    }
}
export async function cargarPlantillasCentro() {
  const token = localStorage.getItem("token");
  const centro_id = localStorage.getItem("centro_id");

  if (!token || !centro_id) {
    console.warn("⚠️ Faltan datos: token o centro_id no encontrados en localStorage.");
    return;
  }

  const endpoint = `https://my.tumejortugroup.com/api/v1/plantillas/centro?id=${centro_id}`;

  try {
    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const plantillas = await response.json();
    
    const selectPlantillas = document.querySelector('select[name="datatable_length"]');
    
    if (!selectPlantillas) {
      console.error('No se encontró el select de plantillas');
      return;
    }

    selectPlantillas.innerHTML = '<option value="">Ninguna</option>';

    plantillas.forEach(plantilla => {
      const option = document.createElement('option');
      option.value = plantilla.id_plantilla;
      option.textContent = plantilla.nombre;
      selectPlantillas.appendChild(option);
    });


    // Event listener para capturar cambio de plantilla
    selectPlantillas.addEventListener('change', function() {
      const idPlantillaSeleccionada = this.value;
      
      if (idPlantillaSeleccionada) {
        const params = new URLSearchParams(window.location.search);
        const idDieta = params.get('id_dieta');
        const idDato = params.get('id_dato') || '';
        
        const nuevaURL = `/dashboard/dietas/wizardUpdatePlantilla.html?id_dieta=${idDieta}&id_dato=${idDato}&id_plantilla=${idPlantillaSeleccionada}`;
        

        window.location.href = nuevaURL;
      }
    });

  } catch (error) {
    console.error('❌ Error cargando plantillas:', error);
  }
}
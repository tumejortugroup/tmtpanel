// guardarControl.js
import { getFloat, getSelectValue, getValue } from '../utils/dom.js';
import { obtenerIdUsuarioDesdeUrl } from '../utils/params.js';
import { crearDieta } from './createDieta.js'; // Importar la función

function getUltimoIndex() {
  const inputs = document.querySelectorAll('tbody input[data-index], tbody select[data-index]');
  let max = 0;
  inputs.forEach(el => {
    const idx = parseInt(el.getAttribute('data-index'));
    if (!isNaN(idx) && idx > max) {
      max = idx;
    }
  });
  return max;
}

export async function guardarControl() {
  const idUsuario = obtenerIdUsuarioDesdeUrl();
  if (!idUsuario) {
    console.warn('ID de usuario no encontrado en la URL');
    return;
  }

  const index = getUltimoIndex();
  console.log('Última columna detectada para guardar [index=' + index + ']');

  const datos = {
    id_usuario: parseInt(idUsuario),
    nombre: getValue('nombre', index),
    fecha: getValue('fecha', index),
    edad: getFloat('edad', index),
    altura: getFloat('altura', index),
    peso: getFloat('peso', index),
    genero: getSelectValue('genero', index),
    grado_actividad: getSelectValue('actividad', index),
    objetivo: getSelectValue('objetivo', index),
    peso_oseo_rocha: getFloat('peso_oseo_rocha', index),
    peso_residual: getFloat('peso_residual', index),
    porcentaje_residual: getFloat('porcentaje_residual', index),
    peso_extracelular: getFloat('peso_extracelular', index),
    porcentaje_extracelular: getFloat('porcentaje_extracelular', index),
    peso_intracelular: getFloat('peso_intracelular', index),
    porcentaje_intracelular: getFloat('porcentaje_intracelular', index),
    imc: getFloat('imc', index),
    cuello: getFloat('cuello', index),
    brazo: getFloat('brazo', index),
    cintura: getFloat('cintura', index),
    abdomen: getFloat('abdomen', index),
    cadera: getFloat('cadera', index),
    muslo: getFloat('muslo', index),
    triceps: getFloat('triceps', index),
    subescapular: getFloat('subescapular', index),
    abdomen_pliegue: getFloat('abdomen_pliegue', index),
    supra_iliaco: getFloat('supra_iliaco', index),
    muslo_pliegue: getFloat('muslo_pliegue', index),
    suma_pliegues: getFloat('suma_pliegues', index),
    porcentaje_graso_perimetros: getFloat('grasa_perimetral', index),
    porcentaje_graso_estimado_pliegues: getFloat('grasa_pliegues', index),
    kg_grasa: getFloat('kg_grasa', index),
    kg_masa_magra: getFloat('kg_masa_magra', index),
    indice_masa_magra: getFloat('indice_masa_magra', index),
    humero_biepicondileo: getFloat('humero_bicondileo', index),
    femur_bicondileo: getFloat('femur_bicondileo', index),
    muneca_estiloideo: getFloat('muneca_estiloideo', index),
    complex_osea: getFloat('complexion_osea', index),
    muneca_circunferencia: getFloat('muneca_circunferencia', index),
    tdee: getFloat('tdee', index),
    calorias_datos: getFloat('tdee_ajustado', index),
    carbohidratos_datos: getFloat('gramos_carbohidratos', index),
    grasas_datos: getFloat('gramos_grasas', index),
    proteinas_datos: getFloat('gramos_proteinas', index)
  };

  console.log('Datos capturados para guardar:', datos);

  try {
    const token = localStorage.getItem('token');

    const res = await fetch('https://my.tumejortugroup.com/api/v1/datos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(datos)
    });

    const result = await res.json();

    if (!result.success) {
      console.error('Error al guardar:', result);
      alert('No se pudo guardar el control.');
      return;
    }

    // Obtener el id_dato devuelto por el backend
    const id_dato = result.data?.id_dato || result.id_dato;
    
    if (!id_dato) {
      console.error('No se recibió id_dato del backend');
      alert('Control guardado pero sin ID. No se puede crear la dieta.');
      return;
    }

    console.log('Control guardado correctamente. ID:', id_dato);

    // Mostrar modal de SweetAlert
    const modalResult = await Swal.fire({
      title: 'Control guardado con éxito',
      text: 'Elige qué quieres hacer:',
      icon: 'success',
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: 'Hacer dieta',
      denyButtonText: 'Ver control',
      cancelButtonText: 'Seguiré luego',
      customClass: {
        actions: 'd-flex flex-column gap-2 w-100 px-4 pb-3',
        confirmButton: 'btn btn-primary w-100',
        denyButton: 'btn btn-outline-primary w-100',
        cancelButton: 'btn bg-transparent text-gray-normal w-100'
      },
      buttonsStyling: false,
    });

  if (modalResult.isConfirmed) {
    // Opción 1: Hacer dieta 
    const id_dieta = await crearDieta(idUsuario, id_dato);
    if (id_dieta) {
      alert("✅ Dieta creada y asignada con éxito.");
      window.location.href = `/dashboard/dietas/wizard.html?id_dieta=${id_dieta}&id_dato=${id_dato}`;
    }
    
  } else if (modalResult.isDenied) {
    // Opción 2: Ver control 
    const id_dieta = await crearDieta(idUsuario, id_dato);
    if (id_dieta) {
      alert("✅ Dieta creada con éxito.");
      window.location.href = `/controles/detalle.html?id_dato=${id_dato}`;
    }
    
  } else if (modalResult.dismiss === Swal.DismissReason.cancel) {
    // Opción 3: Seguiré luego 
    const id_dieta = await crearDieta(idUsuario, id_dato);
    if (id_dieta) {
      alert("✅ Dieta creada con éxito.");
      window.location.href = '/dashboard/index.html';
    }
  }
  } catch (err) {
    console.error('Error en la petición POST:', err);
    alert('Error de red al guardar el control.');
  }
}
import { getFloat, getSelectValue, getValue } from '../utils/dom.js';
import { obtenerIdUsuarioDesdeUrl } from '../utils/params.js';

export async function guardarControl(index) {
  const idUsuario = obtenerIdUsuarioDesdeUrl();
  if (!idUsuario) {
    console.warn('⚠️ ID de usuario no encontrado en la URL');
    return;
  }

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

  console.log('📤 Datos capturados para guardar:', datos);

  try {
    const token = localStorage.getItem('token');

    const res = await fetch('http://localhost:9000/api/v1/datos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(datos)
    });

    const result = await res.json();

    if (!result.success) {
      console.error('❌ Error al guardar:', result);
      alert('❌ No se pudo guardar el control.');
    } else {
      console.log('✅ Control guardado correctamente.');
      alert('✅ Control guardado con éxito.');
    }

  } catch (err) {
    console.error('❌ Error en la petición POST:', err);
    alert('❌ Error de red al guardar el control.');
  }
}

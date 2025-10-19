// guardarControl.js
import { getFloat, getSelectValue, getValue } from '../utils/dom.js';
import { obtenerIdUsuarioDesdeUrl } from '../utils/params.js';
import { crearDieta } from './createDieta.js';

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
  console.log('🔍 Última columna detectada para guardar [index=' + index + ']');

  // Capturar valores con logs individuales
  console.log('\n=== 📋 DATOS BÁSICOS ===');
  const nombre = getValue('nombre', index);
  const fecha = getValue('fecha', index);
  const edad = getFloat('edad', index);
  const altura = getFloat('altura', index);
  const peso = getFloat('peso', index);
  const genero = getSelectValue('genero', index);
  const grado_actividad = getSelectValue('actividad', index);
  const objetivo = getSelectValue('objetivo', index);
  
  console.log('Nombre:', nombre);
  console.log('Fecha:', fecha);
  console.log('Edad:', edad);
  console.log('Altura:', altura);
  console.log('Peso:', peso);
  console.log('Género:', genero);
  console.log('Actividad:', grado_actividad);
  console.log('Objetivo:', objetivo);

  console.log('\n=== 🦴 COMPOSICIÓN ÓSEA Y RESIDUAL ===');
  const peso_oseo_rocha = getFloat('peso_oseo_rocha', index);
  const peso_residual = getFloat('peso_residual', index);
  const porcentaje_residual = getFloat('porcentaje_residual', index);
  
  console.log('Peso óseo Rocha:', peso_oseo_rocha);
  console.log('Peso residual:', peso_residual);
  console.log('% Residual:', porcentaje_residual);

  console.log('\n=== 💧 AGUA CORPORAL ===');
  const peso_extracelular = getFloat('peso_extracelular', index);
  const porcentaje_extracelular = getFloat('porcentaje_extracelular', index);
  const peso_intracelular = getFloat('peso_intracelular', index);
  const porcentaje_intracelular = getFloat('porcentaje_intracelular', index);
  
  console.log('Peso extracelular:', peso_extracelular);
  console.log('% Extracelular:', porcentaje_extracelular);
  console.log('Peso intracelular:', peso_intracelular);
  console.log('% Intracelular:', porcentaje_intracelular);

  console.log('\n=== 📏 PERÍMETROS (CM) ===');
  const imc = getFloat('imc', index);
  const cuello = getFloat('cuello', index);
  const brazo = getFloat('brazo', index);
  const cintura = getFloat('cintura', index);
  const abdomen = getFloat('abdomen', index);
  const cadera = getFloat('cadera', index);
  const muslo = getFloat('muslo', index);
  
  console.log('IMC:', imc);
  console.log('Cuello:', cuello);
  console.log('Brazo:', brazo);
  console.log('Cintura:', cintura);
  console.log('Abdomen:', abdomen);
  console.log('Cadera:', cadera);
  console.log('Muslo:', muslo);

  console.log('\n=== 📐 PLIEGUES (MM) ===');
  const triceps = getFloat('triceps', index);
  const subescapular = getFloat('subescapular', index);
  const abdomen_pliegue = getFloat('abdomen_pliegue', index);
  const supra_iliaco = getFloat('supra_iliaco', index);
  const muslo_pliegue = getFloat('muslo_pliegue', index);
  const suma_pliegues = getFloat('suma_pliegues', index);
  
  console.log('Tríceps:', triceps);
  console.log('Subescapular:', subescapular);
  console.log('Abdomen:', abdomen_pliegue);
  console.log('Suprailiaco:', supra_iliaco);
  console.log('Muslo:', muslo_pliegue);
  console.log('Suma pliegues:', suma_pliegues);

  console.log('\n=== 🧈 GRASA CORPORAL ===');
  const porcentaje_graso_perimetros = getFloat('grasa_perimetral', index);
  const porcentaje_graso_estimado_pliegues = getFloat('grasa_pliegues', index);
  const kg_grasa = getFloat('kg_grasa', index);
  const peso_graso = getFloat('peso_graso', index); // ✅ AÑADIDO
  
  console.log('% Grasa (perímetros):', porcentaje_graso_perimetros);
  console.log('% Grasa (pliegues):', porcentaje_graso_estimado_pliegues);
  console.log('Kg grasa:', kg_grasa);
  console.log('Peso graso (kg):', peso_graso); // ✅ AÑADIDO

  console.log('\n=== 💪 MASA MAGRA Y MUSCULAR ===');
  const kg_masa_magra = getFloat('kg_masa_magra', index);
  const indice_masa_magra = getFloat('indice_masa_magra', index);
  const porcentaje_masa_magra = getFloat('porcentaje_masa_magra', index); // ✅ AÑADIDO
  const peso_muscular = getFloat('peso_muscular', index); // ✅ AÑADIDO
  const porcentaje_masa_muscular = getFloat('porcentaje_masa_muscular', index); // ✅ AÑADIDO
  
  console.log('Kg masa magra:', kg_masa_magra);
  console.log('Índice masa magra:', indice_masa_magra);
  console.log('% Masa magra:', porcentaje_masa_magra); // ✅ AÑADIDO
  console.log('Peso muscular (kg):', peso_muscular); // ✅ AÑADIDO
  console.log('% Masa muscular:', porcentaje_masa_muscular); // ✅ AÑADIDO

  console.log('\n=== 🦴 DIÁMETROS ÓSEOS (CM) ===');
  const humero_biepicondileo = getFloat('humero_bicondileo', index);
  const femur_bicondileo = getFloat('femur_bicondileo', index);
  const muneca_estiloideo = getFloat('muneca_estiloideo', index);
  const complex_osea = getFloat('complexion_osea', index);
  const muneca_circunferencia = getFloat('muneca_circunferencia', index);
  
  console.log('Húmero bicondíleo:', humero_biepicondileo);
  console.log('Fémur bicondíleo:', femur_bicondileo);
  console.log('Muñeca estiloideo:', muneca_estiloideo);
  console.log('Complexión ósea:', complex_osea);
  console.log('Muñeca circunferencia:', muneca_circunferencia);

  console.log('\n=== 🍽️ MACRONUTRIENTES ===');
  const tdee = getFloat('tdee', index);
  const calorias_datos = getFloat('tdee_ajustado', index);
  const carbohidratos_datos = getFloat('gramos_carbohidratos', index);
  const grasas_datos = getFloat('gramos_grasas', index);
  const proteinas_datos = getFloat('gramos_proteinas', index);
  
  console.log('TDEE:', tdee);
  console.log('Calorías ajustadas:', calorias_datos);
  console.log('Carbohidratos (g):', carbohidratos_datos);
  console.log('Grasas (g):', grasas_datos);
  console.log('Proteínas (g):', proteinas_datos);

  const datos = {
    id_usuario: parseInt(idUsuario),
    nombre,
    fecha,
    edad,
    altura,
    peso,
    genero,
    grado_actividad,
    objetivo,
    peso_oseo_rocha,
    peso_residual,
    porcentaje_residual,
    peso_extracelular,
    porcentaje_extracelular,
    peso_intracelular,
    porcentaje_intracelular,
    imc,
    cuello,
    brazo,
    cintura,
    abdomen,
    cadera,
    muslo,
    triceps,
    subescapular,
    abdomen_pliegue,
    supra_iliaco,
    muslo_pliegue,
    suma_pliegues,
    porcentaje_graso_perimetros,
    porcentaje_graso_estimado_pliegues,
    kg_grasa,
    kg_masa_magra,
    indice_masa_magra,
    humero_biepicondileo,
    femur_bicondileo,
    muneca_estiloideo,
    complex_osea,
    muneca_circunferencia,
    tdee,
    calorias_datos,
    carbohidratos_datos,
    grasas_datos,
    proteinas_datos,
    porcentaje_masa_magra, // ✅ Ahora definido
    peso_muscular, // ✅ Ahora definido
    peso_graso, // ✅ Ahora definido
    porcentaje_masa_muscular // ✅ Ahora definido
  };

  console.log('\n=== 📦 OBJETO COMPLETO A ENVIAR ===');
  console.log(JSON.stringify(datos, null, 2));

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
      console.error('❌ Error al guardar:', result);
      alert('No se pudo guardar el control.');
      return;
    }

    console.log('✅ Respuesta del servidor:', result);

    const id_dato = result.data?.id_dato || result.id_dato;
    
    if (!id_dato) {
      console.error('❌ No se recibió id_dato del backend');
      alert('Control guardado pero sin ID. No se puede crear la dieta.');
      return;
    }

    console.log('✅ ID dato recibido:', id_dato);

    const informeUrl = `/dashboard/controles/informe.html?id_usuario=${idUsuario}&id_dato=${id_dato}`;
      
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
      const id_dieta = await crearDieta(idUsuario, id_dato);
      if (id_dieta) {
        alert("✅ Dieta creada y asignada con éxito.");
        window.open(informeUrl, '_blank');
        window.location.href = `/dashboard/dietas/wizard.html?id_dieta=${id_dieta}&id_dato=${id_dato}`;
      }
    } else if (modalResult.isDenied) {
      const id_dieta = await crearDieta(idUsuario, id_dato);
      if (id_dieta) {
        alert("✅ Dieta creada con éxito.");
        window.location.href = `/dashboard/controles/informe.html?id_usuario=${idUsuario}&id_dato=${id_dato}`;
      }
    } else if (modalResult.dismiss === Swal.DismissReason.cancel) {
      const id_dieta = await crearDieta(idUsuario, id_dato);
      if (id_dieta) {
        alert("✅ Dieta creada con éxito.");
        window.open(informeUrl, '_blank');
        window.location.href = '/dashboard/index.html';
      }
    }
  } catch (err) {
    console.error('❌ Error en la petición POST:', err);
    alert('Error de red al guardar el control.');
  }
}
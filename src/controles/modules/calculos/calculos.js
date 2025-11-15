// core/calcularTodo.js

import { getFloat, getSelectValue, setValue } from '../utils/dom.js';

import { calcularIMC } from '../formulas/imc.js';
import {
  bmrMifflinStJeor,
  bmrHarrisBenedict,
  bmrFaoOmsUnu,
  bmrKatchMcArdle,
  bmrPromedio
} from '../formulas/bmr.js';

import {
  grasaPorPerimetros,
  grasaPorPliegues,
  sumaPliegues
} from '../formulas/grasa.js';

import {
  pesoOseoRocha,
  pesoResidual,
  pesoExtraIntracelular,
  calcularMasaMagraYGrasa,
  indiceMasaMagra,
  complexionOsea,
  pesoMuscular,     // ← modelo CIENTÍFICO (pero no se usará)
  pesoGraso,
  porcentajeMuscularRegla3,   // ← AÑADIDO
  pesoMuscularVersionPDF      // ← AÑADIDO
} from '../formulas/composicion.js';

import { calcularTDEE, ajustarTDEE } from '../formulas/tdee.js';
import { calcularMacronutrientes } from '../formulas/macros.js';

export function calcularTodo(index = 0) {
  const peso = getFloat('peso', index);
  const altura = getFloat('altura', index);
  const edad = getFloat('edad', index);
  const genero = getSelectValue('genero', index).toLowerCase();
  const actividad = getSelectValue('actividad', index);
  const objetivo = getSelectValue('objetivo', index);

  const grasaPerimetral = grasaPorPerimetros({
    genero,
    altura,
    cuello: getFloat('cuello', index),
    cintura: getFloat('cintura', index),
    cadera: getFloat('cadera', index)
  });

  const pliegues = {
    triceps: getFloat('triceps', index),
    subescapular: getFloat('subescapular', index),
    abdomen_pliegue: getFloat('abdomen_pliegue', index),
    supra_iliaco: getFloat('supra_iliaco', index),
    muslo_pliegue: getFloat('muslo_pliegue', index)
  };

  const grasaPliegues = grasaPorPliegues({ genero, pliegues, edad });
  const suma = sumaPliegues(pliegues);

  const porcentajeGraso = grasaPliegues || grasaPerimetral;

  const datos = { peso, altura, edad, genero, porcentajeGraso };

  // IMC
  setValue('imc', calcularIMC(peso, altura), index);

  // Grasa corporal
  setValue('grasa_perimetral', grasaPerimetral, index);
  setValue('grasa_pliegues', grasaPliegues, index);
  setValue('suma_pliegues', suma, index);

  // BMR
  setValue('bmr_mifflin', bmrMifflinStJeor(datos), index);
  setValue('bmr_harris', bmrHarrisBenedict(datos), index);
  setValue('bmr_fao', bmrFaoOmsUnu(datos), index);
  setValue('bmr_katch', bmrKatchMcArdle(datos), index);
  setValue('bmr_promedio', bmrPromedio(datos), index);

  // Peso óseo (Rocha)
  const pesoOseo = pesoOseoRocha({
    altura,
    muneca_estiloideo: getFloat('muneca_estiloideo', index),
    humero_biepicondileo: getFloat('humero_bicondileo', index),
    femur_bicondileo: getFloat('femur_bicondileo', index)
  });

  setValue('peso_oseo_rocha', pesoOseo, index);
  const porcentajeOseo = (pesoOseo / peso) * 100;
  setValue('porcentaje_oseo', porcentajeOseo, index);

  // Peso residual (NO lo usa el PDF, pero se deja para compatibilidad)
  const { kg: pr, porcentaje: prPct } = pesoResidual(peso, genero);
  setValue('peso_residual', pr, index);
  setValue('porcentaje_residual', prPct * 100, index);

  // Agua corporal
  const { ext, pExt, int, pInt } = pesoExtraIntracelular(peso, genero);
  setValue('peso_extracelular', ext, index);
  setValue('porcentaje_extracelular', pExt * 100, index);
  setValue('peso_intracelular', int, index);
  setValue('porcentaje_intracelular', pInt * 100, index);

  // Masa magra y masa grasa
  const { masaMagra, grasa } = calcularMasaMagraYGrasa(peso, porcentajeGraso);
  setValue('kg_masa_magra', masaMagra, index);
  setValue('kg_grasa', grasa, index);
  setValue('indice_masa_magra', indiceMasaMagra(masaMagra, altura), index);
  setValue('porcentaje_masa_magra', (masaMagra / peso) * 100, index);

  /* ----------------------------------------------------
     🔥 MODELO EXACTO DEL PDF (Regla de 3)
     % muscular = 100 − (% graso + % óseo)
     kg muscular = pesoTotal × %muscular
  ---------------------------------------------------- */

  const pctMuscularPDF = porcentajeMuscularRegla3(peso, porcentajeGraso, pesoOseo);
  setValue('porcentaje_masa_muscular', pctMuscularPDF, index);

  const kgMuscularPDF = pesoMuscularVersionPDF(peso, pctMuscularPDF);
  setValue('peso_muscular', kgMuscularPDF, index);

  // Peso graso tradicional
  const { kg: kgGraso, porcentaje: pctGraso } = pesoGraso(peso, porcentajeGraso);
  setValue('peso_graso', kgGraso, index);
  setValue('porcentaje_graso', pctGraso, index);

  // Complexión
  const complexion = complexionOsea({
    altura,
    muñeca: getFloat('muneca_estiloideo', index)
  });

  setValue('complexion_osea', complexion, index);

  // TDEE
  const tdee = calcularTDEE(bmrPromedio(datos), actividad);
  const tdeeAjustado = ajustarTDEE(tdee, objetivo);
  setValue('tdee', tdee, index);
  setValue('tdee_ajustado', tdeeAjustado, index);

  // Macronutrientes
  const macros = calcularMacronutrientes(tdeeAjustado);
  setValue('gramos_proteinas', macros.proteinas, index);
  setValue('gramos_grasas', macros.grasas, index);
  setValue('gramos_carbohidratos', macros.carbohidratos, index);
}

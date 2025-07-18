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
    complexionOsea
    } from '../formulas/composicion.js';
    import { calcularTDEE, ajustarTDEE } from '../formulas/tdee.js';
    import { calcularMacronutrientes } from '../formulas/macros.js';

    export function calcularTodo() {
        const peso = getFloat('peso');
        const altura = getFloat('altura');
        const edad = getFloat('edad');
        const genero = getSelectValue('genero').toLowerCase();
        const actividad = getSelectValue('actividad');
        const objetivo = getSelectValue('objetivo');

  

        const grasaPerimetral = grasaPorPerimetros({
            genero,
            altura,
            cuello: getFloat('cuello'),
            cintura: getFloat('cintura'),
            cadera: getFloat('cadera')
        });

        const pliegues = {
            subescapular: getFloat('subescapular'),
            abdomen_pliegue: getFloat('abdomen_pliegue'),
            supra_iliaco: getFloat('supra_iliaco'),
            muslo_pliegue: getFloat('muslo_pliegue')
        };

        const grasaPliegues = grasaPorPliegues({ genero, pliegues });
        const suma = sumaPliegues(pliegues);
        const porcentajeGraso = grasaPliegues || grasaPerimetral;

        const datos = { peso, altura, edad, genero, porcentajeGraso };

        // IMC
        setValue('imc', calcularIMC(peso, altura));

        // Grasa corporal
        setValue('grasa_perimetral', grasaPerimetral);
        setValue('grasa_pliegues', grasaPliegues);
        setValue('suma_pliegues', suma);

        // BMR
        setValue('bmr_mifflin', bmrMifflinStJeor(datos));
        setValue('bmr_harris', bmrHarrisBenedict(datos));
        setValue('bmr_fao', bmrFaoOmsUnu(datos));
        setValue('bmr_katch', bmrKatchMcArdle(datos));
        setValue('bmr_promedio', bmrPromedio(datos));

        // Composición corporal
        console.log('peso oseo rocha:', pesoOseoRocha({
            altura,
            muneca_estiloideo: getFloat('muneca_estiloideo'),
            femur_bicondileo: getFloat('femur_bicondileo')
            }));
        setValue('peso_oseo_rocha', pesoOseoRocha({
            altura,
            muneca_estiloideo: getFloat('muneca_estiloideo'),
            femur_bicondileo: getFloat('femur_bicondileo')
        }));

        const { kg: pr, porcentaje: prPct } = pesoResidual(peso, genero);
        setValue('peso_residual', pr);
        setValue('porcentaje_residual', prPct * 100);

        const { ext, pExt, int, pInt } = pesoExtraIntracelular(peso, genero);
        setValue('peso_extracelular', ext);
        setValue('porcentaje_extracelular', pExt * 100);
        setValue('peso_intracelular', int);
        setValue('porcentaje_intracelular', pInt * 100);

        const { masaMagra, grasa } = calcularMasaMagraYGrasa(peso, porcentajeGraso);
        setValue('kg_masa_magra', masaMagra);
        setValue('kg_grasa', grasa);
        setValue('indice_masa_magra', indiceMasaMagra(masaMagra, altura));
        console.log('complexion_osea', complexionOsea({ altura, muñeca: getFloat('muneca_estiloideo') }))
        setValue('complexion_osea', complexionOsea({ altura, muñeca: getFloat('muneca_estiloideo') }));



        // TDEE
        const tdee = calcularTDEE(bmrPromedio(datos), actividad);
        const tdeeAjustado = ajustarTDEE(tdee, objetivo);
        setValue('tdee', tdee);
        setValue('tdee_ajustado', tdeeAjustado);

        // Macronutrientes
        const macros = calcularMacronutrientes(tdeeAjustado);
        setValue('gramos_proteinas', macros.proteinas);
        setValue('gramos_grasas', macros.grasas);
        setValue('gramos_carbohidratos', macros.carbohidratos);
    }

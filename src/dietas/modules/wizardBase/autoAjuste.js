import { obtenerDieta } from '/src/dietas/modules/wizard/fetch/getDieta.js';
import { obtenerDetalleDato } from '/src/dietas/modules/wizardBase/fetch/getPeso.js';
import { inicializarGrafico } from '/src/dietas/modules/wizardBase/ui/inicializarGrafico.js';
import { actualizarGraficoMacronutrientes } from '/src/dietas/modules/wizardBase/ui/actualizarGrafico.js';
import { inicializarAutoAjuste } from '/src/dietas/modules/wizardBase/autoajuste/inicializarAutoAjuste.js';
import { configurarBotones } from '/src/dietas/modules/wizardBase/utils/configurarBotones.js';
import { cargarDietasUsuario, renderizarSelectDietas } from '/src/dietas/modules/wizardBase/fetch/cargarDietas.js';
import { setCaloriasObjetivo } from '/src/dietas/modules/wizardBase/utils/caloriasStore.js'; 

export async function ejecutarAutoAjuste() {

  
  inicializarGrafico();
  configurarBotones();

  try {
    const detalle = await obtenerDetalleDato();
    const peso = parseFloat(detalle?.data?.peso);
    const id_usuario = detalle?.data?.id_usuario;



    if (id_usuario) {
      const dietas = await cargarDietasUsuario(id_usuario);
      renderizarSelectDietas(dietas);
    }

    const dieta = await obtenerDieta();
    const datos = dieta?.data;

    if (!datos || isNaN(peso)) {
      console.error("❌ Faltan datos para inicializar.");
      return;
    }

    const {
      calorias_dieta,
      proteinas_dieta,
      grasas_dieta,
      carbohidratos_dieta
    } = datos;

    const calorias = parseFloat(calorias_dieta);
    const proteinas = parseFloat(proteinas_dieta);
    const grasas = parseFloat(grasas_dieta);
    const carbohidratos = parseFloat(carbohidratos_dieta);


    if ([proteinas, grasas, carbohidratos].some(v => isNaN(v))) {
      console.error("❌ Algún dato de macronutriente no es válido:", { proteinas, grasas, carbohidratos });
      return;
    }

    // ✅ GUARDAR calorías objetivo en el store
    setCaloriasObjetivo(calorias);

    await inicializarAutoAjuste();

    actualizarGraficoMacronutrientes(calorias, proteinas, grasas, carbohidratos);


  } catch (error) {
    console.error("❌ Error al inicializar el autoajuste:", error);
  }
}
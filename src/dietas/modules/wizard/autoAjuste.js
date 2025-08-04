import { obtenerDieta } from '/src/dietas/modules/wizard/fetch/getDieta.js';
import { obtenerDetalleDato } from '/src/dietas/modules/wizard/fetch/getPeso.js';
import { inicializarGrafico } from '/src/dietas/modules/wizard/ui/inicializarGrafico.js';
import { actualizarGraficoMacronutrientes } from '/src/dietas/modules/wizard/ui/actualizarGrafico.js';
import { inicializarAutoAjuste } from '/src/dietas/modules/wizard/autoajuste/inicializarAutoajuste.js';
import { configurarBotones } from '/src/dietas/modules/wizard/utils/configurarBotones.js';

export async function ejecutarAutoAjuste() {
  inicializarGrafico();
  configurarBotones();

  try {
    const detalle = await obtenerDetalleDato();
    const peso = parseFloat(detalle?.data?.peso);

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

    // Convertir strings a números de forma segura
    const calorias = parseFloat(calorias_dieta);
    const proteinas = parseFloat(proteinas_dieta);
    const grasas = parseFloat(grasas_dieta);
    const carbohidratos = parseFloat(carbohidratos_dieta);

    if ([proteinas, grasas, carbohidratos].some(v => isNaN(v))) {
      console.error("❌ Algún dato de macronutriente no es válido:", { proteinas, grasas, carbohidratos });
      return;
    }
        await inicializarAutoAjuste();
    actualizarGraficoMacronutrientes(calorias,proteinas, grasas, carbohidratos);

  } catch (error) {
    console.error("❌ Error al inicializar el autoajuste:", error);
  }
}

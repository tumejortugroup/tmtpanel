import { getDieta } from '/src/dietas/modules/plantilla/fetch/getDieta.js';
import { obtenerDetalleDato } from '/src/dietas/modules/plantilla/fetch/getPeso.js';
import { inicializarGrafico } from '/src/dietas/modules/plantilla/ui/inicializarGrafico.js';
import { actualizarGraficoMacronutrientes } from '/src/dietas/modules/plantilla/ui/actualizarGrafico.js';
import { inicializarAutoAjuste } from '/src/dietas/modules/plantilla/autoajuste/inicializarAutoAjuste.js';
import { configurarBotones } from '/src/dietas/modules/plantilla/utils/configurarBotones.js';
import { cargarDietasUsuario, renderizarSelectDietas } from '/src/dietas/modules/plantilla/fetch/cargarDietas.js';
import { setCaloriasObjetivo } from '/src/dietas/modules/plantilla/utils/caloriasStore.js'; 

export async function ejecutarAutoAjuste(idDieta) {
  
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

    // getDieta devuelve un array, necesitamos el primer elemento
    const dietaData = await getDieta(idDieta);
    
    // ⬇️ ACCEDER AL PRIMER ELEMENTO DEL ARRAY
    const datos = Array.isArray(dietaData) ? dietaData[0] : dietaData;

    if (!datos || isNaN(peso)) {
      console.error("❌ Faltan datos para inicializar.");
      console.log("Datos recibidos:", { datos, peso, idDieta });
      return;
    }

    console.log("📊 Datos de la dieta:", datos);

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

    if ([calorias, proteinas, grasas, carbohidratos].some(v => isNaN(v))) {
      console.error("❌ Algún dato de macronutriente no es válido:", { 
        calorias, 
        proteinas, 
        grasas, 
        carbohidratos 
      });
      return;
    }

    console.log("✅ Datos de macros cargados:", { 
      calorias, 
      proteinas, 
      grasas, 
      carbohidratos 
    });

    // ✅ GUARDAR calorías objetivo en el store
    setCaloriasObjetivo(calorias);

    await inicializarAutoAjuste();

    actualizarGraficoMacronutrientes(calorias, proteinas, grasas, carbohidratos);

  } catch (error) {
    console.error("❌ Error al inicializar el autoajuste:", error);
  }
}
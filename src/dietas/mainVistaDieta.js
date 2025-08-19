import { obtenerIdDietaDesdeUrl } from '/src/dietas/modules/wizard/utils/params.js';
import { fetchInformeDieta } from '/src/dietas/modules/informe/fetchInforme.js';

document.addEventListener("DOMContentLoaded", () => {
    const idDieta = obtenerIdDietaDesdeUrl();
    console.log(idDieta)
    fetchInformeDieta(idDieta);
});

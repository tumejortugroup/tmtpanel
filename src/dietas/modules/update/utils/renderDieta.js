
// 🔧 Función auxiliar para capitalizar
function capitalizar(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export async function renderDieta({ data, comidas }) {

    const nombreInput = document.getElementById("nombre-dieta");
  const descripcionTextarea = document.getElementById("descripcion-dieta");

  if (data && data.length > 0) {
    if (nombreInput) nombreInput.value = data[0].nombre_dieta || "";
    if (descripcionTextarea) descripcionTextarea.value = data[0].descripcion || "";
  }

  const contenedor = document.getElementById("tabla-container");
  const tablas = contenedor.querySelectorAll(".table-dieta");

  Object.values(comidas).forEach((comida, index) => {
    const tabla = tablas[index];
    if (!tabla) return;

    // 🟢 Cabecera: tipo de comida
    const tipoComidaSelect = tabla.querySelector("select[name='tipo-comida']");
    if (tipoComidaSelect && comida.tipo_comida) {
      const tipoNormalizado = comida.tipo_comida.toLowerCase();
      const opcion = [...tipoComidaSelect.options].find(
        opt => opt.textContent.toLowerCase() === tipoNormalizado
      );
      if (opcion) tipoComidaSelect.value = opcion.textContent;
    }

    // 🟢 Cabecera: hora
    const horaInput = tabla.querySelector("input[name='cantidad-alimentos']");
    if (horaInput) horaInput.value = comida.hora || "";

    // 🟢 Filas de alimentos
    const filas = tabla.querySelectorAll("tbody tr");
    comida.alimentos.forEach((al, idx) => {
      const fila = filas[idx];
      if (!fila) return;

      // Categoria → capitalizamos para que coincida con <option>
      const categoriaSelect = fila.querySelector("select[name='select-categoria']");
      if (categoriaSelect && al.categoria) {
        const categoriaCap = capitalizar(al.categoria);
        const opcion = [...categoriaSelect.options].find(
          opt => opt.textContent.toLowerCase() === al.categoria.toLowerCase()
        );
        if (opcion) categoriaSelect.value = opcion.textContent;
        else categoriaSelect.value = categoriaCap;
      }

      // Alimento principal
      const alimentoSelect = fila.querySelectorAll("select[name='select-alimentos']")[0];
      if (alimentoSelect) {
        if (!alimentoSelect.querySelector(`option[value='${al.id_alimento}']`)) {
          const opt = document.createElement("option");
          opt.value = al.id_alimento;
          opt.textContent = al.nombre_alimento;
          alimentoSelect.appendChild(opt);
        }
        alimentoSelect.value = al.id_alimento;
      }

      // Cantidad
      const cantidadInput = fila.querySelector(".input-cantidad");
      if (cantidadInput) cantidadInput.value = al.cantidad;

      // Equivalente 1
      const eq1 = fila.querySelectorAll("select[name='select-alimentos']")[1];
      if (eq1 && al.id_alimento_equivalente) {
        if (!eq1.querySelector(`option[value='${al.id_alimento_equivalente}']`)) {
          const opt = document.createElement("option");
          opt.value = al.id_alimento_equivalente;
          opt.textContent = al.nombre_alimento_equivalente;
          eq1.appendChild(opt);
        }
        eq1.value = al.id_alimento_equivalente;
      }
      const cantEq1 = fila.querySelectorAll("td")[4];
      if (cantEq1) cantEq1.textContent = al.cantidad_equivalente || "";

      // Equivalente 2
      const eq2 = fila.querySelectorAll("select[name='select-alimentos']")[2];
      if (eq2 && al.id_alimento_equivalente1) {
        if (!eq2.querySelector(`option[value='${al.id_alimento_equivalente1}']`)) {
          const opt = document.createElement("option");
          opt.value = al.id_alimento_equivalente1;
          opt.textContent = al.nombre_alimento_equivalente1;
          eq2.appendChild(opt);
        }
        eq2.value = al.id_alimento_equivalente1;
      }
      const cantEq2 = fila.querySelectorAll("td")[6];
      if (cantEq2) cantEq2.textContent = al.cantidad_equivalente1 || "";
    });

    // 🟢 Observaciones
    const obs = tabla.querySelector(".text-dieta");
    if (obs) obs.value = comida.notas || "";
  });
}

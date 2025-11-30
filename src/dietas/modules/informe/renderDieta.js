import { agruparPorTipoComida } from "./agruparComida.js";

/* ============================================================
   BOTONES
============================================================ */
function wireButtons() {
  const btnPDF = document.getElementById("btn-export-pdf");
  const btnPrint = document.getElementById("btn-print");

  if (!btnPDF || !btnPrint) return;

  btnPrint.addEventListener("click", () => window.print());
  btnPDF.addEventListener("click", generarPDF);
}

/* ============================================================
   CONVERSIÓN mm → px
============================================================ */
function mmToPx(mm) {
  return (mm * 96) / 25.4;
}
function crearPagina(headerReal = null) {
  const PAGE_W = mmToPx(210);
  const PAGE_H = mmToPx(297);

  const MARGIN_LEFT  = mmToPx(15);
  const MARGIN_RIGHT = mmToPx(15);

  // Primera página: header grande
  const HEADER_H = headerReal ? mmToPx(20) : mmToPx(5);

  const FOOTER_H = mmToPx(18);
  const GAP = mmToPx(4);

  // Ajustamos la altura del body dependiendo del header
  const BODY_MAX = PAGE_H - HEADER_H - FOOTER_H - GAP * 2 - mmToPx(5);

  /* Página A4 */
  const page = document.createElement("div");
  page.className = "pdf-page";
  page.style.position = "relative";
  page.style.width = PAGE_W + "px";
  page.style.height = PAGE_H + "px";
  page.style.margin = "0 auto";
  page.style.background = "white";
  page.style.overflow = "hidden";
  page.style.boxSizing = "border-box";

  /* FOOTER */
  const footer = document.createElement("div");
  footer.className = "pdf-footer";
  footer.style.position = "absolute";
  footer.style.bottom = mmToPx(25) + "px";
  footer.style.left = MARGIN_LEFT + "px";
  footer.style.right = MARGIN_RIGHT + "px";
  footer.style.height = FOOTER_H + "px";
  footer.style.borderTop = "1px solid #ccc";
  footer.style.textAlign = "center";
  footer.style.fontSize = "12px";
  footer.style.display = "flex";
  footer.style.alignItems = "center";
  footer.style.justifyContent = "center";
 

  /* WRAPPER */
  const wrapper = document.createElement("div");
  wrapper.style.position = "absolute";
  wrapper.style.top = "0";
  wrapper.style.bottom = FOOTER_H + mmToPx(12) + "px";
  wrapper.style.left = MARGIN_LEFT + "px";
  wrapper.style.right = MARGIN_RIGHT + "px";
  wrapper.style.boxSizing = "border-box";
  wrapper.style.overflow = "hidden";

  /* HEADER */
  const header = document.createElement("div");
  header.style.height = HEADER_H + "px";

  if (headerReal) {
    const clone = headerReal.cloneNode(true);
    clone.style.height = "100%";
    header.appendChild(clone);
  }

  /* BODY */
  const body = document.createElement("div");
  body.className = "pdf-body";
  body.style.position = "absolute";
  body.style.top = HEADER_H + GAP + "px";
  body.style.left = "0";
  body.style.right = "0";
  body.style.maxHeight = BODY_MAX + "px";
  body.style.overflow = "hidden";

  wrapper.appendChild(header);
  wrapper.appendChild(body);
  page.appendChild(wrapper);
  page.appendChild(footer);

  return { page, body, BODY_MAX };
}


/* ============================================================
   GENERAR PDF CON SALTOS PERFECTOS
============================================================ */
function generarPDF() {
  const informe = document.getElementById("informe-dieta");
  if (!informe) return;

  const originalHTML = informe.innerHTML;

  const headerReal = document.querySelector(".informe-header");

  const bloques = [...informe.children].filter(
    el => !el.classList.contains("informe-header")
  );

  const temp = document.createElement("div");
  temp.style.position = "absolute";
  temp.style.left = "-9999px";
  document.body.appendChild(temp);

  /* Primera página */
  let { page, body, BODY_MAX } = crearPagina(headerReal);
  temp.appendChild(page);

  let currentHeight = 0;

bloques.forEach(bloque => {

    // Primero clonamos para medirlo SIN estilos rotos
    const tempClone = bloque.cloneNode(true);
    temp.appendChild(tempClone);

    const blockHeight = tempClone.offsetHeight;

    tempClone.remove();

    // SI NO CABE, creamos página nueva
    if (currentHeight + blockHeight > BODY_MAX) {
        const next = crearPagina(null);
        page = next.page;
        body = next.body;
        BODY_MAX = next.BODY_MAX;
        temp.appendChild(page);
        currentHeight = 0;
    }

    // --- AQUÍ CAMBIA LA MAGIA ---
    // Lo añadimos y volvemos a medir REAL dentro del body final
    body.appendChild(bloque);

    const realHeight = body.scrollHeight;

    // Si al meterlo SE HA PASADO → Lo quitamos y pasamos el bloque entero a la siguiente página
    if (realHeight > BODY_MAX) {
        bloque.remove();

        // Nueva página
        const next = crearPagina(null);
        page = next.page;
        body = next.body;
        BODY_MAX = next.BODY_MAX;
        temp.appendChild(page);
        currentHeight = 0;

        // Ahora sí lo metemos en la página nueva
        body.appendChild(bloque);
    }

    // Actualizamos altura actual
    currentHeight = body.scrollHeight;
});


  informe.innerHTML = temp.innerHTML;
  temp.remove();

  html2pdf()
    .set({
      margin: 0,
      filename: "informe-dieta.pdf",
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "pt", format: "a4", orientation: "portrait" }
    })
    .from(informe)
    .save()
    .then(() => {
      informe.innerHTML = originalHTML;
    });
}

/* ============================================================
   FORMAT
============================================================ */
function format(value, unit = "") {
  if (!value || value === "null") return "—";
  return unit ? `${value}${unit}` : value;
}

/* ============================================================
   RENDER DEL INFORME EN PANTALLA
============================================================ */
/* ============================================================
   RENDER DEL INFORME EN PANTALLA
============================================================ */
export function renderInformeDieta(data) {
  if (!data?.length) return;

  const gen = data[0];

  const container = document.getElementById("informe-dieta");
  container.innerHTML = "";

  /* HEADER SOLO EN PANTALLA */
  container.insertAdjacentHTML(
    "beforeend",
    `
    <div class="informe-header" contenteditable="true">
      <div class="header-logo">
        <img src="/assets/images/icons/logo.png" class="logo-informe">
      </div>

      <div>
        <p><strong>Nombre:</strong> ${gen.nombre_usuario} ${gen.apellido_usuario}</p>
        <p><strong>Kcal:</strong> ${gen.calorias_dieta}</p>
        <p><strong>Inicio:</strong> ${gen.fecha_creacion.split(" ")[0]}</p>
      </div>

      <div>
        <p><strong>Validez:</strong> Mensual</p>
        <p><strong>Revisión:</strong> —</p>
        <p><strong>Responsable:</strong> —</p>
      </div>
    </div>
    `
  );

  /* AGRUPAR COMIDAS */
  const comidasAgrupadas = agruparPorTipoComida(data);
  const comidasOrdenadas = Object.entries(comidasAgrupadas).sort(
    ([, A], [, B]) => (A[0]?.hora ?? "").localeCompare(B[0]?.hora ?? "")
  );

  /* BLOQUES */
  comidasOrdenadas.forEach(([tipo, items]) => {
    const bloque = document.createElement("div");
    bloque.classList.add("bloque-comida");
    bloque.setAttribute("contenteditable", "true");

    const hora = items[0]?.hora?.slice(0, 5) ?? "—";

    /* TABLA SOLO SI NO ES SUPLEMENTACIÓN */
    let tablaHTML = "";
    if (tipo.toUpperCase() !== "SUPLEMENTACION") {
      const alimentosHTML = items
        .map((i) => {
          const partes = [];
          partes.push(`${format(i.nombre_alimento)} (${format(i.cantidad, "g")})`);

          if (i.nombre_alimento_equivalente)
            partes.push(
              `${format(i.nombre_alimento_equivalente)} (${format(
                i.cantidad_equivalente,
                "g"
              )})`
            );

          if (i.nombre_alimento_equivalente1)
            partes.push(
              `${format(i.nombre_alimento_equivalente1)} (${format(
                i.cantidad_equivalente1,
                "g"
              )})`
            );

          if (i.nombre_alimento_equivalente3)
            partes.push(
              `${format(i.nombre_alimento_equivalente3)} (${format(
                i.cantidad_equivalente3,
                "g"
              )})`
            );

          return `<tr><td>${partes.join(" / ")}</td></tr>`;
        })
        .join("");

      tablaHTML = `
        <div class="bloque-tabla">
          <table class="tabla-comida">
            <thead><tr><th>Alimentos</th></tr></thead>
            <tbody>${alimentosHTML}</tbody>
          </table>
        </div>
      `;
    }

    /* OBSERVACIONES */
    const observaciones = [
      ...new Set(items.filter((i) => i.notas).map((i) => i.notas)),
    ];

    const obsHTML = observaciones.length
      ? `
    <div class="bloque-observaciones">
      <h6>Observaciones</h6>
      <div>${observaciones.map((n) => `📝 ${n}`).join("<br>")}</div>
    </div>`
      : "";

    /* HTML FINAL DEL BLOQUE */
    bloque.innerHTML = `
      <div class="bloque-header">
        <h5>${tipo.toUpperCase()}</h5>
        <small>⏰ ${hora}</small>
      </div>

      ${tablaHTML}

      ${obsHTML}
    `;

    container.appendChild(bloque);
  });

  /* NOTAS FINALES */
  container.insertAdjacentHTML(
    "beforeend",
    `
    <div class="informe-notas" contenteditable="true">
      <p>1.- Beber 2-3 litros de agua diariamente.</p>
      <p>2.- Cocinar al horno, plancha, vapor o airfryer.</p>
      <p>3.- Pesar alimentos en crudo.</p>
      <p>4.- Aceite 20g/día salvo indicación contraria.</p>
    </div>
    `
  );
}



/* ============================================================
   START
============================================================ */
document.addEventListener("DOMContentLoaded", wireButtons);

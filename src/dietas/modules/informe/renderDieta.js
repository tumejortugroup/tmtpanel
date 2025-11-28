import { agruparPorTipoComida } from "./agruparComida.js";

/* ============================================================
   🔵 BOTONES REALES DEL HTML
============================================================ */
function wireButtons() {
  const btnPDF = document.getElementById("btn-export-pdf");
  const btnPrint = document.getElementById("btn-print");

  if (!btnPDF || !btnPrint) {
    console.error("❌ No se encontraron los botones en el HTML");
    return;
  }

  btnPrint.addEventListener("click", () => window.print());
  btnPDF.addEventListener("click", generarPDF);
}

function getResponsable(gen) {
  const prep = `${gen.nombre_preparador || ""} ${gen.apellido_preparador || ""}`.trim();
  const prop = `${gen.nombre_propietario || ""} ${gen.apellido_propietario || ""}`.trim();

  if (prep && prep !== "") return prep;
  if (prop && prop !== "") return prop;
  return "—";
}


/* ============================================================
   🟩 FORMAT evita null(nullg) → devuelve "—"
============================================================ */
function format(value, unit = "") {
  if (value === null || value === undefined || value === "" || value === "null")
    return "—";
  return unit ? `${value}${unit}` : value;
}

/* ============================================================
   📄 GENERAR PDF CON HEADER + FOOTER + SALTOS PERFECTOS
============================================================ */
function generarPDF() {
  const informe = document.getElementById("informe-dieta");
  if (!informe) return;

  if (typeof html2pdf === "undefined") {
    alert("❌ Falta html2pdf");
    return;
  }

  const gen = window.__GEN_DATA__;

  /* HEADER solo para PDF */
  const headerHTML = `
    <div style="display:flex; justify-content:space-between; margin-bottom:15px;">
      <img src="/assets/images/icons/logo.png" style="height:55px;">
      <div style="font-size:13px;">
        <p><strong>Nombre:</strong> ${format(gen.nombre_usuario)} ${format(gen.apellido_usuario)}</p>
        <p><strong>Kcal:</strong> ${format(gen.calorias_dieta)}</p>
        <p><strong>Inicio:</strong> ${gen.fecha_creacion.split(" ")[0]}</p>
      </div>
      <div style="font-size:13px;">
        <p><strong>Validez:</strong> Mensual</p>
        <p><strong>Revisión:</strong> —</p>
       <p><strong>Responsable:</strong> ${getResponsable(gen)}</p>
      </div>
    </div>
  `;

  /* FOOTER fijo */
  const footerHTML = `
    <div style="width:100%; text-align:center; padding-top:6px;
                font-size:12px; color:#777; border-top:1px solid #ccc;">
      TU MEJOR TU — Informe Nutricional
    </div>
  `;

  /* Guardar contenido original */
  const originalHTML = informe.innerHTML;

  /* Crear contenedor temporal */
  const temp = document.createElement("div");
  temp.style.width = "210mm";
  temp.style.position = "absolute";
  temp.style.left = "-9999px";
  temp.innerHTML = originalHTML;
  document.body.appendChild(temp);

  const bloques = [...temp.children];
  temp.innerHTML = "";

  const A4_PX = 1122;
  const headerHeight = 160;
  const footerHeight = 80;
  const usableHeight = A4_PX - headerHeight - footerHeight;

  /* Crear primera página */
  let pagina = crearPagina(headerHTML, footerHTML);
  temp.appendChild(pagina);

  let currentHeight = 0;
  const body = () => pagina.querySelector(".pdf-body");

  /* Añadir bloques */
  bloques.forEach((b) => {
    body().appendChild(b);

    const rect = body().getBoundingClientRect();

    if (rect.height > usableHeight) {
      body().removeChild(b);

      pagina = crearPagina(headerHTML, footerHTML);
      temp.appendChild(pagina);

      body().appendChild(b);
    }
  });

  /* Inyectar en DOM */
  informe.innerHTML = temp.innerHTML;
  temp.remove();

  const opt = {
    margin: 0,
    filename: "informe-dieta.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, scrollY: 0, useCORS: true },
    jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
  };

  setTimeout(() => {
    html2pdf()
      .set(opt)
      .from(informe)
      .save()
      .then(() => {
        informe.innerHTML = originalHTML;
      });
  }, 200);
}

/* ============================================================
   🟦 PÁGINA BASE PARA PDF
============================================================ */
function crearPagina(headerHTML, footerHTML) {
  const p = document.createElement("div");
  p.style.minHeight = "297mm";
  p.style.padding = "20px 25px";
  p.style.position = "relative";

  p.innerHTML = `
    ${headerHTML}
    <div class="pdf-body" style="min-height:200mm; margin-top:10px;"></div>
    ${footerHTML}
  `;

  return p;
}

/* ============================================================
   🟧 RENDER NORMAL EN PANTALLA
============================================================ */
export function renderInformeDieta(data) {
  if (!Array.isArray(data) || !data.length) return;

  window.__GEN_DATA__ = data[0];

  ensureEditorToolbar();
  wireButtons();

  const container = document.getElementById("informe-dieta");
  container.innerHTML = "";
  container.classList.add("a4-informe");

  const comidasAgrupadas = agruparPorTipoComida(data);
  const comidasOrdenadas = Object.entries(comidasAgrupadas).sort(
    ([, A], [, B]) => (A[0]?.hora ?? "").localeCompare(B[0]?.hora ?? "")
  );

  comidasOrdenadas.forEach(([tipo, items]) => {
    const bloque = document.createElement("div");
    bloque.classList.add("bloque-comida");
    bloque.setAttribute("contenteditable", "true");

    const hora = items[0]?.hora?.slice(0, 5) ?? "—";

    let tabla = "";
    if (tipo.toUpperCase() !== "SUPLEMENTACION") {
      tabla = `
        <div class="bloque-tabla">
          <table class="tabla-comida">
            <thead><tr><th>Alimento</th></tr></thead>
            <tbody>
              ${items
                .map((i) => {
                  const arr = [];
                  arr.push(`${format(i.nombre_alimento)} (${format(i.cantidad, "g")})`);

                  if (i.nombre_alimento_equivalente)
                    arr.push(`${format(i.nombre_alimento_equivalente)} (${format(i.cantidad_equivalente, "g")})`);

                  if (i.nombre_alimento_equivalente1)
                    arr.push(`${format(i.nombre_alimento_equivalente1)} (${format(i.cantidad_equivalente1, "g")})`);

                  if (i.nombre_alimento_equivalente3)
                    arr.push(`${format(i.nombre_alimento_equivalente3)} (${format(i.cantidad_equivalente3, "g")})`);

                  return `<tr><td>${arr.join(" / ")}</td></tr>`;
                })
                .join("")}
            </tbody>
          </table>
        </div>
      `;
    }

    const notas = [...new Set(items.filter((i) => i.notas).map((i) => i.notas))];
    const obs = notas.length
      ? `<div class="bloque-observaciones">
          <h6>Observaciones</h6>
          <div>${notas.map((n) => `📝 ${n}`).join("<br>")}</div>
        </div>`
      : "";

    bloque.innerHTML = `
      <div class="bloque-header">
        <h5>${tipo.toUpperCase()}</h5>
        <small>⏰ ${hora}</small>
      </div>
      ${tabla}
      ${obs}
    `;

    container.appendChild(bloque);
  });

  container.insertAdjacentHTML(
    "beforeend",
    `
    <div class="informe-notas" contenteditable="true">
      <p>1.- Beber 2-3 litros de agua...</p>
      <p>2.- Cocinar al horno...</p>
      <p>3.- Pesar alimentos...</p>
      <p>4.- Aceite 20g/día...</p>
    </div>
  `
  );
}

/* ============================================================
   🟪 TOOLBAR
============================================================ */
function ensureEditorToolbar() {
  if (document.getElementById("editor-toolbar")) return;

  const toolbar = document.createElement("div");
  toolbar.id = "editor-toolbar";
  toolbar.className = "no-print";
  toolbar.style.cssText = `display:flex; gap:6px; padding:10px;`;

  toolbar.innerHTML = `
    <button data-cmd="bold">B</button>
    <button data-cmd="italic">I</button>
    <button data-cmd="underline">U</button>
    <button data-cmd="removeFormat">Clear</button>
  `;

  const informe = document.getElementById("informe-dieta");
  informe.parentElement.insertBefore(toolbar, informe);

  toolbar.addEventListener("click", (e) => {
    const cmd = e.target.dataset.cmd;
    if (cmd) document.execCommand(cmd);
  });
}

/* ============================================================
   AUTO
============================================================ */
document.addEventListener("DOMContentLoaded", wireButtons);

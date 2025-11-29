import { getInformeDato } from "../fetch/fetchInforme.js";
import { getInformeDatoHistorico } from "../fetch/fetchInformeHistorico.js";

/* ============================================================
   PARÁMETROS
============================================================ */
const urlParams = new URLSearchParams(window.location.search);
const idUsuario = urlParams.get("id_usuario");
const idDato = urlParams.get("id_dato");

if (!idUsuario || !idDato) {
  document.getElementById("container").innerHTML =
    '<div class="error">Error: Faltan parámetros</div>';
} else {
  cargarDatos();
}

async function cargarDatos() {
  try {
    const [datoResult, historicoResult] = await Promise.all([
      getInformeDato(idUsuario, idDato),
      getInformeDatoHistorico(idUsuario)
    ]);

    if (!datoResult.success || !historicoResult.success)
      throw new Error("No se pudieron cargar los datos");

    renderizarInforme(datoResult.data, historicoResult.data);

  } catch (error) {
    document.getElementById("container").innerHTML =
      `<div class="error">${error.message}</div>`;
  }
}

/* ============================================================
   HELPERS
============================================================ */
function formatearValor(valor) {
  if (!valor || valor === "0" || valor === "0.00") return "-";
  const n = parseFloat(valor);
  return isNaN(n) ? "-" : n.toFixed(2);
}

function mmToPx(mm) {
  return (mm * 96) / 25.4;
}

/* ============================================================
   CREAR PÁGINA A4 (HEADER SOLO EN LA PRIMERA)
============================================================ */
function crearPagina(headerContenido = null) {
  const PAGE_W = mmToPx(210);
  const PAGE_H = mmToPx(297);

  const MARGIN_LR = mmToPx(15);
  const HEADER_H = mmToPx(25);
  const FOOTER_H = mmToPx(18);
  const GAP = mmToPx(5);

  const BODY_MAX =
    PAGE_H - HEADER_H - FOOTER_H - GAP * 3;

  const page = document.createElement("div");
  page.className = "pdf-page";
  page.style.position = "relative";
  page.style.width = PAGE_W + "px";
  page.style.height = PAGE_H + "px";
  page.style.margin = "0 auto 15px";
  page.style.background = "white";
  page.style.overflow = "hidden";

  /* HEADER SOLO EN LA PRIMERA */
  const header = document.createElement("div");
  header.style.position = "absolute";
  header.style.left = `${MARGIN_LR}px`;
  header.style.right = `${MARGIN_LR}px`;
  header.style.top = `${mmToPx(5)}px`;
  header.style.height = `${HEADER_H}px`;
  if (headerContenido) header.appendChild(headerContenido.cloneNode(true));

  /* BODY */
  const body = document.createElement("div");
  body.style.position = "absolute";
  body.style.top = HEADER_H + GAP + "px";
  body.style.left = `${MARGIN_LR}px`;
  body.style.right = `${MARGIN_LR}px`;
  body.style.height = BODY_MAX + "px";
  body.style.overflow = "hidden";
  body.style.boxSizing = "border-box";

  /* FOOTER FIJO */
  const footer = document.createElement("div");
  footer.style.position = "absolute";
  footer.style.left = `${MARGIN_LR}px`;
  footer.style.right = `${MARGIN_LR}px`;
  footer.style.bottom = mmToPx(10) + "px";
  footer.style.height = FOOTER_H + "px";
  footer.style.borderTop = "1px solid #ccc";
  footer.style.fontSize = "12px";
  footer.style.display = "flex";
  footer.style.alignItems = "center";
  footer.style.justifyContent = "center";
  footer.innerText = "TU MEJOR TU — Informe Antropométrico";

  page.appendChild(header);
  page.appendChild(body);
  page.appendChild(footer);

  return { page, body, BODY_MAX };
}

/* ============================================================
   RENDER PRINCIPAL — SOLO 2 PÁGINAS
============================================================ */
export function renderizarInforme(dato, historico) {
  const container = document.getElementById("container");

  /* ----------- PÁGINA 1 ----------- */
  const bloquePrincipal = document.createElement("div");
  bloquePrincipal.innerHTML = generarBloquePrincipal(dato);

  const header = document.createElement("div");
  header.className = "header";
  header.innerHTML = `
    <div class="logo">
      <img src="/assets/images/icons/logo.png" class="logo-informe">
    </div>
    <div class="header-info">
      <strong>Visita:</strong> ${dato.nombre_control} <br>
      <strong>Fecha:</strong> ${dato.fecha}
    </div>
  `;

  const { page: page1, body: body1 } = crearPagina(header);
  body1.appendChild(bloquePrincipal);

  /* ----------- PÁGINA 2 (sin paginar)—ambas tablas juntas ----------- */
  const bloqueSegundaPagina = document.createElement("div");
  bloqueSegundaPagina.innerHTML = `
    <div>${renderizarTablaPerimetros(historico, idDato)}</div>
    <br><br>
    <div>${renderizarTablaComposicion(historico, idDato)}</div>
  `;

  const { page: page2, body: body2 } = crearPagina(null);
  body2.appendChild(bloqueSegundaPagina);

  /* ----------- RENDER FINAL ----------- */
  container.innerHTML = `
    <div id="render-final">
      ${page1.outerHTML}
      ${page2.outerHTML}
    </div>
  `;

  ensureEditorToolbar();
  ensureExportButtons();
  wireExportButtons();
}

/* ============================================================
   BLOQUE PRINCIPAL
============================================================ */
function generarBloquePrincipal(dato) {
  return `
    <div class="pagina1" contenteditable="true">

      <div class="datos-personales">
        <div>
          <strong>Nombre:</strong> ${dato.nombre}<br>
          <strong>Fecha de nacimiento:</strong> ${dato.fecha_de_nacimiento}<br>
          <strong>Teléfono:</strong> ${dato.telefono}
        </div>
        <div>
          <strong>Edad:</strong> ${dato.edad}<br>
          <strong>Altura:</strong> ${formatearValor(dato.altura)} cm<br>
          <strong>E-mail:</strong> ${dato.correo}
        </div>
      </div>

      <div class="section-title">* CM, CIRCUNFERENCIAS MUSCULARES *</div>
      <div class="medidas-grid">
        <div>
          <div class="medida-row"><strong>CUELLO:</strong> ${formatearValor(dato.cuello)} cm</div>
          <div class="medida-row"><strong>BRAZO:</strong> ${formatearValor(dato.brazo)} cm</div>
          <div class="medida-row"><strong>CINTURA:</strong> ${formatearValor(dato.cintura)} cm</div>
        </div>
        <div>
          <div class="medida-row"><strong>ABDOMEN:</strong> ${formatearValor(dato.abdomen)} cm</div>
          <div class="medida-row"><strong>CADERA:</strong> ${formatearValor(dato.cadera)} cm</div>
          <div class="medida-row"><strong>MUSLO:</strong> ${formatearValor(dato.muslo)} cm</div>
        </div>
      </div>

      <div class="section-title">* PLIEGUES CUTÁNEOS *</div>
      <div class="medidas-grid">
        <div>
          <div class="medida-row"><strong>TRÍCEPS:</strong> ${formatearValor(dato.triceps)} mm</div>
          <div class="medida-row"><strong>SUBESCAPULAR:</strong> ${formatearValor(dato.subescapular)} mm</div>
          <div class="medida-row"><strong>ABDOMEN:</strong> ${formatearValor(dato.abdomen_pliegue)} mm</div>
        </div>
        <div>
          <div class="medida-row"><strong>SUPRA-ILÍACO:</strong> ${formatearValor(dato.supra_iliaco)} mm</div>
          <div class="medida-row"><strong>MUSLO:</strong> ${formatearValor(dato.muslo_pliegue)} mm</div>
        </div>
      </div>

      <div class="section-title">* COMPOSICIÓN CORPORAL *</div>
      <div class="medidas-grid">
        <div>
          <div class="composicion-row">
            <strong>PESO GRASO:</strong> ${formatearValor(dato.peso_graso)} kg
          </div>
          <div class="composicion-row">
            <strong>PESO ÓSEO:</strong> ${formatearValor(dato.peso_oseo_rocha)} kg
          </div>
          <div class="composicion-row">
            <strong>PESO MUSCULAR:</strong> ${formatearValor(dato.peso_muscular)} kg
          </div>
        </div>
        <div>
          <div class="composicion-row">
            <strong>PESO RESIDUAL:</strong> ${formatearValor(dato.peso_residual)} kg
          </div>
          <div class="composicion-row">
            <strong>PESO EXTRA:</strong> ${formatearValor(dato.peso_extracelular)} kg
          </div>
          <div class="composicion-row">
            <strong>PESO INTRA:</strong> ${formatearValor(dato.peso_intracelular)} kg
          </div>
        </div>
      </div>

      <div class="peso-global">
        <strong>PESO GLOBAL:</strong> ${formatearValor(dato.peso)} kg
      </div>

    </div>
  `;
}

/* ============================================================
   TABLA 1 — PERÍMETROS
============================================================ */
function renderizarTablaPerimetros(hist, idActual) {
  return `
    <table>
      <thead>
        <tr>
          <th>FECHA</th>
          <th>CONTROL</th>
          <th>CUELLO</th>
          <th>BRAZO</th>
          <th>CINTURA</th>
          <th>ABDOMEN</th>
          <th>CADERA</th>
          <th>MUSLO</th>
        </tr>
      </thead>
      <tbody>
        ${hist
          .map(
            h => `
          <tr class="${h.id_dato == idActual ? "destacado" : ""}">
            <td>${h.fecha}</td>
            <td>${h.nombre_control}</td>
            <td>${h.cuello}</td>
            <td>${h.brazo}</td>
            <td>${h.cintura}</td>
            <td>${h.abdomen}</td>
            <td>${h.cadera}</td>
            <td>${h.muslo}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;
}

/* ============================================================
   TABLA 2 — COMPOSICIÓN
============================================================ */
function renderizarTablaComposicion(hist, idActual) {
  return `
    <table>
      <thead>
        <tr>
          <th>FECHA</th>
          <th>PESO</th>
          <th>PESO GRASO</th>
          <th>PESO MUSCULAR</th>
          <th>PESO ÓSEO</th>
          <th>IMM</th>
          <th>% GRASO</th>
        </tr>
      </thead>
      <tbody>
        ${hist
          .map(
            h => `
          <tr class="${h.id_dato == idActual ? "destacado" : ""}">
            <td>${h.fecha}</td>
            <td>${h.peso}</td>
            <td>${h.peso_graso}</td>
            <td>${h.peso_muscular}</td>
            <td>${h.peso_oseo_rocha}</td>
            <td>${h.indice_masa_magra}</td>
            <td>${h.porcentaje_graso_estimado_pliegues}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;
}

/* ============================================================
   TOOLBAR + BOTONES
============================================================ */
function ensureEditorToolbar() {
  if (document.getElementById("editor-toolbar")) return;

  const bar = document.createElement("div");
  bar.id = "editor-toolbar";
  bar.style.cssText =
    "position:sticky;top:0;background:#eee;padding:10px;z-index:9999;display:flex;gap:10px;";
  bar.innerHTML = `
    <button data-cmd="bold">B</button>
    <button data-cmd="italic">I</button>
    <button data-cmd="underline">U</button>
  `;
  document.body.prepend(bar);

  bar.addEventListener("click", e => {
    const cmd = e.target.dataset.cmd;
    if (cmd) document.execCommand(cmd);
  });
}

function ensureExportButtons() {
  if (document.getElementById("export-buttons")) return;

  const wrap = document.createElement("div");
  wrap.id = "export-buttons";
  wrap.style.cssText =
    "position:fixed;bottom:20px;right:20px;display:flex;flex-direction:column;gap:10px;z-index:9999;";
  wrap.innerHTML = `
    <button id="btn-export-pdf">📄 PDF</button>
    <button id="btn-print">🖨️ Imprimir</button>
  `;
  document.body.appendChild(wrap);
}

function wireExportButtons() {
  document.getElementById("btn-print").onclick = () => window.print();

  /* ============================================================
     EXPORTACIÓN PDF PÁGINA POR PÁGINA
  ============================================================ */
  document.getElementById("btn-export-pdf").onclick = async () => {
    const paginas = document.querySelectorAll(".pdf-page");

    if (!paginas.length) {
      alert("No hay páginas para exportar");
      return;
    }

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      unit: "mm",
      format: "a4",
      orientation: "portrait"
    });

    let primera = true;

    for (const pag of paginas) {
      const canvas = await html2canvas(pag, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff"
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0);

      if (!primera) pdf.addPage();
      primera = false;

      pdf.addImage(imgData, "JPEG", 0, 0, 210, 297);
    }

    pdf.save("informe-antropometrico.pdf");
  };
}

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
    console.error(error);
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
   CREAR PÁGINA A4
============================================================ */
function crearPagina(headerContenido = null) {
  const PAGE_W = mmToPx(210);
  const PAGE_H = mmToPx(297);

  const MARGIN_LR = mmToPx(15);
  const HEADER_H = mmToPx(25);
  const FOOTER_H = mmToPx(18);
  const GAP = mmToPx(5);

  const BODY_MAX = PAGE_H - HEADER_H - FOOTER_H - GAP * 3;

  const page = document.createElement("div");
  page.className = "pdf-page";
  page.style.position = "relative";
  page.style.width = PAGE_W + "px";
  page.style.height = PAGE_H + "px";
  page.style.margin = "0 auto 15px";
  page.style.background = "white";
  page.style.overflow = "hidden";

  /* HEADER */
  const header = document.createElement("div");
  header.style.position = "absolute";
  header.style.left = MARGIN_LR + "px";
  header.style.right = MARGIN_LR + "px";
  header.style.top = mmToPx(5) + "px";
  header.style.height = HEADER_H + "px";

  if (headerContenido)
    header.appendChild(headerContenido.cloneNode(true));

  /* BODY */
  const body = document.createElement("div");
  body.style.position = "absolute";
  body.style.top = HEADER_H + GAP + "px";
  body.style.left = MARGIN_LR + "px";
  body.style.right = MARGIN_LR + "px";
  body.style.height = BODY_MAX + "px";
  body.style.overflow = "hidden";
  body.style.boxSizing = "border-box";

  /* FOOTER */
  const footer = document.createElement("div");
  footer.style.position = "absolute";
  footer.style.left = MARGIN_LR + "px";
  footer.style.right = MARGIN_LR + "px";
  footer.style.bottom = mmToPx(10) + "px";
  footer.style.height = FOOTER_H + "px";
  footer.style.textAlign = "center";
  footer.style.display = "flex";
  footer.style.alignItems = "center";
  footer.style.justifyContent = "center";
  footer.style.fontSize = "12px";
  footer.style.borderTop = "1px solid #ccc";
  footer.innerText = "TU MEJOR TU — Informe Antropométrico";

  page.appendChild(header);
  page.appendChild(body);
  page.appendChild(footer);

  return { page, body, BODY_MAX };
}

/* ============================================================
   PAGINADO AUTOMÁTICO
============================================================ */
function paginar(bloques, headerReal) {
  const temp = document.createElement("div");
  temp.style.position = "absolute";
  temp.style.left = "-9999px";
  document.body.appendChild(temp);

  let { page, body, BODY_MAX } = crearPagina(headerReal);
  temp.appendChild(page);

  let usado = 0;

  bloques.forEach(b => {
    const clone = b.cloneNode(true);
    temp.appendChild(clone);

    const h = clone.offsetHeight;
    clone.remove();

    if (usado + h > BODY_MAX) {
      const nueva = crearPagina();
      page = nueva.page;
      body = nueva.body;
      BODY_MAX = nueva.BODY_MAX;
      usado = 0;
      temp.appendChild(page);
    }

    body.appendChild(b);
    usado += h;
  });

  return temp.innerHTML;
}

/* ============================================================
   RENDER PRINCIPAL
============================================================ */
export function renderizarInforme(dato, historico) {
  const container = document.getElementById("container");

  const bloquePrincipal = document.createElement("div");
  bloquePrincipal.className = "bloque-principal";
  bloquePrincipal.innerHTML = generarBloquePrincipal(dato);

  const bloqueProgreso = document.createElement("div");
  bloqueProgreso.className = "bloque-progreso";

  /* 👇 INSERTAMOS LAS DOS TABLAS UNA DEBAJO DE LA OTRA */
  bloqueProgreso.innerHTML =
    renderizarTablaPerimetros(historico, idDato) +
    "<br><br>" +
    renderizarTablaComposicion(historico, idDato);

  const header = document.createElement("div");
  header.className = "header";
  header.innerHTML = `
    <div class="logo">
      <img src="/assets/images/icons/logo.png" class="logo-informe">
    </div>
    <div class="header-info">
      <div><strong>Visita:</strong> ${dato.nombre_control}</div>
      <div><strong>Fecha:</strong> ${dato.fecha}</div>
    </div>
  `;

  const { page, body } = crearPagina(header);
  body.appendChild(bloquePrincipal);

  const paginasExtras = paginar([bloqueProgreso], header);

  container.innerHTML = `
    <div id="render-final">
      ${page.outerHTML}
      ${paginasExtras}
    </div>
  `;

  ensureEditorToolbar();
  ensureExportButtons();
  wireExportButtons();
}

/* ============================================================
   BLOQUE PRINCIPAL — PÁGINA 1
============================================================ */
function generarBloquePrincipal(dato) {
  return `
    <div class="pagina1" contenteditable="true">

      <div class="datos-personales">
        <div>
          <div><strong>Nombre:</strong> ${dato.nombre}</div>
          <div><strong>Fecha de nacimiento:</strong> ${dato.fecha_de_nacimiento}</div>
          <div><strong>Teléfono:</strong> ${dato.telefono}</div>
        </div>
        <div>
          <div><strong>Edad:</strong> ${dato.edad}</div>
          <div><strong>Altura:</strong> ${formatearValor(dato.altura)} cm</div>
          <div><strong>E-mail:</strong> ${dato.correo}</div>
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

      <div class="medidas-grid">
        <div class="medida-row"><strong>%IMC:</strong> ${formatearValor(dato.imc)}</div>
        <div class="medida-row"><strong>%IMM:</strong> ${formatearValor(dato.indice_masa_magra)}</div>
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

      <div><strong>% GRASO (5 pliegues):</strong> ${formatearValor(dato.porcentaje_graso_estimado_pliegues)} %</div>

      <div class="section-title">* COMPOSICIÓN CORPORAL *</div>
      <div class="medidas-grid">
        <div>
          <div class="composicion-row"><strong>PESO GRASO:</strong> ${formatearValor(dato.peso_graso)} kg</div>
          <div class="composicion-row"><strong>PESO ÓSEO:</strong> ${formatearValor(dato.peso_oseo_rocha)} kg</div>
          <div class="composicion-row"><strong>PESO MUSCULAR:</strong> ${formatearValor(dato.peso_muscular)} kg</div>
        </div>
        <div>
          <div class="composicion-row"><strong>PESO RESIDUAL:</strong> ${formatearValor(dato.peso_residual)} kg</div>
          <div class="composicion-row"><strong>P. EXTRA:</strong> ${formatearValor(dato.peso_extracelular)} kg</div>
          <div class="composicion-row"><strong>P. INTRA:</strong> ${formatearValor(dato.peso_intracelular)} kg</div>
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
function renderizarTablaPerimetros(historico, idDatoActual) {
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
        ${historico
          .map(
            h => `
          <tr class="${h.id_dato == idDatoActual ? "destacado" : ""}">
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
   TABLA 2 — COMPOSICIÓN CORPORAL
============================================================ */
function renderizarTablaComposicion(historico, idDatoActual) {
  return `
    <table>
      <thead>
        <tr>
          <th>FECHA</th>
          <th>PESO</th>
          <th>PESO GRASO</th>
          <th>KG M. MAGRA</th>
          <th>P. ÓSEO</th>
          <th>IMM</th>
          <th>% GRASO</th>
        </tr>
      </thead>
      <tbody>
        ${historico
          .map(
            h => `
          <tr class="${h.id_dato == idDatoActual ? "destacado" : ""}">
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
   TOOLBAR
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

/* ============================================================
   EXPORT PDF
============================================================ */
function ensureExportButtons() {
  if (document.getElementById("export-buttons")) return;

  const wrap = document.createElement("div");
  wrap.id = "export-buttons";
  wrap.style.cssText =
    "position:fixed;bottom:20px;right:20px;display:flex;flex-direction:column;gap:10px;z-index:9999;";
  wrap.innerHTML = `
    <button id="btn-export-pdf" class="btn-export">📄 PDF</button>
    <button id="btn-print" class="btn-print">🖨️ Imprimir</button>
  `;
  document.body.appendChild(wrap);
}

function wireExportButtons() {
  document.getElementById("btn-print").onclick = () => window.print();

  document.getElementById("btn-export-pdf").onclick = () => {
    const el = document.getElementById("render-final");

    html2pdf()
      .set({
        margin: 0,
        filename: "informe-antropometrico.pdf",
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
      })
      .from(el)
      .save();
  };
}

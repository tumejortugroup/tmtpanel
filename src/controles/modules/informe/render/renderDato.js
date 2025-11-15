import { getInformeDato } from "../fetch/fetchInforme.js";
import { getInformeDatoHistorico } from "../fetch/fetchInformeHistorico.js";

// === Parámetros URL
const urlParams = new URLSearchParams(window.location.search);
const idUsuario = urlParams.get('id_usuario');
const idDato    = urlParams.get('id_dato');

if (!idUsuario || !idDato) {
  document.getElementById('container').innerHTML = '<div class="error">Error: Faltan parámetros en la URL</div>';
} else {
  cargarDatos();
}

async function cargarDatos() {
  try {
    const [datoResult, historicoResult] = await Promise.all([
      getInformeDato(idUsuario, idDato),
      getInformeDatoHistorico(idUsuario)
    ]);

    if (!datoResult.success || !historicoResult.success) {
      throw new Error('Error al cargar los datos');
    }

    const dato = datoResult.data;
    const historico = historicoResult.data;

    renderizarInforme(dato, historico);
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('container').innerHTML = `<div class="error">Error al cargar los datos: ${error.message}</div>`;
  }
}

function calcularPorcentajeMuscular(dato) {
  const pGraso = parseFloat(dato.porcentaje_graso_perimetros) || 0;
  const pOseo  = parseFloat(dato.porcentaje_residual) || 0; // usando residual como óseo
  const pMuscular = 100 - pGraso - pOseo;
  return pMuscular > 0 ? pMuscular.toFixed(2) : '-';
}

function formatearValor(valor) {
  if (valor === null || valor === undefined || valor === '' || valor === '0.00' || valor === '0') return '-';
  const num = parseFloat(valor);
  return isNaN(num) ? '-' : num.toFixed(2);
}

function renderizarInforme(dato, historico) {
  const container = document.getElementById('container');

  // Envolver en A4 y hacerlo editable (como tu otro informe)
  container.innerHTML = `
    <div id="informe-dieta" class="a4-informe" contenteditable="true">
      <div class="header">
        <div class="logo">
         <img src="/assets/images/icons/logo.png" alt="Logo" class="logo-informe">
         </div>
        <div class="header-info">
          <div><strong>Visita:</strong> ${dato.nombre_control || '-'}</div>
          <div><strong>Fecha:</strong> ${dato.fecha || '-'}</div>
        </div>
      </div>

      <div class="datos-personales">
        <div>
          <div><strong>Nombre:</strong> ${dato.nombre || '-'}</div>
          <div><strong>Fecha de nacimiento:</strong> ${dato.fecha_de_nacimiento || '-'}</div>
          <div><strong>Teléfono:</strong> ${dato.telefono || '-'}</div>
        </div>
        <div>
          <div><strong>Edad:</strong> ${dato.edad || '-'}</div>
          <div><strong>Altura:</strong> ${formatearValor(dato.altura)} cm</div>
          <div><strong>E-mail:</strong> ${dato.correo || '-'}</div>
        </div>
      </div>

      <div class="section-title">* CM, CIRCUNFERENCIAS MUSCULARES VISITA *</div>
      <div class="medidas-grid">
        <div>
          <div class="medida-row">
            <span><strong>CUELLO:</strong></span>
            <span>${formatearValor(dato.cuello)} cm</span>
          
          </div>
          <div class="medida-row">
            <span><strong>BRAZO:</strong></span>
            <span>${formatearValor(dato.brazo)} cm</span>
          
          </div>
          <div class="medida-row">
            <span><strong>CINTURA:</strong></span>
            <span>${formatearValor(dato.cintura)} cm</span>
      
          </div>
        </div>
        <div>
          <div class="medida-row">
            <span><strong>ABDOMEN:</strong></span>
            <span>${formatearValor(dato.abdomen)} cm</span>
           
          </div>
          <div class="medida-row">
            <span><strong>CADERA:</strong></span>
            <span>${formatearValor(dato.cadera)} cm</span>
            
          </div>
          <div class="medida-row">
            <span><strong>MUSLO:</strong></span>
            <span>${formatearValor(dato.muslo)} cm</span>
         
          </div>
        </div>
      </div>

      <div class="medidas-grid">
        <div class="medida-row">
          <span><strong>%IMC:</strong></span>
          <span>${formatearValor(dato.imc)} %</span>
        </div>
        <div class="medida-row">
          <span><strong>%IMM:</strong></span>
          <span>${formatearValor(dato.indice_masa_magra)} %</span>
        </div>
      </div>

      <div style="height: 2rem;"></div>

      <div class="section-title">* LIPOMETRÍA / MM PLIEGUES CUTÁNEOS / BIOEMPEDANCIA *</div>
      <div class="medidas-grid">
        <div>
          <div class="medida-row">
            <span><strong>TRÍCEPS:</strong></span>
            <span>${formatearValor(dato.triceps)} mm</span>
          </div>
          <div class="medida-row">
            <span><strong>SUBESCAPULAR:</strong></span>
            <span>${formatearValor(dato.subescapular)} mm</span>
          </div>
          <div class="medida-row">
            <span><strong>ABDOMEN:</strong></span>
            <span>${formatearValor(dato.abdomen_pliegue)} mm</span>
            
          </div>
        </div>
        <div>
          <div class="medida-row">
            <span><strong>SUPRA-ILÍACO:</strong></span>
            <span>${formatearValor(dato.supra_iliaco)} mm</span>
          </div>
          <div class="medida-row">
            <span><strong>MUSLO:</strong></span>
            <span>${formatearValor(dato.muslo_pliegue)} mm</span>
          </div>
          <div class="medida-row">
          
          </div>
        </div>
      </div>

      <div style="font-size: 0.9rem; margin-bottom: 1rem;">
        <div style="margin-bottom: 0.25rem;">
          <strong>% GRASO 5 PLIEGUES:</strong> ${formatearValor(dato.porcentaje_graso_estimado_pliegues)} %
        </div>
      </div>

      <div style="height: 2rem;"></div>

      <div class="section-2cols">
        <div>
          <div class="section-title">* DIÁMETROS ÓSEOS ( ROCHA )*</div>
          <div style="font-size: 0.9rem;">
            <div class="medida-row">
              <span><strong>( HÚMERO ) Biepicondileo:</strong></span>
              <span>${formatearValor(dato.humero_biepicondileo)} mm</span>
            </div>
            <div class="medida-row">
              <span><strong>( FÉMUR ) Bicondileo:</strong></span>
              <span>${formatearValor(dato.femur_bicondileo)} mm</span>
            </div>
            <div class="medida-row">
              <span><strong>( MUÑECA ) Estiloideo:</strong></span>
              <span>${formatearValor(dato.muneca_estiloideo)} mm</span>
            </div>
            <div class="medida-row">
              <span><strong>Complexión Ósea:</strong></span>
              <span>${formatearValor(dato.complex_osea)} cm</span>
            </div>
          </div>
        </div>
        <div>
          <div class="section-title">* MEDICIÓN ARTERIAL *</div>
          <div style="font-size: 0.9rem;">
            <div class="medida-row">
              <span><strong>Tensión Arterial Sistólica:</strong></span>
              <span>-</span>
            </div>
            <div class="medida-row">
              <span><strong>Tensión Arterial Diastólica:</strong></span>
              <span>-</span>
            </div>
            <div class="medida-row">
              <span><strong>Pulso Máquina (puls/min):</strong></span>
              <span>-</span>
            </div>
          </div>
        </div>
      </div>

      <div style="height: 2rem;"></div>

      <div class="section-title">* COMPOSICIÓN CORPORAL DE LA VISITA *</div>
      <div class="medidas-grid">
        <div>
          <div class="composicion-row">
            <span><strong>PESO GRASO:</strong></span>
            <span>${formatearValor(dato.peso_graso)} kg</span>
            <span>${formatearValor(dato.porcentaje_graso_estimado_pliegues)}%</span>
          </div>
          <div class="composicion-row">
            <span><strong>PESO OSEO ( ROCHA ):</strong></span>
            <span>${formatearValor(dato.peso_oseo_rocha)} kg</span>
            <span>${formatearValor(dato.porcentaje_oseo)}%</span>
          </div>
          <div class="composicion-row">
            <span><strong>PESO MUSCULAR:</strong></span>
            <span>${formatearValor(dato.peso_muscular)} kg</span>
            <span>${formatearValor(dato.porcentaje_masa_muscular)}%</span>
          </div>
        </div>
        <div>
          <div class="composicion-row">
            <span><strong>PESO RESIDUAL:</strong></span>
            <span>${formatearValor(dato.peso_residual)} kg</span>
            <span>${formatearValor(dato.porcentaje_residual)}%</span>
          </div>
          <div class="composicion-row">
            <span><strong>P. EXTRACELULAR:</strong></span>
            <span>${formatearValor(dato.peso_extracelular)} kg</span>
            <span>${formatearValor(dato.porcentaje_extracelular)}%</span>
          </div>
          <div class="composicion-row">
            <span><strong>P. INTRACELULAR:</strong></span>
            <span>${formatearValor(dato.peso_intracelular)} kg</span>
            <span>${formatearValor(dato.porcentaje_intracelular)}%</span>
          </div>
        </div>
      </div>

      <div class="peso-global">
        <strong>PESO GLOBAL:</strong> ${formatearValor(dato.peso)} kg
      </div>

      <div style="height: 2rem;"></div>

      <div class="section-title">* PROGRESIÓN *</div>
      ${renderizarTablaProgresion(historico, idDato)}
    </div>
  `;

  // Añadir toolbar y botones flotantes + listeners
  ensureEditorToolbar();
  ensureExportButtons();
  wireExportButtons();
}

function renderizarTablaProgresion(historico, idDatoActual) {
  if (!historico || historico.length === 0) {
    return '<p style="text-align: center;">No hay datos históricos disponibles</p>';
  }

  const tabla1 = `
    <table>
      <thead>
        <tr>
          <th>FECHA</th>
          <th>CONTROL</th>
          <th>CUELLO cm</th>
          <th>BRAZO cm</th>
          <th>CINTURA cm</th>
          <th>ABDOMEN cm</th>
          <th>CADERA cm</th>
          <th>MUSLO cm</th>
        </tr>
      </thead>
      <tbody>
        ${historico.map(row => `
          <tr class="${row.id_dato == idDatoActual ? 'destacado' : ''}">
            <td>${row.fecha || '-'}</td>
            <td>${row.nombre_control || '-'}</td>
            <td>${row.cuello || '-'}</td>
            <td>${row.brazo || '-'}</td>
            <td>${row.cintura || '-'}</td>
            <td>${row.abdomen || '-'}</td>
            <td>${row.cadera || '-'}</td>
            <td>${row.muslo || '-'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  const tabla2 = `
    <table>
      <thead>
        <tr>
          <th>FECHA</th>
          <th>PESO</th>
          <th>PESO GRASO</th>
          <th>KG M.MAGRA</th>
          <th>P.ÓSEO</th>
          <th>IMM</th>
          <th>% GRASO</th>
        </tr>
      </thead>
      <tbody>
        ${historico.map(row => `
          <tr class="${row.id_dato == idDatoActual ? 'destacado' : ''}">
            <td>${row.fecha || '-'}</td>
            <td>${row.peso || '-'}</td>
            <td>${row.peso_graso|| '-'}</td>
            <td>${row.peso_muscular|| '-'}</td>
            <td>${row.peso_oseo_rocha || '-'}</td>
            <td>${row.indice_masa_magra || '-'}</td>
            <td>${row.porcentaje_graso_estimado_pliegues || '-'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  return tabla1 + tabla2;
}

/* =====================
   Toolbar sencilla (segura con TextNode)
   ===================== */
function ensureEditorToolbar() {
  if (document.getElementById('editor-toolbar')) return;

  const toolbar = document.createElement('div');
  toolbar.id = 'editor-toolbar';
  toolbar.className = 'no-print';
  toolbar.style.cssText = `
    display:flex; gap:6px; align-items:center;
    margin:10px auto; max-width:210mm; padding:8px 10px;
    border:1px solid #e5e5e5; border-radius:8px;
    background:#fafafa; position:sticky; top:8px; z-index:5; justify-content:center;
  `;

  toolbar.innerHTML = `
    <button type="button" data-cmd="bold" style="padding:6px 10px;border:1px solid #ccc;border-radius:6px;background:#f6f6f6;cursor:pointer;"><b>B</b></button>
    <button type="button" data-cmd="italic" style="padding:6px 10px;border:1px solid #ccc;border-radius:6px;background:#f6f6f6;cursor:pointer;"><i>I</i></button>
    <button type="button" data-cmd="underline" style="padding:6px 10px;border:1px solid #ccc;border-radius:6px;background:#f6f6f6;cursor:pointer;"><u>U</u></button>
    <button type="button" data-cmd="removeFormat" title="Quitar formato" style="padding:6px 10px;border:1px solid #ccc;border-radius:6px;background:#f6f6f6;cursor:pointer;">Clear</button>
    <span style="margin-left:10px;font-size:12px;color:#666;">Color</span>
    <input id="colorPicker" type="color" value="#333333" style="height:28px;width:36px;border:1px solid #ccc;border-radius:4px;background:#fff;cursor:pointer;" />
    <span style="margin-left:10px;font-size:12px;color:#666;">Resaltado</span>
    <input id="hilitePicker" type="color" value="#ffff00" style="height:28px;width:36px;border:1px solid #ccc;border-radius:4px;background:#fff;cursor:pointer;" />
    <button type="button" data-cmd="insertUnorderedList" title="Lista" style="padding:6px 10px;border:1px solid #ccc;border-radius:6px;background:#f6f6f6;cursor:pointer;">• List</button>
    <button type="button" data-cmd="justifyLeft"   title="Alinear izq." style="padding:6px 10px;border:1px solid #ccc;border-radius:6px;background:#f6f6f6;cursor:pointer;">⟸</button>
    <button type="button" data-cmd="justifyCenter" title="Centrar"     style="padding:6px 10px;border:1px solid #ccc;border-radius:6px;background:#f6f6f6;cursor:pointer;">⇔</button>
    <button type="button" data-cmd="justifyRight"  title="Alinear der."style="padding:6px 10px;border:1px solid #ccc;border-radius:6px;background:#f6f6f6;cursor:pointer;">⟹</button>
  `;

  const informe = document.getElementById('informe-dieta');
  if (informe && informe.parentElement) {
    informe.parentElement.insertBefore(toolbar, informe);
  } else {
    document.body.insertBefore(toolbar, document.body.firstChild);
  }

  let savedRange = null;

  document.addEventListener('selectionchange', () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const node = sel.anchorNode;
    const el = node && (node.nodeType === 1 ? node : node.parentElement);
    if (el && el.closest && el.closest('[contenteditable="true"]')) {
      savedRange = sel.getRangeAt(0);
    }
  });

  function restoreSelection() {
    if (!savedRange) return;
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(savedRange);
  }

  toolbar.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-cmd]');
    if (!btn) return;
    e.preventDefault();
    const cmd = btn.getAttribute('data-cmd');
    restoreSelection();
    document.execCommand(cmd, false, null);
  });

  const colorPicker = toolbar.querySelector('#colorPicker');
  colorPicker?.addEventListener('input', (e) => {
    restoreSelection();
    document.execCommand('foreColor', false, e.target.value);
  });

  const hilitePicker = toolbar.querySelector('#hilitePicker');
  hilitePicker?.addEventListener('input', (e) => {
    restoreSelection();
    const ok = document.execCommand('hiliteColor', false, e.target.value);
    if (!ok) {
      document.execCommand('backColor', false, e.target.value);
    }
  });
}

// Helpers expuestos (si los usas en HTML inline)
window.format = function (cmd) {
  document.execCommand(cmd, false, null);
};
window.formatColor = function (color) {
  document.execCommand('foreColor', false, color);
};

/* =====================
   Botones Exportar/Imprimir
   ===================== */
function ensureExportButtons() {
  if (document.getElementById('export-buttons')) return;

  const wrapper = document.createElement('div');
  wrapper.id = 'export-buttons';
  wrapper.className = 'no-print';
  wrapper.style.cssText = `
    position:fixed; bottom:20px; right:20px;
    display:flex; flex-direction:column; gap:10px; z-index:2000;
  `;
  wrapper.innerHTML = `
    <button id="btn-export-pdf" style="background:#3498db;color:#fff;padding:10px 14px;border:none;border-radius:6px;cursor:pointer;box-shadow:0 4px 8px rgba(0,0,0,0.15);">📄 Exportar PDF</button>
    <button id="btn-print"      style="background:#2ecc71;color:#fff;padding:10px 14px;border:none;border-radius:6px;cursor:pointer;box-shadow:0 4px 8px rgba(0,0,0,0.15);">🖨️ Imprimir</button>
  `;
  document.body.appendChild(wrapper);
}

function wireExportButtons() {
  const btnPrint = document.getElementById('btn-print');
  const btnPDF   = document.getElementById('btn-export-pdf');

  if (btnPDF && !btnPDF.dataset.bound) {
  btnPDF.addEventListener('click', () => {
    const el = document.getElementById('informe-dieta');
    if (!el) return;

   

    // Forzar estilo A4 centrado
    el.style.width = "210mm";
    el.style.minHeight = "297mm"; // asegurar altura A4
    el.style.margin = "0 auto";   // centra en pantalla y en PDF
    el.style.background = "#fff";

    const opt = {
      margin: [0, 0, 10, 10],  // top, left, bottom, right en px (~0.25 in)
      filename: 'informe-control.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(el).save();
  });
  btnPDF.dataset.bound = '1';
}

}

// fallback por si el DOM ya tenía los botones estáticos
document.addEventListener('DOMContentLoaded', wireExportButtons);

import { agruparPorTipoComida } from './agruparComida.js';

/* =====================
   Botones flotantes Exportar/Imprimir (fuera de render)
   ===================== */
function ensureExportButtons() {
  if (document.getElementById('export-buttons')) return;

  const wrapper = document.createElement('div');
  wrapper.id = 'export-buttons';
  wrapper.className = 'no-print';
  wrapper.style.cssText = `
    position:fixed; bottom:20px; right:20px;
    display:flex; flex-direction:column; gap:10px;
    z-index:2000;
  `;

  wrapper.innerHTML = `
    <button id="btn-export-pdf" style="background:#3498db;color:#fff;padding:10px 14px;border:none;border-radius:6px;cursor:pointer;box-shadow:0 4px 8px rgba(0,0,0,0.15);">📄 Exportar PDF</button>
    <button id="btn-print" style="background:#2ecc71;color:#fff;padding:10px 14px;border:none;border-radius:6px;cursor:pointer;box-shadow:0 4px 8px rgba(0,0,0,0.15);">🖨️ Imprimir</button>
  `;

  document.body.appendChild(wrapper);

  // Evento imprimir
  document.getElementById("btn-print").addEventListener("click", () => window.print());

  // Evento exportar PDF
  document.getElementById("btn-export-pdf").addEventListener("click", () => {
    const element = document.getElementById("informe-dieta");
    if (!element) return;

    if (typeof html2pdf === 'undefined') {
      console.error('html2pdf no está cargado. Asegúrate de incluir la librería en el HTML.');
      return;
    }

    const opt = {
      margin:       0,
      filename:     'informe-dieta.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  });
}

export function renderInformeDieta(data) {
  if (!Array.isArray(data) || !data.length) return;

  // ====== Toolbar y botones (se aseguran una sola vez) ======
  ensureEditorToolbar();
  ensureExportButtons(); // 👈 ¡IMPORTANTE!

  const container = document.getElementById("informe-dieta");
  container.classList.add("a4-informe");
  container.innerHTML = "";

  // 1) Header editable
  const gen = data[0];
  const headerHTML = `
    <div class="informe-header" contenteditable="true">
      <div class="header-logo">
        <img src="/assets/images/icons/logo.png" alt="Logo" class="logo-informe">
      </div>
      <div>
        <p><strong>Nombre:</strong> ${gen.nombre_usuario} ${gen.apellido_usuario}</p>
        <p><strong>Kcal:</strong> ${gen.calorias_dieta}</p>
        <p><strong>Inicio:</strong> ${gen.fecha_creacion.split(' ')[0]}</p>
      </div>
      <div>
        <p><strong>Validez:</strong> Mensual</p>
        <p><strong>Revisión:</strong> —</p>
        <p><strong>Responsable:</strong> 
          ${gen.nombre_preparador || ''} ${gen.apellido_preparador || ''} 
          ${gen.nombre_propietario || ''} ${gen.apellido_propietario || ''}
        </p>
      </div>
    </div>
  `;
  container.insertAdjacentHTML("beforeend", headerHTML);

  // 2) Agrupar y ordenar por hora
  const comidasAgrupadas = agruparPorTipoComida(data);
  const comidasOrdenadas = Object.entries(comidasAgrupadas).sort(([_, itemsA], [__, itemsB]) => {
    const horaA = itemsA[0]?.hora ?? null;
    const horaB = itemsB[0]?.hora ?? null;
    if (!horaA && !horaB) return 0;
    if (!horaA) return 1;
    if (!horaB) return -1;
    return horaA.localeCompare(horaB);
  });

  // 3) Bloques editables de comidas
  for (const [tipo, items] of comidasOrdenadas) {
    const bloque = document.createElement("div");
    bloque.classList.add("bloque-comida");
    bloque.setAttribute("contenteditable", "true"); // editable por usuario

    const hora = items[0]?.hora ? items[0].hora.slice(0, 5) : "—";

    // Tabla de alimentos
    const tablaAlimentos = `
      <div class="bloque-tabla">
        <table class="tabla-comida">
          <thead>
            <tr><th>Alimento</th></tr>
          </thead>
          <tbody>
            ${items.map(item => {
              const alimentos = [];
              alimentos.push(`${item.nombre_alimento || '—'} (${item.cantidad ? item.cantidad + ' g' : '—'})`);
              if (item.nombre_alimento_equivalente && item.cantidad_equivalente) {
                alimentos.push(`${item.nombre_alimento_equivalente} (${item.cantidad_equivalente} g)`);
              }
              if (item.nombre_alimento_equivalente1 && item.cantidad_equivalente1) {
                alimentos.push(`${item.nombre_alimento_equivalente1} (${item.cantidad_equivalente1} g)`);
              }
              if (item.nombre_alimento_equivalente3 && item.cantidad_equivalente3) {
                alimentos.push(`${item.nombre_alimento_equivalente3} (${item.cantidad_equivalente3} g)`);
              }
              return `<tr><td>${alimentos.join(" / ")}</td></tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;

    // Observaciones (si hay)
    const notasUnicas = [...new Set(items.filter(i => i.notas).map(i => i.notas))];
    const observaciones = notasUnicas.length > 0
      ? `
        <div class="bloque-observaciones">
          <h6>Observaciones</h6>
          <div>${notasUnicas.map(n => `📝 ${n}`).join("<br>")}</div>
        </div>
      `
      : "";

    // Composición del bloque
    bloque.innerHTML = `
      <div class="bloque-header">
        <h5>${tipo.toUpperCase()}</h5>
        <small>⏰ ${hora}</small>
      </div>
      ${tablaAlimentos}
      ${observaciones}
    `;
    container.appendChild(bloque);
  }

  // 4) Notas generales editables
  const notasHTML = `
    <div class="informe-notas mt-4" contenteditable="true">
      <p class="text-success fw-bold mb-1">
        1.- Beber 2-3 litros de agua. 2 batidos máximo al día. Hacer 10.000 pasos diarios
      </p>
      <p class="text-primary fw-bold mb-1">
        2.- Todo al horno, vapor, plancha, hervido o microondas.
      </p>
      <p class="text-danger fw-bold mb-1">
        3.- Todos los alimentos han de ser pesados en crudo antes de cocinarlos.
      </p>
      <p class="fw-bold mb-0" style="color: brown;">
        4.- Tienes 20 gr de Aceite para todas las comidas del día, no superar 160° al cocinar.
      </p>
    </div>
  `;
  container.insertAdjacentHTML("beforeend", notasHTML);
}

/* =====================
   Toolbar sencilla WYSIWYG
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
    background:#fafafa; position:sticky; top:8px; z-index:5; align-item:center; justify-content:center;
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
    <button type="button" data-cmd="justifyLeft" title="Alinear izq." style="padding:6px 10px;border:1px solid #ccc;border-radius:6px;background:#f6f6f6;cursor:pointer;">⟸</button>
    <button type="button" data-cmd="justifyCenter" title="Centrar" style="padding:6px 10px;border:1px solid #ccc;border-radius:6px;background:#f6f6f6;cursor:pointer;">⇔</button>
    <button type="button" data-cmd="justifyRight" title="Alinear der." style="padding:6px 10px;border:1px solid #ccc;border-radius:6px;background:#f6f6f6;cursor:pointer;">⟹</button>
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
    if (!node) return;
    const el = node.nodeType === 1 ? node : node.parentElement;
    if (el && el.closest('[contenteditable="true"]')) {
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

// === Exponer helpers al HTML inline (tu toolbar con onclick="...") ===
window.format = function (cmd) {
  document.execCommand(cmd, false, null);
};
window.formatColor = function (color) {
  document.execCommand('foreColor', false, color);
};

// === Enlazar botones Exportar/Imprimir por ID ===
function wireExportButtons() {
  const btnPrint = document.getElementById('btn-print');
  const btnPDF   = document.getElementById('btn-export-pdf');

  if (btnPrint && !btnPrint.dataset.bound) {
    btnPrint.addEventListener('click', () => window.print());
    btnPrint.dataset.bound = '1';
  }

  if (btnPDF && !btnPDF.dataset.bound) {
    btnPDF.addEventListener('click', () => {
      const el = document.getElementById('informe-dieta');
      if (!el) return;

      if (typeof html2pdf === 'undefined') {
        alert('No se encontró html2pdf. Asegúrate de cargar la librería ANTES de este script.');
        return;
      }

      const opt = {
        margin: 0,
        filename: 'informe-dieta.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };
      html2pdf().set(opt).from(el).save();
    });
    btnPDF.dataset.bound = '1';
  }
}

// Enlazar una vez que el DOM esté listo
document.addEventListener('DOMContentLoaded', wireExportButtons);

// Por si renderizas el informe después de cargar, vuelve a enlazar
// (deja esta línea AL FINAL de tu función renderInformeDieta):
// -> wireExportButtons();


   import { getInformeDato } from "../fetch/fetchInforme.js";
   import { getInformeDatoHistorico } from "../fetch/fetchInformeHistorico.js";

   // main.js



const urlParams = new URLSearchParams(window.location.search);
const idUsuario = urlParams.get('id_usuario');
const idDato = urlParams.get('id_dato');

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

function renderizarInforme(dato, historico) {
    const html = `
        <div class="header">
            <div class="logo">M</div>
            <div class="header-info">
                <div><strong>VISITA:</strong> CONTROL ${idDato}</div>
                <div><strong>FECHA:</strong> ${dato.fecha || '-'}</div>
                <div><strong>RESPONSABLE:</strong> ${dato.responsable || '-'}</div>
            </div>
        </div>

        <div class="datos-personales">
            <div>
                <div><strong>NOMBRE:</strong> ${dato.nombre || '-'}</div>
                <div><strong>FECHA DE NACIMIENTO:</strong> ${dato.fecha_nacimiento || '-'}</div>
                <div><strong>TELÉFONO:</strong> ${dato.telefono || '-'}</div>
            </div>
            <div>
                <div><strong>EDAD:</strong> ${dato.edad || '-'}</div>
                <div><strong>ALTURA:</strong> ${dato.altura || '-'} cm</div>
                <div><strong>EMAIL:</strong> ${dato.email || '-'}</div>
            </div>
        </div>

        <div class="section-title">* CM, CIRCUNFERENCIAS MUSCULARES VISITA *</div>
        <div class="medidas-grid">
            <div>
                <div class="medida-row">
                    <span><strong>CUELLO:</strong></span>
                    <span>${dato.cuello || '-'} cm</span>
                    <span>-</span>
                </div>
                <div class="medida-row">
                    <span><strong>BRAZO:</strong></span>
                    <span>${dato.brazo || '-'} cm</span>
                    <span>-</span>
                </div>
                <div class="medida-row">
                    <span><strong>CINTURA:</strong></span>
                    <span>${dato.cintura || '-'} cm</span>
                    <span>-</span>
                </div>
            </div>
            <div>
                <div class="medida-row">
                    <span><strong>ABDOMEN:</strong></span>
                    <span>${dato.abdomen || '-'} cm</span>
                    <span>-</span>
                </div>
                <div class="medida-row">
                    <span><strong>CADERA:</strong></span>
                    <span>${dato.cadera || '-'} cm</span>
                    <span>-</span>
                </div>
                <div class="medida-row">
                    <span><strong>MUSLO:</strong></span>
                    <span>${dato.muslo || '-'} cm</span>
                    <span>-</span>
                </div>
            </div>
        </div>
        <div class="medidas-grid">
            <div class="medida-row">
                <span><strong>%IMC:</strong></span>
                <span>${dato.imc || '-'} %</span>
            </div>
            <div class="medida-row">
                <span><strong>%IMM:</strong></span>
                <span>${dato.indice_masa_magra || '-'} %</span>
            </div>
        </div>

        <div style="height: 2rem;"></div>

        <div class="section-title">* LIPOMETRÍA / MM PLIEGUES CUTÁNEOS / BIOEMPEDANCIA *</div>
        <div class="medidas-grid">
            <div>
                <div class="medida-row">
                    <span><strong>TRÍCEPS:</strong></span>
                    <span>${dato.triceps || '-'} mm</span>
                </div>
                <div class="medida-row">
                    <span><strong>SUBESCAPULAR:</strong></span>
                    <span>${dato.subescapular || '-'} mm</span>
                </div>
                <div class="medida-row">
                    <span><strong>ABDOMEN:</strong></span>
                    <span>${dato.abdomen_pliegue || '-'} mm</span>
                    <span>-</span>
                </div>
            </div>
            <div>
                <div class="medida-row">
                    <span><strong>SUPRA-ILÍACO:</strong></span>
                    <span>${dato.supra_iliaco || '-'} mm</span>
                </div>
                <div class="medida-row">
                    <span><strong>MUSLO:</strong></span>
                    <span>${dato.muslo_pliegue || '-'} mm</span>
                </div>
                <div class="medida-row">
                    <span>-</span>
                    <span>-</span>
                </div>
            </div>
        </div>
        <div style="font-size: 0.9rem; margin-bottom: 1rem;">
            <div style="margin-bottom: 0.25rem;">
                <strong>% GRASO 5 PLIEGUES:</strong> ${dato.porcentaje_graso_estimado_pliegues || '-'} %
            </div>
            <div>
                <strong>% GRASO BIOEMPEDANCIA:</strong> -
            </div>
        </div>

        <div style="height: 2rem;"></div>

        <div class="section-2cols">
            <div>
                <div class="section-title">* DIÁMETROS ÓSEOS ( ROCHA )*</div>
                <div style="font-size: 0.9rem;">
                    <div class="medida-row">
                        <span><strong>( HÚMERO ) Biepicondileo:</strong></span>
                        <span>${dato.humero_biepicondileo || '-'} mm</span>
                    </div>
                    <div class="medida-row">
                        <span><strong>( FÉMUR ) Bicondileo:</strong></span>
                        <span>${dato.femur_bicondileo || '-'} mm</span>
                    </div>
                    <div class="medida-row">
                        <span><strong>( MUÑECA ) Estiloideo:</strong></span>
                        <span>${dato.muneca_estiloideo || '-'} mm</span>
                    </div>
                    <div class="medida-row">
                        <span><strong>Complexión Ósea:</strong></span>
                        <span>${dato.complex_osea || '-'} cm</span>
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
                    <span>${dato.kg_grasa || '-'} kg</span>
                    <span>${dato.porcentaje_graso_perimetros || '-'}%</span>
                </div>
                <div class="composicion-row">
                    <span><strong>PESO OSEO ( ROCHA ):</strong></span>
                    <span>${dato.peso_oseo_rocha || '-'} kg</span>
                    <span>-</span>
                </div>
                <div class="composicion-row">
                    <span><strong>PESO MUSCULAR:</strong></span>
                    <span>${dato.kg_masa_magra || '-'} kg</span>
                    <span>-</span>
                </div>
            </div>
            <div>
                <div class="composicion-row">
                    <span><strong>PESO RESIDUAL:</strong></span>
                    <span>${dato.peso_residual || '-'} kg</span>
                    <span>-</span>
                </div>
                <div class="composicion-row">
                    <span><strong>P. EXTRACELULAR:</strong></span>
                    <span>${dato.peso_extracelular || '-'} kg</span>
                    <span>-</span>
                </div>
                <div class="composicion-row">
                    <span><strong>P. INTRACELULAR:</strong></span>
                    <span>${dato.peso_intracelular || '-'} kg</span>
                    <span>-</span>
                </div>
            </div>
        </div>
        <div class="peso-global">
            <strong>PESO GLOBAL:</strong> ${dato.peso || '-'} kg
        </div>

        <div style="height: 2rem;"></div>

        <div class="section-title">* PROGRESIÓN *</div>
        ${renderizarTablaProgresion(historico, idDato)}
    `;

    document.getElementById('container').innerHTML = html;
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
                        <td>${row.kg_grasa || '-'}</td>
                        <td>${row.kg_masa_magra || '-'}</td>
                        <td>${row.peso_oseo_rocha || '-'}</td>
                        <td>${row.indice_masa_magra || '-'}</td>
                        <td>${row.porcentaje_graso_perimetros || '-'}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    return tabla1 + tabla2;
}
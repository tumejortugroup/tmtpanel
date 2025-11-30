// ===========================================================
//  renderAlimentos.js — versión COMPLETA y CORREGIDA
// ===========================================================

import { getAlimentos } from "/src/dietas/modules/wizard/fetch/getAlimentos.js";

let alimentosCache = [];

// ===========================================================
// 🔵 Cargar alimentos una sola vez
// ===========================================================
async function cargarAlimentos() {
    if (alimentosCache.length > 0) return alimentosCache;

    alimentosCache = await getAlimentos();
    console.log("🟦 Cache alimentos cargado:", alimentosCache.length);

    return alimentosCache;
}

// ===========================================================
// 🟣 Detectar categoría REAL desde la fila
// ===========================================================
function detectarCategoria(select, categoriaManual) {
    let categoriaDetectada = categoriaManual || null;

    const fila = select.closest("tr");
    if (!fila) return null;

    // 1️⃣ Si viene pasada manualmente (addColumns)
    if (categoriaDetectada) return categoriaDetectada;

    // 2️⃣ Si existe un select HTML real
    const selectCategoria = fila.querySelector("select[name='select-categoria']");
    if (selectCategoria) {
        categoriaDetectada = selectCategoria.value?.trim();
        if (categoriaDetectada) return categoriaDetectada;
    }

    // 3️⃣ Si la fila tiene un atributo data-categoria
    if (fila.dataset.categoria) {
        return fila.dataset.categoria.trim();
    }

    // 4️⃣ Si la celda del macro tiene data-categoria
    const macroData = fila.querySelector("[data-categoria]");
    if (macroData) {
        return macroData.dataset.categoria.trim();
    }

    // 5️⃣ Último recurso → leer texto del macro (Proteína, Grasa…)
    const tdMacro = fila.querySelector("td.header-dieta");
    if (tdMacro) {
        const txt = tdMacro.textContent.trim();
        if (txt) return txt;
    }

    return null;
}

// ===========================================================
// 🟡 Filtrar alimentos por categoría
// ===========================================================
function filtrarPorCategoria(alimentos, categoria) {
    if (!categoria) return alimentos;

    const cat = categoria.toLowerCase();

    const filtrados = alimentos.filter(a =>
        a.categoria?.toLowerCase() === cat
    );

    console.log(`🔎 Filtrando por categoría: ${categoria}  →  ${filtrados.length}  alimentos`);
    return filtrados;
}

// ===========================================================
// 🟢 Llenar un select concreto
// ===========================================================
export async function renderSelectAlimentos(select, categoriaManual = null) {
    const alimentos = await cargarAlimentos();

    // Detectar categoría real
    const categoria = detectarCategoria(select, categoriaManual);

    // Filtrar alimentos
    const alimentosFiltrados = filtrarPorCategoria(alimentos, categoria);

    // Renderizar opciones
    select.innerHTML = `<option value="">Seleccionar</option>` +
        alimentosFiltrados
            .map(a => `<option value="${a.id_alimento}">${a.nombre}</option>`)
            .join("");
}

// ===========================================================
// 🟩 Rellenar TODOS los selects
// ===========================================================
export async function renderSelectAlimentosGlobal(selector = "select[name='select-alimentos']") {
    const selects = document.querySelectorAll(selector);

    for (const select of selects) {
        await renderSelectAlimentos(select);
    }
}

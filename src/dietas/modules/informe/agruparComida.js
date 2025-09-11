
/**
 * agruparPorTipoComida()
 * ----------------------
 * Agrupa una colección de items de dieta por su tipo de comida.
 *
 * Uso típico:
 * - Dado un array de objetos con la propiedad `tipo_comida`,
 *   devuelve un objeto cuyas claves son los tipos (en minúsculas)
 *   y cuyos valores son arrays de items pertenecientes a ese tipo.
 *
 * Reglas:
 * - Si `tipo_comida` no está definido en un item, se asigna a la clave `"sin_tipo"`.
 * - La agrupación no preserva el orden original de `data`, 
 *   pero los elementos dentro de cada grupo sí.
 *
 * @param {Array<Object>} data - Lista de objetos, cada uno con al menos la propiedad `tipo_comida`.
 * @returns {Object<string, Array<Object>>} Objeto agrupado por tipo de comida.
 *
 */
export function agruparPorTipoComida(data = []) {
  const agrupado = {};

  data.forEach(item => {
    const tipo = item.tipo_comida?.toLowerCase() || 'sin_tipo';

    if (!agrupado[tipo]) agrupado[tipo] = [];
    agrupado[tipo].push(item);
  });

  return agrupado;
}

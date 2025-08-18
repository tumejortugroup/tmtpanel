export function agruparPorTipoComida(data = []) {
  const agrupado = {};

  data.forEach(item => {
    const tipo = item.tipo_comida?.toLowerCase() || 'sin_tipo';

    if (!agrupado[tipo]) agrupado[tipo] = [];
    agrupado[tipo].push(item);
  });

  return agrupado;
}

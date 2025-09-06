export function agruparPorComida(data) {
  return data.reduce((acc, item) => {
    if (!acc[item.id_comida]) {
      acc[item.id_comida] = {
        id_comida: item.id_comida,
        tipo_comida: item.tipo_comida,
        hora: item.hora,
        notas: item.notas,
        alimentos: []
      };
    }

    acc[item.id_comida].alimentos.push({
      id_alimento: item.id_alimento,                     
      nombre_alimento: item.nombre_alimento,             
      categoria: item.categoria,
      cantidad: item.cantidad,
      id_alimento_equivalente: item.id_alimento_equivalente,
      nombre_alimento_equivalente: item.nombre_alimento_equivalente,
      cantidad_equivalente: item.cantidad_equivalente,
      id_alimento_equivalente1: item.id_alimento_equivalente1,
      nombre_alimento_equivalente1: item.nombre_alimento_equivalente1,
      cantidad_equivalente1: item.cantidad_equivalente1,
      id_alimento_equivalente3: item.id_alimento_equivalente3,
      nombre_alimento_equivalente3: item.nombre_alimento_equivalente3,
      cantidad_equivalente3: item.cantidad_equivalente3
    });

    return acc;
  }, {});
}

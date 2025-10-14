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
      cantidad_equivalente3: item.cantidad_equivalente3,
       id_alimento_equivalente4: item.id_alimento_equivalente4,
      nombre_alimento_equivalente4: item.nombre_alimento_equivalente4,
      cantidad_equivalente4: item.cantidad_equivalente4,
      id_alimento_equivalente5: item.id_alimento_equivalente5,
      nombre_alimento_equivalente5: item.nombre_alimento_equivalente5,
      cantidad_equivalente5: item.cantidad_equivalente5,
       id_alimento_equivalente6: item.id_alimento_equivalente6,
      nombre_alimento_equivalente6: item.nombre_alimento_equivalente6,
      cantidad_equivalente6: item.cantidad_equivalente6,
      id_alimento_equivalente7: item.id_alimento_equivalente7,
      nombre_alimento_equivalente7: item.nombre_alimento_equivalente7,
      cantidad_equivalente7: item.cantidad_equivalente7,
       id_alimento_equivalente8: item.id_alimento_equivalente8,
      nombre_alimento_equivalente8: item.nombre_alimento_equivalente8,
      cantidad_equivalente8: item.cantidad_equivalente8,
      id_alimento_equivalente9: item.id_alimento_equivalente9,
      nombre_alimento_equivalente9: item.nombre_alimento_equivalente9,
      cantidad_equivalente9: item.cantidad_equivalente9
    });

    return acc;
  }, {});
}

// formulas/bmr.js

export function bmrMifflinStJeor({ peso, altura, edad, genero }) {
  if (!peso || !altura || !edad) return 0;

  return genero === 'hombre'
    ? (10 * peso) + (6.25 * altura) - (5 * edad) + 5
    : (10 * peso) + (6.25 * altura) - (5 * edad) - 161;
}

export function bmrHarrisBenedict({ peso, altura, edad, genero }) {
  if (!peso || !altura || !edad) return 0;

  return genero === 'hombre'
    ? 88.362 + (13.397 * peso) + (4.799 * altura) - (5.677 * edad)
    : 447.593 + (9.247 * peso) + (3.098 * altura) - (4.330 * edad);
}

export function bmrFaoOmsUnu({ peso, altura, edad, genero }) {
  if (!peso || !altura || !edad) return 0;

  return genero === 'hombre'
    ? 66.5 + (13.75 * peso) + (5.003 * altura) - (6.75 * edad)
    : 655 + (9.563 * peso) + (1.850 * altura) - (4.676 * edad);
}

export function bmrKatchMcArdle({ peso, porcentajeGraso }) {
  if (!peso || porcentajeGraso == null || porcentajeGraso === 0) return null;

  const masaMagra = peso - (peso * (porcentajeGraso / 100));
  return 370 + (21.6 * masaMagra);
}

export function bmrPromedio({ peso, altura, edad, genero, porcentajeGraso }) {
  const mifflin = bmrMifflinStJeor({ peso, altura, edad, genero });
  const harris = bmrHarrisBenedict({ peso, altura, edad, genero });
  const fao = bmrFaoOmsUnu({ peso, altura, edad, genero });
  const katch = bmrKatchMcArdle({ peso, porcentajeGraso });

  const valores = [mifflin, harris, fao, katch].filter(val => typeof val === 'number');

  if (valores.length === 4) {
    return valores.reduce((sum, val) => sum + val, 0) / valores.length;
  }

  return null;
}

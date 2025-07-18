// formulas/imc.js

export function calcularIMC(peso, altura) {
  if (!peso || !altura) return 0;
  const alturaM = altura / 100;
  return peso / (alturaM * alturaM);
}

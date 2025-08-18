export function validar_Fecha(fecha) {
  if (!/^\d{8}$/.test(fecha)) return false;

  const anio = parseInt(fecha.substring(0, 4), 10);
  const mes = parseInt(fecha.substring(4, 6), 10);
  const dia = parseInt(fecha.substring(6, 8), 10);

  if (mes < 1 || mes > 12) return false;

  const diasPorMes = [31, esBisiesto(anio) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return dia >= 1 && dia <= diasPorMes[mes - 1];
}

export function esBisiesto(anio) {
  return (anio % 4 === 0 && anio % 100 !== 0) || (anio % 400 === 0);
}

import { ApodResponse, fetchDateRange } from "./ApodAPI";

export async function getApodForMonth(month: number, year: number) {
  const today = new Date();
  // Проверяем первый день на нижнюю границу по времени (16 мая 1995)
  const firstDay = new Date(
    year,
    month,
    (year === 1995 && month === 5 ? 17 : 2)
  ).toISOString().substring(0, 10)

  // Проверяем верхнюю границу, то бишь сегодняшний день
  const lastDay = 
    today.getMonth() === month &&
    today.getFullYear() === year
      ? today.toISOString().substring(0, 10)
      : new Date(year, month + 1, 1).toISOString().substring(0, 10)
    
  // Делаем запрос и ждем его
  const response = await fetchDateRange(firstDay, lastDay);
  
  // Передаем результат
  return response as ApodResponse;
}
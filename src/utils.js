export function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

export function calculateDuration(dateFrom, dateTo) {
  const start = new Date(dateFrom);
  const end = new Date(dateTo);

  const diffInMilliseconds = end - start;
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const remainingHours = diffInHours % 24;
  const remainingMinutes = diffInMinutes % 60;
  let duration = '';

  if (diffInDays > 0) {
    duration += `${diffInDays}D `;
  }
  if (remainingHours > 0) {
    duration += `${remainingHours}H `;
  }
  if (remainingMinutes > 0) {
    duration += `${remainingMinutes}M`;
  }

  return duration.trim();
}

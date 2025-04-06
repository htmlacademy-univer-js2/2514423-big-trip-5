import dayjs from 'dayjs';
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
function isPresentPoint(dateFrom,dateTo) {
  return dateFrom && dateTo && !dayjs().isAfter(dateTo, 'D') && !dayjs().isBefore(dateFrom, 'D');
}

function isPastPoint(dueDate) {
  return dueDate && dayjs().isAfter(dueDate, 'D');
}

function isFuturePoint(dueDate) {
  return dueDate && dayjs().isBefore(dueDate, 'D');
}
function capitalizeString(word){
  return word[0].toUpperCase() + word.slice(1);
}
function getOfferKeyword(title){
  return title.split(' ').slice(-1);
}

export {
  capitalizeString,
  getOfferKeyword,
  isPresentPoint,
  isFuturePoint,
  isPastPoint};

export const isEscapeKey = (evt) => evt.key === 'Escape';

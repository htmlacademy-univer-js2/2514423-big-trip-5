function updateItem(items, update) {
  return items.map((item) => item.id === update.id ? update : item);
}

function toCamelCase(obj){
  const keyMap = {
    'base_price': 'basePrice',
    'date_from': 'dateFrom',
    'date_to': 'dateTo',
    'is_favorite': 'isFavorite'
  };

  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = keyMap[key] || key;
    acc[camelKey] = obj[key];
    return acc;
  }, {});
}

export { updateItem,toCamelCase };

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

export { toCamelCase };

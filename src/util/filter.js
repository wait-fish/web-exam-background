export function filterCols(data, arr) { 
    return data.map(item => {
      arr.forEach(key => delete item[key]);
      return item;
    });
 }
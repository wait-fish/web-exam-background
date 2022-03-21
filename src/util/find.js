/**
 * 只用于处理 考试类型 和 菜单
 * 返回对象的索引
 * data是数组， index 是值
 * [
 *   {
 *      label: 0,
 *      value: "计算机应用技术" 
 *   }
 * ]
*/
function findIndex(data, label) {
  return data.findIndex(item => item.label === label);
}
function findIndexs(data, labelArray) {
  let arr = []
  let index = -1
  let twoIndex = -1
	// console.log(data)
  labelArray.forEach((item, i) => {
    if (i === 0) {
      index = findIndex(data, item)
			if (index == -1) return 
      arr.push(index)
    }
    if (i === 1) {
      twoIndex = findIndex(data[index].children, item)
			if (twoIndex == -1) return 
      arr.push(twoIndex)
			// console.log(index, twoIndex, arr);
    }
    if (i === 2) {
      index = findIndex(data[index].children[twoIndex].children, item)
			if (index == -1) return 
      arr.push(index)
    }
  });
  return arr;
}
function findValue(data, value) {
  for (const item of data) {
    if (item.value === value) {
      return [ item.label, item.value ]
    }
  }
}
function findValues(data, indexArray) {
  let arr = []
  let index = -1
  let twoIndex = -1
  let value = null
  indexArray.forEach((item, i) => {
    if (i === 0) {
      [ value, index ] = findValue(data, item)
      arr.push(value)
    }
    if (i === 1) {
			if (item === -1) return
      [value, twoIndex] = findValue(data[index].children, item)
      arr.push(value)
    }
    if (i === 2 ) {
			if (item === -1) return
      [value, index] = findValue(data[index].children[twoIndex].children, item)
      arr.push(value)
    }
  });
  return arr;
}

export { findIndex, findValue, findIndexs, findValues }

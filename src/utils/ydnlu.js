/*
* You Dont Need Lodash Underscore
*/

function clone(src) {
  let target = {};
  for (let prop in src) {
    if (src.hasOwnProperty(prop)) {
      target[prop] = src[prop];
    }
  }
  return target;
}

function pickByProp(arr, prop) {
  let newArr = [];
  arr.forEach(a => {
    newArr.push(a[prop]);
  });

  return [...new Set(newArr)];
}

function chunk(input, size) {
  return input.reduce((arr, item, idx) => {
    return idx % size === 0
      ? [...arr, [item]]
      : [...arr.slice(0, -1), [...arr.slice(-1)[0], item]];
  }, []);
}

function isEmpty(item) {
  if (
    item === null ||
    item === undefined ||
    (item.hasOwnProperty('length') && item.length === 0) ||
    (item.constructor === 'Object' &&
      Object.keys(item).length === 0)
  ) {
    return true;
  }
  return false;
}

function last(items) {
  return [...items].pop();
}

function secondLast(items) {
  return [...items].reverse()[1];
}

export let Methods = {
    clone: clone,
    pickByProp: pickByProp,
    chunk: chunk,
    isEmpty: isEmpty,
    pipe: (...fns) => x => fns.reduce((y, f) => f(y), x),
    last: last,
    secondLast: secondLast
};

export default Methods;

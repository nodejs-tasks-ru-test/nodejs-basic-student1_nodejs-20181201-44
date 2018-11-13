function sum(a, b) {
  if ([a,b].some(n => typeof n !== 'number'))
    throw new TypeError();

  return a + b;
}

module.exports = sum;

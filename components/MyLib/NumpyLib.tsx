/* Define functions in an alphabetical order */

const npArrange = (start: number, stop: number, step: number) => {
  var arr: number[] = []
  for (var i = start; i < stop; i += step) {
    arr.push(i)
  }
  return arr
}

const npLinspace = (start: number, stop: number, num: number) => {
  var arr: number[] = []
  var step = (stop - start) / (num - 1)
  for (var i = 0; i < num; i++) {
    arr.push(start + step * i)
  }
  return arr
}

/* Export functions in an alphabetical order */
export { npArrange, npLinspace }

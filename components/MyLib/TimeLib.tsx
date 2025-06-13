// conver hour,min,sec,msec to miliseconds
const hms2ms = (ms: number, s: number, m: number, h: number) => ms + s * 1000 + m * 1000 * 60 + h * 1000 * 60 * 60

const ms2hms = (miliseconds: number, digit: 0 | 1) => {
  const adjustDigit = (x: number) => {
    return x < 10 ? '0' + x : x
  }
  // milliseconds to hhmmss.x format
  let hour: number = Math.floor(miliseconds / 3600000)
  let ms = miliseconds % 3600000
  let min = Math.floor(ms / 60000)
  ms = ms % 60000
  let sec = Math.floor(ms / 1000)
  ms = ms % 1000
  let afterDP = digit === 0 ? '' : '.' + String(Math.floor(ms / 10 ** (3 - digit))) // after decimal point

  const hourString = hour // no need to adjust for hour
  const minString = hour === 0 ? min : adjustDigit(min)
  const secString = hour === 0 && min === 0 ? sec : adjustDigit(sec)
  if (hour != 0) {
    return hourString + ':' + minString + ':' + secString + afterDP
  } else if (min != 0) {
    return minString + ':' + secString + afterDP
  } else {
    return secString + afterDP
  }
}

export { ms2hms, hms2ms }

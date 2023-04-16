// continuous uniform distribution
const randomUniformContinuous = (from: number, to: number): number => {
  let u = Math.random()
  let n1 = Math.min(from, to)
  let n2 = Math.max(from, to)
  return n1 + u * (n2 - n1)
}

export { randomUniformContinuous }

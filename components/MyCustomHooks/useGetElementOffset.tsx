import { useEffect, useState } from 'react'
import useWindowResize from './useWindowResize'

export default function useGetElementOffset(ref: React.RefObject<HTMLElement>, which = 'top') {
  const [offset, setOffset] = useState<any>(0)
  const getElementOffset = () => {
    let result = null

    if (which === 'top') {
      result = ref.current?.offsetTop
    } else if (which === 'bottom') {
      if (ref.current?.offsetTop != null && ref.current?.offsetHeight != null) {
        result = ref.current?.offsetTop + ref.current?.offsetHeight
      }
    } else if (which === 'left') {
      result = ref.current?.offsetLeft
    } else if (which === 'right') {
      if (ref.current?.offsetLeft != null && ref.current?.offsetWidth != null) {
        result = ref.current?.offsetLeft + ref.current?.offsetWidth
      }
    } else if (which === 'width') {
      result = ref.current?.offsetWidth
    } else if (which === 'height') {
      result = ref.current?.offsetHeight
    }
    setOffset(result)
  }

  // initialize
  useEffect(() => {
    getElementOffset()
  }, [])

  // everytime window size changes
  useWindowResize(getElementOffset)
  return offset
}

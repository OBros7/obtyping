import { useEffect, useState } from 'react'

export default function useGetScrollY() {
  const [scrollY, setScrollY] = useState(0)
  const handleScroll = () => {
    setScrollY(window.scrollY)
  }
  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  return scrollY
}

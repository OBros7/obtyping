import { useEffect } from 'react'
// execute function everytime the window is resized
export default function useWindowResize(func: () => void) {
  useEffect(() => {
    window.addEventListener('resize', func)
    return () => window.removeEventListener('resize', func)
  }, [func])
}

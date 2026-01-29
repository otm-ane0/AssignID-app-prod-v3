import { useEffect } from 'react'

export const useOnClickOutside = (
  ref: any,
  handler = (event: any) => {},
  withinHandler = (event: any) => {},
  active = true,
) => {
  useEffect(() => {
    if (!active) return
    const listener = (event: any) => {
      // Do nothing if clicking ref's element or descendent elements
      const refs = Array.isArray(ref) ? ref : [ref]

      let contains = false
      refs.forEach((r) => {
        if (!r.current) {
          contains = true
          return
        }
        if (
          r.current &&
          r.current.contains &&
          r.current.contains(event.target)
        ) {
          contains = true
          withinHandler(event)
          return
        } else if (r.current && r.current.type && r.current.type === 'popup') {
          if (r.current.pContains(event.target)) {
            contains = true
            withinHandler(event)
            return
          }
        }
      })
      event.stopPropagation()
      if (!contains) handler(event)
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      if (!active) return
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler, active])
}

export const useOnClickOutsideCustom = ({
  inRef,
  outRef,
  superOutRef,
  inHandler,
  outHandler /** no any other are here */,
  superOutHandler,
  inWithOutHandler,
  outOfScopeHandler,
  active,
}: any) => {
  useEffect(() => {
    if (!active) return

    const listener = (event: any) => {
      const inRefs = Array.isArray(inRef) ? inRef : [inRef]
      const outRefs = Array.isArray(outRef) ? outRef : [outRef]
      const superOutRefs = Array.isArray(superOutRef)
        ? superOutRef
        : [superOutRef]

      let inContains = false
      let outContains = false
      let superOutContains = false

      inRefs.forEach((ref) => {
        /** invalid ref */
        if (!ref.current) {
          return
        }

        if (ref.current.contains) {
          if (ref.current.contains(event.target)) {
            /** inRef contains current event */
            inContains = true
          }
        } else {
          /** popup menu */
        }
      })

      outRefs.forEach((ref) => {
        /** invalid ref */
        if (!ref.current) {
          return
        }

        if (ref.current.contains) {
          if (ref.current.contains(event.target)) {
            /** outRef contains current event */
            outContains = true
          }
        } else {
          /** popup menu */
        }
      })

      superOutRefs.forEach((ref) => {
        /** invalid ref */
        if (!ref.current) {
          return
        }

        if (ref.current.contains) {
          if (ref.current.contains(event.target)) {
            /** superRef contains current event */
            superOutContains = true
          }
        } else {
          /** popup menu */
        }
      })

      if (inContains || outContains || superOutContains) {
        event.stopPropagation()
        if (inContains && !outContains && !superOutContains) {
          inHandler(event)
        } else if (!inContains && outContains && !superOutContains) {
          outHandler(event)
        } else if (!inContains && !outContains && superOutContains) {
          superOutHandler(event)
        } else if (inContains && outContains && !superOutContains) {
          inWithOutHandler(event)
        } else if (!inContains && !outContains && !superOutContains) {
          outOfScopeHandler(event)
        }
      }
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      if (!active) return
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [
    inRef,
    outRef,
    superOutRef,
    inHandler,
    outHandler,
    superOutHandler,
    inWithOutHandler,
    active,
  ])
}

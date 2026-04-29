import { useCallback, useEffect, useSyncExternalStore } from 'react'

function dispatchStorageEvent(key: string, newValue: string) {
  window.dispatchEvent(new StorageEvent('storage', { key, newValue }))
}

const getLocalStorageItem = (key: string) => window.localStorage.getItem(key)

const getLocalStorageServerSnapshot = () => {
  throw Error('useLocalStorage is a client-only hook')
}

const removeLocalStorageItem = (key: string) => {
  window.localStorage.removeItem(key)

  dispatchStorageEvent(key, null)
}

const setLocalStorageItem = <T>(key: string, value: T) => {
  const stringifiedValue = JSON.stringify(value)

  window.localStorage.setItem(key, stringifiedValue)

  dispatchStorageEvent(key, stringifiedValue)
}

const useLocalStorageSubscribe = callback => {
  window.addEventListener('storage', callback)

  return () => window.removeEventListener('storage', callback)
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const getSnapshot = () => getLocalStorageItem(key)

  const store = useSyncExternalStore(
    useLocalStorageSubscribe,
    getSnapshot,
    getLocalStorageServerSnapshot
  )

  const setState = useCallback(
    (value: T) => {
      try {
        const nextState =
          typeof value === 'function' ? value(JSON.parse(store)) : value

        if (nextState === undefined || nextState === null) {
          removeLocalStorageItem(key)
        } else {
          setLocalStorageItem(key, nextState)
        }
      } catch (e) {
        console.warn(e)
      }
    },
    [key, store]
  )

  useEffect(() => {
    if (
      getLocalStorageItem(key) === null &&
      typeof initialValue !== 'undefined'
    ) {
      setLocalStorageItem(key, initialValue)
    }
  }, [key, initialValue])

  return [store ? JSON.parse(store) : initialValue, setState]
}

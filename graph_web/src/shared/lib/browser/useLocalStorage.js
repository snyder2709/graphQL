import { APP_NAME } from '@/shared/config'


export function useLocalStorage (key, initialValue):  {
  const keyLS = `${APP_NAME}:${key}`

  const valueLS = window.localStorage.getItem(keyLS)
  const value = valueLS ? JSON.parse(valueLS) : initialValue

  function setLSValue(value: T) {
    window.localStorage.setItem(keyLS, JSON.stringify(value))
  }

  return { value, setLSValue }
}

import { BASE } from './constants'

export const fetchData = async <T>(...url: string[]): Promise<T> => {
  const res = await fetch(new URL(url.join('/'), new URL('data/', BASE)))

  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

export const fetchScript = async (url: string) => {
  const res = await fetch(new URL(url, new URL('js/', BASE)))

  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`)
  }

  return eval(await res.text())
}

import { selectAll } from 'css-select'
import type { Element } from 'domhandler'
import { getAttributeValue, innerText } from 'domutils'
import { parseDocument } from 'htmlparser2'

import { RATINGS } from '~constants'
import type { MonsterRating, MonsterRatings } from '~types'

import { BASE } from './constants'

const validateResponse = ({ ok, status, statusText, url }: Response) => {
  if (!ok) {
    throw new Error(`Failed to fetch ${url}: ${status} ${statusText}`)
  }
}

export const fetchData = async <T>(...url: string[]): Promise<T> => {
  const res = await fetch(new URL(url.join('/'), new URL('data/', BASE)))

  validateResponse(res)

  return res.json()
}

export const fetchRatings = async () => {
  const res = await fetch(
    new URL('https://rpgbot.net/dnd5/characters/classes/druid/wild-shape/')
  )

  validateResponse(res)

  const ratings = selectAll(
    '*[class^="rating-"]',
    parseDocument(await res.text())
  ).reduce<MonsterRatings>((ratings, element) => {
    const rating = getAttributeValue(
      element as unknown as Element,
      'class'
    ).replace(/rating-(\S+)/, '$1') as MonsterRating

    return { ...ratings, [innerText(element)]: RATINGS[rating] }
  }, {})

  return ratings
}

export const fetchScript = async (url: string) => {
  const res = await fetch(new URL(url, new URL('js/', BASE)))

  validateResponse(res)

  return eval(await res.text())
}

import { createWriteStream, existsSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'

import transliterate from '@sindresorhus/transliterate'
import { selectAll } from 'css-select'
import type { Element } from 'domhandler'
import { getAttributeValue, innerText } from 'domutils'
import { parseDocument } from 'htmlparser2'
import { Readable } from 'stream'

import { tokenURL } from '~components/Creature/utils'
import { RATINGS } from '~constants'
import type { CreatureURL, Rating, Ratings } from '~types'

import { BASE } from './constants'

const validateResponse = ({ ok, status, statusText, url }: Response) => {
  if (!ok) {
    throw new Error(`Failed to fetch ${url}: ${status} ${statusText}`)
  }
}

export const fetchData = async <T>(...url: string[]): Promise<T> => {
  const res = await fetch(new URL(url.join('/'), new URL('data/', BASE.src)))

  validateResponse(res)

  return res.json()
}

export const fetchRatings = async (...url: string[]) => {
  const res = await fetch(new URL(url.join('/'), BASE.rating))

  validateResponse(res)

  const ratings = selectAll(
    '*[class^="rating-"]',
    parseDocument(await res.text())
  ).reduce<Ratings>((ratings, element) => {
    const rating = getAttributeValue(
      element as unknown as Element,
      'class'
    ).replace(/rating-(\S+)/, '$1') as Rating
    const name = innerText(element)

    if (!!RATINGS[name.toLowerCase()]) return ratings

    return { ...ratings, [name]: RATINGS[rating] }
  }, {})

  return ratings
}

export const fetchScript = async (url: string) => {
  const res = await fetch(new URL(url, new URL('js/', BASE.src)))

  validateResponse(res)

  return eval(await res.text())
}

export const fetchToken = async ({ source, name }: CreatureURL) => {
  const filename = join('public', tokenURL({ source, name }))

  if (existsSync(filename)) return

  const res = await fetch(
    new URL(`bestiary/tokens/${source}/${transliterate(name)}.webp`, BASE.img)
  )

  validateResponse(res)
  ensureDir(filename)

  Readable.fromWeb(res.body).pipe(createWriteStream(filename))
}

export const filterStrings = (value: unknown) => typeof value === 'string'

export const ensureDir = (filename: string) => {
  const dir = dirname(filename)

  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
}

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
import type { Creature, MonsterRating, MonsterRatings } from '~types'

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
  const res = await fetch(new URL(url, new URL('js/', BASE.src)))

  validateResponse(res)

  return eval(await res.text())
}

export const fetchToken = async ({ source, name }: Partial<Creature>) => {
  const filename = join('public', tokenURL({ source, name }))

  if (existsSync(filename)) return

  const res = await fetch(
    new URL(`bestiary/tokens/${source}/${transliterate(name)}.webp`, BASE.img)
  )

  validateResponse(res)

  const dir = dirname(filename)

  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }

  Readable.fromWeb(res.body).pipe(createWriteStream(filename))
}

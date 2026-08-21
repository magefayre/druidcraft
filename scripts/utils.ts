import { createWriteStream, existsSync, mkdirSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { dirname, join, parse } from 'node:path'

import transliterate from '@sindresorhus/transliterate'
import { selectAll } from 'css-select'
import type { Element } from 'domhandler'
import { getAttributeValue, innerText } from 'domutils'
import { parseDocument } from 'htmlparser2'
import { Readable } from 'stream'

import { tokenURL } from '~components/Creature/utils'
import { RATINGS } from '~constants'
import { loadData } from '~data/utils'
import type { CreatureURL, MonsterRating, MonsterRatings } from '~types'

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

export const fetchRatings = async (outputDir: string) => {
  const filename = join(outputDir, 'ratings.json')

  if (existsSync(filename)) {
    return await loadData<MonsterRatings>(parse(filename).name)
  }

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

  await writeFile(filename, JSON.stringify(ratings))

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

export const ensureDir = (filename: string) => {
  const dir = dirname(filename)

  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
}

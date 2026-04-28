import { existsSync, mkdirSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import yargs from 'yargs'

import { LEVELS } from '~constants'
import type { Beast, Monster, Monsters, Source } from '~types'
import { getCircleFormsCR } from '~utils'

declare global {
  var Parser: { SOURCE_JSON_TO_FULL: Record<Source, string> }
}

const BASE = new URL(
  'https://raw.githubusercontent.com/5etools-mirror-3/5etools-2014-src/main/'
)
const MAX_CR = getCircleFormsCR(LEVELS.max)

const parseCR = (cr: string | { cr: string }): number | undefined => {
  if (typeof cr !== 'string' && cr?.hasOwnProperty('cr')) return parseCR(cr.cr)
  if (typeof cr === 'string') {
    if (!isNaN(cr as unknown as number)) return Number(cr)

    const parts = cr?.trim().split('/').filter(Boolean)

    if (parts?.length === 2) {
      return Number(parts[0]) / Number(parts[1])
    }
  }

  return undefined
}

const fetchData = async <T>(...url: string[]): Promise<T> => {
  const res = await fetch(new URL(url.join('/'), new URL('data/', BASE)))

  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

const fetchScript = async (url: string) => {
  const res = await fetch(new URL(url, new URL('js/', BASE)))

  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`)
  }

  return eval(await res.text())
}

const filterBeasts = (monsters: Monster[]) =>
  monsters.reduce<Beast[]>((beasts, { cr, name, source, speed, type }) => {
    const challenge = parseCR(cr)!

    return type === 'beast' && challenge <= MAX_CR
      ? [...beasts, { cr: challenge, name, source, speed }]
      : beasts
  }, [])

const filterCopies = (monsters: Monster[], existing: Beast[]) =>
  monsters.reduce<Beast[]>((beasts, { _copy, cr, ...rest }) => {
    const base = existing.find(
      ({ name, source }) => _copy?.name === name && _copy?.source === source
    )

    return !!base
      ? [
          ...beasts,
          {
            ...Object.entries(base).reduce<Beast>((beast, [key, value]) => {
              return {
                ...beast,
                [key]: (rest as unknown as Monster)[key] ?? value
              }
            }, {} as Beast),
            cr: parseCR(cr) ?? base.cr
          }
        ]
      : beasts
  }, [])

const sortBeasts = (a: Beast, b: Beast) => {
  if (a.cr !== b.cr) return a.cr - b.cr

  return a.name.localeCompare(b.name)
}

;(async () => {
  const { outputDir } = await yargs(process.argv)
    .options({
      outputDir: { alias: 'output', demandOption: true, type: 'string' }
    })
    .parse()

  const monsterURLs = await fetchData<Record<Source, string>>(
    'bestiary',
    'index.json'
  )
  const monsters: Monster[] = []

  await Promise.all(
    Object.values(monsterURLs).map(async url => {
      const { monster } = await fetchData<Monsters>('bestiary', url)

      monsters.push(...monster)
    })
  )

  const beasts: Beast[] = filterBeasts(monsters)

  beasts.push(...filterCopies(monsters, beasts))

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
  }

  await writeFile(
    join(outputDir, 'beasts.json'),
    JSON.stringify(beasts.sort(sortBeasts))
  )

  await fetchScript('parser.js')

  const sources = Object.entries(globalThis.Parser.SOURCE_JSON_TO_FULL).reduce(
    (books, [source, name]) => {
      return beasts.some(beast => beast.source === source)
        ? { ...books, [source]: name }
        : books
    },
    {}
  )

  await writeFile(join(outputDir, 'sources.json'), JSON.stringify(sources))
})()

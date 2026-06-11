import { existsSync, mkdirSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import yargs from 'yargs'

import { LEVELS } from '~constants'
import type { Creature, Monster, Monsters, Source } from '~types'
import { getCircleFormsCR } from '~utils/monsters'

import { fetchData, fetchScript } from './utils'

declare global {
  var Parser: { SOURCE_JSON_TO_FULL: Record<Source, string> }
}

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

const parseType = (type: string | { type: string; swarmSize: string }) => {
  if (
    typeof type !== 'string' &&
    type?.hasOwnProperty('type') &&
    !type.swarmSize
  ) {
    return parseType(type.type)
  }

  if (typeof type === 'string') return type

  return undefined
}

const filterMonsters = (
  monsters: Monster[],
  filters: { type: string; cr?: number }
) =>
  monsters.reduce<Creature[]>((creatures, monster) => {
    const {
      isNpc,
      name,
      reprintedAs,
      source,
      speed,
      summonedBySpell: spell
    } = monster
    const cr = parseCR(monster.cr)!
    const type = parseType(monster.type)

    return !isNpc &&
      !reprintedAs &&
      type === filters.type &&
      (cr <= (filters.cr ?? Number.MAX_SAFE_INTEGER) || (!cr && !!spell))
      ? [...creatures, { cr, name, source, speed, spell }]
      : creatures
  }, [])

const filterCopies = (monsters: Monster[], existing: Creature[]) =>
  monsters.reduce<Creature[]>((creatures, { _copy, cr, ...rest }) => {
    const base = existing.find(
      ({ name, source }) => _copy?.name === name && _copy?.source === source
    )

    return !!base
      ? [
          ...creatures,
          {
            ...Object.entries(base).reduce<Creature>(
              (creatures, [key, value]) => ({
                ...creatures,
                [key]: (rest as unknown as Monster)[key] ?? value
              }),
              {} as Creature
            ),
            cr: parseCR(cr) ?? base.cr
          }
        ]
      : creatures
  }, [])

const sortCreatures = (a: Creature, b: Creature) => {
  if (a.cr !== b.cr)
    return (a.cr ?? Number.MIN_SAFE_INTEGER) - (b.cr ?? Number.MIN_SAFE_INTEGER)
  if (a.name !== b.name) return a.name.localeCompare(b.name)

  return a.source.localeCompare(b.source)
}

;(async () => {
  const { outputDir } = await yargs(process.argv)
    .options({
      outputDir: { alias: 'output', demandOption: true, type: 'string' }
    })
    .parse()

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
  }

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

  const beasts: Creature[] = filterMonsters(monsters, {
    type: 'beast',
    cr: getCircleFormsCR(LEVELS.max)
  })

  beasts.push(...filterCopies(monsters, beasts))

  await writeFile(
    join(outputDir, 'beasts.json'),
    JSON.stringify(beasts.sort(sortCreatures))
  )

  const feys: Creature[] = filterMonsters(monsters, { type: 'fey' })

  await writeFile(
    join(outputDir, 'feys.json'),
    JSON.stringify(feys.sort(sortCreatures))
  )

  await fetchScript('parser.js')

  const sources = Object.entries(globalThis.Parser.SOURCE_JSON_TO_FULL).reduce(
    (books, [source, name]) => {
      // TODO check all types
      return beasts.some(beast => beast.source === source)
        ? { ...books, [source]: name }
        : books
    },
    {}
  )

  await writeFile(join(outputDir, 'sources.json'), JSON.stringify(sources))
})()

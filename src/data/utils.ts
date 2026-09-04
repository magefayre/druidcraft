import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { join, parse } from 'node:path'

import plur from 'plur'

import { ensureDir, fetchRatings } from '~scripts/utils'
import type { Creature, CreatureType, Ratings, RatingType } from '~types'

export const loadData = async <T>(file: string): Promise<T> =>
  await readFile(join(process.cwd(), 'src/data', `${file}.json`), 'utf8')
    .then(JSON.parse)
    .catch(() => undefined)

export const loadCreatures = async <T extends CreatureType, U extends Creature>(
  types: T | T[],
  filters?: Partial<Record<T, (creature: U) => boolean>>
) => {
  const creatures: Record<T, U[]> = {} as Record<T, U[]>

  if (typeof types === 'string') types = [types]

  await Promise.all(
    types.map(async type => {
      creatures[type] = (await loadData<U[]>(plur(type))).filter(
        filters?.[type] ?? Boolean
      )
    })
  )

  return creatures
}

export const loadRatings = async (outputDir: string, cache = true) => {
  const filename = join(outputDir, 'ratings.json')

  if (cache && existsSync(filename)) {
    return await loadData<Ratings>(parse(filename).name)
  }

  const ratings: Ratings = {}
  const ratingURLs = {
    polymorph: 'spells/polymorph',
    wildshape: 'classes/druid/wild-shape'
  } satisfies Record<RatingType, string>

  await Promise.all(
    Object.entries(ratingURLs).map(async ([type, url]) => {
      ratings[type] = await fetchRatings(url)
    })
  )

  await writeData(filename, ratings)

  return ratings
}

export const writeData = async (file: string, content: unknown) => {
  ensureDir(file)

  await writeFile(file, JSON.stringify(content))
}

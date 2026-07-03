import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import plur from 'plur'

import type { Creature, MonsterType } from '~types'

const loadData = async <T>(file: string): Promise<T> =>
  await readFile(join(process.cwd(), 'src/data', `${file}.json`), 'utf8').then(
    JSON.parse
  )

export const loadCreatures = async <T extends MonsterType, U extends Creature>(
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

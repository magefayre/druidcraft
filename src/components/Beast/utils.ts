import type { Beast } from '~types'

export const normalize = (name: string) =>
  name.normalize('NFD').replace(/\p{Diacritic}/gu, '')

export const tokenURL = ({ source, name }: Pick<Beast, 'source' | 'name'>) =>
  `/tokens/${source}/${normalize(name)}`

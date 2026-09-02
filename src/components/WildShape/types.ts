import type { Creature, CreatureType, Source, Speed } from '~types'

export type WildShapeFormData = {
  level: number
  circleForms: boolean
  sort: string
  source: Source[]
  speed: Speed | ''
}

export type WildShapeProps = {
  creatures: Record<Extract<CreatureType, 'beast' | 'elemental'>, Creature[]>
}

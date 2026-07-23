import type { Creature, MonsterType, Speed } from '~types'

export type WildShapeFormData = {
  level: number
  circleForms: boolean
  sort: string
  source: string[]
  speed: Speed
}

export type WildShapeProps = {
  creatures: Record<Extract<MonsterType, 'beast' | 'elemental'>, Creature[]>
}

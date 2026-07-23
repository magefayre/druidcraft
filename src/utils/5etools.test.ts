import { EMPTY, SPELL_LEVELS } from '~constants'
import type { Creature, Speeds } from '~types'
import {
  formatCR,
  formatSpeedLimits,
  formatSpellLevel,
  getMaxCR,
  getSpellCR,
  getSummonLimit,
  getTypeCR,
  isSpeedLimited,
  sortCreatures
} from '~utils/5etools'

const speed: Speeds = { swim: 30, fly: 30 }

describe('formatCR', () => {
  it('should format CR as expected', () => {
    expect(formatCR(undefined)).toEqual(EMPTY)
    expect(formatCR(0.5)).toEqual('1/2')
    expect(formatCR(1)).toEqual(1)
  })
})

describe('formatSpeedLimits', () => {
  it('should format speed limitations as expected', () => {
    expect(formatSpeedLimits(1)).toEqual(EMPTY)
    expect(formatSpeedLimits(2)).toMatch(/((fly){1}.+(swim){1})/)
    expect(formatSpeedLimits(3)).toMatch(/((fly){1}.+(swim){1})/)
    expect(formatSpeedLimits(4)).toMatch(/((fly){1}.+(swim){0})/)
    expect(formatSpeedLimits(5)).toMatch(/((fly){1}.+(swim){0})/)
    expect(formatSpeedLimits(6)).toMatch(/((fly){1}.+(swim){0})/)
    expect(formatSpeedLimits(7)).toMatch(/((fly){1}.+(swim){0})/)
    expect(formatSpeedLimits(8)).toEqual(EMPTY)
    expect(formatSpeedLimits(9)).toEqual(EMPTY)
    expect(formatSpeedLimits(10)).toEqual(EMPTY)
    expect(formatSpeedLimits(11)).toEqual(EMPTY)
    expect(formatSpeedLimits(12)).toEqual(EMPTY)
    expect(formatSpeedLimits(13)).toEqual(EMPTY)
    expect(formatSpeedLimits(14)).toEqual(EMPTY)
    expect(formatSpeedLimits(15)).toEqual(EMPTY)
    expect(formatSpeedLimits(16)).toEqual(EMPTY)
    expect(formatSpeedLimits(17)).toEqual(EMPTY)
    expect(formatSpeedLimits(18)).toEqual(EMPTY)
    expect(formatSpeedLimits(19)).toEqual(EMPTY)
    expect(formatSpeedLimits(20)).toEqual(EMPTY)
  })
})

describe('formatSpellLevel', () => {
  it('should format level as expected', () => {
    expect(formatSpellLevel(0)).toEqual('Cantrip')
    expect(formatSpellLevel(1)).toEqual('1st')
    expect(formatSpellLevel(2)).toEqual('2nd')
    expect(formatSpellLevel(3)).toEqual('3rd')
    expect(formatSpellLevel(4)).toEqual('4th')
    expect(formatSpellLevel(5)).toEqual('5th')
    expect(formatSpellLevel(6)).toEqual('6th')
  })
})

describe('getMaxCR', () => {
  it('should calculate max CR as expected', () => {
    expect(getMaxCR({ level: 1 })).toEqual(null)
    expect(getMaxCR({ level: 2 })).toEqual(0.25)
    expect(getMaxCR({ level: 3 })).toEqual(0.25)
    expect(getMaxCR({ level: 4 })).toEqual(0.5)
    expect(getMaxCR({ level: 5 })).toEqual(0.5)
    expect(getMaxCR({ level: 6 })).toEqual(0.5)
    expect(getMaxCR({ level: 7 })).toEqual(0.5)
    expect(getMaxCR({ level: 8 })).toEqual(1)
    expect(getMaxCR({ level: 9 })).toEqual(1)
    expect(getMaxCR({ level: 10 })).toEqual(1)
    expect(getMaxCR({ level: 11 })).toEqual(1)
    expect(getMaxCR({ level: 12 })).toEqual(1)
    expect(getMaxCR({ level: 13 })).toEqual(1)
    expect(getMaxCR({ level: 14 })).toEqual(1)
    expect(getMaxCR({ level: 15 })).toEqual(1)
    expect(getMaxCR({ level: 16 })).toEqual(1)
    expect(getMaxCR({ level: 17 })).toEqual(1)
    expect(getMaxCR({ level: 18 })).toEqual(1)
    expect(getMaxCR({ level: 19 })).toEqual(1)
    expect(getMaxCR({ level: 20 })).toEqual(1)
  })

  it('should calculate max CR for Circle of the Moon', () => {
    const circleForms = true

    expect(getMaxCR({ level: 1, circleForms })).toEqual(null)
    expect(getMaxCR({ level: 2, circleForms })).toEqual(1)
    expect(getMaxCR({ level: 3, circleForms })).toEqual(1)
    expect(getMaxCR({ level: 4, circleForms })).toEqual(1)
    expect(getMaxCR({ level: 5, circleForms })).toEqual(1)
    expect(getMaxCR({ level: 6, circleForms })).toEqual(2)
    expect(getMaxCR({ level: 7, circleForms })).toEqual(2)
    expect(getMaxCR({ level: 8, circleForms })).toEqual(2)
    expect(getMaxCR({ level: 9, circleForms })).toEqual(3)
    expect(getMaxCR({ level: 10, circleForms })).toEqual(3)
    expect(getMaxCR({ level: 11, circleForms })).toEqual(3)
    expect(getMaxCR({ level: 12, circleForms })).toEqual(4)
    expect(getMaxCR({ level: 13, circleForms })).toEqual(4)
    expect(getMaxCR({ level: 14, circleForms })).toEqual(4)
    expect(getMaxCR({ level: 15, circleForms })).toEqual(5)
    expect(getMaxCR({ level: 16, circleForms })).toEqual(5)
    expect(getMaxCR({ level: 17, circleForms })).toEqual(5)
    expect(getMaxCR({ level: 18, circleForms })).toEqual(6)
    expect(getMaxCR({ level: 19, circleForms })).toEqual(6)
    expect(getMaxCR({ level: 20, circleForms })).toEqual(6)
  })
})

describe('getSpellCR', () => {
  it('should calculate the spell CR as expected', () => {
    expect(getSpellCR()).toEqual(undefined)
    expect(getSpellCR({ level: 1, type: 'beast' })).toEqual(undefined)
    expect(getSpellCR({ level: 1, type: 'beast', maxCR: 10 })).toEqual(10)
    expect(getSpellCR({ level: 1, type: 'beast', maxCR: true })).toEqual(1)
    expect(getSpellCR({ level: 1, type: 'beast', upcast: true })).toEqual(
      undefined
    )
    expect(getSpellCR({ level: 1, type: 'beast', upcast: true }, 20)).toEqual(
      20
    )
  })
})

describe('getSummonLimit', () => {
  it('should calculate the summon limit as expected', () => {
    expect(getSummonLimit(undefined)).toEqual(undefined)
    expect(getSummonLimit(0)).toEqual(8)
    expect(getSummonLimit(0.25)).toEqual(8)
    expect(getSummonLimit(0.5)).toEqual(4)
    expect(getSummonLimit(1)).toEqual(2)
    expect(getSummonLimit(2)).toEqual(1)
    expect(getSummonLimit(3)).toEqual(undefined)
  })
})

describe('getTypeCR', () => {
  it('should calculate the creature type CR as expected', () => {
    expect(getTypeCR('beast')).toEqual(2)
    expect(getTypeCR('dragon')).toEqual(undefined)
    expect(getTypeCR('elemental')).toEqual(SPELL_LEVELS.max)
    expect(getTypeCR('fey')).toEqual(SPELL_LEVELS.max)
    expect(getTypeCR('plant')).toEqual(undefined)
  })
})

describe('isSpeedLimited', () => {
  it('should determine if speed is limited as expected', () => {
    expect(isSpeedLimited(3, speed, 'swim')).toEqual(true)
    expect(isSpeedLimited(3, { ...speed, swim: undefined }, 'swim')).toEqual(
      false
    )
    expect(isSpeedLimited(4, speed, 'swim')).toEqual(false)
    expect(isSpeedLimited(4, speed, 'fly')).toEqual(true)
    expect(isSpeedLimited(4, { ...speed, fly: undefined }, 'fly')).toEqual(
      false
    )
    expect(isSpeedLimited(8, speed, 'fly')).toEqual(false)
  })
})

describe('sortCreatures', () => {
  it('should sort the creatures as expected', () => {
    const creatures: Creature[] = [
      { name: 'UndefinedCR', source: 'AAA', speed },
      { cr: 1, name: 'LowestCR-Z', source: 'AAA', speed },
      { cr: 1, name: 'LowestCR-A', source: 'AAA', speed },
      { cr: 2, name: 'HighestCR', source: 'BBB', speed },
      { cr: 2, name: 'HighestCR', source: 'AAA', speed }
    ]

    expect(creatures.sort(sortCreatures())).toEqual([
      { name: 'UndefinedCR', source: 'AAA', speed },
      { cr: 1, name: 'LowestCR-A', source: 'AAA', speed },
      { cr: 1, name: 'LowestCR-Z', source: 'AAA', speed },
      { cr: 2, name: 'HighestCR', source: 'AAA', speed },
      { cr: 2, name: 'HighestCR', source: 'BBB', speed }
    ])
    expect(creatures.sort(sortCreatures('cr'))).toEqual([
      { name: 'UndefinedCR', source: 'AAA', speed },
      { cr: 1, name: 'LowestCR-A', source: 'AAA', speed },
      { cr: 1, name: 'LowestCR-Z', source: 'AAA', speed },
      { cr: 2, name: 'HighestCR', source: 'AAA', speed },
      { cr: 2, name: 'HighestCR', source: 'BBB', speed }
    ])
    expect(creatures.sort(sortCreatures('cr', true))).toEqual([
      { cr: 2, name: 'HighestCR', source: 'AAA', speed },
      { cr: 2, name: 'HighestCR', source: 'BBB', speed },
      { cr: 1, name: 'LowestCR-A', source: 'AAA', speed },
      { cr: 1, name: 'LowestCR-Z', source: 'AAA', speed },
      { name: 'UndefinedCR', source: 'AAA', speed }
    ])
    expect(creatures.sort(sortCreatures('name'))).toEqual([
      { cr: 2, name: 'HighestCR', source: 'AAA', speed },
      { cr: 2, name: 'HighestCR', source: 'BBB', speed },
      { cr: 1, name: 'LowestCR-A', source: 'AAA', speed },
      { cr: 1, name: 'LowestCR-Z', source: 'AAA', speed },
      { name: 'UndefinedCR', source: 'AAA', speed }
    ])
    expect(creatures.sort(sortCreatures('name', true))).toEqual([
      { name: 'UndefinedCR', source: 'AAA', speed },
      { cr: 1, name: 'LowestCR-Z', source: 'AAA', speed },
      { cr: 1, name: 'LowestCR-A', source: 'AAA', speed },
      { cr: 2, name: 'HighestCR', source: 'AAA', speed },
      { cr: 2, name: 'HighestCR', source: 'BBB', speed }
    ])
  })
})

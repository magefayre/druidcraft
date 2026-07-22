import { useMemo } from 'react'

import type { Option } from '~components/Select'
import { DESCENDING, SEPARATOR, SORTING } from '~constants'
import type { Creature } from '~types'

export const useFormData = <T>(selected: T, defaults: T) =>
  useMemo<T>(
    () =>
      Object.entries(defaults).reduce<T>(
        (formData, [key, value]) => ({
          ...formData,
          [key]: selected[key] ?? value
        }),
        selected
      ),
    [selected]
  )

export const useSorting = <T extends keyof Creature>(...exclude: T[]) =>
  useMemo<Option[]>(
    () =>
      Object.entries(SORTING).reduce((options, [key, { min, max }]) => {
        const value = key.toLowerCase()
        const label = (a: string, b: string) => `${key}: ${a}-${b}`

        return !exclude?.includes(value as T)
          ? [
              ...options,
              { value, label: label(min, max) },
              {
                value: [value, DESCENDING].join(SEPARATOR),
                label: label(max, min)
              }
            ]
          : options
      }, []),
    [exclude]
  )

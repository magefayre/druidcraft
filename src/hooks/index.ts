import { useMemo } from 'react'

import type { Option } from '~components/Select'
import { DESCENDING, SEPARATOR, SORTING } from '~constants'

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

export const useSorting = () =>
  useMemo<Option[]>(
    () =>
      Object.entries(SORTING).reduce((options, [key, { min, max }]) => {
        const value = key.toLowerCase()
        const label = (a: string, b: string) => `${key}: ${a}-${b}`

        return [
          ...options,
          { value, label: label(min, max) },
          { value: [value, DESCENDING].join(SEPARATOR), label: label(max, min) }
        ]
      }, []),
    []
  )

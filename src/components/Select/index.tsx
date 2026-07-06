import type { ComponentPropsWithoutRef, FC, ReactNode } from 'react'

import { FilterField } from '~components/Filter'
import { EMPTY } from '~constants'

import styles from './Select.module.scss'

type Option = { value: string | number; label?: ReactNode; disabled?: boolean }

type Props = Omit<ComponentPropsWithoutRef<'select'>, 'children'> & {
  label: string
  options?: Option[]
}

const getLabel = (option: Option) => {
  if (!option) return EMPTY

  const { label, value } = option

  return label ?? (!!value ? value : EMPTY)
}

const Select: FC<Props> = ({ id, label, value, options, ...rest }) => {
  if (!options) return null

  let selected = undefined

  if (Array.isArray(value) && value.length > 0) {
    selected = { label: `(${value.length})` }
  } else {
    selected = options.find(option => `${option.value}` === `${value}`)
  }

  return (
    <FilterField id={id} label={label}>
      {getLabel(selected)}
      <select
        id={id}
        name={id}
        value={value}
        className={styles.select}
        {...rest}
      >
        {options.map(({ value, label, disabled }) => (
          <option key={value} value={value} disabled={disabled}>
            {getLabel({ label, value })}
          </option>
        ))}
      </select>
    </FilterField>
  )
}

export default Select

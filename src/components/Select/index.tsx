import { Icon } from '@newhighsco/chipset'
import {
  type ChangeEventHandler,
  type FC,
  type MouseEventHandler,
  type ReactNode,
  useMemo
} from 'react'

import type { FilterFieldProps } from '~components/Filter'
import { FilterField } from '~components/Filter'
import { EMPTY } from '~constants'

import styles from './Select.module.scss'

export type Option = { value: string; label?: ReactNode; disabled?: boolean }

type BaseProps = Omit<
  FilterFieldProps<'select'>,
  'children' | 'multiple' | 'value' | 'defaultValue'
> & { options?: Option[] }
type SingleProps = BaseProps & {
  multiple?: undefined | false
  value: string
  defaultValue?: string
}
type MultipleProps = BaseProps & {
  multiple: true
  value: string[]
  defaultValue?: string[]
}
type Props = SingleProps | MultipleProps

const LABELS = { all: 'All', reset: 'Reset' }

const getLabel = (option: Partial<Option>) => {
  if (!option) return EMPTY

  const { label, value } = option

  return label ?? (!!value ? value : EMPTY)
}

const Select: FC<Props> = ({
  id,
  label,
  value,
  multiple,
  defaultValue,
  options,
  onChange
}) => {
  const all = useMemo(() => options.map(({ value }) => value), [options])

  if (!options) return null

  const handleChange: ChangeEventHandler<HTMLSelectElement> = e => {
    let value: string | string[] = e.target.value

    if (multiple) {
      const selected = Array.from(e.target.selectedOptions)

      value = selected.map(({ value }) => value).filter(Boolean)

      if (selected.some(({ dataset }) => !!dataset.toggleAll)) {
        value = !allSelected ? all : defaultValue
      }
    }

    onChange?.(id, value)
  }

  const handleReset: MouseEventHandler<HTMLButtonElement> = e => {
    e.preventDefault()

    onChange(e.currentTarget.value, defaultValue)
  }

  const allSelected = multiple && value?.length === all.length
  const selected =
    multiple && value?.length > 0
      ? { label: allSelected ? LABELS.all : `(${value.length})` }
      : options.find(option => option.value === value)

  return (
    <FilterField id={id} label={label}>
      {getLabel(selected)}
      <select
        id={id}
        name={id}
        value={value}
        multiple={multiple}
        size={multiple ? 1 : undefined}
        className={styles.select}
        onChange={handleChange}
      >
        {multiple && (
          <option
            data-toggle-all
            value=""
            aria-checked={
              value?.length > 0 && value.length < all.length
                ? 'mixed'
                : allSelected
            }
          >
            {LABELS.all}
          </option>
        )}
        {options.map(({ value, label, disabled }) => (
          <option key={value} value={value} disabled={disabled}>
            {getLabel({ label, value })}
          </option>
        ))}
      </select>
      {defaultValue !== undefined && !!selected?.label && (
        <button
          type="reset"
          value={id}
          className={styles.reset}
          onClick={handleReset}
        >
          <Icon name="mdi:close" alt={LABELS.reset} className={styles.icon} />
        </button>
      )}
    </FilterField>
  )
}

export default Select

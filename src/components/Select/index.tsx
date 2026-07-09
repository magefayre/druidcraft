import {
  type ChangeEventHandler,
  type FC,
  type ReactNode,
  useMemo
} from 'react'

import type { FilterFieldProps } from '~components/Filter'
import { FilterField } from '~components/Filter'
import { EMPTY } from '~constants'

import styles from './Select.module.scss'

type Option = { value: string; label?: ReactNode; disabled?: boolean }
type BaseProps = Omit<
  FilterFieldProps<'select'>,
  'children' | 'multiple' | 'value'
> & { options?: Option[] }
type SingleProps = BaseProps & { multiple?: undefined | false; value: string }
type MultipleProps = BaseProps & { multiple: true; value: string[] }
type Props = SingleProps | MultipleProps

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
        value = !allSelected ? all : []
      }
    }

    onChange?.(id, value)
  }

  const allSelected = multiple && value?.length === all.length
  const selected =
    multiple && value?.length > 0
      ? { label: `(${value.length})` }
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
            {!allSelected ? 'All' : 'None'}
          </option>
        )}
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

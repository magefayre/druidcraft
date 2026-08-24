import { classNames, List } from '@newhighsco/chipset'
import type PropTypes from 'prop-types'
import type { FC, PropsWithChildren } from 'react'

import styles from './DefinitionList.module.scss'

type DefinitionProps = PropsWithChildren<{ term: string; visible?: boolean }>
type DefinitionListProps = PropTypes.InferProps<List.propTypes>

export const Definition: FC<DefinitionProps> = ({
  term,
  children,
  visible = true
}) => {
  if (!visible) return null

  return (
    <div>
      <dt>{term}</dt>
      <dd>{children}</dd>
    </div>
  )
}

const DefinitionList: FC<DefinitionListProps> = ({ className, ...rest }) => (
  <List as="dl" className={classNames(styles.root, className)} {...rest} />
)

export default DefinitionList

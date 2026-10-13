import { classNames, List } from '@newhighsco/chipset'
import type PropTypes from 'prop-types'
import type { FC, PropsWithChildren } from 'react'

import styles from './DefinitionList.module.scss'

type DefinitionProps = PropsWithChildren<{ term: string; className?: string }>
type DefinitionListProps = PropTypes.InferProps<List.propTypes>

export const Definition: FC<DefinitionProps> = ({
  term,
  children,
  className
}) => (
  <div>
    <dt>{term}</dt>
    <dd className={className}>{children}</dd>
  </div>
)

const DefinitionList: FC<DefinitionListProps> = ({ className, ...rest }) => (
  <List as="dl" className={classNames(styles.root, className)} {...rest} />
)

export default DefinitionList

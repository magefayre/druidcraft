import { classNames, List } from '@newhighsco/chipset'
import { type FC, Fragment, type PropsWithChildren } from 'react'

import Tags from '~components/Tags'
import type { Action } from '~types'

import styles from './ActionList.module.scss'

type Props = { heading: string; actions?: Action[] }

export const ActionLabel: FC<PropsWithChildren<{ subheading?: boolean }>> = ({
  subheading,
  children
}) => {
  const Component = subheading ? 'h4' : 'span'

  return (
    <>
      <Component
        className={classNames(styles.label, subheading && styles.subheading)}
      >
        {children}
      </Component>{' '}
    </>
  )
}

const ActionList: FC<Props> = ({ heading, actions }) => {
  if (!actions?.length) return null

  return (
    <div className={styles.root}>
      <h2 className={styles.heading}>{heading}</h2>
      <List unstyled className={styles.list}>
        {actions.map(({ name, entries }) => (
          <li key={name}>
            <h3 className={styles.name}>
              <Tags>{name}</Tags>
            </h3>
            {entries.map((entry, index) => (
              <Fragment key={[index, entry].join()}>
                {index > 0 && <br />}
                <Tags>{entry}</Tags>
              </Fragment>
            ))}
          </li>
        ))}
      </List>
    </div>
  )
}

export default ActionList

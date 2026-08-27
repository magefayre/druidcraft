import { List } from '@newhighsco/chipset'
import type { FC, PropsWithChildren } from 'react'

import Tags from '~components/Tags'
import type { Action } from '~types'

import styles from './ActionList.module.scss'

type Props = { heading: string; actions?: Action[] }

export const ActionLabel: FC<PropsWithChildren> = ({ children }) => (
  <>
    <span className={styles.label}>{children}</span>{' '}
  </>
)

const ActionList: FC<Props> = ({ heading, actions }) => {
  if (!actions?.length) return null

  return (
    <div className={styles.root}>
      <h2 className={styles.heading}>{heading}</h2>
      <List unstyled>
        {actions.map(({ name, entries }) => (
          <li key={name}>
            <h3 className={styles.name}>
              <Tags>{name}</Tags>
            </h3>
            {entries.map(entry => (
              <Tags key={entry}>{entry}</Tags>
            ))}
          </li>
        ))}
      </List>
    </div>
  )
}

export default ActionList

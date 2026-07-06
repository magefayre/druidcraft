import type { FC, PropsWithChildren, ReactNode } from 'react'

import Section from '~components/Section'

import styles from './Filter.module.scss'

export const FilterField: FC<
  PropsWithChildren & { id: string; label: ReactNode }
> = ({ id, label, children, ...rest }) => (
  <div className={styles.field} {...rest}>
    <label htmlFor={id}>{label}</label>
    {children}
  </div>
)

type Props = PropsWithChildren

const Filter: FC<Props> = ({ children }) => (
  <Section theme={{ root: styles.root, content: styles.content }}>
    {children}
  </Section>
)

export default Filter

import { List, SmartLink } from '@newhighsco/chipset'
import { type FC, type MouseEventHandler, useRef, useState } from 'react'
import useSWR from 'swr'

import Dialog from '~components/Dialog'

import { CreatureCard, CreatureDetails } from '.'
import styles from './CreatureList.module.scss'
import type { CreatureListProps } from './types'

const CreatureList: FC<CreatureListProps> = ({
  creatures,
  isCreatureDisabled,
  isCreatureLimited,
  ratings,
  speedLimits
}) => {
  const dialogRef = useRef(null)
  const [href, setHref] = useState<string>(null)
  const { data } = useSWR(href ? ['/api', href].join('/') : null, (...args) =>
    fetch(...args).then(res => res.json())
  )

  if (!creatures?.length) return null

  const handleClick: MouseEventHandler<HTMLAnchorElement> = async e => {
    e.preventDefault()

    const { pathname } = new URL((e.target as HTMLAnchorElement).href)

    setHref(pathname)

    dialogRef.current.showModal()
  }

  return (
    <>
      <List unstyled className={styles.root}>
        {creatures.map((creature, index) => {
          const { name, rating, source } = creature

          return (
            <li key={`${source}/${name}`} className={styles.item}>
              <CreatureCard
                {...creature}
                disabled={isCreatureDisabled?.(creature)}
                limit={isCreatureLimited?.(creature)}
                priority={index < 12}
                rating={ratings ? rating?.[ratings] : undefined}
                speedLimits={speedLimits}
                renderLink={props => (
                  <SmartLink
                    {...props}
                    onClick={handleClick}
                    prefetch={false}
                  />
                )}
              />
            </li>
          )
        })}
      </List>
      <Dialog ref={dialogRef}>
        {data && <CreatureDetails {...data} dialog />}
      </Dialog>
    </>
  )
}

export default CreatureList

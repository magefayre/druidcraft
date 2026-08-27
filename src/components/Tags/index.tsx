import { type FC, Fragment } from 'react'

import { TAGS } from './constants'

type TagsProps = { children?: string }

const Tags: FC<TagsProps> = ({ children }) => {
  if (!children) return null

  return children.split(/{|}/).map(match => {
    const { groups: { tag, args = '' } = {} } =
      match.match(/@(?<tag>\w+)(\s(?<args>.+))?/) ?? {}

    return (
      <Fragment key={match}>
        {TAGS[tag]?.(...args.split('|')) ?? match}
      </Fragment>
    )
  })
}

export default Tags

import { type FC, Fragment } from 'react'

import { TAGS } from './constants'

type TagsProps = { label?: string; children?: string }

const Tags: FC<TagsProps> = ({ label, children }) => {
  if (!children) return null

  return children.split(/{|}/).map((match, index) => {
    const { groups: { tag, args = '' } = {} } =
      match.match(/@(?<tag>\w+)(\s(?<args>.+))?/) ?? {}

    return (
      <Fragment key={[index, match].join()}>
        {TAGS[tag]?.(...args.split('|'), label) ?? match}
      </Fragment>
    )
  })
}

export default Tags

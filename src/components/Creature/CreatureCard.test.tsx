import { render, screen } from '~testing'

import { CreatureCard } from '.'
import type { CreatureCardProps } from './types'

const creature: Readonly<CreatureCardProps> = {
  name: 'Baboon',
  source: 'MM',
  speed: { walk: 30, climb: 30, swim: 30 }
}

describe('CreatureCard', () => {
  it('should render as expected', () => {
    render(<CreatureCard {...creature} />)

    expect(screen.getAllByRole('link')).toHaveLength(2)
    expect(screen.getByRole('heading', { name: 'Baboon' })).toBeVisible()
    expect(
      screen.getByRole('button', { name: 'Monster Manual (2014)' })
    ).toBeVisible()
  })

  it('should render as expected when disabled', () => {
    const { container } = render(<CreatureCard {...creature} disabled />)

    expect(container.firstChild).toHaveAttribute('aria-disabled', 'true')
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('should render the star rating', () => {
    render(<CreatureCard {...creature} rating={1} />)

    expect(screen.getByRole('button', { name: '1 Star Rating' })).toBeVisible()
  })

  it('should render the challenge rating', () => {
    render(<CreatureCard {...creature} cr={0} />)

    expect(
      screen.getByRole('button', { name: /^Challenge Rating\s0$/ })
    ).toBeVisible()
  })

  it('should render the summon limit', () => {
    render(<CreatureCard {...creature} limit={1} />)

    expect(
      screen.getByRole('button', { name: /^Summon\s1 Baboon$/ })
    ).toBeVisible()
  })

  it('should render the speed limits', () => {
    render(<CreatureCard {...creature} speedLimits />)

    expect(screen.getByRole('button', { name: 'Swims' })).toBeVisible()
  })
})

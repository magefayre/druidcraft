import { render, screen } from '~testing'

import { DiceRoller } from '.'
import type { DiceRollerProps } from './DiceRoller'

const saveRoll = vi.fn()

vi.mock('./hooks', async importOriginal => ({
  ...(await importOriginal()),
  useDiceTray: vi.fn(() => [[], saveRoll])
}))

describe('DiceRoller', () => {
  describe('formula', () => {
    it('should render as expected', async () => {
      const props = { formula: '1d10+4' }
      const { user, rerender } = render(<DiceRoller {...props} />)
      let button = screen.getByRole('button', { name: '1d10+4' })

      expect(button).toBeEnabled()

      await user.click(button)

      expect(saveRoll).toHaveBeenCalledWith('1d10+4')

      rerender(<DiceRoller {...props}>Children</DiceRoller>)

      button = screen.getByRole('button', { name: 'Children' })

      expect(button).toBeEnabled()

      await user.click(button)

      expect(saveRoll).toHaveBeenCalledWith('1d10+4')

      rerender(
        <DiceRoller {...props} label="Label">
          Children
        </DiceRoller>
      )

      button = screen.getByRole('button', { name: 'Children' })

      expect(button).toBeEnabled()

      await user.click(button)

      expect(saveRoll).toHaveBeenCalledWith('1d10+4 Label')
    })
  })

  describe('dice', () => {
    it('should render as expected', async () => {
      const props: DiceRollerProps = { dice: '1d10', modifier: '+4' }
      const { user, rerender } = render(<DiceRoller {...props} />)
      let button = screen.getByRole('button', { name: '1d10+4' })

      expect(button).toBeEnabled()

      await user.click(button)

      expect(saveRoll).toHaveBeenCalledWith('1d10+4')

      rerender(<DiceRoller {...props}>Children</DiceRoller>)

      button = screen.getByRole('button', { name: 'Children' })

      expect(button).toBeEnabled()

      await user.click(button)

      expect(saveRoll).toHaveBeenCalledWith('1d10+4')

      rerender(
        <DiceRoller {...props} label="Label">
          Children
        </DiceRoller>
      )

      button = screen.getByRole('button', { name: 'Children' })

      expect(button).toBeEnabled()

      await user.click(button)

      expect(saveRoll).toHaveBeenCalledWith('1d10+4 Label')
    })
  })
})

import { render, screen } from '~testing'

import Checkbox from '.'

describe('Checkbox', () => {
  it('should render as expected', async () => {
    const onChange = vi.fn()
    const { user } = render(
      <Checkbox
        id="checkbox"
        label="Checkbox"
        icon="moon"
        onChange={onChange}
      />
    )

    const checkbox = screen.getByRole('checkbox', { name: 'Checkbox' })

    expect(checkbox).not.toBeChecked()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()

    await user.click(checkbox)

    expect(onChange).toHaveBeenCalledWith('checkbox', true)
    expect(checkbox).toBeChecked()

    await user.click(checkbox)

    expect(onChange).toHaveBeenCalledWith('checkbox', false)
    expect(checkbox).not.toBeChecked()
  })
})

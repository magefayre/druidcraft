import { render, type RenderOptions } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React, {
  type FC,
  type ProviderExoticComponent,
  type ReactNode
} from 'react'

export type RenderWithProvidersOptions = Omit<RenderOptions, 'wrapper'> & {}
type ProviderProps = { provider: ProviderExoticComponent<object> }

const configureProviders = () => ({ providers: [] })

const ProvidersWrapper: FC<{
  providers: ProviderProps[]
  children: ReactNode
}> = ({ providers, children }) =>
  providers.reduceRight(
    (children: ReactNode, { provider: Provider, ...props }) => (
      <Provider {...props}>{children}</Provider>
    ),
    children
  )

const renderWithProviders = (
  ui: ReactNode,
  options?: RenderWithProvidersOptions
) => {
  const user = userEvent.setup()
  const { providers } = configureProviders()

  const Wrapper: RenderOptions['wrapper'] = ({ children }) => (
    <ProvidersWrapper providers={providers}>{children}</ProvidersWrapper>
  )

  return { ...render(ui, { wrapper: Wrapper, ...options }), user }
}

export * from '@testing-library/react'
export { renderWithProviders as render }

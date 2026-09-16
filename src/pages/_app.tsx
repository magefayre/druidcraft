import '~styles/app.scss'

import { AppPage } from '@newhighsco/press-start'
import { type AppProps } from 'next/app'
import type { FC } from 'react'
import { SWRConfig } from 'swr'

import config from '~config'
import theme from '~theme'

const App: FC<AppProps> = props => (
  <SWRConfig
    value={{
      fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
    }}
  >
    <AppPage {...props} theme={theme} config={config} />
  </SWRConfig>
)

export default App

import { url } from './utils'

describe('url', () => {
  it('should format the URL as expected', () => {
    expect(url({ name: 'Aerosaur (Small)', source: 'PSX' })).toEqual(
      '/creature/psx/aerosaur-small'
    )
    expect(url({ name: 'Almiraj', source: 'ToA' })).toEqual(
      '/creature/toa/almiraj'
    )
    expect(url({ name: 'Armored Saber-Toothed Tiger', source: 'CoS' })).toEqual(
      '/creature/cos/armored-sabertoothed-tiger'
    )
    expect(url({ name: 'Awakened Rat', source: 'WDH' })).toEqual(
      '/creature/wdh/awakened-rat'
    )
    expect(url({ name: 'Chimeric Fox', source: 'NRH-AVitW' })).toEqual(
      '/creature/nrhavitw/chimeric-fox'
    )
    expect(url({ name: 'Deep Rothé', source: 'MPMM' })).toEqual(
      '/creature/mpmm/deep-rothe'
    )
    expect(url({ name: 'Giant Fire Beetle', source: 'MM' })).toEqual(
      '/creature/mm/giant-fire-beetle'
    )

    const preserveCharacters = [':', '*']

    expect(
      url({ source: ':source', name: ':name' }, { preserveCharacters })
    ).toEqual('/creature/:source/:name')
    expect(url({ source: ':slug*', name: '' }, { preserveCharacters })).toEqual(
      '/creature/:slug*'
    )
  })
})

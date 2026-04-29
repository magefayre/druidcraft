const svgrConfig = require('@newhighsco/svgr-config')

/** @type import('@svgr/core').Config */
module.exports = {
  ...svgrConfig,
  svgoConfig: {
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            cleanupIds: false,
            removeUselessDefs: false,
            removeHiddenElems: false
          }
        }
      }
    ]
  }
}

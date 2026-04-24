import shared from '@newhighsco/prettier-config'

/** @type {import("prettier").Config} */
const config = {
  ...shared,
  overrides: [
    {
      files: ['src/data/**'],
      options: {
        jsonRecursiveSort: true,
        plugins: ['prettier-plugin-sort-json']
      }
    }
  ]
}

export default config

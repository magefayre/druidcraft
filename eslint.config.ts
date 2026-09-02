import config from '@newhighsco/eslint-config'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  { extends: [config] },
  globalIgnores(['src/types/5etools'])
])

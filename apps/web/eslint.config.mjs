// @ts-check
import eslintConfigPrettier from 'eslint-config-prettier'
import withNuxt from './.nuxt/eslint.config.mjs'

/** Prettier como fonte única de formatação; ESLint não compete com estilo. */
export default withNuxt(eslintConfigPrettier, {
  rules: {
    /** Vue 3 permite vários elementos raiz; a regra é legada do Vue 2. */
    'vue/no-multiple-template-root': 'off',
  },
})

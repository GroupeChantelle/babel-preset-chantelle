/* eslint no-unused-expressions:0, better/explicit-return:0, fp/no-nil:0, fp/no-mutation:0, import/no-commonjs:0, fp/no-unused-expression:0 */

import preset from "."

const { plugins, presets } = preset()

describe('@nod/babel-preset-nod', () => {
  test('contains plugins', () => {
    expect(plugins.length > 0).toBeTruthy()
  })

  test('contains presets', () => {
    expect(presets.length > 0).toBeTruthy()
  })
})

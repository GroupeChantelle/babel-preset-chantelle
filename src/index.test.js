import preset from './index'

const name = '@nod/babel-preset-nod'

const { plugins, presets } = preset()

describe(name, () => {
  test('contains plugins', () => {
    expect(plugins.length > 0).toBeTruthy()
  })

  test('contains presets', () => {
    expect(presets.length > 0).toBeTruthy()
  })
})

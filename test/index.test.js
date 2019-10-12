import pluginTester from 'babel-plugin-tester'
import plugin from '../src'
// import { join } from 'path'

describe('@nod/babel-preset-nod', () => {
  test('works', () => {
    pluginTester({
      plugin,
      pluginName: 'nod'
      // fixtures: join(__dirname, 'fixtures')
    })
  })

  // test('contains overrides', () => {
  //   const {
  //     overrides
  //   } = preset()
  //   expect(overrides).toBeTruthy()
  // })

  // test('contains plugins', () => {
  //   const {
  //     overrides: { plugins }
  //   } = preset()
  //   expect(plugins.length > 0).toBeTruthy()
  // })

  // test('contains presets', () => {
  //   const {
  //     overrides: {  presets }
  //   } = preset()
  //   expect(presets.length > 0).toBeTruthy()
  // })
})

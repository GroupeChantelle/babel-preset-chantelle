/* eslint no-console:0, fp/no-mutation:0, import/no-commonjs:0, fp/no-unused-expression:0 */

const getOrSetEnv = () => {
  process.env.BABEL_ENV =
    process.env.BABEL_ENV || process.env.NODE_ENV || 'development'
  return process.env.BABEL_ENV
}

const getOrSetBuildTarget = () => {
  process.env.BUILD_TARGET = process.env.BUILD_TARGET || 'universal'
  return process.env.BUILD_TARGET
}

const isProduction = getOrSetEnv() === 'production'
const isTest = getOrSetBuildTarget() === 'test'

const browsers = ['last 2 versions']
const node = 'current'

const availableTargets = {
  server: { node },
  client: { browsers },
  universal: { node, browsers }
}
const targets = availableTargets[process.env.BUILD_TARGET]

const flowRuntimePlugin = [
  require.resolve('babel-plugin-flow-runtime'),
  { annotate: true, assert: false }
]

const devPlugins = isProduction
  ? []
  : [require.resolve('babel-plugin-ramda'), flowRuntimePlugin]

const commonPlugins = [
  require.resolve('babel-plugin-add-react-displayname'),
  require.resolve('babel-plugin-add-module-exports'),
  [
    require.resolve('babel-plugin-transform-runtime'),
    {
      helpers: false,
      polyfill: false,
      regenerator: true
    }
  ]
]
const devPresets = isProduction
  ? []
  : [require.resolve('babel-preset-flow-runtime')]

const modules =
  process.env.BABEL_ENV_MODULES !== true || isTest !== true
    ? {}
    : { modules: true }

const commonPresets = [
  require.resolve('babel-preset-react-app'),
  require.resolve('babel-preset-stage-1'),
  require.resolve('babel-preset-react'),
  [
    require.resolve('babel-preset-env'),
    Object.assign(
      {},
      {
        targets,
        useBuiltIns: 'usage'
      },
      modules
    )
  ]
]

const preset = {
  plugins: devPlugins.concat(commonPlugins),
  presets: devPresets.concat(commonPresets)
}

module.exports = preset

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

const isProduction = () => getOrSetEnv() === 'production'
const isTest = () => getOrSetEnv() === 'test'

const browsers = ['last 2 versions']
const node = 'current'

const availableTargets = {
  server: { node },
  client: { browsers },
  universal: { node, browsers }
}
const targets = () => ({
  targets:
    process.env.BABEL_ENV_TARGETS || availableTargets[getOrSetBuildTarget()]
})

const helpers = () => ({
  helpers: isTest()
})

const devPlugins = () =>
  isProduction() ? [require.resolve('babel-plugin-ramda')] : []

const commonPlugins = () => [
  [
    require.resolve('@babel/plugin-proposal-pipeline-operator'),
    { proposal: 'minimal' }
  ],
  require.resolve('@babel/plugin-proposal-object-rest-spread'),
  require.resolve('babel-plugin-add-react-displayname'),
  require.resolve('@babel/plugin-proposal-class-properties'),
  [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
  require.resolve('@babel/plugin-proposal-export-default-from'),
  require.resolve('@babel/plugin-proposal-export-namespace-from'),
  require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'),
  require.resolve('@babel/plugin-proposal-optional-chaining'),
  require.resolve('@babel/plugin-proposal-throw-expressions'),
  require.resolve('@babel/plugin-syntax-dynamic-import'),
  require.resolve('@babel/plugin-transform-react-jsx'),
  require.resolve('@babel/plugin-transform-regenerator'),
  [require.resolve('@babel/plugin-transform-runtime'), helpers()]
]

const devPresets = () => (isProduction() ? [] : [])

const modules = () =>
  process.env.BABEL_ENV_MODULES === true || isTest() === true
    ? {}
    : { modules: false }

const commonPresets = () => [
  require.resolve('@babel/preset-flow'),
  require.resolve('@babel/preset-react'),
  [
    require.resolve('@babel/preset-env'),
    Object.assign({}, targets(), modules())
  ]
]

function preset() {
  return {
    plugins: devPlugins().concat(commonPlugins()),
    presets: devPresets().concat(commonPresets())
  }
}

module.exports = preset

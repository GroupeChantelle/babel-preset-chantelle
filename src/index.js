/* eslint global-require:0 */

const debugFactory = require('debug')

const moduleName = '@nod/babel-preset-nod'

const debug = debugFactory(moduleName)

const getOrSetEnv = () => {
  process.env.BABEL_ENV =
    process.env.BABEL_ENV || process.env.NODE_ENV || 'development'
  return process.env.BABEL_ENV
}

const isProduction = () => getOrSetEnv() === 'production'
const isTest = () => getOrSetEnv() === 'test'

const getOrSetBuildTarget = () => {
  process.env.PLATFORM = isTest() ? 'server' : process.env.PLATFORM || 'client'
  return process.env.PLATFORM
}

const browsers = ['last 2 versions']
const node = 'current'
const availableTargets = {
  server: { node },
  client: { browsers },
  universal: { node, browsers }
}
const targets = () => ({
  targets: availableTargets[getOrSetBuildTarget()]
})

const nothing = () => []

const [
  macrosPlugin,
  reactRemovePropTypesPlugin,
  ramdaPlugin,
  pipelineOperatorProposalPlugin,
  pipelineOperatorSyntaxProposalPlugin,
  classPropertiesPlugin,
  objectRestSpreadPlugin,
  throwExpressionsPlugin,
  destructingPlugin,
  reactConstantElementsPlugin,
  runtimePlugin,
  reactDisplayNamePlugin,
  dynamicImportPlugin,
  addModuleExports,
  envPreset,
  reactPreset,
  flowPreset
] = [
  'babel-plugin-macros',
  'babel-plugin-transform-react-remove-prop-types',
  'babel-plugin-ramda',
  '@babel/plugin-proposal-pipeline-operator',
  '@babel/plugin-syntax-pipeline-operator',
  '@babel/plugin-proposal-class-properties',
  '@babel/plugin-proposal-object-rest-spread',
  '@babel/plugin-proposal-throw-expressions',
  '@babel/plugin-transform-destructuring',
  '@babel/plugin-transform-react-constant-elements',
  '@babel/plugin-transform-runtime',
  'babel-plugin-add-react-displayname',
  '@babel/plugin-syntax-dynamic-import',
  'babel-plugin-add-module-exports',
  '@babel/preset-env',
  '@babel/preset-react',
  '@babel/preset-flow'
]
  // eslint-disable-next-line import/no-dynamic-require
  .map(module => require(module))
  .map(module => module.default || module)

const devPlugins = () => []
const prodPlugins = () => [
  [
    // Remove PropTypes from production build
    reactRemovePropTypesPlugin,
    {
      removeImport: true
    }
  ]
]
const testPlugins = () => []
const commonPlugins = () =>
  [
    macrosPlugin,
    ramdaPlugin,
    [pipelineOperatorProposalPlugin, { proposal: 'minimal' }],
    [pipelineOperatorSyntaxProposalPlugin, { proposal: 'minimal' }],
    [
      classPropertiesPlugin,
      {
        loose: true
      }
    ],
    [
      objectRestSpreadPlugin,
      {
        useBuiltIns: true
      }
    ],
    throwExpressionsPlugin,
    destructingPlugin,
    reactConstantElementsPlugin,
    reactDisplayNamePlugin,
    addModuleExports,
    dynamicImportPlugin
  ].concat(
    getOrSetBuildTarget() !== 'server'
      ? [
          [
            runtimePlugin,
            {
              corejs: false,
              helpers: false,
              regenerator: true,
              useESModules: false,
              absoluteRuntime: require.resolve('@babel/runtime/package.json')
            }
          ]
        ]
      : []
  )

const prodPresets = () => []
const devPresets = () => []
const testPresets = () => []
const commonPresets = () => [
  // TODO: require.resolve('@babel/preset-typescript'),
  flowPreset,
  [
    envPreset,
    Object.assign(
      {},
      // isTest() ? {} : { modules: false },
      {
        // Users cannot override this behavior because this Babel
        // configuration is highly tuned for ES5 support
        ignoreBrowserslistConfig: true,
        // If users import all core-js they're probably not concerned with
        // bundle size. We shouldn't rely on magic to try and shrink it.
        useBuiltIns: false
        // Do not transform modules to CJS
        // modules: false
      },
      targets()
    )
  ],
  [
    reactPreset,
    {
      // Adds component stack to warning messages
      // Adds __self attribute to JSX which React will use for some warnings
      development: !isProduction(),
      // Will use the native built-in instead of trying to polyfill
      // behavior for any plugins that require one.
      useBuiltIns: true
    }
  ]
]

const decideCache = () => {
  const cache = isProduction()
  debug('cache', cache)
  return cache
}

const preset = api => {
  // eslint-disable-next-line better/no-ifs
  if (api && typeof api.cache === 'function') {
    api.cache(decideCache())
  }

  const plugins = commonPlugins()
    .concat(isProduction() ? prodPlugins() : devPlugins())
    .concat(isTest() ? testPlugins() : nothing())

  debug('plugins %O', plugins)

  const presets = commonPresets()
    .concat(isProduction() ? prodPresets() : devPresets())
    .concat(isTest() ? testPresets() : nothing())

  debug('presets %O', presets)

  return {
    sourceType: 'unambiguous',
    plugins,
    presets
  }
}

module.exports = preset

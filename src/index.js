const { declare } = require('@babel/helper-plugin-utils')

module.exports = declare((api, { ramda = false }) => {
  const presets = [
    '@babel/preset-typescript',
    [
      '@babel/preset-env',
      {
        // debug: true,
        // modules: false,
        corejs: 3,
        // exclude: ['@babel/preset-flow'],
        // loose: true,
        shippedProposals: true,
        useBuiltIns: 'usage',
        targets: {
          node: 10
        }
      }
    ]
  ]
  const plugins = [
    '@babel/plugin-proposal-partial-application',
    ['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }],
    '@babel/plugin-transform-function-name',
    '@babel/plugin-transform-typescript',
    'macros',
    ...(ramda
      ? [
          [
            'babel-plugin-ramda',
            {
              useES: true
            }
          ]
        ]
      : [])
  ]

  const overrides = [{ plugins, presets }]
  // const pluginName = !mock ? {} : { pluginName: '@nod/babel-preset-nod' }
  // console.log({ ...pluginName, overrides })
  return { overrides }
})

module.exports = api => {
  const babelEnv = api.env();
  const plugins = [
    [
      'module-resolver',
      {
        alias: {
          // This needs to be mirrored in tsconfig.json
          src: './src',
          state: './src/state',
        },
      },
    ],
  ];

  if (babelEnv === 'production') plugins.push(['transform-remove-console']);

  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins,
  };
};

module.exports = {
  plugins: [require.resolve('@prettier/plugin-pug')],

  printWidth: 49,

  overrides: [
    {
      files: ['*.js', '*.ts'],
      options: {
        printWidth: 70,
        singleQuote: true,
        trailingComma: 'all',
      }
    },
  ]
};
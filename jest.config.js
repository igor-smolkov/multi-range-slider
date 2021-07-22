module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '.+\\.(css|sass|scss)$': 'jest-css-modules-transform'
  }
};
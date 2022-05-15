export default {
  transform: {
    '^.+\\.(js)$': 'babel-jest'
  },
  testEnvironment: 'node',
  testTimeout: 30000
}

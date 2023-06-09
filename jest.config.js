module.exports = {
  roots: ['<rootDir>'],
  moduleFileExtensions: ['js', 'ts', 'tsx', 'json'],
  testPathIgnorePatterns: ['<rootDir>[/\\\\](node_modules|.next)[/\\\\]'],
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(ts|tsx)$'],
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
    '\\.(gql|graphql)$': 'jest-transform-graphql',
  },
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/test/__mocks__/fileMock.js',
    '^@pages/(.*)$': '<rootDir>/pages/$1',
    '^@pageTemplates/(.*)$': '<rootDir>/pageTemplates/$1',
    '^@pageFiles/(.*)$': '<rootDir>/pageFiles/$1',
    '^@components/(.*)$': '<rootDir>/components/$1',
    '^@styles/(.*)$': '<rootDir>/styles/$1',
    '^@themeSettings$': '<rootDir>/themeSettings/index.ts',
    '^@const/(.*)$': '<rootDir>/const/$1',
    '^@gql/(.*)$': '<rootDir>/gql/$1',
    '^@interfaces/(.*)$': '<rootDir>/interfaces/$1',
    '^@utils/(.*)$': '<rootDir>/utils/$1',
    '^@test/(.*)$': '<rootDir>/test/$1',
  },
  setupFilesAfterEnv: ['./setupTests.js', './node_modules/jest-enzyme/lib/index.js'],
}

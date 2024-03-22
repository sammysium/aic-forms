module.exports = {
    preset: '@testing-library/jest-dom',
    testEnvironment: 'jsdom',
    transform: {
      "^.+\\.tsx?$": "ts-jest"
    },
    moduleNameMapper: {
        '^.+\\.(css|less|sass|scss|svg|jpg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/path/to/file-mock.js',
        // Add a mapping for CommonJS modules (adjust the path as needed):
        '^node_modules/(.*)': '<rootDir>/node_modules/$1/index.js',
      },
  };
  
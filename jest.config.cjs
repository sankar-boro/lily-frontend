// Copyright 2021 @lily authors & contributors
// SPDX-License-Identifier: Apache-2.0

const config = require('./config/jest.cjs');
const findPackages = require('./scripts/findPackages.cjs');

module.exports = {
  ...config,
  moduleNameMapper: {
    ...(
      findPackages()
        .filter(({ name }) => !['lily-web'].includes(name))
        .reduce((modules, { dir, name }) => {
          modules[`${name}(.*)$`] = `<rootDir>/packages/${dir}/src/$1`;

          return modules;
        }, {})
    ),
    'lily-web/(.*)$': '<rootDir>/packages/lily-web/src/$1',
    '\\.(css|less)$': 'empty/object',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'empty/object',
    '\\.(md)$': '<rootDir>/jest/mocks/empty.js'
  },
  setupFilesAfterEnv: ['<rootDir>/jest/jest-setup.ts'],
  testEnvironment: 'jsdom',
  testTimeout: 90000,
  transformIgnorePatterns: ['/node_modules/(?!@lily|@babel/runtime/helpers/esm/|@substrate|smoldot)']
};

// Copyright 2017-2021 lily authors & contributors
// SPDX-License-Identifier: Apache-2.0

const crypto = require('crypto');

Object.defineProperty(global.self, 'crypto', {
  value: {
    getRandomValues: (arr) =>
      crypto
        .randomBytes(arr.length)
        .reduce((arr, value, index) => {
          arr[index] = value;

          return arr;
        }, arr)
  }
});

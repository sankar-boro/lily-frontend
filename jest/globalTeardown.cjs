// Copyright 2021 @lily authors & contributors
// SPDX-License-Identifier: Apache-2.0

module.exports = async () => {
  console.log('Shutting down Substrate container...');

  await global.__SUBSTRATE__.stop();

  console.log('Done.');
};

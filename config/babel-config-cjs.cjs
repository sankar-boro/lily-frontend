// Copyright 2021 @lily authors & contributors
// SPDX-License-Identifier: Apache-2.0

const general = require('./babel-general.cjs');
const plugins = require('./babel-plugins.cjs');
const presets = require('./babel-presets.cjs');

module.exports = {
  ...general,
  plugins: plugins(false, true),
  presets: presets(false)
};

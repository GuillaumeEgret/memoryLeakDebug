const { getDefaultConfig } = require("expo/metro-config");
const { FileStore } = require("metro-cache");
const path = require("path");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.cacheStores = [
  new FileStore({ root: path.resolve(__dirname, ".cache/metro") }),
];

module.exports = config;

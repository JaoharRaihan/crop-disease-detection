const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for ONNX files
config.resolver.assetExts.push('onnx');

module.exports = config;

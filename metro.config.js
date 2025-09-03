const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Correct input CSS file for NativeWind. There was a typo (glabals.css).
module.exports = withNativeWind(config, { input: "./app/globals.css" });

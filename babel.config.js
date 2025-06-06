module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ["nativewind/babel"],
      ["module:react-native-dotenv", {
        "envName": "APP_ENV",
        "moduleName": "@env",
        "path": ".env",
        "blocklist": null,
        "allowlist": null,
        "blacklist": null,
        "whitelist": null,
        "safe": false,
        "allowUndefined": true, // Note: for safe mode, it's highly recommended to set: false
        "verbose": false
      }]
    ],

  };
};

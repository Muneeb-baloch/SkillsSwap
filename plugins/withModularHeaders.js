const { withPodfile } = require('@expo/config-plugins');

// Firebase's iOS AppCheckCore pod (pulled in transitively by expo-notifications'
// Firebase Cloud Messaging integration) is a Swift pod that depends on
// GoogleUtilities/RecaptchaInterop, neither of which define Swift modules.
// Without `use_modular_headers!`, `pod install` fails with:
//   "cannot yet be integrated as static libraries ... do not define modules"
// This must be injected via a config plugin (not a manual ios/Podfile edit)
// since `ios/` is regenerated from scratch on every `expo prebuild`.
module.exports = function withModularHeaders(config) {
  return withPodfile(config, config => {
    const contents = config.modResults.contents;
    if (!contents.includes('use_modular_headers!')) {
      config.modResults.contents = contents.replace(
        'use_expo_modules!',
        'use_expo_modules!\n  use_modular_headers!',
      );
    }
    return config;
  });
};

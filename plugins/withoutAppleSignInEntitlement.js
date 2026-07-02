const { withEntitlementsPlist } = require('@expo/config-plugins');

// expo-apple-authentication ships its own app.plugin.js that auto-applies
// (Expo autolinks plugins for installed Expo Modules automatically, even
// when not listed in app.json's `plugins` array) and unconditionally adds
// the com.apple.developer.applesignin entitlement. That entitlement forces
// Xcode to require real code-signing certificates — even for simulator
// builds — which this project can't provide yet (no paid Apple Developer
// Program membership). Strip it back out here. Must stay last in the
// `plugins` array in app.json so it runs after the autolinked plugin.
module.exports = function withoutAppleSignInEntitlement(config) {
  return withEntitlementsPlist(config, config => {
    delete config.modResults['com.apple.developer.applesignin'];
    return config;
  });
};

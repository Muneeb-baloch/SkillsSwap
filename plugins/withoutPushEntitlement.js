const { withEntitlementsPlist } = require('@expo/config-plugins');

// expo-notifications' autolinked plugin adds the aps-environment (push
// notifications) entitlement. Free personal Apple ID teams can't sign apps
// carrying that entitlement, so installing on a physical iPhone fails at
// the code-signing step. iOS push wouldn't work without a paid Apple
// Developer membership anyway, so strip it until the project has one —
// then delete this plugin from app.json to get push back. Same pattern as
// withoutAppleSignInEntitlement.js; must run after the autolinked plugins.
module.exports = function withoutPushEntitlement(config) {
  return withEntitlementsPlist(config, config => {
    delete config.modResults['aps-environment'];
    return config;
  });
};

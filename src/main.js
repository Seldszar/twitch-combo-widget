/* global settings */

import Vue from "vue";
import WebFont from "webfontloader";
import App from "./App.vue";

Vue.prototype.$settings = settings;

const app = new Vue({
  render: h => h(App),
});

if (settings.font.provider === "local") {
  app.$mount("#app");
} else {
  const webFontConfig = {
    classes: false,
    active: () => {
      app.$mount("#app");
    },
  };

  switch (settings.font.provider) {
    case "google": {
      webFontConfig.google = {
        families: [`${settings.font.family}:${settings.font.weight}`],
      };

      break;
    }
  }

  WebFont.load(webFontConfig);
}

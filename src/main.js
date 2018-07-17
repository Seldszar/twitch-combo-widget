import Vue from "vue";
import WebFont from "webfontloader";
import App from "./App.vue";

Vue.prototype.$settings = settings;

const app = new Vue({
  render: h => h(App),
});

WebFont.load({
  classes: false,
  google: {
    families: [`${settings.fontFamily}:700`],
  },
  active: () => {
    app.$mount("#app");
  },
});

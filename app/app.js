import Vue from "nativescript-vue";
import RadSideDrawer from "nativescript-ui-sidedrawer/vue";
import RipplePlugin from "@nativescript-community/ui-material-ripple/vue";
import User from "./components/User";
import Post from "./components/Post";

Vue.use(RadSideDrawer);
Vue.use(RipplePlugin);
Vue.component("User", User);
Vue.component("Post", Post);
Vue.registerElement(
  "PullToRefresh",
  () => require("@Akylas/nativescript-pulltorefresh").PullToRefresh
);
import App from "./components/App";

Vue.config.silent = false;

new Vue({
  render: (h) => h(App),
}).$start();

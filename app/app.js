import Vue from "nativescript-vue";
import App from "./components/App";
import RadSideDrawer from "nativescript-ui-sidedrawer/vue";
import RipplePlugin from "@nativescript-community/ui-material-ripple/vue";

import User from "./components/User";
import Post from "./components/Post";
import Comment from "./components/Comment";

Vue.use(RadSideDrawer);
Vue.use(RipplePlugin);
Vue.component("User", User);
Vue.component("Post", Post);
Vue.component("Comment", Comment);
Vue.registerElement(
  "PullToRefresh",
  () => require("@Akylas/nativescript-pulltorefresh").PullToRefresh
);

Vue.registerElement(
  "Fab",
  () => require("@nstudio/nativescript-floatingactionbutton").Fab
);

Vue.config.silent = false;

new Vue({
  render: (h) => h(App),
}).$start();

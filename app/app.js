import Vue from "nativescript-vue";
import App from "./components/App";
import RadSideDrawer from "nativescript-ui-sidedrawer/vue";
import RipplePlugin from "@nativescript-community/ui-material-ripple/vue";
import { CheckBox } from "@nstudio/nativescript-checkbox";
import User from "./components/User";
import Post from "./components/Post";
import Comment from "./components/Comment";

Vue.use(RadSideDrawer);
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

Vue.registerElement("CheckBox", () => CheckBox, {
  model: {
    prop: "checked",
    event: "checkedChange",
  },
});

Vue.registerElement("Ripple", () => require("nativescript-ripple").Ripple);

Vue.config.silent = false;

new Vue({
  render: (h) => h(App),
}).$start();

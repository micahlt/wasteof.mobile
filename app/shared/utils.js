import { Application } from "@nativescript/core";
import { first } from "rxjs";
var friendlyTime = require("friendly-time");

export const showDrawer = () => {
  let drawerNativeView = Application.getRootView();
  if (drawerNativeView && drawerNativeView.showDrawer) {
    drawerNativeView.showDrawer();
  }
};

export const closeDrawer = () => {
  let drawerNativeView = Application.getRootView();
  if (drawerNativeView && drawerNativeView.showDrawer) {
    drawerNativeView.closeDrawer();
  }
};

export const formatTime = (time) => {
  time = new Date(time);
  return friendlyTime(time);
};

export const fixPost = (post) => {
  let c = post.content;
  c = c.replace(/<\/p>/g, "<br/>");
  c = c.replace(/<p>/g, "");
  if (c.includes("<img src=")) {
    const firstIndex = c.indexOf("<img src=");
    let src = "";
    let i = firstIndex + 10;
    while (i < c.length) {
      if (c[i] == '"') break;
      src += c[i];
      i++;
    }
    c = c.replace(c.slice(firstIndex, i + 2), "");
    post.image = src;
  }
  post.content = c;
  return post;
};

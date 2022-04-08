import { Application } from "@nativescript/core";
import { ApplicationSettings } from "@nativescript/core";
import { first } from "rxjs";
const friendlyTime = require("friendly-time");
const Filter = require("bad-words");
const filter = new Filter({ placeHolder: "█" });
filter.removeWords("god");

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
  if (ApplicationSettings.getBoolean("filter")) {
    //alert("FILTERING");
    //alert(filter.clean(c));
    post.content = filter.clean(c);
    return post;
  } else {
    post.content = c;
    return post;
  }
};

export const fixComment = (comment) => {
  let c = comment.content;
  c = c.replace(/<\/p>/g, "<br/>");
  c = c.replace(/<p>/g, "");
  if (ApplicationSettings.getBoolean("filter")) {
    c = filter.clean(c);
  }
  comment.content = c;
  return comment;
};

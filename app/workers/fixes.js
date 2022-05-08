require("@nativescript/core/globals");

import { ApplicationSettings } from "@nativescript/core";
const Filter = require("bad-words");
const filter = new Filter({ placeHolder: "█" });
filter.removeWords("god");

const fixPost = (post) => {
  let c = post.content.substring(0, 1500);
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
    post.content = filter.clean(c);
    return post;
  } else {
    post.content = c;
    return post;
  }
};

const fixComment = (comment) => {
  let c = comment.content;
  c = c.replace(/<\/p>/g, "<br/>");
  c = c.replace(/<p>/g, "");
  if (ApplicationSettings.getBoolean("filter")) {
    c = filter.clean(c);
  }
  comment.content = c;
  return comment;
};

global.onmessage = (msg) => {
  let content = [];
  if (msg.data.type == "post") {
    msg.data.content.forEach((slice) => {
      slice = fixPost(slice);
      content.push(slice);
    });
    global.postMessage({ content, type: "post" });
  } else if (msg.data.type == "comment") {
    msg.data.content.forEach((slice) => {
      slice = fixComment(slice);
      content.push(slice);
    });
    global.postMessage({ content, type: "comment" });
  }
};

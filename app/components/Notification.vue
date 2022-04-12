<template>
  <StackLayout class="notif">
    <GridLayout
      flexDirection="row"
      class="notif-user"
      columns="auto, auto, *, auto"
    >
      <Image
        :src="`https://api.wasteof.money/users/${actor}/picture`"
        class="pfp"
        loadMode="async"
        col="0"
        @tap="openUser"
      />
      <Label class="notif-username" col="1" @tap="openUser">
        <FormattedString>
          <span fontWeight="bold">@{{ actor }} </span>
          <span>{{ notifLabel }}</span>
        </FormattedString>
      </Label>
      <Label text="launch" class="open-notif mi" col="3" @tap="openNotif" />
    </GridLayout>
    <HtmlView
      :html="
        notif.data.comment
          ? notif.data.comment.content
          : notif.data.post.content
      "
      class="notif-content"
      v-if="viewHtml"
    />
    <Post
      v-if="notif.type == 'post_mention'"
      :post="notif.data.post"
      :showUser="false"
      class="repost"
    />
    <Label
      :text="dateOf(notif.time)"
      class="notif-time"
      col="1"
      v-if="notif.type != 'post_mention'"
    />
  </StackLayout>
</template>

<script>
import * as utils from "~/shared/utils";
import { Utils } from "@nativescript/core";
import { ApplicationSettings } from "@nativescript/core";
import Post from "./Post.vue";
export default {
  props: {
    notif: Object,
  },
  data() {
    return {
      myUsername: ApplicationSettings.getString("username"),
    };
  },
  computed: {
    actor() {
      const n = this.notif;
      if (n.data) {
        return n.data.actor.name;
      } else if (n.poster) {
        return n.poster.name;
      } else {
        return "unknown";
      }
    },
    notifLabel() {
      const t = this.notif.type;
      switch (t) {
        case "wall_comment_reply": {
          return `replied to your comment`;
        }
        case "wall_comment": {
          return `left a comment on your wall`;
        }
        case "comment_reply": {
          return `replied to your comment`;
        }
        case "comment": {
          return `commented on your post`;
        }
        case "follow": {
          return `followed you`;
        }
        case "post_mention": {
          return `mentioned you in a post`;
        }
      }
    },
    viewHtml() {
      return !["follow", "post_mention"].includes(this.notif.type);
    },
  },
  methods: {
    dateOf(date) {
      return utils.formatTime(date);
    },
    openUser() {
      const name = this.notif.data.actor.name;
      this.$navigateTo("User", {
        props: {
          username: name,
        },
      });
    },
    openNotif() {
      const t = this.notif.type;
      switch (t) {
        case "wall_comment_reply": {
          Utils.openUrl(
            `https://wasteof.money/users/${this.myUsername}/wall#comments-${this.notif.data.comment._id}`
          );
          break;
        }
        case "wall_comment": {
          Utils.openUrl(
            `https://wasteof.money/users/${this.myUsername}/wall#comments-${this.notif.data.comment._id}`
          );
          break;
        }
        case "comment_reply": {
          Utils.openUrl(
            `https://wasteof.money/posts/${this.notif.data.comment.post}#comments-${this.notif.data.comment._id}`
          );
          break;
        }
        case "comment": {
          Utils.openUrl(
            `https://wasteof.money/posts/${this.notif.data.comment.post}#comments-${this.notif.data.comment._id}`
          );
          break;
        }
        case "follow": {
          Utils.openUrl(
            `https://wasteof.money/users/${this.notif.data.actor.name}`
          );
          break;
        }
        case "post_mention": {
          Utils.openUrl(
            `https://wasteof.money/posts/${this.notif.data.post._id}`
          );
          break;
        }
      }
    },
  },
  components: { Post },
};
</script>

<style scoped lang="scss">
// Start custom common variables
@import "@nativescript/theme/scss/variables/default";
@import "../variables.scss";
// End custom common variables

// Custom styles
.notif {
  padding: 15;
  background: var(--card-bg);
  border-radius: var(--br);
  margin: 5 10;
}

.notif-content {
  font-size: 15;
  margin: 0;
  margin-bottom: 0;
  margin-left: 13;
  padding-left: 8;
  background-color: var(--card-bg);
  border-left-width: 4;
  border-left-color: var(--border-clr);
}

.notif-content p {
  padding: 0;
}

.notif-time {
  opacity: 0.5;
  text-align: right;
  margin-right: 2;
  margin-top: -5;
}

.notif-icon {
  margin-right: 10;
  font-size: 18;
  transform: translateY(1);
}

.notif-stat {
  margin-right: 20;
  font-size: 13;
}

.pfp {
  height: 30;
  width: 30;
  border-radius: 30;
  background-color: white;
}

.notif-user {
  margin-bottom: 7;
}

.notif-username {
  margin-top: 1;
  margin-left: 10;
  font-size: 14;
}

.notif-image {
  min-height: 20;
  width: 100%;
  background: white;
  border-radius: 5;
  margin: 5 0;
}

.open-notif {
  font-size: 20;
  text-align: right;
  opacity: 0.5;
}
</style>

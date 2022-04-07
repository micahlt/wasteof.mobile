<template>
  <StackLayout :class="[{ commentparent: true }, { reply: isReply }]">
    <StackLayout class="comment">
      <GridLayout
        flexDirection="row"
        class="comment-user"
        columns="auto, auto, *, auto"
      >
        <Image
          :src="`https://api.wasteof.money/users/${comment.poster.name}/picture`"
          class="pfp"
          loadMode="async"
          col="0"
          @tap="openUser"
        />
        <Label
          :text="comment.poster.name"
          class="comment-username"
          col="1"
          @tap="openUser"
        />
        <Label
          text="launch"
          class="open-comment mi"
          col="3"
          @tap="openComment"
        />
      </GridLayout>
      <Image
        :src="comment.image"
        v-if="comment.image != undefined"
        class="comment-image"
        loadMode="async"
      />
      <HtmlView :html="comment.content" class="comment-content" />
      <Label :text="dateOf(comment.time)" class="comment-time" col="1" />
    </StackLayout>
    <Comment :isReply="true" v-for="r in replies" :key="r.id" :comment="r" />
  </StackLayout>
</template>

<script>
import * as utils from "~/shared/utils";
import { Utils } from "@nativescript/core";
import { Http } from "@nativescript/core";
import { ApplicationSettings } from "@nativescript/core";
export default {
  props: {
    comment: Object,
    isReply: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      replies: [],
    };
  },
  mounted() {
    if (this.comment.hasReplies) {
      this.fetchReplies(1, this.comment._id);
    }
  },
  methods: {
    fetchReplies(page, id) {
      Http.getJSON(
        `https://api.wasteof.money/comments/${id}/replies?page=${page}`
      ).then((json) => {
        json.comments.forEach((comment) => {
          const hasReplies = comment.hasReplies;
          comment.hasReplies = false;
          this.replies.push(comment);
          if (hasReplies) {
            this.fetchReplies(1, comment._id);
          }
        });
        if (!json.last) {
          this.fetchReplies(2, id);
        }
      });
    },
    dateOf(date) {
      return utils.formatTime(date);
    },
    openUser() {
      const name = this.comment.poster.name;
      this.$navigateTo("User", {
        props: {
          username: name,
        },
      });
    },
    openComment() {
      Utils.openUrl(
        `https://wasteof.money/users/${this.comment.wall.name}#comments-${this.comment._id}`
      );
    },
  },
};
</script>

<style scoped lang="scss">
// Start custom common variables
@import "@nativescript/theme/scss/variables/default";
@import "../variables.scss";
// End custom common variables

// Custom styles
.comment {
  padding: 15;
  background: var(--card-bg);
  border-radius: var(--br);
  margin-bottom: 10;
}

.comment-content {
  font-size: 15;
  margin-bottom: 0;
  padding-bottom: 0;
  padding: 0;
  background-color: var(--card-bg);
}

.comment-content p {
  padding: 0;
}

.comment-time {
  opacity: 0.5;
  text-align: right;
  margin-right: 2;
}

.comment-icon {
  margin-right: 10;
  font-size: 18;
  transform: translateY(1);
}

.comment-stat {
  margin-right: 20;
  font-size: 13;
}

.pfp {
  height: 30;
  width: 30;
  border-radius: 30;
  background-color: white;
}

.comment-user {
  margin-bottom: 7;
}

.comment-username {
  margin-top: 1;
  margin-left: 10;
  font-weight: bold;
  font-size: 14;
}

.comment-image {
  min-height: 20;
  width: 100%;
  background: white;
  border-radius: 5;
  margin: 5 0;
}

.open-comment {
  font-size: 20;
  text-align: right;
  opacity: 0.5;
}

.loved {
  color: #ff0055;
}

.reply .comment {
  margin-left: 12;
  margin-bottom: 0;
}

.reply {
  margin-left: 8;
  border-left-width: 3;
  border-left-color: var(--border-clr);
  margin-bottom: 10;
}
</style>

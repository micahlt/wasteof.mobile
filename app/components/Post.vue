<template>
  <StackLayout class="post">
    <GridLayout
      flexDirection="row"
      class="post-user"
      v-if="showUser"
      columns="auto, auto, *, auto"
    >
      <Image
        :src="`https://api.wasteof.money/users/${post.poster.name}/picture`"
        class="pfp"
        loadMode="async"
        col="0"
        @tap="openUser"
      />
      <Label
        :text="post.poster.name"
        class="post-username"
        col="1"
        @tap="openUser"
      />
      <Label text="launch" class="open-post mi" col="3" @tap="openPost" />
    </GridLayout>
    <Image
      :src="post.image"
      v-if="post.image != undefined"
      class="post-image"
      loadMode="async"
    />
    <HtmlView :html="post.content" class="post-content" />
    <Post :post="post.repost" v-if="post.repost" class="repost" />
    <GridLayout columns="auto, *">
      <FlexboxLayout flexDirection="row" col="0">
        <Label
          text="favorite"
          :class="['post-icon', 'mi', { loved: loved }]"
          @tap="lovePost"
        />
        <Label :text="post.loves" class="post-stat" />
        <Label text="repeat" class="post-icon mi" />
        <Label :text="post.reposts" class="post-stat" />
        <Label text="comment" class="post-icon mi" />
        <Label :text="post.comments" class="post-stat" />
      </FlexboxLayout>
      <Label :text="dateOf(post.time)" class="post-time" col="1" />
    </GridLayout>
  </StackLayout>
</template>

<script>
import * as utils from "~/shared/utils";
import { Utils } from "@nativescript/core";
import { Http } from "@nativescript/core";
import { ApplicationSettings } from "@nativescript/core";
export default {
  props: {
    post: Object,
    showUser: {
      type: Boolean,
      default: true,
    },
    isRepost: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      username: ApplicationSettings.getString("username") || null,
      loved: false,
    };
  },

  mounted() {
    if (this.username) {
      Http.getJSON(
        `https://api.wasteof.money/posts/${this.post._id}/loves/${this.username}`
      ).then((str) => {
        if (str == true) {
          this.loved = true;
        }
      });
    }
  },
  methods: {
    dateOf(date) {
      return utils.formatTime(date);
    },
    openUser() {
      const name = this.post.poster.name;
      this.$navigateTo("User", {
        props: {
          username: name,
        },
      });
    },
    openPost() {
      Utils.openUrl(`https://wasteof.money/posts/${this.post._id}`);
    },
    lovePost() {
      if (this.username) {
        const token = ApplicationSettings.getString("token");
        Http.request({
          url: `https://api.wasteof.money/posts/${this.post._id}/loves`,
          method: "POST",
          headers: {
            Authorization: token,
          },
        }).then((response) => {
          if (response.statusCode != 200) {
            alert(`Error code ${response.statusCode}, try again later.`);
          } else {
            this.loved = !this.loved;
            const loves = response.content.toJSON().new.loves;
            this.post.loves = loves;
          }
        });
      } else {
        alert("Sign in to love posts!");
      }
    },
  },
};
</script>

<style scoped lang="scss">
// Start custom common variables
@import "@nativescript/theme/scss/variables/blue";
@import "../variables.scss";
// End custom common variables

// Custom styles
.post {
  padding: 15;
  background: var(--card-bg);
  border-radius: var(--br);
  margin-bottom: 10;
}

.post-content {
  font-size: 15;
  margin-bottom: 0;
  padding-bottom: 0;
  padding: 0;
  background-color: var(--card-bg);
}

.post-content p {
  padding: 0;
}

.post-time {
  opacity: 0.5;
  text-align: right;
  margin-right: 2;
}

.post-icon {
  margin-right: 10;
  font-size: 18;
  transform: translateY(1);
}

.post-stat {
  margin-right: 20;
  font-size: 13;
}

.pfp {
  height: 30;
  width: 30;
  border-radius: 30;
  background-color: white;
}

.post-user {
  margin-bottom: 7;
}

.post-username {
  margin-top: 1;
  margin-left: 10;
  font-weight: bold;
  font-size: 14;
}

.post-image {
  min-height: 20;
  width: 100%;
  background: white;
  border-radius: 5;
  margin: 5 0;
}

.open-post {
  font-size: 20;
  text-align: right;
  opacity: 0.5;
}

.repost {
  border-color: var(--border-clr);
  border-width: 2;
}

.loved {
  color: #ff0055;
}
</style>

<template>
  <StackLayout class="post">
    <FlexboxLayout
      flexDirection="row"
      class="post-user"
      @tap="openUser(post.poster.name)"
    >
      <Image
        :src="`https://api.wasteof.money/users/${post.poster.name}/picture`"
        class="pfp"
        loadMode="async"
      />
      <Label :text="post.poster.name" class="post-username" />
    </FlexboxLayout>
    <Image
      :src="post.image"
      v-if="post.image != undefined"
      class="post-image"
      loadMode="async"
    />
    <HtmlView :html="post.content" class="post-content" />
    <WrapLayout orientation="horizontal">
      <Label text="favorite" class="post-icon mi" />
      <Label :text="post.loves" class="post-stat" />
      <Label text="repeat" class="post-icon mi" />
      <Label :text="post.reposts" class="post-stat" />
      <Label text="comment" class="post-icon mi" />
      <Label :text="post.comments" class="post-stat" />
      <Label :text="dateOf(post.time)" class="post-time" />
    </WrapLayout>
  </StackLayout>
</template>

<script>
import * as utils from "~/shared/utils";
export default {
  props: {
    post: Object,
  },
  /*
  mounted() {
    const c = this.post.content;
    const p = () => {
      if (c.includes("</p>")) {
        this.post.content = c.replace("</p>", "<br>");
        this.post.content = c.replace("<p>", "");
        p();
      }
      if (c.includes("<img src")) {
        alert("includes an image");
        let startIndex = c.indexOf("<img src=");
        let src = "";
        let str = c.slice(startIndex + 10, c.length);
        let i = 0;
        while (true) {
          if ((str[i] = '"')) {
            break;
          } else {
            src += str[i];
            i++;
          }
        }
        alert(src);
      }
    };
    p();
  },*/
  methods: {
    dateOf(date) {
      return utils.formatTime(date);
    },
    openUser(name) {
      this.$navigateTo("User", {
        props: {
          username: name,
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
// Start custom common variables
@import "@nativescript/theme/scss/variables/blue";
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
  background: var(--card-bg);
}

.post-content p {
  padding: 0;
}

.post-time {
  opacity: 0.5;
}

.post-icon {
  margin-right: 10;
  font-size: 15;
  transform: translateY(1);
}

.post-stat {
  margin-right: 20;
}

ActivityIndicator {
  margin: 20;
}

.pfp {
  height: 30;
  width: 30;
  border-radius: 30;
  background-image: url("~/shared/avatar-small.png");
  background-position: center center;
  background-size: cover;
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
}
</style>

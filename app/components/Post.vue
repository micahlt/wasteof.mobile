<template>
  <Ripple rippleColor="#ffffff" class="post-ripple" rippleBorderRadius="50">
    <StackLayout class="post" @tap="openPost">
      <GridLayout
        flexDirection="row"
        class="post-user"
        v-if="showUser"
        columns="auto, auto, *, auto, auto"
      >
        <Image
          :src="`https://api.wasteof.money/users/${post.poster.name}/picture?optimized=true`"
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
        <Label
          text="push_pin"
          class="post-icon mi pinned"
          col="3"
          v-if="pinned"
        />
        <Label
          text="more_vert"
          class="post-icon mi options-btn"
          col="4"
          @tap="openOptions"
        />
      </GridLayout>
      <Image
        :src="post.image"
        v-if="post.image != undefined"
        class="post-image"
        loadMode="async"
      />
      <HtmlView
        :html="post.content"
        class="post-content"
        @tap="htmlViewInteract"
        isPassThroughParentEnabled="true"
      />
      <Post :post="post.repost" v-if="post.repost" class="repost" />
      <GridLayout columns="auto, *">
        <FlexboxLayout flexDirection="row" col="0" class="post-actions">
          <Label
            text="favorite"
            :class="[
              'post-icon',
              'mi',
              'love-button',
              { loved: loved },
              { loving: isLoving },
            ]"
            @tap="lovePost"
            ref="loveAction"
          />
          <Label :text="post.loves" class="post-stat" @tap="lovePost" />
          <Label text="repeat" class="post-icon mi" />
          <Label :text="post.reposts" class="post-stat" />
          <Label text="comment" class="post-icon mi" />
          <Label :text="post.comments" class="post-stat" />
        </FlexboxLayout>
        <Label :text="dateOf(post.time)" class="post-time" col="1" />
      </GridLayout>
    </StackLayout>
  </Ripple>
</template>

<script>
import * as utils from "~/shared/utils";
import { InAppBrowser } from "nativescript-inappbrowser";
import { Http, Dialogs } from "@nativescript/core";
import { ApplicationSettings } from "@nativescript/core";
import { Toasty } from "@triniwiz/nativescript-toasty";
export default {
  props: {
    post: Object,
    showUser: {
      type: Boolean,
      default: true,
    },
    pinned: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      username: ApplicationSettings.getString("username") || null,
      beta: ApplicationSettings.getBoolean("useBeta") || false,
      loved: false,
      isInteracting: false,
      isLoving: false,
      optionsOpen: true,
      options: ["hello", "there", "old", "friend"],
    };
  },

  mounted() {
    if (this.username) {
      Http.getJSON(
        `https://api.wasteof.money/posts/${this.post._id}/loves/${this.username}`
      ).then((res) => {
        if (res == true) {
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
      this.isInteracting = true;
      const name = this.post.poster.name;
      this.$navigateTo("User", {
        props: {
          username: name,
        },
      });
      setTimeout(() => {
        this.isInteracting = false;
      }, 300);
    },
    htmlViewInteract() {
      this.isInteracting = true;
      setTimeout(() => {
        this.isInteracting = false;
      }, 300);
    },
    async openPost() {
      if ((await InAppBrowser.isAvailable()) && !this.isInteracting) {
        const b = InAppBrowser.open(
          `https://${this.beta ? "beta." : ""}wasteof.money/posts/${
            this.post._id
          }`,
          {
            toolbarColor: "#6466e9",
            enableDefaultShare: false,
            showInRecents: false,
          }
        );
      }
    },
    lovePost() {
      this.isInteracting = true;
      if (this.username) {
        this.isLoving = true;
        setTimeout(() => {
          this.isLoving = false;
        }, 450);
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
            this.isInteracting = false;
          }
        });
      } else {
        alert("Sign in to love posts!");
      }
    },
    openOptions() {
      this.isInteracting = true;
      Dialogs.action({
        title: "Post Options",
        cancelButtonText: "Cancel",
        actions: ["Report"],
        cancelable: true,
      }).then((result) => {
        if (result == "Report") {
          Dialogs.prompt({
            title: "Report",
            message:
              "Please include details about why you're reporting this post.",
            okButtonText: "Submit",
            cancelButtonText: "Cancel",
          }).then((didSubmit) => {
            if (didSubmit.result) {
              new Toasty({ text: "Your report has been submitted." })
                .setToastDuration(2000)
                .show();
            }
          });
        }
      });
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
.post {
  padding: 15;
  background: var(--card-bg);
  border-radius: var(--br);
  margin-bottom: 10;
  overflow-x: visible;
}

.post-content {
  font-size: 15;
  margin-bottom: 0;
  padding-bottom: 0;
  padding: 0;
  background-color: var(--card-bg);
  overflow-x: visible;
}

.post-ripple {
  margin-bottom: 10;
  border-radius: 5;
  padding-bottom: -10;
  padding-right: -2;
}

.post-content p {
  padding: 0;
}

.post-time {
  opacity: 0.5;
  text-align: right;
  margin-right: 2;
}

.post-actions {
  align-items: center;
  overflow-x: visible;
}

.post-icon {
  padding: 3;
  padding-right: 10;
  font-size: 20;
  transform: translateY(1);
  text-align: center;
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

.repost {
  border-color: var(--border-clr);
  border-width: 2;
}

.loved,
.pinned {
  color: #ff0055;
}

.pinned {
  font-size: 20;
}

.options-btn {
  margin: 0;
  margin-right: -8;
  padding: 5;
  background-color: var(--card-bg);
  opacity: 0.5;
}

.loving {
  animation-name: love;
  animation-duration: 450ms;
  animation-fill-mode: forwards;
  transform-origin: center center;
  animation-direction: normal;
  animation-iteration-count: 1;
}

@keyframes love {
  0% {
    transform: translateY(1) scale(1);
  }
  50% {
    transform: translateY(1) translateX(1) scale(1.3);
  }
  100% {
    transform: translateY(1) scale(1);
  }
}
</style>

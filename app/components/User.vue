<template>
  <Page>
    <ActionBar class="action-bar">
      <NavigationButton visibility="hidden" />
      <GridLayout columns="50, *, 50">
        <Image src="~/shared/nav-logo.png" col="1" class="nav-logo" />
        <Label class="mi menu" text="menu" @tap="onDrawerButtonTap" col="0" />
        <Label class="mi menu" text="report" col="3" @tap="reportAndBlock" />
      </GridLayout>
    </ActionBar>
    <GridLayout rows="auto, *">
      <GridLayout v-if="!loadingUser" row="0" height="130">
        <GridLayout columns="90, *" class="header">
          <AbsoluteLayout col="0" class="pfp-wrapper">
            <Image
              :src="`https://api.wasteof.money/users/${info.name}/picture?optimized=true`"
              v-if="info.name != 'loading...'"
              class="pfp"
              loadMode="async"
              col="0"
              decodeWidth="85"
              decodeHeight="85"
            />
            <Label
              text="verified"
              class="mi verification"
              v-if="info.verified"
              @tap="explainVerified"
            />
            <Label
              text="verified_user"
              class="mi verification"
              v-if="info.permissions.admin"
              @tap="explainAdmin"
            />
          </AbsoluteLayout>
          <StackLayout class="header-info" col="1">
            <FlexboxLayout flexDirection="row" class="username-wrapper">
              <Label
                :text="info.name"
                class="username"
                textWrap="false"
                whiteSpace="normal"
              />
              <Button
                class="follow-button"
                v-if="following != null"
                :text="followText"
                @tap="follow"
              />
            </FlexboxLayout>
            <Label :text="info.bio" class="bio" />
            <Label :text="stats" class="stats" />
          </StackLayout>
        </GridLayout>
        <Image
          :src="`https://api.wasteof.money/users/${info.name}/banner?optimized=true`"
          stretch="aspectFill"
          tintColor="#000000bb"
          height="100%"
        />
      </GridLayout>
      <GridLayout rows="auto, *" row="1">
        <SegmentedBar row="0" @selectedIndexChanged="tab">
          <SegmentedBarItem title="Posts" />
          <SegmentedBarItem title="Wall" />
        </SegmentedBar>
        <PullToRefresh @refresh="loadPosts" row="1" v-if="currentTab == 0">
          <ScrollView @scroll="scrollPosts">
            <StackLayout class="posts">
              <Post v-if="pinned" :post="pinned" :pinned="true" />
              <Post v-for="post in posts" :key="post._id" :post="post" />
              <ActivityIndicator
                busy="true"
                v-if="isInfiniteLoading"
                :color="indicatorColor"
                class="infinite"
              />
            </StackLayout>
          </ScrollView>
        </PullToRefresh>
        <PullToRefresh @refresh="loadWall" row="1" v-if="currentTab == 1">
          <ScrollView @scroll="scrollWall">
            <StackLayout class="comments">
              <Comment
                v-for="comment in wall"
                :key="comment._id"
                :comment="comment"
              />
              <ActivityIndicator
                busy="true"
                v-if="isInfiniteLoading"
                :color="indicatorColor"
                class="infinite"
              />
            </StackLayout>
          </ScrollView>
        </PullToRefresh>
        <ActivityIndicator
          busy="true"
          v-if="loadingUser || loadingPosts"
          :color="indicatorColor"
          row="1"
        />
      </GridLayout>
    </GridLayout>
  </Page>
</template>

<script>
import { ApplicationSettings } from "@nativescript/core";
import { Application } from "@nativescript/core";
import { Screen } from "@nativescript/core";
import { Dialogs } from "@nativescript/core";
import { Http } from "@nativescript/core";
import * as utils from "~/shared/utils";
import { SelectedPageService } from "../shared/selected-page-service";
import Post from "./Post.vue";
import Comment from "./Comment.vue";
import Home from "./Home.vue";
const fixWorker = new Worker("../workers/fixes.js");
export default {
  props: {
    username: {
      default: "wasteof.money",
      type: String,
    },
  },
  data() {
    return {
      info: {
        name: "",
        bio: "",
      },
      loading: 0,
      posts: [],
      wall: [],
      myUsername: ApplicationSettings.getString("username") || null,
      following: null,
      currentTab: 0,
      loadingUser: true,
      loadingPosts: true,
      pinned: null,
      isInfiniteLoading: false,
      lastPost: false,
      lastComment: false,
      initialLoad: {
        p: true,
        w: false,
      },
      postsPage: 1,
      wallPage: 1,
    };
  },
  methods: {
    onButtonTap() {
      console.log("Button was pressed");
    },
    dateOf(date) {
      const d = Date(date);
      return d.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    },
    explainVerified() {
      Dialogs.alert({
        title: "Verified User",
        message: `This user has been verified by the moderation team and is a reputable user of wasteof.money.`,
        okButtonText: "Okay",
      });
    },
    explainAdmin() {
      Dialogs.alert({
        title: "Administrator",
        message: `This user has admin (moderator) access to wasteof.money and can edit and delete your posts.`,
        okButtonText: "Okay",
      });
    },
    onDrawerButtonTap() {
      utils.showDrawer();
    },
    loadUser() {
      Http.getJSON(`https://api.wasteof.money/users/${this.username}`).then(
        (json) => {
          this.info = json;
          this.loadingUser = false;
        }
      );
    },
    loadPosts(e) {
      if (!this.isInfiniteLoading) {
        this.posts = [];
        this.postsPage = 1;
        this.initialLoad.r = true;
      }
      Http.getJSON(
        `https://api.wasteof.money/users/${this.username}/posts?page=${this.postsPage}`
      ).then((json) => {
        if (json.pinned.length > 0) {
          this.pinned = utils.fixPost(json.pinned[0]);
        }
        fixWorker.postMessage({ content: json.posts, type: "post" });
        fixWorker.onmessage = (msg) => {
          this.posts = [...this.posts, ...msg.data.content];
          this.loadingPosts = false;
          this.initialLoad.p = false;
          this.isInfiniteLoading = false;
          this.lastPost = json.last;
          this.postsPage++;
          if (e) {
            e.object.refreshing = false;
          }
        };
      });
    },
    tab(n) {
      n = n.newIndex;
      this.currentTab = n;
      if (n == 1 && this.wall.length < 1) {
        this.loadWall();
      }
    },
    loadWall(e) {
      if (!this.isInfiniteLoading) {
        this.wall = [];
        this.wallPage = 1;
        this.initialLoad.w = true;
      }
      Http.getJSON(
        `https://api.wasteof.money/users/${this.username}/wall?page=${this.wallPage}`
      ).then((json) => {
        fixWorker.postMessage({ content: json.comments, type: "comment" });
        fixWorker.onmessage = (msg) => {
          this.wall = [...this.wall, ...msg.data.content];
          this.initialLoad.w = false;
          this.isInfiniteLoading = false;
          this.lastComment = json.last;
          this.wallPage++;
          if (e) {
            e.object.refreshing = false;
          }
        };
      });
    },
    follow() {
      const token = ApplicationSettings.getString("token");
      Http.request({
        url: `https://api.wasteof.money/users/${this.username}/followers`,
        method: "POST",
        headers: {
          Authorization: token,
        },
      }).then((response) => {
        if (response.statusCode == 200) {
          this.following = !this.following;
        } else {
          alert(`Error code ${response.statusCode}, try again later.`);
        }
      });
    },
    reportAndBlock() {
      Dialogs.confirm({
        title: "Report & Block",
        message:
          "Doing this will prevent you from seeing other content from this user",
        okButtonText: "Confirm",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result) {
          let currentlyBlocked = ApplicationSettings.getString("blocked") || "";
          currentlyBlocked = currentlyBlocked.split(",");
          currentlyBlocked.push(this.info.name);
          let newBlocklist = "";
          currentlyBlocked.forEach((user) => {
            newBlocklist += user + ",";
          });
          ApplicationSettings.setString("blocked", newBlocklist);
          this.$navigateTo(Home);
        }
      });
    },
    scrollPosts(e) {
      if (
        e.scrollY > e.object.scrollableHeight - 350 &&
        !this.isInfiniteLoading &&
        !this.lastPost &&
        !this.initialLoad.p
      ) {
        this.isInfiniteLoading = true;
        this.loadPosts();
      }
    },
    scrollWall(e) {
      if (
        e.scrollY > e.object.scrollableHeight - 350 &&
        !this.isInfiniteLoading &&
        !this.lastComment &&
        !this.initialLoad.w
      ) {
        this.isInfiniteLoading = true;
        this.loadWall();
      }
    },
  },
  mounted() {
    SelectedPageService.getInstance().updateSelectedPage("Featured");
    this.loadUser();
    this.loadPosts();
    if (this.myUsername) {
      Http.getJSON(
        `https://api.wasteof.money/users/${this.username}/followers/${this.myUsername}`
      ).then((res) => {
        this.following = res;
      });
    }
  },
  computed: {
    stats() {
      return `${this.info.stats.followers} followers • ${this.info.stats.following} following`;
    },
    indicatorColor() {
      let theme = Application.systemAppearance();
      if (theme == "dark") {
        return "#ffffff";
      } else {
        return "#6466e9";
      }
    },
    followText() {
      if (this.following) {
        return "UNFOLLOW";
      } else {
        return "FOLLOW";
      }
    },
    scrollerHeight() {
      let desiredHeight = 0;
      const screenHeight = Screen.mainScreen.heightDIPs;
      desiredHeight = screenHeight - 310;
      return desiredHeight;
    },
  },
  components: {
    Post,
    Comment,
  },
};
</script>

<style scoped lang="scss">
@import "@nativescript/theme/scss/variables/default";
@import "../variables.scss";

ActivityIndicator {
  margin: 20;
}

PullToRefresh {
  color: var(--accent);
  margin: 0;
}

.user {
  color: var(--text-primary);
}

.pfp-wrapper {
  height: 85;
  width: 85;
}

.pfp {
  border-radius: 85;
  width: 85;
  height: 85;
  background: white;
}

.verification {
  top: 58;
  left: 58;
  background-color: var(--accent);
  font-size: 20;
  padding: 3;
  border-radius: 20;
}

.header {
  padding: 20;
  z-index: 3;
  color: white;
}

.header-bg {
  margin: 0;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  height: 130;
  width: 100%;
  z-index: 1;
}

.image-overlay {
  margin: 0;
  background-color: black;
  height: 130;
  width: 100%;
  opacity: 0.55;
  z-index: 2;
}

.header-info {
  margin-left: 50px;
}

.username {
  font-size: 25px;
  font-weight: bold;
}

.stats {
  opacity: 0.75;
}

.posts,
.comments {
  padding: 15;
  color: var(--text-primary);
}

.follow-button {
  font-size: 10px;
  height: 125px;
  margin: 0;
  margin-left: 10;
  background-color: var(--accent);
  color: white;
}

.tabview {
  height: 100;
}
</style>
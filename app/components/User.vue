<template>
  <Page>
    <ActionBar class="action-bar" ref="actionBar">
      <NavigationButton visibility="hidden" />
      <GridLayout columns="50, *">
        <Image src="~/shared/nav-logo.png" colSpan="2" class="nav-logo" />
        <Label class="mi menu" text="menu" @tap="onDrawerButtonTap" />
      </GridLayout>
    </ActionBar>
    <GridLayout rows="auto, *">
      <GridLayout v-if="!loadingUser" ref="header" row="0" height="120">
        <GridLayout columns="90, *" class="header">
          <Image
            :src="`https://api.wasteof.money/users/${info.name}/picture`"
            v-if="info.name != 'loading...'"
            class="pfp"
            loadMode="async"
            col="0"
          />
          <StackLayout class="header-info" col="1">
            <FlexboxLayout flexDirection="row" class="username-wrapper">
              <Label
                :text="info.name"
                class="username"
                textWrap="true"
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
          :src="`https://api.wasteof.money/users/${info.name}/banner`"
          stretch="aspectFill"
          tintColor="#000000bb"
          height="100%"
        />
      </GridLayout>
      <GridLayout rows="auto, *" row="1">
        <SegmentedBar row="0" @selectedIndexChanged="tab" ref="tabBar">
          <SegmentedBarItem title="Posts" />
          <SegmentedBarItem title="Wall" />
        </SegmentedBar>
        <PullToRefresh @refresh="loadPosts" row="1" v-if="currentTab == 0">
          <ScrollView>
            <StackLayout class="posts">
              <Post v-for="post in posts" :key="post._id" :post="post" />
            </StackLayout>
          </ScrollView>
        </PullToRefresh>
        <PullToRefresh @refresh="loadWall" row="1" v-if="currentTab == 1">
          <ScrollView>
            <StackLayout class="comments">
              <Comment
                v-for="comment in wall"
                :key="comment._id"
                :comment="comment"
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
import { Http } from "@nativescript/core";
import * as utils from "~/shared/utils";
import { SelectedPageService } from "../shared/selected-page-service";
import Post from "./Post.vue";
import Comment from "./Comment.vue";
export default {
  props: {
    username: {
      default: "wasteof.money",
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
      Http.getJSON(
        `https://api.wasteof.money/users/${this.username}/posts?page=1`
      ).then((json) => {
        json.posts.forEach((post) => {
          post = utils.fixPost(post);
        });
        this.loadingPosts = false;
        this.posts = json.posts;
        if (e) {
          e.object.refreshing = false;
        }
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
      Http.getJSON(
        `https://api.wasteof.money/users/${this.username}/wall?page=1`
      ).then((json) => {
        json.comments.forEach((comment) => {
          comment = utils.fixPost(comment);
        });
        this.wall = json.comments;
        if (e) {
          e.object.refreshing = false;
        }
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

.pfp {
  border-radius: 100%;
  width: 85;
  height: 85;
  background: white;
}

.header {
  padding: 20;
  height: 130;
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
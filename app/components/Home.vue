<template>
  <Page>
    <ActionBar class="action-bar">
      <NavigationButton visibility="hidden" />
      <GridLayout columns="50, *">
        <Image src="~/shared/nav-logo.png" colSpan="2" class="nav-logo" />
        <Label class="mi menu" text="menu" @tap="onDrawerButtonTap" />
      </GridLayout>
    </ActionBar>
    <GridLayout rows="auto, *" class="parent">
      <PullToRefresh @refresh="fetchPosts" v-if="username" row="1">
        <ScrollView v-if="username != null" @scroll="scroll" id="scrollingView">
          <ActivityIndicator
            busy="true"
            v-if="loading < 2"
            :color="indicatorColor"
          />
          <StackLayout class="posts" v-if="loading > 1">
            <GridLayout columns="*, auto" class="switcher">
              <Label
                text="Your feed"
                class="time-current"
                horizontalAlignment="left"
                col="0"
              />
              <GridLayout
                columns="*"
                alignSelf="flex-end"
                col="1"
                @tap="openNotifs"
                class="notiflayout"
              >
                <StackLayout col="0" @tap="openNotifs">
                <Ripple rippleColor="#000000">
                    <Button
                      text.decode="&#xe7f4;"
                      :class="[
                        'time-change',
                        'mi',
                        { unread: messageCount > 0 },
                      ]"
                      textWrap="true"
                      col="0"
                    />
                </Ripple>
                  </StackLayout>
              </GridLayout>
            </GridLayout>
            <Post v-for="post in computePosts" :key="post._id" :post="post" />
            <ActivityIndicator
              busy="true"
              v-if="isInfiniteLoading"
              :color="indicatorColor"
            />
          </StackLayout>
        </ScrollView>
      </PullToRefresh>
      <StackLayout class="sign-in-ad" v-else row="1">
        <Label
          class="mi big-icon"
          text="vpn_key"
          horizontalAlignment="center"
        />
        <Label
          class="ad-text"
          editable="false"
          text="Sign in to your wasteof.money account for personalized content!"
          textWrap="true"
        />
      </StackLayout>
      <fab
        row="1"
        text.decode="&#xe145;"
        rippleColor="#f1f1f1"
        androidScaleType="centerInside"
        class="fab-button mi"
        hideOnSwipeOfView="scrollingView"
        color="white"
        @tap="openModal"
      />
    </GridLayout>
  </Page>
</template>

<script>
import Post from "./Post";
import Browse from "./Browse";
import Notifs from "./Notifs";
import CreatePost from "./CreatePost";
import {
  Application,
  ApplicationSettings,
  Http,
  Dialogs
} from "@nativescript/core";
import * as utils from "~/shared/utils";
import { SelectedPageService } from "../shared/selected-page-service";
const fixWorker = new Worker("../workers/fixes.js");
export default {
  components: {
    Post,
  },
  data() {
    return {
      loading: 0,
      posts: [],
      username: ApplicationSettings.getString("username") || null,
      token: ApplicationSettings.getString("token") || null,
      messageCount: 0,
      page: 1,
      isInfiniteLoading: false,
      initialLoad: true,
      last: false,
    };
  },
  methods: {
    onDrawerButtonTap() {
      utils.showDrawer();
    },
    openNotifs() {
      setTimeout(() => {
        this.$navigateTo(Notifs);
      }, 250);
    },
    fetchPosts(e) {
      if (!this.isInfiniteLoading) {
        this.posts = [];
        this.page = 1;
        this.initialLoad = true;
      }
      if (this.username && (this.initialLoad || e)) {
        Http.request({
          url: "https://api.wasteof.money/messages/count",
          method: "GET",
          headers: {
            Authorization: this.token,
          },
        }).then((response) => {
          if (response.statusCode == 200) {
            const json = response.content.toJSON();
            this.messageCount = json.count;
          } else {
            alert(`Error ${response.statusCode}, try again later.`);
          }
          this.loading++;
        });
      } else {
        this.loading++;
      }
      Http.getJSON(
        `https://api.wasteof.money/users/${this.username}/following/posts?page=${this.page}`
      ).then((json) => {
        fixWorker.postMessage({ content: json.posts, type: "post" });
        fixWorker.onmessage = (msg) => {
          this.posts = [...this.posts, ...msg.data.content];
          this.loading++;
          this.isInfiniteLoading = false;
          this.last = json.last;
          if (e) {
            e.object.refreshing = false;
          }
          this.initialLoad = false;
        };
      });
    },
    scroll(e) {
      if (
        e.scrollY > e.object.scrollableHeight - 350 &&
        !this.isInfiniteLoading &&
        !this.last &&
        !this.initialLoad
      ) {
        this.isInfiniteLoading = true;
        this.page++;
        this.fetchPosts();
      }
    },
    openModal() {
      this.$showModal(CreatePost, {
        fullscreen: true,
        animated: true
      }).then((data) => {
        if (data == "posted") {
          this.loading = 0;
          this.fetchPosts();
        }
      })
    },
  },
  mounted() {
    SelectedPageService.getInstance().updateSelectedPage("Home");
    if (this.username != null) {
      this.fetchPosts();
    } else {
      this.$navigateTo(Browse, {
        clearHistory: true,
      });
    }
  },
  computed: {
    indicatorColor() {
      let theme = Application.systemAppearance();
      if (theme == "dark") {
        return "#ffffff";
      } else {
        return "#6466e9";
      }
    },
    computePosts() {
      let b = ApplicationSettings.getString("blocked") || "";
      b = b.split(",");
      return this.posts.filter((p) => {
        return !b.includes(p.poster.name);
      });
    },
  },
};
</script>
<style scoped lang="scss">
@import "../variables.scss";

.ripple {
  z-index: 50;
}

Page {
  background-color: var(--bg);
}

.posts {
  color: var(--text-primary);
  padding: 15;
}

PullToRefresh {
  color: var(--accent);
  margin: 0;
}
.switcher {
  width: 100%;
}

.time-change {
  text-transform: uppercase;
  font-size: 24;
  text-align: center;
  margin: 0;
  width: 40;
  height: 40;
  margin-right: 0;
  border-radius: var(--br);
  background-color: var(--accent);
  color: white;
  margin-bottom: 10;
  right: 0;
}

.time-current {
  font-size: 18;
  margin-top: 5;
  margin-left: 5;
  font-weight: bold;
}

.ad-text {
  text-align: center;
  font-size: 15;
  opacity: 0.5;
}

.switcher {
  width: 100%;
}

.time-current {
  font-size: 18;
  margin-top: 5;
  margin-left: 5;
  font-weight: bold;
}

.unread {
  background-color: #ff0055;
}

.fab-button {
  height: 70;
  width: 70;
  margin: 15;
  background-color: var(--accent);
  horizontal-align: right;
  vertical-align: bottom;
  font-size: 7;
}
</style>
<template>
  <Page xmlns:mdr="@nativescript-community/ui-material-ripple">
    <ActionBar class="action-bar">
      <NavigationButton visibility="hidden" />
      <GridLayout columns="50, *">
        <Image src="~/shared/nav-logo.png" colSpan="2" class="nav-logo" />
        <Label class="mi menu" text="menu" @tap="onDrawerButtonTap" />
      </GridLayout>
    </ActionBar>
    <PullToRefresh @refresh="fetchPosts" v-if="username">
      <ScrollView v-if="username != null">
        <ActivityIndicator
          busy="true"
          v-if="loading < 2"
          :color="indicatorColor"
        />
        <StackLayout class="posts" v-if="loading > 1">
          <GridLayout columns="*, 40" class="switcher">
            <Label
              text="Your feed"
              class="time-current"
              horizontalAlignment="left"
              col="0"
            />
            <Button
              text.decode="&#xe7f4;"
              class="time-change mi"
              alignSelf="flex-end"
              textWrap="false"
              @tap="openSettings"
              col="1"
            />
          </GridLayout>
          <Post v-for="post in posts" :key="post._id" :post="post" />
        </StackLayout>
      </ScrollView>
    </PullToRefresh>
    <StackLayout class="sign-in-ad" v-else>
      <Label class="mi big-icon" text="vpn_key" horizontalAlignment="center" />
      <Label
        class="ad-text"
        editable="false"
        text="Sign in to your wasteof.money account for personalized content!"
        textWrap="true"
      />
    </StackLayout>
  </Page>
</template>

<script>
import Post from "./Post";
import Browse from "./Browse";
import Settings from "./Settings";
import { Application } from "@nativescript/core";
import { ApplicationSettings } from "@nativescript/core";
import { Http } from "@nativescript/core";
import * as utils from "~/shared/utils";
import { SelectedPageService } from "../shared/selected-page-service";
export default {
  components: {
    Post,
  },
  data() {
    return {
      loading: 1,
      posts: [],
      username: ApplicationSettings.getString("username") || null,
    };
  },
  methods: {
    onDrawerButtonTap() {
      utils.showDrawer();
    },
    openSettings() {
      this.$navigateTo(Settings);
    },
    fetchPosts(e) {
      this.posts = [];
      Http.getJSON(
        `https://api.wasteof.money/users/${this.username}/following/posts`
      ).then((json) => {
        json.posts.forEach((post, i) => {
          post = utils.fixPost(post);
        });
        this.loading++;
        this.posts = json.posts;
        if (e) {
          e.object.refreshing = false;
        }
      });
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
  },
};
</script>
<style scoped lang="scss">
@import "../variables.scss";

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
  width: 40;
  margin: 0;
  height: 40;
  margin-right: 0;
  border-radius: var(--br);
  background-color: var(--accent);
  color: white;
  margin-bottom: 10;
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

.big-icon {
  font-size: 64;
}

.switcher {
  width: 100%;
}
.time-change {
  text-transform: uppercase;
  font-size: 24;
  width: 40;
  margin: 0;
  height: 40;
  margin-right: 0;
  border-radius: var(--br);
  background-color: var(--accent);
  color: white;
  margin-bottom: 10;
}

.time-current {
  font-size: 18;
  margin-top: 5;
  margin-left: 5;
  font-weight: bold;
}
</style>
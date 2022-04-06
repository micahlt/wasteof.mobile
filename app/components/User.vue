<template>
  <Page>
    <ActionBar class="action-bar">
      <NavigationButton visibility="hidden" />
      <GridLayout columns="50, *">
        <Image src="~/shared/nav-logo.png" colSpan="2" class="nav-logo" />
        <Label class="mi menu" text="menu" @tap="onDrawerButtonTap" />
      </GridLayout>
    </ActionBar>
    <PullToRefresh @refresh="loadUser">
      <ScrollView>
        <StackLayout>
          <ActivityIndicator
            busy="true"
            v-if="loading < 2"
            :color="indicatorColor"
          />
          <GridLayout v-if="loading > 1">
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
                </FlexboxLayout>
                <Label :text="info.bio" class="bio" />
                <Label :text="stats" class="stats" />
              </StackLayout>
            </GridLayout>
            <Label class="image-overlay" />
            <Label
              class="header-bg"
              :backgroundImage="`https://api.wasteof.money/users/${info.name}/banner`"
            />
          </GridLayout>
          <StackLayout class="posts" v-if="loading > 1">
            <Post v-for="post in posts" :key="post._id" :post="post" />
          </StackLayout>
        </StackLayout>
      </ScrollView>
    </PullToRefresh>
  </Page>
</template>

<script>
import { Application } from "@nativescript/core";
import { Http } from "@nativescript/core";
import * as utils from "~/shared/utils";
import { SelectedPageService } from "../shared/selected-page-service";
import Post from "./Post.vue";
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
    loadUser(e) {
      const username = this.username;
      Http.getJSON(`https://api.wasteof.money/users/${username}`).then(
        (json) => {
          this.info = json;
          this.loading++;
        }
      );
      Http.getJSON(
        `https://api.wasteof.money/users/${username}/posts?page=1`
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
    SelectedPageService.getInstance().updateSelectedPage("Featured");
    this.loadUser();
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
  },
  components: {
    Post,
  },
};
</script>

<style scoped lang="scss">
@import "@nativescript/theme/scss/variables/blue";
@import "../variables.scss";

Page {
  background-color: var(--bg);
}

ActivityIndicator {
  margin: 20;
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

.posts {
  margin: 50px 75px;
}

.follow-button {
  font-size: 10px;
  height: 125px;
  margin: 0;
  margin-left: 10;
}
</style>
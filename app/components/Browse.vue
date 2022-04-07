<template>
  <Page xmlns:mdr="@nativescript-community/ui-material-ripple">
    <ActionBar class="action-bar">
      <NavigationButton visibility="hidden" />
      <GridLayout columns="50, *">
        <Image src="~/shared/nav-logo.png" colSpan="2" class="nav-logo" />
        <Label class="mi menu" text="menu" @tap="onDrawerButtonTap" />
      </GridLayout>
    </ActionBar>
    <PullToRefresh @refresh="fetchPosts">
      <ScrollView>
        <ActivityIndicator
          busy="true"
          v-if="loading < 2"
          :color="indicatorColor"
        />
        <StackLayout class="posts" v-if="loading > 1">
          <GridLayout columns="*, 40" class="switcher">
            <Label
              :text="timePeriod.text"
              class="time-current"
              horizontalAlignment="left"
              col="0"
            />
            <Button
              text.decode="&#xea5c;"
              class="time-change mi"
              @tap="switchTime"
              alignSelf="flex-end"
              textWrap="false"
              col="1"
            />
          </GridLayout>
          <Post v-for="post in posts" :key="post._id" :post="post" />
        </StackLayout>
      </ScrollView>
    </PullToRefresh>
  </Page>
</template>

<script>
import Post from "./Post";
import { Application } from "@nativescript/core";
import { Dialogs } from "@nativescript/core";
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
      timePeriod: {
        slug: "week",
        text: "Trending this week",
      },
    };
  },
  methods: {
    onDrawerButtonTap() {
      utils.showDrawer();
    },
    fetchPosts(e) {
      Http.getJSON(
        `https://api.wasteof.money/explore/posts/trending?timeframe=${this.timePeriod.slug}`
      ).then((json) => {
        json.posts.forEach((post, i) => {
          post = utils.fixPost(post);
        });
        this.posts = json.posts;
        this.loading = 2;
        if (e) {
          e.object.refreshing = false;
        }
      });
    },
    switchTime() {
      Dialogs.action({
        title: "Time Period",
        cancelButtonText: "Cancel",
        actions: ["This Week", "This Month", "All Time"],
        cancelable: true,
      }).then((result) => {
        const previousPeriod = this.timePeriod;
        if (result == "This Week") {
          this.timePeriod = {
            slug: "week",
            text: "Trending this week",
          };
        } else if (result == "This Month") {
          this.timePeriod = {
            slug: "month",
            text: "Trending this month",
          };
        } else if (result == "All Time") {
          this.timePeriod = {
            slug: "all",
            text: "All time popular",
          };
        }
        if (previousPeriod != this.timePeriod) {
          this.loading = 1;
          this.fetchPosts();
        }
      });
    },
  },
  mounted() {
    SelectedPageService.getInstance().updateSelectedPage("Browse");
    this.fetchPosts();
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
</style>
<template>
  <Page class="page">
    <ActionBar class="action-bar">
      <NavigationButton visibility="hidden" />
      <GridLayout columns="50, *">
        <Image src="~/shared/nav-logo.png" colSpan="2" class="nav-logo" />
        <Label class="mi menu" text="menu" @tap="onDrawerButtonTap" />
      </GridLayout>
    </ActionBar>
    <StackLayout>
      <StackLayout class="searchbar-parent">
        <SearchBar
          hint="Search posts"
          @submit="search"
          textFieldHintColor="white"
          class="searchbar"
          v-model="query"
        />
      </StackLayout>
      <ScrollView>
        <StackLayout class="results" v-if="posts.length > 0">
          <Post v-for="post in posts" :key="post._id" :post="post" />
        </StackLayout>
      </ScrollView>
    </StackLayout>
  </Page>
</template>

<script>
import { Http } from "@nativescript/core";
import * as utils from "~/shared/utils";
import { SelectedPageService } from "../shared/selected-page-service";
import Post from "./Post";
export default {
  components: {
    Post,
  },
  mounted() {
    SelectedPageService.getInstance().updateSelectedPage("Search");
  },
  data() {
    return {
      query: "",
      posts: [],
    };
  },
  methods: {
    onDrawerButtonTap() {
      utils.showDrawer();
    },
    search() {
      const query = this.query.replace(" ", "%20");
      Http.getJSON(`https://api.wasteof.money/search/posts?q=${query}`).then(
        (json) => {
          json.results.forEach((post, i) => {
            post = utils.fixPost(post);
          });
          this.posts = json.results;
        }
      );
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
.searchbar-parent {
  background-color: var(--card-bg);
  border-radius: var(--br);
  margin: 10;
  padding: 5;
  height: 50;
  box-shadow: 0 2 5 rgba(0, 0, 0, 0.5);
  z-index: 2;
  placeholder-color: var(--text-primary);
}

.searchbar {
  background-color: var(--card-bg);
  color: var(--text-primary);
  font-size: 18.5;
  placeholder-color: var(--text-primary);
}

Page {
  background-color: var(--bg);
}

.results {
  color: var(--text-primary);
  padding: 15;
  padding-top: 0;
}
</style>

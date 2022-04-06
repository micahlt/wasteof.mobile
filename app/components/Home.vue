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
      <Label class="page__content-icon mi" text="construction" />
      <Label class="page__content-placeholder">We're working on it!</Label>
      <Button @tap="explore" text="EXPLORE" class="explore-button" />
    </StackLayout>
  </Page>
</template>

<script>
import * as utils from "~/shared/utils";
import { SelectedPageService } from "../shared/selected-page-service";
import Browse from "./Browse";
export default {
  mounted() {
    SelectedPageService.getInstance().updateSelectedPage("Home");
    this.$navigateTo(Browse);
  },
  methods: {
    onDrawerButtonTap() {
      utils.showDrawer();
    },
    explore() {
      this.$navigateTo(Browse);
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
Page {
  background-color: var(--bg);
}

.explore-button {
  background-color: var(--accent);
  margin: auto;
  margin-top: 10;
  width: 100;
  border-radius: var(--br);
}
</style>

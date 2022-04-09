<template>
  <Page class="page">
    <ActionBar class="action-bar">
      <NavigationButton visibility="hidden" />
      <GridLayout columns="50, *">
        <Image src="~/shared/nav-logo.png" colSpan="2" class="nav-logo" />
        <Label class="mi menu" text="menu" @tap="onDrawerButtonTap" />
      </GridLayout>
    </ActionBar>
    <GridLayout rows="auto, *">
      <SegmentedBar row="0" @selectedIndexChanged="tab">
        <SegmentedBarItem title="Unread" />
        <SegmentedBarItem title="Read" />
      </SegmentedBar>
      <ListView
        for="notif in unreadNotifs"
        v-if="currentTab == 0"
        row="1"
        class="notifs"
      >
        <v-template>
          <StackLayout class="notif-parent">
            <Notification :notif="notif" />
          </StackLayout>
        </v-template>
      </ListView>
      <ListView for="notif in readNotifs" v-else row="1" class="notifs">
        <v-template>
          <StackLayout class="notif-parent">
            <Notification :notif="notif" />
          </StackLayout>
        </v-template>
      </ListView>
    </GridLayout>
  </Page>
</template>

<script>
import { Http } from "@nativescript/core";
import { ApplicationSettings } from "@nativescript/core";
import * as utils from "~/shared/utils";
import Notification from "./Notification";
import { SelectedPageService } from "../shared/selected-page-service";
export default {
  components: {
    Notification,
  },
  mounted() {
    SelectedPageService.getInstance().updateSelectedPage("Notifs");
    if (this.token) {
      this.loadUnread();
    }
  },
  data() {
    return {
      token: ApplicationSettings.getString("token") || null,
      readNotifs: [],
      unreadNotifs: [],
      currentTab: 0,
    };
  },
  methods: {
    onDrawerButtonTap() {
      utils.showDrawer();
    },
    tab(n) {
      n = n.newIndex;
      this.currentTab = n;
      if (n == 1 && this.readNotifs.length < 1) {
        this.loadRead();
      }
    },
    loadUnread() {
      Http.request({
        url: "https://api.wasteof.money/messages/unread",
        method: "GET",
        headers: {
          Authorization: this.token,
        },
      }).then((response) => {
        const json = response.content.toJSON();
        json.unread.forEach((notif) => {
          if (notif.type.includes("comment")) {
            notif = utils.fixComment(notif.data.comment);
          }
        });
        this.unreadNotifs = json.unread;
      });
    },
    loadRead() {
      Http.request({
        url: "https://api.wasteof.money/messages/read",
        method: "GET",
        headers: {
          Authorization: this.token,
        },
      }).then((response) => {
        const json = response.content.toJSON();
        json.read.forEach((notif) => {
          if (notif.type.includes("comment")) {
            notif = utils.fixComment(notif.data.comment);
          } else if (notif.type == "post_mention") {
            notif = utils.fixPost(notif.data.post);
          }
        });
        this.readNotifs = json.read;
      });
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
.notifs {
  margin: 0;
  padding: 0;
  padding-top: 0;
  width: 100%;
}

.notif-parent {
  margin: 5;
}
</style>

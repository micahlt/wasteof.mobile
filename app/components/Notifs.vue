<template>
  <Page class="page">
    <ActionBar class="action-bar">
      <NavigationButton visibility="hidden" />
      <GridLayout columns="50, *">
        <Image src="~/shared/nav-logo.png" colSpan="2" class="nav-logo" />
        <Label class="mi menu" text="menu" @tap="onDrawerButtonTap" />
      </GridLayout>
    </ActionBar>
    <PullToRefresh @refresh="chooseToReload">
      <GridLayout rows="auto, *" class="notifs">
        <SegmentedBar row="0" @selectedIndexChanged="tab">
          <SegmentedBarItem title="Unread" />
          <SegmentedBarItem title="Read" />
        </SegmentedBar>
        <StackLayout
          v-if="currentTab == 0 && unreadNotifs.length < 1 && !loading"
          row="1"
          class="no-messages"
        >
          <Label text="mark_email_read" class="mi big-icon" />
          <Label>All done!</Label>
        </StackLayout>
        <ListView
          for="notif in unreadNotifs"
          v-if="currentTab == 0 && unreadNotifs.length > 0"
          row="1"
          class="notifs"
        >
          <v-template>
            <StackLayout class="notif-parent">
              <Notification :notif="notif" />
            </StackLayout>
          </v-template>
        </ListView>
        <StackLayout
          v-if="currentTab == 1 && readNotifs.length < 1 && !loading"
          row="1"
          class="no-messages"
        >
          <Label text="quiz" class="mi big-icon" />
          <Label>Can't find any messages</Label>
        </StackLayout>
        <ListView
          for="notif in readNotifs"
          v-if="currentTab == 1 && readNotifs.length > 0"
          row="1"
          class="notifs"
          ref="notifs"
        >
          <v-template>
            <StackLayout class="notif-parent">
              <Notification :notif="notif" />
            </StackLayout>
          </v-template>
        </ListView>
        <ActivityIndicator
          busy="true"
          v-if="loading"
          :color="indicatorColor"
          row="1"
        />
        <fab
          row="1"
          text.decode="&#xf18b;"
          rippleColor="#f1f1f1"
          androidScaleType="centerInside"
          class="fab-button mi"
          v-if="currentTab == 0"
          hideOnSwipeOfView="notifs"
          color="white"
        />
      </GridLayout>
    </PullToRefresh>
  </Page>
</template>

<script>
import { Http } from "@nativescript/core";
import { Application } from "@nativescript/core";
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
      loading: true,
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
    loadUnread(e) {
      this.loading = true;
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
        this.loading = false;
        if (e) {
          e.object.refreshing = false;
        }
      });
    },
    loadRead(e) {
      this.loading = true;
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
        this.loading = false;
        if (e) {
          e.object.refreshing = false;
        }
      });
    },
    chooseToReload(e) {
      if (this.currentTab == 0) {
        this.unreadNotifs = [];
        this.loadUnread(e);
      } else {
        this.readNotifs = [];
        this.loadRead(e);
      }
    },
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
// Start custom common variables
@import "@nativescript/theme/scss/variables/blue";
@import "../variables.scss";
// End custom common variables

// Custom styles
PullToRefresh {
  color: var(--accent);
  margin: 0;
}

.notifs {
  margin: 0;
  padding: 0;
  padding-top: 0;
  width: 100%;
  color: var(--text-primary);
}

.notif-parent {
  margin: 5;
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

.no-messages {
  padding-top: 30;
  height: 100%;
  text-align: center;
  opacity: 0.7;
}
</style>

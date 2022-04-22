<template>
  <Page class="page">
    <ActionBar class="action-bar">
      <NavigationButton visibility="hidden" />
      <GridLayout columns="50, *">
        <Image src="~/shared/nav-logo.png" colSpan="2" class="nav-logo" />
        <Label class="mi menu" text="menu" @tap="onDrawerButtonTap" />
      </GridLayout>
    </ActionBar>
    <GridLayout rows="auto, *" class="notifs">
      <SegmentedBar row="0" @selectedIndexChanged="tab">
        <SegmentedBarItem title="Unread" />
        <SegmentedBarItem title="Read" />
      </SegmentedBar>
      <PullToRefresh @refresh="loadUnread" row="1" v-if="currentTab == 0">
        <ScrollView @scroll="scrollUnread" id="scrollingView">
          <StackLayout
            class="no-messages"
            v-if="unreadNotifs.length < 1 && !initialLoad.u"
          >
            <Label text="mark_email_read" class="mi big-icon" />
            <Label>All done!</Label>
          </StackLayout>
          <StackLayout>
            <Notification v-for="n in unreadNotifs" :notif="n" :key="n._id" />
          </StackLayout>
        </ScrollView>
      </PullToRefresh>
      <PullToRefresh @refresh="loadRead" row="1" v-if="currentTab == 1">
        <ScrollView @scroll="scrollRead">
          <StackLayout
            class="no-messages"
            v-if="readNotifs.length < 1 && !initialLoad.r"
          >
            <Label text="quiz" class="mi big-icon" />
            <Label>Can't find any messages</Label>
          </StackLayout>
          <StackLayout>
            <Notification v-for="n in readNotifs" :notif="n" :key="n._id" />
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
        v-if="loading && (initialLoad.r || initialLoad.u)"
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
        hideOnSwipeOfView="scrollingView"
        color="white"
        @tap="markRead"
      />
    </GridLayout>
  </Page>
</template>

<script>
import { Application, ApplicationSettings, Http } from "@nativescript/core";
import * as utils from "~/shared/utils";
import { SelectedPageService } from "../shared/selected-page-service";
import * as colorModule from "tns-core-modules/color";
import Notification from "./Notification.vue";
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
      pullToRefreshStyle: {
        indicatorColor: new colorModule.Color("#6466e9"),
      },
      initialLoad: {
        r: true,
        u: true,
      },
      readPage: 1,
      unreadPage: 1,
      isInfiniteLoading: false,
      last: {
        r: false,
        u: false,
      },
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
      if (!this.isInfiniteLoading) {
        this.unreadNotifs = [];
        this.unreadPage = 1;
        this.initialLoad.u = true;
      }
      Http.request({
        url: `https://api.wasteof.money/messages/unread?page=${this.unreadPage}`,
        method: "GET",
        headers: {
          Authorization: this.token,
        },
      }).then((response) => {
        const json = response.content.toJSON();
        json.unread.forEach((notif) => {
          if (notif.type.includes("comment")) {
            notif.data.comment = utils.fixComment(notif.data.comment);
          } else if (notif.type == "post_mention") {
            notif.data.post = utils.fixPost(notif.data.post);
          }
          this.unreadNotifs.push(notif);
        });
        this.loading = false;
        this.initialLoad.u = false;
        this.isInfiniteLoading = false;
        this.last.u = json.last;
        if (e) {
          e.object.refreshing = false;
        }
      });
    },
    loadRead(e) {
      if (!this.isInfiniteLoading) {
        this.readNotifs = [];
        this.readPage = 1;
        this.initialLoad.r = true;
      }
      Http.request({
        url: `https://api.wasteof.money/messages/read?page=${this.readPage}`,
        method: "GET",
        headers: {
          Authorization: this.token,
        },
      }).then((response) => {
        const json = response.content.toJSON();
        json.read.forEach((notif) => {
          if (notif.type.includes("comment")) {
            if (notif.data.comment != null) {
              notif.data.comment = utils.fixComment(notif.data.comment);
            } else {
              notif.data.comment = {
                content: "[this comment was deleted]",
                deleted: true,
              };
            }
          } else if (notif.type == "post_mention") {
            notif.data.post = utils.fixPost(notif.data.post);
          }
          this.readNotifs.push(notif);
        });
        this.loading = false;
        this.isInfiniteLoading = false;
        this.initialLoad.r = false;
        this.last.r = json.last;
        this.readPage++;
        if (e) {
          e.object.refreshing = false;
        }
      });
    },
    markRead() {
      let toMarkRead = [];
      this.unreadNotifs.forEach((notif) => {
        toMarkRead.push(notif._id);
      });
      Http.request({
        url: "https://api.wasteof.money/messages/mark/read",
        method: "POST",
        headers: {
          Authorization: this.token,
          "Content-Type": "application/json",
        },
        content: JSON.stringify({
          messages: toMarkRead,
        }),
      }).then((response) => {
        if (response.statusCode == 200) {
          this.unreadNotifs = [];
          this.loadUnread();
        }
      });
    },
    scrollUnread(e) {
      if (
        e.scrollY > e.object.scrollableHeight - 350 &&
        !this.isInfiniteLoading &&
        !this.last.u &&
        !this.initialLoad.u
      ) {
        this.isInfiniteLoading = true;
        this.loadUnread();
      }
    },
    scrollRead(e) {
      if (
        e.scrollY > e.object.scrollableHeight - 350 &&
        !this.isInfiniteLoading &&
        !this.last.r &&
        !this.initialLoad.r
      ) {
        this.isInfiniteLoading = true;
        this.loadRead();
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

.notifs-list {
  margin-top: 5;
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
  color: var(--text-primary);
}

.infinite {
  margin: 15;
}
</style>

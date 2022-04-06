<template lang="html">
    <GridLayout rows="auto, *" class="nt-drawer__content">
      <GridLayout>
        <StackLayout row="0" class="nt-drawer__header" @tap="openUser">
            <Image class="nt-drawer__header-image mi" src.decode="font://&#xe853;" v-if="username == 'Signed Out'"/>
            <Image class="nt-drawer__header-image pfp" :src="pfp" v-else/>
            <Label class="nt-drawer__header-brand" :text="formattedUsername"/>
            <Label class="nt-drawer__header-footnote" text="sign in for more features" v-if="username == 'Signed Out'"/>
            <Label class="nt-drawer__header-footnote" text="online" v-else/>
          </StackLayout>
          <Image :src="banner" class="banner" stretch="aspectFill" tintColor="#000000bb" />
        </GridLayout>
        <ScrollView row="1" class="nt-drawer__body">
            <StackLayout>
                <GridLayout columns="auto, *"
                            :class="'nt-drawer__list-item' + (selectedPage === 'Home' ? ' -selected': '')"
                            @tap="onNavigationItemTap(Home)">
                    <Label col="0" text="home" class="page-icon mi"/>
                    <Label col="1" text="Home" class="p-r-10"/>
                </GridLayout>

                <GridLayout columns="auto, *"
                            :class="'nt-drawer__list-item' + (selectedPage === 'Browse' ? ' -selected': '')"
                            @tap="onNavigationItemTap(Browse)">
                    <Label col="0" text="web" class="page-icon mi"/>
                    <Label col="1" text="Browse" class="p-r-10"/>
                </GridLayout>

                <GridLayout columns="auto, *"
                            :class="'nt-drawer__list-item' + (selectedPage === 'Search' ? ' -selected': '')"
                            @tap="onNavigationItemTap(Search)">
                    <Label col="0" text="search" class="page-icon mi"/>
                    <Label col="1" text="Search" class="p-r-10"/>
                </GridLayout>

                <StackLayout class="hr"/>

                <GridLayout columns="auto, *"
                            :class="'nt-drawer__list-item' + (selectedPage === 'Settings' ? ' -selected': '')"
                            @tap="onNavigationItemTap(Settings)">
                    <Label col="0" text="settings" class="page-icon mi"/>
                    <Label col="1" text="Settings" class="p-r-10"/>
                </GridLayout>
            </StackLayout>
        </ScrollView>
    </GridLayout>
</template>

<script>
import Home from "./Home";
import Browse from "./Browse";
import Search from "./Search";
import Settings from "./Settings";
import * as utils from "~/shared/utils";
import { SelectedPageService } from "~/shared/selected-page-service";
import { ApplicationSettings } from "@nativescript/core";

export default {
  mounted() {
    SelectedPageService.getInstance().selectedPage$.subscribe(
      (selectedPage) => (this.selectedPage = selectedPage)
    );
  },
  data() {
    return {
      Home: Home,
      Browse: Browse,
      Search: Search,
      Settings: Settings,
      selectedPage: "",
      username: ApplicationSettings.getString("username") || "Signed Out",
    };
  },
  components: {
    Home,
    Browse,
    Search,
    Settings,
  },
  methods: {
    onNavigationItemTap(component) {
      this.$navigateTo(component, {
        clearHistory: false,
      });
      utils.closeDrawer();
    },
    openUser() {
      if (this.username != "Signed Out") {
        this.$navigateTo("User", {
          props: {
            username: this.username,
          },
        });
      } else {
        this.$navigateTo(Settings);
      }
      utils.closeDrawer();
    },
  },
  computed: {
    pfp() {
      return `https://api.wasteof.money/users/${this.username}/picture`;
    },
    banner() {
      return `https://api.wasteof.money/users/${this.username}/banner`;
    },
    formattedUsername() {
      if (this.username == "Signed Out") {
        return this.username;
      } else {
        return "@" + this.username;
      }
    },
  },
};
</script>

<style scoped lang="scss">
// Start custom common variables
@import "@nativescript/theme/scss/variables/blue";
// End custom common variables

// Custom styles
.page-icon {
  margin-right: 15;
  font-size: 18;
}

.nt-drawer__list-item-selected {
  background-color: #6466e9;
}

.nt-drawer__header-image {
  margin-bottom: 10;
}

.nt-drawer__header-footnote {
  font-size: 13;
}

.pfp {
  background-color: white;
}

.banner {
  z-index: -1;
}

.nt-drawer__header {
  background: transparent;
}
</style>

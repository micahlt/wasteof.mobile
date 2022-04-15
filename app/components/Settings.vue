<template>
  <Page class="page">
    <ActionBar class="action-bar">
      <NavigationButton visibility="hidden" />
      <GridLayout columns="50, *, 50">
        <Label class="mi menu" text="menu" @tap="onDrawerButtonTap" col="0" />
        <Image src="~/shared/nav-logo.png" col="1" class="nav-logo" />
      </GridLayout>
    </ActionBar>
    <StackLayout>
      <StackLayout class="settings" v-if="!currentUsername">
        <Image src="~/shared/nav-logo.png" class="logo" />
        <TextField
          hint="username"
          v-model="username"
          class="auth-field username-field"
          autocorrect="false"
          textDecoration="none"
        />
        <TextField
          hint="password"
          v-model="password"
          class="auth-field"
          secure="true"
          autocorrect="false"
        />
        <Button text="SIGN IN" @tap="signIn" class="auth-button" />
      </StackLayout>
      <StackLayout class="settings" v-else>
        <Label class="info-text"
          ><FormattedString>
            <span class="preface-text">Currently signed in as </span>
            <span class="current-user">@{{ currentUsername }}</span>
          </FormattedString></Label
        >
        <Button text="SIGN OUT" @tap="signOut" class="auth-button" />
      </StackLayout>
      <StackLayout class="settings">
        <FlexboxLayout>
          <Switch v-model="filterEnabled" />
          <Label class="setting-descriptor">Filter profanity</Label>
        </FlexboxLayout>
      </StackLayout>
    </StackLayout>
  </Page>
</template>

<script>
import { ApplicationSettings } from "@nativescript/core";
import { android } from "@nativescript/core/application";
import { Utils } from "@nativescript/core";
import { Http } from "@nativescript/core";
import * as utils from "~/shared/utils";
import { SelectedPageService } from "../shared/selected-page-service";

export default {
  mounted() {
    SelectedPageService.getInstance().updateSelectedPage("Settings");
    if (this.filterEnabled == null) {
      this.filterEnabled = false;
    }
  },
  watch: {
    filterEnabled(newSetting) {
      ApplicationSettings.setBoolean("filter", newSetting);
    },
  },
  methods: {
    onDrawerButtonTap() {
      utils.showDrawer();
    },
    signIn() {
      Http.request({
        url: "https://api.wasteof.money/session",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        content: JSON.stringify({
          username: this.username,
          password: this.password,
        }),
      }).then((response) => {
        if (response.statusCode == 200) {
          const json = response.content.toJSON();
          if (json.error) {
            alert(`Error: ${json.error}.  Please try again`);
          }
          ApplicationSettings.setString(
            "username",
            this.username.toLowerCase()
          );
          ApplicationSettings.setString("token", json.token);
          const activity = android.foregroundActivity;
          const intent = activity.getIntent();
          activity.finish();
          Utils.android.getApplicationContext().startActivity(intent);
        } else {
          alert(`Error ${response.statusCode}, please try again`);
        }
      });
    },
    signOut() {
      Http.request({
        url: "https://api.wasteof.money/session",
        method: "DELETE",
        headers: {
          Authorization: this.token,
        },
      }).then(() => {
        ApplicationSettings.clear();
        const activity = android.foregroundActivity;
        const intent = activity.getIntent();
        activity.finish();
        Utils.android.getApplicationContext().startActivity(intent);
      });
    },
  },
  data() {
    return {
      currentUsername: ApplicationSettings.getString("username") || null,
      token: ApplicationSettings.getString("token") || null,
      username: "",
      password: "",
      filterEnabled: ApplicationSettings.getBoolean("filter") || null,
    };
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

.settings {
  margin: 15;
  background: var(--card-bg);
  border-radius: var(--br);
  margin-bottom: 10;
  padding-bottom: 30;
}

.logo {
  margin-top: 20;
  width: 80;
}

.auth-field {
  font-size: 17;
  padding: 10;
  width: 80%;
  margin: auto;
}

.username-field {
  margin-top: 15 !important;
}

.auth-button {
  text-transform: uppercase;
  width: 120;
  margin: auto;
  margin-top: 15;
  height: 40;
  border-radius: var(--br);
  background-color: var(--accent);
  color: white;
}

.info-text {
  font-size: 17;
  text-align: center;
  margin-top: 20;
}

.current-user {
  font-weight: bold;
}

.preface-text {
  opacity: 0.5;
}

.setting-descriptor {
  padding-top: 16;
  font-size: 15;
}
</style>

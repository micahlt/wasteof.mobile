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
        <Ripple rippleColor="#ffffff">
          <Button text="SIGN IN" @tap="signIn" class="auth-button" />
        </Ripple>
        <Label horizontalAlignment="center" class="privacy" textWrap="true">
          <FormattedString>
            <Span>By signing in, you agree to the</Span>
            <Span text.decode="&#x0a;" fontSize="20" />
            <Span class="privacy-link" @linkTap="openPrivacy"
              >Privacy Policy</Span
            >
            <Span> and </Span>
            <Span class="privacy-link" @linkTap="openRules">Rules</Span>
            <Span>.</Span>
          </FormattedString>
        </Label>
      </StackLayout>
      <StackLayout class="settings" v-else>
        <Label class="info-text"
          ><FormattedString>
            <span class="preface-text">Currently signed in as </span>
            <span class="current-user">@{{ currentUsername }}</span>
          </FormattedString></Label
        >
        <Ripple rippleColor="#ffffff">
          <Button text="SIGN OUT" @tap="signOut" class="auth-button" />
        </Ripple>
      </StackLayout>
      <StackLayout class="settings">
        <FlexboxLayout>
          <Switch v-model="filterEnabled" />
          <Label class="setting-descriptor">Filter profanity</Label>
        </FlexboxLayout>
        <FlexboxLayout class="collapse-switch">
          <Switch v-model="useBeta" />
          <Label class="setting-descriptor">Use beta for links </Label>
        </FlexboxLayout>
        <Button
          text="Unblock all users"
          @tap="unblockAll"
          class="setting-button"
          horizontalAlignment="left"
        />
        <Label class="version">app version {{ version }}</Label>
      </StackLayout>
    </StackLayout>
  </Page>
</template>

<script>
const VERSION = "0.7.2";
import { ApplicationSettings, Dialogs } from "@nativescript/core";
import { android } from "@nativescript/core/application";
import { Utils } from "@nativescript/core";
import { Http } from "@nativescript/core";
import * as utils from "~/shared/utils";
import { SelectedPageService } from "../shared/selected-page-service";
import { InAppBrowser } from "nativescript-inappbrowser";

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
    useBeta(newSetting) {
      ApplicationSettings.setBoolean("useBeta", newSetting);
    },
  },
  methods: {
    onDrawerButtonTap() {
      utils.showDrawer();
    },
    unblockAll() {
      ApplicationSettings.setString("blocked", "");
      Dialogs.alert({
        title: "Success!",
        message: "Successfully unblocked all users.",
        okButtonText: "Okay",
      });
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
    async openPrivacy() {
      if (await InAppBrowser.isAvailable()) {
        const b = InAppBrowser.open("https://wasteof.money/privacy", {
          toolbarColor: "#6466e9",
          enableDefaultShare: false,
          showInRecents: false,
        });
      }
    },
    async openRules() {
      if (await InAppBrowser.isAvailable()) {
        const b = InAppBrowser.open("https://wasteof.money/rules", {
          toolbarColor: "#6466e9",
          enableDefaultShare: false,
          showInRecents: false,
        });
      }
    },
  },
  data() {
    return {
      currentUsername: ApplicationSettings.getString("username") || null,
      token: ApplicationSettings.getString("token") || null,
      useBeta: ApplicationSettings.getBoolean("useBeta"),
      username: "",
      password: "",
      filterEnabled: ApplicationSettings.getBoolean("filter") || null,
      version: VERSION,
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
  margin-top: 20;
  margin-bottom: 0;
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

.setting-button {
  width: max-content;
  background-color: var(--border-clr);
  color: white;
  width: 175;
  margin-right: auto;
  margin-top: -5;
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
  padding-top: 17;
  font-size: 15;
  margin-left: -10;
}

.version {
  font-size: 15;
  margin-left: 5%;
  opacity: 0.65;
}

.privacy {
  margin-top: 5;
  text-align: center;
}

.privacy-link {
  color: var(--accent);
}

.collapse-switch {
  margin-top: -15;
}
</style>

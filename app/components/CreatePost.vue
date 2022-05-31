<template>
  <Page class="page">
    <GridLayout class="root" :rows="rows">
      <StackLayout row="0">
        <Label class="header">Create a post</Label>
      </StackLayout>
      <TextView
        hint="Type your post"
        v-model="post"
        @returnPress="post += '\n'"
        row="1"
        class="input"
      />
      <FlexboxLayout row="2" class="actions">
        <Button
          text="Cancel"
          class="cancel"
          @tap="$modal.close(false)"
        ></Button>
        <Button text="Post" class="post" @tap="newPost"></Button>
      </FlexboxLayout>
    </GridLayout>
  </Page>
</template>

<script>
import { ApplicationSettings, Dialogs, Http } from "@nativescript/core";
export default {
  name: "CreatePost",
  props: {
    repost: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      post: "",
       username: ApplicationSettings.getString("username") || null,
      token: ApplicationSettings.getString("token") || null,
    };
  },
  methods: {
    newPost() {
      Http.request({
        url: "https://api.wasteof.money/posts",
        method: "POST",
        headers: {
          Authorization: this.token,
          "Content-Type": "application/json",
        },
        content: JSON.stringify({
          post: `<p>${this.post}</p>`,
          repost: this.repost,
        }),
      }).then((r) => {
        if (r.statusCode == 200) {
          this.$modal.close("posted");
        } else {
          const json = r.content.toJSON();
          Dialogs.alert(JSON.stringify(json));
        }
      });
    },
  },
  computed: {
    rows() {
      if (this.repost) {
        return "auto, *, auto, auto";
      } else {
        return "auto, *, auto";
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "@nativescript/theme/scss/variables/blue";
@import "../variables.scss";

.header {
  font-size: 30;
  font-weight: bold;
  color: var(--text-primary);
  padding-left: 20;
}

.page {
  color: var(--text-primary);
  background: var(--card-bg);
}

.root {
  background: var(--card-bg);
  padding: 16;
}

.input {
  background-color: var(--bg);
  font-size: 15;
  padding: 8;
  border-radius: 5;
  color: white;
}

.actions {
  align-items: flex-end;
}

.cancel,
.post {
  flex: 1;
}

.post {
  background: var(--accent);
}
</style>
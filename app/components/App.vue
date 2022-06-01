<template lang="html">
    <RadSideDrawer ref="drawer" drawerLocation="Left" gesturesEnabled="true" :drawerTransition="transition">
        <StackLayout ~drawerContent backgroundColor="#ffffff">
            <DrawerContent/>
        </StackLayout>
        <Frame ~mainContent ref="drawerMainContent">
            <Home/>
        </Frame>
    </RadSideDrawer>
</template>

<script>
import DrawerContent from "./DrawerContent";
import Home from "./Home";
import { SlideInOnTopTransition } from "nativescript-ui-sidedrawer";
import { firebase } from "@nativescript/firebase-core";
import "@nativescript/firebase-messaging";
export default {
  data() {
    return {
      transition: new SlideInOnTopTransition(),
    };
  },
  components: {
    DrawerContent,
    Home,
  },
  mounted() {
    firebase()
      .messaging()
      .getToken()
      .then((token) => {
        alert(token);
      });
  },
};
</script>

<style scoped lang="scss">
// Start custom common variables
@import "@nativescript/theme/scss/variables/blue";
// End custom common variables

// Custom styles
</style>

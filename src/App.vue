<template>
  <div>
    <navigation-bar :title="brandName" :items="menuItems" />
    <router-view />
  </div>
</template>

<script>
import NavigationBar from "./components/NavigationBar.vue";

export default {
  name: "App",
  components: {
    NavigationBar,
  },
  data() {
    return {
      brandName: "LitShare",
      menuItems: [{ text: "Home", link: "/" }],
    };
  },
};
</script>

<style lang="scss">
@import "assets/styles/variables.scss";
@import "~bulma/bulma.sass";
@import "assets/styles/main.scss";
</style>

<template>
  <div id="app">
    <HeaderComponent msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import HeaderComponent from "./components/Header.vue";

export default {
  name: "App",
  components: {
    HeaderComponent,
  },
};
</script>

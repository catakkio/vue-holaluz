<template>
  <div id="app">
    <HeaderComponent msg="Welcome to Your Vue.js App" />
    <div id="body-container" class="container mx-auto flex justify-center max-w-2xl">
      <RooftopRevolution />
    </div>
  </div>
</template>

<script>
import HeaderComponent from "./components/Header.vue";
import RooftopRevolution from "./pages/RooftopRevolution/RooftopRevolution.vue";

export default {
  name: "App",
  components: {
    HeaderComponent,
    RooftopRevolution,
  },
};
</script>

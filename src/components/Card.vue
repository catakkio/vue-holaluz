<template>
  <div class="card">
    <h3>{{ title }}</h3>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "CardComponent",
  props: {
    title: String,
  },
};
</script>

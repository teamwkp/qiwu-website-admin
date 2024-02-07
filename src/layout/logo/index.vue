<template>
  <div class="logo">
    <img src="~@/assets/images/logo.png" alt="" />
    <h2 v-show="!collapsed" class="title">齐物官网后台</h2>
  </div>
</template>

<script setup>
  defineProps({
    collapsed: {
      type: Boolean,
    },
  });
</script>

<style lang="less" scoped>
  .logo {
    height: 64px;
    padding-left: 24px;

    line-height: 64px;
    @apply flex overflow-hidden whitespace-nowrap items-center;

    img {
      height: 32px;
      margin-right: 8px;
    }

    .title {
      color: @primary-color;
      @apply mb-0 text-xl;
    }
  }
</style>

<script setup lang="ts">
defineOptions({
  name: 'Welcome',
});
</script>

<template>
  <div class="index-view">
    <h1>齐物官网管理后台</h1>
    <img src="@/assets/images/index_background.png" />
  </div>
</template>

<style lang="scss" scoped>
.index-view {
  display: flex;
  align-items: center;
  flex-direction: column;

  min-height: 600px;

  background-color: #fff;
  h1 {
    padding: 40px 0 20px 0;
  }
  img {
    width: 80%;
  }
}
</style>

<script setup>
import { reactive } from 'vue';
const form = reactive({});
</script>

<template>
  <div style="width: 300px">
    <div>页面配置</div>
    <div>模块1</div>
    <el-form :model="form" label-width="120px">
      <el-form-item label="标题图片">
        <el-button type="primary">添加</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped></style>

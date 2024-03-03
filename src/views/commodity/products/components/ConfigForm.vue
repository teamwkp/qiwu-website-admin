<!--
 * @Author       : liqiao
 * @Date         : 2024-02-29 16:24:16
 * @LastEditors  : liqiao
 * @LastEditTime : 2024-02-29 20:39:24
 * @Description  : Do not edit
 * @FilePath     : /qiwu.frontend.admin/src/views/device/components/ProductManualDetailForm.vue
-->

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ProductCategoryNavStatusList } from '@/enums/selectEnum';

import { ElMessage } from 'element-plus';
import { ProductCategoryAddCategoryApi, ProductCategoryEditCategoryApi } from '@/api/commodity.ts';

// const route = useRoute();

export interface PropsModel {
  isFormVisible: boolean;
  selectItem?: any;
}

const props = withDefaults(defineProps<PropsModel>(), {
  isFormVisible: false,
  selectItem: undefined,
});

const emit = defineEmits(['formOperate']);

const ruleFormRef = ref();
const ruleFormData = ref({
  name: props.selectItem ? props.selectItem.name : undefined,
  navStatus: props.selectItem ? props.selectItem.navStatus : undefined,
  sort: props.selectItem ? props.selectItem.sort : undefined,
  description: props.selectItem ? props.selectItem.description : undefined,
});

let isVisible = computed(() => {
  return props.isFormVisible;
});

const submitForm = async (formEl: any) => {
  if (!formEl) return;

  await formEl.validate((valid, fields) => {
    if (valid) {
      apiOperate(ruleFormData.value);
    } else {
      console.log('error submit!', fields);
    }
  });
};

const apiOperate = async (params) => {
  const res = props.selectItem
    ? await ProductCategoryEditCategoryApi({ ...params, id: props.selectItem.id })
    : await ProductCategoryAddCategoryApi(params);
  if (Number(res.code) === 0) {
    ruleFormRef.value.resetFields();
    emit('formOperate', true);
    ElMessage({
      message: '操作成功',
      type: 'success',
    });
  }
};

const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
  emit('formOperate');
};

const closeOperate = () => {
  emit('formOperate');
};
</script>

<template>
  <!-- :show-close="false"
    :close-on-click-modal="false" props.isFormVisible isVisible -->
  <el-dialog
    :show-close="false"
    :close-on-click-modal="false"
    v-model="isVisible"
    :title="props.selectItem ? '编辑' : '新增'"
    width="600"
  >
    <el-form
      ref="ruleFormRef"
      class="config-form-view"
      :model="ruleFormData"
      @close="closeOperate"
      label-width="140px"
      status-icon
    >
      <el-form-item
        prop="name"
        key="name"
        label="分类名称"
        :rules="{
          required: true,
          message: '请输入',
        }"
      >
        <el-input v-model="ruleFormData.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item
        prop="navStatus"
        key="navStatus"
        label="显示导航栏"
        :rules="{
          required: true,
          message: '请选择',
        }"
      >
        <el-select
          style="width: 100%"
          v-model="ruleFormData.navStatus"
          clearable
          placeholder="请选择"
          :disabled="props.selectItem"
        >
          <el-option
            v-for="item in ProductCategoryNavStatusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        prop="description"
        key="description"
        label="分类描述"
        :rules="{
          required: false,
          message: '请输入',
        }"
      >
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          v-model="ruleFormData.description"
          placeholder="请输入"
        />
      </el-form-item>

      <el-form-item
        prop="sort"
        key="sort"
        label="排序"
        :rules="{
          required: false,
          message: '请输入',
        }"
      >
        <el-input-number
          v-model="ruleFormData.sort"
          placeholder="请输入"
          controls-position="right"
          :min="0"
          :max="100000000"
        ></el-input-number>
      </el-form-item>

      <div class="form-bottom-cont">
        <el-form-item>
          <el-button type="primary" @click="submitForm(ruleFormRef)">保存</el-button>
          <el-button @click="resetForm(ruleFormRef)">取消</el-button>
        </el-form-item>
      </div>
    </el-form>
  </el-dialog>
</template>

<style lang="scss" scoped></style>

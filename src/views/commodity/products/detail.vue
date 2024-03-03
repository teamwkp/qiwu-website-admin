<!--
 * @Author       : liqiao
 * @Date         : 2024-02-26 16:03:43
 * @LastEditors  : liqiao
 * @LastEditTime : 2024-02-28 16:09:33
 * @Description  : Do not edit
 * @FilePath     : /qiwu-website-admin/src/views/website/homepage/index.vue
-->
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { ElMessage, FormInstance } from 'element-plus';
import { useRouter, useRoute } from 'vue-router';

import DetailBaseForm from './components/DetailBaseForm.vue';
import { ProductAddApi, ProductDetailApi, ProductEditApi } from '@/api/commodity';
// const formSize = ref("default");
const router = useRouter();
const route = useRoute();
const ruleFormRef = ref<FormInstance>();
const ruleFormData = ref<any>({
  productCategoryId: '',
  name: '',
  mainRecommend: 0,
  subTitle: '',
  navPic: '',
  recommendStatus: 0,
  recommendPic: '',
  publishStatus: 1,
  buyUrl: '',
  sort: 0,
  description: '',
  // detailContent
});
console.log('🚀 ~ route:', route.query);

const activeNamesCollapse = ref(['1', '2']);
// 1:view 2:edit 3:add
const configType = ref(Number(route?.query?.configType) || 3);
const productId = ref(route?.query?.id);
const selectItem = ref(null);
const navPicInitList = ref([]);
const recommendPicInitList = ref([]);

onMounted(() => {
  if ([1, 2].includes(Number(configType.value))) ProductDetailOperate();
});

const ProductDetailOperate = async () => {
  const res = await ProductDetailApi(productId.value);
  if (Number(res.code) === 0) {
    const result = res.data;
    if (result.navPic) {
      navPicInitList.value = [
        { name: result.navPic, url: result.navPic, uid: result.navPic, uploadUrl: result.navPic },
      ];
    }
    if (result.recommendPic) {
      recommendPicInitList.value = [
        {
          name: result.recommendPic,
          url: result.recommendPic,
          uid: result.recommendPic,
          uploadUrl: result.recommendPic,
        },
      ];
    }
    selectItem.value = result;
    initFormData(res.data);
  }
};

const initFormData = (currData: any) => {
  console.log('🚀 ~ currData:', currData);
  ruleFormData.value = currData;
};

const changeFormOperate = (data) => {
  console.log('🚀 ~ changeFormOperate ~ data:', data);
  ruleFormData.value = {
    ...ruleFormData.value,
    ...data,
  };
};

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!');
      console.log('🚀 ~ ruleFormData.:', ruleFormData.value);
      apiOperate(ruleFormData.value);
    } else {
      console.log('error submit!', fields);
    }
  });
};

const apiOperate = async (params) => {
  const res =
    Number(configType.value) === 2
      ? await ProductEditApi({ ...params, id: productId.value })
      : await ProductAddApi(params);
  // const res = await ProductAddApi(params);
  if (Number(res.code) === 0) {
    ruleFormRef.value.resetFields();

    ElMessage({
      message: '操作成功',
      type: 'success',
    });
  }
  router.push('/commodity/products/index');
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  router.push('/commodity/products/index');
};

const backOperate = () => {
  router.push('/commodity/products/index');
};
// const editOperate = () => {
//   configType.value = 2;
// };
</script>
<template>
  <div class="page-module-view">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <div class="card-header__left">
            <span>
              {{
                Number(configType) === 1
                  ? '查看产品'
                  : Number(configType) === 2
                  ? '编辑产品'
                  : Number(configType) === 3
                  ? '新增产品'
                  : '产品'
              }}
            </span>
            <!-- <span v-if="Number(configType) === 1">点击编辑按钮即可进行配置</span> -->
          </div>
          <!-- <el-button v-if="Number(configType) === 1" class="button" type="primary" @click="editOperate">编辑</el-button> -->
        </div>
      </template>
      <div>
        <!-- :rules="rules":size="formSize" -->
        <el-form ref="ruleFormRef" class="rule-form-view" :model="ruleFormData" label-width="120px" status-icon>
          <el-collapse v-model="activeNamesCollapse">
            <el-collapse-item title="基本配置" name="1">
              <DetailBaseForm
                :ruleFormData="ruleFormData"
                :configType="configType"
                :navPicInitList="navPicInitList"
                :recommendPicInitList="recommendPicInitList"
                @changeFormOperate="changeFormOperate"
              />
            </el-collapse-item>
            <el-collapse-item title="版式配置" name="2">TODO</el-collapse-item>
          </el-collapse>
          <el-affix :offset="0" position="bottom">
            <div class="form-bottom-cont">
              <el-form-item>
                <el-button v-if="[2, 3].includes(Number(configType))" type="primary" @click="submitForm(ruleFormRef)">
                  保存
                </el-button>
                <el-button v-if="[2, 3].includes(Number(configType))" @click="resetForm(ruleFormRef)">返回</el-button>
                <el-button v-if="[1].includes(Number(configType))" @click="backOperate">返回</el-button>
              </el-form-item>
            </div>
          </el-affix>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss"></style>

<!--
 * @Author       : liqiao
 * @Date         : 2024-02-26 17:22:34
 * @LastEditors  : liqiao
 * @LastEditTime : 2024-02-26 20:50:22
 * @Description  : Do not edit
 * @FilePath     : /qiwu-website-admin/src/views/website/homepage/components/ModuleOne.vue
-->

<script setup lang="ts">
import {
  RuleRequireInputTrue,
  RuleRequireInputFalse,
  ProductMainRecommendList,
  ProductRecommendStatusList,
  ProductPublishStatusList,
} from '@/enums/selectEnum.ts';
import { ProductCategoryListApi } from '@/api/commodity';
import { computed, onMounted, ref } from 'vue';
import UploadFile from '@/components/QiwuUpload/UploadFile.vue';

const emit = defineEmits(['changeFormOperate']);

interface propsModel {
  ruleFormData: any;
  configType: number;
  navPicInitList?: any[];
  recommendPicInitList?: any[];
}

const props = withDefaults(defineProps<propsModel>(), {
  ruleFormData: {
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
  },
  navPicInitList: [],
  recommendPicInitList: [],
});

const productCategoryList = ref([]);

onMounted(() => {
  productCategoryListApiOperate();
  console.log('🚀 ~ props ~ ruleFormData:', props.ruleFormData);
});

const productCategoryListApiOperate = async () => {
  const res = await ProductCategoryListApi({});
  if (Number(res.code) === 0) {
    const result = res.data?.rows || [];
    const list = result?.map((item) => ({ value: item.id, label: item.name }));
    productCategoryList.value = list;
  }
};

const changeUploadOperate = (imgList: string[], lang?: string) => {
  console.log('🚀 ~ changeUploadOperate ~ imgList:', imgList, lang, props.ruleFormData);
  // module1.titleImg
  // ruleFormData.value[lang ?? ''] = imgList.join(',');
  const currData = {
    [lang]: imgList.join(','),
  };
  console.log('🚀 ~ changeUploadOperate ~ currData:', currData);

  emit('changeFormOperate', currData);
};
</script>

<template>
  <div class="w-3/4">
    <el-form-item prop="productCategoryId" key="productCategoryId" label="产品分类" :rules="RuleRequireInputTrue">
      <!-- :disabled="props.selectItem" -->
      <el-select
        :disabled="Number(configType) === 1"
        style="width: 100%"
        v-model="props.ruleFormData.productCategoryId"
        clearable
        placeholder="请选择"
      >
        <el-option
          v-for="item in productCategoryList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item prop="name" key="name" label="产品名称" :rules="RuleRequireInputTrue">
      <el-input :disabled="Number(configType) === 1" v-model="props.ruleFormData.name" placeholder="请输入" />
    </el-form-item>
    <el-form-item prop="mainRecommend" key="mainRecommend" label="是否主推" :rules="RuleRequireInputTrue">
      <!-- :disabled="props.selectItem" -->
      <el-select
        :disabled="Number(configType) === 1"
        style="width: 100%"
        v-model="props.ruleFormData.mainRecommend"
        clearable
        placeholder="请选择"
      >
        <el-option
          v-for="item in ProductMainRecommendList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <!-- <el-radio-group v-model="props.ruleFormData.mainRecommend">
        <el-radio v-for="item in ProductMainRecommendList" :value="item.value" size="large">{{ item.label }}</el-radio>
      </el-radio-group> -->
    </el-form-item>
    <el-form-item
      prop="subTitle"
      key="subTitle"
      label="副标题"
      :rules="Number(props.ruleFormData.mainRecommend) === 1 ? RuleRequireInputTrue : RuleRequireInputFalse"
    >
      <el-input :disabled="Number(configType) === 1" v-model="props.ruleFormData.subTitle" placeholder="请输入" />
    </el-form-item>
    <el-form-item prop="navPic" key="navPic" label="导航图片" :rules="RuleRequireInputTrue">
      <el-image
        v-if="[1].includes(Number(configType))"
        style="width: 80px"
        :src="props.ruleFormData.navPic"
        :preview-src-list="[props.ruleFormData.navPic]"
      ></el-image>
      <!-- :limit="2" -->
      <UploadFile
        v-if="[2, 3].includes(Number(configType))"
        :lang="'navPic'"
        :fileInitList="props?.navPicInitList"
        @changeUploadOperate="changeUploadOperate"
      />
    </el-form-item>
    <el-form-item prop="recommendStatus" key="recommendStatus" label="推荐状态" :rules="RuleRequireInputTrue">
      <el-select
        :disabled="Number(configType) === 1"
        style="width: 100%"
        v-model="props.ruleFormData.recommendStatus"
        clearable
        placeholder="请选择"
      >
        <el-option
          v-for="item in ProductRecommendStatusList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      prop="recommendPic"
      key="recommendPic"
      label="推荐图片"
      :rules="Number(props.ruleFormData.recommendStatus) === 1 ? RuleRequireInputTrue : RuleRequireInputFalse"
    >
      <el-image
        v-if="[1].includes(Number(configType))"
        style="width: 80px"
        :src="props.ruleFormData.recommendPic"
        :preview-src-list="[props.ruleFormData.recommendPic]"
      ></el-image>

      <UploadFile
        v-if="[2, 3].includes(Number(configType))"
        :lang="'recommendPic'"
        :fileInitList="props?.recommendPicInitList"
        @changeUploadOperate="changeUploadOperate"
      />
    </el-form-item>

    <el-form-item
      prop="buyUrl"
      key="buyUrl"
      label="购买链接"
      :rules="Number(props.ruleFormData.recommendStatus) === 1 ? RuleRequireInputTrue : RuleRequireInputFalse"
    >
      <el-input :disabled="Number(configType) === 1" v-model="props.ruleFormData.buyUrl" placeholder="请输入" />
    </el-form-item>
    <el-form-item prop="publishStatus" key="publishStatus" label="上架状态" :rules="RuleRequireInputTrue">
      <el-select
        :disabled="Number(configType) === 1"
        style="width: 100%"
        v-model="props.ruleFormData.publishStatus"
        clearable
        placeholder="请选择"
      >
        <el-option
          v-for="item in ProductPublishStatusList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item prop="sort" key="sort" label="排序" :rules="RuleRequireInputFalse">
      <el-input-number
        :disabled="Number(configType) === 1"
        v-model="ruleFormData.sort"
        placeholder="请输入"
        controls-position="right"
        :min="0"
        :max="100000000"
      ></el-input-number>
    </el-form-item>
    <el-form-item prop="description" key="description" label="产品描述" :rules="RuleRequireInputFalse">
      <el-input
        :disabled="Number(configType) === 1"
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4 }"
        v-model="ruleFormData.description"
        placeholder="请输入"
      />
    </el-form-item>
  </div>
</template>

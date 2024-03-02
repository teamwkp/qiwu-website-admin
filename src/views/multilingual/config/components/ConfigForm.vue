<!--
 * @Author       : liqiao
 * @Date         : 2024-02-29 16:24:16
 * @LastEditors  : liqiao
 * @LastEditTime : 2024-02-29 20:39:24
 * @Description  : Do not edit
 * @FilePath     : /qiwu.frontend.admin/src/views/device/components/ProductManualDetailForm.vue
-->

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { VXETable } from 'vxe-table';
import {
  MultilingualConfigTypeList,
  MultilingualConfigLangList,
  MultilingualConfigLangZhList,
  RuleRequireInputTrue,
  RuleRequireInputFalse,
} from '@/enums/selectEnum';
import UploadFile from '@/components/QiwuUpload/UploadFile.vue';

// import Uploadfile from '@/components/Upload-window';
// import {
//   ProductManualInfoUpdateApi,
//   ProductManualInfoCreateApi,
//   ProductManualCountryApi,
// } from '@/api/device/productSpecifications';
// import { useRouter, useRoute } from '@/router/index';
import { ElMessage } from 'element-plus';
import { MultiLanguageConfigAddApi, MultiLanguageConfigEditApi } from '@/api/multilingual.ts';

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
  configKey: props.selectItem ? props.selectItem.configKey : undefined,
  type: props.selectItem ? props.selectItem.type : undefined,
  remark: props.selectItem ? props.selectItem.remark : undefined,
  configValueZh: props.selectItem ? props.selectItem.configValueZh : undefined,
  configValueEn: props.selectItem ? props.selectItem.configValueEn : undefined,
  configValueJa: props.selectItem ? props.selectItem.configValueJa : undefined,
  configValueKo: props.selectItem ? props.selectItem.configValueKo : undefined,
  configValueEs: props.selectItem ? props.selectItem.configValueEs : undefined,
  configValuePt: props.selectItem ? props.selectItem.configValuePt : undefined,
  configValueRu: props.selectItem ? props.selectItem.configValueRu : undefined,
  configValueFr: props.selectItem ? props.selectItem.configValueFr : undefined,
  configValuePl: props.selectItem ? props.selectItem.configValuePl : undefined,
  configValueDe: props.selectItem ? props.selectItem.configValueDe : undefined,
  configValueIt: props.selectItem ? props.selectItem.configValueIt : undefined,
});
const uploadFile = ref([]);
const currUploadFile = ref((props.selectItem && props.selectItem.area) || '');
const manualCountryList = ref([]);
const langList = ref<any[]>([]);

let isVisible = computed(() => {
  return props.isFormVisible;
});

onMounted(() => {
  if (props?.selectItem) {
    langList.value = MultilingualConfigLangList;
  } else {
    langList.value = MultilingualConfigLangZhList;
  }
});

const submitForm = async (formEl: any) => {
  if (!formEl) return;
  console.log('🚀 ~ awaitformEl.validate ~ ruleFormData.value:', ruleFormData.value);

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
    ? await MultiLanguageConfigEditApi({ ...params, id: props.selectItem.id })
    : await MultiLanguageConfigAddApi(params);
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

const changeUploadOperate = (imgList: string[], lang?: string) => {
  console.log('🚀 ~ changeUploadOperate ~ imgList:', imgList, lang);
  // module1.titleImg
  ruleFormData.value[lang ?? ''] = imgList.join(',');
};

// const getUploadFile = (data) => {
//   const id = data && data[0] && data[0].id;
//   const url = data && data[0] && data[0].url;
//   uploadFile.value = data;
//   ruleFormData.value.area = id;
//   currUploadFile.value = url;
// };

// const changeLangOperate = (value) => {
//   console.log('🚀 ~ changeLangOperate ~ value,list:', value, ruleFormData.value);
//   const currLang = manualCountryList.value.filter((item) => item.countryName === value);
//   console.log('🚀 ~ changeLangOperate ~ currLang:', currLang);
//   ruleFormData.value = {
//     ...ruleFormData.value,
//     img: currLang[0] && currLang[0].countryImg,
//   };
// };
</script>

<template>
  <!-- :show-close="false"
    :close-on-click-modal="false" props.isFormVisible isVisible -->
  <el-dialog v-model="isVisible" :title="props.selectItem ? '编辑' : '新增'" width="600">
    <el-form
      ref="ruleFormRef"
      class="config-form-view"
      :model="ruleFormData"
      @close="closeOperate"
      label-width="140px"
      status-icon
    >
      <el-form-item
        v-if="props?.selectItem"
        prop="configKey"
        key="configKey"
        label="key"
        :rules="{
          required: true,
          message: '请输入',
        }"
      >
        <el-input v-model="ruleFormData.configKey" :disabled="props.selectItem" placeholder="请输入" />
      </el-form-item>
      <el-form-item
        prop="type"
        key="type"
        label="类型"
        :rules="{
          required: true,
          message: '请输入',
        }"
      >
        <!--  @change="changeLangOperate" -->
        <el-select
          style="width: 100%"
          v-model="ruleFormData.type"
          clearable
          placeholder="请选择"
          :disabled="props.selectItem"
        >
          <el-option
            v-for="item in MultilingualConfigTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        v-if="ruleFormData.type"
        v-for="item in MultilingualConfigLangList"
        :prop="item.key"
        :key="item.key"
        :label="item.name"
        :rules="['configValueZh'].includes(item.key) ? RuleRequireInputTrue : RuleRequireInputFalse"
      >
        <el-input
          v-if="ruleFormData.type === 1"
          type="textarea"
          v-model="ruleFormData[item.key]"
          :autosize="{ minRows: 1, maxRows: 6 }"
          placeholder="请输入，若需折行请用英文,隔开"
        />
        <UploadFile v-if="ruleFormData.type === 3" :lang="item.key" @changeUploadOperate="changeUploadOperate" />
        <UploadFile
          v-if="ruleFormData.type === 4"
          accept="video/*"
          :lang="item.key"
          fileSize="50"
          :fileTypeList="['mp4', 'avi', 'rmvb']"
          reminderCont="如果是背景视频，则需10M以内的视频，否者显示会卡顿;"
          @changeUploadOperate="changeUploadOperate"
        />

        <el-input v-if="ruleFormData.type === 5" v-model="ruleFormData[item.key]" placeholder="请输入" />
      </el-form-item>

      <el-form-item
        prop="remark"
        key="remark"
        label="描述"
        :rules="{
          required: false,
          message: '请输入',
        }"
      >
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          v-model="ruleFormData.remark"
          placeholder="请输入"
        />
      </el-form-item>

      <!-- <el-form-item
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
      </el-form-item> -->

      <div class="form-bottom-cont">
        <el-form-item>
          <el-button type="primary" @click="submitForm(ruleFormRef)">保存</el-button>
          <el-button @click="resetForm(ruleFormRef)">取消</el-button>
        </el-form-item>
      </div>
    </el-form>
  </el-dialog>
</template>

<style lang="scss" scoped>
.config-form-view {
  height: 500px;
  overflow-y: scroll;
}
</style>

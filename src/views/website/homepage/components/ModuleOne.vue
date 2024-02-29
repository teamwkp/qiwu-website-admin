<!--
 * @Author       : liqiao
 * @Date         : 2024-02-26 17:22:34
 * @LastEditors  : liqiao
 * @LastEditTime : 2024-02-28 16:17:25
 * @Description  : Do not edit
 * @FilePath     : /qiwu-website-admin/src/views/website/homepage/components/ModuleOne.vue
-->

<script setup lang="ts">
import { LangEnum, RuleRequireInputTrue, RuleRequireInputFalse } from '@/enums/selectEnum.ts';

import UploadFile from '@/components/QiwuUpload/UploadFile.vue';

const emit = defineEmits(['changeFormOperate']);

interface PropsModel {
  ruleForm: any;
  configType: number;
}

const props = withDefaults(defineProps<PropsModel>(), {
  ruleForm: { desc: '' },
});

const changeInput = (e, name) => {
  // emit("changeFormOperate", currData);
};

const changeUploadOperate = (imgList: string[], lang?: string) => {
  console.log('🚀 ~ changeUploadOperate ~ imgList:', imgList, lang);
  // module1.titleImg
  let currData = props.ruleForm;
  if (lang) {
    currData = {
      ...currData,
      module1: {
        ...currData.module1,
        titleImg: {
          ...currData.module1.titleImg,
          [lang]: imgList,
        },
      },
    };
  } else {
    currData = {
      ...currData,
      module1: {
        ...currData.module1,
        titleImg: imgList.join(','),
      },
    };
  }

  emit('changeFormOperate', currData);
};
</script>

<template>
  <!-- w-2/4 -->
  <div class="w-3/4 ml-8">
    <!-- <el-collapse model-value="1" key="1" accordion>
      <el-collapse-item title="标题：" name="1">
        <el-form-item
          v-for="(item, key, index) in props.ruleForm?.module1?.title"
          :prop="`module1.title.${key}`"
          :key="`module1.title.${key}`"
          :label="`${LangEnum[key]}`"
          :rules="['zh', 'en'].includes(key) ? RuleRequireInputTrue : RuleRequireInputFalse"
        >
          <el-input
            v-model="props.ruleForm.module1.title[key]"
            placeholder="请输入"
            @input="
              (e) => {
                changeInput(e, 'title');
              }
            "
            :disabled="props.configType === 1"
          />
        </el-form-item>
      </el-collapse-item>
    </el-collapse> -->
    <el-collapse model-value="3" key="3" accordion>
      <el-collapse-item title="标题图片：" name="3">
        <!-- <el-form-item prop="module1.titleImg" key="module1.titleImg" label="上传资源：" :rules="RuleRequireInputTrue">
          <UploadFile v-if="props.configType === 2" @changeUploadOperate="changeUploadOperate" />
          <div v-if="props.configType === 1" class="demo-image__preview">
            <el-image
              style="width: 100px"
              class="mr-3.5"
              v-for="(item, key, index) in props.ruleForm?.module1?.title"
              src="https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg"
              fit="contain"
              :preview-src-list="['https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg']"
            />
          </div>
        </el-form-item> -->
        <el-form-item
          v-for="(item, key, index) in props.ruleForm?.module1?.titleImg"
          :prop="`module1.titleImg.${key}`"
          :key="`module1.titleImg.${key}`"
          :label="`${LangEnum[key]}`"
          :rules="['zh', 'en'].includes(key) ? RuleRequireInputTrue : RuleRequireInputFalse"
        >
          <!-- 编辑 -->
          <UploadFile v-if="props.configType === 2" :lang="key" @changeUploadOperate="changeUploadOperate" />
          <!--查看 -->
          <div v-if="props.configType === 1" class="demo-image__preview">
            <el-image
              style="width: 100px"
              class="mr-3.5"
              v-for="(item, key, index) in props.ruleForm?.module1?.title"
              src="https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg"
              fit="contain"
              :preview-src-list="['https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg']"
            />
          </div>
        </el-form-item>
      </el-collapse-item>
    </el-collapse>
    <el-collapse model-value="2" key="2" accordion>
      <el-collapse-item title="副标题：" name="2">
        <el-form-item
          v-for="(item, key, index) in props.ruleForm?.module1?.subTitle"
          :prop="`module1.subTitle.${key}`"
          :key="`module1.subTitle.${key}`"
          :label="`${LangEnum[key]}`"
          :rules="['zh', 'en'].includes(key) ? RuleRequireInputTrue : RuleRequireInputFalse"
        >
          <el-input
            type="textarea"
            :autosize="{ minRows: 1, maxRows: 6 }"
            v-model="props.ruleForm.module1.subTitle[key]"
            placeholder="请输入，若需折行请用英文,隔开"
            :disabled="props.configType === 1"
          />
        </el-form-item>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

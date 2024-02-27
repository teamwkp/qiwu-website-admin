<!--
 * @Author       : liqiao
 * @Date         : 2024-02-26 17:22:34
 * @LastEditors  : liqiao
 * @LastEditTime : 2024-02-27 11:04:32
 * @Description  : Do not edit
 * @FilePath     : /qiwu-website-admin/src/views/website/homepage/components/ModuleOne.vue
-->

<script setup lang="ts">
import {
  LangEnum,
  RuleRequireInputTrue,
  RuleRequireInputFalse
} from "@/enums/selectEnum.ts";

import UploadFile from "@/components/QiwuUpload/UploadFile.vue";

const emit = defineEmits(["changeFormOperate"]);

interface PropsModel {
  ruleForm: any;
}

const props = withDefaults(defineProps<PropsModel>(), {
  ruleForm: { desc: "" }
});

const changeInput = (e, name) => {
  // emit("changeFormOperate", currData);
};

const changeUploadOperate = (imgList: string[]) => {
  console.log("🚀 ~ changeUploadOperate ~ imgList:", imgList);
  // module1.titleImg
  let currData = props.ruleForm;
  currData = {
    ...currData,
    module1: {
      ...currData.module1,
      titleImg: imgList.join(",")
    }
  };
  emit("changeFormOperate", currData);
};
</script>

<template>
  <!-- w-2/4 -->
  <div class="w-3/4 ml-8">
    <el-collapse model-value="1" key="1" accordion>
      <el-collapse-item title="标题：" name="1">
        <el-form-item
          v-for="(item, key, index) in props.ruleForm?.module1?.title"
          :prop="`module1.title.${key}`"
          :key="`module1.title.${key}`"
          :label="`${LangEnum[key]}`"
          :rules="
            ['zh', 'en'].includes(key)
              ? RuleRequireInputTrue
              : RuleRequireInputFalse
          "
        >
          <el-input
            v-model="props.ruleForm.module1.title[key]"
            placeholder="请输入"
            @input="
              e => {
                changeInput(e, 'title');
              }
            "
          />
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
          :rules="
            ['zh', 'en'].includes(key)
              ? RuleRequireInputTrue
              : RuleRequireInputFalse
          "
        >
          <el-input
            type="textarea"
            :autosize="{ minRows: 1, maxRows: 6 }"
            v-model="props.ruleForm.module1.subTitle[key]"
            placeholder="请输入，若需折行请用英文,隔开"
          />
        </el-form-item>
      </el-collapse-item>
    </el-collapse>

    <el-collapse model-value="3" key="3" accordion>
      <el-collapse-item title="标题图片：" name="3">
        <el-form-item
          prop="module1.titleImg"
          key="module1.titleImg"
          label="上传资源："
          :rules="RuleRequireInputTrue"
        >
          <UploadFile @changeUploadOperate="changeUploadOperate" />
          <!-- <el-input v-model="props.ruleForm.module1.titleImg" /> -->
        </el-form-item>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

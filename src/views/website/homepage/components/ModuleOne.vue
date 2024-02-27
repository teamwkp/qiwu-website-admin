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
  LangEnum,
  RuleRequireInputTrue,
  RuleRequireInputFalse
} from "@/enums/selectEnum.ts";

const emit = defineEmits(["changeFormOperate"]);

interface YearReportModuleProps {
  ruleForm: any;
}

const props = withDefaults(defineProps<YearReportModuleProps>(), {
  ruleForm: { desc: "" }
});

const changeInput = (e, name) => {
  // emit("changeFormOperate", currData);
};
</script>

<template>
  <div class="w-2/4 ml-8">
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
    <!-- <el-form-item
      prop="module1.titleImg"
      key="module1.titleImg"
      label="标题图片"
      :rules="RuleRequireInputFalse"
    >
      <el-input v-model="props.ruleForm.module1.titleImg" />
    </el-form-item> -->

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
  </div>
</template>

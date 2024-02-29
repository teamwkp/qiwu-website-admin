<!--
 * @Author       : liqiao
 * @Date         : 2024-02-28 10:11:12
 * @LastEditors  : liqiao
 * @LastEditTime : 2024-02-28 15:37:41
 * @Description  : Do not edit
 * @FilePath     : /qiwu-website-admin/src/views/website/homepage/components/ModuleThree.vue
-->

<script lang="ts" setup>
import RadioProductsPop from './RadioProductsPop.vue';
import { ref } from 'vue';
import { LangEnum, RuleRequireInputTrue, RuleRequireInputFalse } from '@/enums/selectEnum.ts';

interface PropsModel {
  ruleForm: any;
}

const props = withDefaults(defineProps<PropsModel>(), {
  ruleForm: { desc: '' },
});

const isRadioProductsPop = ref(false);

const selectProductOperate = () => {
  isRadioProductsPop.value = true;
};
</script>

<template>
  <div>
    <el-collapse model-value="1" key="1" accordion>
      <el-collapse-item title="主推产品111：" name="1">
        <el-form-item
          prop="module3.indexProduct.id"
          key="module3.indexProduct.id"
          label="选择产品："
          :rules="RuleRequireInputTrue"
        >
          <!-- <div class="flex">
            <div class="mr-2.5">产品一</div>
            <el-button type="primary" @click="selectProductOperate"
              >选择产品</el-button
            >
          </div> -->
          <div v-if="props?.ruleForm?.module3?.indexProduct?.id">产品一</div>
          <div v-if="!props?.ruleForm?.module3?.indexProduct?.id">
            <el-button type="primary" @click="selectProductOperate">选择产品</el-button>
          </div>
        </el-form-item>
      </el-collapse-item>
    </el-collapse>
    <RadioProductsPop :isRadioProductsPop="isRadioProductsPop" />
  </div>
</template>

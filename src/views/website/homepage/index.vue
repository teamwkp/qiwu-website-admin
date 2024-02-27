<!--
 * @Author       : liqiao
 * @Date         : 2024-02-26 16:03:43
 * @LastEditors  : liqiao
 * @LastEditTime : 2024-02-26 20:23:11
 * @Description  : Do not edit
 * @FilePath     : /qiwu-website-admin/src/views/website/homepage/index.vue
-->
<script lang="ts" setup>
import { reactive, ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import ModuleOne from "./components/ModuleOne.vue";

interface RuleForm {
  name: string;
  region: string;
  count: string;
  desc: string;
}

// const formSize = ref("default");
const ruleFormRef = ref<FormInstance>();
const ruleForm = ref<any>({
  module1: {
    title: {
      zh: "",
      en: ""
    },
    subTitle: {
      zh: "",
      en: ""
    },
    titleImg: "",
    backBgImg: ""
  },
  name: "",
  region: "",
  count: "",
  desc: ""
});

const activeNamesCollapse = ref(["1", "2", "3", "4"]);

const changeFormOperate = data => {
  console.log("🚀 ~ changeFormOperate ~ data:", data);
  ruleForm.value = data;
};

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log("submit!");
      console.log("🚀 ~ ruleForm:", ruleForm);
    } else {
      console.log("error submit!", fields);
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>
<template>
  <div class="page-module-view">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>首页</span>
          <!-- <el-button class="button" text>Operation button</el-button> -->
        </div>
      </template>

      <div>
        <!-- :rules="rules":size="formSize" -->

        <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          label-width="120px"
          class="demo-ruleForm"
          status-icon
        >
          <el-collapse v-model="activeNamesCollapse">
            <el-collapse-item title="模块一" name="1">
              <ModuleOne
                :ruleForm="ruleForm"
                @changeFormOperate="changeFormOperate"
              />
            </el-collapse-item>
            <el-collapse-item title="模块二" name="2"> 222 </el-collapse-item>
            <el-collapse-item title="模块三" name="3"> 333 </el-collapse-item>
            <el-collapse-item title="模块四" name="4">
              <el-form-item
                label="Activity name"
                :rules="{
                  required: true,
                  message: '请输入'
                }"
                prop="name"
              >
                <el-input v-model="ruleForm.name" />
              </el-form-item>
              <el-form-item
                label="Activity zone"
                :rules="{
                  required: true,
                  message: '请输入'
                }"
                prop="region"
              >
                <el-select
                  v-model="ruleForm.region"
                  placeholder="Activity zone"
                >
                  <el-option label="Zone one" value="shanghai" />
                  <el-option label="Zone two" value="beijing" />
                </el-select>
              </el-form-item>
            </el-collapse-item>
          </el-collapse>

          <el-form-item>
            <el-button type="primary" @click="submitForm(ruleFormRef)">
              Create
            </el-button>
            <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- <div v-for="o in 4" :key="o" class="text item">{{ "List item " + o }}</div> -->
      <!-- <template #footer>Footer content</template> -->
    </el-card>
  </div>
</template>

<style lang="scss">
.page-module-view {
  .el-collapse {
    /* border-top: none !important; */
    .el-collapse-item__header {
      font-size: 14px;
      border: none !important;
    }
    .el-collapse-item__content {
      padding-bottom: 0;
      .el-collapse:last-child {
        border-bottom: none !important;
      }
    }
  }
}
</style>

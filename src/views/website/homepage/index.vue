<!--
 * @Author       : liqiao
 * @Date         : 2024-02-26 16:03:43
 * @LastEditors  : liqiao
 * @LastEditTime : 2024-02-28 16:09:33
 * @Description  : Do not edit
 * @FilePath     : /qiwu-website-admin/src/views/website/homepage/index.vue
-->
<script lang="ts" setup>
import { ref } from 'vue';
import type { FormInstance } from 'element-plus';
import ModuleOne from './components/ModuleOne.vue';
import ModuleThree from './components/ModuleThree.vue';

// const formSize = ref("default");
const ruleFormRef = ref<FormInstance>();
const ruleForm = ref<any>({
  module1: {
    title: {
      zh: '',
      en: '',
    },
    subTitle: {
      zh: '',
      en: '',
    },
    titleImg: {
      zh: '',
      en: '',
    },
    backBgImg: '',
  },
  module3: {
    indexProduct: { name: '', id: '' },
  },
  // name: {
  //   text:'中文',
  //   key:'对应语言key'
  // },
  name: '',
  nameKey: '',
  region: '',
  count: '',
  desc: '',
});

const activeNamesCollapse = ref(['1', '2', '3', '4']);
// 1:view 2:edit 3:add
const configType = ref(2);

const changeFormOperate = (data) => {
  console.log('🚀 ~ changeFormOperate ~ data:', data);
  ruleForm.value = data;
};

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!');
      console.log('🚀 ~ ruleForm:', ruleForm);
    } else {
      console.log('error submit!', fields);
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

const backOperate = () => {
  configType.value = 1;
};
const editOperate = () => {
  configType.value = 2;
};
</script>
<template>
  <div class="page-module-view">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <div class="card-header__left">
            <span>首页</span>
            <span v-if="Number(configType) === 1">点击编辑按钮即可进行配置</span>
          </div>
          <el-button v-if="Number(configType) === 1" class="button" type="primary" @click="editOperate">编辑</el-button>
        </div>
      </template>
      <div>
        <!-- :rules="rules":size="formSize" -->
        <el-form ref="ruleFormRef" class="rule-form-view" :model="ruleForm" label-width="120px" status-icon>
          <el-collapse v-model="activeNamesCollapse">
            <el-collapse-item title="模块一" name="1">
              <ModuleOne :ruleForm="ruleForm" :configType="configType" @changeFormOperate="changeFormOperate" />
            </el-collapse-item>
            <el-collapse-item title="模块二" name="2">222</el-collapse-item>
            <el-collapse-item title="模块三" name="3">
              <ModuleThree :ruleForm="ruleForm" :configType="configType" @changeFormOperate="changeFormOperate" />
            </el-collapse-item>
            <el-collapse-item title="模块四" name="4">模块四</el-collapse-item>
          </el-collapse>
          <el-affix v-if="Number(configType) === 2" :offset="0" position="bottom">
            <div class="form-bottom-cont">
              <el-form-item>
                <el-button type="primary" @click="submitForm(ruleFormRef)">保存</el-button>
                <el-button @click="resetForm(ruleFormRef)">取消</el-button>
                <el-button @click="backOperate">返回</el-button>
              </el-form-item>
            </div>
          </el-affix>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss">
.page-module-view {
  .box-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      .card-header__left {
        span:nth-child(1) {
          font-size: 16px;
          font-weight: bold;
        }
        span:nth-child(2) {
          margin-left: 20px;
          font-size: 14px;
          color: #666;
        }
      }
    }
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
    .rule-form-view {
      .form-bottom-cont {
        width: 100%;
        background: #fff;
        padding: 20px 0 10px;
      }
    }
  }
}
</style>

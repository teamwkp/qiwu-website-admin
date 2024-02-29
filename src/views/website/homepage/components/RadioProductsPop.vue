<!--
 * @Author       : liqiao
 * @Date         : 2024-02-28 10:04:48
 * @LastEditors  : liqiao
 * @LastEditTime : 2024-02-28 10:22:00
 * @Description  : Do not edit
 * @FilePath     : /qiwu-website-admin/src/views/website/homepage/components/RadioProductsPop.vue
-->

<script lang="ts" setup>
import { ref, reactive } from "vue";
import { VxeTablePropTypes } from "vxe-table";

interface RowVO {
  id: number;
  name: string;
  role: string;
  sex: string;
  age: number;
  address: string;
}

interface PropsModel {
  isRadioProductsPop: boolean;
}

const props = withDefaults(defineProps<PropsModel>(), {
  isRadioProductsPop: false
});

const tableData = ref<RowVO[]>([
  {
    id: 10001,
    name: "Test1",
    role: "Develop",
    sex: "Man",
    age: 28,
    address: "test abc"
  },
  {
    id: 10002,
    name: "Test2",
    role: "Test",
    sex: "Women",
    age: 22,
    address: "Guangzhou"
  },
  {
    id: 10003,
    name: "Test3",
    role: "PM",
    sex: "Man",
    age: 32,
    address: "Shanghai"
  },
  {
    id: 10004,
    name: "Test4",
    role: "Designer",
    sex: "Women",
    age: 23,
    address: "test abc"
  },
  {
    id: 10005,
    name: "Test5",
    role: "Develop",
    sex: "Women",
    age: 30,
    address: "Shanghai"
  },
  {
    id: 10006,
    name: "Test6",
    role: "Designer",
    sex: "Women",
    age: 21,
    address: "test abc"
  },
  {
    id: 10007,
    name: "Test7",
    role: "Test",
    sex: "Man",
    age: 29,
    address: "test abc"
  },
  {
    id: 10008,
    name: "Test8",
    role: "Develop",
    sex: "Man",
    age: 35,
    address: "test abc"
  }
]);

const radioConfig = reactive<VxeTablePropTypes.RadioConfig<RowVO>>({
  checkRowKey: 10002
});


</script>

<template>
  <el-dialog v-model="props.isRadioProductsPop" title="选择产品" width="600">
    <vxe-table
      border
      height="300"
      :row-config="{ keyField: 'id' }"
      :data="tableData"
      :radio-config="radioConfig"
    >
      <vxe-column type="radio" width="60" />
      <vxe-column field="id" title="ID" />
      <vxe-column field="name" title="Name" />
      <vxe-column field="sex" title="Sex" />
      <vxe-column field="address" title="Address" show-overflow />
    </vxe-table>
  </el-dialog>
</template>

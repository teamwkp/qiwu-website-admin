<!--
 * @Author       : liqiao
 * @Date         : 2024-02-26 15:40:53
 * @LastEditors  : liqiao
 * @LastEditTime : 2024-02-29 19:39:38
 * @Description  : Do not edit
 * @FilePath     : /qiwu.frontend.admin/src/views/device/product-specifications-list.vue
-->

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { VXETable } from 'vxe-table';
import XEUtils from 'xe-utils';

import { MultiLanguageConfigListApi } from '@/api/multilingual.ts';
// import VxeTableSelectTags from '@/components/Communal/VxeTableSelectTags.vue';
import ConfigForm from './components/ConfigForm.vue';
import { MultilingualConfigTypeDict, MultilingualConfigLangList } from '@/enums/selectEnum.ts';

// import { useRouter } from '@/router/index';
// const router = useRouter();

const isFormVisible = ref(false);
const selectItem = ref(null);
const tableParams = ref(null);

const xGrid = ref();
const gridOptions = reactive({
  border: true,
  showHeaderOverflow: true,
  showOverflow: true,
  keepSource: true,
  id: 'translation_list',
  // height: 600,
  rowConfig: {
    keyField: 'id',
    isHover: true,
    maxHeight: 80,
    // height: 100,
  },
  columnConfig: {
    resizable: true,
  },
  customConfig: {
    storage: true,
    checkMethod({ column }) {
      if (['nickname', 'role'].includes(column.field)) {
        return false;
      }
      return true;
    },
  },
  type: 'expand',
  expandConfig: {
    // expandAll: true,
    // expandRowKeys: 'id',
    // isRowExpandByRow: true,
    rowField: 'id',
    // expandAll: true,
    // reserve: true,
  },
  sortConfig: {
    trigger: 'cell',
    remote: true,
  },
  filterConfig: {
    remote: true,
  },
  pagerConfig: {
    enabled: true,
    // currentPage: 1,
    pageSize: 10,
    pageSizes: [5, 10, 15, 20, 50, 100, 200, 500, 1000],
  },
  formConfig: {
    titleWidth: 100,
    titleAlign: 'right',
    items: [
      {
        field: 'keyword',
        title: '值',
        span: 8,
        // titlePrefix: { message: '名称', icon: 'vxe-icon-question-circle-fill' },
        itemRender: { name: '$input', props: { placeholder: '请输入值' } },
      },

      {
        span: 24,
        align: 'right',
        // collapseNode: true,
        itemRender: {
          name: '$buttons',
          children: [
            { props: { type: 'submit', content: '搜索', status: 'primary' } },
            { props: { type: 'reset', content: '重置' } },
          ],
        },
      },
    ],
  },
  toolbarConfig: {
    // buttons: [
    //   { code: "insert_actived", name: "新增" },
    //   { code: "delete", name: "直接删除" },
    //   { code: "mark_cancel", name: "删除/取消" },
    //   { code: "save", name: "app.body.button.save", status: "success" },
    // ],
    refresh: true,
    // import: true,
    // TODO：导出
    // export: true,
    print: false,
    zoom: true,
    custom: true, // 显示自定义列按钮
    slots: {
      buttons: 'toolbar_buttons',
      // tools: "toolbar_tools",
    },
  },
  proxyConfig: {
    seq: true,
    // sort: true,
    // filter: true,
    form: true,
    props: {
      // 对应响应结果 Promise<{ result: [], page: { total: 100 } }>
      result: 'result',
      // total: "page.total", // 配置响应结果总页数字段
      total: 'total', // 配置响应结果总页数字段
    },
    // 只接收Promise，具体实现自由发挥
    ajax: {
      // 当点击工具栏查询按钮或者手动提交指令 query或reload 时会被触发
      query: async ({ page, sorts, filters, form }) => {
        let queryParams = Object.assign({}, form);
        // 处理排序条件
        const firstSort = sorts[0];
        if (firstSort) {
          queryParams.sort = firstSort.field;
          queryParams.order = firstSort.order;
        }
        // 处理筛选条件
        filters.forEach(({ field, values }) => {
          queryParams[field] = values.join(',');
        });
        queryParams = {
          ...queryParams,
          pageSize: page.pageSize,
          pageIndex: page.currentPage,
        };
        tableParams.value = queryParams;
        // console.log('🚀 ~ filters.forEach ~ filters:', queryParams);
        // console.log('🚀 ~ XEUtils.serialize(queryParams):', XEUtils.serialize(queryParams));
        return getDataOperate(queryParams);
      },
    },
  },
  columns: [
    {
      type: 'expand',
      title: '查看多语言',
      width: 100,
      slots: { content: 'expand_cont' },
    },
    // {
    //   field: "name",
    //   title: "Name",
    //   sortable: true,
    //   titlePrefix: { message: "名称必须填写！" },
    //   editRender: { name: "input", attrs: { placeholder: "请输入名称" } },
    // },
    {
      field: 'configKey',
      title: 'key',
    },
    {
      field: 'configValueZh',
      title: '值',
      slots: { default: 'configValueZh_default' },
    },
    // TODO：
    {
      field: 'type',
      title: '类型',
      slots: { default: 'type_default' },
    },
    {
      field: 'remark',
      title: '描述',
    },

    {
      field: 'creatorName',
      title: '创建人',
    },
    { field: 'createTime', title: '创建时间' },

    {
      field: 'operate',
      title: '操作',
      width: 110,
      // visible: false,
      // sortable: true,
      slots: { default: 'operate_default' },
    },
  ],

  editRules: {
    name: [
      { required: true, message: 'app.body.valid.rName' },
      { min: 3, max: 50, message: '名称长度在 3 到 50 个字符' },
    ],
    email: [{ required: true, message: '邮件必须填写' }],
    role: [{ required: true, message: '角色必须填写' }],
  },
  editConfig: {
    trigger: 'click',
    mode: 'row',
    showStatus: true,
  },
});
// TODO:是否需要
const gridEvent = {
  proxyQuery() {
    console.log('数据代理查询事件');
  },
  proxyDelete() {
    console.log('数据代理删除事件');
  },
  proxySave() {
    console.log('数据代理保存事件');
  },
};

const getDataOperate = async (queryParams) => {
  const res = await MultiLanguageConfigListApi(queryParams);

  let currData = {
    result: [],
    total: 0,
  };

  if (Number(res.code) === 0) {
    const result = res.data;
    // const currList = result.rows?.map((item) => ({ ...item, children: [1, 2, 3] }));
    const currList = result.rows;
    currData['result'] = currList;
    currData['total'] = result.total;
  }

  return currData;
};

const triggerAddOperate = () => {
  console.log('🚀 ~ triggerAddOperate ~ triggerAddOperate:');
  selectItem.value = null;
  isFormVisible.value = true;
};

const tableEditOperate = (row) => {
  selectItem.value = row;
  isFormVisible.value = true;
};

const tableDeleteOperate = async (row) => {
  // type: confirm cancel
  // const type = await VXETable.modal.confirm('您确定要删除吗？');
  // if (type === 'confirm') {
  //   const res = await ProductManualDelete({ id: row.id });
  //   if (Number(res.code) === 0) {
  //     reloadOperate();
  //     VXETable.modal.message({ content: `操作成功`, status: 'success' });
  //   }
  // }
};

const tableViewOperate = (row) => {
  // router.push(`/device/specifications-detail-list?mpid=${row.id}&productName=${row.name}`);
};

const formOperate = (isReset) => {
  isFormVisible.value = false;
  if (isReset) {
    reloadOperate();
  }
};

const reloadOperate = async () => {
  const currData = await getDataOperate(tableParams.value);
  xGrid.value.loadData(currData.result);
};
</script>

<template>
  <div class="app-container">
    <vxe-grid ref="xGrid" v-bind="gridOptions" v-on="gridEvent">
      <!--将表单放在工具栏中-->
      <template #toolbar_buttons>
        <vxe-button status="primary" @click="triggerAddOperate">新增</vxe-button>
        <!-- <vxe-button status="primary" @click="triggerProofreadOperate">人工校对</vxe-button>
        <vxe-button @click="triggerProxy('reload')">重置条件并重载</vxe-button>
        <vxe-button @click="triggerProxy('mark_cancel')">删除/取消</vxe-button> -->
      </template>

      <template #expand_cont="{ row, rowIndex }">
        <div class="vxe-table-expand-view">
          <el-descriptions v-if="[1, 5].includes(row.type)" title="多语言">
            <el-descriptions-item v-for="item in MultilingualConfigLangList" :label="`${item.name}：`">
              <span v-if="row[item.key]">{{ row[item.key] }}</span>
              <span v-else>-</span>
            </el-descriptions-item>
          </el-descriptions>
          <el-descriptions v-if="[3].includes(row.type)" title="多语言">
            <el-descriptions-item v-for="item in MultilingualConfigLangList" :label="`${item.name}：`">
              <el-image
                v-if="row[item.key]"
                style="width: 80px"
                :src="row[item.key]"
                :preview-src-list="[row[item.key]]"
              ></el-image>
              <span v-else>-</span>
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </template>
      <template #configValueZh_default="{ row }">
        <el-image
          v-if="[3, 4].includes(row.type)"
          style="width: 80px"
          :src="row.configValueZh"
          :preview-src-list="[row.configValueZh]"
        ></el-image>
        <el-link v-else-if="row.type === 5" :href="row.configValueZh" target="_blank">{{ row.configValueZh }}</el-link>
        <span v-else>{{ row.configValueZh }}</span>
      </template>
      <template #type_default="{ row }">
        {{ MultilingualConfigTypeDict[row.type]?.name }}
        <!-- <VxeTableSelectTags :value="row.type" :enumDict="ProductManualTypeDict" /> -->
      </template>

      <template #operate_default="{ row }">
        <vxe-button type="text" key="edit" status="primary" @click="tableEditOperate(row)">编辑</vxe-button>
        <!-- <vxe-button type="text" key="delete" status="danger" @click="tableDeleteOperate(row)">删除</vxe-button> -->
      </template>
    </vxe-grid>
    <ConfigForm
      v-if="isFormVisible"
      :isFormVisible="isFormVisible"
      :selectItem="selectItem"
      @formOperate="formOperate"
    />
  </div>
</template>

<!--
 * @Author       : liqiao
 * @Date         : 2024-02-26 15:40:53
 * @LastEditors  : liqiao
 * @LastEditTime : 2024-02-29 19:39:38
 * @Description  : Do not edit
 * @FilePath     : /qiwu.frontend.admin/src/views/device/product-specifications-list.vue
-->

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { VXETable } from 'vxe-table';

import ConfigForm from './components/ConfigForm.vue';
import { ProductCategoryNavStatusDict } from '@/enums/selectEnum.ts';
import { ProductCategoryListApi, ProductCategoryDeleteCategoryApi } from '@/api/commodity';

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
    pageSize: 10,
    pageSizes: [5, 10, 15, 20, 50, 100, 200, 500, 1000],
  },
  formConfig: {
    titleWidth: 100,
    titleAlign: 'right',
    items: [
      {
        field: 'name',
        title: '分类名称',
        span: 8,
        itemRender: { name: '$input', props: { placeholder: '请输入分类名称' } },
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
    refresh: true,
    print: false,
    zoom: true,
    custom: true, // 显示自定义列按钮
    slots: {
      buttons: 'toolbar_buttons',
    },
  },
  proxyConfig: {
    seq: true,
    form: true,
    props: {
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
        return getDataOperate(queryParams);
      },
    },
  },
  columns: [
    // {
    //   type: 'expand',
    //   title: '查看多语言',
    //   width: 100,
    //   slots: { content: 'expand_cont' },
    // },
    {
      field: 'id',
      title: 'ID',
    },
    {
      field: 'name',
      title: '分类名称',
    },

    {
      field: 'navStatus',
      title: '显示导航栏',
      slots: { default: 'navStatus_default' },
    },
    {
      field: 'sort',
      title: '排序',
    },
    {
      field: 'description',
      title: '分类描述',
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

const getDataOperate = async (queryParams) => {
  const res = await ProductCategoryListApi(queryParams);

  let currData = {
    result: [],
    total: 0,
  };

  if (Number(res.code) === 0) {
    const result = res.data;
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
  console.log('🚀 ~ tableEditOperate ~ tableEditOperate:', row);
  selectItem.value = row;
  isFormVisible.value = true;
};

const tableDeleteOperate = async (row) => {
  // type: confirm cancel
  const type = await VXETable.modal.confirm('您确定要删除吗？');
  if (type === 'confirm') {
    const res = await ProductCategoryDeleteCategoryApi({ ids: [row.id] });
    if (Number(res.code) === 0) {
      reloadOperate();
      VXETable.modal.message({ content: `操作成功`, status: 'success' });
    }
  }
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
    <vxe-grid ref="xGrid" v-bind="gridOptions">
      <!--将表单放在工具栏中-->
      <template #toolbar_buttons>
        <vxe-button status="primary" @click="triggerAddOperate">新增</vxe-button>
      </template>

      <template #navStatus_default="{ row }">
        {{ ProductCategoryNavStatusDict[row.navStatus]?.name }}
        <!-- <VxeTableSelectTags :value="row.type" :enumDict="ProductManualTypeDict" /> -->
      </template>

      <template #operate_default="{ row }">
        <vxe-button type="text" key="edit" status="primary" @click="tableEditOperate(row)">编辑</vxe-button>
        <vxe-button type="text" key="delete" status="danger" @click="tableDeleteOperate(row)">删除</vxe-button>
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

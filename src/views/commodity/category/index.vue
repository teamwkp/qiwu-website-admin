<!--
 * @Author       : liqiao
 * @Date         : 2024-02-02 14:59:41
 * @LastEditors  : liqiao
 * @LastEditTime : 2024-02-19 17:11:17
 * @Description  : Do not edit
 * @FilePath     : /qiwu.frontend.admin/src/views/translation/translationList.vue
-->
<script setup>
import { onMounted, reactive, ref } from 'vue';
import { VXETable } from 'vxe-table';
import XEUtils from 'xe-utils';

import { ProductCategoryListApi } from '@/api/commodity';
import { NavStatusList } from '@/enums/selectEnum';
// import KeyForm from './components/KeyForm';
// import ManualCheck from './components/ManualCheck';

const isKeyFormRef = ref(false);
const isManualCheckRef = ref(false);

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
  printConfig: {
    columns: [{ field: 'name' }, { field: 'email' }, { field: 'nickname' }, { field: 'age' }, { field: 'amount' }],
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
      // {
      //   field: 'sex',
      //   title: '项目',
      //   span: 8,
      //   // folding: true,
      //   // titleSuffix: { message: "注意，必填信息！", icon: "vxe-icon-question-circle-fill" },
      //   itemRender: {
      //     name: '$select',
      //     options: [
      //       { label: '男', value: '1' },
      //       { label: '女', value: '0' },
      //     ],
      //   },
      // },

      {
        field: 'name',
        title: '分类名称',
        span: 8,
        // titlePrefix: { message: "名称", icon: "vxe-icon-question-circle-fill" },
        itemRender: { name: '$input', props: { placeholder: '请输入名称' } },
      },

      // {
      //   field: 'sort',
      //   title: '排序',
      //   span: 8,
      //   // folding: true,
      //   // titleSuffix: { message: "注意，必填信息！", icon: "vxe-icon-question-circle-fill" },
      //   // itemRender: { name: '$select', options: [] },
      // },

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
        console.log('🚀 ~ query: ~ page, sorts, filters, form:', page, sorts, filters, form);
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
          pageSize: page?.pageSize,
          pageNum: page?.currentPage,
        };
        // console.log('🚀 ~ filters.forEach ~ filters:', queryParams);
        // console.log('🚀 ~ XEUtils.serialize(queryParams):', XEUtils.serialize(queryParams));
        return getDataOperate(queryParams);
        // return {
        //   result: [],
        //   total: 0,
        // };
      },
      // TODO：不需要
      // 当点击工具栏删除按钮或者手动提交指令 delete 时会被触发
      // delete: ({ body }) => {
      //   return fetch(`${serveApiUrl}/api/pub/save`, {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify(body),
      //   }).then((response) => response.json());
      // },
      // TODO：不需要
      // 当点击工具栏保存按钮或者手动提交指令 save 时会被触发
      // save: ({ body }) => {
      //   return fetch(`${serveApiUrl}/api/pub/save`, {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify(body),
      //   }).then((response) => response.json());
      // },
    },
  },
  columns: [
    // { type: "checkbox", title: "ID", width: 120 },
    // {
    //   field: "name",
    //   title: "Name",
    //   sortable: true,
    //   titlePrefix: { message: "名称必须填写！" },
    //   editRender: { name: "input", attrs: { placeholder: "请输入名称" } },
    // },

    {
      field: 'name',
      title: '分类名称',
    },
    {
      field: 'description',
      title: '描述',
    },
    {
      field: 'navStatus',
      title: '是否显示',
      // filters: NavStatusList,
      filters: [
        { label: '男', value: 1 },
        { label: '女', value: 0 },
      ],
      // editRender: { name: '$select', options: [], props: { placeholder: '请选择性别' } },
    },
    {
      field: 'sort',
      title: '排序',
    },
    {
      field: 'creatorName',
      title: '创建人',
    },
    {
      field: 'createTime',
      title: '创建时间',
    },

    {
      field: 'operate',
      title: '操作',
      width: 120,
      // visible: false,
      // sortable: true,
      slots: { default: 'operate_default' },
    },
  ],
  // importConfig: {
  //   remote: true,
  //   types: ["xlsx"],
  //   modes: ["insert"],
  //   // 自定义服务端导入
  //   importMethod({ file }) {
  //     const $grid = xGrid.value;
  //     const formBody = new FormData();
  //     formBody.append("file", file);
  //     return fetch(`${serveApiUrl}/api/pub/import`, { method: "POST", body: formBody })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         VXETable.modal.message({ content: `成功导入 ${data.result.insertRows} 条记录！`, status: "success" });
  //         // 导入完成，刷新表格
  //         if ($grid) {
  //           $grid.commitProxy("query");
  //         }
  //       })
  //       .catch(() => {
  //         VXETable.modal.message({ content: "导入失败，请检查数据是否正确！", status: "error" });
  //       });
  //   },
  // },
  // TODO：导出
  // exportConfig: {
  //   remote: true,
  //   types: ['xlsx'],
  //   modes: ['current', 'selected', 'all'],
  //   // 自定义服务端导出
  //   exportMethod({ options }) {
  //     const $grid = xGrid.value;
  //     if ($grid) {
  //       const proxyInfo = $grid.getProxyInfo();
  //       // 传给服务端的参数
  //       const body = {
  //         filename: options.filename,
  //         sheetName: options.sheetName,
  //         isHeader: options.isHeader,
  //         original: options.original,
  //         mode: options.mode,
  //         pager: proxyInfo ? proxyInfo.pager : null,
  //         ids: options.mode === 'selected' ? options.data.map((item) => item.id) : [],
  //         fields: options.columns.map((column) => {
  //           return {
  //             field: column.field,
  //             title: column.title,
  //           };
  //         }),
  //       };
  //       // 开始服务端导出
  //       return fetch(`${serveApiUrl}/api/pub/export`, {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify(body),
  //       })
  //         .then((response) => response.json())
  //         .then((data) => {
  //           if (data.id) {
  //             VXETable.modal.message({ content: '导出成功，开始下载', status: 'success' });
  //             // 读取路径，请求文件
  //             fetch(`${serveApiUrl}/api/pub/export/download/${data.id}`).then((response) => {
  //               response.blob().then((blob) => {
  //                 // 开始下载
  //                 VXETable.saveFile({ filename: '导出数据', type: 'xlsx', content: blob });
  //               });
  //             });
  //           }
  //         })
  //         .catch(() => {
  //           VXETable.modal.message({ content: '导出失败！', status: 'error' });
  //         });
  //     }
  //     return Promise.resolve();
  //   },
  // },
  // 多选
  // checkboxConfig: {
  //   labelField: "id",
  //   reserve: true,
  //   highlight: true,
  //   range: true,
  // },
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
onMounted(() => {
  // const sexList = [
  //   { label: "女", value: "0" },
  //   { label: "男", value: "1" },
  // ];
  // const { formConfig, columns } = gridOptions;
  // if (columns) {
  //   const sexColumn = columns[5];
  //   if (sexColumn && sexColumn.editRender) {
  //     // 搜索下拉框赋值
  //     sexColumn.editRender.options = sexList;
  //   }
  // }
  // if (formConfig && formConfig.items) {
  //   const sexItem = formConfig.items[4];
  //   if (sexItem && sexItem.itemRender) {
  //     sexItem.itemRender.options = sexList;
  //   }
  // }
});

const getDataOperate = async (params) => {
  console.log('🚀 ~ getDataOperate ~ params:', params);
  const res = await ProductCategoryListApi(params);

  const currData = {
    result: [],
    total: 0,
  };

  if (Number(res.code) === 0) {
    const result = res.data;
    currData['result'] = result.rows;
    currData['total'] = result.total;
  }

  return currData;
};

const triggerAddOperate = () => {
  isKeyFormRef.value = true;
};

const keyFormCallback = (isShow) => {
  isKeyFormRef.value = isShow;
};

const triggerProofreadOperate = () => {
  isManualCheckRef.value = true;
};

const manualCheckCallback = (isShow) => {
  isManualCheckRef.value = isShow;
};

const tableEditOperate = (row) => {
  console.log('🚀 ~ tableEditOperate ~ tableEditOperate:', row);
};

const tableDeleteOperate = (row) => {
  console.log('🚀 ~ tableDeleteOperate ~ tableDeleteOperate:', row);
};
</script>
<template>
  <div class="app-container">
    <vxe-grid ref="xGrid" v-bind="gridOptions" v-on="gridEvent">
      <!--将表单放在工具栏中-->
      <template #toolbar_buttons>
        <vxe-button status="primary" @click="triggerAddOperate">新增分类</vxe-button>
        <!-- <vxe-button status="primary" @click="triggerProofreadOperate">人工校对</vxe-button> -->
        <!-- <vxe-button @click="triggerProxy('reload')">重置条件并重载</vxe-button>
        <vxe-button @click="triggerProxy('mark_cancel')">删除/取消</vxe-button> -->
      </template>
      <template #operate_default="{ row }">
        <vxe-button type="text" key="edit" status="primary" @click="tableEditOperate(row)">编辑</vxe-button>
        <vxe-button type="text" key="delete" status="danger" @click="tableDeleteOperate(row)">删除</vxe-button>
      </template>
    </vxe-grid>
    <!-- <KeyForm :isKeyFormRef="isKeyFormRef" @keyFormCallback="keyFormCallback" />
    <ManualCheck :isManualCheckRef="isManualCheckRef" @manualCheckCallback="manualCheckCallback" /> -->
  </div>
</template>

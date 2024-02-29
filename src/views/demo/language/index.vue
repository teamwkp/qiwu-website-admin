<script setup>
import { reactive, ref } from 'vue';

const form = reactive({
  str: '',
});
const tableData = ref([
  {
    key: 'PAGEABC',
    value: '专业数据分析APP',
    des: '这是放在首页的一行文字',
    type: '字符串',
    create_time: '2024/2/29 18:59',
    update_time: '2024/2/29 19:11',
    language: [
      {
        lan: 'zh',
        trans: '简中',
        value: '专业数据分析APP',
      },
      {
        lan: 'en',
        trans: '英文',
        value: 'Professional data analysis APP',
      },
      {
        lan: 'ja',
        trans: '日语',
        value: '',
      },
      {
        lan: 'ko',
        trans: '韩语',
        value: '',
      },
      {
        lan: 'es',
        trans: '西语',
        value: '',
      },
      {
        lan: 'pt',
        trans: '葡语',
        value: '',
      },
      {
        lan: 'ru',
        trans: '俄语',
        value: '',
      },
      {
        lan: 'fr',
        trans: '法语',
        value: '',
      },
      {
        lan: 'pl',
        trans: '波兰语',
        value: '',
      },
      {
        lan: 'de',
        trans: '德语',
        value: '',
      },
      {
        lan: 'it',
        trans: '意语',
        value: '',
      },
    ],
  },
  {
    key: 'PAGEMKE',
    value: 'https://arsizes.com/de_de.png',
    des: '这是放在首页的一行文字2',
    type: '图片',
    create_time: '2024/2/29 18:59',
    update_time: '2024/2/29 19:11',
    language: [
      {
        lan: 'zh',
        trans: '简中',
        value: 'https://arsizes.com/de_de.png',
      },
      {
        lan: 'en',
        trans: '英文',
        value: 'Professional data analysis APP',
      },
      {
        lan: 'ja',
        trans: '日语',
        value: '',
      },
      {
        lan: 'ko',
        trans: '韩语',
        value: '',
      },
      {
        lan: 'es',
        trans: '西语',
        value: '',
      },
      {
        lan: 'pt',
        trans: '葡语',
        value: '',
      },
      {
        lan: 'ru',
        trans: '俄语',
        value: '',
      },
      {
        lan: 'fr',
        trans: '法语',
        value: '',
      },
      {
        lan: 'pl',
        trans: '波兰语',
        value: '',
      },
      {
        lan: 'de',
        trans: '德语',
        value: '',
      },
      {
        lan: 'it',
        trans: '意语',
        value: '',
      },
    ],
  },
  {
    key: 'PAGEYUHJ',
    value: 'https://arsizes.com/igort2.mp4',
    des: '这是放在首页的一个视频',
    type: '视频',
    create_time: '2024/2/29 18:59',
    update_time: '2024/2/29 19:11',
    language: [
      {
        lan: 'zh',
        trans: '简中',
        value: 'https://arsizes.com/igort2.mp4',
      },
      {
        lan: 'en',
        trans: '英文',
        value: 'Professional data analysis APP',
      },
      {
        lan: 'ja',
        trans: '日语',
        value: '',
      },
      {
        lan: 'ko',
        trans: '韩语',
        value: '',
      },
      {
        lan: 'es',
        trans: '西语',
        value: '',
      },
      {
        lan: 'pt',
        trans: '葡语',
        value: '',
      },
      {
        lan: 'ru',
        trans: '俄语',
        value: '',
      },
      {
        lan: 'fr',
        trans: '法语',
        value: '',
      },
      {
        lan: 'pl',
        trans: '波兰语',
        value: '',
      },
      {
        lan: 'de',
        trans: '德语',
        value: '',
      },
      {
        lan: 'it',
        trans: '意语',
        value: '',
      },
    ],
  },
]);

const dialogFormVisible = ref(false);
const addForm = reactive({
  str: '',
  type: 'str',
  des: '',
});
const onAdd = () => {
  dialogFormVisible.value = true;
};
const confirmAdd = () => {
  if (addForm.type == 'str') {
    let temp = {
      key: 'PAGEOBX',
      value: addForm.str,
      des: '这是放在首页的第二行文字',
      type: '字符串',
      create_time: '2024/2/29 19:59',
      update_time: '2024/2/29 20:11',
      language: [
        {
          lan: 'zh',
          trans: '简中',
          value: '',
        },
        {
          lan: 'en',
          trans: '英文',
          value: 'hello',
        },
        {
          lan: 'ja',
          trans: '日语',
          value: '',
        },
        {
          lan: 'ko',
          trans: '韩语',
          value: '',
        },
        {
          lan: 'es',
          trans: '西语',
          value: '',
        },
        {
          lan: 'pt',
          trans: '葡语',
          value: '',
        },
        {
          lan: 'ru',
          trans: '俄语',
          value: '',
        },
        {
          lan: 'fr',
          trans: '法语',
          value: '',
        },
        {
          lan: 'pl',
          trans: '波兰语',
          value: '',
        },
        {
          lan: 'de',
          trans: '德语',
          value: '',
        },
        {
          lan: 'it',
          trans: '意语',
          value: '',
        },
      ],
    };
    tableData.value.push(temp);
  }
  addForm.str = '';
  addForm.type = 'str';
  dialogFormVisible.value = false;
};
const fileList = ref([
  {
    name: 'food.jpeg',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  },
]);
const fileList2 = ref([
  {
    name: 'igort2.mp4',
    url: 'https://arsizes.com/igort2.mp4',
  },
]);
</script>

<template>
  <div style="background-color: #fff; padding-top: 30px">
    <el-form
      style="border-bottom: 1px solid #eee; display: flex; align-items: center; justify-content: space-between"
      :inline="true"
      :model="form"
      label-width="80px"
    >
      <div>
        <el-form-item label="值">
          <el-input v-model="form.str" placeholder="模糊查询" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </div>
      <div>
        <el-form-item>
          <el-button type="primary" @click="onAdd">新建</el-button>
        </el-form-item>
      </div>
    </el-form>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="expand">
        <template #default="props">
          <div style="display: flex; flex-wrap: wrap">
            <div
              v-for="(item, index) in props.row.language"
              :key="index"
              style="width: 450px; display: flex; align-items: center; padding: 10px 30px; box-sizing: border-box"
            >
              <div style="width: 80px; margin-right: 10px">{{ item.trans }}({{ item.lan }})</div>
              <el-input
                v-if="props.row.type == '字符串'"
                :rows="2"
                type="textarea"
                style="width: 300px"
                v-model="item.value"
              />
              <el-upload
                v-if="props.row.type == '图片'"
                v-model:file-list="fileList"
                class="upload-demo"
                action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                list-type="picture"
              >
                <el-button type="primary">上传图片</el-button>
                <template #tip>
                  <div class="el-upload__tip">jpg/png files with a size less than 500kb</div>
                </template>
              </el-upload>
              <el-upload
                v-if="props.row.type == '视频'"
                v-model:file-list="fileList2"
                class="upload-demo"
                action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                :limit="1"
              >
                <el-button type="primary">上传视频</el-button>
                <template #tip>
                  <div class="el-upload__tip">mp4 files with a size less than 500KB.</div>
                </template>
              </el-upload>
            </div>
            <div style="width: 450px; display: flex; align-items: center; justify-content: start; padding-left: 30px">
              <el-button v-if="props.row.type == '图片' || props.row.type == '视频'" type="primary" @click="onSubmit">
                同步所有语言
              </el-button>
              <el-button type="primary" @click="onSubmit">更新</el-button>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="key" disabled label="key" width="130" />
      <el-table-column prop="value" disabled label="值" />
      <el-table-column prop="type" disabled label="类型" />
      <el-table-column prop="des" disabled label="描述" />
      <el-table-column prop="create_time" disabled label="创建时间" />
      <el-table-column prop="update_time" disabled label="修改时间" />
    </el-table>
  </div>

  <el-dialog v-model="dialogFormVisible" title="新增" width="500">
    <el-form :model="addForm">
      <el-form-item label="类型" label-width="80">
        <el-select v-model="addForm.type">
          <el-option label="单行字符串" value="str" />
          <el-option label="富文本" value="markdown" />
          <el-option label="图片" value="pic" />
          <el-option label="视频" value="video" />
        </el-select>
      </el-form-item>
      <el-form-item label="字段值" label-width="80">
        <el-input v-if="addForm.type == 'str'" v-model="addForm.str" autocomplete="off" />
        <el-input
          v-if="addForm.type == 'markdown'"
          :rows="2"
          type="textarea"
          placeholder="此处其实是富文本"
          v-model="addForm.des"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="描述" label-width="80">
        <el-input :rows="2" type="textarea" v-model="addForm.des" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAdd">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped></style>

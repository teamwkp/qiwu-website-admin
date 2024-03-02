<!--
 * @Author       : liqiao
 * @Date         : 2024-02-27 09:39:52
 * @LastEditors  : liqiao
 * @LastEditTime : 2024-02-28 16:16:28
 * @Description  : Do not edit
 * @FilePath     : /qiwu-website-admin/src/components/QiwuUpload/UploadFile.vue
-->

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { Plus } from '@element-plus/icons-vue';

import { ElLoading, type UploadProps, type UploadUserFile, ElMessage } from 'element-plus';
import { postUploadOss } from '@/api/common/index';

interface PropsModel {
  modelValue?: string; // 接受外部v-model传入的值,记录的AttachGUID值
  data?: Record<string, any>; //上传时附带的额外参数: {a:b}
  headers?: Headers | Record<string, any>; //设置上传的请求头部
  listType?: 'text' | 'picture' | 'picture-card'; //文件列表的类型
  multiple?: boolean; // 是否支持多选文件
  limit?: number; // 最大允许上传个数
  fileSize?: number; // 大小限制(MB)
  fileTypeList?: any[]; // 文件类型, 例如['png', 'jpg', 'jpeg']
  accept?: string;
  isShowTip?: boolean; // 是否显示提示
  lang?: string; // 语言
  reminderCont: string; // 上传文件的额外提示
  // changeUploadOperate: (imgList:string[]) => {};
  // showFileList?: boolean; //是否显示文件列表
  // withCredentials?: boolean; //支持发送 cookie 凭证信息
  // isAvatarUpload?: boolean; // 是否是头像上传
  // drag?: boolean; //是否启用拖拽上传
  // buttonText?: string; //按钮文本
  // disabled?: boolean; // 是否禁用
}

const emit = defineEmits(['changeUploadOperate']);

const props = withDefaults(defineProps<PropsModel>(), {
  listType: 'picture-card',
  multiple: false,
  limit: 1,
  fileSize: 2, //MB
  fileTypeList: ['bmp', 'gif', 'jpg', 'jpeg', 'png'],
  accept: 'image/*',
  isShowTip: true,
  lang: '',
});

const fileList = ref<UploadUserFile[]>([
  // {
  //   name: "food.jpeg",
  //   url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
  // },
  // {
  //   name: "plant-1.png",
  //   url: "/images/plant-1.png"
  // }
]);

const dialogImageUrl = ref('');
const dialogVisible = ref(false);

// 是否显示上传提示
const showTip = ref(props.fileTypeList?.length > 0 || props.fileSize);
const isShowAddBtn = ref(true);

onMounted(() => {
  emit('changeUploadOperate', ['1111'], props?.lang);
});

// 上传前校验
const handleBeforeUpload = (file) => {
  // 格式是否正确
  if (props.fileTypeList.length) {
    const fileName = file.name.split('.');
    const fileExt = fileName[fileName.length - 1];
    console.log('🚀 ~ handleBeforeUpload ~ fileExt:', fileExt);
    const isTypeOk = props.fileTypeList.indexOf(fileExt) >= 0;
    if (!isTypeOk) {
      ElMessage({
        message: `文件格式不正确, 请上传${props.fileTypeList.join('/')}格式文件`,
        type: 'warning',
      });

      return false;
    }
  }

  // 文件大小判断
  if (props.fileSize) {
    const isLt = file.size / 1024 / 1024 < props.fileSize;
    if (!isLt) {
      ElMessage({
        message: `上传文件大小不能超过 ${props.fileSize} MB`,
        type: 'warning',
      });
      return false;
    }
  }
  return true;
};

const getFormData = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('uploadType', 'HOME');
  return formData;
};

// 文件上传
const uploadImg = async (file) => {
  const loading = ElLoading.service({
    lock: true,
    text: '上传中',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  const params = getFormData(file.file);

  // 上传接口
  const res = await postUploadOss(params);
  if (Number(res.code) === 0) {
    const fileData = res.data;

    // 文件url
    let current: any = fileList.value.find((z) => z.uid == file.file.uid);
    current.uploadUrl = fileData.url;

    fileList.value = fileList?.value?.map((item: any) => {
      return item.uploadUrl;
    });
    console.log('🚀 ~ uploadImg ~ fileList.value?.length >= props?.limit:', fileList.value?.length >= props?.limit);

    if (fileList.value?.length >= props?.limit) {
      isShowAddBtn.value = false;
    } else {
      isShowAddBtn.value = true;
    }
    console.log('🚀 ~ uploadImg ~ isShowAddBtn.value:', isShowAddBtn.value);

    emit('changeUploadOperate', [fileData.url], props?.lang);
  } else {
    // TODO:
    // remove(fileList.value, z => z.uid == file.file.uid);

    ElMessage({
      message: res.msg || '发生错误，请稍后重试',
      type: 'warning',
    });
  }

  loading.close();

  //  .catch(error => {
  //     remove(fileList.value, z => z.uid == file.file.uid);

  //     loading.close();
  //     const currMsg =
  //       error && typeof error == "object"
  //         ? error.statusText || error.message || JSON.stringify(error)
  //         : error || "发生错误，请稍后重试！";
  //     ElMessage({
  //       message: currMsg,
  //       type: "warning"
  //     });
  //   });
};

const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles);
};

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};
</script>

<template>
  <!-- action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" -->
  <el-upload
    v-model:file-list="fileList"
    action="#"
    :http-request="uploadImg"
    :list-type="props?.listType"
    :multiple="props?.multiple"
    :limit="props?.limit"
    :accept="props?.accept"
    :before-upload="handleBeforeUpload"
    :on-preview="handlePictureCardPreview"
    :on-remove="handleRemove"
    :class="{ uoloadSty: isShowAddBtn, disUoloadSty: !isShowAddBtn }"
  >
    <!-- TODO:限制上传 v-if="fileList?.length < props?.limit"-->
    <el-icon><Plus /></el-icon>

    <template #tip>
      <div class="el-upload__tip" v-if="showTip">
        请上传
        <template v-if="fileSize">
          大小不超过
          <b class="text-amber-600">{{ fileSize }}MB</b>
        </template>
        <template v-if="fileTypeList">
          格式为
          <b class="text-amber-600">{{ fileTypeList.join('/') }}</b>
        </template>
        的文件；
      </div>
      <template v-if="reminderCont">
        <div>{{ reminderCont }}</div>
      </template>
    </template>
  </el-upload>

  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>

<style lang="scss">
.el-upload--picture-card {
  width: 100px;
  height: 100px;
}
.el-upload-list--picture-card .el-upload-list__item {
  width: 100px;
  height: 100px;
}

.uoloadSty .el-upload--picture-card {
  /* TODO: */
  display: block;
}
.disUoloadSty .el-upload--picture-card {
  display: none; /* 上传按钮隐藏 */
}
</style>

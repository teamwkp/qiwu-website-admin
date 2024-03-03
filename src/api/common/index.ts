import { http } from '@/utils/http';
/** 上传文件 */
export const postUploadOss = (data: any) => {
  return http.request<any>(
    'post',
    '/file/uploadOss',
    // '/file/uploadOss111',
    { data },
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );
};

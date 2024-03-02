import { http } from '@/utils/http';

// export const MultiLanguageConfigListApi = (data: any) => {
//   console.log('🚀 ~ MultiLanguageConfigListApi ~ data:', data);
//   return http.post<any, any>('/multiLanguageConfig/list', data);
// };
// 多语言配置列表
export const MultiLanguageConfigListApi = (data: any) => {
  return http.request<ResponseData<any>>('post', '/multiLanguageConfig/list', {
    data,
  });
};
// 新增多语言配置
export const MultiLanguageConfigAddApi = (data: any) => {
  return http.request<ResponseData<any>>('post', '/multiLanguageConfig/add', {
    data,
  });
};

// 编辑多语言配置
export const MultiLanguageConfigEditApi = (data: any) => {
  return http.request<ResponseData<any>>('post', '/multiLanguageConfig/edit', {
    data,
  });
};

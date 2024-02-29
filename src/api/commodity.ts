import { http } from '@/utils/http';

// export const ProductCategoryListApi = (params: any) => {
//   return http.request<any>(
//     'get',
//     '/product/category/list',
//     {
//       params,
//     },
//     // {
//     //   headers: { "Content-Type": "multipart/form-data" },
//     // }
//   );
// };

export const ProductCategoryListApi = (params: any) => {
  console.log('🚀 ~ ProductCategoryListApi ~ params:', params);
  return http.get<any, any>('/product/category/list', { params });
};

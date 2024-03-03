import { http } from '@/utils/http';

// export const ProductCategoryListApi = (params: any) => {
//   console.log('🚀 ~ ProductCategoryListApi ~ params:', params);
//   return http.get<any, any>('/product/category/list', { params });
// };

// 产品分类列表
export const ProductCategoryListApi = (data: any) => {
  return http.request<ResponseData<any>>('post', '/product/category/list', {
    data,
  });
};
// 新增产品分类
export const ProductCategoryAddCategoryApi = (data: any) => {
  return http.request<ResponseData<any>>('post', '/product/addCategory', {
    data,
  });
};
// 修改产品分类
export const ProductCategoryEditCategoryApi = (data: any) => {
  return http.request<ResponseData<any>>('post', '/product/editCategory', {
    data,
  });
};
// 删除产品分类
export const ProductCategoryDeleteCategoryApi = (data: any) => {
  return http.request<ResponseData<any>>('post', '/product/deleteCategory', {
    data,
  });
};
// 产品列表
export const ProductListApi = (data: any) => {
  return http.request<ResponseData<any>>('post', '/product/list', {
    data,
  });
};
// 新增产品
export const ProductAddApi = (data: any) => {
  return http.request<ResponseData<any>>('post', '/product/add', {
    data,
  });
};

// 修改产品
export const ProductEditApi = (data: any) => {
  return http.request<ResponseData<any>>('post', '/product/edit', {
    data,
  });
};
// 删除产品
export const ProductDeleteApi = (data: any) => {
  return http.request<ResponseData<any>>('post', '/product/delete', {
    data,
  });
};
// 产品详情
export const ProductDetailApi = (id: string) => {
  return http.request<ResponseData<any>>('get', `/product/detail/${id}`, {});
};

import Axios, { AxiosInstance, AxiosRequestConfig, CustomParamsSerializer } from 'axios';
import { PureHttpError, RequestMethods, PureHttpResponse, PureHttpRequestConfig } from './types.d';
import { stringify } from 'qs';
import NProgress from '../progress';
import { getToken, formatToken } from '@/utils/auth';
import { message } from '../message';
import { ElMessageBox } from 'element-plus';
import { router } from '@/router';
import { removeToken } from '@/utils/auth';
import { downloadByData } from '@pureadmin/utils';
// console.log("Utils:" + router);

const { VITE_APP_BASE_API } = import.meta.env;
// 相关配置请参考：www.axios-js.com/zh-cn/docs/#axios-request-config-1
const defaultConfig: AxiosRequestConfig = {
  // 请求超时时间
  timeout: 10000,
  // 后端请求地址
  // TODO:
  baseURL: VITE_APP_BASE_API,
  // baseURL: "http://47.97.111.46:9999",
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  // 数组格式参数序列化（https://github.com/axios/axios/issues/5142）
  paramsSerializer: {
    serialize: stringify as unknown as CustomParamsSerializer,
  },
};

class PureHttp {
  constructor() {
    this.httpInterceptorsRequest();
    this.httpInterceptorsResponse();
  }

  /** token过期后，暂存待执行的请求 */
  private static requests = [];

  /** 防止重复刷新token */
  private static isRefreshing = false;

  /** 初始化配置对象 */
  private static initConfig: PureHttpRequestConfig = {};

  /** 保存当前Axios实例对象 */
  private static axiosInstance: AxiosInstance = Axios.create(defaultConfig);

  /** 重连原始请求 */
  private static retryOriginalRequest(config: PureHttpRequestConfig) {
    return new Promise((resolve) => {
      PureHttp.requests.push((token: string) => {
        config.headers['Authorization'] = formatToken(token);
        // config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        resolve(config);
      });
    });
  }

  /** 请求拦截 */
  private httpInterceptorsRequest(): void {
    PureHttp.axiosInstance.interceptors.request.use(
      async (config: PureHttpRequestConfig): Promise<any> => {
        // 开启进度条动画
        NProgress.start();
        // 优先判断post/get等方法是否传入回调，否则执行初始化设置等回调
        if (typeof config.beforeRequestCallback === 'function') {
          config.beforeRequestCallback(config);
          return config;
        }
        if (PureHttp.initConfig.beforeRequestCallback) {
          PureHttp.initConfig.beforeRequestCallback(config);
          return config;
        }
        /** 请求白名单，放置一些不需要token的接口（通过设置请求白名单，防止token过期后再请求造成的死循环问题） */
        const whiteList = ['/refreshToken', '/login', '/captchaImage', '/getConfig'];
        return whiteList.some((v) => config.url.endsWith(v))
          ? config
          : new Promise((resolve) => {
              const data = getToken();
              config.headers['Authorization'] = formatToken(data.token);
              resolve(config);
            });
      },
      (error) => {
        return Promise.reject(error);
      },
    );
  }

  /** 响应拦截 */
  private httpInterceptorsResponse(): void {
    const instance = PureHttp.axiosInstance;
    instance.interceptors.response.use(
      async (response: PureHttpResponse) => {
        let code = undefined;
        let msg = undefined;

        // 后台返回的二进制流
        if (response.data instanceof Blob) {
          // 返回二进制流的时候 可能出错  这时候返回的错误是Json格式
          if (response.data.type === 'application/json') {
            const text = await this.readBlobAsText(response.data);
            const json = JSON.parse(text);
            // 提取错误消息中的code和msg
            code = json.code;
            msg = json.msg;
          } else {
            NProgress.done();
            return response.data;
          }
          // 正常的返回类型 直接获取code和msg字段
        } else {
          code = response.data.code;
          msg = response.data.msg;
        }

        // 如果不存在code说明后端格式有问题
        if (!code) {
          msg = '服务器返回数据结构有误';
        }

        // 请求返回失败时，有业务错误时，弹出错误提示
        if (response.data.code !== 0) {
          // token失效时弹出过期提示
          if (response.data.code === 106) {
            ElMessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
              confirmButtonText: '重新登录',
              cancelButtonText: '取消',
              type: 'warning',
            })
              .then(() => {
                removeToken();
                router.push('/login');
              })
              .catch(() => {
                message('取消重新登录', { type: 'info' });
              });
            NProgress.done();
            return Promise.reject(msg);
          } else {
            // 其余情况弹出错误提示框
            message(msg, { type: 'error' });
            NProgress.done();
            return Promise.reject(msg);
          }
        }

        const $config = response.config;
        // 关闭进度条动画
        NProgress.done();
        // 优先判断post/get等方法是否传入回调，否则执行初始化设置等回调
        if (typeof $config.beforeResponseCallback === 'function') {
          $config.beforeResponseCallback(response);
          return response.data;
        }
        if (PureHttp.initConfig.beforeResponseCallback) {
          PureHttp.initConfig.beforeResponseCallback(response);
          return response.data;
        }
        return response.data;
      },
      (error: PureHttpError) => {
        const $error = error;
        $error.isCancelRequest = Axios.isCancel($error);
        // 关闭进度条动画
        NProgress.done();
        // 所有的响应异常 区分来源为取消请求/非取消请求
        return Promise.reject($error);
      },
    );
  }

  /** 通用请求工具函数 */
  public request<T>(
    method: RequestMethods,
    url: string,
    param?: AxiosRequestConfig,
    axiosConfig?: PureHttpRequestConfig,
  ): Promise<T> {
    const config = {
      method,
      url,
      ...param,
      ...axiosConfig,
    } as PureHttpRequestConfig;

    // 单独处理自定义请求/响应回调
    return new Promise((resolve, reject) => {
      PureHttp.axiosInstance
        .request(config)
        .then((response: undefined) => {
          resolve(response);
        })
        .catch((error) => {
          // 某些情况网络失效，此时直接进入error流程，所以在这边也进行拦截
          if (error.response && error.response.status >= 500) {
            message('网络异常', { type: 'error' });
          }

          if (error.response && error.response.status >= 400 && error.response.status < 500) {
            message('请求接口不存在', { type: 'error' });
          }

          reject(error);
        });
    });
  }

  /** 从二进制流中读取文本 */
  async readBlobAsText(blob: Blob): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        resolve(text);
      };
      reader.onerror = reject;
      reader.readAsText(blob, 'UTF-8');
    });
  }

  /** 单独抽离的post工具函数 */
  public post<T, P>(url: string, params?: AxiosRequestConfig<T>, config?: PureHttpRequestConfig): Promise<P> {
    return this.request<P>('post', url, params, config);
  }

  /** 单独抽离的get工具函数 */
  public get<T, P>(
    url: string,
    params?: AxiosRequestConfig<T>,
    // data?: AxiosRequestConfig<T>,
    config?: PureHttpRequestConfig,
  ): Promise<P> {
    // console.log('🚀 ~ PureHttp ~ get:', data, config);
    return this.request<P>('get', url, { params }, config);
    // return this.request<P>('get', url, data, config);
  }

  /** download文件方法 从后端获取文件流 */
  public download(url: string, fileName: string, params?: AxiosRequestConfig): void {
    this.get(url, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      responseType: 'blob',
    }).then((data: Blob) => {
      downloadByData(data, fileName);
    });
  }

  // .post(url, params, {
  //   transformRequest: [params => encodeURIParams(params)],
  //   headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //   responseType: "blob"
  // })
  // .then(async data => {
  //   const isLogin = await isBlobData(data);
  //   if (isLogin) {
  //     const blob = new Blob([data]);
  //     saveAs(blob, filename);
  //   } else {
  //     const resText = await data.text();
  //     const rspObj = JSON.parse(resText);
  //     const errMsg =
  //       errorCode[rspObj.code] || rspObj.msg || errorCode.default;
  //     ElMessage.error(errMsg);
  //   }
  //   downloadLoadingInstance.close();
  // })
  // .catch(r => {
  //   console.error(r);
  //   ElMessage.error("下载文件出现错误，请联系管理员！");
  //   downloadLoadingInstance.close();
  // });

  // axios
  //   .get("https://pure-admin.github.io/pure-admin-doc/img/pure.png", {
  //     responseType: "blob"
  //   })
  //   .then(({ data }) => {
  //     downloadByData(data, "test-data.png");
  //   });
  // }
}

export const http = new PureHttp();

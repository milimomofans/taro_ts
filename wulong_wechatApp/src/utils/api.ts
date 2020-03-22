import { pick, assign, isEmpty } from "lodash";
import Taro from "@tarojs/taro";
import InterceptorManager, { forEach } from "./Interceptor";
// import API_CONFIG from "../service/api";
import request from "./request";

import { API_DEFAULT_CONFIG, MNP_REQUEST_DEFAULT_CONFIG } from "../config";
import API_CONFIG from "../service/api";
const _pick = pick;
const _assign = assign;
const _isEmpty = isEmpty;

console.log(API_CONFIG)

// import * as _pick from 'lodash/pick';
// import * as _assign from 'lodash/assign';
// import * as _isEmpty from 'lodash/isEmpty';

function assert(condition: any, msg: string): void {
  if (!condition) {
    throw new Error(`[Apior] ${msg}`);
  }
}

const REQUEST_BASEURL =
  "https://service-7953ps6i-1257188045.gz.apigw.tencentcs.com/release/v1/mnp";

const REDIRECT_PAGE = "/pages/me/me";

// const MOCK_BASE_URL = "https://yapi.qqmylife.com/mock";

// const API_DEFAULT_CONFIG = {
//   // mockBaseURL: 'http://mch.qqmylife.com/v1/mch',
//   mockBaseURL: MOCK_BASE_URL,
//   // mockBaseURL: 'https://tmock.qq.com',
//   mock: false,
//   debug: false,
//   sep: "/",
// };

class MakeApi {
  interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
  requestHandle;
  api: object;
  constructor(options: object) {
    this.api = {};
    this.apiBuilder(options);
  }

  apiBuilder({
    sep = "|",
    config = {},
    mock = false,
    debug = false,
    mockBaseURL = "",
    baseURL = REQUEST_BASEURL,
    redirectLoginPage = REDIRECT_PAGE
  }) {
    Object.keys(config).map(namespace => {
      this._apiSingleBuilder({
        namespace,
        mock,
        mockBaseURL,
        baseURL,
        redirectLoginPage,
        sep,
        debug,
        config: config[namespace]
      });
    });
  }

  /**
   *
   *
   * @param {*} {
   *     namespace,
   *     sep = "|",
   *     config = [],
   *     mock = false,
   *     debug = false,
   *     mockBaseURL = "",
   *     baseURL = REQUEST_BASEURL,
   *     redirectLoginPage = REDIRECT_PAGE,
   *   }
   * @memberof MakeApi
   */
  _apiSingleBuilder({
    namespace,
    sep = "|",
    config = [],
    mock = false,
    debug = false,
    mockBaseURL = "",
    baseURL = REQUEST_BASEURL,
    redirectLoginPage = REDIRECT_PAGE
  }) {
    config.forEach(api => {
      const {
        name,
        desc,
        params,
        method,
        mockEnable,
        path,
        mockPath,
        auth,
        absolute,
        dealLoginSelf,
        dealErrorSelf,
        limitParams = true
      } = api;
      const isMock: boolean =
        process.env.NODE_ENV === "production" ? false : mock || mockEnable;
      const url: string = isMock ? mockPath : path;
      baseURL = isMock ? mockBaseURL : baseURL;

      if (debug) {
        // debug 测试
        assert(name, `${url} :接口name属性不能为空`);
        assert(url.indexOf("/") === 0, `${url} :接口路径path，首字符应为/`);
      }
      const that = this;
      Object.defineProperty(this.api, `${namespace}${sep}${name}`, {
        value(outerParams: object, outerOptions: object): any {
          let dataV = {};
          if (_isEmpty(outerParams)) {
            dataV = params;
          } else if (limitParams) {
            dataV = _pick(
              _assign({}, params, outerParams),
              Object.keys(params)
            );
          } else {
            dataV = outerParams;
          }
          const optionsV = {
            url,
            desc,
            baseURL,
            redirectLoginPage,
            method,
            auth,
            absolute,
            dealLoginSelf,
            dealErrorSelf
          };
          const platformId = Taro.getStorageSync("platformId") || 894;
          const platformObj = { platform_id: platformId };
          return request(
            _normoalize(
              _assign(optionsV, outerOptions),
              Object.assign(dataV, platformObj)
            ),
            {
              beforeRequest: obj => {
                let canNext = true;
                // debugger; 断点测试 fail to do
                that.interceptors.request.forEach(handle => {
                  const result = handle.fulfilled(obj);
                  if (typeof result !== "undefined" && !result) {
                    canNext = false;
                  }
                });
                return canNext;
              },
              responseHandle: obj => {
                // debugger; 断点测试 fail to do
                let canNext = true;
                that.interceptors.response.forEach(handle => {
                  handle.fulfilled(obj);
                });
                return canNext;
              },
              responseErrorHandle: obj => {
                // debugger; 断点测试 fail to do
                let canNext = true;
                that.interceptors.response.forEach(handle => {
                  const result = handle.rejected(obj);
                  if (typeof result !== "undefined" && !result) {
                    canNext = false;
                  }
                });
                return canNext;
              }
            }
          );
        }
      });
    });
  }
}
// 可以在outerOption里传入需要传入路由中的值，默认为apiParams
function _normoalize(options, data) {
  // 添加直接在url上传参的逻辑
  const apiParams = options.apiParams;
  console.log(options)
  const url = options.url;
  options.url = generateUrl(url, apiParams);
  // 正常参数逻辑
  options.data = data;
  return options;
}

function generateUrl(url, params) {
  const reg = /:\w+/gi;
  if (reg.test(url)) {
    return url.replace(reg, value => {
      const key = value.substring(1);
      console.log(params)
      if (params[key]) {
        return params[key];
      } else {
        throw new Error("您的接口为动态接口，传入的参数中必须有与接口对应字段");
      }
    });
  }
  return url;
}

// 需要传入 baseURL redirectLoginPage config

// const ApiInstance: any = new MakeApi({
//   config: API_CONFIG,
//   ...API_DEFAULT_CONFIG,
//   baseURL,
//   redirectLoginPage,
// }).api;
const apiObj = new MakeApi({
  config: API_CONFIG,
  ...API_DEFAULT_CONFIG,
  baseURL: MNP_REQUEST_DEFAULT_CONFIG.baseURL,
  redirectLoginPage: REDIRECT_PAGE
});
apiObj.interceptors.request.use(obj => {
  console.log(obj);
});
apiObj.interceptors.response.use(
  obj => {
    obj.data.data = [];
    console.log(obj);
  },
  e => {
    console.log("this is error handle");
    console.error(e);
  }
);
const ApiInstance = apiObj.api;
export default ApiInstance;

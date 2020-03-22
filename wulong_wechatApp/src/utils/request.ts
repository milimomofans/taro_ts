import Taro from '@tarojs/taro'
import * as Qs from 'qs'
import { rejects } from 'assert'

// HTTP请求状态码
const HTTP_STATUS = {
  SUCCESS: 200,
  CLIENT_ERROR: 400,
  AUTHENTICATE: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
}

const taroDefaultRequest = {
  url: '',
  method: 'GET',
  dataType: 'json',
  responseType: 'text',
  header: {
    'content-type': 'application/json',
    Authorization: '',
    Accept: 'application/json',
  },
}

const packRequest = (
  newRequestObj: {
    url: string
    data: any
    method: 'GET' | 'OPTIONS' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT' | undefined
    header: any
    dealLoginSelf: boolean
    dealErrorSelf: boolean
  },
  interceptors: {
    beforeRequest: (requestObj: any) => boolean
    responseHandle: (response) => void
    responseErrorHandle: (error) => boolean
  }
) => {
  const { beforeRequest, responseHandle, responseErrorHandle } = interceptors
  const before = beforeRequest(newRequestObj)
  const canReq = typeof before === undefined || !!before
  if (!canReq) {
    return Promise.reject()
  }
  let response: any
  return Taro.request(newRequestObj)
    .then((resp: any) => {
      // handle HTTP_STATUS Code
      // console.log(resp)

      response = resp
      let errorMessage = ''
      let errorObj = { code: '', message: '' }
      switch (resp.statusCode) {
        case HTTP_STATUS.SUCCESS:
          if (typeof resp.data.code !== 'undefined') {
            switch (resp.data.code) {
              case 82401:
                // errorMessage = '登录过期'
                errorObj = { ...resp.data }
                // Raven.captureException('invalid session code ' + resp.data.code)
                break
              case 82402:
                errorObj = { ...resp.data }
                // Promise.reject({ code: 82402 })
                // Raven.captureException('invalid session id' + resp.data.code)
                break
              case 82403:
                errorObj = { ...resp.data }
                // Raven.captureException('decrypt data failed' + resp.data.code)
                break
              case 82404:
                errorObj = { ...resp.data }
                // Raven.captureException('invalid access id' + resp.data.code)
                break
              case 200:  //fail to do 后期需进行更改为0 该判断所有注释解除
                // 正常交互 不需要收集
                return Promise.resolve(resp.data.data)
                // responseHandle(resp)
                // return resp.data.data

              default:
                errorObj = { ...resp.data }
                
                // Raven.captureException('未定义后端错误')
                break
            }
          }
          // 外部地图接口
          if (resp.data.result) {
            return resp.data.result
          }
          // 拉取活动详情Json
          if (resp.data.act_id) {
            return resp.data
          }
          break
        case HTTP_STATUS.CLIENT_ERROR:
          errorMessage = '客户端错误'
          // Raven.captureException(errorMessage)
          break
        case HTTP_STATUS.AUTHENTICATE:
          errorMessage = '未登录'
          // Taro.removeStorageSync('token')
          // token 过期重新登录, 登录成功用back
          // if (newRequestObj.dealLoginSelf) {
          //   errorMessage = NOT_LOGIN_ERROR
          //   // return Promise.reject(NOT_LOGIN_ERROR)
          // }
          break
        case HTTP_STATUS.FORBIDDEN:
          errorMessage = '禁止请求'
          break
        case HTTP_STATUS.NOT_FOUND:
          errorMessage = '未发现服务, 请联系客服'
          console.error(newRequestObj, resp)
          break
        case HTTP_STATUS.SERVER_ERROR:
          errorMessage = '服务器问题, 请联系客服'
          console.error(newRequestObj, resp)
          break
        default:
          errorMessage = '未知问题，请联系客服'
          console.error(newRequestObj, resp)
          break
      }
      // 统一在catch中catch
      // Raven.captureException(errorMessage)
      if (errorMessage) {
        const goAhead = responseErrorHandle(response)
        if (typeof goAhead !== undefined && !goAhead) {
          return
        } // Raven.captureException({ requestError: e });
        // common error
        else {
          return Promise.reject(errorMessage)
        }
      } else if (errorObj.code) {
        const goAhead = responseErrorHandle(response)
        if (typeof goAhead !== undefined && !goAhead) {
          return
        } // Raven.captureException({ requestError: e });
        // common error
        else {
          // return Promise.resolve(errorObj)
          return Promise.reject(errorObj) //fail to do 后期发版本的时候取消注释
        }
      }
    })
    .catch((e: any): any => {
      console.log('newRequestObj', newRequestObj)
      console.log('response', response)
      console.error(e, 'requesterror')
      if (newRequestObj.dealErrorSelf) {
        return Promise.reject(e)
      } else if (typeof e === 'string') {
        // Taro.showToast({title:e, icon:'error'})
        return Promise.reject(e)
      } else if (e instanceof Object) {
        return Promise.reject(e.message)
      }

      // Raven.captureMessage(e)
    })
}

const request = (
  {
    baseURL,
    url,
    data,
    method,
    absolute = false,
    dealLoginSelf = false,
    dealErrorSelf = false,
  }: {
    baseURL: string
    redirectLoginPage: string
    url: string
    data: any
    method: 'GET' | 'OPTIONS' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT' | undefined
    auth: boolean
    absolute: boolean
    dealLoginSelf: boolean
    dealErrorSelf: boolean
  },
  interceptors: {
    beforeRequest: (params) => boolean
    requestErrorHandle: (params) => boolean
    responseHandle: (data) => void
    responseErrorHandle: (error) => boolean
  }
) => {
  const { beforeRequest, responseHandle, responseErrorHandle } = interceptors
  const path = absolute ? url : baseURL + url
  // const path = taroDefaultRequest.url + url
  const newRequestObj = {
    ...taroDefaultRequest,
    url: path,
    method,
    data,
    dealLoginSelf,
    dealErrorSelf,
  }
  // 序列化get参数到url
  if (method === 'GET') {
    const stringy = Qs.stringify(newRequestObj.data, {
      arrayFormat: 'brackets',
    })
    newRequestObj.url = `${newRequestObj.url}?${stringy}`
    newRequestObj.data = {}
  }
  return packRequest(newRequestObj, { beforeRequest, responseHandle, responseErrorHandle })
  // handle token
  // if (auth) {
  //   const res = Taro.getStorageSync(validateTokenName)
  //   if (!res && !dealLoginSelf) {
  //     Taro.reLaunch({ url: redirectLoginPage })
  //     throw new Error('没有token')
  //   } else {
  //     newRequestObj.header = {
  //       ...newRequestObj.header,
  //       Authorization: 'Bearer ' + res,
  //     }
  //     return packRequest(newRequestObj, redirectLoginPage, { beforeRequest, responseHandle, responseErrorHandle })
  //   }
  // } else {
  //   return packRequest(newRequestObj, redirectLoginPage, { beforeRequest, responseHandle, responseErrorHandle })
  // }
}

export default request

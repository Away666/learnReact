/**
 * 能发送异步ajax请求的函数模块
 * 封装axios库
 * 函数的返回值是promise对象
 *   优化1：统一处理请求一次？
 *      在外层抱一个自己创建的promise对象
 *      在请求出错时，不reject(error),而是显示错误提示
 *   优化2：异步得到不少response，而是response.data
 *      在请求成功resolve时：resolve(response.data)
 */

import axios from 'axios'
import { message } from 'antd'

export default function ajax(url, data = {}, type = 'GET') {
  return new Promise((resolve, reject) => {
    let promise
    if (type === 'GET') {
      promise = axios.get(url, { params: data })
    }
    else {
      promise = axios.post(url, data)
    }
    promise.then(response => {
      resolve(response.data)
    }).catch(error => {
      // reject(error)
      message.error('请求出错了:' + error.message)
    })
  })
}
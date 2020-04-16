/*
ajax 请求函数模块
*/
import axios from 'axios'
import { BASE_URL } from './config'
import { getOpenid,setStore } from '../utils/utils'
import { Toast } from 'vant'
import context from '../main'

let loadingTimer //loading定时器ID
let limitTime = 200

/**请求拦截器 */
axios.interceptors.request.use(config => {
  //检查是否完整的url，并进行拼接
  if(config.url.indexOf('http')==-1 && config.url.indexOf('https')==-1){
    config.url = BASE_URL + config.url
  }

  const token = getOpenid()

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }

  config.timeout = 10000 //设置超时时间（单位：毫秒）
  //清除上一个loading
  loadingTimer && clearTimeout(loadingTimer)
  //开启loading
  loadingTimer = setTimeout(() => {
    Toast.loading({
      forbidClick: true,
      duration: 0
    });
  }, limitTime)
  return config;
}, err => {
  return Promise.reject(err);
})
/**响应拦截器 */
axios.interceptors.response.use(response => {
  loadingTimer && clearTimeout(loadingTimer)
  Toast.clear()
  let data = response.data
  if (data.errorCode !== 0) {
    Toast(data.errorMessage)
  }
  return data;
}, err => {
  loadingTimer && clearTimeout(loadingTimer)
  Toast.clear()
  return Promise.reject(err);
})

/**
 * 向外部暴漏一个函数 ajax
 * @param {*} url 请求路径，默认为空
 * @param {*} data 请求参数，默认为空对象
 * @param {*} options 配置项：type->请求方法，默认为POST; isSubmit->是否提交操作
 */
export default function ajax(url = '', data = {}, options = {type:'POST', isSubmit:false}) {
  const { type, isSubmit } = options
  isSubmit && (limitTime = 0)
  // 返回值 Promise对象 （异步返回的数据是response.data，而不是response）
  return new Promise((resolve, reject) => {
    // （利用axios）异步执行ajax请求
    let promise // 这个内部的promise用来保存axios的返回值(promise对象)
    if (type === 'GET') {
      // 准备 url query 参数数据
      let dataStr = '' // 数据拼接字符串，将data连接到url
      Object.keys(data).forEach(key => {
        dataStr += key + '=' + data[key] + '&'
      })
      if (dataStr !== '') {
        dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'))
        url = url + '?' + dataStr
      }
      // 发送 get 请求
      promise = axios.get(url)
    } else {
      // 发送 post 请求
      promise = axios.post(url, data)
    }
    promise.then(response => {
      
      if (response.errorCode !== 0) {
        reject(response.errorCode)
      } else {
        // 成功回调resolve()
        resolve(response.data)
      }
    }).catch(error => {
      // 失败回调reject()
      reject(error)
    })
  })
}

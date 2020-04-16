// 导入所有接口
import apiList from './interface'
import oauth from './oauth';

const api = Vue => {
  if (api.installed) { return; }
  api.installed = true;

  Object.defineProperties(Vue.prototype, {
    // 注意哦，此处挂载在 Vue 原型的 $api 对象上
    $api: {
      get() {
        return {...apiList, ...oauth}
      }
    }
  })
}

export default api
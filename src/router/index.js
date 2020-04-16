import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from '../router/home'// 路由数组文件引入

Vue.use(VueRouter)

//路由模式
const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
  //当切换到新路由时，页面滚到顶部，或者是保持原先的滚动位置
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {
        x: 0,
        y: 0
      }
    }
  }
})

/* 路由发生变化修改页面title */
// router.beforeEach((to, from, next) => {
//   const title = to.meta.title;
//   if (title) {
//     document.title = typeof title === "function" ? title(to, from) : title;
//   }
//   next();
// });

export default router

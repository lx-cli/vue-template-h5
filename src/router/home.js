const OAuth = () => import('../views/OAuth.vue')
const Home = () => import('../views/Home.vue')

export default [
  /************** 授权 **************/
  {
    path: '/oauth',
    name: 'oauth',
    meta: {
      title: '授权'
    },
    component: OAuth
  },
  /**设置跟路由 */
  {
    path: '/(null)?',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  }
];

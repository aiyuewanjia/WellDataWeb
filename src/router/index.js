import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Cockpit from '../components/Cockpit.vue' 
import User from '../components/User.vue'
import WellData from '../components/WellData.vue'
import Device from '../components/DeviceManagement/Device.vue'
import DataCharts from '../components/DeviceManagement/DataCharts.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/cockpit',
    children: [
      { path: '/cockpit', component: Cockpit },
      { path: '/user', component: User },
      { path: '/welldata', component: WellData },
      { path: '/device', component: Device },
      { path: '/datacharts', component: DataCharts,meta:{keepAlive: false} }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
//*
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  //     next()  放行    next('/login')  强制跳转
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
//*/
export default router

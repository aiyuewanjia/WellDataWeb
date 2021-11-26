import {createApp} from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
// 导入全局样式表
import './assets/css/globle.css'
import * as echarts from 'echarts'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import qs from 'qs'
import dataV from '@jiaminghi/data-view'

axios.defaults.baseURL = 'http://47.104.190.136:8010/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
const app = createApp(App)
app.config.globalProperties.$http = axios
app.config.globalProperties.$echarts = echarts
//app.component("Ruler",{template:Ruler})
app.use(router)
app.use(ElementPlus)
app.use(echarts)
app.use(qs)
app.use(dataV)
app.mount('#app')
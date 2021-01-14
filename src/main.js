import Vue from 'vue'
import App from './App.vue'
import store from './store'


Vue.config.productionTip = false


// 这里传递给Vue的store会出现在vue实例的$options属性里，this.$options.store
new Vue({
  render: h => h(App),
  store
}).$mount('#app')

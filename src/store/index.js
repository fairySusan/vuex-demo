import Vue from 'vue'
import Vuex from '../vuex';

Vue.use(Vuex) // 一定要在new Vuex.Store 之前使用
const store = new Vuex.Store({
  state: {
    name: 'susan',
    age:  24
  },
  getter: {
    fullName: (state) => {
      return 'fairy' + state.name
    }
  },
  mutations: {
    changeAge: (state, payload) => {
      state.age = payload
    }
  },
  actions: {
    syncChangeAge: (context, payload) =>  {
      setTimeout(() => {
        context.commit('changeAge', payload)
      }, 1000)
    }
  }
})
export default store
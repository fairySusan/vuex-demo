import { reject, resolve } from "core-js/fn/promise";

let Vue;
const install = (_Vue) => {
  Vue = _Vue;
  Vue.mixin({
    beforeCreate() {
      const {store = ''} = this.$options;

      if (store) {
        this.$store = store; // 通过这一步，App.vue文件里可以通过this.$store来访问store实例了
      } else {
        this.$store = this.$parent && this.$parent.$store; // 通过这一步，App组件的所有子组件都可以访问this.$store
      }
    }
  })
}

class Store {
  constructor(options) {
    const { state = {}, getters = {}, mutations = {}, actions = {} } = options;
    // 通过这一步就把state对象变成了响应式对象
    this._state = new Vue({
      data: {
        state: state
      }
    });

    this.getters = {};
    this.mutations = {};
    this.actions = {};

    this.boundGetters(getters);
    this.boundMutations(mutations);
    this.boundActions(actions);
  }

  get state() {
    return this._state.state
  }

  // getter 属性的处理
  boundGetters (getters) {
    Object.keys(getters).forEach(getterName => {
      Object.defineProperty(this.getters, getterName, {
        get: () => {
          return getters[getterName](this.state)
        }
      })
    })
  }

  boundMutations (mutations) {
    Object.keys(mutations).forEach(mutationName => {
      const mutation = mutations[mutationName];
      // 现在等待this.$store.commit()来触发this.mutations里函数的执行
      this.mutations[mutationName] = payload => {
        mutation(this.state, payload)
      }
    })
  }

  // 现在可以在组件中通过this.$store.commit(xxx,xxx)来触发mutation了
  commit (mutationName, payload) {
    this.mutations[mutationName](payload)
  }

  boundActions (actions) {
    Object.keys(actions).forEach(actionName => {
      const action = actions[actionName];
      this.actions[actionName] = async payload => {
        // 注意这里传this, 因为actions里的函数第一个参数是context，也是为了便于在action里调用mutation：context.commit()
        const result = await action(this, payload)
        return result
      }
    })
  }

  dispatch (actionName, payload) {
    // result 是一个promise对象
    const result = this.actions[actionName, payload]

    return new Promise((resolve, reject) => {
      result.then((value) => {
        resolve(value)
      }, (error) => {
        reject(error)
      })
    })
  }
}

export default { install, Store }
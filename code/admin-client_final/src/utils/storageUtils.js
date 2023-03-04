/**
 * 进行local数据存储管理的工具模块
 */
import store from 'store'
export default {
  saveUser(user) {
    // localStorage.setItem('user_key', JSON.stringify(user))
    store.set('user_key',user)
  },
  getUser() {
    // return JSON.parse(localStorage.getItem('user_key') || '{}')
    return store.get('user_key') || {}
  },
  removeUser() {
    // localStorage.removeItem('user_key')
    store.remove('user_key')
  }
}
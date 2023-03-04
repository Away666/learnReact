/**
 * 包含应用中所有接口请求函数的模块
 * 每个函数的返回值都是promise
 */

import ajax from './ajax'
import jsonp from 'jsonp'

const BASE = ''

export const reqLogin = (username, password) => ajax(BASE + '/login', { username, password }, 'POST')


// 获取一级/二级分类的列表
export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/list', { parentId })

export const reqAddCategory = (categoryName, parentId) => ajax(BASE + '/manage/category/add', { categoryName, parentId }, 'POST')

export const reqUpdateCategory = ({ categoryId, categoryName }) => ajax(BASE + '/manage/category/update', { categoryId, categoryName }, 'POST')

export const reqDeleteCategory = (categoryId) => ajax(BASE + '/manage/category/delete', { categoryId }, 'POST')

// 获取一个分类
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', { categoryId })

// 获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', { pageNum, pageSize })

// 搜索商品分页列表
export const reqSearchProducts = ({ pageNum, pageSize, searchName, searchType }) => ajax(BASE + '/manage/product/search',
  { pageNum, pageSize, [searchType]: searchName })

// 商品上架/下架
export const reqUpdateStatus = (productId, status) => ajax(BASE + '/manage/product/updateStatus', { productId, status }, 'POST')

// 删除图片
export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete', { name }, 'POST')

// 添加/修改商品
export const reqAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST')

export const reqDeleteProduct = (productId) => ajax(BASE + '/manage/product/delete', { productId }, 'POST')


// 获取所有角色的列表
export const reqRoles = () => ajax(BASE + '/manage/role/list')

// 添加角色
export const reqAddRole = (roleName) => ajax(BASE + '/manage/role/add', { roleName }, 'POST')

export const reqUpdateRole = (role) => ajax(BASE + '/manage/role/update', role, 'POST')

// 获取所有用户的列表
export const reqUsers = () => ajax(BASE + '/manage/user/list')

// 添加用户
export const reqAddOrUpdateUser = (user) => ajax(BASE + '/manage/user/'+(user._id?'update':'add'), user , 'POST')

// 删除用户
export const reqDeleteUser = (userId) => ajax(BASE + '/manage/user/delete', { userId }, 'POST')

/**
 * jsonp解决ajax跨域的原理
 *    jsonp只能觉接GET类型的ajax请求跨域问题
 *    jsonp请求不是ajax请求，而是一般的get请求
 *    基本原理
 *  浏览器端：
 *    动态生成<script>来请求后台接口(src就是接口的url)
 *    定义好用于接收响应数据的函数(fn)，并将函数名通过请求参数提交给后台(如：callback=fn)
 *  服务器端：
 *    接收到请求处理产生结果数据后，返回一个函数调用的js代码，并将结果数据作为实参传入函数调用
 *  浏览器端：
 *    收到响应自动执行函数调用的js代码，也就执行了提前定义好的回调函数，并得到了需要的结果数据
 */
export const reqWeather = (city) => {
  // 百度天气预报接口已废除
  const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=YkukGK9XS3C4TKQUnOa6E6zbznUxqLyq`
  jsonp(url, {}, (err, data) => {
    console.log('jsonp()', err, data);
  })
}
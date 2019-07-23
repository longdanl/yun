import request from '../utils/request'
//登录
export function login(data) {
  return request({
    url: '/api/login',
    method: 'post',
    auth:{username:"omc",password:"xinyun"},
    data
  });
}
//登出
export function logout(data) {
  return request({
    url: '/api/oauth/token?'+data,
    method: 'delete',
    auth:{username:"omc",password:"xinyun"},
  })
}
//修改密码
export function updatePwd(data) {
  return request({
    url: '/api/users/current/password',
    method: 'put',
    data
  })
}
//修改密码
export function userDetail(data) {
  return request({
    url: '/api/authority',
    method: 'get',
    data
  })
}
export function settingUser(data) {
  return request({
    url: '/api/users/current',
    method: 'put',
    data
  })
}

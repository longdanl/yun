import request from '@/utils/request'
//获取用户(分页)
export function getUsers(data) {
    return request({
        url: '/api/users?'+data,
        method: 'get'
    })
}
//根据id获取用户详情
export function getUsersById(userId) {
    return request({
        url: '/api/users/' + userId,
        method: 'get'
    })
}
//查询用户信息
export function getUsersByName(data) {
    return request({
        url: '/api/users?search='+ data,
        method: 'get'
    })
}
//添加用户
export function addUsers(data) {
    return request({
        url: '/api/users',
        method: 'post',
        data
    })
}
//修改用户信息
export function updateUsers(id,data) {
    return request({
        url:'/api/users/'+id,
        method: 'put',
        data: data
    })
}
//删除用户,双括号是人家后台角度认为的变量
export function deleteUsers(id) {
    return request({
        url: '/api/users/'+id,
        method: 'delete'
    })
}

//批量删除用户（传参为ids数组）
export function deleteUsersBatch(ids) {
    return request({
        url: '/api/users/delete',
        method: 'post',
        data: ids
    })
}
//用户排序
export function sortById(data) {
    return request({
        url:'/api/users?sort=id'+' '+data,
        method: 'get',
    })
}
//用户排序
export function sortBy(type,data) {
    return request({
        url:'/api/users?sort='+type+' '+data,
        method: 'get',
    })
}


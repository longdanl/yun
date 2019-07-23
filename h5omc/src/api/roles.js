import request from '@/utils/request'
//添加角色
export function addRoles(data) {
    return request({
        url: '/api/roles',
        method: 'post',
        data
    })
}
//修改角色信息
export function editRole(id,data) {
    return request({
        url:'/api/roles/'+id,
        method: 'put',
        data: data
    })
}
//删除角色,双括号是人家后台角度认为的变量
export function deleteRoles(id) {
    return request({
        url: '/api/roles/'+id,
        method: 'delete'
    })
}

//批量删除角色（传参为ids数组）
export function deleteRolesBatch(ids) {
    return request({
        url: '/api/roles/delete',
        method: 'post',
        data: ids
    })
}
//查询
export function getRolesByName(data) {
    return request({
        url: '/api/roles?search='+data,
        method: 'get',
    })
}
//获取角色(分页)
export function getRolesList(data) {
    return request({
        url: '/api/roles?'+data,
        method: 'get'
    })
}
export function getRolesLists() {
    return request({
        url: '/api/roles?page_size=999',
        method: 'get'
    })
}
export function sortBy(num,limit,type,data) {
    return request({
        url:'/api/roles?page='+num+'&page_size='+limit+'&sort='+type+' '+data,
        method: 'get',
    })
}